import type { FaqItem, Region } from '@/lib/domain';

export type RegionSeoLink = {
  href: string;
  title: string;
  description: string;
  suitableFor: string;
};

export type RegionSeoContent = {
  seoTitle: string;
  h1: string;
  metaDescription: string;
  localSummary: string;
  localNotes: string[];
  directLinks: RegionSeoLink[];
  faq: FaqItem[];
};

type RegionOverride = Pick<
  RegionSeoContent,
  'seoTitle' | 'h1' | 'metaDescription' | 'localSummary' | 'localNotes'
> & {
  routeLinks?: RegionSeoLink[];
};

const serviceLinks: RegionSeoLink[] = [
  {
    href: '/services/quick-motorcycle',
    title: '오토바이 퀵서비스',
    description: '서류·샘플처럼 소형 물품의 긴급 이동 조건을 상담합니다.',
    suitableFor: '출발·도착 주소, 물품 크기, 희망 시간을 알려주세요.',
  },
  {
    href: '/services/damas',
    title: '다마스 배송',
    description: '박스 단위나 부피가 있는 소형 화물의 차량 운송을 상담합니다.',
    suitableFor: '수량, 가로·세로·높이, 무게와 상하차 환경을 확인합니다.',
  },
  {
    href: '/services/one-ton',
    title: '1톤 용달화물',
    description: '오토바이 적재가 어려운 화물의 차량 운송 조건을 안내합니다.',
    suitableFor: '화물 크기·무게, 주차·엘리베이터·계단 여부를 알려주세요.',
  },
  {
    href: '/services/express-bus',
    title: '고속버스택배 연계',
    description: '이용 가능한 터미널 노선과 출도착지 연계 조건을 확인합니다.',
    suitableFor: '도착 지역, 품목, 희망 시간과 터미널 연계 가능 여부를 봅니다.',
  },
];

const routeLinks = {
  pohang: {
    href: '/routes/seoul-pohang-express-bus',
    title: '서울–포항 고속버스택배 안내',
    description: '서울과 포항 사이의 터미널 연계 가능 여부를 확인합니다.',
    suitableFor: '운행편, 접수 시각, 품목과 최종 배송 주소를 함께 확인합니다.',
  },
  gyeongju: {
    href: '/routes/seoul-gyeongju-express-bus',
    title: '서울–경주 고속버스택배 안내',
    description: '서울과 경주 사이의 터미널 연계 운송 조건을 안내합니다.',
    suitableFor: '이용 노선, 접수 시각과 출도착지 픽업·배송 조건을 확인합니다.',
  },
} satisfies Record<string, RegionSeoLink>;

