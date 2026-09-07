import { revalidatePath } from 'next/cache';
import { requireAdminApi } from '@/lib/auth';
import {
  CatalogValidationError,
  deleteService,
  getServiceRecord,
  saveService,
} from '@/lib/catalog-store';
import type { Service } from '@/lib/domain';
import { listLandings } from '@/lib/landing-store';

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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminApi();
    const { id } = await context.params;
    const previous = await getServiceRecord(id);
    if (!previous)
      return Response.json(
        { error: '서비스를 찾을 수 없습니다.' },
        { status: 404 },
      );
    const patch = (await request.json()) as Partial<Service>;
    const service = await saveService({ ...patch, id });
    revalidatePath('/services');
    revalidatePath(`/services/${previous.slug}`);
    revalidatePath(`/services/${service.slug}`);
    revalidatePath('/sitemap.xml');
    return Response.json({ service });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminApi();
    const { id } = await context.params;
    const usage = (await listLandings({ includeArchived: true })).filter(
      (item) => item.serviceId === id,
    ).length;
    await deleteService(id, usage);
    revalidatePath('/services');
    revalidatePath('/sitemap.xml');
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
