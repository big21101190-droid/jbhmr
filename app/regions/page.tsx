import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { regions } from '@/data/regions';
import { company, phoneForRegion } from '@/lib/company';

export const metadata: Metadata = { title: '지역별 접수', description: '전국 지역별 퀵·용달화물 접수 번호와 서비스 안내를 확인하세요.', alternates: { canonical: '/regions' } };
export default function RegionsPage(){const parents=regions.filter(item=>!item.parentId);return <main className="bg-[#f4f7fb]"><SiteHeader/><PageHero eyebrow="REGIONS" title={<>지역별 접수를<br/><span className="text-[#78a0ff]">빠르게 찾으세요</span></>} description={`대구는 ${company.daeguPhone}, 그 외 지역은 전국 공통번호 ${company.nationalPhone}로 연결됩니다.`}/><section className="px-5 py-14 sm:py-20"><div className="mx-auto grid max-w-[1240px] gap-4 sm:grid-cols-2 lg:grid-cols-4">{parents.map(region=><a key={region.id} href={`/regions/${region.slug}`} className="group rounded-2xl border border-[#dce5f0] bg-white p-6 transition hover:-translate-y-1 hover:border-[#1b4dff]"><p className="text-xs font-black text-[#1b4dff]">{phoneForRegion(region.usesDaeguPhone)}</p><h2 className="mt-3 text-xl font-black">{region.name}</h2><p className="mt-3 text-sm leading-6 text-[#667085]">{region.description}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-black">지역 보기 <ArrowRight size={15}/></span></a>)}</div></section><SiteFooter/><PhoneFab phone={company.nationalPhone}/></main>}
