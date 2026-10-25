import { NextResponse, type NextRequest } from 'next/server';
import { decodeUrlSegment } from '@/lib/url-segment';
import { isRetiredLandingSlug } from '@/lib/landing-policy';

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
  if (
    request.nextUrl.pathname.startsWith('/delivery/') &&
    isRetiredLandingSlug(decodeUrlSegment(segments[0] || '') || '')
  ) {
    // Reply before streamed rendering so this URL cannot become a soft 404.
    return new Response('삭제된 테스트 페이지입니다.', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, follow',
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
