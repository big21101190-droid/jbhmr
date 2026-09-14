export function parseQaOptions(argv, env = process.env) {
  const positional = argv.filter((argument) => !argument.startsWith('--'));
  const baseUrl = (positional[0] || 'http://localhost:3000').replace(/\/$/, '');
  const indexingArgument = argv
    .find((argument) => argument.startsWith('--indexing='))
    ?.split('=')[1];
  const indexingValue =
    indexingArgument ?? env.NEXT_PUBLIC_ROBOTS_INDEX ?? 'false';
  if (!['true', 'false'].includes(indexingValue))
    throw new Error('--indexing은 true 또는 false여야 합니다.');

  const canonicalArgument = argv
    .find((argument) => argument.startsWith('--canonical-base='))
    ?.slice('--canonical-base='.length);
  const canonicalBase = (
    canonicalArgument ||
    env.NEXT_PUBLIC_SITE_URL ||
    baseUrl
  ).replace(/\/$/, '');

  return {
    baseUrl,
    canonicalBase,
    indexingEnabled: indexingValue === 'true',
  };
}

export function sitemapPaths(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
}

export function sitemapPolicyFailures({
  indexingEnabled,
  responseStatus,
  paths,
}) {
  const failures = [];
  if (responseStatus !== 200)
    failures.push(`sitemap HTTP ${responseStatus} (expected 200)`);
  if (indexingEnabled && paths.length === 0)
    failures.push('indexing=true인데 sitemap URL이 0개입니다.');
  if (!indexingEnabled && paths.length !== 0)
    failures.push(
      `indexing=false인데 sitemap에 ${paths.length}개 URL이 노출됩니다.`,
    );
  return failures;
}

export function robotsMetaMatches(html, indexingEnabled) {
  const content = html.match(
    /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  )?.[1];
  if (!content) return false;
  const directives = new Set(
    content
      .toLowerCase()
      .split(',')
      .map((directive) => directive.trim()),
  );
  return indexingEnabled
    ? directives.has('index') && directives.has('follow')
    : directives.has('noindex') && directives.has('nofollow');
}

export function normalizeInternalPath(href, baseUrl) {
  if (!href || href.startsWith('#')) return null;
  try {
    const base = new URL(baseUrl);
    const target = new URL(href, `${baseUrl}/`);
    if (target.origin !== base.origin) return null;
    if (!['http:', 'https:'].includes(target.protocol)) return null;
    return `${target.pathname}${target.search}`;
  } catch {
    return null;
  }
}
