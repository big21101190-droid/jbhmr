import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const createdAt = '2026-09-02T00:00:00.000Z';

const daegu = [
  ['daegu-jung', '대구 중구', '도심 업무시설과 상가가 밀집한 중구'],
  ['daegu-dong', '대구 동구', '동대구역과 산업·주거 지역이 이어지는 동구'],
  ['daegu-seo', '대구 서구', '산업단지와 상업 지역이 함께 있는 서구'],
  ['daegu-nam', '대구 남구', '주거지와 의료·교육 시설이 연결된 남구'],
  ['daegu-buk', '대구 북구', '유통단지와 도심 생활권이 넓게 형성된 북구'],
  ['daegu-suseong', '대구 수성구', '업무·주거 지역과 생활 편의시설이 모인 수성구'],
  ['daegu-dalseo', '대구 달서구', '성서산업단지와 대규모 주거권이 있는 달서구'],
  ['daegu-dalseong', '대구 달성군', '산업단지와 읍·면 지역 이동 거리가 긴 달성군'],
  ['daegu-dasa', '대구 다사', '대구 서북부 생활권과 성서 지역이 가까운 다사'],
  ['daegu-seongseo', '대구 성서', '산업 현장과 사업체 물류 수요가 많은 성서'],
];

const gyeongbuk = [
  ['gyeongbuk-gyeongsan', '경북 경산', '대구 생활권과 산업·대학가가 이어지는 경산'],
  ['gyeongbuk-hayang', '경북 하양', '대학가와 주거·산업 지역이 연결되는 하양'],
  ['gyeongbuk-jillyang', '경북 진량', '산업단지와 주변 사업장이 분포한 진량'],
  ['gyeongbuk-pohang', '경북 포항', '산업 물류와 해안 생활권이 넓은 포항'],
  ['gyeongbuk-gyeongju', '경북 경주', '도심과 관광·산업 권역이 함께 있는 경주'],
  ['gyeongbuk-gumi', '경북 구미', '국가산업단지와 사업체가 밀집한 구미'],
  ['gyeongbuk-andong', '경북 안동', '도심과 경북 북부권을 연결하는 안동'],
];

