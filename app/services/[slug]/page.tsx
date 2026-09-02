import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle2, Phone } from 'lucide-react';
import { ContactCta } from '@/components/contact-cta';
import { JsonLd } from '@/components/json-ld';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getService, services } from '@/data/services';
import { SITE_URL, company, telHref } from '@/lib/company';

export function generateStaticParams(){return services.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const service=getService((await params).slug);if(!service)return{};return{title:service.name,description:service.description,alternates:{canonical:`/services/${service.slug}`},openGraph:{title:`${service.name} | 제이복합물류`,description:service.description,images:[service.image]}};}
export default async function ServicePage({params}:{params:Promise<{slug:string}>}){const service=getService((await params).slug);if(!service)notFound();return <main className="bg-[#f4f7fb]"><SiteHeader /><JsonLd data={{'@context':'https://schema.org','@type':'Service',name:service.name,description:service.description,provider:{'@type':'Organization',name:company.name,url:SITE_URL},areaServed:'KR'}} /><PageHero eyebrow={service.group} title={<>{service.name}<br /><span className="text-[#78a0ff]">접수 안내</span></>} description={service.description} action={<a href={telHref(company.nationalPhone)} className="inline-flex items-center gap-2 rounded-xl bg-[#1b4dff] px-6 py-4 font-black"><Phone size={18}/>{company.nationalPhone}</a>} />
<section className="bg-white px-5 py-16"><div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-2"><img src={service.image} alt={`${service.name} 안내`} className="w-full rounded-[28px] object-cover"/><div><p className="text-xs font-black tracking-[.16em] text-[#1b4dff]">SERVICE GUIDE</p><h2 className="mt-3 text-3xl font-black">문의 전에 확인해주세요</h2><p className="mt-5 leading-7 text-[#667085]">{service.shortDescription}</p><div className="mt-7 space-y-3">{['출발지와 도착지','화물 종류와 수량','가장 큰 물품의 크기와 무게','희망 출발·도착 시간'].map(item=><p key={item} className="flex items-center gap-3 rounded-xl bg-[#f4f7fb] px-4 py-3 font-bold"><CheckCircle2 size={18} className="text-[#1b4dff]"/>{item}</p>)}</div></div></div></section>
<section className="px-5 py-16"><div className="mx-auto max-w-[900px]"><h2 className="text-3xl font-black">자주 묻는 질문</h2><div className="mt-6 divide-y divide-[#dce5f0] border-y border-[#dce5f0]">{service.faqs.map(item=><details key={item.question} className="py-5"><summary className="cursor-pointer font-black">{item.question}</summary><p className="mt-3 text-sm leading-7 text-[#667085]">{item.answer}</p></details>)}</div></div></section><ContactCta/><SiteFooter/><PhoneFab phone={company.nationalPhone}/></main>}
