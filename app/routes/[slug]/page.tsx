import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, Phone, Route } from 'lucide-react';
import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { PlainText } from '@/components/plain-text';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { services as seedServices } from '@/data/services';
import { listServices } from '@/lib/catalog-store';
import { company, telHref } from '@/lib/company';
import { isIndexingEnabled } from '@/lib/indexing';
import {
  getServiceRoute,
  getServiceRoutes,
  type ServiceRoute,
} from '@/lib/service-routes';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return seedServices
    .flatMap((service) => getServiceRoutes(service))
    .map(({ slug }) => ({ slug }));
}

async function findRoute(slug: string) {
  const services = await listServices();
  return { route: getServiceRoute(services, slug), services };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { route } = await findRoute((await params).slug);
  if (!route) return {};
  const description =
    route.metaDescription ||
    route.description ||
    `${route.origin}에서 ${route.destination}까지 ${route.serviceName} 연계 가능 여부와 접수 절차를 안내합니다.`;
  return {
    title: route.metaTitle || `${route.label} 접수 안내`,
    description,
    alternates: { canonical: `/routes/${route.slug}` },
    robots:
      isIndexingEnabled() && route.indexPolicy !== 'NOINDEX'
        ? { index: true, follow: true }
        : { index: false, follow: false },
    openGraph: {
      title: route.metaTitle || `${route.label} 접수 안내 | 제이복합물류`,
      description,
      url: `/routes/${route.slug}`,
      images: route.image?.url ? [{ url: route.image.url }] : undefined,
    },
  };
}

function routeNotes(route: ServiceRoute) {
  if (route.serviceGroup === 'INTERCITY')
    return {
      eyebrow: 'INTERCITY ROUTE',
      availability:
        '실제 운행편, 영업소·터미널 접수 마감, 적재 공간과 품목 제한은 접수 시점에 확인합니다.',
      transport: `${route.origin}–${route.destination} 구간의 이용 가능한 운송편과 접수 조건을 확인합니다.`,
    };
  if (route.serviceGroup === 'JEJU')
    return {
      eyebrow: 'JEJU ROUTE',
      availability:
        '항공편 또는 선박 운항, 기상, 접수 마감과 품목 제한은 접수 시점에 확인합니다.',
      transport: `${route.origin}–${route.destination} 구간의 항공·선박 연계 일정과 접수 조건을 확인합니다.`,
    };
  return {
    eyebrow: 'DELIVERY ROUTE',
    availability:
      '차량과 노선 운영 여부, 화물 규격과 품목 제한은 접수 시점에 확인합니다.',
    transport: `${route.origin}–${route.destination} 구간의 이용 가능한 운송 방법과 접수 조건을 확인합니다.`,
  };
}

export default async function ServiceRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { route, services } = await findRoute((await params).slug);
  if (!route) notFound();
  const notes = routeNotes(route);
  const service = services.find((item) => item.id === route.serviceId);
  const related = service
    ? getServiceRoutes(service)
        .filter((item) => item.slug !== route.slug)
        .slice(0, 6)
    : [];

  return (
    <main className="bg-[#f4f7fb]">
      <SiteHeader />
      <PageHero
        eyebrow={notes.eyebrow}
        title={
          <>
            {route.origin}에서 {route.destination}까지
            <br />
            <span className="text-[#78a0ff]">{route.serviceName} 상담</span>
          </>
        }
        description={
          route.description ||
          `${route.label}은 출발지 픽업부터 주요 운송편과 도착지 배송까지 실제 연계 가능 여부를 확인해 안내합니다.`
        }
        action={
          <a
            href={telHref(company.nationalPhone)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1b4dff] px-6 py-4 font-black text-white"
          >
            <Phone size={18} />
            {company.nationalPhone}
          </a>
        }
      />
      {route.image?.url || route.body ? (
        <section className="bg-[#f4f7fb] px-5 py-14 sm:py-20">
          <div
            className={`mx-auto grid max-w-[1050px] gap-8 ${
              route.image?.url && route.body
                ? 'lg:grid-cols-[.9fr_1.1fr] lg:items-start'
                : ''
            }`}
          >
            {route.image?.url ? (
              <figure>
                <img
                  src={route.image.url}
                  alt={
                    route.image.alt ||
                    `${route.origin} ${route.destination} ${route.serviceName} 안내`
                  }
                  className="aspect-[4/3] w-full rounded-2xl bg-white object-cover shadow-sm"
                />
                {route.image.caption ? (
                  <figcaption className="mt-3 text-center text-sm leading-6 text-[#667085]">
                    {route.image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
            {route.body ? (
              <PlainText
                text={route.body}
                className="space-y-5 leading-8 text-[#475467]"
              />
            ) : null}
          </div>
        </section>
      ) : null}
      <section className="bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1050px] gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <Route size={38} className="text-[#1b4dff]" />
            <h2 className="mt-5 text-3xl font-black">노선 이용 전 확인</h2>
            <p className="mt-4 leading-7 text-[#667085]">
              {notes.availability}
            </p>
            <a
              href={`/services/${route.serviceSlug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#1b4dff]"
            >
              {route.serviceName} 상세 안내 <ArrowRight size={15} />
            </a>
          </div>
          <div className="grid gap-3">
            {[
              [
                '화물 정보 접수',
                '출발·도착 주소, 품목, 크기, 무게와 희망 시간을 알려주세요.',
              ],
              ['운송편 확인', notes.transport],
              [
                '출발지 연계',
                '가능한 경우 출발지 픽업부터 주요 접수 지점까지 연결합니다.',
              ],
              [
                '도착지 배송',
                '도착 일정에 맞춰 인수 후 최종 수령지 배송 가능 여부를 안내합니다.',
              ],
            ].map(([title, body]) => (
              <article
                key={title}
                className="rounded-2xl border border-[#dce5f0] bg-[#f9fbfd] p-5"
              >
                <h3 className="flex items-center gap-2 font-black">
                  <CheckCircle2 size={18} className="text-[#1b4dff]" />
                  {title}
                </h3>
                <p className="mt-2 pl-7 text-sm leading-6 text-[#667085]">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      {related.length ? (
        <section className="px-5 py-14">
          <div className="mx-auto max-w-[1050px]">
            <h2 className="text-2xl font-black">다른 주요 노선</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <a
                  key={item.slug}
                  href={`/routes/${item.slug}`}
                  className="flex items-center justify-between rounded-xl border border-[#dce5f0] bg-white p-4 text-sm font-black transition hover:border-[#1b4dff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b4dff]"
                >
                  {item.label}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <ContactCta label={`${route.label} 출발지와 도착지를 알려주세요`} />
      <SiteFooter />
      <PhoneFab phone={company.nationalPhone} />
    </main>
  );
}
