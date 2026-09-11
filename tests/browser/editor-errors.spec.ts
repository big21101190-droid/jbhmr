import { test, expect, type Page } from '@playwright/test';

const fixture = (view = 'existing') => `/tests/browser/index.html?view=${view}`;
const uploadUrl = 'http://127.0.0.1:4178/api/admin/uploads';
const landingUrl =
  /^http:\/\/127\.0\.0\.1:4178\/api\/admin\/landings(?:\/[^/]+)?$/;
const png = {
  name: 'same-file.png',
  mimeType: 'image/png',
  buffer: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l1cAAAAASUVORK5CYII=',
    'base64',
  ),
};
const statusMessage = (page: Page) => page.locator('p[aria-live="polite"]');
const fields = (page: Page) =>
  page
    .locator('input:not([type="file"]), textarea, select')
    .evaluateAll((elements) =>
      elements.map((element) => (element as HTMLInputElement).value),
    );

test.beforeEach(async ({ context }) => {
  // All writes are mocked below. Never reach production or send an inquiry.
  await context.route('**/*', (route) => {
    const req = route.request();
    if (
      new URL(req.url()).hostname !== '127.0.0.1' ||
      !['GET', 'HEAD', 'OPTIONS'].includes(req.method())
    )
      return route.abort();
    return route.continue();
  });
});

test('upload preflight rejects oversized and unsupported files in every image slot without a request', async ({
  page,
}, testInfo) => {
  let requests = 0;
  await page.route(uploadUrl, (route) => {
    requests++;
    return route.fulfill({ json: { url: '/service-bus.png' } });
  });
  await page.goto(fixture());
  await page.getByText('고급 SEO 설정', { exact: true }).click();
  const before = await fields(page);
  const inputs = page.locator('input[type=file]');
  for (let i = 0; i < 4; i++) {
    await inputs
      .nth(i)
      .setInputFiles({ ...png, buffer: Buffer.alloc(5 * 1024 * 1024 + 1) });
    await expect(statusMessage(page)).toContainText('5MB 이하', {
      timeout: 2000,
    });
    await expect(inputs.nth(i)).toHaveValue('');
    expect(await fields(page)).toEqual(before);
    await inputs.nth(i).setInputFiles({
      name: 'invalid.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('invalid'),
    });
    await expect(statusMessage(page)).toContainText('JPG, PNG, WEBP', {
      timeout: 2000,
    });
    expect(await fields(page)).toEqual(before);
  }
  expect(requests).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('upload-preflight.png') });
});

const errors = [
  {
    name: '413 plain text',
    status: 413,
    contentType: 'text/plain',
    body: 'Payload Too Large',
    expected: '5MB 이하',
  },
  {
    name: '413 empty body',
    status: 413,
    contentType: 'text/plain',
    body: '',
    expected: '5MB 이하',
  },
  {
    name: '415 plain text',
    status: 415,
    contentType: 'text/plain',
    body: 'Unsupported Media Type',
    expected: 'JPG, PNG, WEBP',
  },
  {
    name: '500 HTML',
    status: 500,
    contentType: 'text/html; charset=utf-8',
    body: '<h1>Upstream unavailable</h1>',
    expected: '다시 시도',
  },
  {
    name: '400 JSON',
    status: 400,
    contentType: 'application/json',
    body: JSON.stringify({ error: '이미지 처리 실패 — 재시도해주세요.' }),
    expected: '이미지 처리 실패',
  },
  {
    name: '200 malformed JSON',
    status: 200,
    contentType: 'application/json',
    body: '{',
    expected: '다시 시도',
  },
  {
    name: '200 missing URL',
    status: 200,
    contentType: 'application/json',
    body: '{}',
    expected: '다시 시도',
  },
  {
    name: 'network failure',
    status: 0,
    contentType: '',
    body: '',
    expected: '다시 시도',
  },
];
for (const failure of errors) {
  test(`hero upload handles ${failure.name}, preserves input and retries the same file`, async ({
    page,
  }, testInfo) => {
    let attempts = 0;
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.route(uploadUrl, async (route) => {
      attempts++;
      if (attempts > 1)
        return route.fulfill({
          json: { url: '/service-ktx.png', filename: png.name },
        });
      if (!failure.status) return route.abort('failed');
      await route.fulfill({
        status: failure.status,
        contentType: failure.contentType,
        body: failure.body,
      });
    });
    await page.goto(fixture());
    await page
      .getByLabel('페이지 제목', { exact: true })
      .fill('실패해도 유지할 제목');
    const before = await fields(page);
    const upload = page.locator('input[type=file]').first();
    await upload.setInputFiles(png);
    await expect(statusMessage(page)).toContainText(failure.expected, {
      timeout: 2000,
    });
    await expect(statusMessage(page)).not.toContainText('업로드 중');
    expect(await fields(page)).toEqual(before);
    await expect(upload).toBeEnabled();
    await expect(upload).toHaveValue('');
    await expect(
      page.getByRole('button', { name: '초안 저장', exact: true }),
    ).toBeEnabled();
    if (failure.name === '413 plain text') {
      await page.screenshot({
        path: testInfo.outputPath('upload-413-recovered.png'),
      });
    }
    await upload.setInputFiles(png);
    await expect(statusMessage(page)).toContainText('이미지를 업로드했습니다.');
    await expect(
      page.getByRole('img', { name: '대표 이미지 미리보기', exact: true }),
    ).toHaveAttribute('src', '/service-ktx.png');
    await page.getByText('고급 SEO 설정', { exact: true }).click();
    await expect(page.getByLabel('OG 이미지', { exact: true })).toHaveValue(
      '/service-ktx.png',
    );
    await expect(page.getByLabel('페이지 제목', { exact: true })).toHaveValue(
      '실패해도 유지할 제목',
    );
    expect(attempts).toBe(2);
    expect(pageErrors).toEqual([]);
  });
}

