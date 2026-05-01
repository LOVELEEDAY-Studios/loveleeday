interface TrustPillarProps {
  index: string;
  label: string;
  title: string;
  description: string;
}

export function TrustPillar({ index, label, title, description }: TrustPillarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <span
          style={{
            fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
            fontSize: "0.68rem",
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
            color: "var(--vermilion)",
          }}
        >
          [{index}]
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
            fontSize: "0.68rem",
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
            color: "var(--pewter)",
          }}
        >
          {label}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
          fontSize: "1.4rem",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h3>
      <p
        className="text-[0.95rem] leading-[1.6]"
        style={{ color: "var(--pewter)" }}
      >
        {description}
      </p>
    </div>
  );
}
