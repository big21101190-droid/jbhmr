'use client';

import { useState } from 'react';

const serviceOptions = ['퀵서비스', '다마스 배송', '1톤 용달화물', '고속버스택배', 'KTX택배', '제주 항공·선박', '골프백·캐리어'];

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    setState('submitting');
    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
      if (!response.ok) throw new Error('submit failed');
      form.reset();
      setState('success');
      window.gtag?.('event', 'inquiry_submit');
    } catch {
      setState('error');
    }
  };

  return (
    <form name="inquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} className="rounded-[28px] border border-[#dce5f0] bg-white p-6 shadow-[0_18px_50px_rgba(16,36,62,.08)] sm:p-10">
      <input type="hidden" name="form-name" value="inquiry" />
      <p className="hidden"><label>작성하지 마세요 <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">이름 또는 회사명<input required name="name" maxLength={80} className="rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff] focus:ring-2 focus:ring-[#1b4dff]/15" /></label>
        <label className="grid gap-2 text-sm font-bold">연락처<input required name="phone" type="tel" inputMode="tel" maxLength={30} className="rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff] focus:ring-2 focus:ring-[#1b4dff]/15" /></label>
        <label className="grid gap-2 text-sm font-bold">출발지<input required name="origin" maxLength={120} className="rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff] focus:ring-2 focus:ring-[#1b4dff]/15" /></label>
        <label className="grid gap-2 text-sm font-bold">도착지<input required name="destination" maxLength={120} className="rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff] focus:ring-2 focus:ring-[#1b4dff]/15" /></label>
        <label className="grid gap-2 text-sm font-bold sm:col-span-2">서비스<select required name="service" defaultValue="" className="rounded-xl border border-[#cfd9e6] bg-white px-4 py-3 outline-none focus:border-[#1b4dff]"><option value="" disabled>선택해주세요</option>{serviceOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-bold sm:col-span-2">문의 내용<textarea required name="message" rows={6} maxLength={2000} placeholder="화물 종류, 수량, 크기와 희망 시간을 알려주세요." className="resize-y rounded-xl border border-[#cfd9e6] px-4 py-3 outline-none focus:border-[#1b4dff] focus:ring-2 focus:ring-[#1b4dff]/15" /></label>
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-[#475467]"><input required type="checkbox" name="privacy-consent" value="동의" className="mt-1 h-4 w-4 accent-[#1b4dff]" /><span><a href="/privacy" className="font-bold text-[#1b4dff] underline">개인정보처리방침</a>에 동의합니다. 문의 답변에 필요한 최소 정보만 수집합니다.</span></label>
      <button disabled={state === 'submitting'} className="mt-7 w-full rounded-xl bg-[#1b4dff] px-6 py-4 font-black text-white disabled:opacity-60">{state === 'submitting' ? '전송 중…' : '견적 문의 보내기'}</button>
      <p aria-live="polite" className={`mt-4 text-sm font-bold ${state === 'error' ? 'text-red-600' : 'text-[#1f7a4d]'}`}>{state === 'success' ? '문의가 접수되었습니다. 확인 후 연락드리겠습니다.' : state === 'error' ? '전송에 실패했습니다. 전화로 문의해 주세요.' : ''}</p>
    </form>
  );
}
