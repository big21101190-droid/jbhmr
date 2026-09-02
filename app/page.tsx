import { ArrowRight, BusFront, CheckCircle2, Clock3, MapPin, PackageCheck, Phone, Plane, Route, ShieldCheck, TrainFront, Truck } from 'lucide-react';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { areaHref, DAEGU_PHONE, intercityRoutes, NATIONAL_PHONE, regionGroups, serviceCards, telHref } from '@/lib/site-data';

const process = [
  ['01', '전화 문의', '출발지와 도착지, 보내실 물품을 알려주세요.'],
  ['02', '화물 확인', '크기·무게와 상하차 조건을 함께 확인합니다.'],
  ['03', '운송 안내', '가능한 차량 또는 노선과 요금을 안내합니다.'],
  ['04', '접수 · 배차', '동의 후 접수하고 진행 상황을 안내합니다.'],
];

const faqs = [
  ['차량은 어떻게 정해지나요?', '서류·소형 물품은 오토바이, 박스 단위는 다마스, 자재나 집기는 1톤 화물을 기준으로 상담합니다. 물품 크기와 무게를 알려주시면 더 빠르게 안내할 수 있습니다.'],
  ['도시 간 화물은 어떤 방법이 있나요?', '고속버스택배와 KTX택배를 우선 검토하며, 제주·서귀포 방향은 항공 또는 선박 일정을 확인합니다. 출발지와 도착지, 희망 도착 시간을 알려주세요.'],
  ['기업 정기 배송도 가능한가요?', '가능합니다. 반복되는 배송은 물량과 운행 주기, 주요 노선을 확인한 뒤 적합한 방식으로 상담합니다.'],
  ['대구와 다른 지역의 접수 번호가 다른가요?', `대구 지역은 ${DAEGU_PHONE}, 그 외 전국 지역은 ${NATIONAL_PHONE}로 접수해 주세요.`],
];

