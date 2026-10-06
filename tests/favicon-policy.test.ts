import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config';

describe('favicon delivery policy', () => {
  it('rewrites the crawler default favicon URL to the shipped icon asset', async () => {
    const rewrites = await nextConfig.rewrites?.();

    expect(rewrites).toEqual(
      expect.arrayContaining([
        {
          source: '/favicon.ico',
          destination: '/favicon.svg',
        },
      ]),
    );
  });
});
