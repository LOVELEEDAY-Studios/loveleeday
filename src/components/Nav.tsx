"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* The global navigation — three rows, which is the point.
   ==========================================================================

   From the Palantir Foundry capture, 2026-09-21. A large company reads as large
   because its navigation visibly contains more than fits, and it shows that in
   layers rather than in a single wide row:

     1. A thin announcement strip. One current thing, one link.
     2. The company row: mark hard left, two calls to action hard right.
     3. The PLATFORM row: the sections of the product itself, with the current
        one underlined.

   Three rows of chrome would be absurd on a four-page brochure site. It works
   here because the second row addresses the company and the third addresses the
   product, and those are genuinely two different navigations.

   What this replaces: three plain text links and no call to action, rendered
   twice on every page because each page imported it while the layout rendered
   it too. */

const COMPANY = [
  { label: "Work", href: "/work" },
  { label: "Company", href: "/about" },
];

const PLATFORM = [
  { label: "Arthur Platform", href: "/arthur", note: "The intelligence system" },
  { label: "About the Ontology", href: "/arthur#ontology", note: "How records become objects" },
  { label: "Capabilities", href: "/arthur#architecture", note: "The five components" },
  { label: "Client rebuilds", href: "/work#studies", note: "Work for companies that are not ours" },
  { label: "Start building", href: "/contact", note: "Scope, quote, build" },
];

export function LogoMark({ size = 22 }: { size?: number }) {
  /* Daniel's heart, the same traced path the favicon and the site mark use.
     currentColor so it tints to whatever surface it sits on. */
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
      <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
        <path d="M3625 4649 c-104 -26 -586 -194 -635 -221 -77 -43 -119 -77 -246
-200 -129 -124 -159 -137 -240 -113 -70 21 -181 100 -305 219 -121 116 -195
159 -379 220 -214 71 -334 70 -562 -3 -68 -22 -167 -51 -220 -65 -208 -54
-347 -163 -476 -373 -97 -159 -103 -181 -113 -378 -5 -93 -13 -192 -19 -220
-24 -113 -28 -193 -22 -460 8 -322 4 -309 176 -594 130 -217 141 -227 388
-384 82 -53 121 -90 211 -202 44 -55 115 -136 156 -180 42 -44 109 -120 150
-170 98 -120 124 -143 276 -242 224 -147 335 -280 579 -700 93 -161 185 -203
277 -125 58 48 354 408 544 660 95 126 161 203 205 240 162 135 180 153 241
252 77 126 115 159 286 250 226 119 281 161 465 348 360 366 403 501 375 1182
-10 231 -22 284 -89 387 -65 100 -90 151 -132 270 -71 207 -106 243 -310 323
-100 39 -144 70 -233 163 -91 96 -135 119 -233 123 -41 2 -93 -1 -115 -7z" />
      </g>
    </svg>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const on = (href: string) => {
    const base = href.split("#")[0];
    return pathname === base || (base !== "/" && pathname.startsWith(base + "/"));
  };

  return (
    <header className="sticky top-0 z-50">
      {/* 1 · announcement */}
      <div className="bg-[var(--deep)] text-[var(--on-deep)]">
        <div className="shell flex h-[34px] items-center justify-between gap-5 text-[12px]">
          <span className="truncate">Arthur 4.0 — scoped engagements open for Q4</span>
          <Link href="/arthur" className="hidden shrink-0 underline underline-offset-[3px] hover:text-white sm:inline">
            Read the technical brief
          </Link>
        </div>
      </div>

      {/* 2 · the company */}
      <div className="border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_90%,transparent)] backdrop-blur-xl">
        <div className="shell flex h-[58px] items-center gap-7">
          <Link href="/" aria-label="LOVELEEDAY Studios — home"
                className="flex items-center gap-2.5 text-[var(--ink)]">
            <LogoMark />
            <span className="font-[family-name:var(--font-sans-var)] text-[14px] font-bold tracking-[0.005em]">
              LOVELEEDAY
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Company">
            {COMPANY.map((i) => (
              <Link key={i.href} href={i.href}
                    aria-current={on(i.href) ? "page" : undefined}
                    className="text-[13.5px] font-medium transition-colors"
                    style={{ color: on(i.href) ? "var(--ink)" : "var(--mid)" }}>
                {i.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <Link href="/contact"
                  className="hidden h-[34px] items-center rounded-[2px] border border-[var(--ink)] px-4 text-[13px] font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--sunk)] sm:inline-flex">
              Contact sales
            </Link>
            <Link href="/contact"
                  className="hidden h-[34px] items-center rounded-[2px] bg-[var(--ink)] px-4 text-[13px] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90 sm:inline-flex">
              Start a project
            </Link>
            <button type="button" onClick={() => setOpen((v) => !v)}
                    aria-expanded={open} aria-controls="nav-drawer"
                    aria-label={open ? "Close menu" : "Open menu"}
                    className="-mr-2 flex h-11 w-11 items-center justify-center text-[var(--ink)] md:hidden">
              <span className="relative block h-[11px] w-[19px]">
                <span className="absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300"
                      style={{ top: open ? 5 : 0, transform: open ? "rotate(45deg)" : "none" }} />
                <span className="absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300"
                      style={{ bottom: open ? 4.5 : 0, transform: open ? "rotate(-45deg)" : "none" }} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 · the platform */}
      <div className="hidden border-b border-[var(--line)] bg-[var(--paper)] md:block">
        <nav className="shell flex h-[44px] items-center gap-7 overflow-x-auto" aria-label="Platform"
             style={{ scrollbarWidth: "none" }}>
          {PLATFORM.map((i) => {
            const active = on(i.href) && i.href.includes("#") === false;
            return (
              <Link key={i.label} href={i.href}
                    className="flex h-[44px] shrink-0 items-center whitespace-nowrap border-b-2 text-[13px] font-medium transition-colors"
                    style={{
                      color: active ? "var(--ink)" : "var(--mid)",
                      borderColor: active ? "var(--teal)" : "transparent",
                    }}>
                {i.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* mobile drawer */}
      <div id="nav-drawer"
           className="overflow-hidden border-b border-[var(--line)] bg-[var(--paper)] transition-[max-height] duration-500 md:hidden"
           style={{ maxHeight: open ? "100vh" : 0 }}>
        <nav className="shell py-1" aria-label="Mobile">
          {[...PLATFORM, ...COMPANY.map((c) => ({ ...c, note: "" }))].map((i) => (
            <Link key={i.label} href={i.href} className="block border-b border-[var(--line)] py-3.5">
              <span className="block text-[16px] font-semibold text-[var(--ink)]">{i.label}</span>
              {i.note && <span className="mt-0.5 block text-[12.5px] text-[var(--dim)]">{i.note}</span>}
            </Link>
          ))}
          <Link href="/contact"
                className="mt-5 mb-6 flex h-12 items-center justify-center rounded-[2px] bg-[var(--ink)] text-[15px] font-semibold text-[var(--paper)]">
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
