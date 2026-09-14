import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import {
  IMAGE_UPLOAD_MAX_BYTES,
  validateImageUpload,
} from '@/lib/image-upload-policy';

const state = vi.hoisted(() => ({ authorized: true, write: vi.fn() }));
vi.mock('server-only', () => ({}));
vi.mock('@/lib/auth', () => ({
  async requireAdminApi() {
    if (!state.authorized)
      throw new Response('관리자 인증이 필요합니다.', { status: 401 });
  },
}));
vi.mock('@netlify/blobs', () => ({ getStore: () => ({ set: state.write }) }));
import { POST } from '@/app/api/admin/uploads/route';

function request(type = 'image/png', size = 100, filename?: string) {
  const form = new FormData();
  form.append(
    'file',
    new File([new Uint8Array(size)], 'qa-local-image', { type }),
  );
  if (filename) form.append('filename', filename);
  return new Request('http://localhost/api/admin/uploads', {
    method: 'POST',
    body: form,
  });
}

describe('upload API and shared preflight (isolated Blobs)', () => {
  beforeEach(() => {
    state.authorized = true;
    state.write.mockReset().mockResolvedValue(undefined);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  for (const [type, extension] of [
    ['image/jpeg', 'jpg'],
    ['image/png', 'png'],
    ['image/webp', 'webp'],
  ]) {
    it(`accepts ${type} and stores the matching extension`, async () => {
      const response = await POST(request(type));
      expect(response.status).toBe(200);
      expect((await response.json()).url).toMatch(
        new RegExp(
          `^/api/media/uploads/qa-local-image-[a-f0-9]{8}\\.${extension}$`,
        ),
      );
      expect(state.write).toHaveBeenCalledTimes(1);
      expect(state.write.mock.calls[0][1].byteLength).toBe(100);
      expect(
        validateImageUpload({ type, size: IMAGE_UPLOAD_MAX_BYTES }),
      ).toBeNull();
    });
  }
  it('uses a sanitized SEO filename for new uploads and keeps the original name separate', async () => {
    const response = await POST(
      request('image/png', 100, '대구 동구 퀵서비스.jpg'),
    );
    const data = await response.json();
    expect(data.filename).toMatch(/^대구-동구-퀵서비스-[a-f0-9]{8}\.png$/);
    expect(data.storageKey).toBe(`uploads/${data.filename}`);
    expect(data.originalFilename).toBe('qa-local-image');
    expect(state.write.mock.calls[0][0]).toBe(data.storageKey);
  });
  it('accepts exactly 5 MiB at the API boundary', async () => {
    expect(
      (await POST(request('image/png', IMAGE_UPLOAD_MAX_BYTES))).status,
    ).toBe(200);
    expect(state.write).toHaveBeenCalledTimes(1);
  });
  it('rejects 5 MiB + 1 byte on both sides without a write', async () => {
    const response = await POST(
      request('image/png', IMAGE_UPLOAD_MAX_BYTES + 1),
    );
    expect(response.status).toBe(413);
    const validation = validateImageUpload({
      type: 'image/png',
      size: IMAGE_UPLOAD_MAX_BYTES + 1,
    });
    expect((await response.json()).error).toBe(validation?.error);
    expect(state.write).not.toHaveBeenCalled();
  });
  for (const type of ['text/plain', 'image/svg+xml', '']) {
    it(`rejects unsupported MIME ${type || '(empty)'} on both sides`, async () => {
      const response = await POST(request(type));
      expect(response.status).toBe(415);
      expect((await response.json()).error).toBe(
        validateImageUpload({ type, size: 100 })?.error,
      );
      expect(state.write).not.toHaveBeenCalled();
    });
  }
  it('rejects missing files', async () => {
    expect(
      (
        await POST(
          new Request('http://localhost/api/admin/uploads', {
            method: 'POST',
            body: new FormData(),
          }),
        )
      ).status,
    ).toBe(400);
    expect(state.write).not.toHaveBeenCalled();
  });
  it('rejects expired sessions before a write', async () => {
    state.authorized = false;
    expect((await POST(request())).status).toBe(401);
    expect(state.write).not.toHaveBeenCalled();
  });
  it('returns a safe JSON error on storage failure', async () => {
    state.write.mockRejectedValue(new Error('private storage failure detail'));
    const response = await POST(request());
    expect(response.status).toBe(500);
    expect((await response.json()).error).toBe(
      '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
    );
  });
});
