# 고객 인계 전 QA 데이터 정리 체크리스트

이 문서는 삭제 대상 식별과 안전한 삭제 순서를 기록합니다. 현재 Release Gate에서는 삭제를 실행하지 않습니다.

## 식별된 QA 데이터

### Netlify Forms

- form: `inquiry`
- 테스트 이름: `QA 테스트`
- 테스트 연락처: `010-0000-0000`
- submission ID: `6a990a4249094c15021cef4a`

### 관리자 QA 랜딩

- id: `d8d5ec98-0002-4d2f-9be7-3a54e94ecabc`
- slug: `qa-seoul-gangnam-quick-motorcycle-20260903`
- Blob key: `landings/d8d5ec98-0002-4d2f-9be7-3a54e94ecabc.json`
- 현재 상태: `ARCHIVED`
- 공개 상태: 404, noindex, sitemap 제외

### 초기 랜딩 수정 QA 오버라이드

- 초기 랜딩 id: `initial-004`
- slug: `daegu-dong-quick-motorcycle`
- Blob key: `landings/initial-004.json`
- 용도: 초기 50개 관리자 수정·원복 Release Gate

초기 콘텐츠를 원본으로 완전히 되돌리고 공개 화면을 확인한 뒤에는 이 오버라이드 Blob을 삭제해 Git seed를 직접 사용하게 할 수 있습니다. 삭제 전 `data/initial-landings.json`의 `initial-004`와 오버라이드의 모든 콘텐츠 필드를 비교합니다.

### QA 업로드 이미지

store: `j-complex-logistics-assets`

- `uploads/bb30be11-6bca-4505-9fee-914e5b2b4c32.png`
- `uploads/50a7af96-b4c2-4211-afd3-9e9c85f13d6f.png`
- `uploads/15354b00-dd4c-4c73-9afe-6965e6168cef.png`

## 안전한 삭제 순서

1. 고객 수신처를 연결한 문의 알림 E2E까지 끝냅니다.
2. 삭제 직전 Forms와 두 Blobs 저장소의 목록을 백업합니다.
3. `initial-004`의 제목, H1, 본문, 대표 이미지와 OG 이미지가 Git seed 원본과 동일한지 확인합니다.
4. `landings/initial-004.json`을 삭제하고 공개 랜딩이 Git seed 내용으로 정상 표시되는지 확인합니다.
5. 보관된 QA 랜딩 `landings/d8d5ec98-0002-4d2f-9be7-3a54e94ecabc.json`을 삭제합니다.
6. 관리자 목록이 초기 랜딩 50개만 표시하는지 확인합니다.
7. 위 QA 이미지 3개가 운영 랜딩의 `heroImage` 또는 `ogImage`에서 참조되지 않는지 전체 검색합니다.
8. 참조가 없을 때만 QA 이미지 3개를 삭제합니다.
9. `QA 테스트` 제출과 고객 알림 테스트 제출을 Forms에서 삭제합니다.
10. 홈, 초기 랜딩 50개, sitemap, robots, 404, 관리자 로그인, 이미지 로딩을 재검사합니다.

## 삭제 후 완료 기준

- 관리자 랜딩 수가 초기 50개와 실제 운영 데이터만 포함
- `qa-seoul-gangnam-quick-motorcycle-20260903` 검색 결과 없음
- QA 이미지 UUID가 랜딩 데이터와 HTML에 없음
- Forms에 QA 제출 없음
- 초기 랜딩 `initial-004`가 Git seed 원본과 일치
- 운영 페이지와 관리자 기능에 오류 없음

삭제는 복구가 어려운 작업이므로 고객 인계 직전 정확한 객체와 제출 ID를 다시 확인한 뒤 별도 승인을 받아 실행합니다.
