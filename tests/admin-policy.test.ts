import { describe, expect, it } from 'vitest';
import { hasAdminRole } from '@/lib/admin-policy';
import { isIdentityCallbackHash } from '@/lib/auth-callback';

describe('admin authorization', () => {
  it('allows only server-controlled admin roles', () => {
    expect(hasAdminRole({ roles: ['admin'] })).toBe(true);
    expect(hasAdminRole({ roles: ['member'] })).toBe(false);
    expect(hasAdminRole(null)).toBe(false);
  });
});

describe('identity callback routing', () => {
  it('recognizes invite and recovery callback hashes', () => {
    expect(isIdentityCallbackHash('#invite_token=abc')).toBe(true);
    expect(isIdentityCallbackHash('#recovery_token=abc')).toBe(true);
    expect(isIdentityCallbackHash('#access_token=abc&expires_in=3600')).toBe(true);
  });

  it('ignores ordinary anchors', () => {
    expect(isIdentityCallbackHash('#services')).toBe(false);
    expect(isIdentityCallbackHash('')).toBe(false);
  });
});
