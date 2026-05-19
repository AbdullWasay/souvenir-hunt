import { createFileRoute } from "@tanstack/react-router";
import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Souvenir Hunt" },
      { name: "description", content: "People remember the story, not just the route." },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const reviews = [
    { quote: "It felt like exploring Split inside a mystery novel. Clean, easy, and actually memorable.", name: "Mia & Luka", role: "Weekend travelers" },
    { quote: "Way better than a normal walking tour. The souvenir at the end made it feel earned.", name: "Sophie", role: "Solo traveler" },
    { quote: "Simple on mobile, fun to solve, and polished enough to feel premium.", name: "Daniel + friends", role: "Group of 4" },
  ];
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="grid md:grid-cols-12 gap-12 mb-20">
        <Reveal className="md:col-span-4">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Reviews</p>
        </Reveal>
        <Reveal className="md:col-span-8" delay={0.1}>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] text-ink text-balance">
            People remember the <em className="italic font-light">story</em>, not just the route.
          </h1>
        </Reveal>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.1}>
            <article className="paper-card rounded-3xl p-8 h-full flex flex-col">
              <div className="flex gap-1 mb-6 text-amber-seal">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4" fill="currentColor" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-accent mb-4" strokeWidth={1} />
              <p className="font-display text-2xl leading-snug text-ink flex-1">"{r.quote}"</p>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="font-medium text-ink">{r.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{r.role}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
