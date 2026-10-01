import { describe, expect, it } from 'vitest';
import { indexPolicyLabel, publicationStatusLabel } from '@/lib/landing-status';

describe('landing operating-state labels', () => {
  it('explains public visibility separately from search indexing', () => {
    expect(publicationStatusLabel('PUBLISHED')).toBe(
      '공개 · 웹사이트에서 접속 가능',
    );
    expect(publicationStatusLabel('DRAFT')).toBe(
      '비공개 · 관리자만 확인 가능',
    );
    expect(publicationStatusLabel('ARCHIVED')).toBe(
      '보관 · 공개 URL과 sitemap에서 제외',
    );
    expect(indexPolicyLabel('INDEX')).toBe(
      '검색 허용 · 검색엔진 수집 가능',
    );
    expect(indexPolicyLabel('NOINDEX')).toBe(
      '검색 제외 · 검색엔진 수집 대상에서 제외',
    );
  });
});
