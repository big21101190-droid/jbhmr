import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { company } from '@/lib/company';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '제이복합물류 문의 접수 개인정보 처리 안내입니다.',
  alternates: { canonical: '/privacy' },
};
export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="PRIVACY"
        title="개인정보처리방침"
        description="문의 접수 과정에서 필요한 최소한의 정보만 처리합니다."
      />
      <article className="mx-auto max-w-[900px] px-5 py-16 leading-8 text-[#475467]">
        <h2 className="text-xl font-black text-[#101828]">
          수집 항목과 이용 목적
        </h2>
        <p className="mt-3">
          이름 또는 회사명, 연락처, 출발지, 도착지, 선택 서비스와 문의 내용을
          수집하며 견적 확인과 문의 답변 목적으로만 이용합니다.
        </p>
        <h2 className="mt-10 text-xl font-black text-[#101828]">
          보유 및 이용 기간
        </h2>
        <p className="mt-3">
          문의 답변과 상담이 끝나 개인정보가 더 이상 필요하지 않으면 지체 없이
          파기합니다. 다만 관계 법령에 따라 보존해야 하는 정보가 있으면 해당
          법정 기간 동안 분리해 보관합니다.
        </p>
        <h2 className="mt-10 text-xl font-black text-[#101828]">
          동의 거부 권리
        </h2>
        <p className="mt-3">
          개인정보 수집에 동의하지 않을 수 있으나, 필수 정보가 없으면 온라인
          문의 답변이 어려울 수 있습니다. 이 경우 전화 문의를 이용할 수
          있습니다.
        </p>
        <h2 className="mt-10 text-xl font-black text-[#101828]">처리 위탁</h2>
        <p className="mt-3">
          온라인 문의 제출 내용은 사이트 운영 플랫폼인 Netlify의 Forms 기능을
          통해 안전하게 접수됩니다. 운영자가 인증된 관리 화면에서만 제출 내용을
          확인합니다.
        </p>
        <h2 className="mt-10 text-xl font-black text-[#101828]">
          개인정보 관련 문의
        </h2>
        <p className="mt-3">
          처리자: {company.name} · 대표 {company.representative}
          <br />
          주소: {company.address}
          <br />
          이메일:{' '}
          <a
            className="font-bold text-[#1b4dff] underline"
            href={`mailto:${company.email}`}
          >
            {company.email}
          </a>
          <br />
          전화: {company.nationalPhone} (대구 {company.daeguPhone})
        </p>
        <p className="mt-8 rounded-xl bg-[#edf3fb] p-5 text-sm">
          본 방침은 2026년 9월 3일부터 적용합니다. 별도의 개인정보 보호책임자
          지정 정보가 확인되면 해당 연락처를 추가합니다.
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
