import { test, expect } from '@playwright/test';
import type { Landing } from '../../lib/domain';
import {
  assertNoDuplicate,
  normalizeLandingInput,
  validateLandingInput,
  LandingValidationError,
} from '../../lib/landing-validation';

const fixture = (view: string) => `/tests/browser/index.html?view=${view}`;
test.beforeEach(async ({ context }) => {
  // No production host or inquiry endpoint can receive requests in this suite.
  await context.route('**/*', (route) => {
    const req = route.request(),
      url = new URL(req.url());
    if (
      url.hostname !== '127.0.0.1' ||
      !['GET', 'HEAD', 'OPTIONS'].includes(req.method())
    )
      return route.abort();
    return route.continue();
  });
});

test('F05 desktop disclosure Escape closes and returns focus', async ({
  page,
}) => {
  await page.goto(fixture('header'));
  for (const name of ['서비스 안내', '지역별 접수']) {
    const trigger = page.getByRole('button', { name, exact: true });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panelId = await trigger.getAttribute('aria-controls');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      if (
        await page.evaluate(
          (id) => Boolean(document.activeElement?.closest('#' + id)),
          panelId,
        )
      )
        break;
    }
    expect(
      await page.evaluate(
        (id) => Boolean(document.activeElement?.closest('#' + id)),
        panelId,
      ),
    ).toBe(true);
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
    await expect(page.locator('#' + panelId)).toHaveCount(0);
    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
  }
});

