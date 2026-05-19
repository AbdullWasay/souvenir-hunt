import { Star } from "lucide-react";

const items = [
  "Hidden stories",
  "Real streets",
  "Local artists",
  "A keepsake earned",
  "Self-guided",
  "Designed slowly",
  "Made for wanderers",
  "Premium clue hunts",
];

export function Marquee() {
  return (
    <div className="border-y border-border bg-ink text-parchment overflow-hidden py-5">
      <div className="flex marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <div key={i} className="flex items-center gap-6 px-8 font-display text-3xl md:text-4xl">
            <span>{t}</span>
            <Star className="w-4 h-4 text-amber-seal shrink-0" fill="currentColor" />
          </div>
        ))}
      </div>
    </div>
  );
}
