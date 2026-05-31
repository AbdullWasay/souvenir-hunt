import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, MapPin, Lock } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { huntStatusLabel } from "@/lib/types";
import type { SerializedHunt } from "@/lib/mongo-json";

type Props = {
  hunts: SerializedHunt[];
};

export function HomeHuntsSection({ hunts }: Props) {
  const published = hunts.filter((h) => h.published);
  const live = published.filter((h) => h.status === "live");
  const upcoming = published.filter((h) => h.status !== "live");
  const featured = live[0];

  return (
    <section id="hunts" className="py-28 md:py-32 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Our hunts</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.08] text-ink text-balance">
              Pick a city. <em className="italic font-light">Start exploring.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/hunts"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
            >
              View all hunts <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>

        {featured && (
          <Reveal>
            <article className="paper-card rounded-2xl overflow-hidden mb-10">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative min-h-[280px] bg-ink/90">
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
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-white"
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Live now
                  </span>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Featured hunt</p>
                  <h3 className="mt-3 font-display text-2xl md:text-3xl text-ink">{featured.name}</h3>
                  <p className="mt-3 text-sm text-foreground/75 leading-relaxed line-clamp-3">
                    {featured.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
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
                    className="mt-8 group inline-flex items-center gap-2 rounded-full bg-ink text-parchment px-6 py-3 text-sm font-medium hover:bg-primary transition-colors self-start"
                  >
                    Begin the hunt
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        )}

        {upcoming.length > 0 && (
          <>
            <Reveal delay={0.05}>
              <p className="font-mono text-xs tracking-[0.28em] uppercase text-muted-foreground mb-6">
                Coming soon
              </p>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map((hunt, i) => (
                <Reveal key={hunt.id} delay={i * 0.06}>
                  <ComingSoonCard hunt={hunt} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ComingSoonCard({ hunt }: { hunt: SerializedHunt }) {
  return (
    <article className="relative paper-card rounded-2xl p-6 h-full overflow-hidden">
      <div className="absolute inset-0 z-10 bg-background/45 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-ink/90 text-parchment px-4 py-2 text-xs font-medium">
          <Lock className="w-3.5 h-3.5" />
          {huntStatusLabel(hunt.status)}
        </span>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{hunt.country}</p>
      <h3 className="font-display text-xl text-ink mt-1">{hunt.city}</h3>
      <p className="mt-3 text-sm text-foreground/65 line-clamp-2">{hunt.description}</p>
      <div className="mt-6 h-20 rounded-xl bg-gradient-to-br from-muted to-secondary border border-border" />
    </article>
  );
}
