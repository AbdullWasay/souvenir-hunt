import { motion, useReducedMotion } from "motion/react";
import { createElement, type ReactNode } from "react";
import { useHydrated } from "@/hooks/use-hydrated";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "header" | "article" | "h1" | "h2" | "h3" | "p";
}

export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const Component = motion[as] as typeof motion.div;

  if (!hydrated || reduce) {
    return createElement(as, { className }, children);
  }

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  );
}
