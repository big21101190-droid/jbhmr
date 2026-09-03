import { describe, expect, it } from 'vitest';
import initialData from '@/data/initial-landings.json';
import {
  customerKeywordAudit,
  customerKeywordIntents,
} from '@/data/customer-keywords';
import { getRegion } from '@/data/regions';
import { getService, services } from '@/data/services';
import imageManifest from '@/IMAGE_MANIFEST.json';
import { company, phoneForRegion } from '@/lib/company';
import type { Landing } from '@/lib/domain';

const landings = initialData as Landing[];

describe('customer-provided operating data', () => {
  it('keeps the canonical company contact details in one source of truth', () => {
    expect(company).toMatchObject({
      name: '제이복합물류',
      representative: '장대준',
      businessRegistrationNumber: '508-18-63601',
      nationalPhone: '1661-0122',
      daeguPhone: '053-955-2005',
      smsPhone: '010-3144-2224',
      email: 'iaanis@naver.com',
      businessHours: '08:00–19:00',
    });
    expect(phoneForRegion(true)).toBe('053-955-2005');
    expect(phoneForRegion(false)).toBe('1661-0122');
  });

  it('preserves all nine services and five independent detailed services', () => {
    expect(services).toHaveLength(9);
    expect(
      services
        .filter((service) => service.contentStatus === 'CONFIRMED_DETAIL')
        .map((service) => service.id),
    ).toEqual(['express-bus', 'ktx', 'jeju-air', 'jeju-sea', 'golf-bag']);
  });

  it('matches every customer-provided golf-bag price', () => {
    expect(getService('golf-bag')?.pricing?.groups).toEqual([
      {
        title: '수도권 출발 내륙 직배송 · 편도',
        columns: ['도착 권역', '캐디백 1~2개', '캐디백 3~4개'],
        rows: [
          ['충청도', '100,000원', '100,000원'],
          ['경북', '100,000원', '130,000원'],
          ['경남', '130,000원', '150,000원'],
          ['전북', '120,000원', '150,000원'],
          ['전남', '130,000원', '170,000원'],
          ['강원', '130,000원', '170,000원'],
        ],
      },
      {
        title: '제주 항공 연계 · 편도',
        columns: ['도착지', '1개', '2개', '3개', '4개'],
        rows: [
          ['제주', '150,000원', '170,000원', '180,000원', '200,000원'],
          ['서귀포', '170,000원', '190,000원', '210,000원', '220,000원'],
        ],
      },
    ]);
  });

  it('limits Nongong-specific copy to the three Dalseong landings', () => {
    const withNongong = landings.filter((landing) =>
      landing.sections.some((section) => section.body.includes('논공읍')),
    );
    expect(withNongong.map((landing) => landing.id)).toEqual([
      'initial-022',
      'initial-023',
      'initial-024',
    ]);
    expect(
      withNongong.every((landing) => landing.regionId === 'daegu-dalseong'),
    ).toBe(true);
  });

  it('does not publish held absolute insurance or licence-number claims', () => {
    const publicData = JSON.stringify({ company, services, landings });
    for (const held of [
      '100% 적용',
      '완벽한 보호',
      '원천 차단',
      '제2024-05호',
      '정부 표준약관',
      '365일 24시간',
    ]) {
      expect(publicData).not.toContain(held);
    }
  });

  it('normalizes customer keywords without duplicating source intents', () => {
    expect(customerKeywordAudit).toMatchObject({
      rawCount: 49,
      exactUniqueCount: 47,
      normalizedIntentCount: 46,
    });
    expect(customerKeywordAudit.duplicates).toHaveLength(2);
    expect(
      customerKeywordIntents.find(
        (intent) => intent.normalizedKeyword === '캐리어 배송',
      )?.aliases,
    ).toContain('케리어배송');
    expect(
      customerKeywordIntents.filter(
        (intent) => intent.serviceId === 'express-bus',
      ),
    ).toHaveLength(13);
  });

  it('uses the correct phone policy for Daegu and nearby Gyeongsan areas', () => {
    const expectations = [
      ['daegu', '053-955-2005'],
      ['daegu-dong', '053-955-2005'],
      ['daegu-suseong', '053-955-2005'],
      ['daegu-dalseong', '053-955-2005'],
      ['daegu-dasa', '053-955-2005'],
      ['daegu-seongseo', '053-955-2005'],
      ['gyeongbuk-gyeongsan', '1661-0122'],
      ['gyeongbuk-jillyang', '1661-0122'],
      ['gyeongbuk-hayang', '1661-0122'],
      ['seoul', '1661-0122'],
      ['busan', '1661-0122'],
    ] as const;

    for (const [regionId, phone] of expectations) {
      const region = getRegion(regionId);
      expect(region, regionId).toBeTruthy();
      expect(phoneForRegion(Boolean(region?.usesDaeguPhone)), regionId).toBe(
        phone,
      );
    }
    expect(getRegion('gyeongbuk-hayang')?.administrativeParentId).toBe(
      'gyeongbuk-gyeongsan',
    );
    expect(getRegion('gyeongbuk-jillyang')?.administrativeParentId).toBe(
      'gyeongbuk-gyeongsan',
    );
  });

  it('keeps Daegu landing images free of the embedded nationwide number', () => {
    const daeguLandings = landings.filter((landing) =>
      landing.regionId.startsWith('daegu-'),
    );
    expect(daeguLandings).toHaveLength(30);
    expect(
      daeguLandings.every(
        (landing) =>
          landing.heroImage === '/service-local-daegu.svg' &&
          landing.ogImage === '/service-local-daegu.svg',
      ),
    ).toBe(true);
  });

  it('validates the complete customer image inventory and safe service mapping', () => {
    expect(imageManifest.total).toBe(53);
    expect(imageManifest.categoryCounts).toEqual({
      KTX: 18,
      고속버스: 6,
      '골프백(캐디백)': 6,
      제주항공선박: 17,
      '퀵서비스 화물용달': 6,
    });
    expect(imageManifest.summary).toMatchObject({
      used: 6,
      unused: 7,
      rejected: 40,
      embeddedText: 45,
      operatingHoursConflicts: 19,
      priceConflicts: 2,
    });
    expect(getService('express-bus')?.image).toBe('/service-bus.png');
    expect(getService('express-bus')?.routeIntents).toHaveLength(13);
    expect(getService('ktx')?.image).toBe('/service-ktx.jpg');
    expect(getService('jeju-air')?.image).toBe('/service-jeju.png');
    expect(getService('jeju-sea')?.image).toBe('/service-jeju-sea.svg');
    expect(getService('quick-motorcycle')?.image).toBe('/service-quick.svg');
    expect(getService('damas')?.image).toBe('/service-damas.svg');
    expect(getService('one-ton')?.image).toBe('/service-freight.png');
    expect(getService('golf-bag')?.image).toBe('/service-golf.png');
    expect(getService('suitcase')?.image).toBe('/service-suitcase.svg');
    expect(
      imageManifest.images.find((image) =>
        image.filename.includes('배송요금표'),
      )?.publicUse,
    ).toBe('REJECTED');
  });
});
