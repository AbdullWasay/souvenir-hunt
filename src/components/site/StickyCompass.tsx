import { motion, useScroll, useTransform } from "motion/react";
import { CompassRose } from "./CompassRose";

/**
 * Fixed-position compass that lives in the page background.
 * Drifts horizontally and rotates as the user scrolls — gives the
 * site a constant, dynamic cartographer feel.
 */
export function StickyCompass() {
  const { scrollYProgress } = useScroll();
  // drift from right → far left → back, in vw units
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ["20vw", "-25vw", "15vw"]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], ["0vh", "10vh", "-5vh"]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0.18, 0.32, 0.32, 0.12]);

  return (
    <motion.div
      aria-hidden
      style={{ x, y, opacity }}
      className="pointer-events-none fixed top-[12vh] right-0 z-0 hidden md:block w-[70vh] h-[70vh] text-primary"
    >
      <CompassRose progress={scrollYProgress} className="w-full h-full" immediate />
    </motion.div>
  );
}
