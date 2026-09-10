import { describe, expect, it } from 'vitest';
import initialData from '@/data/initial-landings.json';
import { regions } from '@/data/regions';
import { services } from '@/data/services';
import type { Landing } from '@/lib/domain';
import { refreshLandingDefaultsFor } from '@/lib/landing-defaults';
import {
  assertNoDuplicate,
  normalizeLandingInput,
} from '@/lib/landing-validation';
import { getLandingMetadata } from '@/lib/seo';

const seed = initialData[0] as Landing;

describe('release F01 URL identity', () => {
  it.each(['PUBLISHED', 'DRAFT', 'ARCHIVED'] as const)(
    'reserves a normalized URL in %s',
    (status) => {
      const existing = { ...seed, slug: '서울-퀵-1', status };
      for (const slug of [
        ' 서울---퀵-1 ',
        '서울-퀵-１',
        encodeURIComponent('서울-퀵-1'),
      ]) {
        const candidate = normalizeLandingInput({
          ...seed,
          id: undefined,
          slug,
        });
        expect(() => assertNoDuplicate(candidate, [existing])).toThrow(
          '동일한 URL',
        );
      }
      expect(() =>
        assertNoDuplicate({ ...existing, title: '수정' }, [existing]),
      ).not.toThrow();
    },
  );
  it.each([
    'bad%',
    '%E0%A4%A',
    'a%2Fb',
    'a%5Cb',
    'a%00b',
    'a%252Fb',
    'a/b',
    'a\\b',
  ])('rejects unsafe URL input %s', (slug) => {
    expect(() => normalizeLandingInput({ ...seed, slug })).toThrow();
  });
  it('does not alter any existing seed URL', () => {
    for (const landing of initialData)
      expect(normalizeLandingInput(landing as Landing).slug).toBe(landing.slug);
  });
});

describe('release F07 existing autofill allowlist', () => {
  it.each(['INDEX', 'NOINDEX'] as const)(
    'preserves %s and every non-generated field',
    (indexPolicy) => {
      const current: Landing = {
        ...seed,
        indexPolicy,
        slug: 'my-stable-url',
        primaryKeyword: '직접 입력',
        canonical: 'https://example.com/kept',
        redirectTo: '/delivery/kept',
        heroImage: '',
        ogImage: '/custom-og.png',
        status: 'PUBLISHED',
        relatedRegions: ['seoul'],
        relatedServices: ['ktx'],
        bodyTopImages: [
          {
            url: '/one.png',
            alt: '위쪽',
            caption: '설명',
            storageKey: 'uploads/one.png',
          },
          { url: '/two.png', alt: '두 번째' },
        ],
      };
      const region = regions.find((x) => x.id === 'seoul')!;
      const service = services.find((x) => x.id === 'express-bus')!;
      const destination = regions.find((x) => x.id === 'busan')!;
      const result = refreshLandingDefaultsFor(
        current,
        region,
        service,
        destination,
      );
      const generated = new Set([
        'regionId',
        'destinationRegionId',
        'serviceId',
        'title',
        'h1',
        'summary',
        'sections',
        'faq',
        'secondaryKeywords',
        'metaTitle',
        'metaDescription',
        'ogTitle',
        'ogDescription',
        'ctaLabel',
        'ctaLink',
      ]);
      for (const key of Object.keys(current) as (keyof Landing)[]) {
        if (!generated.has(key))
          expect((result as Landing)[key], key).toEqual(current[key]);
      }
      expect(result.title).toContain('서울특별시–부산광역시');
      expect(result.heroImage).toBe('');
      expect(getLandingMetadata(result as Landing, true).robots).toEqual({
        index: indexPolicy === 'INDEX',
        follow: indexPolicy === 'INDEX',
      });
    },
  );
});
