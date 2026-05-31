import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, MapPin, Compass, Sparkles, Quote, Key, Footprints, Star, Send, Milestone, Gift, Brain } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { AnimateIn } from "@/components/site/AnimateIn";
import { Marquee } from "@/components/site/Marquee";
import { HomeHuntsSection } from "@/components/site/HomeHuntsSection";
import { CompassRose } from "@/components/site/CompassRose";
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
    <>
      <Hero />
      <Marquee />
      <About />
      <Artists />
      <HomeHuntsSection hunts={hunts} />
      <Reviews />
      <ContactForm />
      <ContactCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden -mt-28 pt-36">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <img
          src="/assets/branding/hero-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-left-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/78 via-white/58 to-blue-100/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(10,77,255,0.16),transparent_45%),radial-gradient(circle_at_84%_14%,rgba(47,109,255,0.22),transparent_44%)]" />
      </div>

      <div
        aria-hidden
        className="absolute right-[-4%] top-36 z-[2] hidden md:block w-[min(52vw,460px)] h-[min(52vw,460px)] text-primary/80 [filter:drop-shadow(0_0_10px_rgba(10,77,255,0.28))] pointer-events-none spin-slow"
      >
        <CompassRose gentle className="w-full h-full" />
      </div>

      <div aria-hidden className="absolute inset-0 pointer-events-none z-[1]">
        <Key className="absolute top-[18%] right-[14%] w-6 h-6 text-primary/30 float-slow" />
        <Footprints className="absolute bottom-[22%] left-[8%] w-7 h-7 text-primary/25 float-slow" style={{ animationDelay: "-3s" }} />
        <Compass className="absolute top-[55%] right-[30%] w-5 h-5 text-accent/30 spin-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-2 pb-32 relative z-10">
        <AnimateIn y={12} className="stamp text-primary mb-10 bg-white/70 backdrop-blur">
          <Sparkles className="w-3 h-3" /> Made by local artists
        </AnimateIn>

        <h1 className="font-display text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.03em] text-foreground max-w-4xl text-balance">
          {["Explore", "the city.", "Solve clues.", "Keep the story."].map((line, i) => (
            <AnimateIn
              key={line}
              as="span"
              y={40}
              delay={0.15 + i * 0.12}
              className="block"
            >
              {i === 2 ? <span className="text-gradient animate-gradient">{line}</span> : line}
            </AnimateIn>
          ))}
        </h1>

        <AnimateIn delay={0.9} className="mt-12 max-w-3xl">
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-md">
            A clean, self-guided city hunt with hidden stories, playful clues, and a keepsake at the end.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
            <Link to="/hunts" className="btn-shine group inline-flex items-center gap-3 rounded-full bg-primary text-white px-7 py-4 text-sm font-medium shadow-paper hover:shadow-glow transition-all whitespace-nowrap">
              Start a hunt
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/your-hunt" className="group inline-flex items-center gap-3 text-foreground font-medium whitespace-nowrap">
              <span className="relative grid place-items-center w-11 h-11 rounded-full border border-primary/40 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="absolute inset-0 rounded-full pulse-ring" />
                <Play className="w-3.5 h-3.5 ml-0.5 relative" fill="currentColor" />
              </span>
              <span className="ink-underline">Continue your hunt</span>
            </Link>
          </div>
        </AnimateIn>

        {/* Stats strip */}
        <AnimateIn y={30} delay={1.2} className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border shadow-paper">
          {[
            { value: 4, suffix: "", label: "Countries", icon: MapPin },
            { value: 7, suffix: "", label: "Cities mapped", icon: Compass },
            { value: 1, suffix: "", label: "Live hunt", icon: Sparkles },
            { value: 99, suffix: "+", label: "Stories hidden", icon: Quote },
          ].map(({ value, suffix, label, icon: Icon }) => (
            <div
              key={label}
              className="bg-card p-6 group hover:bg-blue-50 hover:-translate-y-1 transition-all relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              <Icon className="w-4 h-4 text-primary mb-4 relative" />
              <p className="font-display text-3xl md:text-4xl text-foreground relative">
                <KpiCounter target={value} suffix={suffix} />
              </p>
              <p className="text-sm text-muted-foreground mt-1 relative">{label}</p>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-hero-gradient group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </AnimateIn>

      </div>
    </section>
  );
}

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
        const progress = currentStep / totalSteps;
        setValue(Math.min(target, Math.round(target * progress)));
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

  return <span ref={ref}>{value}{suffix}</span>;
}

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
    <section id="about" className="py-28 md:py-36 relative scroll-mt-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-background to-background pointer-events-none" />
      <div className="absolute top-0 right-0 w-[min(50vw,520px)] h-[min(50vw,520px)] rounded-full bg-primary/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-36">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary">About</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] text-ink text-balance">
              Sightseeing made <em className="italic font-light text-primary">worth remembering.</em>
            </h2>
            <p className="mt-6 text-foreground/75 leading-relaxed">
              Souvenir Hunt turns real streets into story-led experiences — discovered, not consumed.
            </p>
            <blockquote className="mt-10 border-l-2 border-primary/40 pl-6">
              <p className="font-display text-xl text-ink/90 italic leading-snug">
                &ldquo;The city should feel like a mystery you&apos;re invited into — not a checklist.&rdquo;
              </p>
            </blockquote>
          </Reveal>

          <div className="lg:col-span-7 space-y-0">
            {journey.map((step, i) => (
              <Reveal
                key={step.title}
                x={36}
                delay={i * 0.05}
                className="relative flex gap-6 md:gap-8 pb-12 last:pb-0 group"
              >
                {i < journey.length - 1 && (
                  <span className="absolute left-[23px] md:left-[27px] top-14 bottom-0 w-px bg-gradient-to-b from-primary/40 to-transparent" />
                )}
                <span className="relative z-10 grid place-items-center w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-primary text-white shadow-paper group-hover:scale-105 transition-transform">
                  <step.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </span>
                <article className="flex-1 pt-1 pb-2">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                    Step 0{i + 1}
                  </span>
                  <h3 className="mt-2 font-display text-2xl md:text-3xl text-ink">{step.title}</h3>
                  <p className="mt-3 text-foreground/70 leading-relaxed max-w-lg">{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Artists() {
  const skills = [
    { label: "Storytelling", body: "Narratives rooted in place — written with locals, never generic tour copy." },
    { label: "Puzzle design", body: "Clues paced to feel polished, intuitive, and satisfying to solve on foot." },
    { label: "Souvenir craft", body: "A physical ending designed with the route — local, memorable, and earned." },
  ];

  return (
    <section id="artists" className="py-28 md:py-32 bg-ink text-parchment relative overflow-hidden scroll-mt-32">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="home-artists-grid" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 6 0 L 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#home-artists-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <Reveal className="md:col-span-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-seal">Artists &amp; Makers</p>
          </Reveal>
          <Reveal className="md:col-span-8" delay={0.1}>
            <h2 className="font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.05] text-balance">
              Built with local artists, storytellers, and{" "}
              <em className="italic font-light text-amber-seal">game makers.</em>
            </h2>
            <p className="mt-6 text-lg text-parchment/75 max-w-2xl">
              Each hunt is shaped by people who know how to turn a city into something cultural, playful, and worth remembering.
            </p>
          </Reveal>
        </div>

        <div className="space-y-px bg-parchment/10 rounded-3xl overflow-hidden border border-parchment/10">
          {skills.map((s, i) => (
            <Reveal
              key={s.label}
              y={28}
              delay={i * 0.07}
              className="grid md:grid-cols-12 items-center bg-ink px-6 md:px-10 py-10 md:py-12 group hover:bg-ink/80 transition-colors"
            >
              <span className="md:col-span-1 font-mono text-xs text-amber-seal">0{i + 1}</span>
              <h3 className="md:col-span-4 font-display text-2xl md:text-4xl mt-2 md:mt-0">{s.label}</h3>
              <p className="md:col-span-7 mt-3 md:mt-0 text-parchment/70 text-base md:text-lg leading-relaxed">{s.body}</p>
            </Reveal>
          ))}
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
    <section id="reviews" className="py-28 md:py-36 relative scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-seal">Reviews</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.08] text-ink text-balance">
            Voices from the <em className="italic font-light">trail.</em>
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-5 md:gap-6">
          <Reveal
            as="article"
            y={28}
            className="lg:col-span-7 relative h-full min-h-[320px] rounded-[2rem] overflow-hidden bg-ink text-parchment p-8 md:p-12 flex flex-col justify-between"
          >
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 0%, oklch(0.55 0.2 45 / 0.5), transparent 55%), radial-gradient(circle at 90% 100%, oklch(0.45 0.15 250 / 0.4), transparent 50%)" }} />
              <div className="relative">
                <div className="flex gap-1 text-amber-seal mb-8">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4" fill="currentColor" />
                  ))}
                </div>
                <Quote className="w-12 h-12 text-parchment/30 mb-6" strokeWidth={1} />
                <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] text-balance">
                  &ldquo;{featured.quote}&rdquo;
                </p>
              </div>
              <div className="relative mt-10 flex items-end justify-between gap-4">
                <div>
                  <p className="font-medium text-lg">{featured.name}</p>
                  <p className="text-sm text-parchment/60 mt-1">{featured.role}</p>
                </div>
                <span className="stamp bg-parchment/10 text-parchment border-parchment/20 text-xs shrink-0">
                  <MapPin className="w-3 h-3" /> {featured.city}
                </span>
              </div>
          </Reveal>

          <div className="lg:col-span-5 flex flex-col gap-5 md:gap-6">
            {more.map((r, i) => (
              <Reveal
                key={r.name}
                as="article"
                x={24}
                delay={i * 0.06}
                className={`paper-card rounded-2xl p-7 flex flex-col justify-between h-full ${i === 0 ? "bg-amber-seal/8 border-amber-seal/25" : ""}`}
                style={i === 1 ? { transform: "rotate(0.6deg)" } : undefined}
              >
                  <div>
                    <div className="flex gap-1 text-amber-seal mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5" fill="currentColor" />
                      ))}
                    </div>
                    <p className="font-display text-xl leading-snug text-ink">&ldquo;{r.quote}&rdquo;</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.city}</span>
                  </div>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-dashed border-border px-6 py-5 flex items-center justify-between gap-4 bg-muted/30">
                <p className="text-sm text-foreground/70">4.9 average from early explorers</p>
                <div className="flex -space-x-2">
                  {["M", "S", "D", "+"].map((initial) => (
                    <span
                      key={initial}
                      className="w-8 h-8 rounded-full bg-primary/15 border-2 border-background grid place-items-center text-xs font-mono text-primary"
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
    <section id="contact" className="py-28 md:py-32 relative scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <Reveal className="md:col-span-5">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Contact</p>
            <h2 className="mt-6 font-display text-[clamp(1.5rem,3.5vw,2.75rem)] leading-[1.08] text-ink text-balance">
              Bring a hunt to your <em className="italic font-light text-gradient animate-gradient">city.</em>
            </h2>
            <p className="mt-6 text-foreground/75 max-w-md">
              Partner with us, or send a note. We reply within ~48 hours.
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm">
              <span className="w-10 h-px bg-primary/40" />
              <span className="font-mono text-muted-foreground">hello@souvenirhunt.co</span>
            </div>
          </Reveal>

          <Reveal className="md:col-span-7" delay={0.1}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="paper-card rounded-3xl p-8 md:p-10 space-y-5 relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue-100/70 blur-3xl pointer-events-none" />
              <div className="relative grid md:grid-cols-2 gap-5">
                <HomeField label="Name" placeholder="Your name" />
                <HomeField label="Email" type="email" placeholder="you@city.com" />
              </div>
              <div className="relative">
                <HomeField label="City / Venue" placeholder="Where should we bring a hunt?" />
              </div>
              <label className="block relative">
                <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">Message</span>
                <textarea
                  rows={4}
                  placeholder="Tell us about your idea…"
                  className="mt-2 w-full rounded-2xl bg-muted/60 border border-border px-5 py-4 text-ink outline-none focus:border-primary transition-colors resize-none"
                />
              </label>
              <button
                type="submit"
                className="btn-shine relative group inline-flex items-center gap-3 rounded-full bg-primary text-white px-7 py-4 text-sm font-medium hover:shadow-glow transition-shadow"
              >
                {sent ? "Sent — we'll be in touch" : "Send message"}
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-[oklch(0.18_0.06_254)] text-white p-10 md:p-20">
            {/* mesh + grid */}
            <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(at 20% 20%, oklch(0.5 0.22 252 / 0.5), transparent 50%), radial-gradient(at 80% 80%, oklch(0.58 0.2 250 / 0.35), transparent 55%)" }} />
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
            <div aria-hidden className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full border border-white/10 spin-slow">
              <div className="absolute inset-8 rounded-full border border-white/10" />
              <div className="absolute inset-20 rounded-full border border-white/10" />
            </div>

            <div className="relative">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/60">Partner with us — 05</p>
              <h2 className="mt-6 font-display text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.05] text-balance max-w-3xl">
                Create something <em className="italic font-light text-gradient animate-gradient">worth discovering.</em>
              </h2>
              <p className="mt-8 text-lg text-white/75 max-w-xl">
                Want to partner, create, or launch a hunt? Bring your city, your artwork, or your venue into the experience. We're building premium clue hunts shaped by local people.
              </p>
              <Link to="/" hash="contact" className="btn-shine mt-10 inline-flex items-center gap-3 rounded-full bg-white text-[oklch(0.18_0.06_254)] px-7 py-4 text-sm font-medium hover:bg-blue-50 transition-colors">
                Let&apos;s build something
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
