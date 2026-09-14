import { getRegion } from '@/data/regions';
import { getService } from '@/data/services';
import { customerKeywordIntents } from '@/data/customer-keywords';
import { phoneForRegion, telHref } from '@/lib/company';
import type { LandingInput, Region, Service } from '@/lib/domain';
import { withObjectParticle } from '@/lib/korean-particles';
import { getAutomaticLandingSlug } from '@/lib/landing-url';

export function createLandingDefaults(
  regionId: string,
  serviceId: string,
  keyword?: string,
  destinationRegionId?: string,
): LandingInput {
  const region = getRegion(regionId);
  const service = getService(serviceId);
  const destinationRegion = destinationRegionId
    ? getRegion(destinationRegionId)
    : undefined;
  if (!region || !service)
    throw new Error('지역 또는 서비스를 찾을 수 없습니다.');
  if (destinationRegionId && !destinationRegion)
    throw new Error('도착 지역을 찾을 수 없습니다.');
  return createLandingDefaultsFor(
    region,
    service,
    keyword,
    destinationRegion || undefined,
  );
}

export function createLandingDefaultsFor(
  region: Region,
  service: Service,
  keyword?: string,
  destinationRegion?: Region,
): LandingInput {
  const regionId = region.id;
  const serviceId = service.id;
  const routeName = destinationRegion
    ? `${region.name}–${destinationRegion.name}`
    : region.name;
  const primaryKeyword =
    keyword?.trim() || `${routeName} ${service.keywords[0]}`;
  const title = `${routeName} ${service.name}`;
  const phone = phoneForRegion(region.usesDaeguPhone);
  const itemSummary = service.items.slice(0, 5).join(' · ');
  const processSummary = service.process
    .map((step, index) => `${index + 1}. ${step.title} — ${step.body}`)
    .join(' ');
  const heroImage =
    region.usesDaeguPhone && service.group === 'LOCAL'
      ? '/service-local-daegu.svg'
      : service.image;
  const customerAliases = customerKeywordIntents
    .filter(
      (intent) =>
        intent.regionId === regionId &&
        (intent.serviceId === serviceId ||
          (serviceId === 'damas' && intent.serviceId === 'one-ton')),
    )
    .flatMap((intent) => [intent.normalizedKeyword, ...intent.aliases]);
  return {
    regionId,
    destinationRegionId: destinationRegion?.id || null,
    serviceId,
    primaryKeyword,
    secondaryKeywords: [
      ...new Set([`${region.name} 화물배송`, ...customerAliases]),
    ].slice(0, 8),
    // New URLs retain the representative keyword's search intent. Existing
    // records retain their stored slug in refreshLandingDefaultsFor below.
    slug: getAutomaticLandingSlug(primaryKeyword),
    title,
    h1: `${title} 접수 안내`,
    metaTitle: `${title} 상담 | 제이복합물류`,
    metaDescription: `${routeName} ${service.name} 상담. 출발지·도착지와 화물 정보를 확인해 접수 방법을 안내합니다. 전화 ${phone}.`,
    heroImage,
    bodyTopImages: [],
    summary: destinationRegion
      ? `${region.name}에서 ${destinationRegion.name}까지 ${withObjectParticle(service.name)} 화물 조건과 희망 시간에 맞춰 상담합니다. ${service.shortDescription}`
      : `${region.name}에서 출발하거나 도착하는 ${withObjectParticle(service.name)} 화물 조건과 희망 시간에 맞춰 상담합니다. ${service.shortDescription}`,
    sections: [
      {
        heading: `${routeName} ${service.name} 안내`,
        body: destinationRegion
          ? `${region.name} 출발과 ${destinationRegion.name} 도착 조건을 확인합니다. ${service.summary}`
          : `${region.description} ${service.summary}`,
      },
      {
        heading: '취급 품목과 운송 조건',
        body: `${itemSummary} 등을 상담합니다. 실제 접수 가능 여부는 물품의 크기·무게·포장 상태와 운송편 운영 조건을 확인한 뒤 안내합니다.`,
      },
      { heading: '이용 절차', body: processSummary },
      {
        heading: '접수 전에 확인할 내용',
        body: `출발지와 도착지, 물품 종류와 수량, 크기와 무게, 희망 시간을 함께 알려주세요. ${service.trustNotes[0]}`,
      },
    ],
    faq: [
      {
        question: `${routeName} 노선을 바로 접수할 수 있나요?`,
        answer: `네. ${phone}로 화물 정보를 알려주시면 지역·노선·일정에 맞는 운송 방법을 확인해 안내합니다.`,
      },
      ...service.faqs.slice(0, 2),
    ],
    ctaLabel: `${region.name} 접수 ${phone}`,
    ctaLink: telHref(phone),
    relatedRegions: [],
    relatedServices: [],
    status: 'DRAFT',
    indexPolicy: 'INDEX',
    canonical: null,
    ogTitle: `${title} | 제이복합물류`,
    ogDescription: `${routeName} ${service.name}의 취급 품목, 운송 절차와 접수 방법을 확인하세요.`,
    ogImage: heroImage,
    redirectTo: null,
  };
}

export function refreshLandingDefaultsFor(
  current: LandingInput,
  region: Region,
  service: Service,
  destinationRegion?: Region,
): LandingInput {
  const isExistingLanding = Boolean(current.id);
  const defaults = createLandingDefaultsFor(
    region,
    service,
    isExistingLanding ? current.primaryKeyword : undefined,
    destinationRegion,
  );

  if (!isExistingLanding)
    return { ...defaults, bodyTopImages: current.bodyTopImages || [] };

  // Regenerate content explicitly. Preserve current operational/SEO settings,
  // media, relationships, and any future fields unless deliberately listed here.
  return {
    ...current,
    regionId: defaults.regionId,
    destinationRegionId: defaults.destinationRegionId,
    serviceId: defaults.serviceId,
    title: defaults.title,
    h1: defaults.h1,
    summary: defaults.summary,
    sections: defaults.sections,
    faq: defaults.faq,
    secondaryKeywords: defaults.secondaryKeywords,
    metaTitle: defaults.metaTitle,
    metaDescription: defaults.metaDescription,
    ogTitle: defaults.ogTitle,
    ogDescription: defaults.ogDescription,
    ctaLabel: defaults.ctaLabel,
    ctaLink: defaults.ctaLink,
  };
}
