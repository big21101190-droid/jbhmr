/** @param {Record<string, string | undefined>} env */
export function productionSeoErrors(env) {
  if (env.CONTEXT !== 'production') return [];
  const errors = [];
  if (env.NEXT_PUBLIC_ROBOTS_INDEX !== 'true') {
    errors.push('Production requires NEXT_PUBLIC_ROBOTS_INDEX=true.');
  }
  // Exact origin only: reject preview hosts, credentials and path/query suffixes.
  if (!/^https:\/\/1661-0122\.com\/?$/.test(env.NEXT_PUBLIC_SITE_URL || '')) {
    errors.push(
      'Production requires NEXT_PUBLIC_SITE_URL=https://1661-0122.com.',
    );
  }
  return errors;
}
