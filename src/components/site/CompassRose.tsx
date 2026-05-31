import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";

interface Props {
  scrollYProgress?: MotionValue<number>;
  className?: string;
  rotateRange?: [number, number];
  spinDuration?: number;
  counterSpin?: boolean;
  /** Softer strokes + slower scroll-linked rotation */
  gentle?: boolean;
}

/** Cartographer's compass rose — scroll-linked rotation varies per page. */
export function CompassRose({
  scrollYProgress,
  className,
  rotateRange = [0, 540],
  spinDuration = 40,
  counterSpin = false,
  gentle = false,
}: Props) {
  const { scrollYProgress: defaultProgress } = useScroll();
  const source = scrollYProgress ?? defaultProgress;
  const rotateRaw = useTransform(source, [0, 1], rotateRange);
  const rotate = useSpring(
    rotateRaw,
    gentle
      ? { stiffness: 8, damping: 32, mass: 2.5 }
      : { stiffness: 80, damping: 24, mass: 0.5 },
  );
  const strokeMul = gentle ? 1.05 : 1;
  const counter = useTransform(rotate, (r) => (counterSpin ? r * 0.35 : -r * 0.2));

  const ticks = Array.from({ length: 72 }, (_, i) => i);

  return (
    <motion.svg
      viewBox="-200 -200 400 400"
      className={className}
      fill="none"
      aria-hidden
      animate={{ rotate: counterSpin ? [0, 360] : [0, -360] }}
      transition={{ duration: spinDuration, repeat: Infinity, ease: "linear" }}
    >
      <motion.g style={{ rotate }}>
        <circle r="180" stroke="currentColor" strokeWidth="0.8" opacity={0.35 * strokeMul} />
        <circle r="140" stroke="currentColor" strokeWidth="0.6" opacity={0.25 * strokeMul} strokeDasharray="2 4" />
        <circle r="95" stroke="currentColor" strokeWidth="0.6" opacity={0.3 * strokeMul} />
        <circle r="55" stroke="currentColor" strokeWidth="0.6" opacity={0.3 * strokeMul} />

        {ticks.map((i) => {
          const angle = i * 5;
          const isCardinal = i % 18 === 0;
          const isMajor = i % 6 === 0;
          const inner = isCardinal ? 150 : isMajor ? 158 : 162;
          const outer = 170;
          return (
            <line
              key={i}
              x1="0"
              y1={-inner}
              x2="0"
              y2={-outer}
              stroke="currentColor"
              strokeWidth={isCardinal ? 1.4 : isMajor ? 0.9 : 0.5}
              opacity={(isCardinal ? 0.9 : isMajor ? 0.6 : 0.35) * strokeMul}
              transform={`rotate(${angle})`}
            />
          );
        })}

        {[
          { l: "N", x: 0, y: -120 },
          { l: "E", x: 120, y: 4 },
          { l: "S", x: 0, y: 128 },
          { l: "W", x: -120, y: 4 },
        ].map((c) => (
          <text
            key={c.l}
            x={c.x}
            y={c.y}
            fontSize="11"
            fontFamily="monospace"
            fill="currentColor"
            opacity="0.75"
            textAnchor="middle"
          >
            {c.l}
          </text>
        ))}

        <polygon points="0,-150 8,0 0,150 -8,0" fill="currentColor" opacity={0.55 * strokeMul} />
        <polygon points="-150,0 0,-6 150,0 0,6" fill="currentColor" opacity={0.28 * strokeMul} />
        <circle r="9" fill="currentColor" opacity={0.85 * strokeMul} />
        <circle r="4" fill="#fff" />
      </motion.g>
    </motion.svg>
  );
}
