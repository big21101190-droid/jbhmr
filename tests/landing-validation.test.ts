import { describe, expect, it } from 'vitest';
import initialData from '@/data/initial-landings.json';
import type { Landing } from '@/lib/domain';
import { createLandingDefaults } from '@/lib/landing-defaults';
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

  it('blocks duplicate primary keyword', () => {
    const existing = landings[0];
    const candidate = {
      ...createLandingDefaults('seoul-seocho', 'one-ton'),
      primaryKeyword: existing.primaryKeyword,
    };
    expect(() => assertNoDuplicate(candidate, landings)).toThrow(
      '동일한 대표 키워드가 이미 존재합니다.',
    );
  });

  it('blocks duplicate region and service pair', () => {
    const existing = landings[0];
    const candidate = {
      ...createLandingDefaults(existing.regionId, existing.serviceId),
      slug: 'different-slug',
      primaryKeyword: '완전히 다른 키워드',
    };
    expect(() => assertNoDuplicate(candidate, landings)).toThrow(
      '동일한 지역·서비스 랜딩이 이미 존재합니다.',
    );
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
});
