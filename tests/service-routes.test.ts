import { describe, expect, it } from 'vitest';
import { services } from '@/data/services';
import { getServiceRoute, getServiceRoutes } from '@/lib/service-routes';

describe('service route links', () => {
  it('builds unique real route URLs for every configured service intent', () => {
    const routes = services.flatMap(getServiceRoutes);
    expect(routes).toHaveLength(19);
    expect(new Set(routes.map((route) => route.slug)).size).toBe(routes.length);
    expect(
      ['express-bus', 'ktx', 'jeju-air', 'jeju-sea'].every((serviceId) =>
        routes.some((route) => route.serviceId === serviceId),
      ),
    ).toBe(true);
  });

  it('keeps existing express-bus URLs and separates each service', () => {
    const routes = services.flatMap(getServiceRoutes);
    expect(getServiceRoute(services, 'seoul-busan-express-bus')?.label).toBe(
      '서울–부산 고속버스택배',
    );
    expect(routes.map((route) => route.slug)).toEqual(
      expect.arrayContaining([
        'seoul-busan-express-bus',
        'seoul-daejeon-express-bus',
        'seoul-busan-ktx',
        'seoul-jeju-jeju-air',
        'seoul-jeju-jeju-sea',
      ]),
    );
  });
});
