import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import type { SerializedHunt } from "@/lib/mongo-json";

type Props = {
  hunts: SerializedHunt[];
};

export function HomeHuntsSection({ hunts }: Props) {
  const published = hunts.filter((h) => h.published);
  const live = published.filter((h) => h.status === "live");
  const featured = live[0];

  return (
    <section id="hunts" className="relative scroll-mt-28 pt-16 pb-8 md:pt-32 md:pb-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-8 flex flex-col items-center gap-4 text-center md:mb-12 md:flex-row md:items-end md:justify-between md:gap-8 md:text-left">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Our hunts</p>
            <h2 className="mt-3 font-display text-[clamp(1.65rem,5.5vw,3.25rem)] leading-[1.08] text-ink text-balance md:mt-4">
              Pick a city. <em className="italic font-light">Start exploring.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/hunts"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3"
            >
              View all hunts <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {featured && (
          <Reveal>
            <article className="paper-card mx-auto mb-6 max-w-[420px] overflow-hidden rounded-2xl md:mb-10 md:max-w-none">
              <div className="grid gap-0 md:grid-cols-2">
                <div className="relative min-h-[220px] bg-ink/90 sm:min-h-[260px] md:min-h-[280px]">
                  <img
                    src={featured.heroImageUrl || "/assets/branding/split-hunt-image.svg"}
                    alt={`${featured.city}, ${featured.country}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-ink/35 via-ink/30 to-ink/55" />
                  <span className="absolute bottom-5 left-5 stamp bg-parchment/90 text-ink border-transparent text-xs">
                    <MapPin className="w-3 h-3" /> {featured.city}, {featured.country}
                  </span>
                  <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-moss/90 text-white px-3 py-1 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live now
                  </span>
                </div>
                <div className="flex flex-col items-center p-6 text-center sm:p-8 md:items-start md:p-10 md:text-left">
                  <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Featured hunt</p>
                  <h3 className="mt-2.5 font-display text-2xl text-ink md:mt-3 md:text-3xl">{featured.name}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-foreground/75 line-clamp-3 md:mt-3">
                    {featured.description}
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2 md:mt-6 md:justify-start">
                    {[featured.durationLabel, featured.playersLabel, `EUR ${(featured.priceCents / 100).toFixed(0)}`].map(
                      (label) => (
                        <span
                          key={label}
                          className="rounded-full bg-muted px-3 py-1 text-xs text-foreground/80"
                        >
                          {label}
                        </span>
                      ),
                    )}
                  </div>
                  <Link
                    to="/hunts/$slug"
                    params={{ slug: featured.slug }}
                    className="group mt-6 inline-flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-parchment transition-colors hover:bg-primary md:mt-8 md:w-auto md:max-w-none md:justify-start"
                  >
                    Begin the hunt
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        )}
      </div>
    </section>
  );
}
