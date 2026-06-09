import { useEffect } from "react";

const CITYSCAPE_BG = "/assets/branding/background-static.svg";

type SiteCityscapeBgProps = {
  /** fixed = stays put while content scrolls (home). scroll = moves with page (play, checkout). */
  attachment?: "fixed" | "scroll";
};

/** Fixed or scroll cityscape background — light sky + illustrated skyline. */
export function SiteCityscapeBg({ attachment = "fixed" }: SiteCityscapeBgProps) {
  useEffect(() => {
    document.body.classList.add("home-parallax-active");
    return () => document.body.classList.remove("home-parallax-active");
  }, []);

  const sceneClass =
    attachment === "fixed"
      ? "home-scene home-scene-fixed fixed inset-0"
      : "home-scene home-scene-scroll absolute inset-x-0 top-0 min-h-full";

  return (
    <div
      className={`${sceneClass} pointer-events-none z-0 overflow-hidden bg-[#f0f5ff]`}
      aria-hidden
    >
      {/* iOS-safe fallback — SVG embeds raster images with filters that Safari renders as black boxes */}
      <div className="home-scene-mobile-fallback absolute inset-0 md:hidden" />

      <div className="home-layer-sky absolute inset-x-0 top-0 z-[2] h-[min(70vh,560px)] bg-gradient-to-b from-[#f0f5ff] from-40% via-[#f0f5ff]/88 via-65% to-transparent" />

      <div className="home-illustration-wrap absolute inset-x-0 bottom-0 z-[1] hidden w-full justify-center md:flex">
        <img
          src={CITYSCAPE_BG}
          alt=""
          className="home-layer-back block h-auto w-full min-w-full max-w-[1440px]"
          width={1440}
          height={810}
          decoding="async"
        />
      </div>
    </div>
  );
}
