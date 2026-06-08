import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, MapPin, Compass, Sparkles, Quote, Star, Send, Milestone, Gift, Brain } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/site/Marquee";
import { HomeHuntsSection } from "@/components/site/HomeHuntsSection";
import { HomeParallaxBg } from "@/components/site/HomeParallaxBg";
import { HomeHero } from "@/components/site/HomeHero";
import { HomeArtistsSection } from "@/components/site/HomeArtistsSection";
import type { HeroKpi } from "@/components/site/HeroKpiStrip";
import { listPublicHunts } from "@/server/hunts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Souvenir Hunt — Self-guided city hunts with a keepsake" },
      { name: "description", content: "A clean self-guided city hunt with hidden stories, playful clues, and a keepsake at the end." },
    ],
  }),
  loader: async () => {
    try {
      return await listPublicHunts();
    } catch (error) {
      console.error("Failed to load hunts for homepage:", error);
      return [];
    }
  },
  component: Home,
});

function Home() {
  const hunts = Route.useLoaderData();
  return (
    <div className="home-page relative isolate">
      <HomeParallaxBg />
      <div className="relative z-[1]">
        <HomeHero kpis={HERO_KPIS} />
        <Marquee />
        <About />
        <HomeArtistsSection />
        <HomeHuntsSection hunts={hunts} />
        <Reviews />
        <ContactForm />
        <ContactCTA />
      </div>
    </div>
  );
}

const HERO_KPIS: readonly HeroKpi[] = [
  { value: 4, suffix: "", label: "Countries", icon: MapPin },
  { value: 7, suffix: "", label: "Cities mapped", icon: Compass },
  { value: 1, suffix: "", label: "Live hunt", icon: Sparkles },
  { value: 99, suffix: "+", label: "Stories hidden", icon: Quote },
];

