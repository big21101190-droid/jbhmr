import { describe, expect, it } from 'vitest';
import { productionSeoErrors } from '../scripts/production-seo-policy.mjs';

describe('Netlify production SEO build gate', () => {
  const production = {
    CONTEXT: 'production',
    NEXT_PUBLIC_SITE_URL: 'https://1661-0122.com',
    NEXT_PUBLIC_ROBOTS_INDEX: 'true',
  };
  it('accepts the production domain and explicit indexing', () => {
    expect(productionSeoErrors(production)).toEqual([]);
    expect(
      productionSeoErrors({
        ...production,
        NEXT_PUBLIC_SITE_URL: 'https://1661-0122.com/',
      }),
    ).toEqual([]);
  });
  it('rejects accidental production noindex and missing configuration', () => {
    expect(
      productionSeoErrors({ ...production, NEXT_PUBLIC_ROBOTS_INDEX: 'false' }),
    ).toHaveLength(1);
    expect(productionSeoErrors({ CONTEXT: 'production' })).toHaveLength(2);
  });
  it.each([
    'https://other.example',
    'http://1661-0122.com',
    'https://1661-0122.com/other',
    'https://1661-0122.com?x=1',
    'https://user@1661-0122.com',
    'invalid',
  ])('rejects a wrong canonical base %s', (url) => {
    expect(
      productionSeoErrors({ ...production, NEXT_PUBLIC_SITE_URL: url }),
    ).toHaveLength(1);
  });
  it('preserves isolated preview, branch and local indexing configuration', () => {
    for (const CONTEXT of ['deploy-preview', 'branch-deploy', undefined]) {
      expect(
        productionSeoErrors({ CONTEXT, NEXT_PUBLIC_ROBOTS_INDEX: 'false' }),
      ).toEqual([]);
    }
  });
});
