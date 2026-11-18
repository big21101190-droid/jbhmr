import { serviceRoutePlaceKey, type ServiceRoute } from '@/lib/service-routes';

// These are booking checks, not claims of local branches or guaranteed services.
const guides: Record<string, { title: string; checks: string[] }> = {
  부산: {
    title: '부산역 특송 인수와 최종 배송지를 따로 정하세요',
    checks: [
      '부산행 화물을 접수할 때는 "부산 도착"만으로 인수 장소를 정하지 말고, 실제 열차가 닿는 역명과 특송 영업소 위치를 먼저 확인해 주세요. 역사 내 영업소 운영 시간이 열차 도착 시각과 다를 수 있습니다.',
      '최종 수령지가 사무실·매장·숙소 중 어디인지와 수령 가능한 시간을 함께 알려주세요. 열차 도착 후에도 영업소 인수, 최종 주소까지의 이동이 남으므로 열차 도착 시각과 고객 인도 시각을 구분해 상담합니다.',
      '수령인이 역에서 직접 찾을지, 주소까지 연계 배송을 요청할지 먼저 정하면 필요한 운송 구간을 비교할 수 있습니다.',
    ],
  },
  대구: {
    title: '동대구역 인수와 대구 내 배송 구간을 확인하세요',
    checks: [
      '서울에서 대구로 보내는 경우 실제 도착역(동대구역 등)과 특송 영업소 위치를 먼저 확인합니다. "대구역 근처"라는 설명만으로 접수를 확정하지 말고 접수증에 표시된 역명을 전달해 주세요.',
      '대구 내 최종 배송지는 구·동과 도로명주소, 수령인 연락처까지 준비합니다. 매장 영업 전후 납품이나 사업장 마감이 있으면 역 인수 이후 배송 시간을 포함해 일정을 검토합니다.',
      '발송인이 이미 KTX 특송을 접수했다면 열차편, 도착 예정 시각, 접수번호와 박스 수량을 알려주세요. 아직 접수 전이라면 서울 출발지 픽업부터 필요한지 구분해서 상담할 수 있습니다.',
    ],
  },
  대전: {
    title: '대전역 인수 장소와 최종 주소를 혼동하지 않도록 확인하세요',
    checks: [
      '대전행 접수에는 도착역의 정확한 이름이 필요합니다. 고속버스 수화물과 KTX 특송은 접수·인수 절차가 다르므로 "대전역 근처"라는 최종 주소만으로 운송편을 정하지 않습니다.',
      '받는 곳이 연구실·사무실·공장이라면 담당자 연락처와 인수 가능한 시간을 준비해 주세요. 방문 등록이나 정해진 물품 인계 장소가 있는 경우, 그 조건을 도착지 배송 상담에 포함합니다.',
      '제출·사용 시각이 정해진 서류나 샘플은 희망 도착 시간이 아니라 실제 필요한 시각을 알려주세요. 열차 시간표와 역 인수 이후 배송까지 가능한지 확인하고 시간이 맞지 않으면 다른 운송 방법을 비교합니다.',
    ],
  },
  오송: {
    title: '오송역 환승 특성과 실제 수령 지역을 함께 확인하세요',
    checks: [
      '오송역은 경부선·호남선이 갈라지는 분기역입니다. 최종 수령지가 오송 인근인지, 청주·세종 등 인접 지역으로 다시 이동해야 하는지 전체 주소로 알려주세요.',
      '오송역 인수만으로 끝나지 않고 추가 배송이 필요하다면, 그 이동 구간과 소요 시간을 역 인수 시간과 별도로 검토합니다. 받는 분이 직접 역에서 찾는 경우에도 인수 가능 시간을 미리 확인해 주세요.',
      '열차편에 따라 오송역 정차 여부와 특송 취급 가능 여부가 달라질 수 있으므로, 접수 전 이용 가능한 열차와 영업소 운영 여부를 함께 확인합니다.',
    ],
  },
};

export function KtxRouteGuide({ route }: { route: ServiceRoute }) {
  const guide = Object.entries(guides).find(
    ([name]) =>
      serviceRoutePlaceKey(name) === serviceRoutePlaceKey(route.destination),
  )?.[1];
  if (
    route.serviceId !== 'ktx' ||
    serviceRoutePlaceKey(route.origin) !== 'seoul' ||
    !guide
  )
    return null;
  return (
    <section
      className="bg-white px-5 py-14 sm:py-20"
      aria-label={`${route.origin} ${route.destination} KTX 특송 접수 안내`}
    >
      <div className="mx-auto max-w-[1050px]">
        <h2 className="text-3xl font-black">
          서울→{route.destination} 화물, 접수 전에 확인할 사항
        </h2>
        <h3 className="mt-6 text-xl font-bold">{guide.title}</h3>
        <div className="mt-5 space-y-4 leading-8 text-[#475467]">
          {guide.checks.map((check) => (
            <p key={check}>{check}</p>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-[#f4f7fb] p-6">
          <h3 className="text-xl font-bold">
            견적과 도착 시간은 어떻게 확인하나요?
          </h3>
          <p className="mt-3 leading-8 text-[#475467]">
            서울 픽업 주소, {route.destination} 최종 수령 주소, 포장한
            크기·무게·수량과 필요한 도착 시각을 준비해 주세요. 출발지 픽업 비용,
            KTX 특송 운임, 도착지 인수·배송 비용 중 어디까지 포함하는지 확인하고
            대기·상하차 등 추가 조건도 함께 상담합니다.
          </p>
          <p className="mt-3 leading-8 text-[#475467]">
            서울에서 직접 접수한 화물을 {route.destination}에서 인수하는 구간만
            요청할 수도 있습니다. 실제 이용 편과 접수번호를 확인한 뒤 가능
            여부를 안내하며, 고정 운임·소요시간을 보장하지 않습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
