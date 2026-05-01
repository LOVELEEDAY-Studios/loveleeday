interface ServiceTierProps {
  price: string;
  title: string;
  description: string;
}

export function ServiceTier({ price, title, description }: ServiceTierProps) {
  return (
    <div className="flex flex-col" style={{ borderTop: "1px solid var(--bone)", paddingTop: "1.25rem" }}>
      <div
        className="flex justify-between items-baseline pb-3 mb-3"
        style={{
          fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.04em",
          color: "var(--pewter)",
          borderBottom: "1px solid var(--bone)",
        }}
      >
        <span className="uppercase tracking-[0.07em]">Base engagement</span>
        <span style={{ color: "var(--ink)", fontWeight: 500 }}>{price}</span>
      </div>
      <h3
        className="mb-2"
        style={{
          fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
          fontSize: "1.1rem",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
        }}
      >
        {title}
      </h3>
      <p
        className="text-[0.9rem] leading-[1.6]"
        style={{ color: "var(--pewter)" }}
      >
        {description}
      </p>
    </div>
  );
}
