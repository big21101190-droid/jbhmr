import type { MetadataRoute } from 'next';
import { listRegions, listServices } from '@/lib/catalog-store';
import { SITE_URL } from '@/lib/company';
import { isIndexingEnabled } from '@/lib/indexing';
import { listLandings } from '@/lib/landing-store';
import { isSitemapEligible } from '@/lib/landing-policy';
import { getServiceRoutes } from '@/lib/service-routes';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexingEnabled()) return [];
  const [services, regions] = await Promise.all([
    listServices(),
    listRegions(),
  ]);
  const now = new Date();
  const core = [
    '',
    '/about',
    '/services',
    '/regions',
    '/faq',
    '/contact',
    '/privacy',
  ].map((path, index) => ({
    url: `${SITE_URL}${path || '/'}`,
    lastModified: now,
    changeFrequency: index === 0 ? ('weekly' as const) : ('monthly' as const),
    priority: index === 0 ? 1 : 0.7,
  }));
  const servicePages = services
    .filter((item) => item.active)
    .map((item) => ({
      url: `${SITE_URL}/services/${item.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }));
  const regionPages = regions
    .filter((item) => item.active)
    .map((item) => ({
      url: `${SITE_URL}/regions/${item.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: item.parentId ? 0.65 : 0.7,
    }));
  const landingPages = (await listLandings({ publishedOnly: true }))
    .filter(isSitemapEligible)
    .map((item) => ({
      url: item.canonical || `${SITE_URL}/delivery/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  const routePages = services.flatMap(getServiceRoutes).map((item) => ({
    url: `${SITE_URL}/routes/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [
    ...core,
    ...servicePages,
    ...regionPages,
    ...routePages,
    ...landingPages,
  ];
}
