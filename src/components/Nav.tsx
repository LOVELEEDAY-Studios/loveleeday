"use client";

import Link from "next/link";
import { useState } from "react";

interface NavProps {
  activeHref?: string;
}

/* Navigation follows the positioning: this is a software company, so the nav
   names products and evidence, not service tiers. "Services / Approach" was the
   agency framing and is gone. */
const navItems = [
  { label: "Products", href: "/work" },
  { label: "How we build", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="18" y="18" width="27" height="27" stroke="currentColor" strokeWidth="2.5" />
      <rect x="55" y="18" width="27" height="27" fill="currentColor" />
      <rect x="18" y="55" width="27" height="27" fill="currentColor" />
      <path d="M55 55H82V82H55V55Z" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="68.5" cy="68.5" r="4.5" fill="var(--accent)" />
    </svg>
  );
}

export function Nav({ activeHref }: NavProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--ground)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1340px] items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[var(--text)]"
          aria-label="LOVELEEDAY Studios — home"
        >
          <LogoMark />
          <span className="text-[14px] font-medium tracking-[-0.01em]">
            LOVELEEDAY<span className="text-[var(--dim)]"> Studios</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activeHref === item.href ? "page" : undefined}
              className={`text-[14px] transition-colors hover:text-[var(--text)] ${
                activeHref === item.href ? "text-[var(--text)]" : "text-[var(--muted)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="relative block h-[10px] w-[18px]">
            <span className="absolute left-0 top-0 h-[1.5px] w-full bg-[var(--text)]" />
            <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-[var(--text)]" />
          </span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-[var(--line)] md:hidden" aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block min-h-[44px] border-b border-[var(--line)] px-6 py-3 text-[15px] text-[var(--muted)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
