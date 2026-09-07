import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, BusFront, CheckCircle2, Phone } from 'lucide-react';
import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { busRoutes, getBusRoute } from '@/data/bus-routes';
import { company, telHref } from '@/lib/company';

export function generateStaticParams() {
  return busRoutes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const route = getBusRoute((await params).slug);
  if (!route) return {};
  return {
    title: `${route.label} 접수 안내`,
    description: `${route.origin}에서 ${route.destination}까지 고속버스 화물 연계 가능 여부와 접수 절차를 안내합니다.`,
    alternates: { canonical: `/routes/${route.slug}` },
  };
}

export default async function BusRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const route = getBusRoute((await params).slug);
  if (!route) notFound();
  return (
    <main className="bg-[#f4f7fb]">
      <SiteHeader />
      <PageHero
        eyebrow="EXPRESS BUS ROUTE"
        title={
          <>
            {route.origin}에서 {route.destination}까지
            <br />
            <span className="text-[#78a0ff]">고속버스택배 상담</span>
          </>
        }
        description={`${route.label}은 출발지 픽업, 터미널 접수, 도착 터미널 인수와 최종 배송의 연계 가능 여부를 확인해 안내합니다.`}
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
      <section className="bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1050px] gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <BusFront size={38} className="text-[#1b4dff]" />
            <h2 className="mt-5 text-3xl font-black">노선 이용 전 확인</h2>
            <p className="mt-4 leading-7 text-[#667085]">
              실제 운행편, 터미널 접수 마감, 수화물 공간과 품목 제한은 접수
              시점에 확인합니다.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              [
                '화물 정보 접수',
                '출발·도착 주소, 품목, 크기, 무게와 희망 시간을 알려주세요.',
              ],
              [
                '운행편 확인',
                `${route.origin}–${route.destination} 구간의 이용 가능한 버스편과 접수 조건을 확인합니다.`,
              ],
              [
                '픽업·터미널 연계',
                '가능한 경우 출발지 픽업부터 터미널 수화물 접수까지 연결합니다.',
              ],
              [
                '도착지 배송',
                '버스 도착 일정에 맞춰 인수 후 최종 수령지 배송 가능 여부를 안내합니다.',
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
      <section className="px-5 py-14">
        <div className="mx-auto max-w-[1050px]">
          <h2 className="text-2xl font-black">다른 주요 노선</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {busRoutes
              .filter((item) => item.slug !== route.slug)
              .slice(0, 6)
              .map((item) => (
                <a
                  key={item.slug}
                  href={`/routes/${item.slug}`}
                  className="flex items-center justify-between rounded-xl border border-[#dce5f0] bg-white p-4 text-sm font-black hover:border-[#1b4dff]"
                >
                  {item.label}
                  <ArrowRight size={15} />
                </a>
              ))}
          </div>
        </div>
      </section>
      <ContactCta label={`${route.label} 출발지와 도착지를 알려주세요`} />
      <SiteFooter />
      <PhoneFab phone={company.nationalPhone} />
    </main>
  );
}
