import 'server-only';

import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import initialData from '@/data/initial-landings.json';
import { getService } from '@/data/services';
import type { Landing, LandingInput } from '@/lib/domain';
import { repairGeneratedObjectParticle } from '@/lib/korean-particles';
import { decodeUrlSegment } from '@/lib/url-segment';
import { getRegionRecord, getServiceRecord } from '@/lib/catalog-store';
import {
  assertNoAutomaticSemanticDuplicate,
  assertNoDuplicate,
  LandingValidationError,
  normalizeLandingInput,
  resolveLandingSlug,
  validateLandingInput,
} from '@/lib/landing-validation';

const initialLandings = initialData as Landing[];
const storeName = 'j-complex-logistics-content';

function hydrateLanding(landing: Landing): Landing {
  const bundledService = getService(landing.serviceId);
  return {
    ...landing,
    bodyTopImages: landing.bodyTopImages || [],
    summary: bundledService
      ? repairGeneratedObjectParticle(landing.summary, bundledService.name)
      : landing.summary,
  };
}

function contentStore() {
  return getStore({ name: storeName, consistency: 'strong' });
}

function slugIndexKey(slug: string) {
  return `landing-slugs/${encodeURIComponent(slug)}.json`;
}

function mutationKey(id: string) {
  return `landing-mutations/${id}.json`;
}

async function acquireLandingMutation(
  store: ReturnType<typeof contentStore>,
  id: string,
) {
  const claim = await store.setJSON(
    mutationKey(id),
    { startedAt: new Date().toISOString() },
    { onlyIfNew: true },
  );
  if (!claim.modified)
    throw new LandingValidationError(
      '이 랜딩페이지는 다른 관리자 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.',
      'id',
      undefined,
      409,
    );
  return async () => store.delete(mutationKey(id));
}

async function getOverrides(failOnStorageError = false): Promise<Landing[]> {
  try {
    const store = contentStore();
    const { blobs } = await store.list({ prefix: 'landings/' });
    const records = await Promise.all(
      blobs.map(
        (blob) =>
          store.get(blob.key, { type: 'json' }) as Promise<Landing | null>,
      ),
    );
    return records
      .filter((record): record is Landing => Boolean(record))
      .map(hydrateLanding);
  } catch (error) {
    if (failOnStorageError) throw error;
    if (process.env.NODE_ENV !== 'production')
      console.warn(
        'Netlify Blobs unavailable; using bundled landing data.',
        error,
      );
    return [];
  }
}

