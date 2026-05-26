import { motion, useScroll, useTransform } from "motion/react";
import { useRouterState } from "@tanstack/react-router";
import { CompassRose } from "./CompassRose";

type Variant = {
  x: [string, string, string];
  y: [string, string, string];
  side: "right" | "left";
  size: string;
  top: string;
  opacity: [number, number, number, number];
};

// For side:"right" with right:0, NEGATIVE x pulls the compass into view.
// For side:"left" with left:0, POSITIVE x pulls it into view.
const variants: Record<string, Variant> = {
  "/":         { x: ["-18vw", "-32vw", "-8vw"], y: ["2vh",  "10vh", "-4vh"], side: "right", size: "70vh", top: "14vh", opacity: [0.38, 0.45, 0.4, 0.22] },
  "/hunts":    { x: ["10vw",  "28vw",  "6vw"],  y: ["4vh",  "-6vh", "10vh"], side: "left",  size: "60vh", top: "18vh", opacity: [0.32, 0.42, 0.36, 0.18] },
  "/your-hunt":{ x: ["-12vw", "-30vw", "-6vw"], y: ["-5vh", "12vh", "0vh"],  side: "right", size: "65vh", top: "20vh", opacity: [0.3, 0.4, 0.34, 0.18] },
  "/about":    { x: ["8vw",   "26vw",  "4vw"],  y: ["10vh", "-5vh", "8vh"],  side: "left",  size: "75vh", top: "10vh", opacity: [0.34, 0.44, 0.34, 0.18] },
  "/artists":  { x: ["-14vw", "-28vw", "-10vw"],y: ["0vh",  "15vh", "-8vh"], side: "right", size: "55vh", top: "22vh", opacity: [0.32, 0.4, 0.38, 0.2] },
  "/reviews":  { x: ["12vw",  "30vw",  "6vw"],  y: ["6vh",  "-10vh","4vh"],  side: "left",  size: "65vh", top: "16vh", opacity: [0.3, 0.42, 0.34, 0.18] },
  "/contact":  { x: ["-10vw", "-26vw", "-16vw"],y: ["-8vh", "10vh", "-2vh"], side: "right", size: "70vh", top: "12vh", opacity: [0.34, 0.44, 0.36, 0.2] },
  "/admin":    { x: ["-8vw",  "-20vw", "-4vw"], y: ["0vh",  "6vh",  "-2vh"], side: "right", size: "50vh", top: "20vh", opacity: [0.18, 0.22, 0.2, 0.1] },
};

export function StickyCompass() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const v = variants[pathname] ?? variants["/"];
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 0.5, 1], v.x);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], v.y);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], v.opacity);

  return (
    <motion.div
      aria-hidden
      style={{
        x,
        y,
        opacity,
        top: v.top,
        width: v.size,
        height: v.size,
        ...(v.side === "right" ? { right: 0 } : { left: 0 }),
      }}
      className="pointer-events-none fixed z-0 hidden md:block text-primary"
    >
      <CompassRose progress={scrollYProgress} className="w-full h-full" immediate />
    </motion.div>
  );
}
