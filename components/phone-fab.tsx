import { Phone } from 'lucide-react';
import { telHref } from '@/lib/site-data';

export function PhoneFab({ phone, label = '전화 상담' }: { phone: string; label?: string }) {
  return (
    <a href={telHref(phone)} className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-center gap-2 rounded-2xl bg-[#1b4dff] px-5 py-4 text-base font-black text-white shadow-[0_18px_50px_rgba(27,77,255,.38)] sm:hidden">
      <Phone size={19} /> {label} {phone}
    </a>
  );
}
