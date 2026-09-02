import 'server-only';

import { getUser } from '@netlify/identity';
import { hasAdminRole } from '@/lib/admin-policy';

export type AdminUser = { id: string; email: string };

export async function getAdminUser(): Promise<AdminUser | null> {
  const user = await getUser();
  if (!user) return null;
  if (!hasAdminRole(user.appMetadata)) return null;
  return { id: user.id, email: user.email || 'admin' };
}

export async function requireAdminApi() {
  const user = await getAdminUser();
  if (!user) throw new Response('관리자 인증이 필요합니다.', { status: 401 });
  return user;
}
