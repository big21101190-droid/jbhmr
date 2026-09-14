import { revalidatePath } from 'next/cache';
import { requireAdminApi } from '@/lib/auth';
import {
  CatalogValidationError,
  getServiceRecord,
  saveService,
} from '@/lib/catalog-store';
import type { ServiceRouteIntent } from '@/lib/domain';
import { getAllServiceRoutes, getServiceRouteSlug } from '@/lib/service-routes';
import { decodeUrlSegment } from '@/lib/url-segment';

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
    { error: '주요 노선을 저장하지 못했습니다.' },
    { status: 500 },
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ serviceId: string; slug: string }> },
) {
  try {
    await requireAdminApi();
    const { serviceId, slug } = await params;
    const lookup = decodeUrlSegment(slug);
    const service = await getServiceRecord(serviceId, true);
    if (!service || lookup === null)
      return Response.json(
        { error: '주요 노선을 찾을 수 없습니다.' },
        { status: 404 },
      );
    const existing = getAllServiceRoutes(service).find(
      (item) => item.slug.normalize('NFC') === lookup,
    );
    if (!existing)
      return Response.json(
        { error: '주요 노선을 찾을 수 없습니다.' },
        { status: 404 },
      );
    const patch = (await request.json()) as Partial<ServiceRouteIntent>;
    const routeIntents = (service.routeIntents || []).map((route) => {
      if (getServiceRouteSlug(service, route) !== existing.slug) return route;
      return {
        ...route,
        label: patch.label ?? route.label,
        description: patch.description,
        body: patch.body,
        image: patch.image,
        metaTitle: patch.metaTitle,
        metaDescription: patch.metaDescription,
        indexPolicy: patch.indexPolicy,
        active: patch.active ?? route.active,
      };
    });
    const saved = await saveService({ id: service.id, routeIntents });
    const updated = getAllServiceRoutes(saved).find(
      (item) => item.slug === existing.slug,
    );
    revalidatePath('/admin');
    revalidatePath(`/routes/${existing.slug}`);
    revalidatePath(`/services/${saved.slug}`);
    revalidatePath('/sitemap.xml');
    return Response.json({ route: updated });
  } catch (error) {
    return errorResponse(error);
  }
}
