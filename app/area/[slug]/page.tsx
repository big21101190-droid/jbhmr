import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, MapPin, PackageCheck, Phone, Truck } from 'lucide-react';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { areaHref, findArea, regionGroups, telHref } from '@/lib/site-data';

export function generateStaticParams() {
  return regionGroups.flatMap((region) => region.places.map((place) => ({ slug: `${region.slug}-${place}` })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const area = findArea(slug);
  if (!area) return { title: '지역별 배송 | 제이복합물류' };
  const title = `${area.areaName} 퀵서비스·다마스·1톤 용달 | 제이복합물류`;
  const description = `${area.areaName} 퀵서비스, 다마스 배송, 1톤 용달화물 상담. ${area.phone} 전화 접수.`;
  return { title, description, openGraph: { title, description }, twitter: { card: 'summary', title, description } };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = findArea(slug);
  if (!area) notFound();
  const related = area.region.places.filter((place) => place !== area.place).slice(0, 8);
  const isDaegu = Boolean(area.region.daegu);

  return (
    <main className="overflow-hidden bg-[#f4f7fb] text-[#101828]">
      <SiteHeader currentPhone={area.phone} />
      <section className="relative bg-[#10243e] px-5 py-14 text-white sm:py-20">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[1.04fr_.96fr]">
          <div>
            <div className="flex items-center gap-2 text-xs font-black tracking-[.08em] text-[#78a0ff]"><a href="/">HOME</a><span>/</span><span>{area.region.label}</span><span>/</span><span>{area.place}</span></div>
            <p className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-4 py-2 text-xs font-bold"><MapPin size={14} /> {area.areaName} 지역 접수</p>
            <h1 className="mt-5 text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.04] tracking-[-.06em]">{area.areaName}<br /><span className="text-[#78a0ff]">퀵 · 용달화물</span></h1>
            <p className="mt-6 max-w-[620px] text-base leading-7 text-white/65 sm:text-lg">오토바이 퀵서비스부터 다마스, 1톤 용달화물까지 보내실 물품과 이동 거리에 맞춰 상담합니다.</p>
            <a href={telHref(area.phone)} className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#1b4dff] px-6 py-4 text-lg font-black shadow-[0_14px_30px_rgba(27,77,255,.3)]"><Phone size={20} /> {area.phone}</a>
          </div>
          <div className="relative"><div className="absolute -inset-4 rotate-2 rounded-[32px] bg-[#1b4dff]" /><img src="/service-freight.png" alt={`${area.areaName} 퀵서비스와 용달화물`} className="relative aspect-[4/3] w-full rounded-[26px] object-cover shadow-2xl" /></div>
        </div>
      </section>
      <section className="bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-3xl"><p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">{area.areaName.toUpperCase()} DELIVERY</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">화물에 맞는 방법으로<br />빠르게 안내합니다</h2><p className="mt-6 text-sm leading-7 text-[#667085] sm:text-base">{area.areaName}에서 출발하거나 도착하는 화물 모두 상담할 수 있습니다. 접수 시 정확한 주소와 화물 크기, 무게, 상하차 조건을 알려주세요.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">{[['오토바이 퀵서비스', '서류, 샘플, 소형 물품 등 가벼운 화물을 빠르게 이동할 때'], ['다마스 배송', '박스 단위 화물이나 승용차에 싣기 어려운 부피 있는 물품'], ['1톤 용달화물', '자재, 집기, 가전 등 비교적 크고 무거운 화물을 운송할 때']].map(([title, desc], index) => <div key={title} className="rounded-2xl border border-[#dce5f0] bg-[#f9fbfd] p-7"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e7eeff] text-[#1b4dff]"><Truck size={22} /></span><p className="mt-7 text-xs font-black text-[#1b4dff]">0{index + 1}</p><h3 className="mt-2 text-xl font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-[#667085]">{desc}</p></div>)}</div>
        </div>
      </section>
      <section className="bg-[#edf3fb] px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div><p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">CONTACT GUIDE</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">{isDaegu ? '대구 전용번호로' : '전국 공통번호로'}<br />바로 접수하세요</h2><p className="mt-5 text-sm leading-7 text-[#667085]">{isDaegu ? '대구광역시 지역은 053 전용번호를 사용합니다.' : '대구 외 지역은 전국 공통번호를 사용합니다.'} 통화 시 아래 정보를 함께 알려주시면 상담이 빠릅니다.</p></div>
          <div className="rounded-[28px] bg-white p-7 shadow-[0_18px_50px_rgba(16,36,62,.08)] sm:p-10"><p className="text-sm font-bold text-[#667085]">{area.areaName} 접수 번호</p><a href={telHref(area.phone)} className="mt-2 block text-4xl font-black tracking-[-.04em] text-[#1b4dff] sm:text-5xl">{area.phone}</a><div className="mt-8 grid gap-3 sm:grid-cols-2">{['출발지와 도착지', '화물 종류와 수량', '대략적인 크기·무게', '희망 출발·도착 시간'].map((item) => <p key={item} className="flex items-center gap-2 rounded-xl bg-[#f4f7fb] px-4 py-3 text-sm font-bold"><CheckCircle2 size={17} className="text-[#1b4dff]" /> {item}</p>)}</div></div>
        </div>
      </section>
      <section className="bg-white px-5 py-14 sm:py-20"><div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[.75fr_1.25fr]"><div><PackageCheck size={35} className="text-[#1b4dff]" /><h2 className="mt-5 text-3xl font-black tracking-[-.04em]">이런 상황에<br />이용해 보세요</h2></div><div className="grid gap-px overflow-hidden rounded-2xl border border-[#dce5f0] bg-[#dce5f0] sm:grid-cols-2">{['사무실에서 거래처로 서류나 샘플을 보낼 때', '온라인 주문 물품을 지역 내로 전달할 때', '박스 단위 화물을 다마스로 옮길 때', '집기나 자재를 1톤 화물로 운송할 때'].map((item, index) => <div key={item} className="bg-[#f9fbfd] p-6"><span className="text-xs font-black text-[#1b4dff]">0{index + 1}</span><p className="mt-4 font-bold leading-6">{item}</p></div>)}</div></div></section>
      <section className="bg-[#f4f7fb] px-5 py-14 sm:py-16"><div className="mx-auto max-w-[1240px]"><div className="flex items-end justify-between gap-5"><div><p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">NEARBY AREA</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">가까운 지역 퀵서비스</h2></div><a href="/" className="hidden items-center gap-2 text-sm font-black sm:flex">전체 서비스 보기 <ArrowRight size={15} /></a></div><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{related.map((place) => <a key={place} href={areaHref(area.region, place)} className="rounded-xl border border-[#dce5f0] bg-white px-4 py-4 text-sm font-bold transition hover:border-[#1b4dff] hover:text-[#1b4dff]">{area.region.name} {place} <span aria-hidden>→</span></a>)}</div></div></section>
      <section className="bg-[#1b4dff] px-5 py-14 text-white"><div className="mx-auto flex max-w-[1240px] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-bold text-white/65">{area.areaName}에서 바로 접수</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] sm:text-4xl">보내실 화물을 알려주세요</h2></div><a href={telHref(area.phone)} className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 text-lg font-black text-[#1b4dff]"><Phone size={19} /> {area.phone}</a></div></section>
      <SiteFooter />
      <PhoneFab phone={area.phone} label={`${area.areaName} 접수`} />
    </main>
  );
}
