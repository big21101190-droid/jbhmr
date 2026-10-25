import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/catalog-store', async () => {
  const { services } = await import('@/data/services');
  return { listServices: async () => services };
});
import RoutePage, { generateMetadata } from '@/app/routes/[slug]/page';

describe('existing route search presentation', () => {
  it('preserves the route canonical and exposes matching visible breadcrumbs and service schema', async () => {
    const params = Promise.resolve({ slug: 'seoul-pohang-express-bus' });
    const metadata = await generateMetadata({ params });
    expect(metadata.alternates).toEqual({
      canonical: '/routes/seoul-pohang-express-bus',
    });
    const html = renderToStaticMarkup(await RoutePage({ params }));
    const schemas = [
      ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g),
    ].flatMap((match) => JSON.parse(match[1]));
    const service = schemas.find((item) => item['@type'] === 'Service');
    expect(service.url).toBe(
      'https://1661-0122.com/routes/seoul-pohang-express-bus',
    );
    expect(service.name).toContain('포항');
    expect(service.offers).toBeUndefined();
    const breadcrumb = schemas.find(
      (item) => item['@type'] === 'BreadcrumbList',
    );
    expect(breadcrumb.itemListElement[1].item).toBe(
      'https://1661-0122.com/services/express-bus',
    );
    expect(html).toContain('aria-label="현재 위치"');
    expect(html).toContain('href="/services/express-bus"');
  });
});
