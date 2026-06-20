import { Reveal } from "@/components/site/Reveal";

const HOME_BG = "/assets/branding/background-static.png";

export function HomeArtistsSection() {
  return (
    <section
      id="artists"
      className="relative scroll-mt-32 overflow-hidden bg-primary py-20 text-parchment sm:py-28 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary via-[#1a52e0] to-[#0b2f8f]"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex justify-center" aria-hidden>
        <img
          src={HOME_BG}
          alt=""
          className="block h-auto w-full min-w-full max-w-[1440px] opacity-95"
          width={1440}
          height={810}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-primary/25 via-primary/10 to-primary/40" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mx-auto max-w-[420px] text-center md:max-w-none md:text-left">
          <div className="grid gap-8 md:grid-cols-12 md:items-start md:gap-12">
            <Reveal className="md:col-span-4">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-300">Artists &amp; Makers</p>
            </Reveal>

            <div className="md:col-span-8">
              <Reveal delay={0.08}>
                <h2 className="font-display text-[clamp(1.65rem,5.5vw,3.25rem)] leading-[1.08] text-balance text-parchment">
                  Built with local artists, storytellers, and{" "}
                  <em className="font-light italic text-amber-200">game makers.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-parchment/80 sm:mt-6 sm:text-lg md:mx-0">
                  Each hunt is shaped by people who know how to turn a city into something cultural, playful,
                  and worth remembering.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
