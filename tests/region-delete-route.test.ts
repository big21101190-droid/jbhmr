import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import seeds from '@/data/initial-landings.json';

const state = vi.hoisted(() => ({
  blobs: new Map<string, unknown>(),
  failList: false,
  failRead: false,
  authorized: true,
  deleted: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ revalidatePath: state.revalidate }));
vi.mock('@/lib/auth', () => ({
  async requireAdminApi() {
    if (!state.authorized)
      throw new Response('관리자 인증이 필요합니다.', { status: 401 });
  },
}));
vi.mock('@netlify/blobs', () => ({
  getStore: () => ({
    async list({ prefix }: { prefix: string }) {
      if (state.failList && prefix === 'landings/')
        throw new Error('storage unavailable');
      return {
        blobs: [...state.blobs.keys()]
          .filter((key) => key.startsWith(prefix))
          .map((key) => ({ key })),
      };
    },
    async get(key: string) {
      if (state.failRead && key.startsWith('landings/'))
        throw new Error('read unavailable');
      return state.blobs.get(key) ?? null;
    },
    async delete(key: string) {
      state.deleted(key);
      state.blobs.delete(key);
    },
  }),
}));

import { DELETE } from '@/app/api/admin/regions/[id]/route';

const regionId = 'qa-local-destination';
const regionKey = `regions/${regionId}.json`;
const remove = (id = regionId) =>
  DELETE(
    new Request(`http://localhost/api/admin/regions/${id}`, {
      method: 'DELETE',
    }),
    { params: Promise.resolve({ id }) },
  );
function landing(fields: Record<string, unknown> = {}) {
  const record = {
    ...seeds[0],
    id: 'qa-local-landing',
    regionId: 'seoul',
    destinationRegionId: regionId,
    ...fields,
  };
  state.blobs.set(`landings/${record.id}.json`, record);
  return structuredClone(record);
}

describe('region DELETE route reference protection (isolated Blobs)', () => {
  beforeEach(() => {
    state.blobs.clear();
    state.failList = state.failRead = false;
    state.authorized = true;
    state.deleted.mockClear();
    state.revalidate.mockClear();
    state.blobs.set(regionKey, {
      id: regionId,
      name: '검증 도착 지역',
      slug: regionId,
      active: true,
      archived: false,
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  for (const status of ['PUBLISHED', 'DRAFT', 'ARCHIVED']) {
    for (const field of ['regionId', 'destinationRegionId']) {
      it(`blocks a ${status} landing's ${field} and preserves both records`, async () => {
        const original = landing({
          regionId: 'seoul',
          destinationRegionId: 'busan',
          [field]: regionId,
          status,
        });
        const response = await remove();
        expect(response.status).toBe(409);
        expect((await response.json()).error).toContain('1개');
        expect(state.blobs.has(regionKey)).toBe(true);
        expect(state.blobs.get('landings/qa-local-landing.json')).toEqual(
          original,
        );
        expect(state.deleted).not.toHaveBeenCalled();
        expect(state.revalidate).not.toHaveBeenCalled();
      });
    }
  }
  it('counts unique landings across origin and destination references', async () => {
    landing({ regionId, destinationRegionId: regionId });
    landing({ id: 'qa-second', status: 'ARCHIVED' });
    expect((await (await remove()).json()).error).toContain('2개');
    expect(state.deleted).not.toHaveBeenCalled();
  });
  it('deletes an unused region without changing an unrelated landing', async () => {
    const original = landing({ destinationRegionId: 'busan' });
    expect((await remove()).status).toBe(204);
    expect(state.deleted).toHaveBeenCalledExactlyOnceWith(regionKey);
    expect(state.blobs.get('landings/qa-local-landing.json')).toEqual(original);
    expect(state.revalidate).toHaveBeenCalledWith('/regions');
  });
  it('still protects seed regions', async () => {
    expect((await remove('seoul')).status).toBe(409);
    expect(state.deleted).not.toHaveBeenCalled();
  });
  it('still protects regions with active child regions', async () => {
    state.blobs.set('regions/qa-child.json', {
      id: 'qa-child',
      parentId: regionId,
      name: '하위 지역',
      slug: 'qa-child',
      active: true,
    });
    expect((await remove()).status).toBe(409);
    expect(state.deleted).not.toHaveBeenCalled();
  });
  for (const failure of ['failList', 'failRead'] as const) {
    it(`fails closed when landing references cannot be verified (${failure})`, async () => {
      landing();
      state[failure] = true;
      expect((await remove()).status).toBe(500);
      expect(state.blobs.has(regionKey)).toBe(true);
      expect(state.deleted).not.toHaveBeenCalled();
    });
  }
  it('rejects an expired session before any deletion', async () => {
    state.authorized = false;
    expect((await remove()).status).toBe(401);
    expect(state.deleted).not.toHaveBeenCalled();
  });
});
