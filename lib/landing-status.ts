import type { IndexPolicy, PublicationStatus } from '@/lib/domain';

export function publicationStatusLabel(status: PublicationStatus) {
  switch (status) {
    case 'PUBLISHED':
      return '공개 · 웹사이트에서 접속 가능';
    case 'ARCHIVED':
      return '보관 · 공개 URL과 sitemap에서 제외';
    default:
      return '비공개 · 관리자만 확인 가능';
  }
}

export function indexPolicyLabel(policy: IndexPolicy) {
  return policy === 'NOINDEX'
    ? '검색 제외 · 검색엔진 수집 대상에서 제외'
    : '검색 허용 · 검색엔진 수집 가능';
}
