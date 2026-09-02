import type { Landing } from '@/lib/domain';

export function isPublicLanding(landing: Landing) {
  return landing.status === 'PUBLISHED';
}

export function isSitemapEligible(landing: Landing) {
  return isPublicLanding(landing) && landing.indexPolicy === 'INDEX';
}
