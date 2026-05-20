import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Compass } from "lucide-react";

const nav = [
  { to: "/hunts", label: "Hunts" },
  { to: "/your-hunt", label: "Your Hunt" },
  { to: "/about", label: "About" },
  { to: "/artists", label: "Artists" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`flex items-center justify-between gap-4 rounded-full px-4 sm:px-6 py-3 transition-all duration-500 ${scrolled ? "border border-border/70 bg-white/70 backdrop-blur-xl shadow-paper" : "border border-transparent bg-transparent"}`}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative grid place-items-center w-9 h-9 rounded-full bg-ink text-parchment overflow-hidden">
              <Compass className="w-4.5 h-4.5 transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.5} />
            </span>
            <span className="font-display text-xl tracking-tight text-ink">Souvenir Hunt</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm text-foreground/70 hover:text-ink transition-colors relative group"
                activeProps={{ className: "text-ink font-medium" }}
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-ink transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/hunts"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-ink text-parchment px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              Play Hunt
              <span className="w-1.5 h-1.5 rounded-full bg-amber-seal animate-pulse" />
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden grid place-items-center w-10 h-10 rounded-full border border-border text-ink"
              aria-label="Menu"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 rounded-3xl border border-border bg-card p-6 shadow-paper">
            <div className="flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="py-3 text-lg font-display text-ink border-b border-border/50 last:border-0"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