const overrides: Record<string, RegionOverride> = {
  'gyeongbuk-pohang': {
    seoTitle: '포항 퀵서비스·용달화물·고속버스택배 접수 안내',
    h1: '포항 퀵서비스·용달화물 운송 상담',
    metaDescription:
      '포항 출발·도착 소형 물품, 박스 화물, 서울 연계 운송을 상담합니다. 일반 택배 접수처가 아닌 퀵·차량·도시 간 운송 서비스이며, 물품과 일정 확인 후 1661-0122로 안내합니다.',
    localSummary:
      '포항에서 서류·샘플처럼 빠른 이동이 필요한 소형 물품부터 차량이 필요한 박스 화물, 서울 연계 운송까지 물품과 일정 조건을 확인해 적합한 방식을 안내합니다.',
    localNotes: [
      '포항 시내 이동은 물품 크기와 희망 시간을 기준으로 퀵서비스 또는 차량 운송을 검토합니다.',
      '서울 연계는 이용 가능한 고속·시외버스 노선, 접수 시각과 터미널 연계 가능 여부를 확인한 뒤 안내합니다.',
    ],
    routeLinks: [routeLinks.pohang],
  },
  'gyeongbuk-gumi': {
    seoTitle: '구미 퀵서비스·다마스·1톤 용달화물 운송 안내',
    h1: '구미 퀵서비스와 차량 화물 운송 상담',
    metaDescription:
      '구미 출발·도착 소형 긴급 물품, 박스 화물, 차량 운송을 상담합니다. 일반 택배 접수처가 아닌 퀵·다마스·1톤 용달화물 안내 서비스이며, 물품과 상하차 조건을 확인해 1661-0122로 안내합니다.',
    localSummary:
      '구미에서 출발하거나 도착하는 소형 긴급 물품과 부피 있는 화물은 적재 크기, 수량, 상하차 환경을 확인한 뒤 퀵서비스·다마스·1톤 차량 중 적합한 방식을 상담합니다.',
    localNotes: [
      '서류와 샘플처럼 소형 물품은 퀵서비스 적합 여부를, 박스 화물은 차량 적재 조건을 먼저 확인합니다.',
      '다른 도시로 보내는 화물은 출발·도착 주소와 희망 시간을 바탕으로 가능한 연계 방식을 안내합니다.',
    ],
  },
  'gyeongbuk-gyeongsan': {
    seoTitle: '경산 퀵서비스와 대구·전국 연계 화물 운송 안내',
    h1: '경산 퀵서비스·용달화물 운송 상담',
    metaDescription:
      '경산과 대구 인접 권역의 소형 긴급 물품, 다마스·1톤 화물, 도시 간 연계 운송을 상담합니다. 일반 택배 접수처가 아닌 운송 상담 서비스이며 접수 조건을 확인해 1661-0122로 안내합니다.',
    localSummary:
      '경산은 대구 인접 권역의 출발·도착 조건을 함께 살펴, 소형 물품은 퀵서비스로, 부피 있는 화물은 다마스 또는 1톤 차량으로 상담합니다.',
    localNotes: [
      '경산과 대구 사이 이동은 정확한 주소와 물품 크기를 기준으로 운송 방식을 검토합니다.',
      '전국 연계가 필요한 경우에는 품목, 희망 시간과 이용 가능한 노선을 확인한 뒤 안내합니다.',
    ],
  },
  'gyeongbuk-gyeongju': {
    seoTitle: '경주 긴급 퀵서비스·용달화물·도시 간 운송 접수',
    h1: '경주 퀵서비스와 도시 간 화물 운송 상담',
    metaDescription:
      '경주 출발·도착 긴급 소형 물품, 다마스·1톤 화물, 서울 연계 운송을 상담합니다. 일반 택배 접수처가 아닌 퀵·차량·도시 간 운송 서비스이며 1661-0122에서 조건을 확인합니다.',
    localSummary:
      '경주에서 빠르게 옮겨야 하는 소형 물품, 차량 적재가 필요한 화물, 서울 연계 운송은 출발·도착 조건과 희망 시간을 확인한 뒤 상담합니다.',
    localNotes: [
      '소형 물품과 부피 화물은 같은 방식으로 접수하지 않으며, 크기·무게와 상하차 환경을 먼저 확인합니다.',
      '서울 연계는 이용 가능한 노선과 접수 시각을 확인한 뒤 고속버스택배 연계 여부를 안내합니다.',
    ],
    routeLinks: [routeLinks.gyeongju],
  },
  'gyeongbuk-andong': {
    seoTitle: '안동 퀵서비스·다마스·1톤 용달화물 상담 안내',
    h1: '안동 소형 긴급 물품·차량 화물 운송 상담',
    metaDescription:
      '안동 출발·도착 퀵서비스, 다마스, 1톤 용달화물을 상담합니다. 일반 택배 접수처가 아닌 긴급·차량 운송 안내 서비스이며, 물품 크기와 일정 확인 후 1661-0122로 안내합니다.',
    localSummary:
      '안동에서 출발하거나 도착하는 물품은 소형 긴급 이동인지, 차량 적재가 필요한 화물인지에 따라 필요한 정보와 운송 방식이 달라집니다.',
    localNotes: [
      '서류·샘플 등 소형 물품은 출발·도착 주소와 희망 시간을 확인합니다.',
      '박스·부피 화물은 수량, 크기, 무게와 상하차 환경을 기준으로 차량 운송을 검토합니다.',
    ],
  },
  'gyeongbuk-hayang': {
    seoTitle: '하양 퀵서비스·용달화물과 경산·대구 연계 운송 안내',
    h1: '하양 퀵서비스·차량 화물 운송 상담',
    metaDescription:
      '하양과 경산·대구 인접 권역의 소형 긴급 물품, 다마스·1톤 화물 운송을 상담합니다. 일반 택배 접수처가 아닌 퀵·차량 운송 안내 서비스이며 1661-0122에서 접수 조건을 확인합니다.',
    localSummary:
      '하양에서 경산·대구 인접 권역으로 이동하는 물품은 주소와 물품 크기, 희망 시간을 바탕으로 퀵서비스 또는 차량 운송을 상담합니다.',
    localNotes: [
      '인접 지역 이동도 출발·도착 주소와 상하차 환경에 따라 필요한 차량이 달라질 수 있습니다.',
      '도시 간 연계가 필요한 경우에는 품목과 희망 일정을 먼저 확인해 가능한 방식을 안내합니다.',
    ],
  },
  'gyeongbuk-jillyang': {
    seoTitle: '진량 퀵서비스·다마스·1톤 화물 운송 상담 안내',
    h1: '진량 소형 물품·용달화물 운송 상담',
    metaDescription:
      '진량과 경산·대구 인접 권역의 퀵서비스, 다마스, 1톤 용달화물을 상담합니다. 일반 택배 접수처가 아닌 긴급·차량 운송 안내 서비스이며, 물품과 일정 확인 후 1661-0122로 안내합니다.',
    localSummary:
      '진량에서 출발하거나 도착하는 물품은 소형 긴급 이동과 차량 화물을 구분해, 물품 크기·수량·상하차 조건에 맞춰 운송 방식을 상담합니다.',
    localNotes: [
      '소형 물품은 퀵서비스 적합 여부를, 박스나 부피 화물은 다마스·1톤 차량 적재 조건을 확인합니다.',
      '경산·대구 인접 권역 연계는 출발·도착 주소와 희망 시간을 기준으로 안내합니다.',
    ],
  },
  'daegu-dong': {
    seoTitle: '대구 동구 퀵서비스·용달화물·도시 간 운송 안내',
    h1: '대구 동구 퀵서비스·차량 화물 운송 상담',
    metaDescription:
      '대구 동구 출발·도착 소형 긴급 물품, 다마스·1톤 화물, 도시 간 연계 운송을 상담합니다. 일반 택배 접수처가 아닌 퀵·차량 운송 안내 서비스이며 053-955-2005에서 조건을 확인합니다.',
    localSummary:
      '대구 동구에서 출발하거나 도착하는 소형 물품과 차량 화물은 주소, 적재 크기, 희망 시간을 확인한 뒤 알맞은 운송 방식을 상담합니다.',
    localNotes: [
      '대구 인접 권역 이동은 물품 크기와 상하차 환경을 기준으로 퀵서비스 또는 차량 운송을 검토합니다.',
      '다른 도시로 보내는 화물은 이용 노선과 접수 조건 확인이 필요합니다.',
    ],
  },
  'daegu-dalseong': {
    seoTitle: '대구 달성군 퀵서비스·다마스·1톤 용달화물 안내',
    h1: '대구 달성군 퀵서비스·차량 화물 운송 상담',
    metaDescription:
      '대구 달성군과 인접 권역의 소형 긴급 물품, 다마스·1톤 용달화물을 상담합니다. 일반 택배 접수처가 아닌 퀵·차량 운송 안내 서비스이며 053-955-2005에서 접수 조건을 확인합니다.',
    localSummary:
      '대구 달성군에서 출발하거나 도착하는 물품은 소형 긴급 이동과 차량 적재 화물을 구분해 운송 조건을 상담합니다.',
    localNotes: [
      '화물의 수량·크기·무게와 상하차 환경을 확인하면 차량 선택을 더 정확하게 안내할 수 있습니다.',
      '인접 지역 또는 도시 간 이동은 주소와 희망 시간을 기준으로 가능한 방식을 확인합니다.',
    ],
  },
};

