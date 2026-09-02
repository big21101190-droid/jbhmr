import { getDeployStore, getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import { requireAdminApi } from '@/lib/auth';

export const dynamic = 'force-dynamic';
const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);
const maxBytes = 5 * 1024 * 1024;

function assetStore() {
  return process.env.CONTEXT === 'production'
    ? getStore('j-complex-logistics-assets', { consistency: 'strong' })
    : getDeployStore('j-complex-logistics-assets');
}

export async function POST(request: Request) {
  try {
    await requireAdminApi();
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return Response.json({ error: '이미지를 선택해주세요.' }, { status: 400 });
    const extension = allowedTypes.get(file.type);
    if (!extension) return Response.json({ error: 'JPG, PNG, WEBP 이미지만 업로드할 수 있습니다.' }, { status: 415 });
    if (file.size > maxBytes) return Response.json({ error: '이미지는 5MB 이하만 업로드할 수 있습니다.' }, { status: 413 });
    const key = `uploads/${randomUUID()}.${extension}`;
    await assetStore().set(key, await file.arrayBuffer());
    return Response.json({ url: `/api/media/${key}`, filename: file.name });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return Response.json({ error: '이미지 업로드에 실패했습니다. 다시 시도해주세요.' }, { status: 500 });
  }
}
