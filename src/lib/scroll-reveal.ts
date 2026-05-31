/** Shared scroll-reveal observer — used by inline script + Reveal component. */
export function observeScrollReveal(el: Element) {
  if (el.classList.contains("is-visible") || el.classList.contains("scroll-reveal-watching")) return;
  el.classList.add("scroll-reveal-watching");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-visible");
    return;
  }

  el.classList.add("scroll-reveal-ready");

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        el.classList.add("is-visible");
        io.disconnect();
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
  );

  io.observe(el);
}

export function initScrollReveals(root: ParentNode = document) {
  root.querySelectorAll(".scroll-reveal:not(.is-visible)").forEach(observeScrollReveal);
}

/** Inline boot script — runs without React hydration (production-safe). */
export const scrollRevealBootScript = `(function(){function o(e){if(e.classList.contains("is-visible")||e.classList.contains("scroll-reveal-watching"))return;e.classList.add("scroll-reveal-watching");if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){e.classList.add("is-visible");return}e.classList.add("scroll-reveal-ready");var t=new IntersectionObserver(function(n){n[0]&&n[0].isIntersecting&&(e.classList.add("is-visible"),t.disconnect())},{threshold:.1,rootMargin:"0px 0px -32px 0px"});t.observe(e)}function i(r){(r||document).querySelectorAll(".scroll-reveal:not(.scroll-reveal-watching)").forEach(o)}function s(){i(document);new MutationObserver(function(){i(document)}).observe(document.body,{childList:!0,subtree:!0})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",s):s()})();`;