export default function Home() {
  const daegu = regionGroups.find((item) => item.slug === 'daegu')!;
  const gyeongbuk = regionGroups.find((item) => item.slug === 'gyeongbuk')!;

  return (
    <main className="overflow-hidden bg-[#f4f7fb] text-[#101828]">
      <SiteHeader />

      <section className="relative bg-[#edf3fb] px-5 py-12 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(27,77,255,.14),transparent_38%)]" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[1.03fr_.97fr]">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c9d8ff] bg-white px-4 py-2 text-xs font-extrabold text-[#1b4dff] shadow-sm"><Clock3 size={14} /> 전화 한 통으로 간편 접수</p>
            <h1 className="max-w-[680px] text-[clamp(2.7rem,6vw,5.35rem)] font-black leading-[1.02] tracking-[-0.065em]">가까운 퀵부터<br /><span className="text-[#1b4dff]">전국 화물</span>까지</h1>
            <p className="mt-6 max-w-[600px] text-base leading-7 text-[#475467] sm:text-lg">오토바이·다마스·1톤 용달, 고속버스·KTX택배, 제주 항공·선박 운송을 출발지와 화물에 맞춰 안내합니다.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={telHref(NATIONAL_PHONE)} className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#1b4dff] px-6 py-4 font-extrabold text-white shadow-[0_12px_30px_rgba(27,77,255,.24)]">전국 {NATIONAL_PHONE} <ArrowRight size={18} /></a>
              <a href={telHref(DAEGU_PHONE)} className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#cbd5e1] bg-white px-6 py-4 font-extrabold text-[#10243e]">대구 {DAEGU_PHONE}</a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#344054]">
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#1b4dff]" /> 연중무휴 상담</span>
              <span className="flex items-center gap-2"><MapPin size={17} className="text-[#1b4dff]" /> 전국 접수</span>
              <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-[#1b4dff]" /> 화물주선허가업체</span>
            </div>
          </div>
          <div className="relative lg:pl-5">
            <div className="absolute -inset-4 rotate-2 rounded-[34px] bg-[#1b4dff] sm:-inset-5" />
            <img src="/hero-freight.png" alt="제이복합물류 전국 화물운송 안내" className="relative aspect-[4/3] w-full rounded-[28px] object-cover shadow-[0_30px_60px_rgba(16,36,62,.24)]" />
            <div className="absolute -bottom-7 left-4 right-4 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/20 bg-[#10243e] text-center text-white shadow-2xl sm:left-10 sm:right-10">
              {[[Truck, '차량', '오토바이·다마스·1톤'], [Route, '운행', '지역·도시 간 노선'], [Phone, '접수', '전화 상담']].map(([Icon, label, value]) => {
                const IconComponent = Icon as typeof Truck;
                return <div key={String(label)} className="border-r border-white/10 px-2 py-3 last:border-r-0 sm:px-4 sm:py-4"><IconComponent className="mx-auto text-[#78a0ff]" size={18} /><span className="mt-1 block text-[9px] font-bold text-white/45">{String(label)}</span><strong className="mt-0.5 block text-[10px] sm:text-xs">{String(value)}</strong></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-8 pt-16 sm:pb-12 sm:pt-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-2xl">
            <p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">ALL-IN-ONE LOGISTICS</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">보낼 물품에 맞는 운송을<br className="hidden sm:block" /> 한곳에서 상담하세요</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {serviceCards.map((service, index) => (
              <a id={service.href.slice(1)} href={service.href} key={service.title} className="group grid overflow-hidden rounded-2xl border border-[#dce5f0] bg-[#f7f9fc] shadow-[0_8px_30px_rgba(16,36,62,.05)] transition hover:-translate-y-1 hover:border-[#b6c8ff] hover:shadow-[0_20px_50px_rgba(16,36,62,.12)] sm:grid-cols-[.92fr_1.08fr]">
                <img src={service.image} alt={service.title} className="aspect-[4/3] h-full w-full object-cover" />
                <div className="flex flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-black tracking-[.16em] text-[#1b4dff]">{service.code}</span><span className="grid h-9 w-9 place-items-center rounded-full border border-[#dce5f0] bg-white transition group-hover:bg-[#1b4dff] group-hover:text-white"><ArrowRight size={16} /></span></div>
                  <h3 className="mt-6 text-xl font-black tracking-[-.035em]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#667085]">{service.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">{service.tags.map((tag) => <span key={tag} className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#475467]">{tag}</span>)}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#10243e] px-5 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.86fr_1.14fr] lg:items-center">
          <div>
            <p className="text-xs font-black tracking-[.16em] text-[#78a0ff]">VEHICLE GUIDE</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">화물 크기에 맞춰<br />차량을 안내합니다</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">가장 큰 차가 늘 정답은 아닙니다. 물품의 크기와 무게, 출발지의 상하차 환경을 확인해 필요한 차량을 상담합니다.</p>
            <a href={telHref(NATIONAL_PHONE)} className="mt-7 inline-flex items-center gap-2 border-b border-white pb-1 text-sm font-black">차량 상담하기 <ArrowRight size={15} /></a>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['01', '오토바이', '서류, 샘플, 소형 물품 등 빠른 지역 내 이동'],
              ['02', '다마스', '박스 단위 소형 화물과 부피 있는 물품'],
              ['03', '1톤 화물', '자재, 집기, 사무실 이전 등 비교적 큰 화물'],
            ].map(([no, title, desc]) => <div key={no} className="rounded-2xl border border-white/10 bg-white/[.06] p-6"><span className="text-xs font-black text-[#78a0ff]">{no}</span><Truck className="mt-8 text-white" size={30} /><h3 className="mt-5 text-xl font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{desc}</p></div>)}
          </div>
        </div>
      </section>

      <section id="intercity" className="bg-[#f4f7fb] px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div><p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">INTERCITY DELIVERY</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">도시와 도시를<br />빠르게 연결합니다</h2></div>
            <p className="max-w-md text-sm leading-6 text-[#667085]">터미널과 역을 이용하는 화물은 노선 운행 여부와 마감 시간을 확인한 뒤 접수합니다.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#dce5f0] bg-white p-7 sm:p-8"><BusFront size={31} className="text-[#1b4dff]" /><h3 className="mt-7 text-2xl font-black">고속버스택배</h3><p className="mt-3 text-sm leading-6 text-[#667085]">주요 도시 고속버스 노선을 활용해 터미널 간 화물을 연결합니다.</p><div className="mt-7 flex flex-wrap gap-2">{intercityRoutes.map((route) => <span key={route} className="rounded-lg bg-[#f4f7fb] px-3 py-2 text-xs font-bold text-[#344054]">{route}</span>)}</div></div>
            <div className="grid overflow-hidden rounded-2xl bg-[#1b4dff] text-white sm:grid-cols-[1fr_1.05fr]"><div className="p-7 sm:p-8"><TrainFront size={31} /><h3 className="mt-7 text-2xl font-black">KTX택배</h3><p className="mt-3 text-sm leading-6 text-white/70">철도 노선과 퀵서비스를 연계해 역에서 출발지·도착지까지 이어서 상담합니다.</p><a href={telHref(NATIONAL_PHONE)} className="mt-8 inline-flex items-center gap-2 text-sm font-black">노선 문의 <ArrowRight size={15} /></a></div><img src="/service-ktx.jpg" alt="KTX 도시 간 화물 연계" className="h-full min-h-[260px] w-full object-cover" /></div>
          </div>
        </div>
      </section>

      <section id="jeju" className="bg-white px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[28px]"><img src="/service-jeju.png" alt="제주 항공 및 선박 배송" className="aspect-[4/3] w-full object-cover" /><div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/92 p-5 shadow-xl backdrop-blur"><p className="text-xs font-black text-[#1b4dff]">SEOUL ↔ JEJU · SEOGWIPO</p><p className="mt-1 text-sm font-bold">일정과 품목에 맞는 항공·선박 운송 상담</p></div></div>
          <div className="lg:pl-10"><Plane size={38} className="text-[#1b4dff]" /><p className="mt-7 text-xs font-black tracking-[.16em] text-[#1b4dff]">JEJU DELIVERY</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">제주·서귀포까지<br />끊김 없이 연결</h2><p className="mt-6 text-sm leading-7 text-[#667085] sm:text-base">서울–제주 항공화물, 제주·서귀포 선박화물과 출도착지 탁송 연계를 한 번에 상담합니다. 화물 품목과 희망 도착 일정을 알려주세요.</p><div className="mt-7 space-y-3 text-sm font-bold text-[#344054]"><p className="flex items-center gap-2"><PackageCheck size={18} className="text-[#1b4dff]" /> 제주도 항공·선박 화물</p><p className="flex items-center gap-2"><PackageCheck size={18} className="text-[#1b4dff]" /> 서귀포 도착 탁송 연계</p></div></div>
        </div>
      </section>

      <section id="golf" className="border-y border-[#dce5f0] bg-[#eef9e9] px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-9 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div><p className="text-xs font-black tracking-[.16em] text-[#28724b]">BAG DELIVERY</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">무거운 골프백과<br />캐리어는 먼저 배송</h2><p className="mt-6 max-w-lg text-sm leading-7 text-[#52635a] sm:text-base">골프장, 숙소, 공항 일정에 맞춰 골프백·캐디백과 여행 캐리어를 출발지부터 도착지까지 상담합니다.</p><a href={telHref(NATIONAL_PHONE)} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#153e2c] px-6 py-4 text-sm font-black text-white">배송 문의하기 <ArrowRight size={16} /></a></div>
          <img src="/service-golf.png" alt="골프백과 캐리어 배송 서비스" className="w-full rounded-[28px] shadow-[0_24px_50px_rgba(21,62,44,.16)]" />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center"><p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">HOW IT WORKS</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">접수는 간단하게,<br className="sm:hidden" /> 안내는 정확하게</h2></div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[#dce5f0] bg-[#dce5f0] md:grid-cols-4">{process.map(([no, title, desc]) => <div key={no} className="bg-[#f9fbfd] p-6 sm:p-7"><span className="text-xs font-black text-[#1b4dff]">STEP {no}</span><h3 className="mt-8 text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-[#667085]">{desc}</p></div>)}</div>
        </div>
      </section>

      <section className="bg-[#f4f7fb] px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[.78fr_1.22fr]">
          <div><p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">LOCAL SERVICE</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">지역별 퀵·용달<br />바로 찾기</h2><p className="mt-5 text-sm leading-6 text-[#667085]">대구 지역은 053 전용번호로, 그 외 지역은 전국 공통번호로 연결됩니다.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#1b4dff] p-6 text-white"><p className="text-xs font-black text-white/60">대구 전 지역 · 053 전용</p><h3 className="mt-2 text-2xl font-black">{DAEGU_PHONE}</h3><div className="mt-5 flex flex-wrap gap-2">{daegu.places.map((place) => <a key={place} href={areaHref(daegu, place)} className="rounded-lg bg-white/12 px-3 py-2 text-xs font-bold hover:bg-white hover:text-[#1b4dff]">{place}</a>)}</div></div>
            <div className="rounded-2xl border border-[#dce5f0] bg-white p-6"><p className="text-xs font-black text-[#667085]">경산 · 하양 · 진량 · 전국</p><h3 className="mt-2 text-2xl font-black">{NATIONAL_PHONE}</h3><div className="mt-5 flex flex-wrap gap-2">{gyeongbuk.places.slice(0, 7).map((place) => <a key={place} href={areaHref(gyeongbuk, place)} className="rounded-lg bg-[#f4f7fb] px-3 py-2 text-xs font-bold hover:bg-[#e7eeff] hover:text-[#1b4dff]">{place}</a>)}</div></div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1040px] gap-8 lg:grid-cols-[.68fr_1.32fr]">
          <div><p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">FAQ</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-4xl">자주 묻는 질문</h2></div>
          <div className="divide-y divide-[#dce5f0] border-y border-[#dce5f0]">{faqs.map(([question, answer], index) => <details key={question} className="group py-1" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-base font-black"><span>{question}</span><span className="text-xl text-[#1b4dff] group-open:rotate-45">+</span></summary><p className="pb-6 pr-10 text-sm leading-7 text-[#667085]">{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="bg-[#1b4dff] px-5 py-14 text-white sm:py-16">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-bold text-white/65">지금 보내실 화물이 있나요?</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] sm:text-4xl">출발지와 도착지만 알려주세요</h2></div><div className="flex flex-col gap-3 sm:flex-row"><a href={telHref(NATIONAL_PHONE)} className="rounded-xl bg-white px-6 py-4 text-center font-black text-[#1b4dff]">전국 {NATIONAL_PHONE}</a><a href={telHref(DAEGU_PHONE)} className="rounded-xl border border-white/35 px-6 py-4 text-center font-black">대구 {DAEGU_PHONE}</a></div></div>
      </section>

      <SiteFooter />
      <PhoneFab phone={NATIONAL_PHONE} />
    </main>
  );
}
