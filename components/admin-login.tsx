'use client';

import {
  acceptInvite,
  AuthError,
  getUser,
  handleAuthCallback,
  login,
  logout,
  updateUser,
} from '@netlify/identity';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { hasAdminRole } from '@/lib/admin-policy';

type AuthMode =
  | { type: 'login' }
  | { type: 'invite'; token: string }
  | { type: 'recovery' };

function authErrorMessage(cause: unknown) {
  if (cause instanceof AuthError && cause.status === 401) {
    return '이메일 또는 비밀번호를 확인해주세요.';
  }
  return cause instanceof Error ? cause.message : '요청을 처리하지 못했습니다.';
}

export function AdminLogin() {
  const [mode, setMode] = useState<AuthMode>({ type: 'login' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        const callback = await handleAuthCallback();

        if (callback?.type === 'invite' && callback.token) {
          setMode({ type: 'invite', token: callback.token });
          setLoading(false);
          return;
        }

        if (callback?.type === 'recovery') {
          setMode({ type: 'recovery' });
          setLoading(false);
          return;
        }

        const user = callback?.user ?? (await getUser());
        if (user && hasAdminRole(user.appMetadata)) {
          window.location.replace('/admin');
          return;
        }

        if (user) {
          await logout();
          setError('관리자 권한이 없는 계정입니다.');
        }
      } catch {
        setError('초대 또는 인증 링크가 만료되었거나 올바르지 않습니다. 새 초대를 요청해주세요.');
      }
      setLoading(false);
    })();
  }, []);

  const submitLogin = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (!hasAdminRole(user.appMetadata)) {
        await logout();
        throw new Error('관리자 권한이 없는 계정입니다.');
      }
      window.location.href = '/admin';
    } catch (cause) {
      setError(authErrorMessage(cause));
      setLoading(false);
    }
  };

  const submitPassword = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    if (password.length < 8) {
      setError('비밀번호는 8자 이상으로 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = mode.type === 'invite'
        ? await acceptInvite(mode.token, password)
        : await updateUser({ password });

      if (!hasAdminRole(user.appMetadata)) {
        await logout();
        throw new Error('관리자 권한이 없는 계정입니다.');
      }
      window.location.href = '/admin';
    } catch (cause) {
      setError(authErrorMessage(cause));
      setLoading(false);
    }
  };

  const isPasswordSetup = mode.type !== 'login';
  const title = mode.type === 'invite'
    ? '관리자 계정 설정'
    : mode.type === 'recovery'
      ? '비밀번호 재설정'
      : '관리자 로그인';
  const description = mode.type === 'invite'
    ? '초대를 수락하려면 관리자 계정에서 사용할 비밀번호를 설정해주세요.'
    : mode.type === 'recovery'
      ? '관리자 계정에서 사용할 새 비밀번호를 설정해주세요.'
      : 'Netlify에서 초대하고 admin 역할을 지정한 계정만 로그인할 수 있습니다.';

  return (
    <main className="grid min-h-screen place-items-center bg-[#edf3fb] px-5">
      <div className="w-full max-w-md rounded-[28px] border border-[#dce5f0] bg-white p-7 shadow-[0_24px_70px_rgba(16,36,62,.14)] sm:p-10">
        <a href="/" aria-label="홈"><BrandLogo /></a>
        <p className="mt-9 text-xs font-black tracking-[.16em] text-[#1b4dff]">ADMIN</p>
        <h1 className="mt-2 text-3xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#667085]">{description}</p>

        {isPasswordSetup ? (
          <form onSubmit={submitPassword} className="mt-8 space-y-5">
            <label className="grid gap-2 text-sm font-bold">
              새 비밀번호
              <input
                required
                minLength={8}
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              새 비밀번호 확인
              <input
                required
                minLength={8}
                type="password"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                className="rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff]"
              />
            </label>
            <button disabled={loading} className="w-full rounded-xl bg-[#1b4dff] px-5 py-4 font-black text-white disabled:opacity-60">
              {loading ? '처리 중…' : mode.type === 'invite' ? '초대 수락 및 로그인' : '비밀번호 변경'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitLogin} className="mt-8 space-y-5">
            <label className="grid gap-2 text-sm font-bold">
              이메일
              <input
                required
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              비밀번호
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff]"
              />
            </label>
            <button disabled={loading} className="w-full rounded-xl bg-[#1b4dff] px-5 py-4 font-black text-white disabled:opacity-60">
              {loading ? '확인 중…' : '로그인'}
            </button>
          </form>
        )}

        <p aria-live="polite" className="mt-4 text-sm font-bold text-red-600">{error}</p>
        <a href="/" className="mt-6 inline-block text-sm font-bold text-[#667085]">← 사이트로 돌아가기</a>
      </div>
    </main>
  );
}
