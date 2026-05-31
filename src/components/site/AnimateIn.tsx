import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { createElement, type CSSProperties, type ReactNode } from "react";
import { useHydrated } from "@/hooks/use-hydrated";

type MotionTag = "div" | "span" | "article";

type AnimateInProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  as?: MotionTag;
  /** mount = play on load, inView = play when scrolled into view */
  trigger?: "mount" | "inView";
};

export function AnimateIn({
  children,
  className,
  style,
  delay = 0,
  y = 0,
  x = 0,
  scale,
  as = "div",
  trigger = "mount",
}: AnimateInProps) {
  const hydrated = useHydrated();
  const reduce = useReducedMotion();

  if (!hydrated || reduce) {
    return createElement(as, { className, style }, children);
  }

  const Component = motion[as] as typeof motion.div;
  const hidden = {
    opacity: 0,
    ...(y ? { y } : {}),
    ...(x ? { x } : {}),
    ...(scale !== undefined ? { scale } : {}),
  };
  const visible = {
    opacity: 1,
    y: 0,
    x: 0,
    ...(scale !== undefined ? { scale: 1 } : {}),
  };
  const transition = { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const };

  const shared: HTMLMotionProps<"div"> = {
    initial: hidden,
    transition,
    className,
    style,
  };

  if (trigger === "inView") {
    return (
      <Component {...shared} whileInView={visible} viewport={{ once: true, amount: 0.35 }}>
        {children}
      </Component>
    );
  }

  return (
    <Component {...shared} animate={visible}>
      {children}
    </Component>
  );
}
