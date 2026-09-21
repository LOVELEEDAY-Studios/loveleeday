"use client";

import { useEffect, useRef } from "react";

/* The hero object.
   ==========================================================================

   The banked craft study is explicit that one axis-aligned screenshot in a
   rounded rectangle is the tell for generated design, and that a card where the
   object should be is "the absence of a decision about what the page is looking
   at". The site it replaced had made the worse version of that decision: a
   stock photograph of people at laptops, credited to Unsplash in the footer.
   Of the six post-IPO companies captured as reference on 2026-09-21 -- Palantir,
   Databricks, Snowflake, Stripe, Apple, Anthropic -- not one uses stock
   photography of people anywhere near its hero. Every one of them shows the
   product.

   So this shows the product. It is not a picture of Arthur; it is real markup
   with a live canvas in the middle of it, cropped by the right edge of the
   viewport so it reads as "this continues" rather than "here is a screenshot".

   WHAT IT DRAWS is the one mechanic that distinguishes Arthur and is hardest to
   explain in a sentence: identity resolution. A Stripe customer, a vendor id in
   an ERP, a string in an email signature and a line in a PDF are four records
   in four systems and ONE object in the world. The canvas shows source records
   on the left resolving into entities on the right, edge by edge, and every
   resolved value keeps the trail back to where it came from.

   The colours in the canvas are data, not brand -- they encode source system,
   the way the CPK element colours do on the Novarna study. The brand's single
   accent appears here exactly once, on the entity currently resolving.

   Deliberately not a charting library and not three.js: about 150 lines of
   canvas against a page whose own Soarce study criticises a 5,009 KB homepage.
   ========================================================================== */

type Source = { label: string; sys: 0 | 1 | 2; entity: number };

/* Four systems, five entities, sixteen records. The shape is Arthur's real
   ontology shape -- these are the kinds of string that actually have to be
   collapsed onto one object before any figure about it can be trusted. */
const SOURCES: Source[] = [
  { label: "stripe:cus_QX8f2", sys: 0, entity: 0 },
  { label: "erp:vendor/4412", sys: 1, entity: 0 },
  { label: "“FES, Inc.”", sys: 2, entity: 0 },
  { label: "ap@fintecheq.com", sys: 2, entity: 0 },

  { label: "stripe:cus_7HbNw", sys: 0, entity: 1 },
  { label: "erp:vendor/0918", sys: 1, entity: 1 },
  { label: "“Northway Mfg”", sys: 2, entity: 1 },

  { label: "xero:contact/31a", sys: 1, entity: 2 },
  { label: "“Dabney & Co.”", sys: 2, entity: 2 },
  { label: "toast:loc_4471", sys: 0, entity: 2 },

  { label: "erp:vendor/2265", sys: 1, entity: 3 },
  { label: "“Kalsec”", sys: 2, entity: 3 },
  { label: "stripe:cus_Lp0ra", sys: 0, entity: 3 },

  { label: "erp:vendor/7730", sys: 1, entity: 4 },
  { label: "“GFS”", sys: 2, entity: 4 },
  { label: "gfs:acct/88-201", sys: 0, entity: 4 },
];

const ENTITIES = [
  "FINTECH EQUIPMENT SERVICES",
  "NORTHWAY MANUFACTURING",
  "DABNEY & CO.",
  "KALSEC INC.",
  "GORDON FOOD SERVICE",
];

const SYS = ["#5B8DEF", "#3FB6A8", "#C9A227"];
const SYS_NAME = ["Payments", "Ledger", "Documents"];

