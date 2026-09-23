/* Small SVG charts. No library: the dashboard needs bars, lines and a stacked
   bar, and every one of them has to read at a glance on a phone. */

const money = (n: number) =>
  Math.abs(n) >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}k`;
export const fmtMoney = money;

export function Bars({
  data,
  height = 180,
  format = (n: number) => String(Math.round(n)),
  cap,
  capLabel,
}: {
  data: { label: string; value: number; tone?: "teal" | "copper" | "ink" | "muted"; note?: string }[];
  height?: number;
  format?: (n: number) => string;
  cap?: number;
  capLabel?: string;
}) {
  const max = Math.max(cap ?? 0, ...data.map((d) => d.value)) * 1.12 || 1;
  const tone = { teal: "var(--bar, var(--teal))", copper: "var(--bar-warm, var(--copper))", ink: "var(--bar-strong, var(--ink))", muted: "var(--line-2)" };
  return (
    <div>
      <div className="relative flex items-end gap-2" style={{ height }}>
        {cap !== undefined && (
          <div
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[var(--copper)]"
            style={{ bottom: `${(cap / max) * 100}%` }}
          >
            <span className="absolute -top-5 right-0 bg-[var(--paper)] px-1 text-[11px] text-[var(--copper)]">{capLabel}</span>
          </div>
        )}
        {data.map((d) => (
          <div key={d.label} className="flex h-full flex-1 flex-col justify-end" title={d.note}>
            <span className="tnum mb-1 text-center text-[11.5px] text-[var(--mid)]">{format(d.value)}</span>
            <div
              className="w-full transition-[height] duration-300"
              style={{ height: `${(d.value / max) * 100}%`, background: tone[d.tone ?? "teal"] }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 border-t border-[var(--line-2)] pt-1.5">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[11px] leading-[1.3] text-[var(--dim)]">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Lines({
  labels,
  series,
  height = 200,
  format = money,
}: {
  labels: string[];
  series: { name: string; values: number[]; color: string; dashed?: boolean }[];
  height?: number;
  format?: (n: number) => string;
}) {
  const W = 600;
  const H = height;
  const pad = { l: 56, r: 28, t: 12, b: 26 };
  const all = series.flatMap((s) => s.values);
  const min = Math.min(...all);
  const lo = min < 0 ? min * 1.1 : min * 0.8;
  const hi = Math.max(...all) * 1.08 || 1;
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(1, labels.length - 1);
  const y = (v: number) => pad.t + ((hi - v) * (H - pad.t - pad.b)) / (hi - lo);
  const ticks = [lo, lo + (hi - lo) / 2, hi];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--line)" />
            <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--dim)">{format(t)}</text>
          </g>
        ))}
        {lo < 0 && <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke="var(--ink)" strokeWidth="1" />}
        {labels.map((l, i) => (
          <text key={l} x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--dim)">{l}</text>
        ))}
        {series.map((s) => (
          <g key={s.name}>
            <polyline
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeDasharray={s.dashed ? "6 5" : undefined}
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
            />
            {s.values.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill={s.color} />
            ))}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-[12px] text-[var(--mid)]">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <i className="inline-block h-[3px] w-4" style={{ background: s.color }} /> {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Meter({ value, max = 100, tone = "var(--teal)" }: { value: number; max?: number; tone?: string }) {
  return (
    <div className="h-2 w-full bg-[var(--sunk)]">
      <div className="h-full transition-[width] duration-300" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: tone }} />
    </div>
  );
}
