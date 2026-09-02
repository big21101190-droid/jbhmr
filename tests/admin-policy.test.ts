import { describe, expect, it } from 'vitest';
import { hasAdminRole } from '@/lib/admin-policy';

describe('admin authorization', () => {
  it('allows only server-controlled admin roles', () => {
    expect(hasAdminRole({ roles: ['admin'] })).toBe(true);
    expect(hasAdminRole({ roles: ['member'] })).toBe(false);
    expect(hasAdminRole(null)).toBe(false);
  });
});
