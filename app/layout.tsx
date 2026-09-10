import type { Metadata } from 'next';
import { Black_Han_Sans } from 'next/font/google';
import { Analytics } from '@/components/analytics';
import { AuthCallbackRedirect } from '@/components/auth-callback-redirect';
import { SITE_URL, company } from '@/lib/company';
import { isIndexingEnabled } from '@/lib/indexing';
import './globals.css';

const indexingEnabled = isIndexingEnabled();
const headingFont = Black_Han_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  fallback: ['Arial Black', 'Arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '제이복합물류 | 전국 퀵·용달·택배 운송',
    template: '%s | 제이복합물류',
  },
  description:
    '퀵서비스, 용달화물, 고속버스·KTX택배, 제주 항공·선박, 골프백·캐리어 배송 상담',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: company.name,
    title: '제이복합물류 | 전국 퀵·용달·택배 운송',
    description: '퀵서비스, 용달화물, 도시 간 택배와 제주·여행 짐 배송 상담',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: '제이복합물류' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  robots: indexingEnabled
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true, nosnippet: true },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
      ? {
          'naver-site-verification':
            process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION,
        }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={headingFont.variable}>
        {children}
        <AuthCallbackRedirect />
        <Analytics />
      </body>
    </html>
  );
}
