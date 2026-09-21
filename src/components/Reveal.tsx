"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* One observer for the whole document instead of a client component wrapped
   around every block. Anything with data-rise gets the entrance; nothing else
   has to know it exists, and server components stay server components.

   Under prefers-reduced-motion the CSS already shows the final state, so this
   does nothing rather than doing something faster. */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-rise]"));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          /* Siblings stagger, capped at six steps. Past that the last item in a
             long list arrives noticeably after you have already read it. */
          const sibs = Array.from(
            el.parentElement?.querySelectorAll<HTMLElement>(":scope > [data-rise]") ?? [],
          );
          el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 5) * 65}ms`;
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
