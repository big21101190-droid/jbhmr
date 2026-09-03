import type { Service } from '@/lib/domain';

const insuranceNote =
  '보험 적용 여부와 보상 범위는 운송 건, 배차 차량과 품목에 따라 달라질 수 있어 접수할 때 확인합니다.';

export const services: Service[] = [
  {
    id: 'quick-motorcycle',
    name: '오토바이 퀵서비스',
    slug: 'quick-motorcycle',
    group: 'LOCAL',
    shortDescription:
      '서류와 샘플 등 소형 물품의 지역 내 빠른 이동을 상담합니다.',
    description:
      '출발지와 도착지, 물품 크기와 희망 시간을 확인해 오토바이 퀵서비스 접수를 안내합니다.',
    keywords: ['퀵서비스', '오토바이퀵', '당일배송'],
    image: '/service-quick.svg',
    imageAlt: '도심 도로를 달리는 오토바이 퀵서비스 일러스트',
    contentStatus: 'CONFIRMED_BASIC',
    heroTitle: '작은 화물을 빠르게',
    heroAccent: '오토바이 퀵서비스',
    summary:
      '서류, 샘플, 작은 부품처럼 오토바이에 안전하게 적재할 수 있는 물품을 중심으로 출발지와 도착지에 맞춰 배차를 상담합니다.',
    facts: [
      { label: '적합한 화물', value: '서류·샘플·소형 물품' },
      { label: '접수 방식', value: '당일 또는 지정일 상담' },
      { label: '대구 접수', value: '053-955-2005' },
      { label: '전국 접수', value: '1661-0122' },
    ],
    items: ['서류', '샘플', '작은 부품', '소형 박스'],
    transport: ['오토바이'],
    areas: ['대구 전 지역', '그 외 지역은 가능 여부 확인'],
    process: [
      {
        title: '출발·도착지 접수',
        body: '정확한 주소와 희망 시간을 알려주세요.',
      },
      { title: '물품 확인', body: '크기, 무게와 파손 위험 여부를 확인합니다.' },
      {
        title: '배차 안내',
        body: '적재 가능 여부와 예상 요금을 확인한 뒤 배차합니다.',
      },
    ],
    pricing: null,
    trustNotes: [insuranceNote],
    provenance: [
      { source: '기본정보.txt', note: '실제 제공 서비스 목록' },
      {
        source: '퀵서비스&화물 상세내용.hwpx',
        note: '논공읍 한정 세부자료, 전국 일반화 금지',
      },
    ],
    faqs: [
      {
        question: '어떤 물품에 적합한가요?',
        answer:
          '서류, 샘플, 작은 부품처럼 오토바이에 안전하게 실을 수 있는 소형 물품에 적합합니다. 크기와 무게를 먼저 알려주세요.',
      },
      {
        question: '당일 접수가 가능한가요?',
        answer:
          '지역, 시간과 물품을 확인한 뒤 당일 배차 가능 여부를 안내합니다.',
      },
    ],
    active: true,
    sortOrder: 10,
  },
  {
    id: 'damas',
    name: '다마스 배송',
    slug: 'damas',
    group: 'LOCAL',
    shortDescription: '박스 단위와 부피 있는 소형 화물을 위한 차량 배송입니다.',
    description:
      '오토바이에 싣기 어려운 박스나 소형 집기를 다마스 차량으로 운송할 수 있도록 상담합니다.',
    keywords: ['다마스퀵', '다마스용달', '소형화물'],
    image: '/service-damas.svg',
    imageAlt: '소형 화물차를 활용한 다마스 배송 안내 이미지',
    contentStatus: 'CONFIRMED_BASIC',
    heroTitle: '박스와 소형 집기는',
    heroAccent: '다마스 배송',
    summary:
      '오토바이보다 부피가 큰 박스, 소형 집기와 여러 개의 물품을 차량으로 옮길 때 적재 크기와 상하차 조건을 확인합니다.',
    facts: [
      { label: '적합한 화물', value: '박스·소형 집기·소형 화물' },
      { label: '필수 확인', value: '가로·세로·높이와 무게' },
      { label: '대구 접수', value: '053-955-2005' },
      { label: '전국 접수', value: '1661-0122' },
    ],
    items: ['박스 화물', '소형 집기', '여러 개의 소화물'],
    transport: ['다마스', '화물 조건에 따라 라보 상담'],
    areas: ['대구 전 지역', '그 외 지역은 가능 여부 확인'],
    process: [
      {
        title: '주소와 일정 접수',
        body: '출발지·도착지와 희망 시간을 알려주세요.',
      },
      {
        title: '적재 조건 확인',
        body: '가장 큰 물품의 규격, 전체 수량과 무게를 확인합니다.',
      },
      {
        title: '차량·요금 안내',
        body: '상하차 조건에 맞는 차량과 예상 요금을 상담합니다.',
      },
    ],
    pricing: null,
    trustNotes: [insuranceNote],
    provenance: [
      { source: '기본정보.txt', note: '실제 제공 서비스 목록' },
      { source: '퀵서비스&화물 상세내용.hwpx', note: '논공읍 한정 세부자료' },
    ],
    faqs: [
      {
        question: '차량 선택 전에 무엇을 알려야 하나요?',
        answer:
          '박스 수량과 가장 큰 물품의 가로·세로·높이, 대략적인 무게를 알려주시면 차량 판단이 빠릅니다.',
      },
    ],
    active: true,
    sortOrder: 20,
  },
  {
    id: 'one-ton',
    name: '1톤 용달화물',
    slug: 'one-ton',
    group: 'LOCAL',
    shortDescription:
      '자재, 집기와 비교적 크고 무거운 화물을 위한 용달 상담입니다.',
    description:
      '상하차 환경과 화물 크기·무게를 확인해 1톤 차량 운송 가능 여부와 접수 방법을 안내합니다.',
    keywords: ['1톤용달', '용달화물', '화물운송'],
    image: '/service-freight.png',
    imageAlt: '1톤 화물차 운송 안내 이미지',
    contentStatus: 'CONFIRMED_BASIC',
    heroTitle: '자재와 큰 짐은',
    heroAccent: '1톤 용달화물',
    summary:
      '자재, 집기, 소규모 이삿짐처럼 비교적 크고 무거운 화물은 전체 부피와 상하차 환경을 함께 확인해 차량을 상담합니다.',
    facts: [
      { label: '적합한 화물', value: '자재·집기·소규모 이삿짐' },
      { label: '필수 확인', value: '상하차·지게차·엘리베이터' },
      { label: '대구 접수', value: '053-955-2005' },
      { label: '전국 접수', value: '1661-0122' },
    ],
    items: ['자재', '가구·집기', '소규모 이삿짐', '기업 화물'],
    transport: ['1톤 용달', '화물 조건에 따라 카고·윙바디·리프트 등 상담'],
    areas: ['대구 전 지역', '전국 구간은 조건 확인 후 안내'],
    process: [
      {
        title: '화물 정보 접수',
        body: '주소, 수량, 가장 큰 물품의 크기와 무게를 알려주세요.',
      },
      {
        title: '상하차 확인',
        body: '계단, 엘리베이터, 지게차와 작업 인원 조건을 확인합니다.',
      },
      {
        title: '차량·일정 확정',
        body: '조건에 맞는 차량과 예상 요금을 안내한 뒤 접수합니다.',
      },
    ],
    pricing: null,
    trustNotes: [insuranceNote],
    provenance: [
      { source: '기본정보.txt', note: '실제 제공 서비스 목록' },
      {
        source: '퀵서비스&화물 상세내용.hwpx',
        note: '논공읍 한정 차종·배차 자료',
      },
    ],
    faqs: [
      {
        question: '상하차 정보가 왜 필요한가요?',
        answer:
          '엘리베이터, 계단, 지게차 사용 여부에 따라 필요한 차량과 작업 조건, 예상 비용이 달라질 수 있습니다.',
      },
    ],
    active: true,
    sortOrder: 30,
  },
  {
    id: 'express-bus',
    name: '고속버스택배',
    slug: 'express-bus',
    group: 'INTERCITY',
    shortDescription:
      '주요 도시 터미널 노선과 출도착지 퀵을 잇는 당일 연계 배송입니다.',
    description:
      '고속·시외버스 수화물 노선과 퀵서비스를 연결해 출발지 픽업부터 도착지 배달까지 상담합니다.',
    keywords: ['고속버스택배', '터미널택배', '도시간배송'],
    image: '/service-bus.png',
    imageAlt: '터미널 연계 배송에 사용하는 고속버스 차량',
    contentStatus: 'CONFIRMED_DETAIL',
    heroTitle: '터미널 방문 없이',
    heroAccent: '고속버스택배 연계',
    summary:
      '출발지에서 물품을 픽업해 이용 가능한 고속·시외버스 노선으로 탁송하고, 도착 터미널에서 다시 인수해 최종 주소까지 연결합니다.',
    facts: [
      { label: '서비스 범위', value: '대구 및 전국 주요 버스터미널 연계' },
      { label: '운송 방식', value: '출발지 퀵 + 버스 탁송 + 도착지 퀵' },
      { label: '일정', value: '노선·접수 마감 확인 후 당일 상담' },
      { label: '고객센터', value: '1661-0122' },
    ],
    items: [
      '긴급 서류',
      '소형 박스',
      '골프백',
      '공항 수하물',
      '신선식품 등 사전 확인 품목',
    ],
    transport: [
      '오토바이·다마스·라보',
      '고속·시외버스 수화물 탁송',
      '도착지 연계 차량',
    ],
    areas: ['대구 전역', '전국 주요 고속·시외버스 터미널 연계 지역'],
    process: [
      {
        title: '노선과 마감 확인',
        body: '출발지, 도착지, 품목과 희망 시간을 기준으로 이용 가능한 버스편을 확인합니다.',
      },
      {
        title: '출발지 픽업·터미널 접수',
        body: '연계 차량이 물품을 픽업해 출발 터미널 수화물 접수를 진행합니다.',
      },
      {
        title: '도착 터미널 인수·배송',
        body: '버스 도착 일정에 맞춰 물품을 인수하고 최종 수령지까지 연결합니다.',
      },
    ],
    pricing: null,
    trustNotes: [
      '노선 운행, 터미널 접수 마감과 품목 제한에 따라 당일 이용 가능 여부가 달라집니다.',
      insuranceNote,
    ],
    routeIntents: [
      '부산',
      '대전',
      '천안',
      '청주',
      '대구',
      '울산',
      '강릉',
      '속초',
      '포항',
      '경주',
      '광주',
      '전주',
      '목포',
    ].map((destination) => ({
      origin: '서울',
      destination,
      label: `서울–${destination} 고속버스택배`,
      source: '메뉴구성및 키워드 (1).txt',
    })),
    provenance: [
      {
        source: '고속버스택배&KTX택배 (고속버스택배상세).hwpx',
        note: '2026-09-03 직접 파싱',
      },
    ],
    faqs: [
      {
        question: '제가 직접 터미널까지 가야 하나요?',
        answer:
          '출발지 픽업과 도착 터미널 인수 후 최종 배송까지 연계할 수 있습니다. 실제 연계 가능 여부는 주소와 버스편 확인 후 안내합니다.',
      },
      {
        question: '모든 시간에 바로 보낼 수 있나요?',
        answer:
          '노선 운행표, 잔여 수화물 공간과 터미널 접수 마감에 따라 달라지므로 보내기 전에 확인이 필요합니다.',
      },
      {
        question: '어떤 물품을 보낼 수 있나요?',
        answer:
          '서류, 소형 박스, 골프백과 수하물 등을 상담할 수 있으며 신선식품과 제한 가능 품목은 사전 확인이 필요합니다.',
      },
    ],
    active: true,
    sortOrder: 40,
  },
  {
    id: 'ktx',
    name: 'KTX택배',
    slug: 'ktx',
    group: 'INTERCITY',
    shortDescription:
      'KTX 특송 영업소와 출도착지 퀵을 잇는 도시 간 배송입니다.',
    description:
      '이용 가능한 KTX 특송 구간과 열차 시간을 확인하고 출발지 픽업부터 도착지 배송까지 함께 안내합니다.',
    keywords: ['KTX택배', 'KTX특송', '기차택배'],
    image: '/service-ktx.jpg',
    imageAlt: '철도역 선로에 정차한 KTX 열차',
    contentStatus: 'CONFIRMED_DETAIL',
    heroTitle: '역 앞뒤 구간까지 잇는',
    heroAccent: 'KTX택배 연계',
    summary:
      '출발지에서 픽업한 화물을 이용 가능한 KTX 특송 영업소에 접수하고, 도착역에서 인수해 최종 목적지까지 연결합니다.',
    facts: [
      { label: '서비스 범위', value: '동대구역 등 전국 KTX 특송 영업소 연계' },
      { label: '운송 방식', value: '출발지 퀵 + KTX 탁송 + 도착지 퀵' },
      { label: '일정', value: '열차·영업소 운영 확인 후 당일 상담' },
      { label: '고객센터', value: '1661-0122' },
    ],
    items: [
      '긴급 서류',
      '소형 박스',
      '골프백',
      '공항 수하물',
      '병원 검체 등 사전 확인 품목',
    ],
    transport: ['오토바이·다마스·라보', 'KTX 열차 특송', '도착역 연계 차량'],
    areas: ['대구·동대구역 연계', '전국 KTX 특송 영업소 운영 구간'],
    process: [
      {
        title: '열차·영업소 확인',
        body: '출도착지, 품목과 희망 시간을 기준으로 이용 가능한 특송편을 확인합니다.',
      },
      {
        title: '출발지 픽업·역 접수',
        body: '연계 차량이 물품을 픽업해 KTX 특송 영업소에 접수합니다.',
      },
      {
        title: '도착역 인수·최종 배송',
        body: '도착 열차에 맞춰 물품을 인수하고 최종 수령인에게 연결합니다.',
      },
    ],
    pricing: null,
    trustNotes: [
      '특송 영업소 운영 여부, 열차 시간과 품목 제한에 따라 이용 가능 여부가 달라집니다.',
      insuranceNote,
    ],
    routeIntents: ['부산', '대구'].map((destination) => ({
      origin: '서울',
      destination,
      label: `서울–${destination} KTX택배`,
      source: '메뉴구성및 키워드 (1).txt 메뉴 예시',
    })),
    provenance: [
      {
        source: '고속버스택배&KTX택배 (KTX택배상세).hwpx',
        note: '2026-09-03 직접 파싱',
      },
    ],
    faqs: [
      {
        question: '역까지 직접 가야 하나요?',
        answer:
          '출발지 픽업과 도착역 인수 후 최종 배송을 함께 상담할 수 있습니다. 주소와 영업소 운영 여부를 확인해 안내합니다.',
      },
      {
        question: '고속버스택배와 무엇이 다른가요?',
        answer:
          '이용 노선과 접수 장소가 다릅니다. KTX 특송 영업소가 운영되는 구간인지, 희망 시간에 맞는 열차가 있는지 먼저 확인합니다.',
      },
      {
        question: '병원 검체도 가능한가요?',
        answer:
          '문서상 취급 상담 품목에 포함되지만 포장, 온도, 관련 규정과 특송 영업소 접수 가능 여부를 반드시 사전에 확인해야 합니다.',
      },
    ],
    active: true,
    sortOrder: 50,
  },
  {
    id: 'jeju-air',
    name: '제주 항공화물',
    slug: 'jeju-air',
    group: 'JEJU',
    shortDescription: '전국과 제주를 잇는 항공편과 출도착지 퀵 연계입니다.',
    description:
      '품목과 크기, 항공편과 희망 도착 일정을 확인해 공항 화물 접수와 제주 현지 배송을 연결합니다.',
    keywords: ['제주항공화물', '서울제주항공화물', '서귀포항공화물'],
    image: '/service-jeju.png',
    imageAlt: '제주 항공화물 연계를 나타낸 항공기 안내 이미지',
    contentStatus: 'CONFIRMED_DETAIL',
    heroTitle: '육지와 제주를 빠르게 잇는',
    heroAccent: '제주 항공화물',
    summary:
      '출발지 픽업, 국내선 항공 화물 접수와 제주공항 인수 후 현지 배송을 하나의 일정으로 연결합니다. 반대 방향인 제주 출발 내륙 도착도 상담합니다.',
    facts: [
      { label: '서비스 범위', value: '전국 ↔ 제주도 전역 양방향' },
      { label: '운송 방식', value: '출발지 퀵 + 항공 화물 + 제주 현지 퀵' },
      { label: '일정', value: '항공편·마감 확인 후 당일 상담' },
      { label: '고객센터', value: '1661-0122' },
    ],
    items: [
      '긴급 서류',
      '공항 수하물',
      '골프백',
      '소형 박스',
      '신선식품 등 사전 확인 품목',
    ],
    transport: [
      '출발지 오토바이·다마스·라보',
      '국내선 항공 화물',
      '제주 현지 연계 차량',
    ],
    areas: ['전국 출발 ↔ 제주도 전역', '제주시·서귀포시 최종 목적지 상담'],
    process: [
      {
        title: '항공편·품목 확인',
        body: '출도착지, 물품 정보와 희망 시간을 기준으로 항공 화물 접수 가능 여부를 확인합니다.',
      },
      {
        title: '출발지 픽업·공항 접수',
        body: '연계 차량이 물품을 픽업해 공항 화물터미널 접수를 진행합니다.',
      },
      {
        title: '제주공항 인수·현지 배송',
        body: '항공편 도착에 맞춰 물품을 인수하고 제주 내 최종 주소까지 연결합니다.',
      },
    ],
    pricing: null,
    trustNotes: [
      '기상, 항공편 운항과 품목 제한에 따라 접수·도착 일정이 변경될 수 있습니다.',
      insuranceNote,
    ],
    routeIntents: ['제주', '서귀포'].map((destination) => ({
      origin: '서울',
      destination,
      label: `서울–${destination} 항공화물`,
      source: '메뉴구성및 키워드 (1).txt',
    })),
    provenance: [
      {
        source: '제주(항공.선박)화물 (항공상세).hwpx',
        note: '2026-09-03 직접 파싱',
      },
    ],
    faqs: [
      {
        question: '공항 화물청사까지 직접 가야 하나요?',
        answer:
          '출발지 픽업, 공항 접수, 제주 현지 인수와 최종 배송을 함께 상담할 수 있습니다.',
      },
      {
        question: '제주 숙소나 골프장으로 바로 보낼 수 있나요?',
        answer:
          '제주공항 인수 후 숙소, 골프장 등 지정 주소까지의 현지 연계를 상담할 수 있습니다.',
      },
      {
        question: '기상 악화로 결항되면 어떻게 되나요?',
        answer:
          '운항 상황을 확인해 다음 항공편 또는 가능한 대체 방식과 일정을 다시 안내합니다. 당일 도착이 보장되지는 않습니다.',
      },
    ],
    active: true,
    sortOrder: 60,
  },
  {
    id: 'jeju-sea',
    name: '제주 선박화물',
    slug: 'jeju-sea',
    group: 'JEJU',
    shortDescription:
      '큰 짐과 무거운 화물을 내륙 차량·선박·제주 현지 차량으로 연결합니다.',
    description:
      '부피와 중량, 출항 일정에 따라 선박 운송을 검토하고 출발지 상차부터 제주 최종 하차까지 안내합니다.',
    keywords: ['제주선박화물', '서귀포선박화물', '제주화물'],
    image: '/service-jeju-sea.svg',
    imageAlt: '컨테이너 화물선이 제주 방향 바다를 운항하는 일러스트',
    contentStatus: 'CONFIRMED_DETAIL',
    heroTitle: '크고 무거운 짐을 위한',
    heroAccent: '제주 선박화물',
    summary:
      '내륙 화물차로 항만까지 운송한 뒤 선박에 선적하고, 제주항 도착 후 현지 차량으로 최종 목적지까지 연결합니다.',
    facts: [
      { label: '서비스 범위', value: '전국 내륙 ↔ 제주도 전역 양방향' },
      { label: '운송 방식', value: '내륙 화물차 + 선박 + 제주 현지 화물차' },
      { label: '일정', value: '출항 스케줄·기상 확인 후 지정일 상담' },
      { label: '고객센터', value: '1661-0122' },
    ],
    items: [
      '대형 가전·가구',
      '원룸·소규모 이삿짐',
      '건축 자재',
      '기업 물량',
      '기계류 등 사전 확인 품목',
    ],
    transport: [
      '내륙 화물차 1톤~25톤 상담',
      '항만 선박·카페리',
      '제주 현지 화물차',
    ],
    areas: [
      '전국 내륙 출발 ↔ 제주도 전역',
      '목포·완도·여수·부산 등 이용 항만은 일정에 따라 확인',
    ],
    process: [
      {
        title: '화물·출항 일정 확인',
        body: '짐의 양, 크기와 특성을 확인해 적합한 항만 노선과 일정을 상담합니다.',
      },
      {
        title: '출발지 상차·항만 선적',
        body: '조건에 맞는 차량이 출발지에서 상차한 뒤 항만으로 이동해 선적합니다.',
      },
      {
        title: '제주항 인수·최종 하차',
        body: '입항 일정에 맞춰 현지 차량이 인수하고 제주 내 최종 목적지로 연결합니다.',
      },
    ],
    pricing: null,
    trustNotes: [
      '출항 일정과 기상에 따라 운송일이 변경될 수 있으며, 배터리 포함 제품 등은 품목 규정을 먼저 확인합니다.',
      insuranceNote,
    ],
    provenance: [
      {
        source: '제주도(항공.선박)화물 (선박상세).hwpx',
        note: '2026-09-03 직접 파싱',
      },
    ],
    faqs: [
      {
        question: '항공 화물과 어떤 차이가 있나요?',
        answer:
          '선박은 항공으로 보내기 어려운 크고 무거운 화물을 검토할 수 있습니다. 품목, 무게, 일정과 이용 항만을 확인해 적합한 방식을 안내합니다.',
      },
      {
        question: '항구까지 짐을 따로 보내야 하나요?',
        answer:
          '출발지 상차부터 항만 선적, 제주 현지 배송까지 연계 상담할 수 있습니다.',
      },
      {
        question: '기상 악화로 결항되면 어떻게 되나요?',
        answer:
          '선박 운항이 재개되는 일정에 맞춰 다시 안내합니다. 기상에 따른 일정 변경 가능성을 접수 전에 확인해 주세요.',
      },
    ],
    active: true,
    sortOrder: 70,
  },
  {
    id: 'golf-bag',
    name: '골프백 배송',
    slug: 'golf-bag',
    group: 'TRAVEL',
    shortDescription:
      '자택과 골프장을 잇는 골프백·보스턴백 일정 맞춤 배송입니다.',
    description:
      '출발지, 골프장과 티오프 일정을 확인해 골프백 전담 직배송 또는 제주 항공 연계 운송을 안내합니다.',
    keywords: ['골프백배송', '캐디백배송', '골프장택배'],
    image: '/service-golf.png',
    imageAlt: '골프백 배송 차량을 표현한 고객 제공 안내 이미지',
    contentStatus: 'CONFIRMED_DETAIL',
    heroTitle: '라운딩 전에 미리 보내는',
    heroAccent: '골프백 배송',
    summary:
      '내륙 구간은 다마스·라보 전담 차량으로 자택에서 골프장까지 연결하고, 제주 구간은 항공편과 현지 배송 일정을 함께 상담합니다.',
    facts: [
      { label: '서비스 범위', value: '전국 자택 ↔ 전국 골프장' },
      { label: '취급 품목', value: '캐디백·보스턴백·라운딩 수하물' },
      { label: '예약 기준', value: '골프장·티오프·희망 도착일 확인' },
      { label: '고객센터', value: '1661-0122' },
    ],
    items: ['골프백·캐디백', '보스턴백', '기타 라운딩 수하물'],
    transport: [
      '내륙 다마스·라보 전담 직배송',
      '제주 항공 화물 연계',
      '제주 현지 배송',
    ],
    areas: ['수도권 출발 내륙 권역', '제주·서귀포', '그 외 구간은 별도 상담'],
    process: [
      {
        title: '라운딩 일정 예약',
        body: '출발 주소, 골프장, 티오프 시간과 골프백 수량을 알려주세요.',
      },
      {
        title: '자택 픽업',
        body: '일정에 맞춰 골프백과 추가 수하물을 확인하고 픽업합니다.',
      },
      {
        title: '골프장 인계',
        body: '클럽하우스 또는 지정 보관소에 인계하며 왕복 일정도 함께 상담할 수 있습니다.',
      },
    ],
    pricing: {
      title: '골프백 배송 운임 안내',
      description:
        '안내 운임표 기준의 편도 금액입니다. 최종 금액은 주소, 일정, 수량과 상하차 조건 확인 후 확정됩니다.',
      groups: [
        {
          title: '수도권 출발 내륙 직배송 · 편도',
          columns: ['도착 권역', '캐디백 1~2개', '캐디백 3~4개'],
          rows: [
            ['충청도', '100,000원', '100,000원'],
            ['경북', '100,000원', '130,000원'],
            ['경남', '130,000원', '150,000원'],
            ['전북', '120,000원', '150,000원'],
            ['전남', '130,000원', '170,000원'],
            ['강원', '130,000원', '170,000원'],
          ],
        },
        {
          title: '제주 항공 연계 · 편도',
          columns: ['도착지', '1개', '2개', '3개', '4개'],
          rows: [
            ['제주', '150,000원', '170,000원', '180,000원', '200,000원'],
            ['서귀포', '170,000원', '190,000원', '210,000원', '220,000원'],
          ],
        },
      ],
      notes: [
        '4개를 초과하면 추가금이 발생하며 금액은 상담 후 안내합니다.',
        '내륙 직배송은 보스턴백 2개까지 추가금이 없고, 3~4개는 10,000원이 추가됩니다.',
        '제주·서귀포 구간은 보스턴백 1개당 10,000원이 추가됩니다.',
        '표시 운임은 안내 기준이며 결제 전 최종 운송 조건과 금액을 확인해 주세요.',
      ],
    },
    trustNotes: [
      '내륙 전담 직배송과 제주 항공 연계는 운송 방식이 다르므로 접수할 때 구간을 정확히 알려주세요.',
      insuranceNote,
    ],
    provenance: [
      {
        source: '골프백(캐디백)배송 상세.hwpx',
        note: '서비스 방식·운임표를 2026-09-03 직접 파싱',
      },
    ],
    faqs: [
      {
        question: '여러 사람의 골프백을 한 번에 보낼 수 있나요?',
        answer:
          '차량 적재 범위 안에서 여러 개를 함께 보낼 수 있습니다. 골프백과 보스턴백 수량을 모두 알려주세요.',
      },
      {
        question: '라운딩 후 집으로 다시 받을 수 있나요?',
        answer:
          '골프장 픽업과 자택 복귀 일정도 상담할 수 있습니다. 왕복 각 구간의 날짜와 시간을 알려주세요.',
      },
      {
        question: '표에 없는 지역도 가능한가요?',
        answer:
          '출발지와 골프장, 일정에 따라 별도 견적을 안내합니다. 표의 금액은 수도권 출발 내륙 권역과 제주·서귀포 편도 기준입니다.',
      },
    ],
    active: true,
    sortOrder: 80,
  },
  {
    id: 'suitcase',
    name: '캐리어 배송',
    slug: 'suitcase',
    group: 'TRAVEL',
    shortDescription: '공항·숙소 일정에 맞춰 여행 캐리어 운송을 상담합니다.',
    description:
      '출발지와 숙소 또는 공항, 짐 수량과 희망 도착 시간을 확인해 가능한 배송 방식을 안내합니다.',
    keywords: ['캐리어배송', '케리어배송', '여행짐배송', '공항짐배송'],
    image: '/service-suitcase.svg',
    imageAlt: '여행 캐리어와 공항 이동 경로를 표현한 일러스트',
    contentStatus: 'CONFIRMED_BASIC',
    heroTitle: '여행 동선을 가볍게',
    heroAccent: '캐리어 배송',
    summary:
      '자택, 숙소 또는 공항 관련 이동 일정과 캐리어 수량을 확인해 가능한 차량·도시 간 연계 방식을 상담합니다.',
    facts: [
      { label: '취급 품목', value: '여행 캐리어·공항 수하물 상담' },
      { label: '필수 확인', value: '수량·크기·내용물·희망 시간' },
      { label: '서비스 범위', value: '주소와 일정 확인 후 안내' },
      { label: '고객센터', value: '1661-0122' },
    ],
    items: ['여행 캐리어', '공항 수하물'],
    transport: ['지역 차량', '필요 시 고속버스·KTX·항공 연계 상담'],
    areas: ['공항·숙소·자택 간 가능 구간 상담'],
    process: [
      {
        title: '여행 일정 접수',
        body: '출발지, 도착지와 필요한 도착 시간을 알려주세요.',
      },
      {
        title: '수하물 확인',
        body: '캐리어 수량, 크기와 제한 가능 내용물을 확인합니다.',
      },
      {
        title: '운송 방식 안내',
        body: '구간과 일정에 맞는 가능한 방식을 안내합니다.',
      },
    ],
    pricing: null,
    trustNotes: [
      '파손 위험품과 운송 제한 품목은 접수가 어려울 수 있어 내용물을 확인합니다.',
      insuranceNote,
    ],
    provenance: [
      { source: '기본정보.txt', note: '서비스 범위 확인' },
      {
        source: '고속버스·KTX·제주 항공 상세 HWPX',
        note: '공항 수하물 취급 상담 근거',
      },
    ],
    faqs: [
      {
        question: '짐 안에 넣을 수 없는 물품이 있나요?',
        answer:
          '파손 위험품이나 운송 제한 품목은 접수가 어려울 수 있어 내용물 확인이 필요합니다.',
      },
    ],
    active: true,
    sortOrder: 90,
  },
];

export function getService(idOrSlug: string) {
  return (
    services.find(
      (service) => service.id === idOrSlug || service.slug === idOrSlug,
    ) ?? null
  );
}
