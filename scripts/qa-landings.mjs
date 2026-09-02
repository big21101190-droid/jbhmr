import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const baseUrl = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const canonicalBase = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lovely-tarsier-c21dea.netlify.app').replace(/\/$/, '');
const landings = JSON.parse(await readFile(resolve('data/initial-landings.json'), 'utf8'));
const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();

const results = [];
for (let offset = 0; offset < landings.length; offset += 10) {
  const batch = landings.slice(offset, offset + 10);
  results.push(...await Promise.all(batch.map(async (landing) => {
    const url = `${baseUrl}/delivery/${landing.slug}`;
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'Googlebot' } });
      const html = await response.text();
      const canonical = landing.canonical || `${canonicalBase}/delivery/${landing.slug}`;
      const checks = {
        status: response.status === 200,
        title: html.includes(`<title>${landing.metaTitle}</title>`),
        h1: html.includes(landing.h1),
        canonical: html.includes(canonical),
        robots: /name="robots" content="index, follow"/.test(html),
        sitemap: sitemap.includes(`${canonicalBase}/delivery/${landing.slug}`),
      };
      return { id: landing.id, slug: landing.slug, checks, pass: Object.values(checks).every(Boolean) };
    } catch (error) {
      return { id: landing.id, slug: landing.slug, checks: {}, pass: false, error: error instanceof Error ? error.message : String(error) };
    }
  })));
}

const passed = results.filter((result) => result.pass).length;
const failed = results.filter((result) => !result.pass);
const lines = [
  '# URL QA REPORT',
  '',
  `- Target: ${baseUrl}`,
  `- Checked: ${results.length}`,
  `- Passed: ${passed}`,
  `- Failed: ${failed.length}`,
  `- Sitemap HTTP: ${sitemapResponse.status}`,
  '',
  '검사 항목: HTTP 200, title, H1, canonical, robots index/follow, sitemap 포함',
  '',
  ...(failed.length ? ['## Failures', '', ...failed.map((item) => `- ${item.slug}: ${JSON.stringify(item.checks)}${item.error ? ` (${item.error})` : ''}`)] : ['## Result', '', 'PASS — 초기 랜딩 50개가 모든 검사 항목을 통과했습니다.']),
  '',
];

await writeFile(resolve('URL_QA_REPORT.md'), lines.join('\n'));
console.log(`${passed === results.length ? 'PASS' : 'FAIL'}: ${passed}/${results.length} landing URLs passed. Report: URL_QA_REPORT.md`);
if (failed.length) process.exit(1);
