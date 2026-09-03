import rawSource from '@/data/customer-keywords.raw.json';

export type CustomerKeywordType =
  | 'LOCAL_SERVICE'
  | 'VEHICLE_SERVICE'
  | 'ROUTE_SERVICE';

export type CustomerKeywordIntent = {
  normalizedKeyword: string;
  type: CustomerKeywordType;
  regionId: string | null;
  serviceId: string;
  aliases: string[];
  priority: 'HIGH' | 'NORMAL';
  sourceLines: number[];
  rawVariants: string[];
  origin: string | null;
  destination: string | null;
};

type RawKeywordLine = {
  sourceLine: number;
  section: string;
  raw: string;
};

const regionPrefixes = [
  ['대구달성군', '대구 달성군', 'daegu-dalseong'],
  ['대구달서구', '대구 달서구', 'daegu-dalseo'],
  ['대구수성구', '대구 수성구', 'daegu-suseong'],
  ['대구남구', '대구 남구', 'daegu-nam'],
  ['대구동구', '대구 동구', 'daegu-dong'],
  ['대구북구', '대구 북구', 'daegu-buk'],
  ['대구서구', '대구 서구', 'daegu-seo'],
  ['대구중구', '대구 중구', 'daegu-jung'],
  ['진량', '경산 진량', 'gyeongbuk-jillyang'],
  ['하양', '경산 하양', 'gyeongbuk-hayang'],
  ['경산', '경북 경산', 'gyeongbuk-gyeongsan'],
  ['다사', '대구 다사', 'daegu-dasa'],
  ['성서', '대구 성서', 'daegu-seongseo'],
  ['대구', '대구', 'daegu'],
] as const;

function findRegion(raw: string) {
  return regionPrefixes.find(([prefix]) => raw.startsWith(prefix)) ?? null;
}

function normalizeLine(
  line: RawKeywordLine,
): Omit<CustomerKeywordIntent, 'sourceLines' | 'rawVariants'> {
  const raw = line.raw;

  if (raw.includes('고속버스택배')) {
    const destination = raw.match(/^서울(.+?)\s*고속버스택배$/)?.[1] ?? '';
    return {
      normalizedKeyword: `서울–${destination} 고속버스택배`,
      type: 'ROUTE_SERVICE',
      regionId: null,
      serviceId: 'express-bus',
      aliases: [raw],
      priority: 'HIGH',
      origin: '서울',
      destination,
    };
  }

  if (raw.includes('항공화물')) {
    const destination = raw.includes('서귀포') ? '서귀포' : '제주';
    return {
      normalizedKeyword: `서울–${destination} 항공화물`,
      type: 'ROUTE_SERVICE',
      regionId: null,
      serviceId: 'jeju-air',
      aliases: [raw],
      priority: 'HIGH',
      origin: '서울',
      destination,
    };
  }

  if (raw === '골프백배송' || raw === '케리어배송') {
    const carrier = raw === '케리어배송';
    return {
      normalizedKeyword: carrier ? '캐리어 배송' : '골프백 배송',
      type: 'VEHICLE_SERVICE',
      regionId: null,
      serviceId: carrier ? 'suitcase' : 'golf-bag',
      aliases: carrier
        ? ['케리어배송', '캐리어배송']
        : ['골프백배송', '캐디백배송'],
      priority: 'NORMAL',
      origin: null,
      destination: null,
    };
  }

  const region = findRegion(raw);
  if (!region)
    throw new Error(
      `Unknown customer keyword region at line ${line.sourceLine}: ${raw}`,
    );
  const [, displayName, regionId] = region;
  const primaryToken = raw.split(/\s+/)[0];
  const freight =
    primaryToken.includes('용달화물') || primaryToken.includes('1톤화물');

  return {
    normalizedKeyword: freight
      ? `${displayName} ${primaryToken.includes('1톤화물') ? '1톤 화물' : '용달화물'}`
      : `${displayName} 퀵서비스`,
    type: freight ? 'VEHICLE_SERVICE' : 'LOCAL_SERVICE',
    regionId,
    serviceId: freight ? 'one-ton' : 'quick-motorcycle',
    aliases: freight
      ? [`${displayName} 다마스 배송`, `${displayName} 1톤 화물`]
      : [
          `${displayName} 오토바이 퀵`,
          `${displayName} 다마스 배송`,
          `${displayName} 1톤 용달`,
        ],
    priority: 'HIGH',
    origin: null,
    destination: null,
  };
}

export function normalizeCustomerKeywords(lines: RawKeywordLine[]) {
  const byIntent = new Map<string, CustomerKeywordIntent>();

  for (const line of lines) {
    const normalized = normalizeLine(line);
    const key = [
      normalized.type,
      normalized.serviceId,
      normalized.regionId,
      normalized.origin,
      normalized.destination,
      normalized.normalizedKeyword,
    ].join('|');
    const existing = byIntent.get(key);
    if (existing) {
      existing.sourceLines.push(line.sourceLine);
      if (!existing.rawVariants.includes(line.raw))
        existing.rawVariants.push(line.raw);
      existing.aliases = [
        ...new Set([...existing.aliases, line.raw, ...normalized.aliases]),
      ];
      continue;
    }
    byIntent.set(key, {
      ...normalized,
      aliases: [...new Set([line.raw, ...normalized.aliases])],
      sourceLines: [line.sourceLine],
      rawVariants: [line.raw],
    });
  }

  return [...byIntent.values()];
}

export const customerKeywordIntents = normalizeCustomerKeywords(
  rawSource.keywordLines as RawKeywordLine[],
);

export const customerKeywordAudit = {
  rawCount: rawSource.rawKeywordCount,
  exactUniqueCount: new Set(
    rawSource.keywordLines.map((line) => line.raw.replaceAll(' ', '')),
  ).size,
  normalizedIntentCount: customerKeywordIntents.length,
  duplicates: rawSource.keywordLines
    .filter(
      (line, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.raw.replaceAll(' ', '') === line.raw.replaceAll(' ', ''),
        ) !== index,
    )
    .map((line) => ({ sourceLine: line.sourceLine, raw: line.raw })),
};
