export type BusRoute = {
  slug: string;
  origin: string;
  destination: string;
  label: string;
};

const destinations: Array<[string, string]> = [
  ['busan', '부산'],
  ['daejeon', '대전'],
  ['cheonan', '천안'],
  ['cheongju', '청주'],
  ['daegu', '대구'],
  ['ulsan', '울산'],
  ['gangneung', '강릉'],
  ['sokcho', '속초'],
  ['pohang', '포항'],
  ['gyeongju', '경주'],
  ['gwangju', '광주'],
  ['jeonju', '전주'],
  ['mokpo', '목포'],
];

export const busRoutes: BusRoute[] = destinations.map(
  ([slug, destination]) => ({
    slug: `seoul-${slug}-express-bus`,
    origin: '서울',
    destination,
    label: `서울–${destination} 고속버스택배`,
  }),
);

export function getBusRoute(slug: string) {
  return busRoutes.find((route) => route.slug === slug) || null;
}

export function getBusRouteByDestination(destination: string) {
  return busRoutes.find((route) => route.destination === destination) || null;
}
