"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Item = {
  key: string; name: string; vendor: string; group: string; category: string;
  method: string; status: string; reads: string; logo: string | null;
};
type Group = { id: string; label: string; count: number };

const STATUS_STYLE: Record<string, { bg: string; fg: string; bd: string }> = {
  Available: { bg: "var(--teal-wash)", fg: "var(--teal-d)", bd: "color-mix(in srgb, var(--teal) 30%, transparent)" },
  "Vendor approval": { bg: "var(--copper-wash)", fg: "var(--copper)", bd: "color-mix(in srgb, var(--copper) 30%, transparent)" },
  "Coming soon": { bg: "var(--sunk)", fg: "var(--mid)", bd: "var(--line-2)" },
};

function Tile({ item }: { item: Item }) {
  const initials = item.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-[var(--line)] bg-white p-1.5">
      {item.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.logo} alt={`${item.name} logo`} loading="lazy" className="max-h-full max-w-full object-contain" />
      ) : (
        <span className="font-[family-name:var(--font-sans-var)] text-[13px] font-bold text-[var(--deep)]">{initials}</span>
      )}
    </span>
  );
}

export default function Directory({ groups, items }: { groups: Group[]; items: Item[] }) {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (i) =>
        (tab === "all" || i.group === tab) &&
        (!needle || `${i.name} ${i.vendor} ${i.category} ${i.reads}`.toLowerCase().includes(needle)),
    );
  }, [items, tab, q]);

  const visibleGroups = groups.filter((g) => shown.some((i) => i.group === g.id));

  return (
    <section className="bg-[var(--ground)] pb-[clamp(56px,7vw,104px)] pt-10">
      <div className="shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div role="tablist" aria-label="Categories" className="flex flex-wrap gap-2">
            {[{ id: "all", label: "All", count: items.length }, ...groups.filter((g) => g.count > 0)].map((g) => {
              const on = tab === g.id;
              return (
                <button key={g.id} type="button" role="tab" aria-selected={on} onClick={() => setTab(g.id)}
                  className="inline-flex h-[34px] items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition-colors"
                  style={{
                    background: on ? "var(--ink)" : "var(--paper)",
                    color: on ? "var(--paper)" : "var(--mid)",
                    borderColor: on ? "var(--ink)" : "var(--line-2)",
                  }}>
                  {g.label}
                  <span className="tnum text-[11px]" style={{ opacity: 0.7 }}>{g.count}</span>
                </button>
              );
            })}
          </div>
          <label className="block w-full shrink-0 lg:w-[260px]">
            <span className="sr-only">Search systems</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${items.length} systems`}
              className="h-[40px] w-full rounded-[4px] border border-[var(--line-2)] bg-[var(--paper)] px-3.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--dim)]" />
          </label>
        </div>

        {visibleGroups.map((g) => {
          const list = shown.filter((i) => i.group === g.id);
          return (
            <div key={g.id} className="mt-12">
              <h2 className="flex items-baseline gap-3 font-[family-name:var(--font-sans-var)] text-[1.1rem] font-semibold tracking-[-0.02em]">
                {g.label}
                <span className="tnum text-[12px] font-normal text-[var(--dim)]">
                  {list.length} {list.length === 1 ? "system" : "systems"}
                </span>
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((i) => {
                  const s = STATUS_STYLE[i.status];
                  return (
                    <li key={i.key} className="flex min-w-0 flex-col gap-3 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] p-4">
                      <div className="flex items-center gap-3">
                        <Tile item={i} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[14.5px] font-semibold leading-[1.3] text-[var(--ink)]">{i.name}</p>
                          <p className="text-[12px] text-[var(--dim)]">{i.category}</p>
                        </div>
                      </div>
                      <p className="min-h-[2.9em] text-[13.5px] leading-[1.55] text-[var(--mid)]">{i.reads}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-2">
                        <span className="rounded-full border px-2.5 py-[3px] text-[11.5px] font-medium"
                          style={{ background: s.bg, color: s.fg, borderColor: s.bd }}>{i.status}</span>
                        <span className="eyebrow rounded-[3px] border border-[var(--line-2)] px-2 py-[5px] text-[10px] text-[var(--mid)]">
                          {i.method}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {shown.length === 0 && (
          <p className="mt-12 text-[15px] text-[var(--mid)]">
            Nothing matches that search. If your system is not here, we can still read it from a file.{" "}
            <Link href="/contact" className="underline underline-offset-[3px]">Tell us what you run.</Link>
          </p>
        )}

        <div className="mt-14 grid gap-6 rounded-[10px] border border-[var(--line)] bg-[var(--sunk)] p-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-sans-var)] text-[1.25rem] font-semibold tracking-[-0.02em]">Not listed?</h2>
            <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.6] text-[var(--mid)]">
              If your system exports a file, send us the file and we can start from there. If you would like a direct
              connector, ask and we will tell you plainly what it takes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex h-[40px] items-center rounded-[2px] bg-[var(--ink)] px-5 text-[13.5px] font-semibold text-[var(--paper)]">
              Ask for a connector
            </Link>
            <Link href="/contact" className="inline-flex h-[40px] items-center rounded-[2px] border border-[var(--ink)] px-5 text-[13.5px] font-semibold text-[var(--ink)]">
              Send us a file
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
