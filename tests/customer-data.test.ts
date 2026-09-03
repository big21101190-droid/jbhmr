import { describe, expect, it } from 'vitest';
import initialData from '@/data/initial-landings.json';
import { getService, services } from '@/data/services';
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
    expect(withNongong.every((landing) => landing.regionId === 'daegu-dalseong')).toBe(
      true,
    );
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
});
