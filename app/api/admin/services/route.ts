import { revalidatePath } from 'next/cache';
import { requireAdminApi } from '@/lib/auth';
import {
  CatalogValidationError,
  listServices,
  saveService,
} from '@/lib/catalog-store';
import type { Service } from '@/lib/domain';

export const dynamic = 'force-dynamic';

function errorResponse(error: unknown) {
  if (error instanceof Response) return error;
  if (error instanceof CatalogValidationError)
    return Response.json(
      { error: error.message, field: error.field },
      { status: error.status },
    );
  console.error(error);
  return Response.json(
    { error: '서비스 요청을 처리하지 못했습니다.' },
    { status: 500 },
  );
}

export async function GET() {
  try {
    await requireAdminApi();
    return Response.json({
      services: await listServices({ includeArchived: true }),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminApi();
    const input = (await request.json()) as Partial<Service>;
    const service = await saveService({ ...input, id: undefined });
    revalidatePath('/services');
    revalidatePath('/sitemap.xml');
    return Response.json({ service }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
