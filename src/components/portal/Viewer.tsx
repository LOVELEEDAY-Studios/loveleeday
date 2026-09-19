"use client";

import { useState } from "react";

const WIDTHS = [
  { id: "desktop", label: "Desktop", px: 0 },
  { id: "tablet", label: "Tablet", px: 834 },
  { id: "phone", label: "Phone", px: 390 },
] as const;

type WidthId = (typeof WIDTHS)[number]["id"];

/* The page is shown in a real browser frame at a real device width rather than
   as a flat image, because half the notes a client has are about how the thing
   behaves on their phone — and they will not resize a window to find out. */
export function Viewer({ src, title }: { src: string; title: string }) {
  const [width, setWidth] = useState<WidthId>("desktop");
  const active = WIDTHS.find((w) => w.id === width)!;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] px-4 py-3">
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Preview width"
        >
          {WIDTHS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWidth(w.id)}
              aria-pressed={width === w.id}
              className={`min-h-[36px] px-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] transition-colors ${
                width === w.id
                  ? "bg-[var(--raised)] text-[var(--text)]"
                  : "text-[var(--dim)] hover:text-[var(--muted)]"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--dim)] tnum">
            {active.px ? `${active.px}px` : "Fluid"}
          </span>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--accent)]"
          >
            Full screen ↗
          </a>
        </div>
      </div>

      <div className="flex justify-center overflow-auto bg-[var(--sunk)] p-0 sm:p-6">
        <iframe
          key={width}
          src={src}
          title={title}
          loading="lazy"
          className="h-[calc(100vh-13rem)] min-h-[520px] w-full border-0 bg-white"
          style={active.px ? { width: active.px, maxWidth: "100%", flex: "0 0 auto" } : undefined}
        />
      </div>
    </div>
  );
}