export function ArthurConsole() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = true;

    /* Laid out once per resize. Sources stack down the left at an even rhythm;
       entities sit at the mean height of the records that resolve onto them,
       which is what makes the edge bundles read as convergence rather than as a
       random web. */
    let sy: number[] = [];
    let ey: number[] = [];
    let colL = 0;
    let colR = 0;
    /* Where the edge bundle is allowed to live. Both label columns are set in a
       proportional-width mono at runtime, so the only honest way to know how
       much room they need is to measure them -- the first pass guessed a fixed
       122px and every edge drew straight through "FINTECH EQUIPMENT SERVICES"
       like a strikethrough. */
    let edgeX0 = 0;
    let edgeX1 = 0;

    const MONO = '11px var(--font-mono-var), ui-monospace, monospace';

    function layout() {
      const box = cv!.getBoundingClientRect();
      W = box.width;
      H = box.height;
      cv!.width = Math.round(W * dpr);
      cv!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const pad = 18;
      colL = 12;
      colR = W - 12;

      ctx!.font = MONO;
      const srcW = Math.max(...SOURCES.map((s) => ctx!.measureText(s.label).width));
      const entW = Math.max(...ENTITIES.map((e) => ctx!.measureText(e).width));
      edgeX0 = colL + 14 + srcW + 14;
      edgeX1 = colR - 9 - 12 - entW - 12;
      const step = (H - pad * 2) / (SOURCES.length - 1);
      sy = SOURCES.map((_, i) => pad + i * step);
      ey = ENTITIES.map((_, e) => {
        const rows = SOURCES.map((s, i) => (s.entity === e ? sy[i] : null)).filter(
          (v): v is number => v !== null,
        );
        return rows.reduce((a, b) => a + b, 0) / rows.length;
      });
    }

    function rounded(x: number, y: number, w: number, h: number, r: number) {
      ctx!.beginPath();
      ctx!.moveTo(x + r, y);
      ctx!.arcTo(x + w, y, x + w, y + h, r);
      ctx!.arcTo(x + w, y + h, x, y + h, r);
      ctx!.arcTo(x, y + h, x, y, r);
      ctx!.arcTo(x, y, x + w, y, r);
      ctx!.closePath();
    }

    function paint(t: number) {
      ctx!.clearRect(0, 0, W, H);
      if (W < 40) return;

      /* One entity is "resolving" at a time, on a slow rotation. Everything
         already resolved stays drawn -- the point of the object is that the
         trail persists, so an animation that cleared behind itself would be
         arguing the opposite of the copy. */
      const CYCLE = 2600;
      const active = Math.floor(t / CYCLE) % ENTITIES.length;
      const phase = (t % CYCLE) / CYCLE;

      const labelX = colL + 8;
      const nodeX = colL + 4;
      const entX = colR - 9;

      // ---- edges, behind everything
      SOURCES.forEach((s, i) => {
        /* The first pass animated an edge by lerping its END POINT along the
           straight line between the two nodes, which pulls the curve out of
           shape while it grows -- the path you watch being drawn is not the
           path you are left with. Drawing the finished curve and animating its
           OPACITY keeps the geometry honest and reads the same. */
        const grow =
          s.entity < active ? 1 : s.entity === active ? Math.min(1, (phase - 0.18) / 0.42) : 0;
        if (grow <= 0) return;
        const settled = s.entity !== active;

        const y0 = sy[i];
        const y1 = ey[s.entity];
        const x0 = edgeX0;
        const x1 = edgeX1;
        const span = x1 - x0;

        ctx!.beginPath();
        ctx!.moveTo(x0, y0);
        /* Handles pulled apart rather than both parked at the midpoint. With
           both on the centre line every edge left its record almost
           horizontally and the bundle read as a flat comb; leaving at 0.58 and
           arriving at 0.22 gives the S that makes convergence legible. */
        ctx!.bezierCurveTo(x0 + span * 0.58, y0, x1 - span * 0.22, y1, x1, y1);
        ctx!.strokeStyle = SYS[s.sys];
        ctx!.fillStyle = SYS[s.sys];
        ctx!.globalAlpha = (settled ? 0.42 : 0.92) * grow;
        ctx!.lineWidth = settled ? 1 : 1.35;
        ctx!.stroke();

        /* The edge now stops short of the label column, so it needs a terminal
           or it reads as a line that gave up. A 2px cap at the arrival point,
           in the source system's colour, also happens to show how many records
           landed on the same object. */
        ctx!.beginPath();
        ctx!.arc(x1, y1, settled ? 1.5 : 2.1, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
      });

      // ---- source records
      ctx!.font = MONO;
      ctx!.textBaseline = "middle";
      SOURCES.forEach((s, i) => {
        const hot = s.entity === active;
        ctx!.fillStyle = SYS[s.sys];
        ctx!.globalAlpha = hot ? 1 : 0.5;
        rounded(nodeX, sy[i] - 2.5, 5, 5, 1);
        ctx!.fill();
        ctx!.globalAlpha = 1;

        ctx!.fillStyle = hot ? "#E8EAED" : "#7B818A";
        ctx!.fillText(s.label, labelX + 6, sy[i]);
      });

      // ---- resolved entities
      ctx!.textAlign = "right";
      ENTITIES.forEach((name, e) => {
        const resolved = e < active || (e === active && phase > 0.5);
        const hot = e === active;
        ctx!.fillStyle = hot ? "#FF4713" : resolved ? "#E8EAED" : "#3A3F47";
        ctx!.font = hot
          ? '600 11px var(--font-mono-var), ui-monospace, monospace'
          : MONO;
        ctx!.fillText(name, entX - 12, ey[e]);

        ctx!.beginPath();
        ctx!.arc(entX - 4, ey[e], hot ? 3.6 : 2.6, 0, Math.PI * 2);
        ctx!.fillStyle = hot ? "#FF4713" : resolved ? "#8A9099" : "#2A2F39";
        ctx!.fill();
      });
      ctx!.textAlign = "left";
    }

    layout();
    const ro = new ResizeObserver(() => {
      layout();
      if (reduced) paint(2600 * 4.6);
    });
    ro.observe(cv);

    if (reduced) {
      // The still has to show the END state, not the first frame.
      paint(2600 * 4.6);
    } else {
      const io = new IntersectionObserver((es) => {
        running = es[0].isIntersecting;
      });
      io.observe(cv);
      let start: number | null = null;
      let last = 0;
      const frame = (ts: number) => {
        raf = requestAnimationFrame(frame);
        if (!running) return;
        if (start === null) start = ts;
        if (ts - last < 32) return; // ~30fps is plenty for this
        last = ts;
        paint(ts - start);
      };
      raf = requestAnimationFrame(frame);
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
      };
    }

    return () => ro.disconnect();
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[6px] border border-[var(--deep-line)] bg-[var(--deep-2)]"
      style={{ boxShadow: "0 40px 120px -40px rgba(0,0,0,.9)" }}
      aria-hidden="true"
    >
      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-[var(--deep-line)] px-4 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--good)]" />
        <span className="eyebrow text-[var(--on-deep-mu)]">Arthur — resolution</span>
        <span className="eyebrow ml-auto tnum text-[var(--on-deep-dim)]">mission 4471</span>
      </div>

      <div className="grid grid-cols-[132px_1fr] max-[560px]:grid-cols-1">
        {/* source-system rail */}
        <div className="border-r border-[var(--deep-line)] px-4 py-4 max-[560px]:border-r-0 max-[560px]:border-b">
          <div className="eyebrow text-[var(--on-deep-dim)]">Sources</div>
          <ul className="mt-3.5 space-y-2.5">
            {SYS_NAME.map((n, i) => (
              <li key={n} className="flex items-center gap-2">
                <span
                  className="h-[5px] w-[5px] rounded-[1px]"
                  style={{ background: SYS[i] }}
                />
                <span className="text-[11.5px] text-[var(--on-deep-mu)]">{n}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-[var(--deep-line)] pt-3.5">
            <div className="eyebrow text-[var(--on-deep-dim)]">Records</div>
            <div className="tnum mt-1.5 text-[19px] font-semibold text-[var(--on-deep)]">16</div>
            <div className="eyebrow mt-3 text-[var(--on-deep-dim)]">Objects</div>
            <div className="tnum mt-1.5 text-[19px] font-semibold text-[var(--on-deep)]">5</div>
          </div>
        </div>

        {/* the graph */}
        <canvas ref={ref} className="block h-[396px] w-full max-[560px]:h-[312px]" />
      </div>

      {/* lineage strip — the thing that makes a figure reportable */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--deep-line)] px-4 py-2.5">
        <span className="eyebrow text-[var(--on-deep-dim)]">Lineage</span>
        <span className="tnum text-[11.5px] text-[var(--on-deep-mu)]">
          erp:vendor/4412 → net_terms = 45
        </span>
        <span className="tnum text-[11.5px] text-[var(--on-deep-dim)]">
          observed 2026-09-18 · as-known-at 2026-09-21
        </span>
      </div>
    </div>
  );
}