for (const index of [0, 1, 2]) {
  test(`gallery slot ${index + 1} recovers from an upstream error without replacing other images`, async ({
    page,
  }) => {
    let attempts = 0;
    await page.route(uploadUrl, (route) =>
      ++attempts === 1
        ? route.fulfill({ status: 413, body: '' })
        : route.fulfill({ json: { url: '/service-ktx.png' } }),
    );
    await page.goto(fixture());
    const before = await fields(page);
    const upload = page.locator('input[type=file]').nth(index + 1);
    await upload.setInputFiles(png);
    await expect(statusMessage(page)).toContainText('5MB 이하', {
      timeout: 2000,
    });
    expect(await fields(page)).toEqual(before);
    await upload.setInputFiles(png);
    await expect(statusMessage(page)).toContainText('이미지를 업로드했습니다.');
    const gallery = page.getByRole('group', {
      name: '본문 상단 이미지',
      exact: true,
    });
    const urls = await gallery
      .locator('img')
      .evaluateAll((images) => images.map((img) => img.getAttribute('src')));
    expect(urls).toEqual(
      index === 0
        ? ['/service-ktx.png']
        : ['/service-bus.png', '/service-ktx.png'],
    );
    await expect(
      page.getByRole('img', { name: '대표 이미지 미리보기', exact: true }),
    ).toHaveAttribute('src', '/service-bus.png');
  });
}

for (const view of ['editor', 'existing']) {
  test(`expired ${view} save offers a separate login tab, keeps all input and can retry`, async ({
    page,
    context,
  }, testInfo) => {
    let attempts = 0;
    const methods: string[] = [];
    await page.route(landingUrl, async (route) => {
      methods.push(route.request().method());
      if (++attempts === 1)
        return route.fulfill({
          status: 401,
          contentType: 'text/plain',
          body: '관리자 인증이 필요합니다.',
        });
      const landing = {
        ...route.request().postDataJSON(),
        id: view === 'existing' ? 'qa-local-existing' : 'qa-local-created',
      };
      return route.fulfill({ status: 200, json: { landing } });
    });
    await context.route('http://127.0.0.1:4178/admin/login', (route) =>
      route.fulfill({
        contentType: 'text/html; charset=utf-8',
        body: '<h1>로컬 재로그인 화면 대역</h1>',
      }),
    );
    await page.goto(fixture(view));
    await page
      .getByLabel('페이지 제목', { exact: true })
      .fill('세션 만료 중 작성한 제목');
    await page
      .getByLabel('본문 1 내용', { exact: true })
      .fill('세션 만료 후에도 보존할 본문');
    const before = await fields(page);
    await page.getByRole('button', { name: '초안 저장', exact: true }).click();
    await expect(statusMessage(page)).toContainText('로그인 세션이 만료', {
      timeout: 2000,
    });
    const login = page.getByRole('link', {
      name: '새 탭에서 다시 로그인',
      exact: true,
    });
    await expect(login).toHaveAttribute('href', '/admin/login');
    await expect(login).toHaveAttribute('target', '_blank');
    expect(await fields(page)).toEqual(before);
    await expect(
      page.getByRole('button', { name: '초안 저장', exact: true }),
    ).toBeEnabled();
    await page.screenshot({
      path: testInfo.outputPath('session-expiry-input-kept.png'),
    });
    const popupPromise = page.waitForEvent('popup');
    await login.click();
    const popup = await popupPromise;
    await expect(popup.getByRole('heading')).toHaveText(
      '로컬 재로그인 화면 대역',
    );
    await popup.close();
    expect(page.url()).toContain(fixture(view));
    expect(await fields(page)).toEqual(before);
    await page.getByRole('button', { name: '초안 저장', exact: true }).click();
    await expect(statusMessage(page)).toHaveText('초안으로 저장했습니다.');
    await expect(login).toHaveCount(0);
    expect(await fields(page)).toEqual(before);
    expect(methods).toEqual(
      view === 'existing' ? ['PATCH', 'PATCH'] : ['POST', 'POST'],
    );
  });
}

