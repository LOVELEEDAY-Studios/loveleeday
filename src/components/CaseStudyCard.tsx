import Link from "next/link";

interface CaseStudyCardProps {
  index: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  tech?: string[];
}

export function CaseStudyCard({ index, slug, title, category, summary, tech }: CaseStudyCardProps) {
  return (
    <Link
      href={`/work/${slug}`}
      className="group flex flex-col gap-3 no-underline"
      style={{ color: "inherit" }}
    >
      <div
        className="flex justify-between items-baseline pb-3"
        style={{ borderBottom: "1px solid var(--bone)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: "var(--vermilion)",
            letterSpacing: "0.05em",
          }}
        >
          [{index}]
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
            fontSize: "0.68rem",
            color: "var(--pewter)",
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
          }}
        >
          {category}
        </span>
      </div>
      <h3
        className="text-[1.15rem] font-semibold group-hover:opacity-60 transition-opacity"
        style={{
          fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
          letterSpacing: "-0.015em",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>
      <p
        className="text-[0.9rem] leading-[1.6]"
        style={{ color: "var(--pewter)" }}
      >
        {summary}
      </p>
      {tech && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
          {tech.slice(0, 4).map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                padding: "0.15rem 0.4rem",
                border: "1px solid var(--bone)",
                color: "var(--pewter)",
                borderRadius: "2px",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
