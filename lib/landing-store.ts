import 'server-only';

import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import initialData from '@/data/initial-landings.json';
import type { Landing, LandingInput } from '@/lib/domain';
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

async function getOverrides(): Promise<Landing[]> {
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
    if (process.env.NODE_ENV !== 'production')
      console.warn(
        'Netlify Blobs unavailable; using bundled landing data.',
        error,
      );
    return [];
  }
}

export async function listLandings(
  options: { includeArchived?: boolean; publishedOnly?: boolean } = {},
) {
  const overrides = await getOverrides();
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
  try {
    const index = (await contentStore().get(slugIndexKey(slug), {
      type: 'json',
    })) as { id?: string } | null;
    if (index?.id) {
      const landing = await getLandingById(index.id);
      if (
        landing &&
        landing.slug === slug &&
        (includeUnpublished || landing.status === 'PUBLISHED')
      )
        return landing;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production')
      console.warn(`Netlify Blobs unavailable for slug ${slug}.`, error);
  }
  const records = await listLandings({
    includeArchived: includeUnpublished,
    publishedOnly: !includeUnpublished,
  });
  return records.find((item) => item.slug === slug) ?? null;
}

export async function saveLanding(rawInput: LandingInput): Promise<Landing> {
  const existing = await listLandings({ includeArchived: true });
  const previous = rawInput.id
    ? existing.find((item) => item.id === rawInput.id)
    : null;
  const region = await getRegionRecord(rawInput.regionId);
  const service = await getServiceRecord(rawInput.serviceId);
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
  const input = normalizeLandingInput({
    ...rawInput,
    slug:
      rawInput.slug?.trim() ||
      previous?.slug ||
      rawInput.primaryKeyword?.trim() ||
      `${region.name} ${service.name}` ||
      rawInput.title,
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
  await contentStore().setJSON(`landings/${record.id}.json`, record);
  await contentStore().setJSON(slugIndexKey(record.slug), { id: record.id });
  if (previous?.slug && previous.slug !== record.slug)
    await contentStore().delete(slugIndexKey(previous.slug));
  return record;
}

export function getInitialLandings() {
  return initialLandings.map(hydrateLanding);
}