const services = {
  'quick-motorcycle': {
    name: '퀵서비스', image: '/service-freight.png', keyword: '퀵서비스',
    summary: '서류, 샘플과 소형 물품을 보낼 때 출발지와 도착지를 확인해 오토바이 퀵 접수를 안내합니다.',
    use: '작은 물품을 정해진 시간 안에 전달해야 하는 업무 연락, 부품 전달, 서류 이동에 적합한지 확인합니다.',
    check: '포장 상태와 물품 크기, 수령 가능 시간을 알려주시면 이동 구간에 맞춰 상담할 수 있습니다.',
  },
  damas: {
    name: '다마스 배송', image: '/service-freight.png', keyword: '다마스퀵',
    summary: '오토바이에 싣기 어려운 박스와 소형 집기는 수량과 크기를 확인해 다마스 차량을 상담합니다.',
    use: '박스가 여러 개이거나 높이와 부피가 있는 소형 화물을 한 번에 이동해야 할 때 검토합니다.',
    check: '가장 큰 물품의 가로·세로·높이와 전체 수량을 알려주시면 차량 적재 가능 여부 확인이 빠릅니다.',
  },
  'one-ton': {
    name: '1톤 용달', image: '/service-freight.png', keyword: '1톤용달',
    summary: '자재와 집기처럼 크고 무거운 화물은 상하차 조건을 함께 확인해 1톤 차량을 안내합니다.',
    use: '사업장 자재, 가전, 사무용 집기 등 승합 차량에 싣기 어려운 화물을 운송할 때 상담합니다.',
    check: '총중량, 가장 큰 물품 크기, 엘리베이터와 지게차 사용 여부를 접수 전에 확인합니다.',
  },
  'express-bus': {
    name: '고속버스택배', image: '/service-ktx.jpg', keyword: '고속버스택배',
    summary: '주요 도시 터미널 노선과 접수 마감 시간을 확인해 당일 도시 간 화물 이동을 상담합니다.',
    use: '도시 간 정기 노선을 이용할 수 있는 소형 화물과 긴급 물품의 터미널 연계를 검토합니다.',
    check: '출발·도착 터미널과 희망 수령 시간, 앞뒤 구간 퀵 연계 필요 여부를 확인합니다.',
  },
  ktx: {
    name: 'KTX택배', image: '/service-ktx.jpg', keyword: 'KTX택배',
    summary: '이용 가능한 철도 구간과 열차 시간을 확인하고 역 앞뒤 구간을 포함한 배송을 상담합니다.',
    use: '역을 이용할 수 있는 긴급 서류와 소형 물품의 도시 간 이동이 필요한 경우 검토합니다.',
    check: '열차 운행과 접수 가능 여부가 달라질 수 있어 품목과 희망 시간을 먼저 확인합니다.',
  },
  'jeju-air': {
    name: '제주 항공화물', image: '/service-jeju.png', keyword: '제주항공화물',
    summary: '품목과 크기, 희망 도착 일정에 따라 제주행 항공화물과 지역 탁송 연계를 상담합니다.',
    use: '항공 운송이 가능한 긴급 화물과 일정이 정해진 물품의 제주 이동을 검토합니다.',
    check: '항공 제한 품목과 포장 상태, 출발 공항 전후 운송 구간을 접수 전에 확인합니다.',
  },
  'jeju-sea': {
    name: '제주 선박화물', image: '/service-jeju.png', keyword: '제주선박화물',
    summary: '부피와 중량, 선박 일정을 기준으로 제주·서귀포 방향 화물 운송을 상담합니다.',
    use: '항공보다 부피가 크거나 일정에 여유가 있는 화물의 제주 이동 방법을 검토합니다.',
    check: '품목, 전체 크기와 무게, 희망 도착일을 바탕으로 운항 일정과 탁송 구간을 확인합니다.',
  },
  'golf-bag': {
    name: '골프백 배송', image: '/service-golf.png', keyword: '골프백배송',
    summary: '골프장 또는 숙소 이용일에 맞춰 골프백과 캐디백의 출발·도착 일정을 상담합니다.',
    use: '이동 중 무거운 장비를 직접 들고 다니지 않도록 일정에 앞서 골프백 배송을 검토합니다.',
    check: '이용일, 수량, 출발지와 정확한 수령 장소를 알려주시면 필요한 기간을 안내합니다.',
  },
};

const combinations = [
  ...daegu.flatMap(([regionId, regionName, note]) => ['quick-motorcycle', 'damas', 'one-ton'].map((serviceId) => ({ regionId, regionName, note, serviceId, phone: '053-955-2005' }))),
  ...gyeongbuk.flatMap(([regionId, regionName, note]) => ['quick-motorcycle', 'damas'].map((serviceId) => ({ regionId, regionName, note, serviceId, phone: '1661-0122' }))),
  { regionId: 'seoul-gangnam', regionName: '서울 강남구', note: '업무시설과 상업 지역 간 긴급 이동이 잦은 강남구', serviceId: 'express-bus', phone: '1661-0122' },
  { regionId: 'busan-busanjin', regionName: '부산 부산진구', note: '부산 도심 교통과 터미널 접근을 함께 고려하는 부산진구', serviceId: 'express-bus', phone: '1661-0122' },
  { regionId: 'daejeon-yuseong', regionName: '대전 유성구', note: '연구·산업 시설과 대전역 연계를 함께 검토하는 유성구', serviceId: 'ktx', phone: '1661-0122' },
  { regionId: 'jeju-jeju-city', regionName: '제주 제주시', note: '공항과 제주시 생활권의 출도착 연결이 필요한 제주시', serviceId: 'jeju-air', phone: '1661-0122' },
  { regionId: 'jeju-seogwipo', regionName: '제주 서귀포시', note: '제주 남부권까지 내륙 탁송 일정을 함께 봐야 하는 서귀포시', serviceId: 'jeju-sea', phone: '1661-0122' },
  { regionId: 'gyeonggi-yongin', regionName: '경기 용인', note: '여러 골프장과 수도권 생활권이 연결되는 용인', serviceId: 'golf-bag', phone: '1661-0122' },
];

