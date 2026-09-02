import type { CompanySettings } from '@/lib/domain';

export const company: CompanySettings = {
  name: '제이복합물류',
  EnglishName: 'J EXPRESS',
  nationalPhone: '1661-0122',
  daeguPhone: '053-955-2005',
  email: null,
  address: null,
  representative: null,
  businessRegistrationNumber: null,
  businessHours: null,
  kakaoUrl: null,
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lovely-tarsier-c21dea.netlify.app').replace(/\/$/, '');

export function telHref(phone: string) {
  return `tel:${phone.replaceAll('-', '')}`;
}

export function phoneForRegion(usesDaeguPhone: boolean) {
  return usesDaeguPhone ? company.daeguPhone : company.nationalPhone;
}
