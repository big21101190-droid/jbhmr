import { describe, expect, it } from 'vitest';
import initialData from '@/data/initial-landings.json';
import type { Landing } from '@/lib/domain';
import { isIndexingEnabled } from '@/lib/indexing';
import { isSitemapEligible } from '@/lib/landing-policy';
import { getLandingMetadata } from '@/lib/seo';

const landing = (initialData as Landing[])[0];

describe('landing metadata and sitemap policy', () => {
  it('creates title, description, canonical and open graph metadata', () => {
    const metadata = getLandingMetadata(landing, true);
    expect(metadata.title).toEqual({ absolute: landing.metaTitle });
    expect(metadata.description).toBe(landing.metaDescription);
    expect(metadata.alternates).toMatchObject({
      canonical: expect.stringContaining(`/delivery/${landing.slug}`),
    });
    expect(metadata.openGraph).toMatchObject({
      title: landing.ogTitle,
      description: landing.ogDescription,
    });
  });

  it('fails closed until production indexing is explicitly enabled', () => {
    expect(isIndexingEnabled(undefined)).toBe(false);
    expect(isIndexingEnabled('false')).toBe(false);
    expect(isIndexingEnabled('true')).toBe(true);
    expect(getLandingMetadata(landing, false).robots).toMatchObject({
      index: false,
      follow: false,
    });
    expect(getLandingMetadata(landing, true).robots).toMatchObject({
      index: true,
      follow: true,
    });
  });

  it('includes only published indexable pages in sitemap', () => {
    expect(isSitemapEligible(landing)).toBe(true);
    expect(isSitemapEligible({ ...landing, status: 'DRAFT' })).toBe(false);
    expect(isSitemapEligible({ ...landing, status: 'ARCHIVED' })).toBe(false);
    expect(isSitemapEligible({ ...landing, indexPolicy: 'NOINDEX' })).toBe(
      false,
    );
  });
});
