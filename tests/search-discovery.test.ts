import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { regions } from '@/data/regions';
import { services } from '@/data/services';
import initial from '@/data/initial-landings.json';
import type { Landing, Service } from '@/lib/domain';
import { getServiceRoutes } from '@/lib/service-routes';
import { routeOptions, serviceLandings } from '@/lib/search-discovery';
import { ServiceAreaGuides } from '@/components/service-area-guides';
import Home from '@/app/page';

const route = getServiceRoutes(
  services.find((item) => item.id === 'express-bus')!,
)[0];
const alternative = (overrides: Partial<Service> = {}): Service => ({
  ...services[0],
  id: 'test-method',
  slug: 'custom-method',
  routeIntents: [
    {
      origin: route.origin,
      destination: route.destination,
      label: '동일 방향 대안',
      source: 'test',
    },
  ],
  ...overrides,
});

describe('existing search page discovery', () => {
  it('links only recorded same-direction alternatives and honors runtime slugs', () => {
    const method = alternative();
    const options = routeOptions(route, [method], regions);
    expect(options.alternatives.map((item) => item.slug)).toEqual(
      getServiceRoutes(method).map((item) => item.slug),
    );
    expect(options.endpoints.map((item) => item.href)).toContain(
      '/regions/seoul',
    );
    expect(options.endpoints.map((item) => item.href)).not.toContain(
      '/regions/seoul-gangnam',
    );
    for (const overrides of [
      { active: false },
      { archived: true },
      {
        routeIntents: [
          { ...method.routeIntents![0], indexPolicy: 'NOINDEX' as const },
        ],
      },
      { routeIntents: [{ ...method.routeIntents![0], active: false }] },
      {
        routeIntents: [
          {
            ...method.routeIntents![0],
            origin: route.destination,
            destination: route.origin,
          },
        ],
      },
    ]) {
      expect(
        routeOptions(route, [alternative(overrides)], regions).alternatives,
      ).toEqual([]);
    }
    expect(
      routeOptions(
        route,
        [],
        regions.map((item) => ({ ...item, active: false })),
      ).endpoints,
    ).toEqual([]);
  });

  it('connects all eligible service landings without resurrecting the retired QA record', () => {
    const base = initial[0] as Landing;
    const records = Array.from({ length: 15 }, (_, i) => ({
      ...base,
      id: `test-${i}`,
      slug: `test-${i}`,
      status: 'PUBLISHED' as const,
      indexPolicy: 'INDEX' as const,
    }));
    const excluded = [
      { ...base, slug: 'qa-삭제-e2e-검증-랜딩' },
      { ...base, slug: 'draft-record', status: 'DRAFT' as const },
      { ...base, slug: 'noindex-record', indexPolicy: 'NOINDEX' as const },
      { ...base, slug: 'other-service', serviceId: 'different-service' },
    ];
    expect(
      serviceLandings(base.serviceId, [...records, ...excluded]),
    ).toHaveLength(15);
    const html = renderToStaticMarkup(
      createElement(ServiceAreaGuides, {
        serviceId: base.serviceId,
        serviceName: '운송',
        landings: [...records, ...excluded],
      }),
    );
    for (const record of records)
      expect(html).toContain(`href="/delivery/${record.slug}"`);
    for (const record of excluded)
      expect(html).not.toContain(`href="/delivery/${record.slug}"`);
  });

  it('makes Seoul and its existing districts discoverable from the home page', () => {
    const html = renderToStaticMarkup(createElement(Home));
    expect(html).toContain('href="/regions/seoul"');
    for (const region of regions.filter((item) => item.parentId === 'seoul')) {
      expect(html).toContain(`href="/regions/${region.slug}"`);
    }
    expect(html).toContain('"@type":"WebSite"');
    expect(html).toMatch(/<h1[^>]*>전국 퀵서비스/);
  });
});
