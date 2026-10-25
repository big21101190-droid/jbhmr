import type { Service } from '@/lib/domain';

const decisions: Record<string, { situation: string; check: string }> = {
  'quick-motorcycle': {
    situation:
      '서류·샘플처럼 작고 가벼운 물품을 주소에서 주소로 빠르게 옮기고 싶을 때',
    check:
      '포장한 크기와 무게부터 확인합니다. 오토바이 적재가 어렵거나 파손 우려가 크면 차량 운송을 함께 검토합니다.',
  },
  damas: {
    situation:
      '오토바이 적재가 어려운 박스나 부피가 있는 소형 화물에 차량이 필요할 때',
    check:
      '박스별 가로·세로·높이와 총수량을 알려주세요. 화물 사진, 무게와 상하차 위치를 확인해 적재 가능 여부를 안내합니다.',
  },
  'one-ton': {
    situation: '박스가 많거나 크고 무거워 적재 공간이 더 필요한 화물일 때',
    check:
      '가장 큰 물품의 규격과 총무게, 차량 진입 공간, 상하차 인원·장비 필요 여부를 함께 확인합니다.',
  },
  'express-bus': {
    situation:
      '도시 간 소형 화물을 터미널 운송편과 출도착지 퀵으로 연결하고 싶을 때',
    check:
      '이용 가능한 편, 터미널 접수 마감, 취급 규격과 도착 후 인수 조건을 확인합니다. 운송편 시간과 최종 주소 도착 시간은 다릅니다.',
  },
  ktx: {
    situation:
      '도시 간 소형 물품을 이용 가능한 KTX 특송 구간으로 연결하고 싶을 때',
    check:
      '해당 구간 영업소의 운영 여부와 취급 품목, 열차편, 접수 마감을 먼저 확인합니다. 지역에 역이 있다는 이유만으로 접수를 확정하지 않습니다.',
  },
  'jeju-air': {
    situation: '제주로 보내는 물품의 항공편 및 현지 배송 연계를 검토할 때',
    check:
      '품목·포장·크기·무게와 희망 일정을 확인합니다. 항공 취급 제한, 접수 마감과 기상·운항 변경에 따라 가능 여부가 달라집니다.',
  },
  'jeju-sea': {
    situation: '제주행 부피 화물의 선박 운송과 현지 배송 일정을 상담할 때',
    check:
      '선적 가능한 품목·포장 상태, 이용 항만과 운항 일정을 확인합니다. 항공과 같은 도착 시간을 전제로 선택하지 않습니다.',
  },
  'golf-bag': {
    situation: '골프장·숙소 이용 일정에 맞춰 골프백을 보내고 싶을 때',
    check:
      '골프백 개수와 포장 상태, 수령 장소의 인수 가능 시간, 사용 일정을 확인합니다. 여행 일정에 여유를 두고 상담해 주세요.',
  },
  suitcase: {
    situation: '공항·숙소 등 지정 장소로 캐리어를 옮겨야 할 때',
    check:
      '크기·수량, 출발·도착지 인수 담당자와 보관 가능 여부, 항공편·체크인 등 실제 사용 시각을 확인합니다.',
  },
};

