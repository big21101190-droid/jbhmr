# 고객 Netlify 인계 때 필요한 작업

현재 테스트 운영 사이트 `lovely-tarsier-c21dea`에는 Identity와 관리자 계정까지 설정되어 있습니다. 인계는 새 프로젝트 생성보다 **현재 프로젝트를 고객 팀으로 transfer**하는 방식을 우선합니다. 자세한 실행 순서는 `HANDOFF_RUNBOOK.md`, QA 데이터 정리는 `QA_CLEANUP_CHECKLIST.md`를 따릅니다.

새 프로젝트를 만드는 경우 코드와 Git 이력만 연결해도 Identity 사용자, Netlify Forms 제출 내역, Netlify Blobs에 저장된 관리자 작성글과 업로드 이미지는 자동으로 복사되지 않습니다.

## 1. 프로젝트 연결과 환경변수

1. 고객 Netlify 팀에서 GitHub 저장소 `samduck150906-lgtm/j`를 연결합니다.
2. Build command는 `npm run build`, Publish directory는 `.next`, Node는 22.13 이상으로 설정합니다.
3. 정식 도메인을 연결한 뒤 `NEXT_PUBLIC_SITE_URL`을 `https://정식도메인`으로 설정하고 재배포합니다.
4. 한 가지 host(www 또는 non-www)만 기본 도메인으로 정합니다.
5. canonical·OG URL·robots·sitemap을 정식 도메인으로 확인한 뒤에만 `NEXT_PUBLIC_ROBOTS_INDEX=true`로 바꾸고 재배포합니다.

초기 랜딩 50개는 저장소에 포함되어 있어 새 프로젝트에서도 배포됩니다. 이후 관리자가 만든 랜딩과 업로드 이미지를 유지해야 한다면 기존 Netlify Blobs 데이터를 별도로 이전해야 합니다.

## 2. Netlify Identity 관리자 계정

1. 고객 Netlify 프로젝트의 **Project configuration → Identity**에서 Identity를 활성화합니다.
2. Registration은 **Invite only**로 설정합니다. 공개 회원가입은 사용하지 않습니다.
3. 실제 관리자 이메일을 초대합니다.
4. 해당 사용자의 `app_metadata.roles`에 `admin` 역할을 지정합니다.
5. 초대 메일에서 비밀번호를 설정한 뒤 `/admin/login`에서 로그인합니다.

Identity가 활성화되지 않으면 공개 사이트는 동작하지만 관리자 로그인은 동작하지 않습니다.

## 3. 문의 알림

- Netlify **Forms → Form notifications**에서 문의를 받을 이메일 또는 Slack/Webhook 알림을 설정합니다.
- 문의 제출에는 개인정보가 있으므로 Netlify 팀 접근 권한을 필요한 운영자에게만 부여합니다.
- 알림 수신처를 정한 뒤 문의 폼을 한 번 제출해 Forms 저장과 실제 알림 수신을 함께 확인합니다.

## 4. 검색·분석 도구

- `NEXT_PUBLIC_GA4_ID`: GA4 측정 ID
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Google Search Console HTML 태그의 content 값
- `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`: Naver Search Advisor 확인 태그의 content 값
- 값을 설정한 뒤 재배포하고 `/sitemap.xml`을 Google과 Naver에 제출합니다.
- 문의자의 이름, 전화번호, 출발지·도착지는 GA4 이벤트 매개변수로 보내지 않습니다.

## 5. 고객 인계 후 최종 점검

- `/admin/login`에서 고객 관리자 로그인
- 테스트 랜딩 초안 생성, 이미지 업로드, 미리보기, 공개 후 비공개
- 정식 도메인의 canonical, robots.txt, sitemap.xml 확인
- 문의 폼 저장과 알림 수신 확인
- 모바일에서 전화 버튼이 대구 `053-955-2005`, 그 외 지역 `1661-0122`로 연결되는지 확인
