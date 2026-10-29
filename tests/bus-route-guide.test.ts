import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BusRouteGuide } from '@/components/bus-route-guide';
import { services } from '@/data/services';
import { getServiceRoutes } from '@/lib/service-routes';

const routes = getServiceRoutes(
  services.find((service) => service.id === 'express-bus')!,
);
const render = (route: (typeof routes)[number]) =>
  renderToStaticMarkup(createElement(BusRouteGuide, { route }));

describe('bus route booking guides', () => {
  it('provides distinct substantive guidance for every existing seeded bus route', () => {
    expect(routes).toHaveLength(13);
    const guides = routes.map(render);
    expect(
      guides.every(
        (html) =>
          html.includes('견적과 도착 시간') &&
          html.includes('<h2') &&
          html.includes('보장하지 않습니다'),
      ),
    ).toBe(true);
    const titles = guides.map(
      (html) => html.match(/<h3[^>]*>(.*?)<\/h3>/)?.[1],
    );
    expect(new Set(titles).size).toBe(13);
    expect(guides.every((html) => !html.includes('href='))).toBe(true);
  });
  it('uses a stable service identity even when the CMS edits its URL slug', () => {
    expect(render({ ...routes[0], serviceSlug: 'edited-bus' })).not.toBe('');
    expect(render({ ...routes[0], origin: '서울특별시' })).not.toBe('');
  });
  it('does not describe other services, unreviewed cities or reverse routes as reviewed bus routes', () => {
    expect(
      render({ ...routes[0], serviceId: 'ktx', serviceSlug: 'express-bus' }),
    ).toBe('');
    expect(render({ ...routes[0], destination: '미등록지역' })).toBe('');
    expect(render({ ...routes[0], origin: '부산', destination: '서울' })).toBe(
      '',
    );
  });
});
