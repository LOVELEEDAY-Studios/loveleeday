import type { Metadata } from "next";
import { ViewBeacon } from "@/components/portal/ViewBeacon";

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
      {/* The same header geometry as the landing page (concepts/studio/site/assets/site.css
          .nav / .wrap / .brand): 1080px content column with 40px gutters, 72px bar, 24px
          heart, 13px system-font wordmark at .12em and weight 650. Phone width follows the
          site's 700px rules: 24px gutter, 64px bar, 18px heart, 9px wordmark. */}
      <header className="border-b border-[#00000012] bg-white">
        <div className="mx-auto flex h-[72px] w-[min(1080px,calc(100%-80px))] items-center justify-between max-[700px]:h-[64px] max-[700px]:w-[calc(100%-48px)]">
          {/* A plain anchor: "/" is a static HTML file behind a rewrite, so next/link's RSC
              prefetch of it 404s on every portal page. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="flex shrink-0 items-center gap-2 text-[#1d1d1f] text-[13px] font-[650] tracking-[0.12em] max-[700px]:text-[9px] max-[700px]:tracking-[0.1em]"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif' }}
            aria-label="LOVELEEDAY Studios — home"
          >
            <span
              aria-hidden="true"
              className="inline-block h-6 w-6 shrink-0 bg-current max-[700px]:h-[18px] max-[700px]:w-[18px]"
              style={{ WebkitMask: "url(/site/assets/mark-mask.png) center/contain no-repeat", mask: "url(/site/assets/mark-mask.png) center/contain no-repeat" }}
            />
            LOVELEEDAY
          </a>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
            Private review
          </span>
        </div>
      </header>

      <main className="flex-1">{children}</main>
      <ViewBeacon />

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
