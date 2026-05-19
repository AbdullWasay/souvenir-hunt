import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/artists")({
  head: () => ({
    meta: [
      { title: "Artists & Makers — Souvenir Hunt" },
      { name: "description", content: "Built with local artists, storytellers, and game makers." },
    ],
  }),
  component: ArtistsPage,
});

function ArtistsPage() {
  const skills = [
    { label: "Storytelling", body: "Narratives that feel rooted in place rather than copied from a template." },
    { label: "Puzzle design", body: "Clues paced to feel polished, intuitive, and satisfying to solve." },
    { label: "Souvenir craft", body: "A physical ending that feels local, memorable, and earned." },
  ];
  return (
    <div className="bg-ink text-parchment -mt-28 pt-44 pb-32 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid2" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 6 0 L 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid2)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <header className="grid md:grid-cols-12 gap-12 mb-24">
          <Reveal className="md:col-span-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-seal">Artists &amp; Makers</p>
          </Reveal>
          <Reveal className="md:col-span-8" delay={0.1}>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] text-balance">
              Built with local artists, storytellers, and <em className="italic font-light text-amber-seal">game makers.</em>
            </h1>
            <p className="mt-8 text-lg text-parchment/75 max-w-2xl">
              Each hunt is shaped by people who know how to turn a city into something cultural, playful, and worth remembering.
            </p>
          </Reveal>
        </header>

        <div className="space-y-px bg-parchment/10 rounded-3xl overflow-hidden border border-parchment/10">
          {skills.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="grid md:grid-cols-12 items-center bg-ink px-6 md:px-10 py-12 group hover:bg-ink/70 transition-colors">
                <span className="md:col-span-1 font-mono text-xs text-amber-seal">0{i + 1}</span>
                <h3 className="md:col-span-4 font-display text-4xl mt-2 md:mt-0">{s.label}</h3>
                <p className="md:col-span-6 mt-3 md:mt-0 text-parchment/70 text-lg">{s.body}</p>
                <ArrowRight className="hidden md:block md:col-span-1 w-5 h-5 ml-auto opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
