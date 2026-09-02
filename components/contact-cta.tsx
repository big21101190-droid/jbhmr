import { Phone } from 'lucide-react';
import { company, telHref } from '@/lib/company';

export function ContactCta({ daegu = false, label = '보내실 화물을 알려주세요' }: { daegu?: boolean; label?: string }) {
  const phone = daegu ? company.daeguPhone : company.nationalPhone;
  return (
    <section className="bg-[#1b4dff] px-5 py-14 text-white">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-sm font-bold text-white/65">지금 보내실 화물이 있나요?</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] sm:text-4xl">{label}</h2></div>
        <a href={telHref(phone)} className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 text-lg font-black text-[#1b4dff]"><Phone size={19} /> {daegu ? '대구' : '전국'} {phone}</a>
      </div>
    </section>
  );
}
