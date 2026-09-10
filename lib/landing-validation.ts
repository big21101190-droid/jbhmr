import type { Landing, LandingInput } from '@/lib/domain';
import { slugify } from '@/lib/seo';
import { decodeUrlSegment } from '@/lib/url-segment';

export class LandingValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly existing?: Landing,
    public readonly status = existing ? 409 : 400,
  ) {
    super(message);
    this.name = 'LandingValidationError';
  }
}

export function normalizeLandingInput(input: LandingInput): LandingInput {
  const slugInput = decodeUrlSegment(
    input.slug || input.primaryKeyword || input.title,
  );
  if (slugInput === null)
    throw new LandingValidationError(
      'URL 인코딩을 확인해주세요. 경로 구분자나 특수 제어문자는 사용할 수 없습니다.',
      'slug',
    );
  const normalizedSlug = slugify(slugInput);
  return {
    ...input,
    destinationRegionId: input.destinationRegionId?.trim() || null,
    slug: normalizedSlug,
    title: input.title.trim(),
    h1: (input.h1 || input.title).trim(),
    primaryKeyword: input.primaryKeyword.trim(),
    metaTitle: (input.metaTitle || `${input.title} | 제이복합물류`).trim(),
    metaDescription: input.metaDescription.trim(),
    summary: input.summary.trim(),
    secondaryKeywords: input.secondaryKeywords
      .map((item) => item.trim())
      .filter(Boolean),
    sections: input.sections
      .map((section) => ({
        heading: section.heading.trim(),
        body: section.body.trim(),
      }))
      .filter((section) => section.heading && section.body),
    faq: input.faq
      .map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }))
      .filter((item) => item.question && item.answer),
    canonical: input.canonical?.trim() || null,
    ogTitle: (input.ogTitle || input.title).trim(),
    ogDescription: (input.ogDescription || input.metaDescription).trim(),
    ogImage: input.ogImage || input.heroImage,
    bodyTopImages: (input.bodyTopImages || []).slice(0, 4).map((image) => ({
      url: image.url.trim(),
      alt: image.alt?.trim() || undefined,
      caption: image.caption?.trim() || undefined,
      storageKey: image.storageKey?.trim() || undefined,
    })),
  };
}

export function validateLandingInput(input: LandingInput) {
  const required: Array<[keyof LandingInput, string]> = [
    ['regionId', '지역을 선택해주세요.'],
    ['serviceId', '서비스를 선택해주세요.'],
    ['primaryKeyword', '대표 키워드를 입력해주세요.'],
    ['slug', 'URL을 입력해주세요.'],
    ['title', '페이지 제목을 입력해주세요.'],
    ['h1', 'H1을 입력해주세요.'],
    ['metaTitle', 'SEO 제목을 입력해주세요.'],
    ['metaDescription', '메타 설명을 입력해주세요.'],
    ['summary', '페이지 요약을 입력해주세요.'],
    ['ctaLabel', 'CTA 문구를 입력해주세요.'],
    ['ctaLink', 'CTA 연결 주소를 입력해주세요.'],
  ];
  for (const [field, message] of required) {
    const value = input[field];
    if (typeof value !== 'string' || !value.trim())
      throw new LandingValidationError(message, field);
  }
  if (!/^[a-z0-9가-힣-]+$/.test(input.slug))
    throw new LandingValidationError(
      'URL은 한글, 영문 소문자, 숫자와 하이픈만 사용할 수 있습니다.',
      'slug',
    );
  if (input.slug.length > 100)
    throw new LandingValidationError(
      'URL은 100자 이내로 입력해주세요.',
      'slug',
    );
  if (
    ['admin', 'api', 'services', 'regions', 'delivery', 'contact'].includes(
      input.slug,
    )
  )
    throw new LandingValidationError(
      '사이트에서 사용하는 예약 URL은 사용할 수 없습니다.',
      'slug',
    );
  if (input.metaTitle.length > 70)
    throw new LandingValidationError(
      'SEO 제목은 70자 이내로 입력해주세요.',
      'metaTitle',
    );
  if (input.metaDescription.length > 170)
    throw new LandingValidationError(
      '메타 설명은 170자 이내로 입력해주세요.',
      'metaDescription',
    );
  if (input.sections.length === 0)
    throw new LandingValidationError(
      '본문 내용을 한 개 이상 입력해주세요.',
      'sections',
    );
  if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(input.status))
    throw new LandingValidationError('올바른 공개 상태가 아닙니다.', 'status');
  if (!['INDEX', 'NOINDEX'].includes(input.indexPolicy))
    throw new LandingValidationError(
      '올바른 색인 설정이 아닙니다.',
      'indexPolicy',
    );
  if (!/^(\/|https?:\/\/|tel:)/.test(input.ctaLink))
    throw new LandingValidationError(
      'CTA 연결 주소 형식을 확인해주세요.',
      'ctaLink',
    );
  if ((input.bodyTopImages || []).length > 3)
    throw new LandingValidationError(
      '본문 상단 이미지는 최대 3장까지 등록할 수 있습니다.',
      'bodyTopImages',
    );
  for (const image of input.bodyTopImages || []) {
    if (!image.url || !/^(\/|https?:\/\/)/.test(image.url))
      throw new LandingValidationError(
        '본문 상단 이미지 주소를 확인해주세요.',
        'bodyTopImages',
      );
  }
}

export function assertNoDuplicate(
  candidate: LandingInput,
  existing: Landing[],
) {
  const currentId = candidate.id;
  const active = existing.filter((item) => item.id !== currentId);
  const sameSlug = active.find(
    (item) => slugify(item.slug) === slugify(candidate.slug),
  );
  if (sameSlug)
    throw new LandingValidationError(
      '동일한 URL이 이미 존재합니다.',
      'slug',
      sameSlug,
    );
}
