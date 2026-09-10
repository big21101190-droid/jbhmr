import 'server-only';

import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import initialData from '@/data/initial-landings.json';
import type { Landing, LandingInput } from '@/lib/domain';
import { decodeUrlSegment } from '@/lib/url-segment';
import { getRegionRecord, getServiceRecord } from '@/lib/catalog-store';
import {
  assertNoDuplicate,
  LandingValidationError,
  normalizeLandingInput,
  validateLandingInput,
} from '@/lib/landing-validation';

const initialLandings = initialData as Landing[];
const storeName = 'j-complex-logistics-content';

function hydrateLanding(landing: Landing): Landing {
  return { ...landing, bodyTopImages: landing.bodyTopImages || [] };
}

function contentStore() {
  return getStore({ name: storeName, consistency: 'strong' });
}

function slugIndexKey(slug: string) {
  return `landing-slugs/${encodeURIComponent(slug)}.json`;
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
    slug:
      rawInput.slug?.trim() ||
      previous?.slug ||
      (destinationRegion
        ? `${region.slug}-${destinationRegion.slug}-${service.slug}`
        : `${region.slug}-${service.slug}`),
    bodyTopImages: rawInput.bodyTopImages || [],
  });
  validateLandingInput(input);
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
}

export function getInitialLandings() {
  return initialLandings.map(hydrateLanding);
}
