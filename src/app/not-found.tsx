import type { Metadata } from "next";

/* The ROOT 404.
 *
 * There was already a not-found under (site), but the marketing pages are
 * static files served by rewrites in next.config.ts, which bypass that route
 * group entirely -- so any mistyped URL fell through to Next's own
 * "404: This page could not be found." An investor opening a slightly wrong
 * link saw a framework error page rather than the studio.
 *
 * Styled inline against the live site's own tokens rather than the Tailwind
 * theme, because this page must render correctly even when it is reached from
 * a path the app knows nothing about.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist. Find the work, the architecture, or start a project.",
  robots: { index: false, follow: true },
};

const LINKS: [string, string, string][] = [
  ["The operating system", "/operating-system", "What it is, and what it does"],
  ["Arthur", "/arthur", "The intelligence behind the answer"],
  ["Architecture", "/architecture", "The five layers, and why they hold"],
  ["Start a project", "/studio", "Describe the question you need answered"],
];

export default function NotFound() {
  return (
    <main
      style={{
        background: "#14110e",
        color: "#c9c2b8",
        minHeight: "100vh",
        padding: "clamp(72px,11vw,150px) 24px",
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif',
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 13,
            color: "#fff",
            fontSize: 18,
            letterSpacing: ".2em",
            fontWeight: 650,
            textDecoration: "none",
          }}
        >
          <img src="/site/assets/icon.svg" alt="" width={28} height={28} style={{ filter: "invert(1)" }} />
          LOVELEEDAY
        </a>

        <p
          style={{
            marginTop: 56,
            fontSize: 10,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "#8b8277",
          }}
        >
          404 — not found
        </p>
        <h1
          style={{
            marginTop: 16,
            fontSize: "clamp(40px,6vw,68px)",
            lineHeight: 1.05,
            letterSpacing: "-.03em",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          That page
          <br />
          <span style={{ color: "#8e867c" }}>does not exist.</span>
        </h1>
        <p style={{ marginTop: 26, maxWidth: "52ch", fontSize: 18, lineHeight: 1.6, color: "#a9a196" }}>
          The link may be out of date, or the page may have moved. If you were sent a private
          review link, open the original URL — those links are unguessable and cannot be reached
          from here.
        </p>

        <nav
          aria-label="Where to go instead"
          style={{ marginTop: 56, borderTop: "1px solid rgba(255,255,255,.12)" }}
        >
          {LINKS.map(([label, href, sub]) => (
            <a
              key={href}
              href={href}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 24,
                padding: "20px 0",
                borderBottom: "1px solid rgba(255,255,255,.12)",
                color: "#fff",
                textDecoration: "none",
                fontSize: 17,
              }}
            >
              <span>{label}</span>
              <span style={{ color: "#8b8277", fontSize: 14, textAlign: "right" }}>{sub}</span>
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
