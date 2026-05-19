import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Souvenir Hunt" },
      { name: "description", content: "Sightseeing made worth remembering. Story-led self-guided city experiences." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const cards = [
    { num: "01", title: "Real places, not generic routes", body: "Walk somewhere that matters instead of following another standard tour path." },
    { num: "02", title: "A calmer kind of puzzle", body: "The challenge is designed to feel elegant and rewarding, never noisy or random." },
    { num: "03", title: "A souvenir tied to the journey", body: "The final reward feels connected to the route you just completed." },
  ];
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="grid md:grid-cols-12 gap-12 mb-20">
        <Reveal className="md:col-span-4">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">About</p>
        </Reveal>
        <Reveal className="md:col-span-8" delay={0.1}>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] text-ink text-balance">
            Sightseeing made <em className="italic font-light">worth remembering.</em>
          </h1>
          <p className="mt-8 text-lg text-foreground/75 max-w-2xl">
            Souvenir Hunt turns real streets into story-led city experiences. We guide you through meaningful locations, hidden details, and memorable clues so the city feels discovered rather than consumed. At the end, you leave with something physical and worth keeping.
          </p>
        </Reveal>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <Reveal key={c.num} delay={i * 0.1}>
            <article className="paper-card grain rounded-3xl p-8 h-full">
              <span className="font-mono text-xs tracking-widest text-muted-foreground">{c.num} / 03</span>
              <h3 className="mt-10 font-display text-2xl text-ink leading-tight">{c.title}</h3>
              <p className="mt-4 text-foreground/70 leading-relaxed">{c.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
