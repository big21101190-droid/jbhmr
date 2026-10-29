import type { Region, Service } from '@/lib/domain';
import type { ServiceRoute } from '@/lib/service-routes';
import { routeOptions } from '@/lib/search-discovery';

export function RouteOptions({
  route,
  services,
  regions,
}: {
  route: ServiceRoute;
  services: Service[];
  regions: Region[];
}) {
  const { alternatives, endpoints } = routeOptions(route, services, regions);
  if (!alternatives.length && !endpoints.length) return null;
  return (
    <section className="bg-white px-5 py-14">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-3xl font-black">
          {route.origin} 출발·{route.destination} 도착 조건 비교
        </h2>
        <p className="mt-4 leading-7 text-[#475467]">
          {route.origin}에서 물품을 준비할 수 있는 시각과 {route.destination}의
          최종 수령 시각을 함께 알려주세요. 운송편 도착 이후 인수·배송 시간이
          필요하므로, 터미널이나 역 도착과 최종 배송 완료를 구분해 상담합니다.
        </p>
        {alternatives.length ? (
          <div className="mt-7">
            <h3 className="text-xl font-black">같은 방향의 다른 운송 방법</h3>
            <p className="mt-2 text-sm leading-7 text-[#475467]">
              현재 등록된 동일 출발·도착 구간입니다. 각 방법의 취급 규격·접수
              마감·연계 조건을 비교한 뒤 선택하세요.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {alternatives.map((item) => (
                <a
                  key={item.slug}
                  href={`/routes/${item.slug}`}
                  className="rounded-xl border border-[#dce5f0] p-5 font-bold text-[#1b4dff]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
        {endpoints.length ? (
          <div className="mt-7">
            <h3 className="text-xl font-black">
              출발지 픽업·도착지 최종 배송 안내
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {endpoints.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-[#dce5f0] px-5 py-3 font-bold text-[#1b4dff]"
                >
                  {item.name} 지역 운송 안내
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
