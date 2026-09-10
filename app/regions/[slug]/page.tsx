import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, Phone } from 'lucide-react';
import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { regions as seedRegions } from '@/data/regions';
import { getRegionRecord, listRegions } from '@/lib/catalog-store';
import { phoneForRegion, telHref } from '@/lib/company';
import { listLandings } from '@/lib/landing-store';

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
  return {
    title: `${region.name} 배송 서비스`,
    description: region.description,
    alternates: { canonical: `/regions/${region.slug}` },
  };
}
export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const region = await getRegionRecord((await params).slug);
  if (!region || region.archived || !region.active) notFound();
  const regions = await listRegions();
  const children = regions.filter(
    (item) => item.parentId === region.id && item.active && !item.archived,
  );
  const ids = new Set([region.id, ...children.map((item) => item.id)]);
  const landings = (await listLandings({ publishedOnly: true }))
    .filter((item) => ids.has(item.regionId))
    .slice(0, 12);
  const phone = phoneForRegion(region.usesDaeguPhone);
  return (
    <main className="bg-[#f4f7fb]">
      <SiteHeader currentPhone={phone} />
      <PageHero
        eyebrow="REGION SERVICE"
        title={
          <>
            {region.name}
            <br />
            <span className="text-[#78a0ff]">배송 접수 안내</span>
          </>
        }
        description={region.description}
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
      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="text-3xl font-black">하위 지역</h2>
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
              {region.name}의 관련 서비스 랜딩을 아래에서 확인할 수 있습니다.
            </p>
          )}
        </div>
      </section>
      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black">이 지역의 서비스 안내</h2>
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
      <ContactCta daegu={region.usesDaeguPhone} />
      <SiteFooter />
      <PhoneFab phone={phone} />
    </main>
  );
}
