/**
 * The hero object.
 *
 * The banked craft study is explicit that one axis-aligned screenshot in a
 * rounded rectangle is the tell for generated design, and that a card where the
 * object should be is "the absence of a decision about what the page is looking
 * at". So this is not a screenshot: it is real markup of the real product,
 * rendered as two overlapping panels at an offset, running off the right edge.
 *
 * The figures are olldae's actual shape — service, covers, ticket times — so the
 * page is looking at the product rather than at a placeholder.
 *
 * The second panel sits BEHIND the first, emerging lower-left. An earlier pass had
 * it in front and it covered the ticket rows: the reader saw "d Fashioned" and
 * "per Plane". Overlap has to create depth without eating content.
 */

const LINES = [
  { t: "17:42", s: "Table 12", d: "2 × Old Fashioned, 1 × Sazerac", v: "38.00" },
  { t: "17:44", s: "Table 4", d: "Flatbread, mixed greens", v: "26.50" },
  { t: "17:51", s: "Bar 3", d: "3 × Paper Plane", v: "45.00" },
];

export function ProductPanels() {
  return (
    <div className="relative select-none" aria-hidden="true">
      {/* Back panel — the dense operational surface. Cropped by the viewport on
          the right so it reads as "this continues", not "here is a picture". */}
      <div className="relative z-10 rounded-lg border border-[var(--line)] bg-[var(--raised)] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-[var(--good)]" />
          <span className="text-[11px] font-medium tracking-wide text-[var(--muted)]">
            SERVICE — FRIDAY
          </span>
          <span className="ml-auto tnum text-[11px] text-[var(--dim)]">18:04</span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-[var(--line)] border-b border-[var(--line)]">
          {[
            { k: "Covers", v: "68" },
            { k: "Avg ticket", v: "$41.20" },
            { k: "Food cost", v: "26.4%" },
          ].map((m) => (
            <div key={m.k} className="px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--dim)]">{m.k}</div>
              <div className="tnum mt-1 text-lg font-medium text-[var(--text)]">{m.v}</div>
            </div>
          ))}
        </div>

        <ul className="divide-y divide-[var(--line)]">
          {LINES.map((l) => (
            <li key={l.t} className="flex items-baseline gap-4 px-4 py-2.5">
              <span className="tnum w-11 shrink-0 text-[11px] text-[var(--dim)]">{l.t}</span>
              <span className="w-16 shrink-0 text-[12px] text-[var(--muted)]">{l.s}</span>
              <span className="truncate text-[12px] text-[var(--text)]">{l.d}</span>
              <span className="tnum ml-auto shrink-0 text-[12px] text-[var(--muted)]">{l.v}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Front panel — overlaps the back one, offset down-left. Something must
          overlap something; this is that. */}
      <div className="absolute -bottom-12 -left-12 z-0 w-[236px] rounded-lg border border-[var(--line-bright)] bg-[#131317] p-4 shadow-[0_30px_70px_-16px_rgba(0,0,0,0.95)]">
        <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--dim)]">
          Recipe cost — Sazerac
        </div>
        <div className="mt-3 space-y-1.5">
          {[
            ["Rye, 2 oz", "1.92"],
            ["Absinthe rinse", "0.31"],
            ["Demerara", "0.07"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between">
              <span className="text-[12px] text-[var(--muted)]">{k}</span>
              <span className="tnum text-[12px] text-[var(--text)]">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t border-[var(--line)] pt-2.5">
          <span className="text-[11px] text-[var(--dim)]">Pour cost</span>
          <span className="tnum text-[13px] font-medium text-[var(--accent)]">17.1%</span>
        </div>
      </div>
    </div>
  );
}
