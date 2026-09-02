import { Truck } from 'lucide-react';

export function BrandLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative flex h-10 w-12 items-center justify-center" aria-hidden="true">
        <span className={`absolute left-0 top-[12px] h-[2px] w-3 rounded-full ${inverted ? 'bg-[#78a0ff]' : 'bg-[#1b4dff]'}`} />
        <span className={`absolute left-1 top-[18px] h-[2px] w-3 rounded-full ${inverted ? 'bg-white/55' : 'bg-[#10243e]/45'}`} />
        <Truck className={inverted ? 'text-white' : 'text-[#10243e]'} size={39} strokeWidth={1.8} />
      </span>
      <span>
        <strong className={`block text-[18px] font-black leading-none tracking-[-0.055em] ${inverted ? 'text-white' : 'text-[#10243e]'}`}>제이복합물류</strong>
        <small className={`mt-1.5 block text-[9px] font-black tracking-[0.2em] ${inverted ? 'text-[#78a0ff]' : 'text-[#1b4dff]'}`}>J EXPRESS</small>
      </span>
    </span>
  );
}
