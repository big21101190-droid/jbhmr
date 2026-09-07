import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  CheckCircle2,
  MapPin,
  PackageCheck,
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
import { getBusRouteByDestination } from '@/data/bus-routes';
import { services as seedServices } from '@/data/services';
import { getServiceRecord } from '@/lib/catalog-store';
import { SITE_URL, company, telHref } from '@/lib/company';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return seedServices.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const service = await getServiceRecord((await params).slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} | 제이복합물류`,
      description: service.description,
      url: `/services/${service.slug}`,
      images: [{ url: service.image, alt: service.imageAlt }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = await getServiceRecord((await params).slug);
  if (!service || service.archived || !service.active) notFound();

  const serviceUrl = `${SITE_URL}/services/${service.slug}`;
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.description,
      url: serviceUrl,
      image: `${SITE_URL}${service.image}`,
      provider: {
        '@type': 'Organization',
        name: company.name,
        url: SITE_URL,
        telephone: company.nationalPhone,
        email: company.email,
        taxID: company.businessRegistrationNumber,
        address: company.address,
      },
      areaServed: service.areas,
      serviceType: service.name,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: service.faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ];

  return (
    <main className="bg-[#f4f7fb]">
      <SiteHeader />
      <JsonLd data={schemas} />
      <PageHero
        eyebrow={service.group}
        title={
          <>
            {service.heroTitle}
            <br />
            <span className="text-[#78a0ff]">{service.heroAccent}</span>
          </>
        }
        description={service.summary}
        action={
          <a
            href={telHref(company.nationalPhone)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1b4dff] px-6 py-4 font-black text-white"
          >
            <Phone size={18} /> 전국 {company.nationalPhone}
          </a>
        }
      />

      <section className="bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <img
            src={service.image}
            alt={service.imageAlt}
            className="aspect-[4/3] w-full rounded-[28px] object-cover shadow-[0_24px_50px_rgba(16,36,62,.14)]"
          />
          <div>
            <p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">
              SERVICE AT A GLANCE
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">
              접수 전에 핵심 조건을 확인하세요
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {service.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-[#dce5f0] bg-[#f9fbfd] p-5"
                >
                  <p className="text-xs font-black text-[#1b4dff]">
                    {fact.label}
                  </p>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#344054]">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-5 lg:grid-cols-3">
          {[
            [PackageCheck, '취급 상담 품목', service.items],
            [Route, '운송 수단', service.transport],
            [MapPin, '서비스 지역', service.areas],
          ].map(([Icon, title, items]) => {
            const CardIcon = Icon as typeof PackageCheck;
            return (
              <article
                key={String(title)}
                className="rounded-2xl border border-[#dce5f0] bg-white p-6 sm:p-7"
              >
                <CardIcon className="text-[#1b4dff]" size={28} />
                <h2 className="mt-6 text-xl font-black">{String(title)}</h2>
                <div className="mt-5 space-y-3">
                  {(items as string[]).map((item) => (
                    <p
                      key={item}
                      className="flex items-start gap-3 text-sm leading-6 text-[#667085]"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-1 shrink-0 text-[#1b4dff]"
                      />
                      {item}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {service.routeIntents?.length ? (
        <section className="bg-white px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-[1100px]">
            <p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">
              ROUTE GUIDE
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">
              주요 연계 노선 상담
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-[#667085]">
              아래 노선은 고객 제공 목록을 기준으로 한 상담 예시입니다. 실제
              접수는 운행편, 마감 시간, 품목과 출도착 주소를 확인한 뒤
              안내합니다.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {service.routeIntents.map((route) => {
                const busRoute =
                  service.id === 'express-bus'
                    ? getBusRouteByDestination(route.destination)
                    : null;
                const content = (
                  <>
                    <Route size={18} className="shrink-0 text-[#1b4dff]" />
                    <span className="text-sm font-black text-[#344054]">
                      {route.label}
                    </span>
                  </>
                );
                return busRoute ? (
                  <a
                    key={`${route.origin}-${route.destination}`}
                    href={`/routes/${busRoute.slug}`}
                    className="flex items-center gap-3 rounded-2xl border border-[#dce5f0] bg-[#f9fbfd] px-5 py-4 transition hover:border-[#1b4dff] hover:bg-[#eff4ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b4dff]"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={`${route.origin}-${route.destination}`}
                    className="flex items-center gap-3 rounded-2xl border border-[#dce5f0] bg-[#f9fbfd] px-5 py-4"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#10243e] px-5 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-xs font-black tracking-[.16em] text-[#78a0ff]">
            HOW IT WORKS
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">
            {service.name} 이용 절차
          </h2>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {service.process.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/[.06] p-6"
              >
                <span className="text-xs font-black text-[#78a0ff]">
                  STEP {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-7 text-lg font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {service.pricing ? (
        <section className="bg-white px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-[1100px]">
            <p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">
              PRICING
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">
              {service.pricing.title}
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-[#667085]">
              {service.pricing.description}
            </p>
            <div className="mt-9 grid min-w-0 gap-7">
              {service.pricing.groups.map((group) => (
                <div key={group.title} className="min-w-0">
                  <h3 className="mb-4 text-lg font-black">{group.title}</h3>
                  <div className="max-w-full overflow-x-auto rounded-2xl border border-[#dce5f0]">
                    <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                      <thead className="bg-[#edf3fb] text-[#10243e]">
                        <tr>
                          {group.columns.map((column) => (
                            <th key={column} className="px-5 py-4 font-black">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#dce5f0] bg-white">
                        {group.rows.map((row) => (
                          <tr key={row.join('-')}>
                            {row.map((cell, index) => (
                              <td
                                key={`${cell}-${index}`}
                                className={`px-5 py-4 ${index === 0 ? 'font-black text-[#101828]' : 'font-bold text-[#475467]'}`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-2xl bg-[#fff7e6] p-6">
              <p className="font-black text-[#8a4b00]">운임 확인사항</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#765225]">
                {service.pricing.notes.map((note) => (
                  <li key={note}>· {note}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1000px] gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <ShieldCheck className="text-[#1b4dff]" size={34} />
            <p className="mt-6 text-xs font-black tracking-[.16em] text-[#1b4dff]">
              BEFORE BOOKING
            </p>
            <h2 className="mt-3 text-3xl font-black">접수 전 확인사항</h2>
          </div>
          <div className="space-y-3">
            {service.trustNotes.map((note) => (
              <p
                key={note}
                className="rounded-2xl border border-[#dce5f0] bg-white px-5 py-4 text-sm leading-7 text-[#667085]"
              >
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-[900px]">
          <h2 className="text-3xl font-black">자주 묻는 질문</h2>
          <div className="mt-6 divide-y divide-[#dce5f0] border-y border-[#dce5f0]">
            {service.faqs.map((item, index) => (
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

      <ContactCta label={`${service.name} 출발지와 도착지를 알려주세요`} />
      <SiteFooter />
      <PhoneFab phone={company.nationalPhone} />
    </main>
  );
}
