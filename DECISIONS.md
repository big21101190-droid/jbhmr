# 제이복합물류 기술 결정

## 디자인

- 고객이 선택한 B안 Modern Mobility만 production 디자인으로 사용한다.
- 기존 색상, 타이포그래피, 간격, 카드, 버튼, 헤더와 모바일 동작을 유지·확장한다.
- 디자인 비교용 A/C 코드와 경로는 production에 만들지 않는다.

## 실행 환경

- Netlify의 공식 Next.js 런타임을 사용한다.
- 기존 Vinext/Cloudflare 전용 빌드는 Netlify의 SSR, Route Handler, middleware 지원과 맞지 않아 표준 Next.js App Router로 전환했다.
- GitHub `main` 푸시가 운영 배포를 시작하므로 모든 검증 후 최종 푸시한다.

## 데이터와 저장소

- 제공 자료에서 확인된 회사 전화, 서비스, 지역 정보만 소스 데이터로 사용한다.
- 초기 50개 랜딩은 `data/initial-landings.json`에 구조화하고 하나의 공통 renderer가 표시한다.
- 고객이 관리자에서 추가·수정한 랜딩은 site-scoped Netlify Blobs에 저장한다. Deploy Preview 데이터는 deploy-scoped store로 분리한다.
- 관리자 업로드 이미지는 별도 Blobs store에 무작위 UUID 파일명으로 저장한다.

## 인증과 권한

- `@netlify/identity`를 사용한다. 비밀번호를 소스나 환경변수에 저장하지 않는다.
- `appMetadata.roles`에 `admin`이 있는 사용자만 관리자 페이지와 API를 이용할 수 있다.
- 화면 보호와 별개로 쓰기 API가 서버에서 권한을 다시 확인한다.

## URL과 SEO

- 랜딩 URL은 `/delivery/{영문-소문자-slug}` 형식이다.
- canonical은 `NEXT_PUBLIC_SITE_URL`을 기준으로 하며 입력하지 않으면 self-canonical이다.
- 공개+INDEX 랜딩만 sitemap에 포함한다. 초안, 보관, NOINDEX는 제외한다.
- 과거 `/area/*` 경로는 대응하는 새 지역 허브로 301 이동한다.

## 계약 범위 보호

- 고객용 CSV 대량 등록, AI 원고 생성, 2만 페이지 자동 발행, CRM, 배차, 결제, 회원 앱, 문자, 실시간 위치는 구현하지 않는다.
