import type { Metadata } from 'next';
import { SITE_URL, company } from '@/lib/company';
import type { Landing } from '@/lib/domain';

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getLandingPath(landing: Pick<Landing, 'slug'>) {
  return `/delivery/${landing.slug}`;
}

export function getLandingMetadata(landing: Landing): Metadata {
  const canonical = landing.canonical || absoluteUrl(getLandingPath(landing));
  const robots = landing.status === 'PUBLISHED' && landing.indexPolicy === 'INDEX'
    ? { index: true, follow: true }
    : { index: false, follow: false };
  return {
    title: { absolute: landing.metaTitle },
    description: landing.metaDescription,
    alternates: { canonical },
    robots,
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: company.name,
      title: landing.ogTitle,
      description: landing.ogDescription,
      images: [{ url: absoluteUrl(landing.ogImage), alt: landing.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: landing.ogTitle,
      description: landing.ogDescription,
      images: [absoluteUrl(landing.ogImage)],
    },
  };
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}
