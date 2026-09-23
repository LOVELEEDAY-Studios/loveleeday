import type { Metadata } from "next";
import { LogoMark } from "@/components/Nav";

/* Portals are handed out one link at a time. They must never turn up in a
   search result, a sitemap, or a referrer-driven crawl. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-[1340px] items-center justify-between px-6 py-4">
          {/* A plain anchor: "/" is a static HTML file behind a rewrite, so next/link's RSC
              prefetch of it 404s on every portal page. */}
          <a
            href="/"
            className="flex items-center gap-2.5 text-[var(--ink)]"
            aria-label="LOVELEEDAY Studios — home"
          >
            <LogoMark size={26} />
            <span className="text-[13px] font-semibold tracking-[0.18em]">
              LOVELEEDAY
            </span>
          </a>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
            Private review
          </span>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-[1340px] flex-col gap-2 px-6 py-6 text-[12px] text-[var(--mid)] sm:flex-row sm:items-center sm:justify-between">
          <span>LOVELEEDAY Studios LLC</span>
          <a href="mailto:hello@loveleedaystudios.com" className="hover:text-[var(--ink)]">
            hello@loveleedaystudios.com
          </a>
        </div>
      </footer>
    </div>
  );
}
