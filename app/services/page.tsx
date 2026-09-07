import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { listServices } from '@/lib/catalog-store';
import { company } from '@/lib/company';

export const metadata: Metadata = {
  title: '배송 서비스',
  description:
    '퀵서비스, 다마스, 1톤 용달, 고속버스·KTX택배, 제주 화물과 여행 짐 배송을 확인하세요.',
  alternates: { canonical: '/services' },
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await listServices();
  return (
    <main className="bg-[#f4f7fb]">
      <SiteHeader />
      <PageHero
        eyebrow="SERVICES"
        title={
          <>
            보낼 물품에 맞는
            <br />
            <span className="text-[#78a0ff]">배송 서비스</span>
          </>
        }
        description="고객이 제공한 실제 서비스 범위만 안내합니다. 세부 운행 가능 여부는 화물과 일정 확인 후 상담합니다."
      />
      <section className="px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services
            .filter((item) => item.active)
            .map((service) => (
              <a
                aria-label={`${service.name} 자세히 보기`}
                key={service.id}
                href={`/services/${service.slug}`}
                className="group overflow-hidden rounded-2xl border border-[#dce5f0] bg-white shadow-[0_8px_30px_rgba(16,36,62,.05)]"
              >
                <img
                  src={service.image}
                  alt=""
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="p-6">
                  <span className="text-[10px] font-black tracking-[.16em] text-[#1b4dff]">
                    {service.group}
                  </span>
                  <h2 className="mt-3 text-xl font-black">{service.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                    {service.shortDescription}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#1b4dff]">
                    자세히 보기 <ArrowRight size={15} />
                  </span>
                </div>
              </a>
            ))}
        </div>
      </section>
      <SiteFooter />
      <PhoneFab phone={company.nationalPhone} />
    </main>
  );
}
