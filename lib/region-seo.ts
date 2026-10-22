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
  const content = overrides[region.id] || defaultContent(region);
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
