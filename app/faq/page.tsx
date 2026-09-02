import type { Metadata } from 'next';
import { ContactCta } from '@/components/contact-cta';
import { JsonLd } from '@/components/json-ld';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { company } from '@/lib/company';

const faqs=[['어떤 정보를 준비해야 하나요?','출발지와 도착지, 화물 종류와 수량, 가장 큰 물품의 크기·무게, 희망 시간을 알려주세요.'],['대구와 다른 지역의 번호가 다른가요?',`대구는 ${company.daeguPhone}, 그 외 지역은 ${company.nationalPhone}로 접수합니다.`],['운송 비용은 홈페이지에서 바로 알 수 있나요?','거리는 물론 화물 크기·무게와 상하차 조건, 시간대에 따라 달라져 전화 또는 문의 접수 후 안내합니다.'],['고속버스나 KTX택배는 항상 가능한가요?','노선 운행 여부와 마감 시간, 품목 제한에 따라 달라지므로 보내기 전에 확인이 필요합니다.'],['제주 화물은 항공과 선박 중 어떻게 정하나요?','화물 품목, 크기와 무게, 희망 일정에 따라 적합한 방법을 상담합니다.'],['기업의 반복 배송도 문의할 수 있나요?','반복되는 구간과 물량, 운행 주기를 알려주시면 제공 가능한 범위에서 상담합니다.']];
export const metadata:Metadata={title:'자주 묻는 질문',description:'퀵서비스, 용달화물, 도시 간 택배와 제주 배송 접수 전 자주 묻는 질문입니다.',alternates:{canonical:'/faq'}};
export default function FaqPage(){return <main className="bg-white"><SiteHeader/><JsonLd data={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}}/><PageHero eyebrow="FAQ" title={<>접수 전<br/><span className="text-[#78a0ff]">자주 묻는 질문</span></>} description="운송 가능 여부는 실제 화물과 일정 확인 후 안내합니다."/><section className="px-5 py-16"><div className="mx-auto max-w-[900px] divide-y divide-[#dce5f0] border-y border-[#dce5f0]">{faqs.map(([q,a],index)=><details key={q} className="group py-1" open={index===0}><summary className="flex cursor-pointer list-none justify-between gap-6 py-6 font-black"><span>{q}</span><span className="text-xl text-[#1b4dff] group-open:rotate-45">+</span></summary><p className="pb-6 pr-10 text-sm leading-7 text-[#667085]">{a}</p></details>)}</div></section><ContactCta/><SiteFooter/><PhoneFab phone={company.nationalPhone}/></main>}
