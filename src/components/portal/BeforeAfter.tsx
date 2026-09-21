"use client";

import { useCallback, useRef, useState } from "react";

interface Props {
  before: string;
  after: string;
  /** Alt text has to describe the site, not say "before image". */
  label: string;
  beforeCaption?: string;
  afterCaption?: string;
}

/* Drag-to-compare. Both images are the same canvas size — a slider across
   differently-proportioned captures would misrepresent the comparison, which is
   the one thing this component must not do.

   The handle is keyboard-operable because a mouse-only comparison is a
   comparison half the reviewers cannot make. */
export function BeforeAfter({
  before,
  after,
  label,
  beforeCaption = "Today",
  afterCaption = "Our direction",
}: Props) {
  const [pos, setPos] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const set = useCallback((clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  return (
    <figure className="m-0">
      <div
        ref={wrap}
        className="relative select-none overflow-hidden border border-[var(--line-bright)] bg-[var(--raised)]"
        style={{ touchAction: "pan-y" }}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          set(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && set(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* after sits underneath, full width */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={after}
          alt={`${label} — LOVELEEDAY direction study`}
          width={1440}
          height={900}
          loading="lazy"
          className="block w-full"
        />

        {/* before is clipped to the handle position */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={before}
            alt={`${label} — the site as it is today`}
            width={1440}
            height={900}
            loading="lazy"
            className="block w-full"
          />
        </div>

        {/* captions, each fading out as its side is covered */}
        <span
          className="pointer-events-none absolute left-3 top-3 bg-[var(--ground)]/85 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--ink)] transition-opacity"
          style={{ opacity: pos > 14 ? 1 : 0 }}
        >
          {beforeCaption}
        </span>
        <span
          className="pointer-events-none absolute right-3 top-3 bg-[var(--accent)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-white transition-opacity"
          style={{ opacity: pos < 86 ? 1 : 0 }}
        >
          {afterCaption}
        </span>

        {/* the divider */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-[var(--accent)]"
          style={{ left: `${pos}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare ${label}: drag to reveal the current site or the redesign`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
        <span
          className="pointer-events-none absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--accent)] text-[13px] font-medium text-white shadow-lg"
          style={{ left: `${pos}%` }}
          aria-hidden="true"
        >
          ↔
        </span>
      </div>
      <figcaption className="mt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
        Drag to compare · both frames captured at 1440px on the same day
      </figcaption>
    </figure>
  );
}
