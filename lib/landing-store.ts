import 'server-only';

import { getDeployStore, getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import initialData from '@/data/initial-landings.json';
import type { Landing, LandingInput } from '@/lib/domain';
import { assertNoDuplicate, normalizeLandingInput, validateLandingInput } from '@/lib/landing-validation';

const initialLandings = initialData as Landing[];
const storeName = 'j-complex-logistics-content';

function contentStore() {
  return process.env.CONTEXT === 'production'
    ? getStore(storeName, { consistency: 'strong' })
    : getDeployStore(storeName);
}

async function getOverrides(): Promise<Landing[]> {
  try {
    const store = contentStore();
    const { blobs } = await store.list({ prefix: 'landings/' });
    const records = await Promise.all(blobs.map((blob) => store.get(blob.key, { type: 'json' }) as Promise<Landing | null>));
    return records.filter((record): record is Landing => Boolean(record));
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.warn('Netlify Blobs unavailable; using bundled landing data.', error);
    return [];
  }
}

export async function listLandings(options: { includeArchived?: boolean; publishedOnly?: boolean } = {}) {
  const overrides = await getOverrides();
  const byId = new Map(initialLandings.map((landing) => [landing.id, landing]));
  for (const landing of overrides) byId.set(landing.id, landing);
  let records = [...byId.values()];
  if (!options.includeArchived) records = records.filter((item) => item.status !== 'ARCHIVED');
  if (options.publishedOnly) records = records.filter((item) => item.status === 'PUBLISHED');
  return records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getLandingById(id: string) {
  return (await listLandings({ includeArchived: true })).find((item) => item.id === id) ?? null;
}

export async function getLandingBySlug(slug: string, includeUnpublished = false) {
  const records = await listLandings({ includeArchived: includeUnpublished, publishedOnly: !includeUnpublished });
  return records.find((item) => item.slug === slug) ?? null;
}

export async function saveLanding(rawInput: LandingInput): Promise<Landing> {
  const input = normalizeLandingInput(rawInput);
  validateLandingInput(input);
  const existing = await listLandings({ includeArchived: true });
  assertNoDuplicate(input, existing);
  const previous = input.id ? existing.find((item) => item.id === input.id) : null;
  const now = new Date().toISOString();
  const record: Landing = {
    ...input,
    id: input.id || randomUUID(),
    createdAt: previous?.createdAt || now,
    updatedAt: now,
    publishedAt: input.status === 'PUBLISHED' ? previous?.publishedAt || now : null,
  };
  await contentStore().setJSON(`landings/${record.id}.json`, record);
  return record;
}

export function getInitialLandings() {
  return initialLandings;
}
