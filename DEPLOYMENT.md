# 배포 및 운영 인계

## 환경

- Source: GitHub `samduck150906-lgtm/j`
- Production branch: `main`
- Hosting: Netlify `lovely-tarsier-c21dea`
- Build: `npm run build`
- Publish directory: `.next`
- Node: 22.13 이상
- Next.js runtime: `@netlify/plugin-nextjs` 5.15.13

현재 production URL은 `https://lovely-tarsier-c21dea.netlify.app`입니다. 이 사이트는 제작자 계정에서 검수 중인 임시 운영 프로젝트이며, 완성 후 고객 Netlify로 인계합니다. 정확한 production deploy ID와 commit SHA는 인계 직전에 Netlify와 GitHub `main`에서 다시 대조합니다.

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

2026-09-03 production 관리자 E2E에서 로그인, 초안 생성, 이미지 업로드, 미리보기, 공개, SEO/sitemap 반영, 본문·이미지 수정, 비공개, 보관을 모두 통과했습니다.

## 자동 배포

검증이 끝난 commit을 `main`에 push하면 연결된 Netlify 프로젝트가 자동 배포합니다. 중간 작업 commit은 운영에 바로 반영될 수 있으므로 push 전 전체 QA를 수행합니다.

## 영속 데이터

- 랜딩 레코드: Netlify Blobs `j-complex-logistics-content`
- 업로드 이미지: Netlify Blobs `j-complex-logistics-assets`
- 문의: Netlify Forms `inquiry`
- Production은 site-scoped 저장소, Deploy Preview는 deploy-scoped 저장소를 사용합니다.

## 고객 Netlify로 이동

기본 인계안은 현재 프로젝트를 고객 팀으로 transfer하는 것입니다. 세부 절차는 `HANDOFF_RUNBOOK.md`를 따릅니다.

- 기존 사이트를 인계하는 경우: 인계 후 Git 연결, 도메인, 환경변수, Identity 사용자/역할, Forms 알림, Blobs 데이터를 각각 다시 확인합니다.
- 새 사이트를 만드는 경우: GitHub 저장소를 새 프로젝트에 연결하고 환경변수·Identity·Forms 알림을 새로 설정합니다. Netlify Blobs와 Identity 사용자는 Git 배포에 포함되지 않으므로 필요한 운영 데이터를 별도 이전하거나 새로 생성합니다.
- 새 사이트의 production 검증이 끝나기 전에는 현재 검수 사이트를 삭제하거나 연결 해제하지 않습니다.
- 최종 전환 뒤 `NEXT_PUBLIC_SITE_URL`을 정식 도메인으로 바꾸고 재배포한 다음 canonical과 sitemap을 다시 검사합니다.
- 위 SEO 검사 전까지 `NEXT_PUBLIC_ROBOTS_INDEX=false`를 유지하고, 정식 도메인 최종 승인 뒤에만 `true`로 전환합니다.

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
