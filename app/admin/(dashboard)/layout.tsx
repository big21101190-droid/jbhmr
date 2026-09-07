import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminSignout } from '@/components/admin-signout';
import { BrandLogo } from '@/components/brand-logo';
import { getAdminUser } from '@/lib/auth';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'관리자',robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){const user=await getAdminUser();if(!user)redirect('/admin/login');return <div className="min-h-screen overflow-x-hidden bg-[#f4f7fb]"><header className="bg-[#10243e] px-5 text-white"><div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between"><a href="/"><BrandLogo inverted/></a><div className="flex items-center gap-5"><span className="hidden text-sm text-white/55 sm:inline">{user.email}</span><AdminSignout/></div></div></header><div className="mx-auto grid min-w-0 max-w-[1400px] gap-6 px-5 py-7 lg:grid-cols-[220px_minmax(0,1fr)]"><aside className="h-fit min-w-0 rounded-2xl bg-white p-3 shadow-sm"><nav className="grid gap-1 text-sm font-bold"><a href="/admin" className="rounded-xl px-4 py-3 hover:bg-[#edf3fb]">SEO 랜딩페이지</a><a href="/admin/landings/new" className="rounded-xl bg-[#1b4dff] px-4 py-3 text-white">새 랜딩 만들기</a><a href="/admin#regions" className="rounded-xl px-4 py-3 hover:bg-[#edf3fb]">지역 관리</a><a href="/admin#services" className="rounded-xl px-4 py-3 hover:bg-[#edf3fb]">서비스 관리</a><a href="/" className="rounded-xl px-4 py-3 text-[#667085] hover:bg-[#edf3fb]">사이트 보기 ↗</a></nav></aside><div className="min-w-0">{children}</div></div></div>}
