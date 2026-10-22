import { describe, expect, it } from 'vitest';
import initialLandings from '@/data/initial-landings.json';
import { regions } from '@/data/regions';
import { services } from '@/data/services';
import type { Landing } from '@/lib/domain';
import { SITE_URL } from '@/lib/company';
import { isSitemapEligible } from '@/lib/landing-policy';
import { areaHref, regionGroups } from '@/lib/site-data';
import { getServiceRoutes } from '@/lib/service-routes';
import sitemap from '@/app/sitemap';

const corePaths = ['', '/about', '/services', '/regions', '/faq', '/contact', '/privacy'];
const siteUrl = SITE_URL;

function expectedStaticUrls() {
  return [
    ...corePaths.map((path) => `${siteUrl}${path || '/'}`),
    ...services
      .filter((item) => item.active)
      .map((item) => `${siteUrl}/services/${item.slug}`),
    ...regions
      .filter((item) => item.active)
      .map((item) => `${siteUrl}/regions/${item.slug}`),
    ...services
      .flatMap(getServiceRoutes)
      .filter((item) => item.indexPolicy !== 'NOINDEX')
      .map((item) => `${siteUrl}/routes/${item.slug}`),
  ].sort();
}

describe('sitemap inventory integrity', () => {
  it('preserves every static indexable URL without synthetic modification timestamps', async () => {
    const previous = process.env.NEXT_PUBLIC_ROBOTS_INDEX;
    process.env.NEXT_PUBLIC_ROBOTS_INDEX = 'true';
    try {
      const entries = await sitemap();
      const staticEntries = entries.filter((entry) => !entry.url.includes('/delivery/'));

      expect(staticEntries.map((entry) => entry.url).sort()).toEqual(expectedStaticUrls());
      expect(staticEntries).toHaveLength(expectedStaticUrls().length);
      expect(staticEntries.every((entry) => entry.lastModified === undefined)).toBe(true);

      const seededLanding = (initialLandings as Landing[]).find(isSitemapEligible)!;
      const landing = entries.find((entry) =>
        entry.url.endsWith(`/delivery/${seededLanding.slug}`),
      );
      expect(landing?.lastModified).toEqual(new Date(seededLanding.updatedAt));
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_ROBOTS_INDEX;
      else process.env.NEXT_PUBLIC_ROBOTS_INDEX = previous;
    }
  });
});

describe('direct region links', () => {
  it('uses each supported region page instead of a legacy redirect URL', () => {
    for (const group of regionGroups) {
      for (const place of group.places) {
        const target = regions.find(
          (region) => region.parentId === group.slug && region.name.endsWith(place),
        );
        expect(target, `${group.slug}/${place}`).toBeDefined();
        expect(areaHref(group, place)).toBe(`/regions/${target!.slug}`);
      }
    }
  });
});
