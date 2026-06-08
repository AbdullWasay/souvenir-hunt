import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

export type HeroKpi = {
  value: number;
  suffix?: string;
  label: string;
  icon?: LucideIcon;
};

function KpiCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      const duration = 1200;
      const stepMs = 25;
      const totalSteps = Math.max(1, Math.floor(duration / stepMs));
      let currentStep = 0;
      const timer = window.setInterval(() => {
        currentStep += 1;
        setValue(Math.min(target, Math.round(target * (currentStep / totalSteps))));
        if (currentStep >= totalSteps) window.clearInterval(timer);
      }, stepMs);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setValue(0);
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export function HeroKpiStrip({ items }: { items: readonly HeroKpi[] }) {
  return (
    <div className="hero-kpi-band relative mx-auto max-w-[420px] border-t border-primary/10 px-2 sm:max-w-[520px] md:max-w-4xl">
      <ul className="hero-kpi-scroll flex snap-x snap-mandatory gap-0 overflow-x-auto scrollbar-none md:grid md:grid-cols-4 md:overflow-visible md:snap-none md:divide-x md:divide-primary/10">
        {items.map(({ value, suffix, label }) => (
          <li
            key={label}
            className="hero-kpi-item flex w-[33%] min-w-[6.5rem] shrink-0 snap-center flex-col items-center justify-center gap-0.5 bg-transparent py-3.5 sm:min-w-[7rem] md:w-auto md:py-5 md:px-6"
          >
            <p className="font-display text-[1.65rem] font-bold leading-none text-primary tabular-nums sm:text-[1.85rem]">
              <KpiCounter target={value} suffix={suffix ?? ""} />
            </p>
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-foreground/45 sm:text-[9px]">
              {label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
