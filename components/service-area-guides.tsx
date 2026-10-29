import type { Landing } from '@/lib/domain';
import { serviceLandings } from '@/lib/search-discovery';

export function ServiceAreaGuides({
  serviceId,
  serviceName,
  landings,
}: {
  serviceId: string;
  serviceName: string;
  landings: Landing[];
}) {
  const guides = serviceLandings(serviceId, landings);
  if (!guides.length) return null;
  return (
    <section className="bg-white px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-3xl font-black">지역별 {serviceName} 상세 안내</h2>
        <p className="mt-4 leading-7 text-[#475467]">
          출발·도착 지역에 맞는 기존 안내에서 취급 품목과 접수 조건을
          확인하세요. 실제 배차와 이용 가능 여부는 물품·주소·일정을 확인한 뒤
          안내합니다.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((landing) => (
            <a
              key={landing.id}
              href={`/delivery/${landing.slug}`}
              className="rounded-xl border border-[#dce5f0] p-5 hover:border-[#1b4dff]"
            >
              <h3 className="font-bold text-[#1b4dff]">{landing.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#475467]">
                {landing.summary}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
