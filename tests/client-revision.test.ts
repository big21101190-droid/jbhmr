import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { busRoutes } from '@/data/bus-routes';

describe('client revision release contract', () => {
  it('defines thirteen unique linked bus routes', () => {
    expect(busRoutes).toHaveLength(13);
    expect(new Set(busRoutes.map((route) => route.slug)).size).toBe(13);
    expect(
      busRoutes.every((route) => route.label.endsWith('고속버스택배')),
    ).toBe(true);
  });

  it('keeps the exact global reception and footer license copy', () => {
    const header = readFileSync('components/site-header.tsx', 'utf8');
    const footer = readFileSync('components/site-footer.tsx', 'utf8');
    expect(header).toContain('전화접수');
    expect(header).toContain('href="/contact"');
    expect(footer).toContain('화물자동차 운송주선사업 허가 제2024-05호');
  });

  it('does not introduce fixed catalog limits', () => {
    const source = [
      readFileSync('lib/catalog-store.ts', 'utf8'),
      readFileSync('components/catalog-managers.tsx', 'utf8'),
    ].join('\n');
    expect(source).not.toMatch(/MAX_(REGIONS|SERVICES)/);
  });
});
