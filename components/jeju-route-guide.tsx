import { serviceRoutePlaceKey, type ServiceRoute } from '@/lib/service-routes';

// These are booking checks, not claims of local branches, flight/sailing schedules
// or guaranteed services.
type Guide = { title: string; checks: string[] };

const airGuides: Record<string, Guide> = {
  제주: {
    title: '제주공항 화물터미널 인수 조건을 먼저 확인하세요',
    checks: [
      '항공화물은 접수 마감 시각이 버스·열차보다 이릅니다. 희망 도착일이 정해져 있다면 항공편 접수 마감과 실제 출고 가능 시각을 먼저 확인해 주세요.',
      '제주공항 화물터미널에서 직접 찾으실지, 터미널 인수 후 최종 주소까지 연계 배송이 필요한지 먼저 정해 주세요. 공항 인근과 제주 시내는 추가 이동 시간이 다릅니다.',
      '항공 운송은 품목·중량·부피 제한이 버스 수화물보다 엄격할 수 있습니다. 배터리 포함 전자기기, 액체류, 깨지기 쉬운 물품은 접수 전 취급 가능 여부를 확인해 주세요.',
    ],
  },
  서귀포: {
    title: '제주공항 도착 이후 서귀포까지 추가 이동을 계획하세요',
    checks: [
      '항공화물은 제주공항에 도착하므로, 서귀포까지는 별도의 도착지 연계 배송이 필요합니다. 공항 인수부터 서귀포 최종 주소까지 전체 소요 시간을 먼저 확인해 주세요.',
      '숙소나 행사장으로 보내는 경우 예약자 이름과 현장에서 받을 담당자, 인수 가능 시간을 알려주세요. 항공편 도착 시각과 서귀포 도착 예정 시각은 다르게 안내됩니다.',
      '기상 영향으로 항공편 결항·지연이 발생할 수 있습니다. 행사·일정과 맞물린 화물은 여유 시간을 두고 접수하는 것이 좋습니다.',
    ],
  },
};

const seaGuides: Record<string, Guide> = {
  제주: {
    title: '제주항 선적 일정과 소요 시간을 먼저 확인하세요',
    checks: [
      '선박화물은 항공보다 소요 시간이 길고 출항 스케줄이 제한적입니다. 희망 도착일이 있다면 출항 요일·시간과 선적 마감을 먼저 확인해 주세요.',
      '제주항 터미널에서 직접 찾으실지, 터미널 인수 후 최종 주소까지 연계 배송이 필요한지 먼저 정해 주세요. 터미널과 제주 시내는 추가 이동 시간이 다릅니다.',
      '중량·부피가 큰 화물, 차량 탁송과 연계되는 물품은 선적 가능 규격과 서류를 사전에 확인해 주세요. 기상에 따라 결항될 수 있습니다.',
    ],
  },
  서귀포: {
    title: '제주항 입항 이후 서귀포까지 추가 이동을 계획하세요',
    checks: [
      '선박화물은 제주항(또는 이용 항구)에 도착하므로, 서귀포까지는 별도의 도착지 연계 배송이 필요합니다. 입항부터 서귀포 최종 주소까지 전체 소요 시간을 먼저 확인해 주세요.',
      '숙소나 행사장으로 보내는 경우 예약자 이름과 현장에서 받을 담당자, 인수 가능 시간을 알려주세요. 출항 스케줄이 길어 일반 택배보다 전체 일정이 늘어날 수 있습니다.',
      '기상 영향으로 결항·지연이 항공보다 자주 발생할 수 있습니다. 행사·일정과 맞물린 화물은 여유 시간을 충분히 두고 접수하는 것이 좋습니다.',
    ],
  },
};

export function JejuRouteGuide({ route }: { route: ServiceRoute }) {
  const guides =
    route.serviceId === 'jeju-air'
      ? airGuides
      : route.serviceId === 'jeju-sea'
        ? seaGuides
        : null;
  const guide = guides
    ? Object.entries(guides).find(
        ([name]) =>
          serviceRoutePlaceKey(name) ===
          serviceRoutePlaceKey(route.destination),
      )?.[1]
    : null;
  if (serviceRoutePlaceKey(route.origin) !== 'seoul' || !guide) return null;
  const modeLabel = route.serviceId === 'jeju-air' ? '항공화물' : '선박화물';
  return (
    <section
      className="bg-white px-5 py-14 sm:py-20"
      aria-label={`${route.origin} ${route.destination} ${modeLabel} 접수 안내`}
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
            {modeLabel} 운임, 도착지 인수·배송 비용 중 어디까지 포함하는지
            확인하고 대기·상하차 등 추가 조건도 함께 상담합니다.
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
