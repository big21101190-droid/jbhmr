import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { company, telHref } from '@/lib/company';

export const metadata: Metadata={title:'견적 문의',description:'출발지, 도착지와 화물 정보를 남기거나 전화로 제이복합물류에 문의하세요.',alternates:{canonical:'/contact'}};
export default function ContactPage(){return <main className="bg-[#f4f7fb]"><SiteHeader/><PageHero eyebrow="CONTACT" title={<>출발지와 도착지만<br/><span className="text-[#78a0ff]">알려주세요</span></>} description="전화로 바로 상담하거나 아래 양식에 화물 정보를 남겨주세요."/><section className="px-5 py-14 sm:py-20"><div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[.65fr_1.35fr]"><aside className="space-y-4"><div className="rounded-2xl bg-[#1b4dff] p-6 text-white"><p className="text-sm font-bold text-white/65">전국 접수</p><a href={telHref(company.nationalPhone)} className="mt-2 block text-2xl font-black">{company.nationalPhone}</a></div><div className="rounded-2xl bg-[#10243e] p-6 text-white"><p className="text-sm font-bold text-white/65">대구 전용</p><a href={telHref(company.daeguPhone)} className="mt-2 block text-2xl font-black">{company.daeguPhone}</a></div><p className="px-2 text-sm leading-6 text-[#667085]">문의 내용에는 주민등록번호, 계좌 비밀번호 등 불필요한 민감정보를 입력하지 마세요.</p></aside><ContactForm/></div></section><SiteFooter/><PhoneFab phone={company.nationalPhone}/></main>}
