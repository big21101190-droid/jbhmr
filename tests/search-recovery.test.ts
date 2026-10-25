import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRegion, regions } from '@/data/regions';
import { services } from '@/data/services';
import { getRegionSeoContent } from '@/lib/region-seo';
import { getServiceRoutes } from '@/lib/service-routes';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('canonical host recovery', () => {
  it('uses the real production domain when no environment value is set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.resetModules();
    expect((await import('@/lib/company')).SITE_URL).toBe(
      'https://1661-0122.com',
    );
  });
  it('respects explicit deployment configuration', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://1661-0122.com/');
    vi.resetModules();
    expect((await import('@/lib/company')).SITE_URL).toBe(
      'https://1661-0122.com',
    );
  });
});

describe('real regional catalog links', () => {
  it('finds recorded Seoul routes without inventing Gumi or reverse routes', () => {
    const links = getRegionSeoContent(
      getRegion('seoul')!,
      services,
    ).directLinks;
    expect(
      links.some((link) => link.href === '/routes/seoul-pohang-express-bus'),
    ).toBe(true);
    const gumi = getRegionSeoContent(getRegion('gyeongbuk-gumi')!, services);
    expect(
      gumi.directLinks.some((link) => link.href.startsWith('/routes/')),
    ).toBe(false);
  });
  it('uses live slugs and omits inactive services and inactive routes', () => {
    const catalog = services.map((service) => ({
      ...service,
      slug: service.id === 'damas' ? 'edited-damas' : service.slug,
      active: service.id !== 'one-ton',
      routeIntents: service.routeIntents?.map((route) => ({
        ...route,
        active: false,
      })),
    }));
    const links = getRegionSeoContent(
      getRegion('gyeongbuk-pohang')!,
      catalog,
    ).directLinks;
    expect(links.some((link) => link.href === '/services/edited-damas')).toBe(
      true,
    );
    expect(links.some((link) => link.href === '/services/one-ton')).toBe(false);
    expect(links.some((link) => link.href.startsWith('/routes/'))).toBe(false);
  });
  it('does not resurrect bundled links when the live catalog is empty', () => {
    expect(getRegionSeoContent(getRegion('seoul')!, []).directLinks).toEqual(
      [],
    );
  });
  it('qualifies the Seoul H1 with the city name', () => {
    expect(getRegionSeoContent(getRegion('seoul')!).h1).toContain('서울');
  });
  it('uses only existing catalog URLs for every regional page', () => {
    const allowed = new Set([
      ...services.map((service) => `/services/${service.slug}`),
      ...services
        .flatMap(getServiceRoutes)
        .map((route) => `/routes/${route.slug}`),
    ]);
    for (const region of regions) {
      const content = getRegionSeoContent(region, services);
      for (const link of content.directLinks)
        expect(allowed.has(link.href), link.href).toBe(true);
      expect(new Set(content.directLinks.map((link) => link.href)).size).toBe(
        content.directLinks.length,
      );
    }
  });
  it('does not match a different city through a partial endpoint name', () => {
    const local = getRegionSeoContent(getRegion('busan-seo')!, services);
    expect(
      local.directLinks.some((link) => link.href.includes('seogwipo')),
    ).toBe(false);
  });
  it('matches existing Seogwipo city aliases to the recorded routes', () => {
    const links = getRegionSeoContent(
      getRegion('jeju-seogwipo')!,
      services,
    ).directLinks;
    expect(
      links.some((link) => link.href === '/routes/seoul-seogwipo-jeju-air'),
    ).toBe(true);
    expect(
      links.some((link) => link.href === '/routes/seoul-seogwipo-jeju-sea'),
    ).toBe(true);
  });
});
