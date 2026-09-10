import { NextResponse, type NextRequest } from 'next/server';
import { decodeUrlSegment } from '@/lib/url-segment';

export function proxy(request: NextRequest) {
  // Reject malformed/residually encoded segments before Next's route renderer
  // attempts another decode (e.g. /regions/%25 can otherwise produce a 500).
  const segments = request.nextUrl.pathname.split('/').slice(2);
  if (segments.some((segment) => decodeUrlSegment(segment) === null)) {
    return new Response('잘못된 URL입니다.', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/regions/:path*',
    '/services/:path*',
    '/routes/:path*',
    '/delivery/:path*',
  ],
};
