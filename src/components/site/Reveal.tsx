import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { observeScrollReveal } from "@/lib/scroll-reveal";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "header" | "article" | "h1" | "h2" | "h3" | "p" | "span";
}

/** Scroll-triggered fade/slide — CSS animation toggled by IntersectionObserver. */
export function Reveal({ children, delay = 0, y = 24, x = 0, className, style, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) observeScrollReveal(el);
  }, []);

  const revealStyle = {
    ...style,
    "--reveal-delay": `${delay}s`,
    "--reveal-y": `${y}px`,
    "--reveal-x": `${x}px`,
  } as CSSProperties;

  return createElement(as, { ref, className: `scroll-reveal ${className ?? ""}`.trim(), style: revealStyle }, children);
}
