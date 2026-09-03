'use client';

import { useEffect } from 'react';
import { isIdentityCallbackHash } from '@/lib/auth-callback';

export function AuthCallbackRedirect() {
  useEffect(() => {
    if (window.location.pathname === '/admin/login') return;
    if (isIdentityCallbackHash(window.location.hash)) {
      window.location.replace(`/admin/login${window.location.hash}`);
    }
  }, []);

  return null;
}
