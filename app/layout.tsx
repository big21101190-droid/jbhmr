import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '제이복합물류 | 전국 퀵·용달·택배 운송',
  description: '퀵서비스, 용달화물, 고속버스·KTX택배, 제주 항공·선박, 골프백·캐리어 배송 상담',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
