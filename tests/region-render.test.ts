import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import initial from '@/data/initial-landings.json';
import type { Landing } from '@/lib/domain';

vi.mock('@/lib/catalog-store', async () => {
  const { regions } = await import('@/data/regions');
  const { services } = await import('@/data/services');
  return {
    getRegionRecord: async (slug: string) =>
      regions.find((region) => region.slug === slug),
    listRegions: async () => regions,
    listServices: async () => services,
  };
});
vi.mock('@/lib/landing-store', () => ({ listLandings: vi.fn(async () => []) }));

import RegionPage, { generateMetadata } from '@/app/regions/[slug]/page';
import { listLandings } from '@/lib/landing-store';

describe('regional server output', () => {
  it('retains the canonical and shows a city-qualified Seoul H1 and recorded route links', async () => {
    const params = Promise.resolve({ slug: 'seoul' });
    const metadata = await generateMetadata({ params });
    const html = renderToStaticMarkup(await RegionPage({ params }));
    expect(metadata.alternates).toEqual({ canonical: '/regions/seoul' });
    expect(html).toMatch(/<h1[^>]*>서울 /);
    expect(html).toContain('/routes/seoul-pohang-express-bus');
    expect(html).toContain('서울특별시 운송 방법 비교');
    expect(html).not.toContain('href="/area/');
    expect(html).not.toContain('noindex');
  });
  it('exposes all matching landings beyond the previous 12-card limit', async () => {
    const landings = Array.from(
      { length: 13 },
      (_, i) =>
        ({
          ...initial[0],
          id: `local-test-${i}`,
          slug: `local-test-${i}`,
          regionId: 'seoul',
          destinationRegionId: 'busan',
          status: 'PUBLISHED',
        }) as Landing,
    );
    vi.mocked(listLandings).mockResolvedValueOnce(landings);
    const html = renderToStaticMarkup(
      await RegionPage({ params: Promise.resolve({ slug: 'seoul' }) }),
    );
    for (const landing of landings)
      expect(html).toContain(`href="/delivery/${landing.slug}"`);
  });
  it('makes a destination landing discoverable from that destination region', async () => {
    vi.mocked(listLandings).mockResolvedValueOnce([
      {
        ...initial[0],
        id: 'local-busan',
        slug: 'local-busan',
        regionId: 'seoul',
        destinationRegionId: 'busan',
        status: 'PUBLISHED',
      } as Landing,
    ]);
    const html = renderToStaticMarkup(
      await RegionPage({ params: Promise.resolve({ slug: 'busan' }) }),
    );
    expect(html).toContain('href="/delivery/local-busan"');
  });
});
