import type { CompanySettings } from '@/lib/domain';

export const company: CompanySettings = {
  name: '제이복합물류',
  EnglishName: 'J EXPRESS',
  nationalPhone: '1661-0122',
  daeguPhone: '053-955-2005',
  mobilePhone: '010-3144-2224',
  smsPhone: '010-3144-2224',
  email: 'iaanis@naver.com',
  address: '대구광역시 동구 신암동 258-11, 1층',
  representative: '장대준',
  businessRegistrationNumber: '508-18-63601',
  businessHours: '08:00–19:00',
  kakaoUrl: null,
  legacySiteUrl: 'https://16612237.biz/',
  plannedDomain: '16610122.com',
};

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://lovely-tarsier-c21dea.netlify.app'
).replace(/\/$/, '');

export function telHref(phone: string) {
  return `tel:${phone.replaceAll('-', '')}`;
}

export function smsHref(phone: string) {
  return `sms:${phone.replaceAll('-', '')}`;
}

export function phoneForRegion(usesDaeguPhone: boolean) {
  return usesDaeguPhone ? company.daeguPhone : company.nationalPhone;
}