test('expired upload also offers login while retaining all editor input', async ({
  page,
}) => {
  let attempts = 0;
  await page.route(uploadUrl, (route) =>
    ++attempts === 1
      ? route.fulfill({ status: 401, contentType: 'text/plain', body: '' })
      : route.fulfill({ json: { url: '/service-ktx.png' } }),
  );
  await page.goto(fixture());
  const before = await fields(page);
  await page.locator('input[type=file]').first().setInputFiles(png);
  await expect(statusMessage(page)).toContainText('로그인 세션이 만료', {
    timeout: 2000,
  });
  await expect(
    page.getByRole('link', { name: '새 탭에서 다시 로그인', exact: true }),
  ).toBeVisible();
  expect(await fields(page)).toEqual(before);
  await expect(page.locator('input[type=file]').first()).toBeEnabled();
  await page.locator('input[type=file]').first().setInputFiles(png);
  await expect(statusMessage(page)).toHaveText('이미지를 업로드했습니다.');
  await expect(
    page.getByRole('link', { name: '새 탭에서 다시 로그인', exact: true }),
  ).toHaveCount(0);
});

test('in-flight uploads prevent overlapping saves and gallery changes, then unlock on failure', async ({
  page,
}) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(uploadUrl, async (route) => {
    await pending;
    await route.fulfill({
      status: 500,
      contentType: 'text/html',
      body: 'Unavailable',
    });
  });
  await page.goto(fixture());
  await page.locator('input[type=file]').first().setInputFiles(png);
  try {
    await expect(statusMessage(page)).toHaveText('이미지 업로드 중…');
    for (const name of [
      '초안 저장',
      '공개',
      '선택값으로 기본 문구 자동 채우기',
    ]) {
      await expect(
        page.getByRole('button', { name, exact: true }),
      ).toBeDisabled();
    }
    for (const input of await page.locator('input[type=file]').all())
      await expect(input).toBeDisabled();
    await expect(
      page
        .getByRole('group', { name: '본문 상단 이미지', exact: true })
        .getByRole('button', { name: '삭제' }),
    ).toBeDisabled();
  } finally {
    release();
  }
  await expect(statusMessage(page)).toContainText('다시 시도');
  for (const input of await page.locator('input[type=file]').all())
    await expect(input).toBeEnabled();
  await expect(
    page.getByRole('button', { name: '초안 저장', exact: true }),
  ).toBeEnabled();
});

test('mobile session-expiry guidance and login action stay inside the viewport', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route(landingUrl, (route) =>
    route.fulfill({ status: 401, body: '' }),
  );
  await page.goto(fixture());
  await page.getByRole('button', { name: '초안 저장', exact: true }).click();
  const login = page.getByRole('link', {
    name: '새 탭에서 다시 로그인',
    exact: true,
  });
  await expect(login).toBeVisible();
  const rect = await login.boundingBox();
  expect(rect!.x).toBeGreaterThanOrEqual(0);
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(390);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.screenshot({
    path: testInfo.outputPath('session-expiry-mobile.png'),
  });
});
