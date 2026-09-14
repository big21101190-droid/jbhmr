import type { Landing, LandingInput } from '@/lib/domain';
import { slugify } from '@/lib/seo';

export type LandingIdentity = Pick<
  Landing,
  | 'id'
  | 'regionId'
  | 'destinationRegionId'
  | 'serviceId'
  | 'primaryKeyword'
  | 'slug'
  | 'title'
>;

export function toLandingIdentity(landing: Landing): LandingIdentity {
  return {
    id: landing.id,
    regionId: landing.regionId,
    destinationRegionId: landing.destinationRegionId,
    serviceId: landing.serviceId,
    primaryKeyword: landing.primaryKeyword,
    slug: landing.slug,
    title: landing.title,
  };
}

/**
 * Compare search intent without changing the customer-facing URL. Spaces and
 * punctuation are presentation differences; meaningful Korean tokens remain.
 */
export function normalizeKeywordIntent(value: string) {
  return value
    .trim()
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '');
}

export function getAutomaticLandingSlug(primaryKeyword: string) {
  return slugify(primaryKeyword);
}

export function findLandingSlugOwner(
  slug: string,
  landings: LandingIdentity[],
  currentId?: string,
) {
  const normalizedSlug = slugify(slug);
  return landings.find(
    (landing) =>
      landing.id !== currentId && slugify(landing.slug) === normalizedSlug,
  );
}

export function findSemanticLandingDuplicate(
  candidate: Pick<
    LandingInput,
    'id' | 'regionId' | 'destinationRegionId' | 'serviceId' | 'primaryKeyword'
  >,
  landings: LandingIdentity[],
) {
  const intent = normalizeKeywordIntent(candidate.primaryKeyword);
  if (!intent) return undefined;
  const destination = candidate.destinationRegionId || null;
  return landings.find(
    (landing) =>
      landing.id !== candidate.id &&
      landing.regionId === candidate.regionId &&
      (landing.destinationRegionId || null) === destination &&
      landing.serviceId === candidate.serviceId &&
      normalizeKeywordIntent(landing.primaryKeyword) === intent,
  );
}

export function suggestMeaningfulLandingSlug(
  primaryKeyword: string,
  serviceSlug: string | undefined,
  landings: LandingIdentity[],
  currentId?: string,
) {
  const base = getAutomaticLandingSlug(primaryKeyword);
  if (!base) return '';
  const serviceSuffix = slugify(serviceSlug || '');
  const candidates = [
    base,
    ...(serviceSuffix && !base.endsWith(`-${serviceSuffix}`)
      ? [`${base}-${serviceSuffix}`]
      : []),
    `${base}-배송`,
  ];
  return (
    candidates.find(
      (candidate) => !findLandingSlugOwner(candidate, landings, currentId),
    ) || ''
  );
}
