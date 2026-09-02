# 배포 및 운영 인계

## 환경

- Source: GitHub `samduck150906-lgtm/j`
- Production branch: `main`
- Hosting: Netlify `lovely-tarsier-c21dea`
- Build: `npm run build`
- Publish directory: `.next`
- Node: 22.13 이상

## 로컬 확인

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm test
npm run validate:landings
npm run build
```

Netlify Identity는 현재 로컬 `netlify dev`에서 지원되지 않으므로 인증 E2E는 Netlify 배포 환경에서 수행합니다.

## 자동 배포

검증이 끝난 commit을 `main`에 push하면 연결된 Netlify 프로젝트가 자동 배포합니다. 중간 작업 commit은 운영에 바로 반영될 수 있으므로 push 전 전체 QA를 수행합니다.

## 영속 데이터

- 랜딩 레코드: Netlify Blobs `j-complex-logistics-content`
- 업로드 이미지: Netlify Blobs `j-complex-logistics-assets`
- 문의: Netlify Forms `inquiry`
- Production은 site-scoped 저장소, Deploy Preview는 deploy-scoped 저장소를 사용합니다.

## 환경변수

`.env.example`을 참고합니다. 비밀값은 저장소에 commit하지 않고 Netlify 환경변수에서 관리합니다.

## 권한 인계 체크

- GitHub 저장소 관리자 권한
- Netlify 프로젝트 관리자 권한
- Identity 관리자 사용자와 복구 이메일
- 정식 도메인/DNS 권한
- GA4 속성 권한
- Google Search Console 소유권
- Naver Search Advisor 소유권

비밀번호, 토큰, API 키를 문서나 저장소에 평문으로 남기지 않습니다.
