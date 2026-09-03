import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/company';
import { isIndexingEnabled } from '@/lib/indexing';

export default function robots(): MetadataRoute.Robots {
  const productionIndex = isIndexingEnabled();
  if (!productionIndex) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
