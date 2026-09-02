import { company, telHref } from '@/lib/company';

export const NATIONAL_PHONE = company.nationalPhone;
export const DAEGU_PHONE = company.daeguPhone;

export type RegionGroup = {
  name: string;
  slug: string;
  label: string;
  places: string[];
  daegu?: boolean;
};

export const regionGroups: RegionGroup[] = [
  { name: '서울', slug: 'seoul', label: '서울특별시', places: ['강남구', '서초구', '송파구', '영등포구', '마포구', '종로구', '용산구', '성동구'] },
  { name: '경기', slug: 'gyeonggi', label: '경기도', places: ['가평', '고양', '남양주', '성남', '수원', '평택', '포천', '이천', '하남', '화성', '동탄', '파주', '오산', '용인', '의정부', '의왕', '여주', '연천'] },
  { name: '인천', slug: 'incheon', label: '인천광역시', places: ['미추홀구', '연수구', '남동구', '부평구', '계양구', '서구'] },
  { name: '대전', slug: 'daejeon', label: '대전광역시', places: ['동구', '중구', '서구', '유성구', '대덕구'] },
  { name: '부산', slug: 'busan', label: '부산광역시', places: ['중구', '서구', '동구', '부산진구', '동래구', '해운대구', '사하구', '금정구'] },
  { name: '대구', slug: 'daegu', label: '대구광역시', daegu: true, places: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군', '다사', '성서'] },
  { name: '광주', slug: 'gwangju', label: '광주광역시', places: ['동구', '서구', '남구', '북구', '광산구'] },
  { name: '울산', slug: 'ulsan', label: '울산광역시', places: ['중구', '남구', '동구', '북구', '울주군'] },
  { name: '세종', slug: 'sejong', label: '세종특별자치시', places: ['세종시'] },
  { name: '충북', slug: 'chungbuk', label: '충청북도', places: ['청주', '충주', '제천', '음성', '진천'] },
  { name: '충남', slug: 'chungnam', label: '충청남도', places: ['천안', '아산', '서산', '당진', '공주'] },
  { name: '전북', slug: 'jeonbuk', label: '전북특별자치도', places: ['전주', '익산', '군산', '정읍', '김제'] },
  { name: '전남', slug: 'jeonnam', label: '전라남도', places: ['목포', '여수', '순천', '나주', '광양'] },
  { name: '경북', slug: 'gyeongbuk', label: '경상북도', places: ['경산', '하양', '진량', '포항', '경주', '구미', '안동'] },
  { name: '경남', slug: 'gyeongnam', label: '경상남도', places: ['창원', '김해', '양산', '진주', '거제'] },
  { name: '제주', slug: 'jeju', label: '제주특별자치도', places: ['제주시', '서귀포시'] },
];

export const serviceCards = [
  {
    code: 'LOCAL',
    title: '퀵서비스 · 용달화물',
    description: '서류 한 장부터 다마스, 1톤 화물까지 물품 크기와 이동 거리에 맞춰 안내합니다.',
    tags: ['오토바이', '다마스', '1톤 용달'],
    image: '/service-freight.png',
    href: '#quick',
  },
  {
    code: 'CITY TO CITY',
    title: '고속버스 · KTX택배',
    description: '서울–부산, 서울–대구 등 주요 도시 노선을 활용한 당일 연계 배송을 상담합니다.',
    tags: ['고속버스택배', 'KTX특송', '터미널 연계'],
    image: '/service-ktx.jpg',
    href: '#intercity',
  },
  {
    code: 'JEJU',
    title: '제주 · 서귀포 항공선박',
    description: '제주와 서귀포 방향 화물을 일정과 품목에 따라 항공 또는 선박으로 연결합니다.',
    tags: ['제주 항공화물', '선박 화물', '탁송 연계'],
    image: '/service-jeju.png',
    href: '#jeju',
  },
  {
    code: 'TRAVEL',
    title: '골프백 · 캐리어 배송',
    description: '골프장과 숙소, 공항 일정에 맞춰 무거운 골프백과 여행 캐리어를 배송합니다.',
    tags: ['골프백', '캐디백', '캐리어'],
    image: '/service-golf.png',
    href: '#golf',
  },
];

export const intercityRoutes = [
  '서울–부산', '서울–대전', '서울–천안', '서울–청주', '서울–대구', '서울–울산',
  '서울–강릉', '서울–속초', '서울–포항', '서울–경주', '서울–광주', '서울–전주', '서울–목포',
];

export function areaHref(region: RegionGroup, place: string) {
  return `/area/${region.slug}-${place}`;
}

export function findArea(slug: string) {
  const region = regionGroups.find((item) => slug.startsWith(`${item.slug}-`));
  if (!region) return null;
  const place = decodeURIComponent(slug.slice(region.slug.length + 1));
  if (!region.places.includes(place)) return null;
  return {
    region,
    place,
    areaName: region.name === '대구' ? `대구 ${place}` : `${region.name} ${place}`,
    phone: region.daegu ? DAEGU_PHONE : NATIONAL_PHONE,
  };
}

export { telHref };
