import type { Landing, Region, Service } from '@/lib/domain';
import { isSitemapEligible } from '@/lib/landing-policy';
import {
  getServiceRoutes,
  serviceRoutePlaceKey,
  type ServiceRoute,
} from '@/lib/service-routes';

export function serviceLandings(serviceId: string, landings: Landing[]) {
  return landings.filter(
    (landing) => landing.serviceId === serviceId && isSitemapEligible(landing),
  );
}

export function routeOptions(
  route: ServiceRoute,
  services: Service[],
  regions: Region[],
) {
  const origin = serviceRoutePlaceKey(route.origin);
  const destination = serviceRoutePlaceKey(route.destination);
  const alternatives = services
    .filter((service) => service.active && !service.archived)
    .flatMap(getServiceRoutes)
    .filter(
      (item) =>
        item.slug !== route.slug &&
        item.indexPolicy !== 'NOINDEX' &&
        serviceRoutePlaceKey(item.origin) === origin &&
        serviceRoutePlaceKey(item.destination) === destination,
    );
  const endpoints = [route.origin, route.destination].flatMap((place) => {
    const key = serviceRoutePlaceKey(place);
    // An endpoint city must not accidentally resolve to one of its districts.
    const matches = regions.filter(
      (region) =>
        region.active &&
        !region.archived &&
        [region.name, region.name.split(' ').at(-1)!].some(
          (name) => serviceRoutePlaceKey(name) === key,
        ),
    );
    const region =
      matches.find((item) => item.type === 'METRO' || item.type === 'CITY') ||
      (matches.length === 1 ? matches[0] : undefined);
    return region
      ? [{ name: region.name, href: `/regions/${region.slug}` }]
      : [];
  });
  return {
    alternatives,
    endpoints: endpoints.filter(
      (item, index) =>
        endpoints.findIndex((other) => other.href === item.href) === index,
    ),
  };
}