type FocusProfile = {
  seoFocus: string;
  heading: string;
  localContext: string;
  localNote: string;
};

const focusProfiles: Record<string, FocusProfile> = {
  seoul: { seoFocus: '서울 퀵서비스·용달화물·도시 간 운송', heading: '퀵서비스와 도시 간 화물 운송 상담', localContext: '서울 전역의 출발·도착 조건과 전국 주요 도시 연계를 함께 확인해', localNote: '서울 안팎 이동은 출발지·도착지의 정확한 주소와 희망 시간을 기준으로 운송 방식을 검토합니다.' },
  'seoul-gangnam': { seoFocus: '강남구 퀵서비스·다마스·1톤 용달', heading: '강남구 소형 긴급 물품·차량 화물 상담', localContext: '강남구에서 출발하거나 도착하는 소형 물품과 차량 화물의', localNote: '강남구의 상하차 환경, 주차 가능 여부와 물품 적재 크기를 함께 확인합니다.' },
  'seoul-seocho': { seoFocus: '서초구 퀵서비스·용달화물·도시 간 운송', heading: '서초구 퀵서비스와 차량 화물 상담', localContext: '서초구의 긴급 소형 물품과 부피 화물의', localNote: '서초구 안팎 이동은 건물 출입·주차 조건과 희망 상차 시간을 기준으로 상담합니다.' },
  'seoul-songpa': { seoFocus: '송파구 퀵서비스·다마스·1톤 화물', heading: '송파구 소형 물품·용달화물 운송 상담', localContext: '송파구 출발·도착 물품의 적재 조건과 일정에 맞는', localNote: '송파구에서 차량이 필요한 화물은 수량, 크기·무게와 상하차 위치를 확인합니다.' },
  'seoul-yeongdeungpo': { seoFocus: '영등포구 퀵서비스·용달화물 운송', heading: '영등포구 긴급 물품·차량 화물 상담', localContext: '영등포구의 소형 긴급 물품과 박스 화물에 필요한', localNote: '영등포구 출발·도착 화물은 물품 종류와 희망 시간에 따라 퀵 또는 차량 운송을 검토합니다.' },
  'seoul-mapo': { seoFocus: '마포구 퀵서비스·다마스·1톤 용달', heading: '마포구 퀵서비스·차량 화물 운송 상담', localContext: '마포구에서 빠르게 옮겨야 하는 물품과 차량 적재 화물의', localNote: '마포구의 출발·도착 주소와 엘리베이터·계단 여부를 알려주시면 차량 조건을 확인합니다.' },
  'seoul-jongno': { seoFocus: '종로구 퀵서비스·용달화물·도시 간 운송', heading: '종로구 소형 긴급 물품·화물 운송 상담', localContext: '종로구 안팎의 소형 물품과 부피 화물 운송에 필요한', localNote: '종로구 이동은 정확한 건물명·출입 위치와 상하차 조건을 함께 확인합니다.' },
  'seoul-yongsan': { seoFocus: '용산구 퀵서비스·다마스·1톤 화물', heading: '용산구 퀵서비스와 차량 화물 상담', localContext: '용산구 출발·도착 화물의 크기와 이동 일정에 맞는', localNote: '용산구에서 다른 지역으로 연결하는 화물은 도착지와 희망 시간을 먼저 확인합니다.' },
  'seoul-seongdong': { seoFocus: '성동구 퀵서비스·용달화물 운송', heading: '성동구 소형 물품·차량 화물 상담', localContext: '성동구의 긴급 소형 물품과 차량 적재 화물에 적합한', localNote: '성동구의 물품 수량과 적재 크기, 상하차 환경을 기준으로 운송 방식을 안내합니다.' },
  'gyeonggi-gapyeong': { seoFocus: '가평 퀵서비스·용달화물 운송', heading: '가평 소형 물품·차량 화물 상담', localContext: '가평 출발·도착 화물의 일정과 적재 조건에 맞는', localNote: '가평과 다른 지역 사이 운송은 출발·도착 주소와 희망 시간을 확인한 뒤 안내합니다.' },
  'gyeonggi-goyang': { seoFocus: '고양 퀵서비스·다마스·1톤 용달', heading: '고양 퀵서비스와 차량 화물 상담', localContext: '고양시의 소형 긴급 물품과 부피 화물에 필요한', localNote: '고양시 안팎 이동은 물품 크기·무게와 건물 상하차 조건을 기준으로 검토합니다.' },
  'gyeonggi-hanam': { seoFocus: '하남 퀵서비스·용달화물 운송', heading: '하남 소형 물품·차량 화물 상담', localContext: '하남 출발·도착 물품의 크기와 희망 시간에 맞는', localNote: '하남의 차량 화물은 주차·엘리베이터·계단 여부와 적재 조건을 확인합니다.' },
  'gyeonggi-hwaseong': { seoFocus: '화성 퀵서비스·다마스·1톤 화물', heading: '화성 퀵서비스·용달화물 상담', localContext: '화성 지역의 긴급 소형 물품과 차량 화물에 적합한', localNote: '화성 출발·도착 운송은 정확한 주소, 물품 수량과 상하차 환경 확인이 필요합니다.' },
  'gyeonggi-icheon': { seoFocus: '이천 퀵서비스·용달화물 운송', heading: '이천 소형 물품·차량 화물 상담', localContext: '이천 출발·도착 화물의 물품 조건과 일정에 따른', localNote: '이천에서 다른 도시로 보내는 화물은 품목과 희망 시간에 따라 가능한 연계를 확인합니다.' },
  'gyeonggi-namyangju': { seoFocus: '남양주 퀵서비스·다마스·1톤 용달', heading: '남양주 퀵서비스·차량 화물 상담', localContext: '남양주 안팎의 소형 물품과 부피 화물 운송에 필요한', localNote: '남양주 운송은 출발·도착 주소와 물품 적재 크기를 기준으로 상담합니다.' },
  'gyeonggi-osan': { seoFocus: '오산 퀵서비스·용달화물 운송', heading: '오산 긴급 물품·차량 화물 상담', localContext: '오산 출발·도착 물품의 긴급도와 적재 조건에 맞는', localNote: '오산의 소형 물품은 퀵서비스 적합 여부를, 부피 화물은 차량 조건을 확인합니다.' },
  'gyeonggi-paju': { seoFocus: '파주 퀵서비스·다마스·1톤 화물', heading: '파주 퀵서비스와 차량 화물 상담', localContext: '파주에서 출발하거나 도착하는 물품의 조건을 확인해', localNote: '파주와 수도권·다른 도시 간 이동은 도착지와 희망 시간을 기준으로 안내합니다.' },
  'gyeonggi-pocheon': { seoFocus: '포천 퀵서비스·용달화물 운송', heading: '포천 소형 물품·차량 화물 상담', localContext: '포천 출발·도착 화물의 물품 종류와 상하차 환경에 맞는', localNote: '포천 화물은 수량, 크기·무게, 차량 진입 조건을 함께 알려주세요.' },
  'gyeonggi-pyeongtaek': { seoFocus: '평택 퀵서비스·다마스·1톤 용달', heading: '평택 퀵서비스·차량 화물 상담', localContext: '평택의 소형 긴급 물품과 차량 적재 화물에 필요한', localNote: '평택 출발·도착 운송은 화물 크기와 희망 상차·도착 시간을 기준으로 검토합니다.' },
  'gyeonggi-seongnam': { seoFocus: '성남 퀵서비스·용달화물·도시 간 운송', heading: '성남 소형 물품·차량 화물 상담', localContext: '성남 지역의 빠른 소형 물품 이동과 차량 화물에 맞는', localNote: '성남의 건물 상하차 환경과 물품 적재 조건을 확인하면 운송 방식을 안내할 수 있습니다.' },
  'gyeonggi-suwon': { seoFocus: '수원 퀵서비스·다마스·1톤 화물', heading: '수원 퀵서비스와 차량 화물 상담', localContext: '수원 출발·도착 물품의 크기와 이동 일정에 따른', localNote: '수원 안팎 운송은 정확한 출발·도착 주소와 물품 수량을 먼저 확인합니다.' },
  'gyeonggi-uijeongbu': { seoFocus: '의정부 퀵서비스·용달화물 운송', heading: '의정부 소형 물품·차량 화물 상담', localContext: '의정부의 소형 긴급 물품과 부피 화물에 필요한', localNote: '의정부에서 다른 지역으로 보내는 화물은 도착지와 희망 시간을 확인해 상담합니다.' },
  'gyeonggi-uiwang': { seoFocus: '의왕 퀵서비스·다마스·1톤 용달', heading: '의왕 퀵서비스·차량 화물 상담', localContext: '의왕 출발·도착 화물의 수량과 적재 조건에 맞는', localNote: '의왕 차량 화물은 주차·엘리베이터·계단 등 상하차 환경을 함께 확인합니다.' },
  'gyeonggi-yeoju': { seoFocus: '여주 퀵서비스·용달화물 운송', heading: '여주 소형 물품·차량 화물 상담', localContext: '여주에서 출발하거나 도착하는 소형 물품과 차량 화물의', localNote: '여주와 다른 도시 간 이동은 품목, 정확한 주소와 희망 시간을 기준으로 안내합니다.' },
  'gyeonggi-yeoncheon': { seoFocus: '연천 퀵서비스·용달화물 운송', heading: '연천 소형 물품·차량 화물 상담', localContext: '연천 출발·도착 화물의 이동 일정과 적재 조건에 맞는', localNote: '연천 화물은 출발·도착 주소, 물품 크기와 상하차 환경을 먼저 확인합니다.' },
  'gyeonggi-yongin': { seoFocus: '용인 퀵서비스·다마스·1톤 용달', heading: '용인 퀵서비스·차량 화물 상담', localContext: '용인 지역의 긴급 소형 물품과 차량 적재 화물에 적합한', localNote: '용인 안팎 운송은 물품 수량·크기·무게와 희망 시간을 함께 알려주세요.' },
  'gyeonggi-dongtan': { seoFocus: '동탄 퀵서비스·용달화물 운송', heading: '동탄 소형 물품·차량 화물 상담', localContext: '동탄 출발·도착 물품의 크기와 상하차 조건에 따른', localNote: '동탄 지역 이동은 정확한 주소와 차량 진입·주차 가능 여부를 기준으로 검토합니다.' },
  'daegu-buk': { seoFocus: '대구 북구 퀵서비스·용달화물 운송', heading: '대구 북구 소형 물품·차량 화물 상담', localContext: '대구 북구의 긴급 소형 물품과 차량 화물에 필요한', localNote: '대구 북구 안팎 이동은 물품 크기와 희망 시간을 기준으로 퀵 또는 차량 운송을 상담합니다.' },
  'daegu-dalseo': { seoFocus: '대구 달서구 퀵서비스·다마스·1톤 화물', heading: '대구 달서구 퀵서비스·차량 화물 상담', localContext: '대구 달서구 출발·도착 물품의 적재 조건에 맞는', localNote: '대구 달서구 차량 화물은 수량, 크기·무게와 상하차 환경을 확인합니다.' },
  'daegu-dasa': { seoFocus: '대구 다사 퀵서비스·용달화물 운송', heading: '대구 다사 소형 물품·차량 화물 상담', localContext: '대구 다사와 인접 권역의 소형 물품·차량 화물에 적합한', localNote: '대구 다사 이동은 출발·도착 주소와 희망 시간에 따라 운송 방식을 안내합니다.' },
  'daegu-jung': { seoFocus: '대구 중구 퀵서비스·용달화물 운송', heading: '대구 중구 긴급 물품·차량 화물 상담', localContext: '대구 중구의 소형 긴급 물품과 부피 화물에 필요한', localNote: '대구 중구 운송은 건물 출입 위치, 주차와 상하차 조건을 함께 확인합니다.' },
  'daegu-nam': { seoFocus: '대구 남구 퀵서비스·다마스·1톤 화물', heading: '대구 남구 퀵서비스·차량 화물 상담', localContext: '대구 남구 출발·도착 화물의 크기와 일정에 맞는', localNote: '대구 남구의 소형 물품과 차량 화물은 적재 조건을 구분해 상담합니다.' },
  'daegu-seo': { seoFocus: '대구 서구 퀵서비스·용달화물 운송', heading: '대구 서구 소형 물품·차량 화물 상담', localContext: '대구 서구의 빠른 소형 물품 이동과 차량 화물에 맞는', localNote: '대구 서구 출발·도착 운송은 물품 수량과 상하차 환경을 기준으로 검토합니다.' },
  'daegu-seongseo': { seoFocus: '대구 성서 퀵서비스·다마스·1톤 용달', heading: '대구 성서 퀵서비스·차량 화물 상담', localContext: '대구 성서와 인접 권역의 소형 물품·부피 화물에 적합한', localNote: '대구 성서 이동은 정확한 주소와 화물 적재 크기를 확인해 안내합니다.' },
  'daegu-suseong': { seoFocus: '대구 수성구 퀵서비스·용달화물 운송', heading: '대구 수성구 소형 물품·차량 화물 상담', localContext: '대구 수성구 출발·도착 물품의 긴급도와 적재 조건에 따른', localNote: '대구 수성구에서 다른 도시로 보내는 화물은 품목과 희망 시간을 확인합니다.' },
  'busan-busanjin': { seoFocus: '부산진구 퀵서비스·용달화물 운송', heading: '부산진구 소형 물품·차량 화물 상담', localContext: '부산진구의 긴급 소형 물품과 차량 화물에 필요한', localNote: '부산진구 이동은 출발·도착 주소, 물품 크기와 상하차 조건을 기준으로 상담합니다.' },
  'busan-dong': { seoFocus: '부산 동구 퀵서비스·다마스·1톤 화물', heading: '부산 동구 퀵서비스·차량 화물 상담', localContext: '부산 동구 출발·도착 물품의 수량과 적재 조건에 맞는', localNote: '부산 동구에서 다른 지역으로 보내는 화물은 도착지와 희망 시간을 확인합니다.' },
  'busan-dongnae': { seoFocus: '부산 동래구 퀵서비스·용달화물 운송', heading: '부산 동래구 소형 물품·차량 화물 상담', localContext: '부산 동래구의 소형 긴급 물품과 부피 화물에 적합한', localNote: '부산 동래구 운송은 물품 크기·무게와 상하차 환경을 함께 확인합니다.' },
  'busan-geumjeong': { seoFocus: '부산 금정구 퀵서비스·다마스·1톤 용달', heading: '부산 금정구 퀵서비스·차량 화물 상담', localContext: '부산 금정구 출발·도착 화물의 일정과 적재 조건에 따른', localNote: '부산 금정구의 차량 화물은 주차·엘리베이터·계단 여부를 확인합니다.' },
  'busan-haeundae': { seoFocus: '부산 해운대구 퀵서비스·용달화물 운송', heading: '부산 해운대구 소형 물품·차량 화물 상담', localContext: '부산 해운대구의 긴급 소형 물품과 차량 화물에 필요한', localNote: '부산 해운대구 이동은 정확한 출발·도착 주소와 희망 시간을 기준으로 안내합니다.' },
  'busan-jung': { seoFocus: '부산 중구 퀵서비스·다마스·1톤 화물', heading: '부산 중구 퀵서비스·차량 화물 상담', localContext: '부산 중구 출발·도착 물품의 크기와 상하차 조건에 맞는', localNote: '부산 중구의 소형 물품은 퀵서비스 적합 여부를 먼저 확인합니다.' },
  'busan-saha': { seoFocus: '부산 사하구 퀵서비스·용달화물 운송', heading: '부산 사하구 소형 물품·차량 화물 상담', localContext: '부산 사하구의 소형 긴급 물품과 부피 화물에 적합한', localNote: '부산 사하구 화물은 수량, 크기·무게와 차량 진입 조건을 확인합니다.' },
  'busan-seo': { seoFocus: '부산 서구 퀵서비스·다마스·1톤 용달', heading: '부산 서구 퀵서비스·차량 화물 상담', localContext: '부산 서구 출발·도착 물품의 긴급도와 적재 조건에 따른', localNote: '부산 서구에서 도시 간 연계가 필요한 화물은 품목과 희망 일정을 확인합니다.' },
};

