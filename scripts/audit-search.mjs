import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Read-only audit. Never follow the sitemap into another site's inventory.
const base = new URL(process.argv[2] || 'https://1661-0122.com');
if (!['1661-0122.com', '127.0.0.1', 'localhost'].includes(base.hostname))
  throw new Error(
    'Only the approved production host or a local QA server is allowed.',
  );
const output = resolve(process.argv[3] || 'work/search-audit.json');
const canonicalBase = process.argv[4] || 'https://1661-0122.com';
const normalized = (url) => {
  const parsed = new URL(url, canonicalBase);
  return (
    parsed.origin +
    decodeURI(parsed.pathname).normalize('NFC').replace(/\/$/, '') +
    parsed.search
  );
};
const attr = (tag, key) =>
  new RegExp(`\\b${key}=["']([^"']*)["']`, 'i').exec(tag)?.[1] || '';
const tags = (html, tag) =>
  html.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) || [];
const text = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const fetchText = async (url) => {
  const response = await fetch(url, {
    redirect: 'manual',
    headers: { 'User-Agent': 'JExpressReadOnlySEOAudit/1.0' },
    signal: AbortSignal.timeout(30000),
  });
  return { response, html: await response.text() };
};
const { response: sitemapResponse, html: sitemap } = await fetchText(
  `${base.origin}/sitemap.xml`,
);
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (urls.some((url) => new URL(url).origin !== canonicalBase))
  throw new Error('Sitemap contains an unexpected host; no URLs were crawled.');
const rows = [];
for (let offset = 0; offset < urls.length; offset += 4) {
  rows.push(
    ...(await Promise.all(
      urls.slice(offset, offset + 4).map(async (url) => {
        const path = new URL(url).pathname;
        try {
          const { response, html } = await fetchText(`${base.origin}${path}`);
          const metas = tags(html, 'meta');
          const main =
            /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(html)?.[1] || html;
          const body = text(
            main
              .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '')
              .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, ''),
          );
          return {
            url,
            path,
            status: response.status,
            finalUrl: response.url,
            canonical: attr(
              tags(html, 'link').find(
                (tag) => attr(tag, 'rel') === 'canonical',
              ) || '',
              'href',
            ),
            title: text(/<title>([\s\S]*?)<\/title>/.exec(html)?.[1] || ''),
            description: attr(
              metas.find((tag) => attr(tag, 'name') === 'description') || '',
              'content',
            ),
            robots: attr(
              metas.find((tag) => attr(tag, 'name') === 'robots') || '',
              'content',
            ),
            xRobots: response.headers.get('x-robots-tag') || '',
            h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
              text(m[1]),
            ),
            bodyChars: body.length,
            links: [
              ...new Set(
                tags(main, 'a')
                  .map((tag) => attr(tag, 'href'))
                  .filter((href) => href.startsWith('/')),
              ),
            ],
          };
        } catch (error) {
          return { url, path, error: String(error) };
        }
      }),
    )),
  );
}
const duplicateGroups = (key) =>
  Object.values(
    Object.groupBy(
      rows.filter((row) => row[key]),
      (row) => row[key],
    ),
  )
    .filter((group) => group.length > 1)
    .map((group) => group.map((row) => row.path));
const issues = rows.filter(
  (row) =>
    row.error ||
    row.status !== 200 ||
    !row.canonical ||
    normalized(row.canonical) !== normalized(row.url) ||
    /noindex/i.test(`${row.robots} ${row.xRobots}`) ||
    row.h1?.length !== 1 ||
    !row.title ||
    !row.description,
);
const incoming = new Set(
  rows.flatMap((row) => row.links || []).map((path) => normalized(path)),
);
const report = {
  checkedAt: new Date().toISOString(),
  base: base.origin,
  canonicalBase,
  sitemapStatus: sitemapResponse.status,
  sitemapCount: urls.length,
  withinLimit: urls.length > 0 && urls.length <= 250,
  duplicateUrls: urls.filter((url, i) => urls.indexOf(url) !== i),
  duplicateTitles: duplicateGroups('title'),
  duplicateDescriptions: duplicateGroups('description'),
  unlinked: rows
    .filter((row) => row.path !== '/' && !incoming.has(normalized(row.url)))
    .map((row) => row.url),
  reviewContent: rows
    .filter((row) =>
      /(?:\/qa-|테스트|E2E|검증 랜딩)/i.test(
        `${row.path} ${row.h1?.join(' ')}`,
      ),
    )
    .map((row) => row.url),
  issues,
  rows,
  measurement:
    'Public technical evidence only; rankings, Search Console indexing and traffic are unverified.',
};
await mkdir(resolve(output, '..'), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2) + '\n');
console.log(
  JSON.stringify({
    output,
    count: urls.length,
    withinLimit: report.withinLimit,
    issues: issues.length,
    duplicateTitles: report.duplicateTitles.length,
    duplicateDescriptions: report.duplicateDescriptions.length,
  }),
);
if (
  !report.withinLimit ||
  sitemapResponse.status !== 200 ||
  issues.length ||
  report.duplicateUrls.length
)
  process.exitCode = 1;