export function ShippingDecisionGuide({
  name,
  services,
}: {
  name: string;
  services: Service[];
}) {
  const active = services.filter(
    (service) => service.active && !service.archived,
  );
  return (
    <section
      className="bg-white px-5 py-14 sm:py-20"
      aria-label={`${name} 운송 방법 비교`}
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-3xl font-black">{name} 운송 방법 비교</h2>
        <p className="mt-4 max-w-3xl leading-7 text-[#475467]">
          물품이 작다고 항상 오토바이가 적합한 것은 아닙니다. 포장 크기와 무게,
          필요한 적재 공간, 희망 일정을 먼저 정하면 운송 방식을 비교하기
          쉽습니다. 아래 안내는 선택 기준이며 실제 배차·접수 가능 여부는 상담 후
          확인합니다.
        </p>
        {active.length ? (
          <section
            className="mt-7 overflow-x-auto rounded-2xl border border-[#dce5f0]"
            aria-label="서비스별 선택 조건 표"
          >
            <table className="w-full min-w-[680px] text-left text-sm">
              <caption className="sr-only">
                운송 상황별 방법과 접수 전에 확인할 조건
              </caption>
              <thead className="bg-[#edf3fb]">
                <tr>
                  <th scope="col" className="p-4">
                    운송 방법
                  </th>
                  <th scope="col" className="p-4">
                    이런 상황에 비교하세요
                  </th>
                  <th scope="col" className="p-4">
                    선택 전 확인할 조건
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce5f0]">
                {active.map((service) => (
                  <tr key={service.id}>
                    <th scope="row" className="p-4 align-top">
                      <a
                        href={`/services/${service.slug}`}
                        className="font-bold text-[#1b4dff] underline underline-offset-4"
                      >
                        {service.name}
                      </a>
                    </th>
                    <td className="p-4 align-top leading-7 text-[#475467]">
                      {decisions[service.id]?.situation ||
                        service.shortDescription}
                    </td>
                    <td className="p-4 align-top leading-7 text-[#475467]">
                      {decisions[service.id]?.check ||
                        service.trustNotes[0] ||
                        '품목, 포장 상태와 출도착 조건을 확인한 뒤 상담합니다.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <p className="mt-5">
            공개된 운송 방법이 없습니다. 물품과 주소를 알려주시면 상담 시 확인해
            드립니다.
          </p>
        )}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl bg-[#f4f7fb] p-6">
            <h3 className="text-xl font-black">
              비용은 어떤 조건으로 달라지나요?
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#475467]">
              같은 지역 안의 이동도 정확한 출발·도착 주소와 차량 종류에 따라
              운임이 달라집니다. 박스 개수만으로 비교하기보다 포장한
              크기·총무게, 필요한 적재 공간과 이동 구간을 함께 알려주세요. 계단
              운반, 대기, 주차, 상하차 인원·장비 또는 터미널·역 연계가 필요하면
              그 조건을 포함한 견적인지 확인하세요.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#475467]">
              정액 요금을 임의로 적용하지 않으며, 상담한 운송 범위와 추가 작업
              조건을 확인한 뒤 접수합니다.
            </p>
          </article>
          <article className="rounded-2xl bg-[#f4f7fb] p-6">
            <h3 className="text-xl font-black">
              도착 희망 시각은 어떻게 확인하나요?
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#475467]">
              물품이 준비되는 시각, 픽업 가능한 시각, 최종 주소에서 받아야 하는
              시각을 구분해 알려주세요. 도시 간 운송은 출발지 픽업, 운송편 접수,
              도착 후 인수·배달 시간이 모두 필요합니다. 운송편 도착 시각을 문 앞
              배송 완료 시각으로 해석하면 일정이 어긋날 수 있습니다.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#475467]">
              접수 마감·교통·운항·배차 상황을 확인한 뒤 가능 일정을 안내합니다.
              당일 도착이나 일정 시간을 일률적으로 보장하지 않습니다.
            </p>
          </article>
        </div>
        <article className="mt-6 rounded-2xl border border-[#dce5f0] p-6">
          <h3 className="text-xl font-black">포장과 인계 전에 준비할 정보</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-[#475467]">
            <li>
              물품이 움직이지 않도록 포장하고, 깨지기 쉬운 부분·액체·온도 관리
              필요 여부를 접수 전에 알려주세요.
            </li>
            <li>
              가장 큰 물품의 규격과 총수량·총무게를 알려주세요. 사진은 적재
              상담을 돕지만 크기 정보를 대신하지 않습니다.
            </li>
            <li>
              보내는 곳과 받는 곳의 인계 가능 시간, 건물
              진입·주차·엘리베이터·계단 등 작업 조건을 확인해 주세요.
            </li>
            <li>
              특수 포장·보관이 필요하거나 취급 제한이 있을 수 있는 품목은 미리
              확인하고, 접수 가능 여부를 확인한 후 준비해 주세요.
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