export const priorityRegionSeoIds = new Set([
  ...Object.keys(overrides),
  ...Object.keys(focusProfiles),
]);

function focusedContent(region: Region, profile: FocusProfile): RegionOverride {
  return {
    seoTitle: profile.seoFocus,
    h1: profile.heading,
    metaDescription: `${region.name} 출발·도착 퀵서비스, 다마스, 1톤 용달화물을 상담합니다. 일반 택배 접수처가 아닌 긴급·차량·도시 간 운송 안내 서비스이며, 물품과 일정 확인 후 상담 전화로 안내합니다.`,
    localSummary: `${profile.localContext} 퀵서비스, 다마스 또는 1톤 차량 중 적합한 방식을 상담합니다.`,
    localNotes: [
      profile.localNote,
      '도시 간 연계는 출발·도착 주소, 품목, 희망 시간과 이용 가능한 노선을 확인한 뒤 안내합니다.',
    ],
  };
}
function defaultContent(region: Region): RegionOverride {
  const localName = region.name;
  return {
    seoTitle: `${localName} 퀵서비스·용달화물 운송 상담 안내`,
    h1: `${localName} 소형 물품·차량 화물 운송 상담`,
    metaDescription: `${localName} 출발·도착 퀵서비스, 다마스, 1톤 용달화물을 상담합니다. 일반 택배 접수처가 아닌 긴급·차량 운송 안내 서비스이며, 물품과 일정 확인 후 상담 전화로 안내합니다.`,
    localSummary: `${region.description} 소형 긴급 물품인지, 차량 적재가 필요한 화물인지에 따라 출발·도착 주소와 물품 조건을 확인해 운송 방식을 안내합니다.`,
    localNotes: [
      '서류·샘플 등 소형 물품은 출발·도착 주소, 물품 크기와 희망 시간을 확인합니다.',
      '박스나 부피 화물은 수량, 크기·무게, 주차·엘리베이터·계단 등 상하차 환경을 함께 확인합니다.',
    ],
  };
}

