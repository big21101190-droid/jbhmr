import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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

  it('handles the crawler default favicon URL at the Netlify edge', () => {
    const config = readFileSync(resolve(process.cwd(), 'netlify.toml'), 'utf8');

    expect(config).toContain('from = "/favicon.ico"');
    expect(config).toContain('to = "/favicon.svg"');
    expect(config).toContain('status = 200');
  });
});
