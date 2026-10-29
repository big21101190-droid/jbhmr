import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import initial from '@/data/initial-landings.json';
import { services } from '@/data/services';
import type { Landing } from '@/lib/domain';

vi.mock('@/lib/catalog-store', async () => {
  const { services } = await import('@/data/services');
  const { regions } = await import('@/data/regions');
  return {
    getServiceRecord: async (key: string) => {
      const item = services.find(
        (service) => service.id === key || service.slug === key,
      );
      return item
        ? { ...item, image: 'https://images.example.com/service.png' }
        : null;
    },
    getRegionRecord: async (key: string) =>
      regions.find((region) => region.id === key),
  };
});
vi.mock('@/lib/landing-store', async () => {
  const { default: landings } = await import('@/data/initial-landings.json');
  return { listLandings: async () => landings };
});
import ServicePage, { generateMetadata } from '@/app/services/[slug]/page';
import { LandingView } from '@/components/landing-view';

function serviceSchema(html: string) {
  return [
    ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g),
  ]
    .flatMap((match) => JSON.parse(match[1]))
    .find((item) => item['@type'] === 'Service');
}

describe('service and landing search output', () => {
  it('keeps the service canonical and exposes its existing regional pages in server HTML', async () => {
    const landing = initial[0] as Landing;
    const service = services.find((item) => item.id === landing.serviceId)!;
    const params = Promise.resolve({ slug: service.slug });
    expect((await generateMetadata({ params })).alternates).toEqual({
      canonical: `/services/${service.slug}`,
    });
    const html = renderToStaticMarkup(await ServicePage({ params }));
    expect(html).toContain(`href="/delivery/${landing.slug}"`);
    expect(html).toContain(service.summary);
    expect(serviceSchema(html).image).toBe(
      'https://images.example.com/service.png',
    );
  });
  it('preserves a CMS absolute image URL in landing structured data', async () => {
    const landing = {
      ...initial[0],
      heroImage: 'https://images.example.com/customer.png',
    } as Landing;
    const html = renderToStaticMarkup(await LandingView({ landing }));
    expect(serviceSchema(html).image).toBe(landing.heroImage);
    expect(html).toContain(landing.h1);
  });
});
