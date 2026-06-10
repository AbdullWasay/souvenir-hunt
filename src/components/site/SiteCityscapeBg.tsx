import { useEffect } from "react";

const CITYSCAPE_BG = "/assets/branding/background-static.svg";

/** Fixed cityscape background — stays still while page content scrolls. */
export function SiteCityscapeBg() {
  useEffect(() => {
    document.body.classList.add("home-parallax-active");
    return () => document.body.classList.remove("home-parallax-active");
  }, []);

  return (
    <div
      className="home-scene pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#f0f5ff]"
      aria-hidden
    >
      <div className="home-layer-sky absolute inset-x-0 top-0 z-[2] h-[min(70vh,560px)] bg-gradient-to-b from-[#f0f5ff] from-40% via-[#f0f5ff]/88 via-65% to-transparent" />

      <div
        className="home-illustration-wrap absolute inset-x-0 bottom-0 z-[1] h-[min(52vh,420px)] w-full bg-[#f0f5ff] bg-[length:100%_auto] bg-bottom bg-no-repeat"
        style={{ backgroundImage: `url(${CITYSCAPE_BG})` }}
      />
    </div>
  );
}
