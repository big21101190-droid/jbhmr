import 'server-only';

import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import { regions as seedRegions } from '@/data/regions';
import { services as seedServices } from '@/data/services';
import type { Region, Service, ServiceRouteIntent } from '@/lib/domain';
import { slugify } from '@/lib/seo';
import { decodeUrlSegment } from '@/lib/url-segment';
import { getServiceRouteSlug, getServiceRoutes } from '@/lib/service-routes';

const storeName = 'j-complex-logistics-content';
const seedRegionIds = new Set(seedRegions.map((item) => item.id));
const seedServiceIds = new Set(seedServices.map((item) => item.id));

export class CatalogValidationError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
    public readonly field?: string,
  ) {
    super(message);
    this.name = 'CatalogValidationError';
  }
}

function contentStore() {
  return getStore({ name: storeName, consistency: 'strong' });
}

async function getRecords<T>(prefix: 'regions/' | 'services/') {
  try {
    const store = contentStore();
    const { blobs } = await store.list({ prefix });
    const records = await Promise.all(
      blobs.map(
        (blob) => store.get(blob.key, { type: 'json' }) as Promise<T | null>,
      ),
    );
    return records.filter((record) => record !== null) as T[];
  } catch (error) {
    if (process.env.NODE_ENV !== 'production')
      console.warn(
        `Netlify Blobs unavailable for ${prefix}; using seed data.`,
        error,
      );
    return [];
  }
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function normalizeRouteIntents(
  raw: ServiceRouteIntent[] | undefined,
  previous: ServiceRouteIntent[] | undefined,
  serviceName: string,
  serviceSlug: string,
) {
  const input = raw === undefined ? previous || [] : raw;
  const routes = input.map((route, index) => {
    const origin = cleanText(route.origin, 100);
    const destination = cleanText(route.destination, 100);
    if (!origin || !destination)
      throw new CatalogValidationError(
        '주요 노선은 출발지와 도착지를 모두 입력해주세요.',
        400,
        'routeIntents',
      );
    const normalized: ServiceRouteIntent = {
      origin,
      destination,
      label:
        cleanText(route.label, 160) ||
        `${origin}–${destination} ${serviceName}`,
      source: cleanText(route.source, 200) || '관리자 입력',
      slug: cleanText(route.slug, 120) || undefined,
      active: route.active !== false,
      sortOrder: Number.isFinite(Number(route.sortOrder))
        ? Number(route.sortOrder)
        : index,
    };
    return normalized;
  });
  const seen = new Set<string>();
  for (const route of routes) {
    const routeSlug = getServiceRouteSlug({ slug: serviceSlug }, route);
    if (seen.has(routeSlug))
      throw new CatalogValidationError(
        `중복된 주요 노선 URL이 있습니다: ${routeSlug}`,
        409,
        'routeIntents',
      );
    seen.add(routeSlug);
  }
  return routes;
}

function normalizeRegion(raw: Partial<Region>, previous?: Region): Region {
  const name = cleanText(raw.name ?? previous?.name, 100);
  if (!name)
    throw new CatalogValidationError('지역명을 입력해주세요.', 400, 'name');
  const slug = slugify(
    cleanText(raw.slug === undefined ? previous?.slug : raw.slug, 100) || name,
  );
  if (!slug)
    throw new CatalogValidationError('지역 URL을 확인해주세요.', 400, 'slug');
  const type = raw.type || previous?.type || 'AREA';
  if (!['METRO', 'PROVINCE', 'DISTRICT', 'CITY', 'AREA'].includes(type))
    throw new CatalogValidationError(
      '올바른 지역 유형이 아닙니다.',
      400,
      'type',
    );
  const now = new Date().toISOString();
  return {
    id: previous?.id || raw.id || randomUUID(),
    name,
    slug,
    parentId:
      raw.parentId === undefined
        ? (previous?.parentId ?? null)
        : raw.parentId || null,
    parentName: null,
    type,
    description:
      cleanText(raw.description ?? previous?.description, 800) ||
      `${name}의 배송 접수 정보를 안내합니다.`,
    nearbyRegions: raw.nearbyRegions || previous?.nearbyRegions || [],
    active: raw.active ?? previous?.active ?? true,
    sortOrder: Number.isFinite(Number(raw.sortOrder))
      ? Number(raw.sortOrder)
      : (previous?.sortOrder ?? 1000),
    usesDaeguPhone: raw.usesDaeguPhone ?? previous?.usesDaeguPhone ?? false,
    administrativeParentId:
      raw.administrativeParentId ?? previous?.administrativeParentId,
    archived: raw.archived ?? previous?.archived ?? false,
    createdAt: previous?.createdAt || now,
    updatedAt: now,
  };
}

function normalizeService(raw: Partial<Service>, previous?: Service): Service {
  const name = cleanText(raw.name ?? previous?.name, 100);
  if (!name)
    throw new CatalogValidationError('서비스명을 입력해주세요.', 400, 'name');
  const slug = slugify(
    cleanText(raw.slug === undefined ? previous?.slug : raw.slug, 100) || name,
  );
  if (!slug)
    throw new CatalogValidationError('서비스 URL을 확인해주세요.', 400, 'slug');
  const group = raw.group || previous?.group || 'LOCAL';
  if (!['LOCAL', 'INTERCITY', 'JEJU', 'TRAVEL'].includes(group))
    throw new CatalogValidationError(
      '올바른 서비스 그룹이 아닙니다.',
      400,
      'group',
    );
  const shortDescription =
    cleanText(raw.shortDescription ?? previous?.shortDescription, 300) ||
    `${name}의 접수 가능 여부와 운송 조건을 상담합니다.`;
  const description =
    cleanText(raw.description ?? previous?.description, 1200) ||
    shortDescription;
  const now = new Date().toISOString();
  const keywords = (raw.keywords || previous?.keywords || [name])
    .map((item) => cleanText(item, 100))
    .filter(Boolean)
    .slice(0, 30);
  const routeIntents = normalizeRouteIntents(
    raw.routeIntents,
    previous?.routeIntents,
    name,
    slug,
  );
  return {
    id: previous?.id || raw.id || randomUUID(),
    name,
    slug,
    group,
    shortDescription,
    description,
    keywords: keywords.length ? keywords : [name],
    image:
      cleanText(raw.image ?? previous?.image, 500) || '/service-freight.png',
    imageAlt:
      cleanText(raw.imageAlt ?? previous?.imageAlt, 200) ||
      `${name} 안내 이미지`,
    contentStatus:
      raw.contentStatus || previous?.contentStatus || 'CONFIRMED_BASIC',
    heroTitle:
      cleanText(raw.heroTitle ?? previous?.heroTitle, 120) ||
      '필요한 운송을 상담하는',
    heroAccent: cleanText(raw.heroAccent ?? previous?.heroAccent, 120) || name,
    summary: cleanText(raw.summary ?? previous?.summary, 800) || description,
    facts: raw.facts ||
      previous?.facts || [
        { label: '접수 안내', value: '출발지·도착지와 화물 조건 확인 후 안내' },
        { label: '전국 접수', value: '1661-0122' },
      ],
    items: raw.items || previous?.items || ['상담 시 품목 확인'],
    transport: raw.transport ||
      previous?.transport || ['화물 조건에 맞는 운송편'],
    areas: raw.areas || previous?.areas || ['가능 지역 상담'],
    process: raw.process ||
      previous?.process || [
        {
          title: '정보 접수',
          body: '출발지, 도착지와 화물 정보를 알려주세요.',
        },
        { title: '운송 확인', body: '가능한 운송편과 일정을 확인합니다.' },
        {
          title: '접수 안내',
          body: '확인된 조건을 기준으로 접수를 안내합니다.',
        },
      ],
    pricing:
      raw.pricing === undefined ? (previous?.pricing ?? null) : raw.pricing,
    trustNotes: raw.trustNotes ||
      previous?.trustNotes || [
        '실제 접수 가능 여부와 조건은 상담 시 확인합니다.',
      ],
    routeIntents,
    provenance: raw.provenance ||
      previous?.provenance || [
        { source: '관리자 입력', note: '고객이 관리자에서 등록한 서비스' },
      ],
    faqs: raw.faqs || previous?.faqs || [],
    active: raw.active ?? previous?.active ?? true,
    sortOrder: Number.isFinite(Number(raw.sortOrder))
      ? Number(raw.sortOrder)
      : (previous?.sortOrder ?? 1000),
    archived: raw.archived ?? previous?.archived ?? false,
    createdAt: previous?.createdAt || now,
    updatedAt: now,
  };
}

export async function listRegions(options: { includeArchived?: boolean } = {}) {
  const overrides = await getRecords<Region>('regions/');
  const byId = new Map<string, Region>(
    seedRegions.map((item) => [item.id, { ...item, archived: false }]),
  );
  for (const item of overrides) byId.set(item.id, item);
  const records = [...byId.values()].map((item) => ({
    ...item,
    parentName: item.parentId
      ? byId.get(item.parentId)?.name || item.parentName
      : null,
  }));
  return records
    .filter((item) => options.includeArchived || !item.archived)
    .sort(
      (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'ko'),
    );
}

export async function getRegionRecord(
  idOrSlug: string,
  includeArchived = true,
) {
  const lookup = decodeUrlSegment(idOrSlug);
  if (lookup === null) return null;
  return (
    (await listRegions({ includeArchived })).find(
      (item) => item.id === lookup || item.slug.normalize('NFC') === lookup,
    ) || null
  );
}

export async function saveRegion(raw: Partial<Region>) {
  const records = await listRegions({ includeArchived: true });
  const previous = raw.id
    ? records.find((item) => item.id === raw.id)
    : undefined;
  const record = normalizeRegion(raw, previous);
  const duplicate = records.find(
    (item) =>
      item.id !== record.id &&
      item.slug.toLowerCase() === record.slug.toLowerCase(),
  );
  if (duplicate)
    throw new CatalogValidationError(
      '동일한 지역 URL이 이미 존재합니다.',
      409,
      'slug',
    );
  if (record.parentId) {
    const parent = records.find(
      (item) => item.id === record.parentId && !item.archived,
    );
    if (!parent)
      throw new CatalogValidationError(
        '상위 지역을 찾을 수 없습니다.',
        400,
        'parentId',
      );
    if (parent.id === record.id)
      throw new CatalogValidationError(
        '자기 자신을 상위 지역으로 지정할 수 없습니다.',
        400,
        'parentId',
      );
    let cursor: Region | undefined = parent;
    while (cursor?.parentId) {
      if (cursor.parentId === record.id)
        throw new CatalogValidationError(
          '지역 계층을 순환하도록 설정할 수 없습니다.',
          400,
          'parentId',
        );
      cursor = records.find((item) => item.id === cursor?.parentId);
    }
    record.parentName = parent.name;
  }
  await contentStore().setJSON(`regions/${record.id}.json`, record);
  return record;
}

export async function deleteRegion(id: string, usageCount: number) {
  if (seedRegionIds.has(id))
    throw new CatalogValidationError(
      '초기 지역은 삭제할 수 없습니다. 비활성 또는 보관을 사용해주세요.',
      409,
    );
  const children = (await listRegions({ includeArchived: true })).filter(
    (item) => item.parentId === id && !item.archived,
  );
  if (children.length)
    throw new CatalogValidationError(
      `하위 지역 ${children.length}개가 있어 삭제할 수 없습니다.`,
      409,
    );
  if (usageCount)
    throw new CatalogValidationError(
      `현재 이 지역을 사용하는 랜딩페이지가 ${usageCount}개 있습니다.`,
      409,
    );
  await contentStore().delete(`regions/${id}.json`);
}

export async function listServices(
  options: { includeArchived?: boolean } = {},
) {
  const overrides = await getRecords<Service>('services/');
  const byId = new Map<string, Service>(
    seedServices.map((item) => [item.id, { ...item, archived: false }]),
  );
  for (const item of overrides) byId.set(item.id, item);
  return [...byId.values()]
    .filter((item) => options.includeArchived || !item.archived)
    .sort(
      (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'ko'),
    );
}

export async function getServiceRecord(
  idOrSlug: string,
  includeArchived = true,
) {
  const lookup = decodeUrlSegment(idOrSlug);
  if (lookup === null) return null;
  return (
    (await listServices({ includeArchived })).find(
      (item) => item.id === lookup || item.slug.normalize('NFC') === lookup,
    ) || null
  );
}

export async function saveService(raw: Partial<Service>) {
  const records = await listServices({ includeArchived: true });
  const previous = raw.id
    ? records.find((item) => item.id === raw.id)
    : undefined;
  const record = normalizeService(raw, previous);
  const duplicate = records.find(
    (item) =>
      item.id !== record.id &&
      item.slug.toLowerCase() === record.slug.toLowerCase(),
  );
  if (duplicate)
    throw new CatalogValidationError(
      '동일한 서비스 URL이 이미 존재합니다.',
      409,
      'slug',
    );
  const otherRouteSlugs = new Set(
    records
      .filter((item) => item.id !== record.id)
      .flatMap((item) => getServiceRoutes(item).map((route) => route.slug)),
  );
  const duplicateRoute = getServiceRoutes(record).find((route) =>
    otherRouteSlugs.has(route.slug),
  );
  if (duplicateRoute)
    throw new CatalogValidationError(
      `다른 서비스에서 같은 주요 노선 URL을 사용 중입니다: ${duplicateRoute.slug}`,
      409,
      'routeIntents',
    );
  await contentStore().setJSON(`services/${record.id}.json`, record);
  return record;
}

export async function deleteService(id: string, usageCount: number) {
  if (seedServiceIds.has(id))
    throw new CatalogValidationError(
      '초기 서비스는 삭제할 수 없습니다. 비활성 또는 보관을 사용해주세요.',
      409,
    );
  if (usageCount)
    throw new CatalogValidationError(
      `현재 이 서비스를 사용하는 랜딩페이지가 ${usageCount}개 있습니다.`,
      409,
    );
  await contentStore().delete(`services/${id}.json`);
}
