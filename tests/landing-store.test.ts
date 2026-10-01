import { beforeEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({
  entries: new Map<string, unknown>(),
  failList: false,
  failRecord: false,
}));
vi.mock('server-only', () => ({}));
vi.mock('@netlify/blobs', () => ({
  getStore: () => ({
    async list({ prefix }: { prefix: string }) {
      if (state.failList) throw new Error('storage unavailable');
      return {
        blobs: [...state.entries.keys()]
          .filter((key) => key.startsWith(prefix))
          .map((key) => ({ key })),
      };
    },
    async get(key: string) {
      return structuredClone(state.entries.get(key) ?? null);
    },
    async setJSON(
      key: string,
      value: unknown,
      options?: { onlyIfNew?: boolean },
    ) {
      if (state.failRecord && key.startsWith('landings/'))
        throw new Error('record write failed');
      if (options?.onlyIfNew && state.entries.has(key))
        return { modified: false };
      state.entries.set(key, structuredClone(value));
      return { modified: true, etag: 'mock-etag' };
    },
    async delete(key: string) {
      state.entries.delete(key);
    },
  }),
}));
import { createLandingDefaults } from '@/lib/landing-defaults';
import { refreshLandingDefaultsFor } from '@/lib/landing-defaults';
import { regions } from '@/data/regions';
import { services } from '@/data/services';
import {
  getLandingById,
  getLandingBySlug,
  getInitialLandings,
  listLandings,
  saveLanding,
} from '@/lib/landing-store';

describe('Blobs landing storage (isolated adapter)', () => {
  beforeEach(() => {
    state.entries.clear();
    state.failList = false;
    state.failRecord = false;
  });
  const draft = (slug: string) => ({
    ...createLandingDefaults('seoul', 'express-bus', undefined, 'busan'),
    slug,
  });

  it.each(['INDEX', 'NOINDEX'] as const)(
    'preserves existing %s operational settings through autofill/save/reopen',
    async (indexPolicy) => {
      const before = await saveLanding({
        ...draft('qa-preserved'),
        status: 'PUBLISHED',
        indexPolicy,
        canonical: 'https://example.com/kept',
        redirectTo: '/delivery/redirect-kept',
        heroImage: '/custom-hero.png',
        ogImage: '/custom-og.png',
        bodyTopImages: [
          { url: '/one.png', alt: '첫째', storageKey: 'uploads/one.png' },
          { url: '/two.png', alt: '둘째' },
        ],
        relatedRegions: ['busan'],
        relatedServices: ['express-bus'],
      });
      const refreshed = refreshLandingDefaultsFor(
        before,
        regions.find((x) => x.id === 'daegu-dong')!,
        services.find((x) => x.id === 'ktx')!,
      );
      await saveLanding(refreshed);
      const after = await getLandingById(before.id);
      for (const key of [
        'id',
        'slug',
        'primaryKeyword',
        'indexPolicy',
        'canonical',
        'redirectTo',
        'status',
        'heroImage',
        'ogImage',
        'bodyTopImages',
        'relatedRegions',
        'relatedServices',
        'createdAt',
        'publishedAt',
      ] as const)
        expect(after?.[key], key).toEqual(before[key]);
      expect(after?.ctaLink).toBe('tel:0539552005');
      expect(after?.serviceId).toBe('ktx');
    },
  );
  it('saves and reopens two published records with the same combination and keyword', async () => {
    const a = await saveLanding({
      ...draft('qa-topic-a'),
      status: 'PUBLISHED',
    });
    const b = await saveLanding({
      ...draft('qa-topic-b'),
      title: '두 번째 주제',
      status: 'PUBLISHED',
    });
    expect(a.id).not.toBe(b.id);
    expect(await getLandingBySlug(a.slug)).toEqual(a);
    expect(await getLandingById(b.id)).toEqual(b);
    await expect(saveLanding({ ...b, slug: a.slug })).rejects.toMatchObject({
      status: 409,
      field: 'slug',
    });
    expect(await getLandingById(a.id)).toEqual(a);
    await expect(
      saveLanding({ ...a, title: '자기 자신 수정' }),
    ).resolves.toMatchObject({ id: a.id, title: '자기 자신 수정' });
  });
  it('makes simultaneous same-URL creates choose one owner without a record overwrite', async () => {
    const results = await Promise.allSettled([
      saveLanding(draft('qa-race')),
      saveLanding({ ...draft('qa-race'), title: '경합' }),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((r) => r.status === 'rejected')).toHaveLength(1);
    const records = (await listLandings({ includeArchived: true })).filter(
      (r) => r.slug === 'qa-race',
    );
    expect(records).toHaveLength(1);
    expect(state.entries.get('landing-slugs/qa-race.json')).toEqual({
      id: records[0].id,
    });
  });
  it('reserves orphaned and unpublished indexes; fails closed when storage is unavailable', async () => {
    state.entries.set('landing-slugs/qa-reserved.json', {
      id: 'not-yet-written',
    });
    await expect(saveLanding(draft('qa-reserved'))).rejects.toMatchObject({
      status: 409,
    });
    state.failList = true;
    await expect(saveLanding(draft('qa-new'))).rejects.toThrow(
      'storage unavailable',
    );
    expect(state.entries.size).toBe(1);
  });
  it('retains a claim on ambiguous record-write failure instead of stealing another reservation', async () => {
    state.failRecord = true;
    await expect(saveLanding(draft('qa-interrupted'))).rejects.toThrow(
      'record write failed',
    );
    state.failRecord = false;
    await expect(saveLanding(draft('qa-interrupted'))).rejects.toMatchObject({
      status: 409,
    });
  });
  it('keeps draft/archive private and updates seed by ID without losing other seeds', async () => {
    const a = await saveLanding(draft('qa-private'));
    expect(await getLandingBySlug(a.slug)).toBeNull();
    await saveLanding({ ...a, status: 'ARCHIVED' });
    expect(await getLandingBySlug(a.slug)).toBeNull();
    await expect(saveLanding(draft(a.slug))).rejects.toMatchObject({
      status: 409,
    });
    const seed = getInitialLandings()[0];
    await saveLanding({ ...seed, title: '수정 검증' });
    expect((await getLandingById(seed.id))?.title).toBe('수정 검증');
    expect(
      (await listLandings()).filter((x) => x.id.startsWith('initial-')),
    ).toHaveLength(50);
  });
  it('rejects an update while another mutation owns the landing lock', async () => {
    const record = await saveLanding(draft('qa-mutation-lock'));
    state.entries.set(`landing-mutations/${record.id}.json`, {
      operation: 'delete',
    });

    await expect(
      saveLanding({ ...record, title: '동시 수정 시도' }),
    ).rejects.toMatchObject({ status: 409, field: 'id' });
    expect((await getLandingById(record.id))?.title).toBe(record.title);
  });
});
