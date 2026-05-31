import { createElement, type CSSProperties, type ReactNode } from "react";

type MotionTag = "div" | "span" | "article";

type AnimateInProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
  x?: number;
  as?: MotionTag;
};

/** Page-load fade/slide — pure CSS, works even when React hydration is slow. */
export function AnimateIn({
  children,
  className,
  style,
  delay = 0,
  y = 0,
  x = 0,
  as = "div",
}: AnimateInProps) {
  const animStyle = {
    ...style,
    "--enter-delay": `${delay}s`,
    "--enter-y": `${y}px`,
    "--enter-x": `${x}px`,
  } as CSSProperties;

  return createElement(as, { className: `enter-anim ${className ?? ""}`.trim(), style: animStyle }, children);
}