export async function listLandings(
  options: {
    includeArchived?: boolean;
    publishedOnly?: boolean;
    failOnStorageError?: boolean;
  } = {},
) {
  const overrides = await getOverrides(options.failOnStorageError);
  const byId = new Map(
    initialLandings.map((landing) => [landing.id, hydrateLanding(landing)]),
  );
  for (const landing of overrides) byId.set(landing.id, landing);
  let records = [...byId.values()];
  if (!options.includeArchived)
    records = records.filter((item) => item.status !== 'ARCHIVED');
  if (options.publishedOnly)
    records = records.filter((item) => item.status === 'PUBLISHED');
  return records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getLandingById(id: string) {
  try {
    const override = (await contentStore().get(`landings/${id}.json`, {
      type: 'json',
    })) as Landing | null;
    if (override) return hydrateLanding(override);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production')
      console.warn(`Netlify Blobs unavailable for landing ${id}.`, error);
  }
  const initial = initialLandings.find((item) => item.id === id);
  if (initial) return hydrateLanding(initial);
  return (
    (await listLandings({ includeArchived: true })).find(
      (item) => item.id === id,
    ) ?? null
  );
}

export async function getLandingBySlug(
  slug: string,
  includeUnpublished = false,
) {
  const normalizedSlug = decodeUrlSegment(slug);
  if (normalizedSlug === null) return null;
  try {
    const index = (await contentStore().get(slugIndexKey(normalizedSlug), {
      type: 'json',
    })) as { id?: string } | null;
    if (index?.id) {
      const landing = await getLandingById(index.id);
      if (
        landing &&
        landing.slug === normalizedSlug &&
        (includeUnpublished || landing.status === 'PUBLISHED')
      )
        return landing;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production')
      console.warn(
        `Netlify Blobs unavailable for slug ${normalizedSlug}.`,
        error,
      );
  }
  const records = await listLandings({
    includeArchived: includeUnpublished,
    publishedOnly: !includeUnpublished,
  });
  return records.find((item) => item.slug === normalizedSlug) ?? null;
}

export async function saveLanding(rawInput: LandingInput): Promise<Landing> {
  const existing = await listLandings({
    includeArchived: true,
    failOnStorageError: true,
  });
  const previous = rawInput.id
    ? existing.find((item) => item.id === rawInput.id)
    : null;
  const region = await getRegionRecord(rawInput.regionId);
  const service = await getServiceRecord(rawInput.serviceId);
  const destinationRegion = rawInput.destinationRegionId
    ? await getRegionRecord(rawInput.destinationRegionId)
    : null;
  if (!region)
    throw new LandingValidationError(
      '선택한 지역을 찾을 수 없습니다.',
      'regionId',
    );
  if (!service)
    throw new LandingValidationError(
      '선택한 서비스를 찾을 수 없습니다.',
      'serviceId',
    );
  if (rawInput.destinationRegionId && !destinationRegion)
    throw new LandingValidationError(
      '선택한 도착 지역을 찾을 수 없습니다.',
      'destinationRegionId',
    );
  if (destinationRegion?.id === region.id)
    throw new LandingValidationError(
      '출발 지역과 도착 지역은 서로 달라야 합니다.',
      'destinationRegionId',
    );
  const input = normalizeLandingInput({
    ...rawInput,
    destinationRegionId: destinationRegion?.id || null,
    // A new landing without a manually entered URL uses its representative
    // keyword, never the broad region/service pair. Existing records keep
    // their URL unless an administrator explicitly changes it.
    slug: resolveLandingSlug(
      rawInput.slug,
      rawInput.primaryKeyword,
      previous?.slug,
    ),
    bodyTopImages: rawInput.bodyTopImages || [],
  });
  validateLandingInput(input);
  assertNoAutomaticSemanticDuplicate(input, existing, rawInput.slug);
  assertNoDuplicate(input, existing);
  const now = new Date().toISOString();
  const record: Landing = {
    ...input,
    id: input.id || randomUUID(),
    createdAt: previous?.createdAt || now,
    updatedAt: now,
    publishedAt:
      input.status === 'PUBLISHED' ? previous?.publishedAt || now : null,
  };
  const store = contentStore();
  const releaseMutation = previous
    ? await acquireLandingMutation(store, previous.id)
    : null;
  try {
    // A concurrent DELETE may have completed after the initial list read. Do
    // not let this stale edit recreate a customer-created record.
    if (
      previous &&
      !initialLandings.some((landing) => landing.id === previous.id) &&
      !(await store.get(`landings/${previous.id}.json`, { type: 'json' }))
    )
      throw new LandingValidationError(
        '삭제된 랜딩페이지는 저장할 수 없습니다. 목록을 새로고침해주세요.',
        'id',
        undefined,
        409,
      );
    // Claim the normalized URL before writing the record. A preflight list alone
    // cannot prevent two simultaneous creates from overwriting the slug index.
    const claim = await store.setJSON(
      slugIndexKey(record.slug),
      { id: record.id },
      { onlyIfNew: true },
    );
    if (!claim.modified) {
      const owner = (await store.get(slugIndexKey(record.slug), {
        type: 'json',
      })) as { id?: string } | null;
      if (owner?.id !== record.id)
        throw new LandingValidationError(
          '동일한 URL이 이미 존재하거나 저장 중입니다. 다른 URL을 입력해주세요.',
          'slug',
          existing.find((item) => item.id === owner?.id),
          409,
        );
    }
    // Blobs has no multi-key transaction. If the following write fails, retain
    // the reservation rather than risk deleting a successfully committed claim
    // after an ambiguous network failure. Recovery needs an explicit inspection.
    await store.setJSON(`landings/${record.id}.json`, record);
    if (previous?.slug && previous.slug !== record.slug)
      await store.delete(slugIndexKey(previous.slug));
    return record;
  } finally {
    if (releaseMutation) await releaseMutation();
  }
}

/**
 * Permanently removes only a landing created in the operational store.
 * Bundled initial pages remain source-controlled fallback content, so those
 * must use the reversible ARCHIVED status instead of a destructive delete.
 */
export async function deleteCustomerLanding(id: string): Promise<Landing | null> {
  if (initialLandings.some((landing) => landing.id === id))
    throw new LandingValidationError(
      '초기 랜딩페이지는 영구 삭제할 수 없습니다. 보관을 사용해주세요.',
      'id',
      undefined,
      409,
    );

  const store = contentStore();
  const releaseMutation = await acquireLandingMutation(store, id);
  try {
    const key = `landings/${id}.json`;
    const landing = (await store.get(key, { type: 'json' })) as Landing | null;
    if (!landing) return null;

    // Remove the record first. If index cleanup has an ambiguous failure, keep
    // the stale URL reservation rather than risking a later create overwriting
    // data that might still exist in storage.
    await store.delete(key);
    const indexKey = slugIndexKey(landing.slug);
    const owner = (await store.get(indexKey, {
      type: 'json',
    })) as { id?: string } | null;
    if (owner?.id === id) await store.delete(indexKey);
    return hydrateLanding(landing);
  } finally {
    await releaseMutation();
  }
}

export function getInitialLandings() {
  return initialLandings.map(hydrateLanding);
}
