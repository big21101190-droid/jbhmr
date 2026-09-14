import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  parseQaOptions,
  robotsMetaMatches,
  sitemapPaths,
  sitemapPolicyFailures,
} from './qa-policy.mjs';

const { baseUrl, canonicalBase, indexingEnabled } = parseQaOptions(
  process.argv.slice(2),
);
const landings = JSON.parse(
  await readFile(resolve('data/initial-landings.json'), 'utf8'),
);
const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const sitemapPagePaths = sitemapPaths(sitemap);
const globalFailures = sitemapPolicyFailures({
  indexingEnabled,
  responseStatus: sitemapResponse.status,
  paths: sitemapPagePaths,
});

const results = [];
for (let offset = 0; offset < landings.length; offset += 10) {
  const batch = landings.slice(offset, offset + 10);
  results.push(
    ...(await Promise.all(
      batch.map(async (landing) => {
        const url = `${baseUrl}/delivery/${landing.slug}`;
        try {
          const response = await fetch(url, {
            headers: { 'User-Agent': 'Googlebot' },
          });
          const html = await response.text();
          const canonical =
            landing.canonical || `${canonicalBase}/delivery/${landing.slug}`;
          const expectedSitemapUrl = `${canonicalBase}/delivery/${landing.slug}`;
          const xRobotsTag = response.headers.get('x-robots-tag');
          const checks = {
            status: response.status === 200,
            title: html.includes(`<title>${landing.metaTitle}</title>`),
            h1: html.includes(landing.h1),
            canonical: html.includes(canonical),
            robots: robotsMetaMatches(html, indexingEnabled),
            sitemap: indexingEnabled
              ? sitemap.includes(expectedSitemapUrl)
              : !sitemap.includes(expectedSitemapUrl),
            xRobotsTag: indexingEnabled
              ? !xRobotsTag?.toLowerCase().includes('noindex')
              : xRobotsTag?.toLowerCase().includes('noindex') === true,
          };
          return {
            id: landing.id,
            slug: landing.slug,
            checks,
            pass: Object.values(checks).every(Boolean),
          };
        } catch (error) {
          return {
            id: landing.id,
            slug: landing.slug,
            checks: {},
            pass: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }),
    )),
  );
}

const passed = results.filter((result) => result.pass).length;
const failed = results.filter((result) => !result.pass);
const allFailures = [
  ...globalFailures,
  ...failed.map(
    (item) =>
      `${item.slug}: ${JSON.stringify(item.checks)}${item.error ? ` (${item.error})` : ''}`,
  ),
];
const policyLabel = indexingEnabled
  ? '정식 도메인(index, follow + 비어 있지 않은 sitemap)'
  : '임시 호스트(noindex, nofollow + 빈 sitemap)';
const lines = [
  '# URL QA REPORT',
  '',
  `- Target: ${baseUrl}`,
  `- Expected policy: ${policyLabel}`,
  `- Checked: ${results.length}`,
  `- Passed: ${passed}`,
  `- Failed: ${allFailures.length}`,
  `- Sitemap HTTP: ${sitemapResponse.status}`,
  `- Sitemap URLs: ${sitemapPagePaths.length}`,
  '',
  '검사 항목: HTTP 200, title, H1, canonical, 환경별 robots/X-Robots-Tag/sitemap 정책',
  '',
  ...(allFailures.length
    ? ['## Failures', '', ...allFailures.map((item) => `- ${item}`)]
    : [
        '## Result',
        '',
        `PASS — 초기 랜딩 ${results.length}개와 ${policyLabel} 정책이 모든 검사 항목을 통과했습니다.`,
      ]),
  '',
];

await writeFile(resolve('URL_QA_REPORT.md'), lines.join('\n'));
console.log(
  `${allFailures.length ? 'FAIL' : 'PASS'}: ${passed}/${results.length} landing URLs passed; sitemap URLs ${sitemapPagePaths.length}; indexing=${indexingEnabled}. Report: URL_QA_REPORT.md`,
);
if (allFailures.length) process.exit(1);
