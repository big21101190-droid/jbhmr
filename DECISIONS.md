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
- 고객이 관리자에서 추가·수정한 랜딩과 지역·서비스는 site-scoped Netlify Blobs에 저장한다. 초기 데이터도 같은 ID의 Blobs 레코드로 덮어 읽으므로 관리자에서 수정할 수 있다.
- 현재 코드는 `getStore()`를 사용하며 `getDeployStore()`를 사용하지 않는다. 같은 Netlify 프로젝트의 Deploy Preview도 같은 저장소를 사용하므로 별도 테스트 데이터 격리 환경으로 간주하지 않는다. `noindex`는 색인 정책이지 데이터·권한 격리가 아니다.
- 관리자 업로드 이미지는 별도 Blobs store에 무작위 UUID 파일명으로 저장한다.
- 문의는 정적 폼 정의 `public/__forms.html`과 일치하는 필드로 `/__forms.html`에 제출해 Netlify Forms `inquiry`에서 수집한다. 문의 내용을 Blobs, Git 또는 분석 이벤트 매개변수에 저장하지 않는다.

### 데이터별 권한과 수명주기

| 데이터 | 저장 위치와 접근 | 보존·삭제 기준 |
| --- | --- | --- |
| 랜딩·지역·서비스 | Git 초기 데이터 + `j-complex-logistics-content`; 쓰기는 서버에서 Identity `admin` 역할 확인, 랜딩 공개 조회는 `PUBLISHED`만 허용 | Blobs 데이터는 재배포와 독립적으로 남는다. 보관은 삭제가 아니다. 초기 데이터의 override를 직접 지우면 Git 원본이 다시 보일 수 있으므로 임의 삭제하지 않는다. |
| 업로드 이미지 | `j-complex-logistics-assets`; 업로드는 관리자만, `/api/media/uploads/...` 조회는 공개 | 랜딩을 비공개·보관해도 이미지가 비공개로 바뀌거나 자동 삭제되지 않는다. 개인정보·비공개 문서를 올리지 않으며 미사용 이미지 정리는 참조 확인과 별도 승인이 필요하다. |
| 고객 문의 | Netlify Forms `inquiry`; 제출은 공개 폼, 제출함 조회·알림 설정은 권한 있는 Netlify 운영자 | 앱에는 문의 자동 삭제 작업이 없다. 고객이 보유 기간·삭제 담당·처리 절차를 확정해야 하며 알림 이메일과 내보낸 사본도 함께 관리한다. |
| 관리자 계정 | Netlify Identity; 인증과 서버 관리 역할 확인 | 역할 회수·계정 해제와 콘텐츠·문의 삭제는 별개다. 비밀번호나 토큰을 콘텐츠, 문서 또는 Git에 기록하지 않는다. |

기술적으로 분리된 저장소가 개인정보 운영 정책까지 자동으로 완성하는 것은 아니다. 미확정 회사 정보와 운영 정책은 `CUSTOMER_INPUT_REQUIRED.md`에 기록하고, B 디자인·런타임 개발은 계속 진행한다. 확인되지 않은 홍보·보장 문구는 임의로 추가하지 않는다.

## 인증과 권한

- `@netlify/identity`를 사용한다. 비밀번호를 소스나 환경변수에 저장하지 않는다.
- `appMetadata.roles`에 `admin`이 있는 사용자만 관리자 페이지와 API를 이용할 수 있다.
- 화면 보호와 별개로 쓰기 API가 서버에서 권한을 다시 확인한다.
- Identity의 CMS 관리자와 Netlify 팀/프로젝트 운영자는 다른 권한이다. CMS 초대만으로 Netlify Forms 제출함이나 배포·환경변수 관리 권한이 생기지 않는다.

## URL과 SEO

- 랜딩 URL은 `/delivery/{slug}` 형식이며 한글, 영문 소문자, 숫자, 하이픈을 허용한다. 같은 지역·서비스 조합을 여러 번 발행할 수 있지만 URL은 고유해야 한다.
- 개별 랜딩 canonical을 입력하면 해당 값을 사용하고, 비워 두면 `NEXT_PUBLIC_SITE_URL`과 현재 랜딩 경로로 생성한다. 환경변수를 생략하면 `lib/company.ts`의 임시 Netlify 주소를 사용하므로 정식 도메인 전환 때 반드시 변경한다.
- 전역 `NEXT_PUBLIC_ROBOTS_INDEX=true`일 때 공개+INDEX 랜딩만 sitemap에 포함한다. 초안, 보관, NOINDEX는 제외하며 전역 색인 비활성 상태에서는 sitemap이 비어 있다.
- 과거 `/area/*` 경로는 대응하는 새 지역 허브로 301 이동한다.

## 계약 범위 보호

- 고객용 CSV 대량 등록, AI 원고 생성, 2만 페이지 자동 발행, CRM, 배차, 결제, 회원 앱, 문자, 실시간 위치는 구현하지 않는다.
