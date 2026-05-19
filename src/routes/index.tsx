import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Play, MapPin, Compass, Sparkles, Quote } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/site/Marquee";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Souvenir Hunt — Self-guided city hunts with a keepsake" },
      { name: "description", content: "A clean self-guided city hunt with hidden stories, playful clues, and a keepsake at the end." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Artists />
      <Reviews />
      <ContactCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-32 relative">
        {/* Decorative map */}
        <svg className="absolute right-0 top-10 w-[520px] h-[520px] opacity-[0.18] pointer-events-none hidden md:block" viewBox="0 0 400 400" fill="none">
          <motion.path
            d="M40 320 Q 120 180, 200 220 T 360 80"
            stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, ease: "easeInOut" }}
            className="text-ink"
          />
          <motion.circle cx="40" cy="320" r="6" fill="currentColor" className="text-crimson-seal"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} />
          <motion.circle cx="200" cy="220" r="5" fill="currentColor" className="text-amber-seal"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} />
          <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.8 }}>
            <circle cx="360" cy="80" r="12" fill="currentColor" className="text-ink" />
            <text x="360" y="84" textAnchor="middle" fontSize="10" fill="var(--parchment)" fontFamily="serif">X</text>
          </motion.g>
          <g className="text-ink/30" fontFamily="serif" fontSize="8" fill="currentColor">
            <text x="60" y="350">START</text>
            <text x="370" y="60">END</text>
          </g>
        </svg>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="stamp text-ink/70 mb-10">
          <Sparkles className="w-3 h-3" /> Made by local artists
        </motion.div>

        <h1 className="font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.92] tracking-[-0.04em] text-ink max-w-5xl text-balance">
          {["Explore", "the city.", "Solve clues.", "Keep the story."].map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {i === 2 ? <em className="italic font-light text-accent">{line}</em> : line}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-12 grid md:grid-cols-2 gap-10 max-w-3xl"
        >
          <p className="text-lg text-foreground/80 leading-relaxed max-w-md">
            A clean, self-guided city hunt with hidden stories, playful clues, and a keepsake at the end.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/hunts" className="group inline-flex items-center gap-3 rounded-full bg-ink text-parchment px-7 py-4 text-sm font-medium hover:bg-accent transition-all">
              Start a hunt
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/your-hunt" className="group inline-flex items-center gap-3 text-ink font-medium">
              <span className="grid place-items-center w-10 h-10 rounded-full border border-ink/30 group-hover:bg-ink group-hover:text-parchment transition-colors">
                <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
              </span>
              <span className="ink-underline">Continue your hunt</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border"
        >
          {[
            { k: "04", v: "Countries", icon: MapPin },
            { k: "07", v: "Cities mapped", icon: Compass },
            { k: "01", v: "Live hunt", icon: Sparkles },
            { k: "∞", v: "Stories hidden", icon: Quote },
          ].map(({ k, v, icon: Icon }) => (
            <div key={v} className="bg-card p-6 group hover:bg-parchment transition-colors">
              <Icon className="w-4 h-4 text-accent mb-4" />
              <p className="font-display text-5xl text-ink">{k}</p>
              <p className="text-sm text-muted-foreground mt-1">{v}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  const cards = [
    { title: "Real places, not generic routes", body: "Walk somewhere that matters instead of following another standard tour path.", num: "01" },
    { title: "A calmer kind of puzzle", body: "The challenge is designed to feel elegant and rewarding, never noisy or random.", num: "02" },
    { title: "A souvenir tied to the journey", body: "The final reward feels connected to the route you just completed.", num: "03" },
  ];
  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <Reveal className="md:col-span-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">About — 01</p>
          </Reveal>
          <Reveal className="md:col-span-8" delay={0.1}>
            <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1] text-ink text-balance">
              Sightseeing made <em className="italic font-light">worth remembering.</em>
            </h2>
            <p className="mt-8 text-lg text-foreground/75 max-w-2xl">
              Souvenir Hunt turns real streets into story-led city experiences. We guide you through meaningful locations, hidden details, and memorable clues so the city feels discovered rather than consumed. At the end, you leave with something physical and worth keeping.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.num} delay={i * 0.1}>
              <article className="paper-card grain rounded-3xl p-8 h-full flex flex-col group hover:-translate-y-1 transition-transform duration-500">
                <div className="flex items-start justify-between mb-12">
                  <span className="font-mono text-xs tracking-widest text-muted-foreground">{c.num} / 03</span>
                  <span className="w-10 h-10 rounded-full border border-border grid place-items-center text-ink group-hover:bg-ink group-hover:text-parchment transition-colors">
                    <ArrowRight className="w-4 h-4 -rotate-45" />
                  </span>
                </div>
                <h3 className="font-display text-2xl text-ink leading-tight mb-4">{c.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{c.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Artists() {
  const skills = [
    { label: "Storytelling", body: "Narratives that feel rooted in place rather than copied from a template." },
    { label: "Puzzle design", body: "Clues paced to feel polished, intuitive, and satisfying to solve." },
    { label: "Souvenir craft", body: "A physical ending that feels local, memorable, and earned." },
  ];
  return (
    <section className="py-32 bg-ink text-parchment relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <Reveal className="md:col-span-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-seal">Artists &amp; Makers — 02</p>
          </Reveal>
          <Reveal className="md:col-span-8" delay={0.1}>
            <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1] text-balance">
              Built with local artists, storytellers, and <em className="italic font-light text-amber-seal">game makers.</em>
            </h2>
            <p className="mt-8 text-lg text-parchment/70 max-w-2xl">
              Each hunt is shaped by people who know how to turn a city into something cultural, playful, and worth remembering.
            </p>
          </Reveal>
        </div>

        <div className="space-y-px bg-parchment/10 rounded-3xl overflow-hidden border border-parchment/10">
          {skills.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="grid md:grid-cols-12 items-center bg-ink px-6 md:px-10 py-10 group hover:bg-ink/70 transition-colors">
                <span className="md:col-span-1 font-mono text-xs text-amber-seal">0{i + 1}</span>
                <h3 className="md:col-span-4 font-display text-3xl mt-2 md:mt-0">{s.label}</h3>
                <p className="md:col-span-6 mt-3 md:mt-0 text-parchment/70">{s.body}</p>
                <ArrowRight className="hidden md:block md:col-span-1 w-5 h-5 ml-auto opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { quote: "It felt like exploring Split inside a mystery novel. Clean, easy, and actually memorable.", name: "Mia & Luka", role: "Weekend travelers" },
    { quote: "Way better than a normal walking tour. The souvenir at the end made it feel earned.", name: "Sophie", role: "Solo traveler" },
    { quote: "Simple on mobile, fun to solve, and polished enough to feel premium.", name: "Daniel + friends", role: "Group of 4" },
  ];
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <Reveal className="md:col-span-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Reviews — 03</p>
          </Reveal>
          <Reveal className="md:col-span-8" delay={0.1}>
            <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1] text-ink text-balance">
              People remember the <em className="italic font-light">story</em>, not just the route.
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1}>
              <article className="paper-card rounded-3xl p-8 h-full flex flex-col">
                <Quote className="w-8 h-8 text-accent mb-6" strokeWidth={1} />
                <p className="font-display text-xl leading-snug text-ink flex-1">"{r.quote}"</p>
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="font-medium text-ink">{r.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{r.role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-seal via-accent to-crimson-seal text-parchment p-10 md:p-20 grain">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-parchment/10 blur-3xl" />
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-parchment/80">Contact — 04</p>
            <h2 className="mt-6 font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] text-balance max-w-4xl">
              Create something <em className="italic font-light">worth discovering.</em>
            </h2>
            <p className="mt-8 text-lg text-parchment/85 max-w-xl">
              Want to partner, create, or launch a hunt? Bring your city, your artwork, or your venue into the experience. We're building premium clue hunts shaped by local people.
            </p>
            <Link to="/contact" className="mt-10 inline-flex items-center gap-3 rounded-full bg-ink text-parchment px-7 py-4 text-sm font-medium hover:bg-parchment hover:text-ink transition-colors">
              Let's build something
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
