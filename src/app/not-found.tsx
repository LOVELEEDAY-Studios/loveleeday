import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-10 flex flex-col justify-center py-20">
        <span
          style={{
            fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--pewter)",
            display: "block",
            marginBottom: "1.5rem",
          }}
        >
          404
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
            fontSize: "clamp(2rem, 4vw, 4rem)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: "2rem",
          }}
        >
          Nothing here.
        </h1>
        <p
          className="text-[1rem] mb-10"
          style={{ color: "var(--pewter)" }}
        >
          The page you&rsquo;re looking for doesn&rsquo;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.06em] no-underline transition-opacity hover:opacity-60 min-h-[44px]"
          style={{
            fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
            color: "var(--ink)",
            borderBottom: "1px solid var(--ink)",
            paddingBottom: "2px",
            alignSelf: "flex-start",
          }}
        >
          &larr; Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
