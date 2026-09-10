import { describe, expect, it } from 'vitest';
import {
  contactPhonePattern,
  normalizeContactPhone,
} from '@/lib/contact-phone';

describe('domestic inquiry phone validation without submission', () => {
  const valid = [
    '010-1234-5678',
    '011 123 4567',
    '02-123-4567',
    '02 1234 5678',
    '053-955-2005',
    '0311234567',
    '044-123-4567',
    '0641234567',
    '070-1234-5678',
    '080-123-4567',
    '1661-0122',
    '1588-1234',
    '1800-1234',
    ' 010 1234 5678 ',
  ];
  const invalid = [
    '',
    ' ',
    'abc',
    '010-abc-5678',
    '123',
    '010123456789',
    '0101234567',
    '0001234567',
    '01212345678',
    '06012345678',
    '+82-10-1234-5678',
    '010/1234/5678',
    '010\n12345678',
    '０１０１２３４５６７８',
  ];
  it.each(valid)('accepts %s', (value) =>
    expect(normalizeContactPhone(value)).toBe(value.replace(/[ -]/g, '')),
  );
  it.each(invalid)('rejects %s', (value) =>
    expect(normalizeContactPhone(value)).toBeNull(),
  );
  it('keeps the pre-hydration HTML pattern in agreement with the pure validator', () => {
    const pattern = new RegExp(`^(?:${contactPhonePattern})$`, 'v');
    for (const value of [...valid, ...invalid])
      expect(pattern.test(value), value).toBe(
        normalizeContactPhone(value) !== null,
      );
  });
});
