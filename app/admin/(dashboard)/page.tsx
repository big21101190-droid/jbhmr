import { LandingAdminList } from '@/components/landing-admin-list';
import { regions } from '@/data/regions';
import { services } from '@/data/services';
import { listLandings } from '@/lib/landing-store';

export default async function AdminPage(){const landings=await listLandings({includeArchived:true});return <div className="space-y-6"><LandingAdminList initial={landings}/><section id="regions" className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black">지역 관리</h2><p className="mt-2 text-sm text-[#667085]">현재 {regions.filter(r=>r.parentId).length}개 세부 지역이 랜딩 편집기의 선택 항목으로 제공됩니다. 사실 확인 전 가짜 지역 정보는 추가하지 않습니다.</p></section><section id="services" className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black">서비스 관리</h2><p className="mt-2 text-sm text-[#667085]">고객 제공 자료에서 확인된 {services.length}개 서비스 항목만 활성화되어 있습니다.</p></section></div>}
