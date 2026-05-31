import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ChevronDown, Clock, Users, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { listPublicHunts } from "@/server/hunts";
import { huntStatusLabel, isHuntBookable, type HuntStatus } from "@/lib/types";

export const Route = createFileRoute("/hunts")({
  head: () => ({
    meta: [
      { title: "All Hunts — Souvenir Hunt" },
      { name: "description", content: "Explore our community of self-guided city hunts across countries and cities." },
    ],
  }),
  loader: async () => {
    try {
      return await listPublicHunts();
    } catch (error) {
      console.error("Failed to load hunts:", error);
      return [];
    }
  },
  component: HuntsPage,
});

const countryFlagByName: Record<string, string> = {
  Croatia: "/assets/branding/flag-croatia.svg",
  Greece: "/assets/branding/flag-greece.svg",
  Italy: "/assets/branding/flag-italy.svg",
  Spain: "/assets/branding/flag-spain.svg",
};

function HuntsPage() {
  const hunts = Route.useLoaderData();
  const published = hunts.filter((h) => h.published);
  const live = published.filter((h) => h.status === "live");
  const upcoming = published.filter((h) => h.status !== "live");
  const comingByCountry = Object.entries(
    upcoming.reduce<Record<string, string[]>>((acc, hunt) => {
      acc[hunt.country] = acc[hunt.country] ?? [];
      if (!acc[hunt.country].includes(hunt.city)) acc[hunt.country].push(hunt.city);
      return acc;
    }, {}),
  )
    .map(([country, cities]) => ({ country, cities: cities.sort((a, b) => a.localeCompare(b)) }))
    .sort((a, b) => a.country.localeCompare(b.country));

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <header className="py-12 md:py-16">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Our hunts</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] text-ink text-balance">
            Explore our <em className="italic font-light">community.</em>
          </h1>
        </Reveal>
      </header>

      <Reveal>
        <div className="paper-card rounded-2xl p-5 md:p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl bg-muted">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search countries, cities, or hunts"
                className="bg-transparent outline-none flex-1 text-ink placeholder:text-muted-foreground text-sm"
              />
            </div>
            <button className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border text-ink min-w-[180px] text-sm">
              <span>Featured order</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Reveal>

      {live.length === 0 && (
        <Reveal>
          <p className="mb-8 text-sm text-muted-foreground">
            No live hunts available yet. Check back soon or explore what&apos;s coming next.
          </p>
        </Reveal>
      )}

      {live.map((hunt) => (
        <Reveal key={hunt.id}>
          <article className="paper-card rounded-2xl overflow-hidden mb-10">
            <div className="p-6 md:p-8 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid place-items-center w-12 h-12 rounded-full bg-white border border-border/70 overflow-hidden shadow-sm">
                  {countryFlagByName[hunt.country] ? (
                    <img
                      src={countryFlagByName[hunt.country]}
                      alt={`${hunt.country} flag`}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="font-display text-sm text-ink">{hunt.country.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h2 className="font-display text-2xl text-ink">{hunt.country}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Currently available to book.</p>
                </div>
              </div>
              <StatusBadge status={hunt.status} />
            </div>

            <div className="px-6 md:px-8 pb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-4 h-px bg-border" /> {hunt.city}
            </div>

            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
              <div className="relative rounded-xl overflow-hidden bg-ink/90 aspect-[4/3]">
                <img
                  src={hunt.heroImageUrl || "/assets/branding/split-hunt-image.svg"}
                  alt={`${hunt.city}, ${hunt.country}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/20 to-transparent" />
                <span className="absolute bottom-4 left-4 stamp bg-parchment/90 text-ink border-transparent text-xs">
                  <MapPin className="w-3 h-3" /> {hunt.city}, {hunt.country}
                </span>
              </div>

              <div className="flex flex-col">
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Live hunt</p>
                <h3 className="mt-2 font-display text-2xl md:text-3xl text-ink leading-tight">{hunt.name}</h3>
                <p className="mt-3 text-sm text-foreground/75 leading-relaxed">{hunt.description}</p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[
                    { icon: Clock, label: hunt.durationLabel },
                    { icon: Users, label: hunt.playersLabel },
                    { icon: MapPin, label: hunt.locationLabel },
                    {
                      icon: Sparkles,
                      label: hunt.priceCents ? `EUR ${(hunt.priceCents / 100).toFixed(0)}` : "—",
                    },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2.5 text-xs text-ink"
                    >
                      <Icon className="w-3.5 h-3.5 text-accent shrink-0" />
                      {label}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    to="/checkout/$slug"
                    params={{ slug: hunt.slug }}
                    className="group inline-flex items-center justify-between gap-3 rounded-full bg-ink text-parchment px-5 py-3.5 text-sm font-medium hover:bg-primary transition-colors"
                  >
                    Pay & Start Hunt
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/your-hunt"
                    className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3.5 text-sm font-medium text-ink hover:bg-muted transition-colors"
                  >
                    Resume Existing Hunt
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      ))}

      {upcoming.length > 0 && (
        <Reveal delay={0.1}>
          <h2 className="font-mono text-xs tracking-[0.28em] uppercase text-muted-foreground mb-6">
            Coming soon
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {comingByCountry.map((entry) => (
              <article key={entry.country} className="paper-card rounded-2xl p-6 border border-border/70 bg-card">
                <div className="flex items-center gap-3">
                  <div className="grid place-items-center w-10 h-10 rounded-full bg-white border border-border/70 overflow-hidden">
                    {countryFlagByName[entry.country] ? (
                      <img
                        src={countryFlagByName[entry.country]}
                        alt={`${entry.country} flag`}
                        className="w-7 h-7 object-contain"
                      />
                    ) : (
                      <span className="font-display text-xs text-ink">{entry.country.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Country</p>
                    <h3 className="mt-1 font-display text-2xl text-ink">{entry.country}</h3>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {entry.cities.map((city) => (
                    <div key={city} className="rounded-xl border border-border bg-muted/50 px-4 py-3">
                      <p className="font-medium text-ink">{city}</p>
                      <p className="text-xs text-muted-foreground mt-1">New hunts coming soon.</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: HuntStatus }) {
  const live = status === "live";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium shrink-0 ${
        live ? "bg-moss/15 text-moss" : "bg-muted text-muted-foreground"
      }`}
    >
        {live && <span className="w-1.5 h-1.5 rounded-full bg-moss animate-pulse" />}
      {huntStatusLabel(status)}
    </span>
  );
}

