import { Link } from "@tanstack/react-router";
import { AnimateIn } from "@/components/site/AnimateIn";
import { HeroKpiStrip, type HeroKpi } from "@/components/site/HeroKpiStrip";

const HEADLINE = ["Explore City.", "Solve Clues.", "Earn Souvenir."];

type Props = {
  kpis: readonly HeroKpi[];
};

export function HomeHero({ kpis }: Props) {
  return (
    <section className="relative overflow-hidden -mt-[5.5rem] sm:-mt-28">
      <div className="relative z-10 mx-auto w-full max-w-[420px] px-5 pt-[4.35rem] text-center sm:max-w-[520px] sm:px-6 sm:pt-28 md:max-w-[580px]">
        <AnimateIn y={12}>
          <p className="text-[1rem] font-medium leading-snug tracking-[-0.02em] text-primary sm:text-lg">
            Turn Sightseeing Into an Adventure
          </p>
        </AnimateIn>

        <h1 className="mt-2.5 font-display text-[clamp(2.45rem,10.5vw,4.5rem)] font-bold leading-[0.9] tracking-[-0.045em] text-primary sm:mt-3">
          {HEADLINE.map((line, i) => (
            <AnimateIn key={line} as="span" y={18} delay={0.08 + i * 0.06} className="block">
              {line}
            </AnimateIn>
          ))}
        </h1>

        <AnimateIn delay={0.28} className="mt-2.5 sm:mt-3">
          <p className="text-[0.95rem] font-semibold text-primary sm:text-base">#Made by local artists.</p>
        </AnimateIn>

        <AnimateIn delay={0.36} className="mt-4 sm:mt-5">
          <div className="relative mx-auto w-full max-h-[176px] overflow-hidden rounded-2xl border border-primary/10 shadow-[0_16px_40px_-18px_rgba(10,77,255,0.32)] aspect-[16/11] sm:max-h-none sm:aspect-[3/2]">
            <img
              src="/assets/branding/hero-bg.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061428] via-[#0c2d5c]/55 to-[#1a4a8a]/25" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(120,180,255,0.45),transparent_50%)]" />
          </div>
        </AnimateIn>

        <AnimateIn delay={0.44} className="mt-5 sm:mt-7">
          <div className="mx-auto flex w-full max-w-[320px] flex-col gap-3 sm:max-w-[360px] sm:gap-3.5">
            <Link
              to="/hunts"
              className="btn-shine inline-flex h-[3.35rem] w-full items-center justify-center rounded-full bg-primary text-[1rem] font-bold text-white shadow-paper transition-shadow hover:shadow-glow sm:h-14 sm:text-[1.05rem]"
            >
              Start Hunt
            </Link>
            <Link
              to="/your-hunt"
              className="inline-flex h-[3.35rem] w-full items-center justify-center rounded-full border-2 border-primary bg-white text-[1rem] font-bold text-primary transition-colors hover:bg-primary/[0.04] sm:h-14 sm:text-[1.05rem]"
            >
              Continue Your Hunt
            </Link>
          </div>
        </AnimateIn>
      </div>

      <AnimateIn y={14} delay={0.52} className="relative z-10 mx-auto mt-5 w-full max-w-7xl pb-1 sm:mt-6 sm:px-6">
        <HeroKpiStrip items={kpis} />
      </AnimateIn>
    </section>
  );
}
