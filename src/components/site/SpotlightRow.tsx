import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useMotionTemplate } from "motion/react";

interface Props {
  children: ReactNode;
  className?: string;
  /** color used for the spotlight glow */
  color?: string;
}

/**
 * Row that paints a soft radial spotlight following the cursor.
 * Used in the Artists section so each row glows where you hover.
 */
export function SpotlightRow({ children, className = "", color = "rgba(56,189,248,0.18)" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, ${color}, transparent 60%)`;

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      }}
      onPointerLeave={() => {
        mx.set(-400);
        my.set(-400);
      }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        aria-hidden
        style={{ background: bg }}
        className="pointer-events-none absolute inset-0 transition-opacity"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
