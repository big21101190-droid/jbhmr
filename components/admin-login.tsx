'use client';

import { AuthError, getUser, handleAuthCallback, login, logout } from '@netlify/identity';
import { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    void (async () => {
      try { await handleAuthCallback(); } catch { /* no callback is a normal visit */ }
      const user = await getUser();
      const roles = user?.appMetadata?.roles;
      if (Array.isArray(roles) && roles.includes('admin')) window.location.replace('/admin');
      else setLoading(false);
    })();
  }, []);
  const submit = async (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const user = await login(email, password);
      const roles = user.appMetadata?.roles;
      if (!Array.isArray(roles) || !roles.includes('admin')) {
        await logout();
        throw new Error('관리자 권한이 없는 계정입니다.');
      }
      window.location.href = '/admin';
    } catch (cause) {
      setError(cause instanceof AuthError && cause.status === 401 ? '이메일 또는 비밀번호를 확인해주세요.' : cause instanceof Error ? cause.message : '로그인하지 못했습니다.');
      setLoading(false);
    }
  };
  return <main className="grid min-h-screen place-items-center bg-[#edf3fb] px-5"><div className="w-full max-w-md rounded-[28px] border border-[#dce5f0] bg-white p-7 shadow-[0_24px_70px_rgba(16,36,62,.14)] sm:p-10"><a href="/" aria-label="홈"><BrandLogo/></a><p className="mt-9 text-xs font-black tracking-[.16em] text-[#1b4dff]">ADMIN</p><h1 className="mt-2 text-3xl font-black">관리자 로그인</h1><p className="mt-3 text-sm leading-6 text-[#667085]">Netlify에서 초대하고 admin 역할을 지정한 계정만 로그인할 수 있습니다.</p><form onSubmit={submit} className="mt-8 space-y-5"><label className="grid gap-2 text-sm font-bold">이메일<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className="rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff]"/></label><label className="grid gap-2 text-sm font-bold">비밀번호<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff]"/></label><button disabled={loading} className="w-full rounded-xl bg-[#1b4dff] px-5 py-4 font-black text-white disabled:opacity-60">{loading?'확인 중…':'로그인'}</button></form><p aria-live="polite" className="mt-4 text-sm font-bold text-red-600">{error}</p><a href="/" className="mt-6 inline-block text-sm font-bold text-[#667085]">← 사이트로 돌아가기</a></div></main>;
}
