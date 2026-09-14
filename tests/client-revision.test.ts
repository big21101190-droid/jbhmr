import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { busRoutes } from '@/data/bus-routes';
import { services } from '@/data/services';
import { getServiceRoutes } from '@/lib/service-routes';

describe('client revision release contract', () => {
  it('defines thirteen unique linked bus routes', () => {
    const home = readFileSync('app/page.tsx', 'utf8');
    const routePage = readFileSync('app/routes/[slug]/page.tsx', 'utf8');
    expect(busRoutes).toHaveLength(13);
    expect(new Set(busRoutes.map((route) => route.slug)).size).toBe(13);
    expect(
      busRoutes.every((route) => route.label.endsWith('고속버스택배')),
    ).toBe(true);
    expect(home).toContain('href={`/routes/${route.slug}`}');
    expect(routePage).toContain('href={`/routes/${item.slug}`}');
    expect(routePage).toContain('getServiceRoutes');
  });

  it('links every configured intercity and Jeju route intent', () => {
    const servicePage = readFileSync('app/services/[slug]/page.tsx', 'utf8');
    const routeSlugs = services
      .flatMap(getServiceRoutes)
      .map((route) => route.slug);
    expect(routeSlugs).toHaveLength(19);
    expect(servicePage).toContain('href={`/routes/${route.slug}`}');
    expect(servicePage).not.toContain('return busRoute ?');
    const manager = readFileSync('components/catalog-managers.tsx', 'utf8');
    expect(manager).toContain('활성/비활성');
    expect(manager).toContain("active: status === '활성'");
  });

  it('implements the requested public information cleanup', () => {
    const home = readFileSync('app/page.tsx', 'utf8');
    const about = readFileSync('app/about/page.tsx', 'utf8');
    const contact = readFileSync('app/contact/page.tsx', 'utf8');
    const contactForm = readFileSync('components/contact-form.tsx', 'utf8');
    const footer = readFileSync('components/site-footer.tsx', 'utf8');
    const faq = readFileSync('app/faq/page.tsx', 'utf8');
    const service = readFileSync('app/services/[slug]/page.tsx', 'utf8');
    const landingView = readFileSync('components/landing-view.tsx', 'utf8');
    expect(home).not.toContain('address: company.address');
    expect(about).not.toContain('address: company.address');
    expect(service).not.toContain('address: company.address');
    expect(landingView).not.toContain('address: company.address');
    expect(about).not.toContain("['사업장 주소', company.address]");
    expect(about).not.toContain("['대구 전용전화', company.daeguPhone]");
    expect(contact).not.toContain('company.daeguPhone');
    expect(contact).not.toContain('company.smsPhone');
    expect(contact).not.toContain('company.address');
    expect(footer).not.toContain('company.daeguPhone');
    expect(footer).not.toContain('company.smsPhone');
    expect(footer).not.toContain('company.address');
    expect(faq).not.toContain('company.smsPhone');
    expect(faq).not.toContain('문자 상담');
    expect(contactForm).toContain('3분 이내 연락이 없으면');
  });

  it('keeps large landing lists manageable and images equally sized', () => {
    const admin = readFileSync('components/landing-admin-list.tsx', 'utf8');
    const landingView = readFileSync('components/landing-view.tsx', 'utf8');
    const gallery = readFileSync('components/landing-gallery.tsx', 'utf8');
    expect(admin).toContain('목록 펼치기');
    expect(admin).toContain('visibleCount');
    expect(admin).toContain('최근 수정순');
    expect(landingView).toContain('<LandingGallery');
    expect(gallery).toContain('lg:grid-cols-3');
    expect(gallery).toContain('object-contain');
    expect(gallery).not.toContain('md:row-span-2');
  });

  it('exposes every generated route through a stable-URL admin editor', () => {
    const adminPage = readFileSync('app/admin/(dashboard)/page.tsx', 'utf8');
    const routeList = readFileSync(
      'components/service-route-admin-list.tsx',
      'utf8',
    );
    const routeEditor = readFileSync(
      'components/service-route-editor.tsx',
      'utf8',
    );
    const routePage = readFileSync('app/routes/[slug]/page.tsx', 'utf8');
    expect(adminPage).toContain('getAllServiceRoutes');
    expect(routeList).toContain('제목·출발지·도착지·서비스·URL 검색');
    expect(routeEditor).toContain('기존 URL은 유지되었습니다');
    expect(routeEditor).toContain('ALT 텍스트');
    expect(routeEditor).toContain('관리용 이름');
    expect(routePage).toContain('alt={');
    expect(routePage).toContain('<PlainText');
  });

  it('keeps the exact global reception and footer license copy', () => {
    const header = readFileSync('components/site-header.tsx', 'utf8');
    const footer = readFileSync('components/site-footer.tsx', 'utf8');
    expect(header).toContain('전화접수');
    expect(header).toContain('href="/contact"');
    expect(footer).toContain('화물자동차 운송주선사업 허가 제2024-05호');
  });

  it('does not introduce fixed catalog limits', () => {
    const source = [
      readFileSync('lib/catalog-store.ts', 'utf8'),
      readFileSync('components/catalog-managers.tsx', 'utf8'),
    ].join('\n');
    expect(source).not.toMatch(/MAX_(REGIONS|SERVICES)/);
  });

  it('keeps active root and child regions available to landing editors', () => {
    const editor = readFileSync('components/landing-editor.tsx', 'utf8');
    expect(editor).not.toContain('r.parentId &&');
    expect(editor).toContain('r.active && !r.archived');
  });
});
