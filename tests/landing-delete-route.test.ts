import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import seeds from '@/data/initial-landings.json';

const state = vi.hoisted(() => ({
  blobs: new Map<string, unknown>(),
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
      return {
        blobs: [...state.blobs.keys()]
          .filter((key) => key.startsWith(prefix))
          .map((key) => ({ key })),
      };
    },
    async get(key: string) {
      return structuredClone(state.blobs.get(key) ?? null);
    },
    async setJSON(
      key: string,
      value: unknown,
      options?: { onlyIfNew?: boolean },
    ) {
      if (options?.onlyIfNew && state.blobs.has(key))
        return { modified: false };
      state.blobs.set(key, structuredClone(value));
      return { modified: true, etag: 'mock-etag' };
    },
    async delete(key: string) {
      state.deleted(key);
      state.blobs.delete(key);
    },
  }),
}));

import * as landingRoute from '@/app/api/admin/landings/[id]/route';

type DeleteRoute = (request: Request, context: { params: Promise<{ id: string }> }) => Promise<Response>;
const DELETE = (landingRoute as typeof landingRoute & { DELETE: DeleteRoute }).DELETE;

const landingId = 'qa-removable-landing';
const landingSlug = 'qa-removable-landing';
const remove = (id = landingId) =>
  DELETE(
    new Request(`http://localhost/api/admin/landings/${id}`, { method: 'DELETE' }),
    { params: Promise.resolve({ id }) },
  );

describe('landing DELETE route (isolated Blobs)', () => {
  beforeEach(() => {
    state.blobs.clear();
    state.authorized = true;
    state.deleted.mockClear();
    state.revalidate.mockClear();
    const record = {
      ...seeds[0],
      id: landingId,
      slug: landingSlug,
      title: '삭제 검증용 랜딩',
    };
    state.blobs.set(`landings/${landingId}.json`, record);
    state.blobs.set(`landing-slugs/${landingSlug}.json`, { id: landingId });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('permanently removes a customer-created landing and its URL reservation', async () => {
    const response = await remove();

    expect(response.status).toBe(204);
    expect(state.blobs.has(`landings/${landingId}.json`)).toBe(false);
    expect(state.blobs.has(`landing-slugs/${landingSlug}.json`)).toBe(false);
    expect(state.revalidate).toHaveBeenCalledWith(`/delivery/${landingSlug}`);
    expect(state.revalidate).toHaveBeenCalledWith('/sitemap.xml');
  });

  it('protects an initial landing from permanent deletion', async () => {
    const response = await remove(seeds[0].id);

    expect(response.status).toBe(409);
    expect(state.deleted).not.toHaveBeenCalled();
  });

  it('does not delete while another landing mutation owns the operation lock', async () => {
    state.blobs.set(`landing-mutations/${landingId}.json`, {
      operation: 'save',
    });

    expect((await remove()).status).toBe(409);
    expect(state.blobs.has(`landings/${landingId}.json`)).toBe(true);
    expect(state.deleted).not.toHaveBeenCalled();
  });

  it('rejects an expired session before changing stored content', async () => {
    state.authorized = false;

    expect((await remove()).status).toBe(401);
    expect(state.deleted).not.toHaveBeenCalled();
  });
});
