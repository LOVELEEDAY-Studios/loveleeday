"use client";

import Link from "next/link";
import { useState } from "react";

interface NavProps {
  activeHref?: string;
}

const navItems = [
  { label: "Services", href: "/#services" },
  { label: "Approach", href: "/#approach" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="18" y="18" width="27" height="27" stroke="#111111" strokeWidth="2.5" />
      <rect x="55" y="18" width="27" height="27" fill="#111111" />
      <rect x="18" y="55" width="27" height="27" fill="#111111" />
      <path d="M55 55H82V82H55V55Z" stroke="#111111" strokeWidth="2.5" />
      <circle cx="68.5" cy="68.5" r="4.5" fill="#111111" />
    </svg>
  );
}

export function Nav({ activeHref }: NavProps) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="w-full"
      style={{ borderBottom: open ? "1px solid var(--bone)" : "none" }}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10 pt-6 pb-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 no-underline hover:opacity-75 transition-opacity"
          style={{ color: "var(--ink)" }}
          aria-label="LOVELEEDAY Studios — home"
        >
          <LogoMark size={32} />
          <div className="leading-none">
            <span
              style={{
                fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
                fontSize: "1.1rem",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                display: "block",
              }}
            >
              LOVELEEDAY
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                textTransform: "uppercase" as const,
                letterSpacing: "0.12em",
                color: "var(--pewter)",
                display: "block",
                marginTop: "2px",
              }}
            >
              Studios™
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {navItems.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center px-3 py-2.5 text-sm font-medium uppercase tracking-[0.06em] no-underline transition-opacity hover:opacity-60 min-h-[44px]"
                    style={{
                      fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
                      color: "var(--ink)",
                      borderBottom: isActive ? "1px solid var(--ink)" : "1px solid transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-11 h-11 items-center"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}
        >
          <span
            style={{
              display: "block",
              width: "20px",
              height: "1.5px",
              backgroundColor: "var(--ink)",
              transition: "transform 200ms ease, opacity 200ms ease",
              transform: open ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "1.5px",
              backgroundColor: "var(--ink)",
              transition: "opacity 200ms ease",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "1.5px",
              backgroundColor: "var(--ink)",
              transition: "transform 200ms ease, opacity 200ms ease",
              transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden w-full"
          style={{ borderTop: "1px solid var(--bone)" }}
        >
          <nav aria-label="Mobile navigation">
            <ul className="list-none m-0 p-0 flex flex-col">
              {navItems.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <li
                    key={item.href}
                    style={{ borderBottom: "1px solid var(--bone)" }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center w-full px-6 py-4 text-sm font-medium uppercase tracking-[0.06em] no-underline"
                      style={{
                        fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
                        color: isActive ? "var(--vermilion)" : "var(--ink)",
                        minHeight: "52px",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
