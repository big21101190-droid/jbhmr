# 고객 계정에서 필요한 작업

## 1. Netlify Identity 관리자 계정

1. Netlify 프로젝트 `lovely-tarsier-c21dea`의 **Project configuration → Identity**에서 Identity를 활성화합니다.
2. Registration은 **Invite only**로 설정합니다. 공개 회원가입은 사용하지 않습니다.
3. 실제 관리자 이메일을 초대합니다.
4. 해당 사용자의 `app_metadata.roles`에 `admin` 역할을 지정합니다.
5. 초대 메일에서 비밀번호를 설정한 뒤 `/admin/login`에서 로그인합니다.

Identity가 활성화되지 않으면 공개 사이트는 동작하지만 관리자 로그인은 동작하지 않습니다.

## 2. 문의 알림

- Netlify **Forms → Form notifications**에서 문의를 받을 이메일 또는 Slack/Webhook 알림을 설정합니다.
- 문의 제출에는 개인정보가 있으므로 Netlify 팀 접근 권한을 필요한 운영자에게만 부여합니다.

## 3. 정식 도메인

- 정식 도메인을 Netlify에 연결한 뒤 `NEXT_PUBLIC_SITE_URL`을 `https://정식도메인`으로 설정하고 재배포합니다.
- 한 가지 host(www 또는 non-www)만 기본 도메인으로 정합니다.

## 4. 검색·분석 도구

- `NEXT_PUBLIC_GA4_ID`: GA4 측정 ID
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Google Search Console HTML 태그의 content 값
- `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`: Naver Search Advisor 확인 태그의 content 값
- 값을 설정한 뒤 재배포하고 `/sitemap.xml`을 Google과 Naver에 제출합니다.
- 문의자의 이름, 전화번호, 출발지·도착지는 GA4 이벤트 매개변수로 보내지 않습니다.
