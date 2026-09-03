import type { Metadata } from 'next';
import { Clock3, Mail, MapPin, MessageSquareText } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { PageHero } from '@/components/page-hero';
import { PhoneFab } from '@/components/phone-fab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { company, smsHref, telHref } from '@/lib/company';

export const metadata: Metadata = {
  title: '견적 문의',
  description:
    '출발지, 도착지와 화물 정보를 남기거나 전화·문자로 제이복합물류에 문의하세요.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main className="bg-[#f4f7fb]">
      <SiteHeader />
      <PageHero
        eyebrow="CONTACT"
        title={
          <>
            출발지와 도착지만
            <br />
            <span className="text-[#78a0ff]">알려주세요</span>
          </>
        }
        description="전화·문자로 바로 상담하거나 아래 양식에 화물 정보를 남겨주세요."
      />
      <section className="px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[.72fr_1.28fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl bg-[#1b4dff] p-6 text-white">
              <p className="text-sm font-bold text-white/65">전국 접수</p>
              <a
                href={telHref(company.nationalPhone)}
                className="mt-2 block text-2xl font-black"
              >
                {company.nationalPhone}
              </a>
            </div>
            <div className="rounded-2xl bg-[#10243e] p-6 text-white">
              <p className="text-sm font-bold text-white/65">대구 전용</p>
              <a
                href={telHref(company.daeguPhone)}
                className="mt-2 block text-2xl font-black"
              >
                {company.daeguPhone}
              </a>
            </div>
            <div className="grid gap-3 rounded-2xl border border-[#dce5f0] bg-white p-6 text-sm">
              <a
                href={smsHref(company.smsPhone)}
                className="flex items-center gap-3 font-black text-[#1b4dff]"
              >
                <MessageSquareText size={19} /> 문자 상담 {company.smsPhone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-3 font-bold text-[#344054]"
              >
                <Mail size={19} className="text-[#1b4dff]" /> {company.email}
              </a>
              <p className="flex items-start gap-3 text-[#667085]">
                <Clock3 size={19} className="mt-0.5 shrink-0 text-[#1b4dff]" />
                상담 운영시간 {company.businessHours}
              </p>
              <p className="flex items-start gap-3 text-[#667085]">
                <MapPin size={19} className="mt-0.5 shrink-0 text-[#1b4dff]" />
                {company.address}
              </p>
            </div>
            <p className="px-2 text-sm leading-6 text-[#667085]">
              문의 내용에는 주민등록번호, 계좌 비밀번호 등 불필요한 민감정보를
              입력하지 마세요.
            </p>
          </aside>
          <ContactForm />
        </div>
      </section>
      <SiteFooter />
      <PhoneFab phone={company.nationalPhone} />
    </main>
  );
}
