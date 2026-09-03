# 제이복합물류 Netlify 인계 실행서

## 권장 방식

새 프로젝트를 만들지 않고 현재 프로젝트 `lovely-tarsier-c21dea`를 고객 Netlify 팀으로 이전하는 방식을 우선합니다.

- 현재 Project ID: `89b9f92f-2459-4da0-afad-c812e330e9cc`
- GitHub: `samduck150906-lgtm/j`
- Production branch: `main`
- 랜딩 저장소: `j-complex-logistics-content`
- 이미지 저장소: `j-complex-logistics-assets`
- 문의 폼: `inquiry`

Netlify Blobs는 하나의 사이트에 귀속되고 Netlify UI의 Project ID가 Blobs의 Site ID입니다. 따라서 새 프로젝트를 만들기보다 같은 프로젝트를 팀 간 이전하고 Project ID가 그대로인지 확인하는 편이 운영 데이터 손실 위험이 낮습니다.

공식 문서:

- 프로젝트 이전: https://docs.netlify.com/manage/projects/transfer-project/
- Netlify Blobs와 Site ID: https://docs.netlify.com/build/data-and-storage/netlify-blobs/
- 문의 알림: https://docs.netlify.com/manage/forms/notifications/

## 1. 이전 전 준비

1. 고객 Netlify 팀을 준비합니다.
2. 이전을 실행할 계정이 현재 팀의 Team Owner인지 확인합니다.
3. 같은 계정이 고객 팀의 Owner 또는 Developer인지 확인합니다.
4. 현재 팀의 **Team settings → Access & security → Transfer site settings**에서 프로젝트 이전이 허용되어 있는지 확인합니다.
5. 현재 팀과 고객 팀의 요금제를 비교합니다. 고객 팀 요금제가 낮으면 일부 설정이나 기능이 사라질 수 있습니다.
6. 고객 팀에 없는 기존 프로젝트 멤버는 이전 후 대시보드 접근을 잃을 수 있으므로 필요한 사람을 고객 팀에 먼저 초대합니다.
7. 이전 작업 시간 동안 관리자에서 랜딩을 수정하거나 문의 데이터를 정리하지 않도록 운영을 잠시 동결합니다.

## 2. 이전 전 상태 기록과 백업

다음 값을 한 번에 기록합니다.

- Project ID
- Production URL과 정식 도메인
- GitHub 저장소, production branch, 마지막 commit SHA
- 현재 production deploy의 commit SHA
- 환경변수 키·적용 범위. 비밀값은 문서에 적지 않습니다.
- Identity 사용자 이메일, 활성 상태, `admin` 역할
- Blobs 두 저장소의 객체 목록과 개수
- Forms의 `inquiry` form ID, 제출 개수, 알림 설정
- DNS와 도메인 설정

Netlify Blobs UI에서 두 저장소의 필요한 객체를 내려받아 별도 보관합니다. Forms에서 운영 문의가 존재하면 CSV로 내보냅니다. QA 데이터는 `QA_CLEANUP_CHECKLIST.md`에 따라 백업 후 제거합니다.

## 3. 임시 호스트 색인 차단

정식 도메인을 붙이고 SEO를 재검수하기 전까지 다음 값을 유지합니다.

```text
NEXT_PUBLIC_ROBOTS_INDEX=false
```

이 상태에서는 다음 세 가지가 함께 적용됩니다.

- 모든 공개 HTML의 robots 메타가 `noindex, nofollow`
- 모든 경로의 `X-Robots-Tag`가 `noindex, nofollow`
- `robots.txt`가 전체 경로를 차단하고 sitemap은 비워 둠

정식 도메인을 연결한 뒤에만 다음 순서로 공개합니다.

1. `NEXT_PUBLIC_SITE_URL=https://정식도메인` 설정
2. 정식 도메인을 Netlify의 primary production domain으로 지정
3. 임시 `netlify.app` 주소가 정식 도메인으로 301 이동하는지 확인
4. canonical, OG URL, robots와 sitemap이 정식 도메인을 사용하는지 확인
5. 초기 랜딩 50개와 관리자 생성 랜딩 표본을 검사
6. 마지막으로 `NEXT_PUBLIC_ROBOTS_INDEX=true` 설정
7. Production 재배포 후 다시 전체 SEO QA

## 4. 프로젝트 이전 실행

Netlify에서 다음 메뉴를 사용합니다.

1. **Project configuration → General → Project information**
2. **Transfer project** 선택
3. 고객 Netlify 팀 선택
4. 화면에 표시되는 멤버·요금제·기능 영향 경고 확인
5. 이전 실행

현재 프로젝트와 고객 팀 사이에 공통 Owner/Developer가 없으면 Netlify 지원팀을 통해 이전합니다.

## 5. 이전 직후 필수 검증

다음 항목이 하나라도 다르면 배포나 데이터 수정을 중단하고 원인을 확인합니다.

- Project ID가 `89b9f92f-2459-4da0-afad-c812e330e9cc`로 유지되는가
- GitHub `samduck150906-lgtm/j`와 `main` 자동 배포가 연결되어 있는가
- Production URL과 기존 배포 기록이 보이는가
- `j-complex-logistics-content`와 `j-complex-logistics-assets` 객체가 보이는가
- 초기 랜딩 50개와 운영 중인 관리자 작성 랜딩이 보이는가
- Identity가 활성화되어 있고 Registration이 Invite only인가
- 고객 관리자에게 `admin` 역할이 있는가
- `/admin/login` 로그인과 랜딩 수정이 가능한가
- `inquiry` 폼과 운영 제출 내역이 보이는가
- 문의 이메일 또는 Webhook 알림이 유지되는가
- 환경변수의 값과 builds/functions/runtime 범위가 유지되는가

## 6. 문의 알림 출시 게이트

고객 수신처가 정해지면 **Project configuration → Notifications → Emails and webhooks → Form submission notifications**에서 `inquiry` 알림을 추가합니다.

1. 고객 이메일 또는 Webhook을 등록
2. `HANDOFF-NOTIFICATION-QA` 문구를 포함한 테스트 문의 1건 제출
3. Netlify Forms 저장 확인
4. 고객 이메일 또는 Webhook 실제 수신 확인
5. 수신된 필드가 이름, 전화번호, 출발지, 도착지, 서비스, 문의 내용과 동의를 포함하는지 확인
6. 테스트 제출을 삭제하고 운영 문의만 남김

## 7. 최종 승인 기준

- 초기 50개 중 표본을 관리자에서 수정하고 원복 가능
- 고객 관리자 로그인 성공
- Blobs 콘텐츠와 이미지 정상
- 문의 저장과 실제 고객 알림 수신 성공
- 정식 도메인의 canonical, OG URL, robots, sitemap 정상
- 임시 Netlify 주소가 정식 도메인으로 이동
- GitHub `main` SHA와 Netlify production deploy commit SHA 일치
- `QA_CLEANUP_CHECKLIST.md` 전 항목 완료

모든 항목을 통과한 뒤에만 고객 인계 완료로 판정합니다.
