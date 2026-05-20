import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Search, ChevronDown, Clock, Users, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/hunts")({
  head: () => ({
    meta: [
      { title: "All Hunts — Souvenir Hunt" },
      { name: "description", content: "Explore our community of self-guided city hunts across countries and cities." },
    ],
  }),
  component: HuntsPage,
});

function HuntsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <header className="py-16">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Our hunts</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] text-ink text-balance">
            Explore our <em className="italic font-light">community.</em>
          </h1>
        </Reveal>
      </header>

      <Reveal>
        <div className="paper-card rounded-3xl p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-3 flex-1 px-5 py-4 rounded-2xl bg-muted">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search countries, cities, or hunts"
                className="bg-transparent outline-none flex-1 text-ink placeholder:text-muted-foreground"
              />
            </div>
            <button className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border border-border text-ink min-w-[200px]">
              <span>Featured order</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: "Countries", value: "04", active: true },
              { label: "Cities", value: "07" },
              { label: "Live hunt", value: "01" },
            ].map((c) => (
              <span
                key={c.label}
                className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium border transition-colors ${
                  c.active
                    ? "bg-primary text-white border-primary shadow-glow"
                    : "bg-white text-foreground/70 border-border hover:border-primary/40"
                }`}
              >
                <span className={`font-mono text-[10px] tracking-widest ${c.active ? "text-white/70" : "text-muted-foreground"}`}>{c.value}</span>
                <span className={`w-px h-3 ${c.active ? "bg-white/30" : "bg-border"}`} />
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <article className="paper-card rounded-3xl overflow-hidden">
          <div className="p-8 md:p-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="grid place-items-center w-14 h-14 rounded-full bg-gradient-to-br from-crimson-seal to-ink text-parchment font-display text-xl">
                HR
              </div>
              <div>
                <h2 className="font-display text-3xl text-ink">Croatia</h2>
                <p className="text-sm text-muted-foreground mt-1">Currently available to book.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-moss/15 text-moss px-3 py-1.5 text-xs font-medium">
              <motion.span className="w-1.5 h-1.5 rounded-full bg-moss"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Live
            </span>
          </div>

          <div className="px-8 md:px-10 pb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-4 h-px bg-border" /> Split
          </div>

          <div className="p-8 md:p-10 grid md:grid-cols-2 gap-10">
            <div className="relative rounded-2xl overflow-hidden bg-ink/90 aspect-[4/3] group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-seal/30 via-ink/40 to-crimson-seal/30" />
              <svg viewBox="0 0 400 300" className="w-full h-full text-parchment/40">
                <g stroke="currentColor" strokeWidth="0.7" fill="none">
                  <rect x="60" y="80" width="280" height="160" />
                  <rect x="90" y="100" width="60" height="60" />
                  <rect x="170" y="100" width="60" height="60" />
                  <rect x="250" y="100" width="60" height="60" />
                  <rect x="90" y="170" width="60" height="60" />
                  <rect x="250" y="170" width="60" height="60" />
                  <circle cx="200" cy="200" r="22" />
                  <path d="M60 240 Q200 270 340 240" />
                </g>
                <motion.circle cx="200" cy="200" r="6" fill="var(--amber-seal)"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </svg>
              <span className="absolute bottom-4 left-4 stamp bg-parchment/90 text-ink border-transparent">
                <MapPin className="w-3 h-3" /> Split, Croatia
              </span>
            </div>

            <div className="flex flex-col">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Live hunt</p>
              <h3 className="mt-3 font-display text-4xl text-ink leading-tight">The Emperor's Secret</h3>
              <p className="mt-4 text-foreground/75 leading-relaxed">
                A premium self-guided clue hunt through Split inspired by Diocletian, hidden symbols, and a real souvenir treasure at the end.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: Clock, label: "1.5–2.5 hrs" },
                  { icon: Users, label: "1–6 players" },
                  { icon: MapPin, label: "Old Town / Golden Gate" },
                  { icon: Sparkles, label: "EUR 39" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl bg-muted/60 px-4 py-3 text-sm text-ink">
                    <Icon className="w-4 h-4 text-accent" />
                    {label}
                  </div>
                ))}
              </div>

              <Link to="/hunts" className="mt-8 group inline-flex items-center justify-between gap-3 rounded-full bg-ink text-parchment px-6 py-4 text-sm font-medium hover:bg-accent transition-colors self-start">
                Begin the hunt
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </article>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            { country: "Italy", city: "Florence", status: "Coming soon" },
            { country: "Portugal", city: "Lisbon", status: "In design" },
            { country: "Greece", city: "Athens", status: "Scouting" },
          ].map((c) => (
            <article key={c.city} className="paper-card rounded-3xl p-8 group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{c.country}</p>
                  <h3 className="font-display text-3xl text-ink mt-2">{c.city}</h3>
                </div>
                <span className="stamp text-muted-foreground">{c.status}</span>
              </div>
              <div className="mt-10 h-32 rounded-2xl bg-gradient-to-br from-muted to-secondary border border-border" />
            </article>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