function About() {
  const journey = [
    {
      icon: Milestone,
      title: "Walk real streets",
      body: "Meaningful stops — courtyards, facades, details a generic tour would skip.",
    },
    {
      icon: Brain,
      title: "Solve with calm",
      body: "Clues that feel elegant and earned, never loud trivia or random guessing.",
    },
    {
      icon: Gift,
      title: "Keep the story",
      body: "A physical souvenir tied to the route you just completed — not a generic trinket.",
    },
  ];

  return (
    <section id="about" className="relative scroll-mt-32 overflow-hidden py-16 md:py-36">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mx-auto grid max-w-[420px] items-start gap-10 md:max-w-none lg:grid-cols-12 lg:gap-16">
          <Reveal className="text-center lg:col-span-5 lg:sticky lg:top-36 lg:text-left">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary">About</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,5.5vw,3.5rem)] leading-[1.05] text-ink text-balance md:mt-5">
              Sightseeing made <em className="italic font-light text-primary">worth remembering.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-sm text-foreground/75 leading-relaxed md:mx-0 md:mt-6">
              Souvenir Hunt turns real streets into story-led experiences — discovered, not consumed.
            </p>
            <blockquote className="mx-auto mt-6 max-w-sm border-l-0 pl-0 md:mt-8 lg:mx-0 lg:mt-10 lg:max-w-md lg:border-l-2 lg:border-primary/40 lg:pl-6">
              <p className="font-display text-lg italic leading-snug text-ink/90 sm:text-xl">
                &ldquo;The city should feel like a mystery you&apos;re invited into — not a checklist.&rdquo;
              </p>
            </blockquote>
          </Reveal>

          <div className="space-y-0 lg:col-span-7">
            {journey.map((step, i) => (
              <Reveal
                key={step.title}
                x={36}
                delay={i * 0.05}
                className="group relative flex flex-col items-center gap-4 pb-10 text-center last:pb-0 md:flex-row md:items-start md:gap-5 md:pb-12 md:text-left lg:gap-8"
              >
                {i < journey.length - 1 && (
                  <span className="absolute left-[23px] top-14 bottom-0 hidden w-px bg-gradient-to-b from-primary/40 to-transparent md:left-[27px] md:block" />
                )}
                <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-paper transition-transform group-hover:scale-105 md:h-14 md:w-14">
                  <step.icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
                </span>
                <article className="flex-1 pb-2 pt-0 md:pt-1">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                    Step 0{i + 1}
                  </span>
                  <h3 className="mt-2 font-display text-xl text-ink md:text-2xl lg:text-3xl">{step.title}</h3>
                  <p className="mx-auto mt-2.5 max-w-sm text-foreground/70 leading-relaxed md:mx-0 md:mt-3 md:max-w-lg">
                    {step.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const featured = {
    quote: "It felt like exploring Split inside a mystery novel. Clean, easy, and actually memorable.",
    name: "Mia & Luka",
    role: "Weekend travelers",
    city: "Split",
  };
  const more = [
    { quote: "Way better than a normal walking tour. The souvenir at the end made it feel earned.", name: "Sophie", role: "Solo traveler", city: "Paris" },
    { quote: "Simple on mobile, fun to solve, and polished enough to feel premium.", name: "Daniel + friends", role: "Group of 4", city: "London" },
  ];

  return (
    <section id="reviews" className="relative scroll-mt-32 pt-8 pb-8 md:pt-10 md:pb-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <Reveal className="mx-auto mb-8 max-w-[420px] text-center md:mb-14 md:max-w-2xl">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary">Reviews</p>
          <h2 className="mt-3 font-display text-[clamp(1.65rem,5.5vw,3.25rem)] leading-[1.08] text-ink text-balance md:mt-4">
            Voices from the <em className="italic font-light">trail.</em>
          </h2>
        </Reveal>

        <div className="mx-auto grid max-w-[420px] gap-4 md:max-w-none md:gap-6 lg:grid-cols-12">
          <Reveal
            as="article"
            y={28}
            className="relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-ink p-6 text-center text-parchment sm:min-h-[320px] sm:p-8 md:text-left md:p-12 lg:col-span-7"
          >
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 0%, oklch(0.55 0.2 45 / 0.5), transparent 55%), radial-gradient(circle at 90% 100%, oklch(0.45 0.15 250 / 0.4), transparent 50%)" }} />
              <div className="relative">
                <div className="mb-5 flex justify-center gap-1 text-primary md:mb-8 md:justify-start">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4" fill="currentColor" />
                  ))}
                </div>
                <Quote className="mx-auto mb-4 h-10 w-10 text-parchment/30 md:mx-0 md:mb-6 md:h-12 md:w-12" strokeWidth={1} />
                <p className="font-display text-[clamp(1.35rem,5vw,2.25rem)] leading-[1.15] text-balance">
                  &ldquo;{featured.quote}&rdquo;
                </p>
              </div>
              <div className="relative mt-8 flex flex-col items-center gap-3 md:mt-10 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-base font-medium md:text-lg">{featured.name}</p>
                  <p className="mt-1 text-sm text-parchment/60">{featured.role}</p>
                </div>
                <span className="stamp shrink-0 border-parchment/20 bg-parchment/10 text-xs text-parchment">
                  <MapPin className="h-3 w-3" /> {featured.city}
                </span>
              </div>
          </Reveal>

          <div className="flex flex-col gap-4 md:gap-6 lg:col-span-5">
            {more.map((r, i) => (
              <Reveal
                key={r.name}
                as="article"
                x={24}
                delay={i * 0.06}
                className={`paper-card flex h-full flex-col justify-between rounded-2xl p-6 text-center md:p-7 md:text-left ${i === 0 ? "border-amber-seal/25 bg-amber-seal/8" : ""}`}
                style={i === 1 ? { transform: "rotate(0.6deg)" } : undefined}
              >
                  <div>
                    <div className="mb-3 flex justify-center gap-1 text-primary md:mb-4 md:justify-start">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5" fill="currentColor" />
                      ))}
                    </div>
                    <p className="font-display text-lg leading-snug text-ink md:text-xl">&ldquo;{r.quote}&rdquo;</p>
                  </div>
                  <div className="mt-5 flex flex-col items-center gap-1 md:mt-6 md:flex-row md:items-center md:justify-between md:gap-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.city}</span>
                  </div>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 px-5 py-4 text-center md:flex-row md:justify-between md:gap-4 md:px-6 md:py-5 md:text-left">
                <p className="text-sm text-foreground/70">4.9 average from early explorers</p>
                <div className="flex -space-x-2">
                  {["M", "S", "D", "+"].map((initial) => (
                    <span
                      key={initial}
                      className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary/15 text-xs font-mono text-primary"
                    >
                      {initial}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative scroll-mt-32 pt-8 pb-16 md:pt-10 md:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mx-auto grid max-w-[420px] items-start gap-8 md:max-w-none md:grid-cols-12 md:gap-10">
          <Reveal className="text-center md:col-span-5 md:text-left">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Contact</p>
            <h2 className="mt-4 font-display text-[clamp(1.65rem,5.5vw,2.75rem)] leading-[1.08] text-ink text-balance md:mt-6">
              Bring a hunt to your <em className="italic font-light text-gradient animate-gradient">city.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-foreground/75 md:mx-0 md:mt-6 md:max-w-md">
              Partner with us, or send a note. We reply within ~48 hours.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-sm md:mt-10 md:justify-start">
              <span className="hidden h-px w-10 bg-primary/40 md:block" />
              <span className="font-mono text-muted-foreground">hello@souvenirhunt.co</span>
            </div>
          </Reveal>

          <Reveal className="md:col-span-7" delay={0.1}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="paper-card relative space-y-4 overflow-hidden rounded-3xl p-6 md:space-y-5 md:p-10"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-100/70 blur-3xl" />
              <div className="relative grid gap-4 md:grid-cols-2 md:gap-5">
                <HomeField label="Name" placeholder="Your name" />
                <HomeField label="Email" type="email" placeholder="you@city.com" />
              </div>
              <div className="relative">
                <HomeField label="City / Venue" placeholder="Where should we bring a hunt?" />
              </div>
              <label className="relative block">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Message</span>
                <textarea
                  rows={4}
                  placeholder="Tell us about your idea…"
                  className="mt-2 w-full resize-none rounded-2xl border border-border bg-muted/60 px-5 py-4 text-ink outline-none transition-colors focus:border-primary"
                />
              </label>
              <button
                type="submit"
                className="btn-shine group relative inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-medium text-white transition-shadow hover:shadow-glow md:w-auto"
              >
                {sent ? "Sent — we'll be in touch" : "Send message"}
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HomeField({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl bg-muted/60 border border-border px-5 py-4 text-ink outline-none focus:border-primary transition-colors"
      />
    </label>
  );
}

function ContactCTA() {
  return (
    <section className="py-12 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <Reveal>
          <div className="relative mx-auto max-w-[420px] overflow-hidden rounded-[1.75rem] bg-[oklch(0.18_0.06_254)] p-8 text-center text-white md:max-w-none md:rounded-[2rem] md:p-20 md:text-left">
            <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(at 20% 20%, oklch(0.5 0.22 252 / 0.5), transparent 50%), radial-gradient(at 80% 80%, oklch(0.58 0.2 250 / 0.35), transparent 55%)" }} />
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
            <div aria-hidden className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-white/10 spin-slow">
              <div className="absolute inset-8 rounded-full border border-white/10" />
              <div className="absolute inset-20 rounded-full border border-white/10" />
            </div>

            <div className="relative">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/60">Partner with us — 05</p>
              <h2 className="mx-auto mt-4 max-w-sm font-display text-[clamp(1.65rem,5.5vw,3.5rem)] leading-[1.05] text-balance md:mx-0 md:mt-6 md:max-w-3xl">
                Create something <em className="font-light italic text-gradient animate-gradient">worth discovering.</em>
              </h2>
              <p className="mx-auto mt-5 max-w-sm text-base text-white/75 md:mx-0 md:mt-8 md:max-w-xl md:text-lg">
                Want to partner, create, or launch a hunt? Bring your city, your artwork, or your venue into the experience. We&apos;re building premium clue hunts shaped by local people.
              </p>
              <Link
                to="/"
                hash="contact"
                className="btn-shine mt-6 inline-flex w-full max-w-[280px] items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-[oklch(0.18_0.06_254)] transition-colors hover:bg-blue-50 md:mt-10 md:w-auto md:max-w-none"
              >
                Let&apos;s build something
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
