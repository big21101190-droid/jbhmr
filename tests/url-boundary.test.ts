import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '../proxy';
import { decodeUrlSegment } from '@/lib/url-segment';

describe('public route URL boundary', () => {
  it.each([
    'qa-삭제-e2e-검증-랜딩',
    encodeURIComponent('qa-삭제-e2e-검증-랜딩'),
  ])('returns a real 404 for the retired QA landing %s', (slug) => {
    const response = proxy(
      new NextRequest(`https://1661-0122.com/delivery/${slug}`),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get('x-robots-tag')).toBe('noindex, follow');
  });
  it('does not retire other pages with a QA prefix or the same slug in another collection', () => {
    for (const path of [
      '/delivery/qa-customer-page',
      '/regions/qa-삭제-e2e-검증-랜딩',
    ]) {
      expect(
        proxy(new NextRequest(`https://1661-0122.com${path}`)).headers.get(
          'x-middleware-next',
        ),
      ).toBe('1');
    }
  });
  it.each(['서울-관악구', 'seoul', '서울-관악구'.normalize('NFD')])(
    'decodes a single safe segment %s',
    (value) => {
      expect(decodeUrlSegment(encodeURIComponent(value))).toBe(
        value.normalize('NFC'),
      );
    },
  );
  it.each(['%25', '%E0%A4%A', 'a%2Fb', 'a%5Cb', 'a%00b', '%252F', '%ZZ'])(
    'rejects %s before the Next renderer',
    (slug) => {
      for (const collection of ['regions', 'services', 'routes', 'delivery']) {
        const response = proxy(
          new NextRequest(`http://localhost/${collection}/${slug}`),
        );
        expect(response.status).toBe(400);
      }
    },
  );
  it.each(['서울-관악구', 'seoul', 'qa-route'])(
    'allows safe route %s without rewriting it',
    (slug) => {
      const response = proxy(
        new NextRequest(`http://localhost/regions/${encodeURIComponent(slug)}`),
      );
      expect(response.headers.get('x-middleware-next')).toBe('1');
      expect(response.headers.get('location')).toBeNull();
    },
  );
});
