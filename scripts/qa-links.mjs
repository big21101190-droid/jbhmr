import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  normalizeInternalPath,
  parseQaOptions,
  sitemapPaths,
  sitemapPolicyFailures,
} from './qa-policy.mjs';

const { baseUrl, indexingEnabled } = parseQaOptions(process.argv.slice(2));
const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const pagePaths = sitemapPaths(sitemap);
const failures = sitemapPolicyFailures({
  indexingEnabled,
  responseStatus: sitemapResponse.status,
  paths: pagePaths,
});
const discovered = new Set(['/', ...pagePaths]);
const checked = new Set();
const queue = [...discovered];
const maxPages = 1_000;

while (queue.length && checked.size < maxPages) {
  const batch = queue.splice(0, 20).filter((path) => !checked.has(path));
  await Promise.all(
    batch.map(async (path) => {
      checked.add(path);
      try {
        const response = await fetch(`${baseUrl}${path}`);
        if (!response.ok) {
          failures.push(`${response.status} ${path}`);
          return;
        }
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/html')) return;
        const html = await response.text();
        for (const match of html.matchAll(/href=["']([^"']+)["']/g)) {
          const href = match[1];
          if (href === '#') failures.push(`dead hash link ${path}`);
          const internalPath = normalizeInternalPath(href, baseUrl);
          if (
            internalPath &&
            !internalPath.startsWith('/_next') &&
            !internalPath.startsWith('/api/') &&
            !discovered.has(internalPath)
          ) {
            discovered.add(internalPath);
            queue.push(internalPath);
          }
        }
      } catch (error) {
        failures.push(
          `request failed ${path}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }),
  );
}

if (queue.length)
  failures.push(
    `crawl limit ${maxPages} exceeded (${queue.length} paths remain)`,
  );

const uniqueFailures = [...new Set(failures)];
const policyLabel = indexingEnabled
  ? '정식 도메인(indexing=true, sitemap 필수)'
  : '임시 호스트(indexing=false, 빈 sitemap 필수)';
const lines = [
  '# DEAD LINK QA REPORT',
  '',
  `- Target: ${baseUrl}`,
  `- Expected policy: ${policyLabel}`,
  `- Sitemap pages: ${pagePaths.length}`,
  `- Crawled internal pages: ${checked.size}`,
  `- Discovered internal paths: ${discovered.size}`,
  `- Failures: ${uniqueFailures.length}`,
  '',
  ...(uniqueFailures.length
    ? ['## Failures', '', ...uniqueFailures.map((item) => `- ${item}`)]
    : [
        '## Result',
        '',
        'PASS — 환경별 sitemap 정책과 실제 홈에서 발견된 내부 링크에 4xx/5xx 또는 빈 해시 링크가 없습니다.',
      ]),
  '',
];
await writeFile(resolve('DEAD_LINK_QA_REPORT.md'), lines.join('\n'));
console.log(
  `${uniqueFailures.length ? 'FAIL' : 'PASS'}: ${pagePaths.length} sitemap pages, ${checked.size} crawled pages, ${discovered.size} internal paths; indexing=${indexingEnabled}.`,
);
if (uniqueFailures.length) process.exit(1);
