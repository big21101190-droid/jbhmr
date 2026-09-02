import type { ReactNode } from 'react';

export function PageHero({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description: string; action?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#10243e] px-5 py-14 text-white sm:py-20">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative mx-auto max-w-[1240px]">
        <p className="text-xs font-black tracking-[.16em] text-[#78a0ff]">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.05] tracking-[-.06em]">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">{description}</p>
        {action ? <div className="mt-8">{action}</div> : null}
      </div>
    </section>
  );
}
