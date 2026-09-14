import { ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';
import { LandingGallery } from '@/components/landing-gallery';
import { PlainText } from '@/components/plain-text';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getRegionRecord, getServiceRecord } from '@/lib/catalog-store';
import { SITE_URL, company, phoneForRegion } from '@/lib/company';
import type { Landing } from '@/lib/domain';

export async function LandingView({
  landing,
  related = [],
  preview = false,
}: {
  landing: Landing;
  related?: Landing[];
  preview?: boolean;
}) {
  const [region, destinationRegion, service] = await Promise.all([
    getRegionRecord(landing.regionId),
    landing.destinationRegionId
      ? getRegionRecord(landing.destinationRegionId)
      : Promise.resolve(null),
    getServiceRecord(landing.serviceId),
  ]);
  if (
    !region ||
    !service ||
    (landing.destinationRegionId && !destinationRegion)
  )
    return null;
  const phone = phoneForRegion(region.usesDaeguPhone);
  const routeName = destinationRegion
    ? `${region.name}–${destinationRegion.name}`
    : region.name;
  const canonical = landing.canonical || `${SITE_URL}/delivery/${landing.slug}`;
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: landing.title,
      description: landing.metaDescription,
      url: canonical,
      image: `${SITE_URL}${landing.heroImage}`,
      provider: {
        '@type': 'Organization',
        name: company.name,
        url: SITE_URL,
        telephone: company.nationalPhone,
        email: company.email,
        taxID: company.businessRegistrationNumber,
        areaServed: { '@type': 'Country', name: '대한민국' },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: company.nationalPhone,
            contactType: 'customer service',
            areaServed: 'KR',
          },
          {
            '@type': 'ContactPoint',
            telephone: company.daeguPhone,
            contactType: 'customer service',
            areaServed: 'Daegu',
          },
        ],
      },
      areaServed: destinationRegion
        ? [region.name, destinationRegion.name]
        : region.name,
      serviceType: service.name,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: routeName,
          item: `${SITE_URL}/regions/${region.slug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: landing.title,
          item: canonical,
        },
      ],
    },
    ...(landing.faq.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: landing.faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          },
        ]
      : []),
  ];
  return (
    <main className="overflow-hidden bg-[#f4f7fb] text-[#101828]">
      <JsonLd data={schemas} />
      <SiteHeader currentPhone={phone} />
      {preview ? (
        <div className="bg-[#ffce3a] px-4 py-3 text-center text-sm font-black text-[#10243e]">
          미리보기 — 현재 상태 {landing.status} · 검색엔진 비노출
        </div>
      ) : null}
      <section className="relative bg-[#10243e] px-5 py-14 text-white sm:py-20">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <nav
              className="flex flex-wrap items-center gap-2 text-xs font-black text-[#78a0ff]"
              aria-label="현재 위치"
            >
              <a href="/">HOME</a>
              <span>/</span>
              <a href={`/regions/${region.slug}`}>{routeName}</a>
              <span>/</span>
              <span>{service.name}</span>
            </nav>
            <p className="mt-9 inline-flex rounded-full border border-white/15 bg-white/[.06] px-4 py-2 text-xs font-bold">
              {landing.primaryKeyword}
            </p>
            <h1 className="font-display mt-5 text-[clamp(2.45rem,5.8vw,5rem)] leading-[1.08]">
              {landing.h1}
            </h1>
            <PlainText
              text={landing.summary}
              className="mt-6 max-w-2xl space-y-4 text-base leading-8 text-white/65"
            />
            <a
              href={landing.ctaLink}
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#1b4dff] px-6 py-4 text-lg font-black"
            >
              <Phone size={20} />
              {landing.ctaLabel}
            </a>
          </div>
          <figure>
            <img
              src={landing.heroImage}
              alt={landing.heroImageAlt || `${landing.title} 안내`}
              className="aspect-[4/3] w-full rounded-[28px] object-cover shadow-2xl"
            />
            {landing.heroImageCaption ? (
              <figcaption className="mt-3 text-center text-sm leading-6 text-white/65">
                {landing.heroImageCaption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      </section>
      <LandingGallery
        images={landing.bodyTopImages || []}
        keyword={landing.primaryKeyword}
      />
      <section className="bg-white px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-[1040px]">
          {landing.sections.map((section, index) => (
            <article
              key={`${section.heading}-${index}`}
              className="grid gap-5 border-b border-[#dce5f0] py-9 first:pt-0 last:border-0 lg:grid-cols-[.7fr_1.3fr]"
            >
              <div>
                <span className="text-xs font-black text-[#1b4dff]">
                  0{index + 1}
                </span>
                <h2 className="mt-3 text-2xl font-black tracking-[-.035em]">
                  {section.heading}
                </h2>
              </div>
              <PlainText
                text={section.body}
                className="space-y-4 leading-8 text-[#667085]"
              />
            </article>
          ))}
        </div>
      </section>
      <section className="bg-[#edf3fb] px-5 py-16">
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">
              CONTACT CHECK
            </p>
            <h2 className="mt-3 text-3xl font-black">
              빠른 상담을 위해
              <br />
              알려주세요
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              '출발지와 도착지',
              '화물 종류와 수량',
              '크기와 대략적인 무게',
              '희망 출발·도착 시간',
            ].map((item) => (
              <p
                key={item}
                className="flex items-center gap-3 rounded-xl bg-white px-4 py-4 font-bold"
              >
                <CheckCircle2 size={18} className="text-[#1b4dff]" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>
      {landing.faq.length ? (
        <section className="bg-white px-5 py-16">
          <div className="mx-auto max-w-[900px]">
            <p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-black">자주 묻는 질문</h2>
            <div className="mt-7 divide-y divide-[#dce5f0] border-y border-[#dce5f0]">
              {landing.faq.map((item, index) => (
                <details
                  key={item.question}
                  className="py-1"
                  open={index === 0}
                >
                  <summary className="cursor-pointer py-5 font-black">
                    {item.question}
                  </summary>
                  <PlainText
                    text={item.answer}
                    className="space-y-3 pb-6 text-sm leading-7 text-[#667085]"
                  />
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {related.length ? (
        <section className="px-5 py-16">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="text-3xl font-black">함께 보는 배송 안내</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {related.slice(0, 6).map((item) => (
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
                    자세히 보기 <ArrowRight size={15} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="bg-[#1b4dff] px-5 py-14 text-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-white/65">
              {routeName} 배송 상담
            </p>
            <h2 className="mt-2 text-3xl font-black">
              출발지와 도착지를 알려주세요
            </h2>
          </div>
          <a
            href={landing.ctaLink}
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 text-lg font-black text-[#1b4dff]"
          >
            <Phone size={19} />
            {phone}
          </a>
        </div>
      </section>
      <SiteFooter />
      <PhoneFab phone={phone} label={`${routeName} 접수`} />
    </main>
  );
}
