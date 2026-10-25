import type { Landing } from '@/lib/domain';

// This exact test URL was explicitly retired by the site owner.
// Do not broaden this to a QA prefix: other operational URLs must survive.
export function isRetiredLandingSlug(slug: string) {
  return slug.normalize('NFC') === 'qa-삭제-e2e-검증-랜딩';
}

export function isPublicLanding(landing: Landing) {
  return landing.status === 'PUBLISHED' && !isRetiredLandingSlug(landing.slug);
}

export function isSitemapEligible(landing: Landing) {
  return isPublicLanding(landing) && landing.indexPolicy === 'INDEX';
}
