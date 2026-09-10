import type { Metadata } from 'next';
import {
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Route,
} from 'lucide-react';
import { ContactCta } from '@/components/contact-cta';
import { JsonLd } from '@/components/json-ld';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE_URL, company, nationwideCoverage, telHref } from '@/lib/company';

export const metadata: Metadata = {
  title: '회사소개',
  description:
    '대구 퀵서비스부터 전국 화물과 도시 간·제주 연계 배송까지 상담하는 제이복합물류를 소개합니다.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="bg-[#f4f7fb]">
      <SiteHeader />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: company.name,
          url: SITE_URL,
          telephone: company.nationalPhone,
          email: company.email,
          taxID: company.businessRegistrationNumber,
          address: company.address,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: company.nationalPhone,
            contactType: 'customer service',
            areaServed: 'KR',
          },
        }}
      />
      <PageHero
        eyebrow="ABOUT J EXPRESS"
        title={
          <>
            필요한 운송을
            <br />
            <span className="text-[#78a0ff]">한곳에서 상담</span>
          </>
        }
        description="제이복합물류는 출발지, 도착지와 화물 조건을 확인해 지역 차량부터 도시 간·제주 연계까지 가능한 운송 방법을 안내합니다."
        action={
          <a
            href={telHref(company.nationalPhone)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1b4dff] px-6 py-4 font-black text-white"
          >
            <Phone size={18} /> 전국 {company.nationalPhone}
          </a>
        }
      />

      <section className="bg-white px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">
              OUR ROLE
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">
              조건을 듣고
              <br /> 방법을 연결합니다
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [
                MapPin,
                '지역 확인',
                '서울·인천·경기 수도권부터 전국 주요 도시까지 출발지와 도착지를 확인합니다.',
              ],
              [
                Route,
                '운송 확인',
                '화물과 구간에 맞춰 차량·버스·KTX·항공·선박 연계를 상담합니다.',
              ],
              [
                CheckCircle2,
                '접수 안내',
                '노선과 품목 가능 여부, 일정과 요금을 확인한 뒤 진행 방법을 안내합니다.',
              ],
            ].map(([Icon, title, body]) => {
              const CardIcon = Icon as typeof MapPin;
              return (
                <article
                  key={String(title)}
                  className="rounded-2xl border border-[#dce5f0] bg-[#f9fbfd] p-6"
                >
                  <CardIcon className="text-[#1b4dff]" />
                  <h3 className="mt-6 font-black">{String(title)}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                    {String(body)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Building2 className="text-[#1b4dff]" size={36} />
            <p className="mt-6 text-xs font-black tracking-[.16em] text-[#1b4dff]">
              COMPANY INFORMATION
            </p>
            <h2 className="mt-3 text-3xl font-black">공식 운영정보</h2>
            <p className="mt-5 text-sm leading-7 text-[#667085]">
              화물자동차 운송주선사업 허가를 바탕으로 서비스를 안내합니다. 보험
              적용 여부와 보상 범위는 실제 운송 건과 품목에 따라 접수 시
              확인합니다.
            </p>
          </div>
          <dl className="grid overflow-hidden rounded-2xl border border-[#dce5f0] bg-white sm:grid-cols-2">
            {[
              ['상호', company.name],
              ['대표자', company.representative],
              ['사업자등록번호', company.businessRegistrationNumber],
              ['전국 배송', '서울·인천·경기 수도권 및 전국 주요 도시 배송'],
              ['전국 대표전화', company.nationalPhone],
              ['주요 서비스 지역', nationwideCoverage],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-b border-[#dce5f0] p-5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <dt className="text-xs font-black text-[#1b4dff]">{label}</dt>
                <dd className="mt-2 text-sm font-bold leading-6 text-[#344054]">
                  {value}
                </dd>
              </div>
            ))}
            <div className="border-b border-[#dce5f0] p-5 sm:border-b-0">
              <dt className="flex items-center gap-2 text-xs font-black text-[#1b4dff]">
                <Clock3 size={15} /> 상담 운영시간
              </dt>
              <dd className="mt-2 text-sm font-bold text-[#344054]">
                {company.businessHours}
              </dd>
            </div>
            <div className="p-5">
              <dt className="flex items-center gap-2 text-xs font-black text-[#1b4dff]">
                <Mail size={15} /> 이메일
              </dt>
              <dd className="mt-2 break-all text-sm font-bold text-[#344054]">
                {company.email}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <ContactCta />
      <SiteFooter />
      <PhoneFab phone={company.nationalPhone} />
    </main>
  );
}
