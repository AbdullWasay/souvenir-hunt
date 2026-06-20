import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from "motion/react";
import { Menu, X } from "lucide-react";

type NavItem =
  | { kind: "hash"; label: string; hash: string }
  | { kind: "route"; label: string; to: string };

const nav: NavItem[] = [
  { kind: "hash", label: "About", hash: "about" },
  { kind: "hash", label: "Artists", hash: "artists" },
  { kind: "hash", label: "Hunts", hash: "hunts" },
  { kind: "hash", label: "Reviews", hash: "reviews" },
  { kind: "hash", label: "Contact", hash: "contact" },
  { kind: "route", label: "Your Hunt", to: "/your-hunt" },
];

function NavLink({
  item,
  className,
  onClick,
}: {
  item: NavItem;
  className: string;
  onClick?: () => void;
}) {
  if (item.kind === "hash") {
    return (
      <Link to="/" hash={item.hash} className={className} onClick={onClick}>
        {item.label}
      </Link>
    );
  }
  return (
    <Link to={item.to} className={className} onClick={onClick} activeProps={{ className: "text-ink font-medium" }}>
      {item.label}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const progress = useSpring(useTransform(scrollY, [0, 100], [0, 1]), {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
  });

  const shellMaxWidth = useTransform(progress, [0, 1], ["100%", "72rem"]);
  const shellMarginTop = useTransform(progress, [0, 1], [0, 12]);
  const shellPaddingX = useTransform(progress, [0, 1], [0, 16]);
  const barRadius = useTransform(progress, [0, 1], [0, 9999]);
  const barPaddingY = useTransform(progress, [0, 1], [16, 12]);
  const barPaddingX = useTransform(progress, [0, 1], [24, 20]);
  const bgOpacity = useTransform(progress, [0, 1], [0, 0.92]);
  const borderOpacity = useTransform(progress, [0, 1], [0, 0.65]);
  const shadowOpacity = useTransform(progress, [0, 1], [0, 0.12]);
  const blurPx = useTransform(progress, [0, 1], [0, 12]);
  const logoBgOpacity = useTransform(progress, [0, 1], [1, 0]);
  const logoBorderOpacity = useTransform(progress, [0, 1], [0.9, 0]);
  const logoShadowOpacity = useTransform(progress, [0, 1], [0.45, 0]);

  const backgroundColor = useMotionTemplate`rgba(255, 255, 255, ${bgOpacity})`;
  const borderColor = useMotionTemplate`rgba(226, 232, 240, ${borderOpacity})`;
  const boxShadow = useMotionTemplate`0 8px 32px -8px rgba(15, 23, 42, ${shadowOpacity})`;
  const backdropFilter = useMotionTemplate`blur(${blurPx}px)`;
  const logoBg = useMotionTemplate`rgba(255, 255, 255, ${logoBgOpacity})`;
  const logoBorder = useMotionTemplate`rgba(220, 232, 255, ${logoBorderOpacity})`;
  const logoShadow = useMotionTemplate`0 6px 20px -14px rgba(10, 77, 255, ${logoShadowOpacity})`;

  const linkClass =
    "text-sm text-foreground/70 hover:text-ink transition-colors relative group whitespace-nowrap";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <motion.div
        className="pointer-events-auto mx-auto"
        style={{
          maxWidth: shellMaxWidth,
          marginTop: shellMarginTop,
          paddingLeft: shellPaddingX,
          paddingRight: shellPaddingX,
        }}
      >
        <motion.div
          className="relative flex items-center justify-between gap-3 xl:gap-4"
          style={{
            borderRadius: barRadius,
            paddingTop: barPaddingY,
            paddingBottom: barPaddingY,
            paddingLeft: barPaddingX,
            paddingRight: barPaddingX,
            backgroundColor,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor,
            boxShadow,
            backdropFilter,
          }}
        >
          <Link to="/" className="group shrink-0">
            <motion.div
              className="flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2"
              style={{
                backgroundColor: logoBg,
                border: "1px solid",
                borderColor: logoBorder,
                boxShadow: logoShadow,
              }}
            >
              <img
                src="/assets/branding/logo-main.png"
                alt="Souvenir Hunt"
                className="h-7 sm:h-9 w-auto shrink-0 object-contain"
              />
              <span className="font-display font-bold text-[1.05rem] sm:text-[1.3rem] md:text-[1.45rem] leading-none text-primary tracking-tight whitespace-nowrap">
                Souvenir Hunt
              </span>
            </motion.div>
          </Link>

          <nav className="hidden xl:flex absolute left-1/2 -translate-x-1/2 items-center gap-5 2xl:gap-7">
            {nav.map((n) => (
              <NavLink
                key={n.kind === "hash" ? n.hash : n.to}
                item={n}
                className={linkClass}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/hunts"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-ink text-parchment px-4 xl:px-5 py-2.5 text-sm font-medium hover:bg-primary transition-colors"
            >
              Play Hunt
              <span className="w-1.5 h-1.5 rounded-full bg-amber-seal animate-pulse" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="xl:hidden grid place-items-center w-10 h-10 rounded-full border border-border/60 text-ink bg-white/50"
              aria-label="Menu"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:hidden mt-2 rounded-2xl border border-border bg-white/95 backdrop-blur-xl p-5 shadow-paper pointer-events-auto max-h-[70vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {nav.map((n) => (
                <NavLink
                  key={n.kind === "hash" ? n.hash : n.to}
                  item={n}
                  onClick={() => setOpen(false)}
                  className="py-3 text-lg font-display text-ink border-b border-border/50 last:border-0"
                />
              ))}
              <Link
                to="/hunts"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-ink text-parchment px-5 py-3 text-sm font-medium"
              >
                Play Hunt
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </header>
  );
}
