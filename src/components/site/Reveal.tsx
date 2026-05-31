import { createElement, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "header" | "article" | "h1" | "h2" | "h3" | "p" | "span";
}

/** Scroll-triggered fade/slide — pure CSS (works without React hydration). */
export function Reveal({ children, delay = 0, y = 24, x = 0, className, style, as = "div" }: RevealProps) {
  const revealStyle = {
    ...style,
    "--reveal-delay": `${delay}s`,
    "--reveal-y": `${y}px`,
    "--reveal-x": `${x}px`,
  } as CSSProperties;

  return createElement(as, { className: `scroll-reveal ${className ?? ""}`.trim(), style: revealStyle }, children);
}
