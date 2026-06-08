import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

const homeSections = [
  { hash: "about", label: "About" },
  { hash: "artists", label: "Artists" },
  { hash: "hunts", label: "Hunts" },
  { hash: "reviews", label: "Reviews" },
  { hash: "contact", label: "Contact" },
] as const;

type FooterProps = {
  variant?: "default" | "play";
};

export function Footer({ variant = "default" }: FooterProps) {
  if (variant === "play") {
    return (
      <footer className="mt-10 border-t border-border bg-ink text-parchment relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <svg className="absolute -top-16 -right-16 w-[320px] h-[320px]" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" />
            <path d="M20 100 L180 100 M100 20 L100 180" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative max-w-[420px] mx-auto px-6 py-10 text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-parchment text-ink">
              <Compass className="w-4 h-4" strokeWidth={1.5} />
            </span>
            <span className="font-display text-xl">Souvenir Hunt</span>
          </Link>
          <p className="mt-4 font-display text-lg leading-snug text-parchment/90">
            Sightseeing made worth remembering.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-parchment/75">
            <li>
              <Link to="/hunts" className="hover:text-amber-seal transition-colors">
                All hunts
              </Link>
            </li>
            <li>
              <Link to="/your-hunt" className="hover:text-amber-seal transition-colors">
                Your hunt
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-amber-seal transition-colors">
                Home
              </Link>
            </li>
          </ul>
          <div className="mt-8 pt-6 border-t border-parchment/15 flex flex-col gap-2 text-[10px] text-parchment/50 font-mono uppercase tracking-wider">
            <p>© {new Date().getFullYear()} Souvenir Hunt</p>
            <p>Walk slower · See more</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-32 border-t border-border bg-ink text-parchment relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <svg className="absolute -top-20 -right-20 w-[600px] h-[600px]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" />
          <path d="M20 100 L180 100 M100 20 L100 180" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-parchment text-ink">
                <Compass className="w-5 h-5" strokeWidth={1.5} />
              </span>
              <span className="font-display text-2xl">Souvenir Hunt</span>
            </Link>
            <p className="mt-6 font-display text-2xl leading-tight text-parchment/90 max-w-sm">
              Sightseeing made worth remembering.
            </p>
            <div className="stamp mt-8 text-parchment/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-seal" /> Est. for wanderers
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-parchment/50 mb-5">Play</p>
            <ul className="space-y-3 text-parchment/80">
              <li><Link to="/hunts" className="hover:text-amber-seal transition-colors">All hunts</Link></li>
              <li><Link to="/your-hunt" className="hover:text-amber-seal transition-colors">Your hunt</Link></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.2em] text-parchment/50 mb-5">On this page</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-parchment/80">
              {homeSections.map((s) => (
                <li key={s.hash}>
                  <Link to="/" hash={s.hash} className="hover:text-amber-seal transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-parchment/15 flex flex-wrap justify-between gap-4 text-xs text-parchment/50 font-mono uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Souvenir Hunt</p>
          <p>Walk slower · See more</p>
        </div>
      </div>
    </footer>
  );
}
