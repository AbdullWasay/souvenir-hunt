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

const variants: Record<string, Variant> = {
  "/":         { x: ["8vw",  "-20vw", "12vw"],  y: ["0vh",  "8vh",  "-4vh"], side: "right", size: "70vh", top: "14vh", opacity: [0.32, 0.4, 0.35, 0.18] },
  "/hunts":    { x: ["-15vw","18vw", "-10vw"], y: ["4vh",  "-6vh", "10vh"], side: "left",  size: "60vh", top: "18vh", opacity: [0.28, 0.38, 0.32, 0.15] },
  "/your-hunt":{ x: ["20vw", "-15vw","25vw"],  y: ["-5vh", "12vh", "0vh"],  side: "right", size: "65vh", top: "20vh", opacity: [0.25, 0.35, 0.3, 0.15] },
  "/about":    { x: ["-10vw","15vw", "-20vw"], y: ["10vh", "-5vh", "8vh"],  side: "left",  size: "75vh", top: "10vh", opacity: [0.3, 0.4, 0.3, 0.15] },
  "/artists":  { x: ["15vw", "-25vw","10vw"],  y: ["0vh",  "15vh", "-8vh"], side: "right", size: "55vh", top: "22vh", opacity: [0.28, 0.36, 0.34, 0.16] },
  "/reviews":  { x: ["-20vw","10vw", "-15vw"], y: ["6vh",  "-10vh","4vh"],  side: "left",  size: "65vh", top: "16vh", opacity: [0.26, 0.38, 0.3, 0.14] },
  "/contact":  { x: ["12vw", "-18vw","20vw"],  y: ["-8vh", "10vh", "-2vh"], side: "right", size: "70vh", top: "12vh", opacity: [0.3, 0.4, 0.32, 0.16] },
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
