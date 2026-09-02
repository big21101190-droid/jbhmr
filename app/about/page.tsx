import type { Metadata } from 'next';
import { CheckCircle2, MapPin, Phone, Route } from 'lucide-react';
import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { company, telHref } from '@/lib/company';

export const metadata: Metadata = { title: '회사소개', description: '지역 내 퀵서비스부터 전국 화물과 도시 간 배송까지 상담하는 제이복합물류를 소개합니다.', alternates: { canonical: '/about' } };

export default function AboutPage() {
  return <main className="bg-[#f4f7fb]"><SiteHeader /><PageHero eyebrow="ABOUT J EXPRESS" title={<>필요한 운송을<br /><span className="text-[#78a0ff]">한곳에서 상담</span></>} description="제이복합물류는 출발지, 도착지와 화물 조건을 확인해 제공 가능한 운송 방법을 안내합니다." action={<a href={telHref(company.nationalPhone)} className="inline-flex items-center gap-2 rounded-xl bg-[#1b4dff] px-6 py-4 font-black text-white"><Phone size={18} /> 전국 {company.nationalPhone}</a>} />
    <section className="bg-white px-5 py-16 sm:py-20"><div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">OUR ROLE</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-5xl">조건을 듣고<br />방법을 연결합니다</h2></div><div className="grid gap-4 sm:grid-cols-3">{[[MapPin,'지역 확인','대구는 053 전용번호, 그 외 지역은 전국 공통번호로 접수합니다.'],[Route,'운송 확인','화물과 구간에 맞춰 차량·도시 간 노선·제주 운송을 상담합니다.'],[CheckCircle2,'접수 안내','가능 여부와 조건을 확인한 뒤 접수와 진행 방법을 안내합니다.']].map(([Icon,title,body])=>{const C=Icon as typeof MapPin;return <article key={String(title)} className="rounded-2xl border border-[#dce5f0] bg-[#f9fbfd] p-6"><C className="text-[#1b4dff]" /><h3 className="mt-6 font-black">{String(title)}</h3><p className="mt-3 text-sm leading-6 text-[#667085]">{String(body)}</p></article>})}</div></div></section>
    <ContactCta /><SiteFooter /><PhoneFab phone={company.nationalPhone} /></main>;
}
