import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import { requireAdminApi } from '@/lib/auth';
import {
  IMAGE_UPLOAD_TYPES,
  validateImageUpload,
} from '@/lib/image-upload-policy';
import { slugify } from '@/lib/seo';

export const dynamic = 'force-dynamic';

function assetStore() {
  return getStore({
    name: 'j-complex-logistics-assets',
    consistency: 'strong',
  });
}

export async function POST(request: Request) {
  try {
    await requireAdminApi();
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File))
      return Response.json(
        { error: '이미지를 선택해주세요.' },
        { status: 400 },
      );
    const invalid = validateImageUpload(file);
    if (invalid)
      return Response.json(
        { error: invalid.error },
        { status: invalid.status },
      );
    const extension = IMAGE_UPLOAD_TYPES.get(file.type);
    const requestedName = form.get('filename');
    const rawBaseName = (
      typeof requestedName === 'string' && requestedName.trim()
        ? requestedName
        : file.name
    ).replace(/\.[^.]+$/, '');
    const safeBaseName = slugify(rawBaseName).slice(0, 80) || 'image';
    const storedFilename = `${safeBaseName}-${randomUUID().slice(0, 8)}.${extension}`;
    const key = `uploads/${storedFilename}`;
    await assetStore().set(key, await file.arrayBuffer());
    return Response.json({
      url: `/api/media/${key}`,
      filename: storedFilename,
      originalFilename: file.name,
      storageKey: key,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return Response.json(
      { error: '이미지 업로드에 실패했습니다. 다시 시도해주세요.' },
      { status: 500 },
    );
  }
}
