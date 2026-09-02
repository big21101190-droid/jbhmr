import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return <main className="min-h-screen bg-[#f4f7fb]"><SiteHeader /><section className="px-5 py-28 text-center"><p className="text-sm font-black text-[#1b4dff]">404</p><h1 className="mt-3 text-4xl font-black tracking-[-.04em]">페이지를 찾을 수 없습니다</h1><p className="mt-4 text-[#667085]">주소가 변경되었거나 공개되지 않은 페이지입니다.</p><a href="/" className="mt-8 inline-flex rounded-xl bg-[#1b4dff] px-6 py-4 font-black text-white">홈으로 이동</a></section><SiteFooter /></main>;
}
