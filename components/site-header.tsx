'use client';

import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import {
  areaHref,
  DAEGU_PHONE,
  NATIONAL_PHONE,
  regionGroups,
  telHref,
} from '@/lib/site-data';

const primaryLinks = [
  ['회사소개', '/about'],
  ['지역', '/regions'],
  ['자주 묻는 질문', '/faq'],
  ['견적 문의', '/contact'],
];

const serviceGroups = [
  {
    label: '퀵·화물',
    links: [
      ['오토바이 퀵', '/services/quick-motorcycle'],
      ['다마스 배송', '/services/damas'],
      ['1톤 용달화물', '/services/one-ton'],
    ],
  },
  {
    label: '터미널·철도',
    links: [
      ['고속버스택배', '/services/express-bus'],
      ['KTX택배', '/services/ktx'],
    ],
  },
  {
    label: '제주 운송',
    links: [
      ['제주 항공화물', '/services/jeju-air'],
      ['제주 선박화물', '/services/jeju-sea'],
    ],
  },
  {
    label: '여행·수하물',
    links: [
      ['골프백 배송', '/services/golf-bag'],
      ['캐리어 배송', '/services/suitcase'],
    ],
  },
];

export function SiteHeader({
  currentPhone = NATIONAL_PHONE,
}: {
  currentPhone?: string;
}) {
  const [serviceOpen, setServiceOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState(regionGroups[0]);

  return (
    <>
      <div className="bg-[#10243e] px-4 py-2.5 text-center text-[12px] font-semibold text-white sm:text-sm">
        전화접수{' '}
        <a
          className="ml-1 font-black text-[#ffce3a]"
          href={telHref(NATIONAL_PHONE)}
        >
          {NATIONAL_PHONE}
        </a>
        <span className="mx-2 text-white/30 sm:mx-3">|</span>
        <a
          className="font-black text-[#ffce3a] underline decoration-transparent underline-offset-4 transition hover:decoration-current"
          href="/contact"
        >
          인터넷접수
        </a>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#dce5f0] bg-white/95 px-4 backdrop-blur-xl sm:px-5">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-3"
            aria-label="제이복합물류 홈"
          >
            <BrandLogo />
          </a>

          <nav
            className="hidden h-full items-center gap-7 text-[13px] font-extrabold xl:flex"
            aria-label="주요 메뉴"
          >
            <a
              className="flex h-full items-center transition-colors hover:text-[#1b4dff]"
              href="/about"
            >
              회사소개
            </a>
            <button
              type="button"
              onClick={() => {
                setServiceOpen((value) => !value);
                setRegionOpen(false);
              }}
              className="flex h-full items-center gap-1.5 font-extrabold transition-colors hover:text-[#1b4dff]"
              aria-expanded={serviceOpen}
            >
              서비스 안내{' '}
              <ChevronDown
                size={15}
                className={
                  serviceOpen
                    ? 'rotate-180 transition-transform'
                    : 'transition-transform'
                }
              />
            </button>
            {primaryLinks.slice(1).map(([label, href]) => (
              <a
                key={href}
                className="flex h-full items-center transition-colors hover:text-[#1b4dff]"
                href={href}
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setRegionOpen((value) => !value);
                setServiceOpen(false);
              }}
              className="flex h-full items-center gap-1.5 font-extrabold transition-colors hover:text-[#1b4dff]"
              aria-expanded={regionOpen}
            >
              지역별 접수{' '}
              <ChevronDown
                size={15}
                className={
                  regionOpen
                    ? 'rotate-180 transition-transform'
                    : 'transition-transform'
                }
              />
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={telHref(currentPhone)}
              className="hidden items-center gap-2 rounded-full bg-[#1b4dff] px-4 py-3 text-[13px] font-black text-white shadow-[0_8px_24px_rgba(27,77,255,.22)] sm:inline-flex"
            >
              <Phone size={15} /> {currentPhone}
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-[#dce5f0] bg-white xl:hidden"
              aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {serviceOpen && (
          <div className="absolute left-1/2 top-full hidden w-[min(980px,calc(100%-40px))] -translate-x-1/2 rounded-b-2xl border border-t-0 border-[#dce5f0] bg-white p-7 shadow-[0_28px_70px_rgba(16,36,62,.2)] xl:block">
            <div className="flex items-end justify-between border-b border-[#e3e9f2] pb-5">
              <div>
                <p className="text-[11px] font-black tracking-[.15em] text-[#1b4dff]">
                  SERVICE GUIDE
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-.04em]">
                  화물에 맞는 서비스를 선택하세요
                </h2>
              </div>
              <a href="/services" className="text-sm font-black text-[#1b4dff]">
                전체 서비스 →
              </a>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-4">
              {serviceGroups.map((group) => (
                <section
                  key={group.label}
                  className="rounded-2xl bg-[#f4f7fb] p-4"
                >
                  <h3 className="text-sm font-black text-[#10243e]">
                    {group.label}
                  </h3>
                  <div className="mt-3 grid gap-1">
                    {group.links.map(([label, href]) => (
                      <a
                        key={href}
                        href={href}
                        className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[#475467] hover:bg-white hover:text-[#1b4dff]"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {regionOpen && (
          <div className="absolute left-1/2 top-full hidden w-[min(980px,calc(100%-40px))] -translate-x-1/2 overflow-hidden rounded-b-2xl border border-t-0 border-[#dce5f0] bg-white shadow-[0_28px_70px_rgba(16,36,62,.2)] xl:grid xl:grid-cols-[260px_1fr]">
            <div className="max-h-[560px] overflow-y-auto bg-[#f4f7fb] p-3">
              {regionGroups.map((region) => (
                <button
                  key={region.slug}
                  type="button"
                  onMouseEnter={() => setActiveRegion(region)}
                  onFocus={() => setActiveRegion(region)}
                  onClick={() => setActiveRegion(region)}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-bold ${activeRegion.slug === region.slug ? 'bg-[#1b4dff] text-white' : 'text-[#344054] hover:bg-white'}`}
                >
                  {region.label}
                  <span aria-hidden>›</span>
                </button>
              ))}
            </div>
            <div className="p-8">
              <p className="text-[11px] font-black tracking-[.15em] text-[#1b4dff]">
                AREA SERVICE
              </p>
              <div className="mt-2 flex items-end justify-between border-b border-[#e3e9f2] pb-5">
                <h2 className="text-2xl font-black tracking-[-.04em]">
                  {activeRegion.label} 접수
                </h2>
                <span className="text-sm font-bold text-[#667085]">
                  {activeRegion.daegu ? DAEGU_PHONE : NATIONAL_PHONE}
                </span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {activeRegion.places.map((place) => (
                  <a
                    key={place}
                    href={areaHref(activeRegion, place)}
                    className="rounded-lg border border-[#e3e9f2] px-3 py-3 text-sm font-semibold text-[#344054] transition hover:border-[#1b4dff] hover:bg-[#eff4ff] hover:text-[#1b4dff]"
                  >
                    {place} 퀵서비스
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="max-h-[calc(100vh-110px)] overflow-y-auto border-t border-[#e3e9f2] bg-white px-1 py-4 xl:hidden">
            {primaryLinks.map(([label, href]) => (
              <a
                key={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3.5 text-sm font-extrabold hover:bg-[#f4f7fb]"
                href={href}
              >
                {label}
              </a>
            ))}
            <details className="mt-2 rounded-xl bg-[#f4f7fb] px-4 py-3">
              <summary className="cursor-pointer text-sm font-black">
                서비스 안내
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {serviceGroups.map((group) => (
                  <section key={group.label}>
                    <h3 className="text-xs font-black text-[#1b4dff]">
                      {group.label}
                    </h3>
                    <div className="mt-2 grid gap-1">
                      {group.links.map(([label, href]) => (
                        <a
                          key={href}
                          onClick={() => setMobileOpen(false)}
                          href={href}
                          className="rounded-lg bg-white px-3 py-2.5 text-xs font-semibold"
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </details>
            <details className="mt-2 rounded-xl bg-[#f4f7fb] px-4 py-3">
              <summary className="cursor-pointer text-sm font-black">
                지역별 퀵서비스
              </summary>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {regionGroups.map((region) => (
                  <button
                    key={region.slug}
                    type="button"
                    onClick={() => setActiveRegion(region)}
                    className={`rounded-lg px-3 py-2.5 text-left text-xs font-bold ${activeRegion.slug === region.slug ? 'bg-[#1b4dff] text-white' : 'bg-white'}`}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#dce5f0] pt-3">
                {activeRegion.places.map((place) => (
                  <a
                    key={place}
                    onClick={() => setMobileOpen(false)}
                    href={areaHref(activeRegion, place)}
                    className="rounded-lg bg-white px-3 py-2.5 text-xs font-semibold"
                  >
                    {place} 퀵서비스
                  </a>
                ))}
              </div>
            </details>
          </div>
        )}
      </header>
    </>
  );
}