const variantIntros = [
  '접수 전 이동 구간을 먼저 확인하면 차량과 예상 진행 방식을 빠르게 정리할 수 있습니다.',
  '같은 지역 안에서도 거리와 상하차 환경이 달라 정확한 주소 확인이 중요합니다.',
  '희망 도착 시간이 정해져 있다면 접수할 때 함께 알려주셔야 가능한 방법을 판단할 수 있습니다.',
  '화물 수량이 여러 개라면 전체 수량과 가장 큰 물품의 크기를 함께 확인합니다.',
  '출발지 또는 도착지 한쪽이 다른 지역이어도 전체 이동 구간을 기준으로 상담합니다.',
];

const landings = combinations.map((item, index) => {
  const service = services[item.serviceId];
  const slug = `${item.regionId}-${item.serviceId}`;
  const keyword = `${item.regionName} ${service.keyword}`;
  const title = `${item.regionName} ${service.name}`;
  const summary = `${item.note}에서 ${service.summary} ${variantIntros[index % variantIntros.length]}`;
  return {
    id: `initial-${String(index + 1).padStart(3, '0')}`,
    regionId: item.regionId,
    serviceId: item.serviceId,
    primaryKeyword: keyword,
    secondaryKeywords: [`${item.regionName} 화물배송`, `${item.regionName} 당일배송`],
    slug,
    title,
    h1: `${title} 접수 안내`,
    metaTitle: `${title} 상담 | 제이복합물류`,
    metaDescription: `${item.regionName} ${service.name} 상담. 출발지·도착지와 화물 정보를 확인해 접수 방법을 안내합니다. 전화 ${item.phone}.`,
    heroImage: service.image,
    summary,
    sections: [
      { heading: `${item.regionName}에서 ${service.name}가 필요할 때`, body: `${item.note}에서는 이동 거리와 시간대, 상하차 위치에 따라 진행 조건이 달라집니다. ${service.use}` },
      { heading: '접수 전에 확인할 내용', body: `${service.check} ${variantIntros[(index + 2) % variantIntros.length]}` },
      { heading: '출발지부터 도착지까지 상담', body: `제이복합물류는 ${item.regionName} 출발과 도착 요청을 모두 상담합니다. 주소, 품목, 수량과 희망 시간을 전화로 알려주시면 확인 가능한 운송 방법을 안내합니다.` },
    ],
    faq: [
      { question: `${item.regionName}에서 바로 접수할 수 있나요?`, answer: `네. ${item.phone}로 출발지와 도착지, 물품 정보를 알려주시면 ${item.regionName} 구간을 확인해 안내합니다.` },
      { question: `${service.name} 비용은 어떻게 확인하나요?`, answer: '이동 거리, 화물 크기와 무게, 상하차 조건, 희망 시간에 따라 달라지므로 전화 상담 후 안내합니다.' },
    ],
    ctaLabel: `${item.regionName} 접수 ${item.phone}`,
    ctaLink: `tel:${item.phone.replaceAll('-', '')}`,
    relatedRegions: [],
    relatedServices: [],
    status: 'PUBLISHED',
    indexPolicy: 'INDEX',
    canonical: null,
    ogTitle: `${title} | 제이복합물류`,
    ogDescription: `${item.regionName} ${service.name} 접수에 필요한 화물 정보와 상담 방법을 확인하세요.`,
    ogImage: service.image,
    redirectTo: null,
    createdAt,
    updatedAt: createdAt,
    publishedAt: createdAt,
  };
});

if (landings.length !== 50) throw new Error(`Expected 50 landings, got ${landings.length}`);

await mkdir(resolve(root, 'data'), { recursive: true });
await writeFile(resolve(root, 'data/initial-landings.json'), `${JSON.stringify(landings, null, 2)}\n`);
await writeFile(resolve(root, 'initial-landing-plan.json'), `${JSON.stringify(landings.map(({ id, regionId, serviceId, primaryKeyword, slug, status, indexPolicy }) => ({ id, regionId, serviceId, primaryKeyword, slug, status, indexPolicy })), null, 2)}\n`);

console.log(`Generated ${landings.length} initial landings.`);
