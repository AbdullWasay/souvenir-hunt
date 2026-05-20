import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { useRef } from "react";

interface Props {
  progress?: MotionValue<number>;
  className?: string;
  /** When true, react to scroll immediately (no spring lag). */
  immediate?: boolean;
}

/** Artistic cartographer's compass rose. Rotates with scroll. */
export function CompassRose({ progress, className, immediate }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const { scrollYProgress } = useScroll();
  const source = progress ?? scrollYProgress;
  const rotateRaw = useTransform(source, [0, 1], [0, 540]);
  const rotateSpring = useSpring(rotateRaw, { stiffness: 120, damping: 22, mass: 0.4 });
  const rotate = immediate ? rotateRaw : rotateSpring;
  const counter = useTransform(rotate, (r) => -r);

  // ticks: 72 around (every 5°), longer every 15°, longest at cardinals
  const ticks = Array.from({ length: 72 }, (_, i) => i);

  return (
    <svg
      ref={ref}
      viewBox="-200 -200 400 400"
      className={className}
      fill="none"
      aria-hidden
    >
      {/* sheet labels (counter-rotate so they stay upright) */}
      <motion.g style={{ rotate: counter }} className="font-mono">
        <text x="120" y="-150" fontSize="9" fill="currentColor" opacity="0.6" letterSpacing="2">
          SHEET 01 / 04
        </text>
        <text x="120" y="-135" fontSize="9" fill="currentColor" opacity="0.6" letterSpacing="2">
          SCALE 1:8000
        </text>
      </motion.g>

      {/* outer ring with rotation */}
      <motion.g style={{ rotate }}>
        {/* concentric rings */}
        <circle r="180" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <circle r="140" stroke="currentColor" strokeWidth="0.6" opacity="0.25" strokeDasharray="2 4" />
        <circle r="95" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
        <circle r="55" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />

        {/* ticks */}
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
              opacity={isCardinal ? 0.9 : isMajor ? 0.6 : 0.35}
              transform={`rotate(${angle})`}
            />
          );
        })}

        {/* cardinal letters - rotate with the rose */}
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
            letterSpacing="1"
          >
            {c.l}
          </text>
        ))}

        {/* needle - elongated diamond N/S */}
        <polygon
          points="0,-150 8,0 0,150 -8,0"
          fill="currentColor"
          opacity="0.55"
        />
        {/* perpendicular E/W needle (lighter) */}
        <polygon
          points="-150,0 0,-6 150,0 0,6"
          fill="currentColor"
          opacity="0.28"
        />

        {/* center hub */}
        <circle r="9" fill="currentColor" opacity="0.85" />
        <circle r="4" fill="#fff" />
      </motion.g>
    </svg>
  );
}
