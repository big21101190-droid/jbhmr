import { getStore } from '@netlify/blobs';

export const dynamic = 'force-dynamic';

function assetStore() {
  return getStore({ name: 'j-complex-logistics-assets' });
}

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join('/');
  if (
    !/^uploads\/[a-z0-9가-힣-]+-[a-f0-9]{8}\.(jpg|png|webp)$/.test(key)
  )
    return new Response('Not found', { status: 404 });
  try {
    const data = await assetStore().get(key, { type: 'arrayBuffer' }) as ArrayBuffer | null;
    if (!data) return new Response('Not found', { status: 404 });
    const extension = key.split('.').pop();
    const contentType = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;
    return new Response(data, { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
