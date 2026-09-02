import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/company';

export default function robots(): MetadataRoute.Robots {
  const productionIndex = process.env.NEXT_PUBLIC_ROBOTS_INDEX !== 'false';
  return {
    rules: productionIndex
      ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
