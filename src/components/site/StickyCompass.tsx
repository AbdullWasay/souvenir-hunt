import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRouterState } from "@tanstack/react-router";
import { CompassRose } from "./CompassRose";

/**
 * Wander path stays in left/right gutters only (never over centered content).
 * Progress is heavily spring-lagged so movement feels very slow vs scroll.
 */
const HOME_FRAMES = {
  progress: [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 0.96, 1],
  left: [90, 8, 88, 10, 90, 8, 88, 10, 90, 8],
  top: [12, 20, 32, 44, 54, 64, 74, 82, 90, 96],
  opacity: [0.42, 0.38, 0.42, 0.36, 0.4, 0.34, 0.38, 0.34, 0.36, 0.32],
  scale: [0.88, 0.86, 0.88, 0.84, 0.86, 0.84, 0.86, 0.82, 0.84, 0.8],
};

/** Very heavy spring — compass drifts long after you stop scrolling. */
const SLOW_SPRING = { stiffness: 3, damping: 42, mass: 6, restDelta: 0.0005 };

type PageVariant = {
  left: number[];
  top: number[];
  opacity: number[];
  scale?: number[];
  size: string;
  rotateRange: [number, number];
  spinDuration: number;
  counterSpin: boolean;
};

const pageVariants: Record<string, PageVariant> = {
  "/hunts": {
    left: [88, 10, 86, 12, 88],
    top: [14, 38, 58, 78, 92],
    opacity: [0.2, 0.18, 0.2, 0.16, 0.14],
    size: "min(30vh, 280px)",
    rotateRange: [0, 120],
    spinDuration: 160,
    counterSpin: true,
  },
  "/your-hunt": {
    left: [10, 88, 12, 86, 10],
    top: [16, 42, 60, 80, 94],
    opacity: [0.2, 0.18, 0.2, 0.16, 0.14],
    size: "min(28vh, 260px)",
    rotateRange: [0, 90],
    spinDuration: 140,
    counterSpin: false,
  },
};

function matchPageVariant(pathname: string): PageVariant | "home" {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/hunts/")) return pageVariants["/hunts"];
  return pageVariants[pathname] ?? pageVariants["/hunts"];
}

function WanderingCompass({
  frames,
  size,
  rotateRange,
  spinDuration,
  counterSpin,
  gentle = true,
}: {
  frames: {
    progress: number[];
    left: number[];
    top: number[];
    opacity: number[];
    scale: number[];
  };
  size: string;
  rotateRange: [number, number];
  spinDuration: number;
  counterSpin: boolean;
  gentle?: boolean;
}) {
  const { scrollYProgress } = useScroll();
  const eased = useTransform(scrollYProgress, (p) => p ** 0.75);
  const smooth = useSpring(eased, SLOW_SPRING);

  const left = useTransform(smooth, frames.progress, frames.left);
  const top = useTransform(smooth, frames.progress, frames.top);
  const opacity = useTransform(smooth, frames.progress, frames.opacity);
  const scale = useTransform(smooth, frames.progress, frames.scale);

  const leftPos = useTransform(left, (v) => `${v}%`);
  const topPos = useTransform(top, (v) => `${v}%`);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] hidden md:block min-h-[100vh]"
    >
      <motion.div
        className="absolute text-primary/[0.42]"
        style={{
          left: leftPos,
          top: topPos,
          x: "-50%",
          y: "-50%",
          width: size,
          height: size,
          opacity,
          scale,
        }}
      >
        <CompassRose
          scrollYProgress={smooth}
          rotateRange={rotateRange}
          spinDuration={spinDuration}
          counterSpin={counterSpin}
          gentle={gentle}
          className="w-full h-full"
        />
      </motion.div>
    </motion.div>
  );
}

export function StickyCompass() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin")) return null;

  if (pathname === "/") {
    return (
      <WanderingCompass
        frames={HOME_FRAMES}
        size="min(30vh, 280px)"
        rotateRange={[0, 90]}
        spinDuration={200}
        counterSpin={false}
        gentle
      />
    );
  }

  const v = matchPageVariant(pathname);
  if (v === "home") return null;

  const progress = [0, 0.25, 0.5, 0.75, 1];
  return (
    <WanderingCompass
      frames={{
        progress,
        left: v.left,
        top: v.top,
        opacity: v.opacity,
        scale: v.scale ?? [0.88, 0.86, 0.84, 0.82, 0.8],
      }}
      size={v.size}
      rotateRange={v.rotateRange}
      spinDuration={v.spinDuration}
      counterSpin={v.counterSpin}
      gentle
    />
  );
}
