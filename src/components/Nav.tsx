"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* The global navigation. There is exactly one of these and it is rendered in
   ONE place -- src/app/(site)/layout.tsx.

   It was previously rendered there AND imported separately by /work, /about,
   /contact, /work/[slug], /contact/success and not-found, so every one of those
   pages shipped two stacked headers and two footers. The homepage then ran a
   third, different navigation of its own inside injected markup. Three
   navigation systems on a four-page site.

   Structure follows what post-IPO infrastructure companies actually do, from
   captures taken 2026-09-21 of palantir.com, databricks.com, snowflake.com,
   stripe.com and apple.com: company mark hard left, a short product-led list,
   and a filled high-contrast CTA as the final element. All five have that
   button. This site had three plain text links and no call to action at all. */

const NAV = [
  { label: "Arthur", href: "/arthur", note: "The intelligence system" },
  { label: "Work", href: "/work", note: "Shipped products and rebuilds" },
  { label: "Company", href: "/about", note: "How we build, and who for" },
];

export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="18" y="18" width="27" height="27" stroke="currentColor" strokeWidth="3" />
      <rect x="55" y="18" width="27" height="27" fill="currentColor" />
      <rect x="18" y="55" width="27" height="27" fill="currentColor" />
      <path d="M55 55H82V82H55V55Z" stroke="currentColor" strokeWidth="3" />
      <circle cx="68.5" cy="68.5" r="5" fill="var(--signal)" />
    </svg>
  );
}

/**
 * `overDark` lets the bar sit transparently on top of the homepage's dark hero
 * stage and invert to the solid light bar once you have scrolled past it. Apple
 * and Palantir both do this, and it is the difference between a hero that runs
 * to the top of the viewport and one that starts below a white strip.
 */
export function Nav() {
  const pathname = usePathname();
  /* Only the homepage has a dark hero for the bar to sit on. Deriving it from
     the route rather than taking a prop keeps the layout from having to know. */
  const overDark = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    /* Threshold is a viewport height rather than a fixed pixel count: the hero
       is sized in vh, so a constant would invert in the wrong place on a
       laptop or a tall monitor. */
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // The drawer is a full-height panel; the page behind it must not scroll.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dark = overDark && !scrolled && !open;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        dark
          ? "border-b border-transparent bg-transparent"
          : open
            /* The translucent bar is right over page content and wrong over an
               open drawer: 82% paper on top of the dark hero rendered the bar
               grey while the drawer below it was white. */
            ? "border-b border-[var(--line)] bg-[var(--paper)]"
            : "border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_82%,transparent)] backdrop-blur-xl",
      ].join(" ")}
      style={{ color: dark ? "var(--on-dark)" : "var(--text)" }}
    >
      <div className="shell flex h-[62px] items-center gap-8">
        <Link
          href="/"
          aria-label="LOVELEEDAY Studios — home"
          className="flex items-center gap-2.5"
        >
          <LogoMark />
          <span className="text-[13.5px] font-semibold tracking-[0.01em]">
            LOVELEEDAY
            <span className={dark ? "text-[var(--on-dark-mu)]" : "text-[var(--dim)]"}>
              {" "}
              Studios
            </span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative py-5 text-[13.5px] font-medium transition-opacity hover:opacity-100"
                style={{ opacity: active ? 1 : 0.62 }}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute inset-x-0 bottom-0 h-[2px]"
                    style={{ background: "var(--signal)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden h-9 items-center rounded-[3px] px-4 text-[13px] font-semibold transition-colors sm:inline-flex"
            style={{
              background: dark ? "var(--on-dark)" : "var(--text)",
              color: dark ? "var(--ink)" : "var(--paper)",
            }}
          >
            Start a project
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          >
            <span className="relative block h-[11px] w-[19px]">
              <span
                className="absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300"
                style={{ top: open ? 5 : 0, transform: open ? "rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300"
                style={{ bottom: open ? 4.5 : 0, transform: open ? "rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer. A list of links with their descriptions rather than bare
          labels -- at this width there is room for the sentence, and a nav that
          explains itself is the one difference a small company can actually
          make against a big one's information architecture. */}
      <div
        id="nav-drawer"
        className="overflow-hidden border-t border-[var(--line)] bg-[var(--paper)] transition-[max-height] duration-400 md:hidden"
        style={{ maxHeight: open ? "100vh" : 0 }}
      >
        <nav className="shell py-2" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-b border-[var(--line)] py-4"
            >
              <span className="block text-[17px] font-semibold text-[var(--text)]">
                {item.label}
              </span>
              <span className="mt-0.5 block text-[13px] text-[var(--dim)]">{item.note}</span>
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-5 mb-6 flex h-12 items-center justify-center rounded-[3px] bg-[var(--text)] text-[15px] font-semibold text-[var(--paper)]"
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
