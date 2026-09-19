"use client";

import { useEffect, useRef, useState } from "react";

/* Desktop is a FIXED 1440 rather than "100% of whatever the container is".
   That is the whole point of this component: a page with a 940px breakpoint
   rendered in a 1100px iframe silently drops to its tablet layout, so the
   client reviews a design nobody designed. We render at a true desktop width
   and scale the frame down to fit — the layout stays the desktop layout. */
const WIDTHS = [
  { id: "desktop", label: "Desktop", px: 1440 },
  { id: "tablet", label: "Tablet", px: 834 },
  { id: "phone", label: "Phone", px: 390 },
] as const;

type WidthId = (typeof WIDTHS)[number]["id"];

export function Viewer({ src, title }: { src: string; title: string }) {
  const [width, setWidth] = useState<WidthId>("desktop");
  const [scale, setScale] = useState(1);
  const shell = useRef<HTMLDivElement>(null);
  const active = WIDTHS.find((w) => w.id === width)!;

  /* Scale only ever shrinks. Blowing a 390px phone layout up to fill a desktop
     container would misrepresent it just as badly as squashing the desktop one. */
  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    const fit = () => {
      const avail = el.clientWidth;
      setScale(avail > 0 ? Math.min(1, avail / active.px) : 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active.px]);

  const frameH = 900; // the viewport height we render the page into
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] px-4 py-3">
        <div className="flex items-center gap-1" role="group" aria-label="Preview width">
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
          <span className="tnum font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--dim)]">
            {active.px}px{scale < 0.995 ? ` · ${Math.round(scale * 100)}%` : ""}
          </span>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--accent)]"
          >
            Open full size ↗
          </a>
        </div>
      </div>

      <div ref={shell} className="overflow-hidden bg-[var(--sunk)] p-0 sm:p-6">
        {/* The outer box reserves the SCALED height, so the layout below does
            not sit under a frame that is visually 900px but 1300px in flow. */}
        <div
          className="mx-auto overflow-hidden"
          style={{ width: active.px * scale, height: frameH * scale }}
        >
          <iframe
            key={width}
            src={src}
            title={title}
            loading="lazy"
            className="border-0 bg-white"
            style={{
              width: active.px,
              height: frameH,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
    </div>
  );
}
