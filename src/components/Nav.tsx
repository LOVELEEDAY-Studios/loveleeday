import Link from "next/link";

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
  return (
    <header className="w-full max-w-[1280px] mx-auto px-6 md:px-10 pt-8 pb-6 flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-3 no-underline text-[var(--ink)] hover:opacity-75 transition-opacity"
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

      <nav aria-label="Main navigation">
        <ul className="flex items-center gap-1 list-none m-0 p-0">
          {navItems.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block px-3 py-2.5 text-sm font-medium uppercase tracking-[0.06em] no-underline transition-opacity hover:opacity-60 min-h-[44px] flex items-center"
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
    </header>
  );
}
