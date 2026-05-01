export function Footer() {
  return (
    <footer
      className="w-full max-w-[1280px] mx-auto px-6 md:px-10 mt-24 pt-6 pb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      style={{ borderTop: "1px solid var(--bone)" }}
    >
      <div className="flex flex-col gap-1">
        <span
          className="text-xs"
          style={{
            fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
            color: "var(--pewter)",
          }}
        >
          &copy; 2026 LOVELEEDAY Studios LLC. A Delaware company.
        </span>
        <span
          className="text-xs"
          style={{
            fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
            color: "var(--pewter)",
          }}
        >
          Based in Kalamazoo, MI &mdash; serving clients globally.
        </span>
      </div>
      <a
        href="mailto:hello@loveleedaystudios.com"
        className="text-xs no-underline hover:opacity-60 transition-opacity"
        style={{
          fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
          color: "var(--pewter)",
        }}
      >
        hello@loveleedaystudios.com
      </a>
    </footer>
  );
}
