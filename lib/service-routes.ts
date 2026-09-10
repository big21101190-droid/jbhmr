import type { Service, ServiceRouteIntent } from '@/lib/domain';
import { slugify } from '@/lib/seo';

const placeSlugs: Record<string, string> = {
  서울: 'seoul',
  서울특별시: 'seoul',
  부산: 'busan',
  부산광역시: 'busan',
  대전: 'daejeon',
  대전광역시: 'daejeon',
  천안: 'cheonan',
  청주: 'cheongju',
  대구: 'daegu',
  대구광역시: 'daegu',
  울산: 'ulsan',
  울산광역시: 'ulsan',
  강릉: 'gangneung',
  속초: 'sokcho',
  포항: 'pohang',
  경주: 'gyeongju',
  광주: 'gwangju',
  광주광역시: 'gwangju',
  전주: 'jeonju',
  목포: 'mokpo',
  제주: 'jeju',
  제주특별자치도: 'jeju',
  서귀포: 'seogwipo',
  서귀포시: 'seogwipo',
};

function placeSlug(place: string) {
  const normalized = place.trim();
  return placeSlugs[normalized] || slugify(normalized);
}

export type ServiceRoute = ServiceRouteIntent & {
  slug: string;
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  serviceGroup: Service['group'];
};

export function getServiceRouteSlug(
  service: Pick<Service, 'slug'>,
  route: ServiceRouteIntent,
) {
  return (
    slugify(route.slug || '') ||
    `${placeSlug(route.origin)}-${placeSlug(route.destination)}-${service.slug}`
  );
}

export function getServiceRoutes(service: Service): ServiceRoute[] {
  return (service.routeIntents || [])
    .filter((route) => route.active !== false)
    .map((route, index) => ({
      ...route,
      slug: getServiceRouteSlug(service, route),
      serviceId: service.id,
      serviceSlug: service.slug,
      serviceName: service.name,
      serviceGroup: service.group,
      sortOrder: route.sortOrder ?? index,
    }))
    .sort(
      (a, b) =>
        (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
        a.label.localeCompare(b.label, 'ko'),
    );
}

export function getServiceRoute(services: Service[], slug: string) {
  return services
    .flatMap((service) => getServiceRoutes(service))
    .find((route) => route.slug === slug);
}
