import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { ArrowRight, Play, MapPin, Compass, Sparkles, Quote, Key, Footprints, ChevronLeft, ChevronRight, Star, Send } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/site/Marquee";
import { SpotlightRow } from "@/components/site/SpotlightRow";

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
      <ContactForm />
      <ContactCTA />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yMap = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const yBlob = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-soft">
      {/* Animated background blobs */}
      <motion.div aria-hidden style={{ y: yBlob }} className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-blue-300/40 blur-3xl animate-blob" />
        <div className="absolute top-40 -right-40 w-[520px] h-[520px] rounded-full bg-blue-500/30 blur-3xl animate-blob" style={{ animationDelay: "-4s" }} />
        <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-blue-100 blur-3xl animate-blob" style={{ animationDelay: "-8s" }} />
      </motion.div>
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      {/* Floating mystery glyphs */}
      <motion.div aria-hidden style={{ y: yMap, opacity }} className="absolute inset-0 pointer-events-none">
        <Key className="absolute top-[18%] right-[14%] w-6 h-6 text-primary/30 float-slow" />
        <Footprints className="absolute bottom-[22%] left-[8%] w-7 h-7 text-primary/25 float-slow" style={{ animationDelay: "-3s" }} />
        <Compass className="absolute top-[55%] right-[30%] w-5 h-5 text-accent/30 spin-slow" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-32 relative">


        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="stamp text-primary mb-10 bg-white/70 backdrop-blur">
          <Sparkles className="w-3 h-3" /> Made by local artists
        </motion.div>

        <motion.h1 style={{ y: yTitle }} className="font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.92] tracking-[-0.04em] text-foreground max-w-5xl text-balance">
          {["Explore", "the city.", "Solve clues.", "Keep the story."].map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {i === 2 ? <span className="text-gradient animate-gradient">{line}</span> : line}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-12 max-w-3xl"
        >
          <p className="text-lg text-foreground/80 leading-relaxed max-w-md">
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
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border shadow-paper"
        >
          {[
            { k: "04", v: "Countries", icon: MapPin },
            { k: "07", v: "Cities mapped", icon: Compass },
            { k: "01", v: "Live hunt", icon: Sparkles },
            { k: "∞", v: "Stories hidden", icon: Quote },
          ].map(({ k, v, icon: Icon }) => (
            <motion.div
              key={v}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-card p-6 group hover:bg-blue-50 transition-colors relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              <Icon className="w-4 h-4 text-primary mb-4 relative" />
              <p className="font-display text-5xl text-foreground relative">{k}</p>
              <p className="text-sm text-muted-foreground mt-1 relative">{v}</p>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-hero-gradient group-hover:w-full transition-all duration-500" />
            </motion.div>
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
  const crafts = [
    {
      label: "Storytelling",
      body: "Narratives that feel rooted in place rather than copied from a template.",
      meta: "Writers · Historians · Locals",
      glyph: (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M10 14 L32 8 L54 14 L54 54 L32 48 L10 54 Z" />
          <path d="M32 8 L32 48" />
          <path d="M16 22 L26 24 M16 30 L26 32 M16 38 L26 40" strokeLinecap="round" />
          <path d="M38 22 L48 20 M38 30 L48 28 M38 38 L48 36" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Puzzle design",
      body: "Clues paced to feel polished, intuitive, and satisfying to solve.",
      meta: "Game designers · Cryptics · Testers",
      glyph: (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M8 12 H28 V24 a6 6 0 0 0 12 0 V12 H56 V32 a6 6 0 0 1 0 12 V56 H40 V44 a6 6 0 0 1 -12 0 V56 H8 a6 6 0 0 1 0 -12 V32 a6 6 0 0 0 0 -20 Z" />
          <circle cx="32" cy="32" r="2.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "Souvenir craft",
      body: "A physical ending that feels local, memorable, and earned.",
      meta: "Makers · Printers · Ceramicists",
      glyph: (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="32" cy="28" r="18" />
          <circle cx="32" cy="28" r="11" />
          <path d="M32 10 L32 4 M14 28 L8 28 M50 28 L56 28 M32 46 L32 52" strokeLinecap="round" />
          <path d="M24 50 L20 60 L32 56 L44 60 L40 50" />
        </svg>
      ),
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <section className="py-32 bg-ink text-parchment relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 14 }).map((_, i) => (
            <path
              key={i}
              d={`M0 ${80 + i * 38} Q200 ${40 + i * 38} 400 ${100 + i * 38} T800 ${70 + i * 38}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          ))}
        </svg>
      </div>
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.58 0.2 250 / 0.35), transparent 70%)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <Reveal className="md:col-span-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-blue-300">Artists &amp; Makers — 02</p>
          </Reveal>
          <Reveal className="md:col-span-8" delay={0.1}>
            <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1] text-balance">
              Built with local artists, storytellers, and{" "}
              <em className="italic font-light text-gradient animate-gradient">game makers.</em>
            </h2>
            <p className="mt-8 text-lg text-parchment/70 max-w-2xl">
              Each hunt is shaped by people who know how to turn a city into something cultural, playful, and worth remembering.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-3">
            {crafts.map((c, i) => {
              const isActive = active === i;
              return (
                <motion.button
                  key={c.label}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`relative w-full text-left rounded-2xl border overflow-hidden transition-colors duration-500 ${
                    isActive
                      ? "border-blue-300/50 bg-gradient-to-r from-blue-500/15 via-blue-700/10 to-transparent"
                      : "border-parchment/10 bg-parchment/[0.02] hover:border-parchment/25"
                  }`}
                  initial={false}
                  animate={{ paddingTop: isActive ? 28 : 20, paddingBottom: isActive ? 28 : 20 }}
                >
                  <motion.span
                    aria-hidden
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-300 to-blue-600"
                    initial={false}
                    animate={{ scaleY: isActive ? 1 : 0.15, opacity: isActive ? 1 : 0.4 }}
                    style={{ transformOrigin: "top" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 md:px-10">
                    <span className={`font-mono text-xs tracking-widest ${isActive ? "text-blue-300" : "text-parchment/40"}`}>
                      / 0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl">{c.label}</h3>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key="exp"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="mt-3 text-parchment/75 max-w-xl">{c.body}</p>
                            <p className="mt-3 font-mono text-[11px] tracking-[0.2em] uppercase text-parchment/40">{c.meta}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.div
                      animate={{ rotate: isActive ? 45 : 0, scale: isActive ? 1.1 : 1 }}
                      transition={{ duration: 0.4 }}
                      className={`w-10 h-10 rounded-full grid place-items-center border ${isActive ? "border-blue-300 text-blue-300" : "border-parchment/20 text-parchment/40"}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] rounded-3xl border border-parchment/15 overflow-hidden bg-gradient-to-br from-blue-900/40 via-ink to-ink">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(oklch(0.78 0.12 245 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 245 / 0.15) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-8 rounded-full border border-dashed border-blue-300/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-20 rounded-full border border-blue-300/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.05, rotate: 6 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 grid place-items-center text-blue-300"
                >
                  <div className="w-1/2 h-1/2">{crafts[active].glyph}</div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between border-t border-parchment/10 bg-ink/40 backdrop-blur-sm">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-parchment/40">Now showing</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={active}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="font-display text-xl mt-1"
                    >
                      {crafts[active].label}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <span className="font-mono text-xs text-blue-300">0{active + 1} / 0{crafts.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { quote: "It felt like exploring Split inside a mystery novel. Clean, easy, and actually memorable.", name: "Mia & Luka", role: "Weekend travelers", city: "Zagreb" },
    { quote: "Way better than a normal walking tour. The souvenir at the end made it feel earned.", name: "Sophie", role: "Solo traveler", city: "Paris" },
    { quote: "Simple on mobile, fun to solve, and polished enough to feel premium.", name: "Daniel + friends", role: "Group of 4", city: "London" },
    { quote: "We spent three hours wandering with grins on our faces. Genuine discovery.", name: "Ana", role: "Local guide", city: "Split" },
  ];
  const [i, setI] = useState(0);
  const go = (dir: number) => setI((p) => (p + dir + reviews.length) % reviews.length);
  const r = reviews[i];
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <Reveal className="md:col-span-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Reviews — 03</p>
          </Reveal>
          <Reveal className="md:col-span-8" delay={0.1}>
            <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1] text-ink text-balance">
              People remember the <em className="italic font-light">story</em>, not just the route.
            </h2>
          </Reveal>
        </div>

        <Reveal>
          <div className="relative paper-card rounded-[2rem] p-8 md:p-16 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-200/50 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
            <Quote className="w-14 h-14 text-accent/40 mb-8 relative" strokeWidth={1} />
            <div className="relative min-h-[220px] md:min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-2xl md:text-4xl leading-snug text-ink text-balance">
                    "{r.quote}"
                  </p>
                  <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
                    <div>
                      <div className="flex gap-1 text-accent mb-3">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className="w-4 h-4" fill="currentColor" />
                        ))}
                      </div>
                      <p className="font-medium text-ink">{r.name}</p>
                      <p className="text-sm text-muted-foreground">{r.role} · {r.city}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-12 flex items-center justify-between relative">
              <div className="flex gap-2">
                {reviews.map((_, j) => (
                  <button
                    key={j}
                    onClick={() => setI(j)}
                    aria-label={`Review ${j + 1}`}
                    className={`h-1.5 rounded-full transition-all ${j === i ? "w-10 bg-primary" : "w-4 bg-border hover:bg-primary/40"}`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => go(-1)} aria-label="Previous" className="w-12 h-12 rounded-full border border-border hover:border-primary hover:text-primary text-ink grid place-items-center transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => go(1)} aria-label="Next" className="w-12 h-12 rounded-full bg-primary text-white grid place-items-center hover:shadow-glow transition-shadow">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <Reveal className="md:col-span-5">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Get in touch — 04</p>
            <h2 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[1] text-ink text-balance">
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
            <motion.div aria-hidden
              animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full border border-white/10"
            >
              <div className="absolute inset-8 rounded-full border border-white/10" />
              <div className="absolute inset-20 rounded-full border border-white/10" />
            </motion.div>

            <div className="relative">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/60">Partner with us — 05</p>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] text-balance max-w-4xl">
                Create something <em className="italic font-light text-gradient animate-gradient">worth discovering.</em>
              </h2>
              <p className="mt-8 text-lg text-white/75 max-w-xl">
                Want to partner, create, or launch a hunt? Bring your city, your artwork, or your venue into the experience. We're building premium clue hunts shaped by local people.
              </p>
              <Link to="/contact" className="btn-shine mt-10 inline-flex items-center gap-3 rounded-full bg-white text-[oklch(0.18_0.06_254)] px-7 py-4 text-sm font-medium hover:bg-blue-50 transition-colors">
                Let's build something
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
