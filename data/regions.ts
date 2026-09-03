import type { Region } from '@/lib/domain';

type RegionSeed = [string, string, string, string, Region['type'], boolean];

const seeds: RegionSeed[] = [
  ['seoul', '서울특별시', '', 'seoul', 'METRO', false],
  ['gyeonggi', '경기도', '', 'gyeonggi', 'PROVINCE', false],
  ['incheon', '인천광역시', '', 'incheon', 'METRO', false],
  ['daejeon', '대전광역시', '', 'daejeon', 'METRO', false],
  ['busan', '부산광역시', '', 'busan', 'METRO', false],
  ['daegu', '대구광역시', '', 'daegu', 'METRO', true],
  ['gwangju', '광주광역시', '', 'gwangju', 'METRO', false],
  ['ulsan', '울산광역시', '', 'ulsan', 'METRO', false],
  ['sejong', '세종특별자치시', '', 'sejong', 'METRO', false],
  ['chungbuk', '충청북도', '', 'chungbuk', 'PROVINCE', false],
  ['chungnam', '충청남도', '', 'chungnam', 'PROVINCE', false],
  ['jeonbuk', '전북특별자치도', '', 'jeonbuk', 'PROVINCE', false],
  ['jeonnam', '전라남도', '', 'jeonnam', 'PROVINCE', false],
  ['gyeongbuk', '경상북도', '', 'gyeongbuk', 'PROVINCE', false],
  ['gyeongnam', '경상남도', '', 'gyeongnam', 'PROVINCE', false],
  ['jeju', '제주특별자치도', '', 'jeju', 'PROVINCE', false],
];

const children: Record<string, Array<[string, string, Region['type']]>> = {
  seoul: [
    ['gangnam', '강남구', 'DISTRICT'],
    ['seocho', '서초구', 'DISTRICT'],
    ['songpa', '송파구', 'DISTRICT'],
    ['yeongdeungpo', '영등포구', 'DISTRICT'],
    ['mapo', '마포구', 'DISTRICT'],
    ['jongno', '종로구', 'DISTRICT'],
    ['yongsan', '용산구', 'DISTRICT'],
    ['seongdong', '성동구', 'DISTRICT'],
  ],
  gyeonggi: [
    ['gapyeong', '가평', 'CITY'],
    ['goyang', '고양', 'CITY'],
    ['namyangju', '남양주', 'CITY'],
    ['seongnam', '성남', 'CITY'],
    ['suwon', '수원', 'CITY'],
    ['pyeongtaek', '평택', 'CITY'],
    ['pocheon', '포천', 'CITY'],
    ['icheon', '이천', 'CITY'],
    ['hanam', '하남', 'CITY'],
    ['hwaseong', '화성', 'CITY'],
    ['dongtan', '동탄', 'AREA'],
    ['paju', '파주', 'CITY'],
    ['osan', '오산', 'CITY'],
    ['yongin', '용인', 'CITY'],
    ['uijeongbu', '의정부', 'CITY'],
    ['uiwang', '의왕', 'CITY'],
    ['yeoju', '여주', 'CITY'],
    ['yeoncheon', '연천', 'AREA'],
  ],
  incheon: [
    ['michuhol', '미추홀구', 'DISTRICT'],
    ['yeonsu', '연수구', 'DISTRICT'],
    ['namdong', '남동구', 'DISTRICT'],
    ['bupyeong', '부평구', 'DISTRICT'],
    ['gyeyang', '계양구', 'DISTRICT'],
    ['seo', '서구', 'DISTRICT'],
  ],
  daejeon: [
    ['dong', '동구', 'DISTRICT'],
    ['jung', '중구', 'DISTRICT'],
    ['seo', '서구', 'DISTRICT'],
    ['yuseong', '유성구', 'DISTRICT'],
    ['daedeok', '대덕구', 'DISTRICT'],
  ],
  busan: [
    ['jung', '중구', 'DISTRICT'],
    ['seo', '서구', 'DISTRICT'],
    ['dong', '동구', 'DISTRICT'],
    ['busanjin', '부산진구', 'DISTRICT'],
    ['dongnae', '동래구', 'DISTRICT'],
    ['haeundae', '해운대구', 'DISTRICT'],
    ['saha', '사하구', 'DISTRICT'],
    ['geumjeong', '금정구', 'DISTRICT'],
  ],
  daegu: [
    ['jung', '중구', 'DISTRICT'],
    ['dong', '동구', 'DISTRICT'],
    ['seo', '서구', 'DISTRICT'],
    ['nam', '남구', 'DISTRICT'],
    ['buk', '북구', 'DISTRICT'],
    ['suseong', '수성구', 'DISTRICT'],
    ['dalseo', '달서구', 'DISTRICT'],
    ['dalseong', '달성군', 'DISTRICT'],
    ['dasa', '다사', 'AREA'],
    ['seongseo', '성서', 'AREA'],
  ],
  gwangju: [
    ['dong', '동구', 'DISTRICT'],
    ['seo', '서구', 'DISTRICT'],
    ['nam', '남구', 'DISTRICT'],
    ['buk', '북구', 'DISTRICT'],
    ['gwangsan', '광산구', 'DISTRICT'],
  ],
  ulsan: [
    ['jung', '중구', 'DISTRICT'],
    ['nam', '남구', 'DISTRICT'],
    ['dong', '동구', 'DISTRICT'],
    ['buk', '북구', 'DISTRICT'],
    ['ulju', '울주군', 'DISTRICT'],
  ],
  sejong: [['sejong-city', '세종시', 'CITY']],
  chungbuk: [
    ['cheongju', '청주', 'CITY'],
    ['chungju', '충주', 'CITY'],
    ['jecheon', '제천', 'CITY'],
    ['eumseong', '음성', 'AREA'],
    ['jincheon', '진천', 'AREA'],
  ],
  chungnam: [
    ['cheonan', '천안', 'CITY'],
    ['asan', '아산', 'CITY'],
    ['seosan', '서산', 'CITY'],
    ['dangjin', '당진', 'CITY'],
    ['gongju', '공주', 'CITY'],
  ],
  jeonbuk: [
    ['jeonju', '전주', 'CITY'],
    ['iksan', '익산', 'CITY'],
    ['gunsan', '군산', 'CITY'],
    ['jeongeup', '정읍', 'CITY'],
    ['gimje', '김제', 'CITY'],
  ],
  jeonnam: [
    ['mokpo', '목포', 'CITY'],
    ['yeosu', '여수', 'CITY'],
    ['suncheon', '순천', 'CITY'],
    ['naju', '나주', 'CITY'],
    ['gwangyang', '광양', 'CITY'],
  ],
  gyeongbuk: [
    ['gyeongsan', '경산', 'CITY'],
    ['hayang', '하양', 'AREA'],
    ['jillyang', '진량', 'AREA'],
    ['pohang', '포항', 'CITY'],
    ['gyeongju', '경주', 'CITY'],
    ['gumi', '구미', 'CITY'],
    ['andong', '안동', 'CITY'],
  ],
  gyeongnam: [
    ['changwon', '창원', 'CITY'],
    ['gimhae', '김해', 'CITY'],
    ['yangsan', '양산', 'CITY'],
    ['jinju', '진주', 'CITY'],
    ['geoje', '거제', 'CITY'],
  ],
  jeju: [
    ['jeju-city', '제주시', 'CITY'],
    ['seogwipo', '서귀포시', 'CITY'],
  ],
};

