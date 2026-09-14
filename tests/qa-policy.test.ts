import { describe, expect, it } from 'vitest';
import {
  normalizeInternalPath,
  parseQaOptions,
  robotsMetaMatches,
  sitemapPaths,
  sitemapPolicyFailures,
} from '@/scripts/qa-policy.mjs';

describe('QA indexing policy', () => {
  it('uses explicit CLI policy ahead of environment defaults', () => {
    expect(
      parseQaOptions(['https://preview.example', '--indexing=false'], {
        NODE_ENV: 'test',
        NEXT_PUBLIC_ROBOTS_INDEX: 'true',
      }),
    ).toMatchObject({
      baseUrl: 'https://preview.example',
      canonicalBase: 'https://preview.example',
      indexingEnabled: false,
    });
  });

  it('requires a non-empty sitemap only when indexing is enabled', () => {
    expect(
      sitemapPolicyFailures({
        indexingEnabled: true,
        responseStatus: 200,
        paths: [],
      }),
    ).toContain('indexing=true인데 sitemap URL이 0개입니다.');
    expect(
      sitemapPolicyFailures({
        indexingEnabled: false,
        responseStatus: 200,
        paths: ['/'],
      }),
    ).toContain('indexing=false인데 sitemap에 1개 URL이 노출됩니다.');
    expect(
      sitemapPolicyFailures({
        indexingEnabled: false,
        responseStatus: 200,
        paths: [],
      }),
    ).toEqual([]);
  });

  it('parses sitemap URLs and environment-specific robots metadata', () => {
    const xml =
      '<urlset><url><loc>https://example.com/</loc></url><url><loc>https://example.com/about</loc></url></urlset>';
    expect(sitemapPaths(xml)).toEqual(['/', '/about']);
    expect(
      robotsMetaMatches(
        '<meta name="robots" content="noindex, nofollow"/>',
        false,
      ),
    ).toBe(true);
    expect(
      robotsMetaMatches('<meta name="robots" content="index, follow"/>', true),
    ).toBe(true);
  });

  it('keeps only same-origin HTTP paths during link crawling', () => {
    const base = 'https://example.com';
    expect(normalizeInternalPath('/about#team', base)).toBe('/about');
    expect(normalizeInternalPath('/search?q=화물', base)).toBe(
      '/search?q=%ED%99%94%EB%AC%BC',
    );
    expect(normalizeInternalPath('https://outside.example/', base)).toBeNull();
    expect(normalizeInternalPath('tel:16610122', base)).toBeNull();
  });
});
