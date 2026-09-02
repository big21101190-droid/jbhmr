import { DAEGU_PHONE, NATIONAL_PHONE, telHref } from '@/lib/site-data';
import { BrandLogo } from '@/components/brand-logo';

export function SiteFooter() {
  return (
    <footer className="bg-[#0c192c] px-5 pb-28 pt-12 text-white sm:pb-12">
      <div className="mx-auto grid max-w-[1240px] gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <a href="/" aria-label="제이복합물류 홈"><BrandLogo inverted /></a>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">지역 내 퀵서비스부터 전국 화물, 도시 간 택배와 제주·여행 짐 배송까지 한 번에 상담합니다.</p>
        </div>
        <div>
          <p className="text-xs font-black tracking-[.14em] text-[#78a0ff]">CONTACT</p>
          <a href={telHref(NATIONAL_PHONE)} className="mt-4 block text-xl font-black">전국 {NATIONAL_PHONE}</a>
          <a href={telHref(DAEGU_PHONE)} className="mt-2 block text-xl font-black">대구 {DAEGU_PHONE}</a>
        </div>
        <div>
          <p className="text-xs font-black tracking-[.14em] text-[#78a0ff]">SERVICE</p>
          <p className="mt-4 text-sm leading-7 text-white/60">퀵 · 용달화물<br />고속버스 · KTX택배<br />제주 항공 · 선박<br />골프백 · 캐리어</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-2 pt-6 text-xs text-white/35 sm:flex-row sm:justify-between">
        <span>© J EXPRESS. All rights reserved.</span><span>상담 후 화물 조건과 노선에 따라 운송 방법 및 요금이 안내됩니다.</span>
      </div>
    </footer>
  );
}