function faqFor(region: Region): FaqItem[] {
  const name = region.name;
  return [
    {
      question: `${name}에서 긴급 운송을 접수할 때 무엇을 알려줘야 하나요?`,
      answer: `정확한 출발지와 도착지, 물품 종류·수량·크기·무게, 희망 상차 또는 도착 시간, 상하차 환경을 알려주세요. 확인한 조건을 바탕으로 가능한 운송 방식을 안내합니다.`,
    },
    {
      question: `${name}에서 일반 택배가 아닌 운송 상담이 필요한 경우는 언제인가요?`,
      answer: '제이복합물류는 편의점 택배나 일반 택배 계약 접수처가 아닙니다. 빠른 이동이 필요한 소형 물품, 차량 적재가 필요한 화물, 도시 간 연계 운송처럼 물품과 일정 조건 확인이 필요한 경우를 상담합니다.',
    },
    {
      question: `${name}에서 다른 도시로 보내는 화물도 상담할 수 있나요?`,
      answer: '출발·도착 주소, 품목, 희망 시간과 이용 가능한 노선을 확인한 뒤 가능한 연계 방식을 안내합니다. 운행편과 접수 시각에 따라 가능 여부가 달라질 수 있습니다.',
    },
  ];
}

export function getRegionSeoContent(region: Region): RegionSeoContent {
  const content =
    overrides[region.id] ||
    (focusProfiles[region.id]
      ? focusedContent(region, focusProfiles[region.id])
      : defaultContent(region));
  return {
    ...content,
    directLinks: [...serviceLinks, ...(content.routeLinks || [])],
    faq: faqFor(region),
  };
}

export function regionFaqSchema(content: RegionSeoContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
