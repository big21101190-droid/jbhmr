import { BrandLogo } from '@/components/brand-logo';
import { company, nationwideCoverage, telHref } from '@/lib/company';

export function SiteFooter() {
  return (
    <footer className="bg-[#0c192c] px-5 pb-28 pt-12 text-white sm:pb-12">
      <div className="mx-auto grid max-w-[1240px] gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <a href="/" aria-label="제이복합물류 홈">
            <BrandLogo inverted />
          </a>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
            지역 내 퀵서비스부터 전국 화물, 도시 간 택배와 제주·여행 짐 배송까지
            한 번에 상담합니다.
          </p>
          <div className="mt-5 space-y-1 text-xs leading-5 text-white/45">
            <p>
              대표 {company.representative} · 사업자등록번호{' '}
              {company.businessRegistrationNumber}
            </p>
            <p className="max-w-xl">{nationwideCoverage}</p>
            <p>상담 운영시간 {company.businessHours}</p>
            <p>화물자동차 운송주선사업 허가 제2024-05호</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-black tracking-[.14em] text-[#78a0ff]">
            CONTACT
          </p>
          <a
            href={telHref(company.nationalPhone)}
            className="mt-4 block text-xl font-black"
          >
            전국 {company.nationalPhone}
          </a>
          <a
            href={`mailto:${company.email}`}
            className="mt-3 block break-all text-sm text-white/55"
          >
            {company.email}
          </a>
        </div>
        <div>
          <p className="text-xs font-black tracking-[.14em] text-[#78a0ff]">
            MENU
          </p>
          <nav
            className="mt-4 grid grid-cols-2 gap-x-4 text-sm leading-8 text-white/60"
            aria-label="하단 메뉴"
          >
            <a href="/about">회사소개</a>
            <a href="/services">서비스</a>
            <a href="/regions">지역</a>
            <a href="/faq">FAQ</a>
            <a href="/contact">문의</a>
            <a href="/privacy">개인정보처리방침</a>
          </nav>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-2 pt-6 text-xs text-white/35 sm:flex-row sm:justify-between">
        <span>© {company.name}. All rights reserved.</span>
        <span>
          상담 후 화물 조건과 노선에 따라 운송 방법 및 요금이 안내됩니다.
        </span>
      </div>
    </footer>
  );
}
