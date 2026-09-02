import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const baseUrl = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const pagePaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const discovered = new Set(pagePaths);
const failures = [];

for (let offset = 0; offset < pagePaths.length; offset += 20) {
  await Promise.all(pagePaths.slice(offset, offset + 20).map(async (path) => {
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) failures.push(`${response.status} ${path}`);
    const html = await response.text();
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (href.startsWith('/') && !href.startsWith('/_next')) discovered.add(href.split('#')[0]);
    }
    if (html.includes('href="#"')) failures.push(`dead hash link ${path}`);
  }));
}

const internalPaths = [...discovered].filter(Boolean);
for (let offset = 0; offset < internalPaths.length; offset += 20) {
  await Promise.all(internalPaths.slice(offset, offset + 20).map(async (path) => {
    const response = await fetch(`${baseUrl}${path}`);
    if (response.status >= 400) failures.push(`${response.status} linked from site: ${path}`);
  }));
}

const uniqueFailures = [...new Set(failures)];
const lines = ['# DEAD LINK QA REPORT', '', `- Target: ${baseUrl}`, `- Sitemap pages checked: ${pagePaths.length}`, `- Unique internal paths checked: ${internalPaths.length}`, `- Failures: ${uniqueFailures.length}`, '', ...(uniqueFailures.length ? ['## Failures', '', ...uniqueFailures.map((item) => `- ${item}`)] : ['## Result', '', 'PASS — sitemap 페이지와 발견된 내부 링크에서 4xx/5xx 또는 빈 해시 링크가 없습니다.']), ''];
await writeFile(resolve('DEAD_LINK_QA_REPORT.md'), lines.join('\n'));
console.log(`${uniqueFailures.length ? 'FAIL' : 'PASS'}: ${pagePaths.length} sitemap pages and ${internalPaths.length} internal paths checked.`);
if (uniqueFailures.length) process.exit(1);
