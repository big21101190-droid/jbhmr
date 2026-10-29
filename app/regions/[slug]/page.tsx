import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  Route,
  ShieldCheck,
} from 'lucide-react';
import { ContactCta } from '@/components/contact-cta';
import { JsonLd } from '@/components/json-ld';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ShippingDecisionGuide } from '@/components/shipping-decision-guide';
import { regions as seedRegions } from '@/data/regions';
import {
  getRegionRecord,
  listRegions,
  listServices,
} from '@/lib/catalog-store';
import { phoneForRegion, telHref } from '@/lib/company';
import { listLandings } from '@/lib/landing-store';
import { getRegionSeoContent, regionFaqSchema } from '@/lib/region-seo';
import { regionalShippingNotes } from '@/lib/regional-shipping-notes';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return seedRegions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const region = await getRegionRecord((await params).slug);
  if (!region || region.archived || !region.active) notFound();
  const content = getRegionSeoContent(region);
  return {
    title: content.seoTitle,
    description: content.metaDescription,
    alternates: { canonical: `/regions/${region.slug}` },
    openGraph: {
      title: `${content.seoTitle} | 제이복합물류`,
      description: content.metaDescription,
      url: `/regions/${region.slug}`,
    },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const region = await getRegionRecord((await params).slug);
  if (!region || region.archived || !region.active) notFound();
  const [regions, services, published] = await Promise.all([
    listRegions(),
    listServices(),
    listLandings({ publishedOnly: true }),
  ]);
  const content = getRegionSeoContent(region, services);
  const children = regions.filter(
    (item) => item.parentId === region.id && item.active && !item.archived,
  );
  const ids = new Set([region.id, ...children.map((item) => item.id)]);
  const landings = published.filter(
    (item) =>
      ids.has(item.regionId) ||
      Boolean(item.destinationRegionId && ids.has(item.destinationRegionId)),
  );
  const parent = regions.find(
    (item) =>
      item.id === (region.administrativeParentId || region.parentId) &&
      item.active &&
      !item.archived,
  );
  const nearby = regions.filter(
    (item) =>
      region.nearbyRegions.includes(item.id) && item.active && !item.archived,
  );
  const serviceLinks = content.directLinks.filter((link) =>
    link.href.startsWith('/services/'),
  );
  const routes = content.directLinks.filter((link) =>
    link.href.startsWith('/routes/'),
  );
  const phone = phoneForRegion(region.usesDaeguPhone);
  const localAdvice = regionalShippingNotes[region.id] || [];
  const seedDescription = seedRegions.find(
    (item) => item.id === region.id,
  )?.description;
  const operatorDescription =
    region.description.trim() && region.description !== seedDescription
      ? region.description
      : null;

  return (
    <main className="bg-[#f4f7fb]">
      <SiteHeader currentPhone={phone} />
      <JsonLd data={regionFaqSchema(content)} />
      <nav
        aria-label="현재 위치"
        className="mx-auto flex max-w-[1240px] flex-wrap gap-3 px-5 py-4 text-sm text-[#475467]"
      >
        <a href="/">홈</a>
        <span aria-hidden="true">/</span>
        <a href="/regions">지역별 운송</a>
        {parent ? (
          <>
            <span aria-hidden="true">/</span>
            <a href={`/regions/${parent.slug}`}>{parent.name}</a>
          </>
        ) : null}
        <span aria-hidden="true">/</span>
        <span aria-current="page">{region.name}</span>
      </nav>
      <PageHero
        eyebrow="REGION SERVICE"
        title={content.h1}
        description={content.localSummary}
        action={
          <a
            href={telHref(phone)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1b4dff] px-6 py-4 font-black"
          >
            <Phone size={18} />
            {phone}
          </a>
        }
      />

      {operatorDescription || localAdvice.length ? (
        <section className="bg-white px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-3xl font-black">
              {region.name} 픽업·납품 준비 안내
            </h2>
            {operatorDescription ? (
              <p className="mt-5 whitespace-pre-line leading-8 text-[#475467]">
                {operatorDescription}
              </p>
            ) : null}
            <div className="mt-7 grid gap-6 lg:grid-cols-3">
              {localAdvice.map((item) => (
                <article
                  key={item.heading}
                  className="rounded-2xl border border-[#dce5f0] p-6"
                >
                  <h3 className="text-lg font-black">{item.heading}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#475467]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">
              LOCAL SHIPPING GUIDE
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.04em]">
              이 지역에서 확인할 운송 조건
            </h2>
          </div>
          <div className="space-y-3">
            {content.localNotes.map((note) => (
              <p
                key={note}
                className="rounded-2xl border border-[#dce5f0] bg-[#f9fbfd] px-5 py-4 text-sm leading-7 text-[#475467]"
              >
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">
            SERVICE MATCHING
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">
            어떤 서비스가 맞을까요?
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-[#667085]">
            소형 물품, 차량 화물, 도시 간 연계는 필요한 정보와 운송 방식이
            다릅니다. 아래 서비스에서 조건을 확인한 뒤 상담해 주세요.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {serviceLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-[#dce5f0] bg-white p-6 transition hover:border-[#1b4dff] hover:shadow-[0_12px_30px_rgba(16,36,62,.08)]"
              >
                <Route size={22} className="text-[#1b4dff]" />
                <h3 className="mt-5 text-lg font-black">{link.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  {link.description}
                </p>
                <p className="mt-4 text-sm font-bold leading-6 text-[#344054]">
                  {link.suitableFor}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#1b4dff]">
                  서비스 안내 보기 <ArrowRight size={15} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {routes.length ? (
        <section className="bg-white px-5 py-14">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-3xl font-black">
              {region.name}과 연결된 운송 노선
            </h2>
            <p className="mt-4 leading-7 text-[#475467]">
              현재 등록된 출발·도착 구간입니다. 지역 내 픽업·최종 배송과 운송편
              접수 조건을 함께 확인하세요. 반대 방향 접수와 당일 운송 가능
              여부는 별도 상담이 필요합니다.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {routes.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl border border-[#dce5f0] p-6 hover:border-[#1b4dff]"
                >
                  <h3 className="font-black text-[#1b4dff]">{link.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#475467]">
                    {link.description}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#667085]">
                    {link.suitableFor}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <ShippingDecisionGuide name={region.name} services={services} />
      <section className="bg-[#10243e] px-5 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-[1000px]">
          <ShieldCheck className="text-[#78a0ff]" size={32} />
          <h2 className="mt-5 text-3xl font-black">접수 전에 알려주세요</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              '정확한 출발지와 도착지',
              '물품 종류, 수량, 크기와 무게',
              '희망 상차 또는 도착 시간',
              '엘리베이터·주차·계단 등 상하차 환경',
            ].map((item) => (
              <p
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.06] px-5 py-4 text-sm font-bold text-white/85"
              >
                <CheckCircle2 size={17} className="shrink-0 text-[#78a0ff]" />
                {item}
              </p>
            ))}
          </div>
          <p className="mt-7 max-w-3xl text-sm leading-7 text-white/70">
            제이복합물류는 편의점 택배나 일반 택배 계약 접수처가 아닙니다. 긴급
            퀵서비스, 차량 화물, 도시 간 연계 운송처럼 물품과 일정 조건 확인이
            필요한 상황을 상담합니다.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="text-3xl font-black">
            {children.length
              ? '세부 지역별 운송 안내'
              : '인접 지역과 접수 범위'}
          </h2>
          {children.length ? (
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {children.map((item) => (
                <a
                  key={item.id}
                  href={`/regions/${item.slug}`}
                  className="rounded-xl border border-[#dce5f0] bg-[#f9fbfd] px-4 py-4 font-bold hover:border-[#1b4dff] hover:text-[#1b4dff]"
                >
                  {item.name}
                  <span className="float-right">→</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[#667085]">
              이 지역에서 필요한 운송 방식은 위의 서비스 안내에서 확인할 수
              있습니다.
            </p>
          )}
          {nearby.length ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {nearby.map((item) => (
                <a
                  key={item.id}
                  href={`/regions/${item.slug}`}
                  className="rounded-xl border border-[#dce5f0] px-4 py-3 text-sm font-bold text-[#1b4dff]"
                >
                  {item.name} 운송 안내
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {landings.length ? (
        <section className="px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-black">
                지역·품목별 상세 운송 안내
              </h2>
              <a href="/services" className="text-sm font-black text-[#1b4dff]">
                전체 서비스
              </a>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {landings.map((item) => (
                <a
                  key={item.id}
                  href={`/delivery/${item.slug}`}
                  className="rounded-2xl border border-[#dce5f0] bg-white p-6"
                >
                  <h3 className="font-black">{item.title}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667085]">
                    {item.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#1b4dff]">
                    안내 보기 <ArrowRight size={15} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-[900px]">
          <h2 className="text-3xl font-black">자주 묻는 질문</h2>
          <div className="mt-6 divide-y divide-[#dce5f0] border-y border-[#dce5f0]">
            {content.faq.map((item, index) => (
              <details key={item.question} className="py-1" open={index === 0}>
                <summary className="cursor-pointer py-5 font-black">
                  {item.question}
                </summary>
                <p className="pb-6 text-sm leading-7 text-[#667085]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ContactCta daegu={region.usesDaeguPhone} />
      <SiteFooter />
      <PhoneFab phone={phone} />
    </main>
  );
}
