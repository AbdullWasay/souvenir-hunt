import { useEffect, useState, type RefObject } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type CursorGlowProps = {
  containerRef?: RefObject<HTMLElement | null>;
  fixed?: boolean;
};

export function CursorGlow({ containerRef, fixed = true }: CursorGlowProps) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (!containerRef?.current) {
      setEnabled(true);
      const onMove = (e: PointerEvent) => {
        x.set(e.clientX);
        y.set(e.clientY);
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    }

    const el = containerRef.current;
    const onEnter = () => setEnabled(true);
    const onLeave = () => setEnabled(false);
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointermove", onMove);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointermove", onMove);
    };
  }, [containerRef, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        className={`pointer-events-none ${fixed ? "fixed" : "absolute"} left-0 top-0 z-[2] h-[520px] w-[520px] rounded-full mix-blend-multiply`}
      >
        <div className="h-full w-full rounded-full opacity-[0.22] blur-3xl"
          style={{ background: "radial-gradient(circle at center, oklch(0.58 0.2 250 / 0.9), transparent 60%)" }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        className={`pointer-events-none ${fixed ? "fixed" : "absolute"} left-0 top-0 z-[3] h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_24px_4px_oklch(0.58_0.2_250/0.6)]`}
      />
    </>
  );
}
