import { beforeEach, describe, expect, it, vi } from 'vitest';

const storedAssets = vi.hoisted(() => new Map<string, ArrayBuffer>());

vi.mock('@netlify/blobs', () => ({
  getStore: () => ({
    async get(key: string) {
      return storedAssets.get(key) ?? null;
    },
  }),
}));

import { GET } from '@/app/api/media/[...key]/route';

describe('uploaded media route', () => {
  beforeEach(() => storedAssets.clear());

  it('serves a CMS upload whose SEO filename contains Korean or regular letters', async () => {
    const key = 'uploads/서울-대전-고속버스택배-a1b2c3d4.png';
    storedAssets.set(key, new Uint8Array([137, 80, 78, 71]).buffer);

    const response = await GET(new Request('http://localhost/api/media/' + key), {
      params: Promise.resolve({
        key: ['uploads', '서울-대전-고속버스택배-a1b2c3d4.png'],
      }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/png');
    expect(await response.arrayBuffer()).toEqual(
      new Uint8Array([137, 80, 78, 71]).buffer,
    );
  });

  it('rejects a path that was not produced by the upload naming scheme', async () => {
    const response = await GET(new Request('http://localhost/api/media/uploads/other.png'), {
      params: Promise.resolve({ key: ['uploads', 'other.png'] }),
    });

    expect(response.status).toBe(404);
  });
});
