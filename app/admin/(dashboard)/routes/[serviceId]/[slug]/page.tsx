import { notFound } from 'next/navigation';
import { ServiceRouteEditor } from '@/components/service-route-editor';
import { getServiceRecord } from '@/lib/catalog-store';
import { getAllServiceRoutes } from '@/lib/service-routes';
import { decodeUrlSegment } from '@/lib/url-segment';

export default async function EditServiceRoutePage({
  params,
}: {
  params: Promise<{ serviceId: string; slug: string }>;
}) {
  const { serviceId, slug } = await params;
  const service = await getServiceRecord(serviceId, true);
  const lookup = decodeUrlSegment(slug);
  if (!service || lookup === null) notFound();
  const route = getAllServiceRoutes(service).find(
    (item) => item.slug.normalize('NFC') === lookup,
  );
  if (!route) notFound();
  return <ServiceRouteEditor initial={route} />;
}