test('F05 mobile submenu and Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(fixture('header'));
  await page.getByRole('button', { name: '메뉴 열기' }).click();
  await expect(page.getByRole('button', { name: '메뉴 닫기' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await page.locator('summary').filter({ hasText: '지역별 퀵서비스' }).click();
  await page
    .locator('#header-mobile')
    .getByRole('button', { name: '대구광역시', exact: true })
    .click();
  await expect(
    page
      .locator('#header-mobile')
      .getByRole('link', { name: '중구 퀵서비스', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '메뉴 열기' })).toBeFocused();
  await expect(page.locator('#header-mobile')).toHaveCount(0);
});

test('F04 invalid and corrected callback numbers without submission', async ({
  page,
}) => {
  let submissions = 0;
  page.on('request', (r) => {
    if (r.method() === 'POST') submissions++;
  });
  await page.goto(fixture('contact'));
  const phone = page.getByLabel('연락처', { exact: true });
  for (const value of ['abc', '123', ' ', '010/1234/5678']) {
    await phone.fill(value);
    await phone.blur();
    expect(
      await phone.evaluate((e: HTMLInputElement) => e.checkValidity()),
    ).toBe(false);
    await expect(phone).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#inquiry-phone-error')).toBeVisible();
  }
  for (const value of [
    '010-1234-5678',
    '02-123-4567',
    '053 955 2005',
    '1661-0122',
    '07012345678',
  ]) {
    await phone.fill(value);
    await phone.blur();
    expect(
      await phone.evaluate((e: HTMLInputElement) => e.checkValidity()),
    ).toBe(true);
    await expect(phone).toHaveAttribute('aria-invalid', 'false');
  }
  for (const [name, value] of [
    ['name', '미전송 QA'],
    ['origin', '서울'],
    ['destination', '부산'],
    ['message', '화면 검사만 수행'],
  ])
    await page.locator(`[name=${name}]`).fill(value);
  await page.locator('[name=service]').selectOption({ index: 1 });
  expect(
    await page
      .locator('form')
      .evaluate((f: HTMLFormElement) => f.checkValidity()),
  ).toBe(false);
  await page.locator('[name=privacy-consent]').check();
  expect(
    await page
      .locator('form')
      .evaluate((f: HTMLFormElement) => f.checkValidity()),
  ).toBe(true);
  await expect(page.getByText(/3분 이내 연락이 없으면/)).toBeVisible();
  expect(submissions).toBe(0);
});

for (const width of [1440, 1280, 768, 390, 360]) {
  test(`F02 gallery 0/1/2/3 images, full source visible at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const count of [0, 1, 2, 3]) {
      await page.goto(fixture('gallery') + `&count=${count}`);
      const photos = page.locator('figure img');
      await expect(photos).toHaveCount(count);
      if (count) {
        await expect
          .poll(() =>
            photos.evaluateAll((es) =>
              es.every(
                (e) =>
                  (e as HTMLImageElement).complete &&
                  (e as HTMLImageElement).naturalWidth > 0,
              ),
            ),
          )
          .toBe(true);
        const geometry = await photos.evaluateAll((es) =>
          es.map((e) => {
            const img = e as HTMLImageElement,
              r = e.getBoundingClientRect();
            return {
              x: r.x,
              y: r.y,
              width: r.width,
              height: r.height,
              fit: getComputedStyle(e).objectFit,
              nw: img.naturalWidth,
              nh: img.naturalHeight,
            };
          }),
        );
        for (const photo of geometry) {
          expect(photo.fit).toBe('contain');
          expect(photo.width / photo.height).toBeCloseTo(4 / 3, 1);
          expect(photo.width).toBeGreaterThan(0);
        }
        if (width >= 1280 && count === 3) {
          expect(new Set(geometry.map((p) => p.y)).size).toBe(1);
          expect(
            Math.max(...geometry.map((p) => p.width)) -
              Math.min(...geometry.map((p) => p.width)),
          ).toBeLessThan(1);
        }
        if (width < 640 && count > 1)
          expect(geometry[1].y).toBeGreaterThan(geometry[0].y);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test('F02 missing image keeps its frame without retry loops', async ({
  page,
}) => {
  let requests = 0;
  page.on('request', (r) => {
    if (r.url().endsWith('/qa-missing.png')) requests++;
  });
  await page.goto(fixture('gallery') + '&broken=1');
  const img = page.getByAltText('로드 실패 사진');
  await expect(img).toBeVisible();
  expect((await img.boundingBox())?.height).toBeGreaterThan(100);
  expect(requests).toBe(1);
});

test('F05 list names, filters, search, collapse and more', async ({ page }) => {
  await page.goto(fixture('list'));
  await page.getByRole('button', { name: '목록 펼치기' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(25);
  await page.getByRole('button', { name: /25개 더 보기/ }).click();
  await expect(page.locator('tbody tr')).toHaveCount(50);
  await page.getByLabel('랜딩페이지 지역 필터').selectOption('daegu-dong');
  await page.getByLabel('랜딩페이지 서비스 필터').selectOption('damas');
  await page.getByLabel('랜딩페이지 상태 필터').selectOption('PUBLISHED');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await page
    .getByLabel('랜딩페이지 제목·키워드·지역·서비스·URL 검색')
    .fill('없는 검색어');
  await expect(
    page.getByText('조건에 맞는 랜딩페이지가 없습니다.'),
  ).toBeVisible();
  await page.getByRole('button', { name: '목록 접기' }).click();
  await expect(page.locator('#landing-management-content')).toHaveCount(0);
});

test('existing Seoul–Daejeon route is searchable and editable without changing its URL', async ({
  page,
}, testInfo) => {
  await page.goto(fixture('route-list'));
  await expect(page.locator('tbody tr')).toHaveCount(19);
  await page
    .getByPlaceholder('제목·출발지·도착지·서비스·URL 검색')
    .fill('서울 대전');
  const row = page.locator('tbody tr', {
    hasText: '서울–대전 고속버스택배',
  });
  await expect(row).toHaveCount(1);
  await expect(row.getByRole('link', { name: '수정' })).toHaveAttribute(
    'href',
    '/admin/routes/express-bus/seoul-daejeon-express-bus',
  );
  await page.screenshot({
    path: testInfo.outputPath('route-list-seoul-daejeon.png'),
    fullPage: true,
  });

  let payload: Record<string, unknown> | null = null;
  await page.route(
    '**/api/admin/routes/express-bus/seoul-daejeon-express-bus',
    async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        json: { route: payload },
      });
    },
  );
  await page.goto(fixture('route-editor'));
  await expect(
    page.getByText('/routes/seoul-daejeon-express-bus', { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel('본문', { exact: true })
    .fill('첫 문단 첫 줄\n첫 문단 둘째 줄\n\n둘째 문단');
  await page
    .getByLabel('ALT 텍스트', { exact: true })
    .fill('서울 대전 고속버스택배 화물 이미지');
  await page.getByPlaceholder('이미지 URL').fill('/service-bus.png');
  await page
    .getByLabel('관리용 이름 · 새 업로드 파일명')
    .fill('서울 대전 고속버스택배');
  await page.getByLabel('캡션 (선택)').fill('서울에서 대전까지 화물 연계');
  await page.getByLabel('검색 색인').selectOption('NOINDEX');
  await expect(
    page.getByAltText('서울 대전 고속버스택배 화물 이미지'),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('route-editor-image-seo.png'),
    fullPage: true,
  });
  await page.getByRole('button', { name: '저장', exact: true }).click();
  await expect(
    page.getByText('저장했습니다. 기존 URL은 유지되었습니다.'),
  ).toBeVisible();
  expect(payload).toMatchObject({
    body: '첫 문단 첫 줄\n첫 문단 둘째 줄\n\n둘째 문단',
    indexPolicy: 'NOINDEX',
    image: {
      url: '/service-bus.png',
      alt: '서울 대전 고속버스택배 화물 이미지',
      name: '서울 대전 고속버스택배',
      caption: '서울에서 대전까지 화물 연계',
    },
  });
  expect((payload as Record<string, unknown> | null)?.slug).toBe(
    'seoul-daejeon-express-bus',
  );
});

test('F01/F07 editor save/reopen using explicitly isolated mock API', async ({
  page,
}, testInfo) => {
  const records: Landing[] = [];
  await page.route('**/api/admin/landings{,/**}', async (route) => {
    const input = normalizeLandingInput(route.request().postDataJSON());
    try {
      validateLandingInput(input);
      assertNoDuplicate(input, records);
      const record = {
        ...input,
        id: input.id || `qa-local-${records.length}`,
        createdAt: '2026-09-10',
        updatedAt: '2026-09-10',
        publishedAt: input.status === 'PUBLISHED' ? '2026-09-10' : null,
      } as Landing;
      const index = records.findIndex((r) => r.id === record.id);
      if (index === -1) records.push(record);
      else records[index] = record;
      await page.evaluate(
        (value) =>
          sessionStorage.setItem('qa-last-saved', JSON.stringify(value)),
        record,
      );
      await route.fulfill({ status: 201, json: { landing: record } });
    } catch (error) {
      if (!(error instanceof LandingValidationError)) throw error;
      await route.fulfill({
        status: error.status,
        json: {
          error: error.message,
          field: error.field,
          existing: error.existing,
        },
      });
    }
  });
  for (const slug of ['qa-same-pair-a', 'qa-same-pair-b']) {
    await page.goto(fixture('editor'));
    await page.getByText('고급 SEO 설정', { exact: true }).click();
    await page.getByLabel(/^URL slug/).fill(slug);
    await page.getByRole('button', { name: '공개', exact: true }).click();
    await expect(
      page.getByText('공개했습니다.', { exact: true }),
    ).toBeVisible();
    await page.goto(fixture('editor') + '&saved=1');
    await page.getByText('고급 SEO 설정', { exact: true }).click();
    await expect(page.getByLabel(/^URL slug/)).toHaveValue(slug);
    await page
      .locator('details')
      .screenshot({ path: testInfo.outputPath(`${slug}-reopened-local.png`) });
  }
  expect(records).toHaveLength(2);
  await page.goto(fixture('editor'));
  await page.getByText('고급 SEO 설정', { exact: true }).click();
  await page.getByLabel(/^URL slug/).fill('qa-same-pair-a');
  await page
    .getByLabel('페이지 제목', { exact: true })
    .fill('오류 후 유지할 제목');
  await page.getByRole('button', { name: '공개', exact: true }).click();
  await expect(page.getByText(/동일한 URL이 이미 존재합니다/)).toBeVisible();
  await expect(page.getByLabel('페이지 제목', { exact: true })).toHaveValue(
    '오류 후 유지할 제목',
  );
  expect(records).toHaveLength(2);

  await page.screenshot({
    path: testInfo.outputPath('F01-duplicate-local.png'),
  });

  await page.goto(fixture('existing'));
  const oldTitle = await page
    .getByLabel('페이지 제목', { exact: true })
    .inputValue();
  await page.getByLabel(/^서비스/).selectOption('ktx');
  await expect(page.getByLabel('페이지 제목', { exact: true })).toHaveValue(
    oldTitle,
  );
  await page
    .getByRole('button', { name: '선택값으로 기본 문구 자동 채우기' })
    .click();
  await page.getByText('고급 SEO 설정', { exact: true }).click();
  await expect(page.getByLabel(/^검색 색인/)).toHaveValue('NOINDEX');
  await expect(page.getByLabel(/^Canonical/)).toHaveValue(
    'https://example.com/kept',
  );
  await expect(page.getByLabel(/^URL slug/)).toHaveValue('qa-stable-url');
  await page.getByRole('button', { name: '공개', exact: true }).click();
  await expect(page.getByText('공개했습니다.', { exact: true })).toBeVisible();
  await page.goto(fixture('existing') + '&saved=1');
  await page.getByText('고급 SEO 설정', { exact: true }).click();
  await expect(page.getByLabel(/^검색 색인/)).toHaveValue('NOINDEX');
  await expect(page.getByLabel(/^Canonical/)).toHaveValue(
    'https://example.com/kept',
  );
  expect(records.at(-1)?.relatedRegions).toEqual(['seoul']);
  await page
    .locator('details')
    .screenshot({ path: testInfo.outputPath('F07-reopened-local.png') });
  await testInfo.attach('isolated-records', {
    body: JSON.stringify({ scope: 'LOCAL MOCK API ONLY', records }, null, 2),
    contentType: 'application/json',
  });
});

test('F01 keyword-based URLs preserve semantic variants and flag whitespace-only duplicates', async ({
  page,
}) => {
  let payload: Record<string, unknown> | null = null;
  await page.route('**/api/admin/landings', async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      json: {
        landing: {
          ...payload,
          id: 'qa-semantic-variant',
          createdAt: '2026-09-14',
          updatedAt: '2026-09-14',
          publishedAt: null,
        },
      },
    });
  });
  await page.goto(fixture('slug-editor'));
  await page.getByText('고급 SEO 설정', { exact: true }).click();
  await expect(
    page.getByText('동일한 의미의 기존 페이지:', { exact: false }),
  ).toBeVisible();
  await page
    .getByLabel('대표 키워드', { exact: true })
    .fill('대구 동구 긴급 오토바이 퀵서비스');
  await expect(
    page.getByText(
      '예상 공개 URL: /delivery/대구-동구-긴급-오토바이-퀵서비스',
      { exact: true },
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: '초안 저장', exact: true }).click();
  await expect(
    page.getByText('초안으로 저장했습니다.', { exact: true }),
  ).toBeVisible();
  expect(payload).toMatchObject({
    primaryKeyword: '대구 동구 긴급 오토바이 퀵서비스',
    slug: '',
  });
});