const parentRegions: Region[] = seeds.map(
  ([id, name, , slug, type, usesDaeguPhone], index) => ({
    id,
    name,
    slug,
    parentId: null,
    parentName: null,
    type,
    description: `${name}의 제공 서비스와 지역별 접수 정보를 확인할 수 있습니다.`,
    nearbyRegions: [],
    active: true,
    sortOrder: index * 100,
    usesDaeguPhone,
  }),
);

const childRegions: Region[] = parentRegions.flatMap((parent) =>
  (children[parent.id] ?? []).map(([slug, name, type], index, all) => ({
    id: `${parent.id}-${slug}`,
    name: `${
      parent.type === 'PROVINCE'
        ? parent.name
        : parent.name.replace(/특별시|광역시|특별자치시|특별자치도$/, '')
    } ${name}`,
    slug: `${parent.slug}-${slug}`,
    parentId: parent.id,
    parentName: parent.name,
    type,
    description:
      parent.id === 'gyeongbuk' && slug === 'gyeongsan'
        ? '경상북도 경산시에서 출발하거나 도착하는 화물은 정확한 주소, 물품 크기와 희망 시간을 기준으로 접수 방법을 안내합니다.'
        : parent.id === 'gyeongbuk' && slug === 'hayang'
          ? '경상북도 경산시 하양읍에서 출발하거나 도착하는 화물은 정확한 주소, 물품 크기와 희망 시간을 기준으로 접수 방법을 안내합니다.'
          : parent.id === 'gyeongbuk' && slug === 'jillyang'
            ? '경상북도 경산시 진량읍에서 출발하거나 도착하는 화물은 정확한 주소, 물품 크기와 희망 시간을 기준으로 접수 방법을 안내합니다.'
            : `${name}에서 출발하거나 도착하는 화물은 정확한 주소, 물품 크기와 희망 시간을 기준으로 접수 방법을 안내합니다.`,
    nearbyRegions: all
      .filter(([other]) => other !== slug)
      .slice(0, 6)
      .map(([other]) => `${parent.id}-${other}`),
    active: true,
    sortOrder: parent.sortOrder + index + 1,
    usesDaeguPhone: parent.usesDaeguPhone,
    administrativeParentId:
      parent.id === 'gyeongbuk' && ['hayang', 'jillyang'].includes(slug)
        ? 'gyeongbuk-gyeongsan'
        : parent.id === 'daegu' && slug === 'dasa'
          ? 'daegu-dalseong'
          : parent.id === 'daegu' && slug === 'seongseo'
            ? 'daegu-dalseo'
            : undefined,
  })),
);

export const regions: Region[] = [...parentRegions, ...childRegions];

export function getRegion(idOrSlug: string) {
  return (
    regions.find(
      (region) => region.id === idOrSlug || region.slug === idOrSlug,
    ) ?? null
  );
}

export function getChildRegions(parentId: string) {
  return regions
    .filter((region) => region.parentId === parentId && region.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
