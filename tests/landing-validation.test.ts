import { describe, expect, it } from 'vitest';
import initialData from '@/data/initial-landings.json';
import { regions } from '@/data/regions';
import { services } from '@/data/services';
import type { Landing } from '@/lib/domain';
import {
  createLandingDefaults,
  createLandingDefaultsFor,
  refreshLandingDefaultsFor,
} from '@/lib/landing-defaults';
import {
  assertNoDuplicate,
  normalizeLandingInput,
  validateLandingInput,
} from '@/lib/landing-validation';

const landings = initialData as Landing[];

describe('landing create and lifecycle', () => {
  it('creates a complete editable draft from region and service', () => {
    const draft = normalizeLandingInput(
      createLandingDefaults('seoul-seocho', 'one-ton'),
    );
    expect(() => validateLandingInput(draft)).not.toThrow();
    expect(draft.status).toBe('DRAFT');
    expect(draft.slug).toBe('seoul-seocho-one-ton');
  });

  it('accepts publish and unpublish state changes', () => {
    const draft = normalizeLandingInput(
      createLandingDefaults('seoul-seocho', 'one-ton'),
    );
    expect(() =>
      validateLandingInput({ ...draft, status: 'PUBLISHED' }),
    ).not.toThrow();
    expect(() =>
      validateLandingInput({ ...draft, status: 'DRAFT' }),
    ).not.toThrow();
  });

  it('blocks duplicate slug', () => {
    const existing = landings[0];
    const candidate = {
      ...createLandingDefaults('seoul-seocho', 'one-ton'),
      slug: existing.slug,
    };
    expect(() => assertNoDuplicate(candidate, landings)).toThrow(
      '동일한 URL이 이미 존재합니다.',
    );
  });

  it('allows a shared primary keyword when the URL is unique', () => {
    const existing = landings[0];
    const candidate = {
      ...createLandingDefaults('seoul-seocho', 'one-ton'),
      primaryKeyword: existing.primaryKeyword,
    };
    expect(() => assertNoDuplicate(candidate, landings)).not.toThrow();
  });

  it('allows a shared region and service pair with a unique URL', () => {
    const existing = landings[0];
    const candidate = {
      ...createLandingDefaults(existing.regionId, existing.serviceId),
      slug: 'different-slug',
      primaryKeyword: '완전히 다른 키워드',
    };
    expect(() => assertNoDuplicate(candidate, landings)).not.toThrow();
  });

  it('creates unique route landing slugs from origin, destination, and service', () => {
    const seoulBusan = createLandingDefaults(
      'seoul',
      'express-bus',
      undefined,
      'busan',
    );
    const seoulDaejeon = createLandingDefaults(
      'seoul',
      'express-bus',
      undefined,
      'daejeon',
    );
    expect(seoulBusan.slug).toBe('seoul-busan-express-bus');
    expect(seoulDaejeon.slug).toBe('seoul-daejeon-express-bus');
    expect(seoulBusan.summary).toContain('고속버스택배를 화물 조건');
    expect(seoulBusan.summary).not.toContain('고속버스택배을');
    expect(seoulBusan.slug).not.toBe(seoulDaejeon.slug);
    expect(() =>
      assertNoDuplicate(seoulDaejeon, [
        { ...landings[0], ...seoulBusan, id: 'qa-route-busan' },
      ]),
    ).not.toThrow();
    expect(() =>
      assertNoDuplicate(
        { ...seoulBusan, slug: 'another-slug', primaryKeyword: '다른 키워드' },
        [{ ...landings[0], ...seoulBusan, id: 'qa-route-busan' }],
      ),
    ).not.toThrow();
  });

  it('refreshes a new route draft keyword, slug, and service media', () => {
    const current = createLandingDefaults('seoul-gangnam', 'quick-motorcycle');
    const origin = regions.find((region) => region.id === 'seoul');
    const destination = regions.find((region) => region.id === 'busan');
    const service = services.find((item) => item.id === 'express-bus');
    expect(origin).toBeDefined();
    expect(destination).toBeDefined();
    expect(service).toBeDefined();
    if (!origin || !destination || !service) return;

    const refreshed = refreshLandingDefaultsFor(
      current,
      origin,
      service,
      destination,
    );

    expect(refreshed.primaryKeyword).toBe('서울특별시–부산광역시 고속버스택배');
    expect(refreshed.slug).toBe('seoul-busan-express-bus');
    expect(refreshed.heroImage).toBe(service.image);
    expect(refreshed.ogImage).toBe(service.image);
  });

  it('keeps stable identifiers and custom media for an existing landing', () => {
    const current = {
      ...createLandingDefaults('seoul-gangnam', 'quick-motorcycle'),
      id: 'existing-landing',
      slug: 'stable-existing-url',
      primaryKeyword: '운영 중인 맞춤 키워드',
      heroImage: '/custom-hero.png',
      ogImage: '/custom-og.png',
    };
    const region = regions.find((item) => item.id === 'seoul-seocho');
    const service = services.find((item) => item.id === 'one-ton');
    expect(region).toBeDefined();
    expect(service).toBeDefined();
    if (!region || !service) return;

    const refreshed = refreshLandingDefaultsFor(current, region, service);

    expect(refreshed.slug).toBe('stable-existing-url');
    expect(refreshed.primaryKeyword).toBe('운영 중인 맞춤 키워드');
    expect(refreshed.heroImage).toBe('/custom-hero.png');
    expect(refreshed.ogImage).toBe('/custom-og.png');
  });

  it('allows Gangnam and Gangnam-gu as separate region-service landings', () => {
    const gangnamGu = regions.find((region) => region.id === 'seoul-gangnam');
    const motorcycle = services.find(
      (service) => service.id === 'quick-motorcycle',
    );
    expect(gangnamGu).toBeDefined();
    expect(motorcycle).toBeDefined();
    if (!gangnamGu || !motorcycle) return;

    const gangnam = {
      ...gangnamGu,
      id: 'seoul-gangnam-area',
      name: '강남',
      slug: 'seoul-gangnam-area',
    };
    const gangnamLanding = createLandingDefaultsFor(gangnam, motorcycle);
    const gangnamGuLanding = createLandingDefaultsFor(gangnamGu, motorcycle);

    expect(gangnamLanding.slug).toBe('seoul-gangnam-area-quick-motorcycle');
    expect(gangnamGuLanding.slug).toBe('seoul-gangnam-quick-motorcycle');
    expect(() =>
      assertNoDuplicate(gangnamLanding, [
        { ...landings[0], ...gangnamGuLanding, id: 'qa-gangnam-gu' },
      ]),
    ).not.toThrow();
  });

  it('auto-generates a Korean slug and keeps zero to three body images', () => {
    const base = createLandingDefaults('daegu-dong', 'quick-motorcycle');
    const auto = normalizeLandingInput({
      ...base,
      slug: '',
      primaryKeyword: '대구 동구 퀵서비스',
    });
    expect(auto.slug).toBe('대구-동구-퀵서비스');
    expect(auto.bodyTopImages).toEqual([]);
    expect(() =>
      validateLandingInput({
        ...auto,
        bodyTopImages: [1, 2, 3].map((index) => ({ url: `/qa-${index}.png` })),
      }),
    ).not.toThrow();
    expect(() =>
      validateLandingInput({
        ...auto,
        bodyTopImages: [1, 2, 3, 4].map((index) => ({
          url: `/qa-${index}.png`,
        })),
      }),
    ).toThrow('최대 3장');
  });

  it('keeps an existing published slug stable when the title changes', () => {
    const base = createLandingDefaults('seoul-seocho', 'one-ton');
    const normalized = normalizeLandingInput({
      ...base,
      status: 'PUBLISHED',
      slug: 'stable-published-url',
      title: '변경된 페이지 제목',
    });
    expect(normalized.slug).toBe('stable-published-url');
  });

  it('preserves paragraphs and separates image SEO fields', () => {
    const base = createLandingDefaults('daegu-dong', 'quick-motorcycle');
    const normalized = normalizeLandingInput({
      ...base,
      summary: '첫 문단\n\n둘째 문단',
      sections: [{ heading: '안내', body: '첫 줄\n둘째 줄\n\n셋째 문단' }],
      heroImageAlt: '대구 동구 퀵서비스 차량',
      heroImageName: '대구 동구 퀵서비스',
      heroImageCaption: '대구 동구 당일 배송 안내',
      bodyTopImages: [
        {
          url: '/qa.png',
          alt: '본문 이미지 ALT',
          name: '본문 관리 이름',
          caption: '본문 캡션',
        },
      ],
    });
    expect(normalized.summary).toBe('첫 문단\n\n둘째 문단');
    expect(normalized.sections[0].body).toBe('첫 줄\n둘째 줄\n\n셋째 문단');
    expect(normalized.heroImageAlt).toBe('대구 동구 퀵서비스 차량');
    expect(normalized.heroImageName).toBe('대구 동구 퀵서비스');
    expect(normalized.bodyTopImages?.[0]).toMatchObject({
      alt: '본문 이미지 ALT',
      name: '본문 관리 이름',
      caption: '본문 캡션',
    });
  });
});
