"use client";

import { useEffect, useRef } from "react";

/* The graphics library, as one client component.
   ==========================================================================

   Six scenes survived the cut from the ten in concepts/studio/motion.html.
   Four did not, and the reasons are worth keeping: "Current" and "Aperture"
   are decoration and this site's whole argument is against decoration;
   "Flow" is a real chart that needs real numbers and inventing them here
   would break the rule the footer states; "Orbit" is the technique behind the
   Novarna duplex, and re-using a client's signature object on our own site is
   bad manners. "Series" is out for the same reason as Flow -- we hold medians
   and counts from the audit, not the thirty-three individual scores, and a
   plotted distribution we do not have is a fabricated figure.

   One harness, one client boundary, one rAF per visible canvas. Everything
   pauses off screen, everything is capped well under 60fps, and every scene
   takes a `still` flag so reduced motion gets the END state rather than the
   first frame.

   Colours come from System A and are passed in rather than hard-coded, so a
   palette change is a token change and not a search-and-replace through
   trigonometry. */

const INK = "#16243A";
const MID = "#45536A";
const DIM = "#667383";
const TEAL = "#0E7C7B";
const COPPER = "#A36141";
const CREAM = "#FBF8F2";
const PAPER = "#FFFFFF";
const LINE = "#E6E0D6";
const LINE2 = "#D3CABA";
const DATA = ["#2F6E8F", "#0E7C7B", "#A36141", "#6E7A63"];

type Draw = (x: CanvasRenderingContext2D, W: number, H: number, t: number, still: boolean) => void;

/* ── value noise, shared by the field scenes ─────────────────────────────── */
const PERM = (() => {
  const p: number[] = [];
  let s = 1337;
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  return p.concat(p);
})();
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const grad = (h: number, x: number, y: number) => (h & 1 ? x : -x) + (h & 2 ? y : -y);
function noise(x: number, y: number) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
  x -= Math.floor(x); y -= Math.floor(y);
  const u = fade(x), v = fade(y);
  const A = PERM[X] + Y, B = PERM[X + 1] + Y;
  return mix(mix(grad(PERM[A], x, y), grad(PERM[B], x - 1, y), u),
             mix(grad(PERM[A + 1], x, y - 1), grad(PERM[B + 1], x - 1, y - 1), u), v) * 0.7;
}
function fbm(x: number, y: number, o = 3) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < o; i++) { s += a * noise(x * f, y * f); f *= 2; a *= 0.5; }
  return s;
}
const cub = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

/* ══ SCHEMATIC — the hero. Sources below, the object layer across the middle,
   consumers above. Every route passes through the middle, which is the whole
   argument of the page rendered as geometry. ══════════════════════════════ */
/* Named vendors are fine where they are ours to name. The ERP is not: Daniel
   works with that system professionally, and naming it here ties this site to
   that engagement. Describe the ROLE, not the product. */
const SOURCES: [string, string][] = [
  ["Stripe", "payments"], ["Xero", "ledger"], ["ERP", "system of record"],
  ["Toast", "POS"], ["Email", "documents"], ["PDF", "documents"], ["Sheets", "manual"],
];
const CONSUMERS: [string, string][] = [
  ["Analytics", "read"], ["Workflows", "read · write"], ["Agents", "read · write"],
  ["Reports", "read"], ["Integrations", "write"],
];
const OBJECTS = ["Company", "Vendor", "Invoice", "Venue", "Product", "Person", "Contract"];

const schematic: Draw = (x, W, H, t, still) => {
  x.fillStyle = PAPER; x.fillRect(0, 0, W, H);
  if (W < 60) return;
  const padX = Math.max(16, W * 0.03);
  const inner = W - padX * 2;
  const yCons = H * 0.12, yObj = H * 0.47, ySrc = H * 0.78;

  x.strokeStyle = "rgba(22,36,58,.05)"; x.lineWidth = 1;
  for (let gx = padX; gx < W - padX; gx += Math.max(26, inner / 36)) {
    x.beginPath(); x.moveTo(gx, H * 0.03); x.lineTo(gx, H * 0.96); x.stroke();
  }

  const label = (s: string, px: number, py: number, size: number, col: string,
                 align: CanvasTextAlign = "center", weight = 400) => {
    x.font = `${weight} ${size}px var(--font-mono-var), ui-monospace, monospace`;
    x.fillStyle = col; x.textAlign = align; x.textBaseline = "middle";
    x.fillText(s, px, py);
  };

  const objH = Math.max(50, H * 0.155), objY = yObj - objH / 2;
  x.fillStyle = CREAM; x.fillRect(padX, objY, inner, objH);
  x.strokeStyle = INK; x.lineWidth = 1.2; x.strokeRect(padX, objY, inner, objH);
  label("THE ONTOLOGY", padX + 12, objY + 15, 11, INK, "left", 500);
  label("resolved · bitemporal · lineage enforced", padX + inner - 12, objY + 15, 10.5, DIM, "right");
  const cw = inner / OBJECTS.length;
  OBJECTS.forEach((o, i) => {
    const cx = padX + i * cw;
    if (i) { x.strokeStyle = LINE2; x.lineWidth = 1; x.beginPath(); x.moveTo(cx, objY + 26); x.lineTo(cx, objY + objH); x.stroke(); }
    label(o.toUpperCase(), cx + cw / 2, objY + objH * 0.7, Math.min(11, cw / 7), TEAL, "center", 500);
  });

  const row = (items: [string, string][], y: number, h: number, up: boolean) => {
    const gap = Math.max(6, inner * 0.011), bw = (inner - gap * (items.length - 1)) / items.length;
    return items.map((it, i) => {
      const bx = padX + i * (bw + gap);
      x.fillStyle = PAPER; x.fillRect(bx, y, bw, h);
      x.strokeStyle = LINE2; x.lineWidth = 1; x.strokeRect(bx, y, bw, h);
      label(it[0], bx + bw / 2, y + h * 0.38, Math.min(12, bw / 6), INK, "center", 500);
      label(it[1], bx + bw / 2, y + h * 0.72, Math.min(10, bw / 8), DIM);
      return { x: bx + bw / 2, y: up ? y : y + h };
    });
  };
  const srcH = Math.max(38, H * 0.125), consH = Math.max(38, H * 0.125);
  const S = row(SOURCES, ySrc, srcH, true);
  const C = row(CONSUMERS, yCons, consH, false);

  const route = (from: { x: number; y: number }, to: { x: number; y: number }, phase: number | null, colour: string) => {
    const midY = (from.y + to.y) / 2;
    x.strokeStyle = colour; x.lineWidth = 1;
    x.beginPath(); x.moveTo(from.x, from.y);
    x.bezierCurveTo(from.x, midY, to.x, midY, to.x, to.y); x.stroke();
    if (phase === null) return;
    const p = phase % 1, k = p * p * (3 - 2 * p);
    x.fillStyle = COPPER;
    x.beginPath();
    x.arc(cub(from.x, from.x, to.x, to.x, k), cub(from.y, midY, midY, to.y, k), 2.2, 0, 7);
    x.fill();
  };
  S.forEach((s, i) => route(s, { x: padX + ((i + 0.5) / S.length) * inner, y: objY + objH },
    still ? null : t * 0.22 + i * 0.14, "rgba(22,36,58,.30)"));
  C.forEach((c, i) => route({ x: padX + ((i + 0.5) / C.length) * inner, y: objY }, c,
    still ? null : t * 0.19 + i * 0.2 + 0.5, "rgba(14,124,123,.42)"));

  label("SOURCE SYSTEMS", padX, ySrc + srcH + 15, 10.5, DIM, "left", 500);
  label("CONSUMERS", padX, yCons - 14, 10.5, DIM, "left", 500);
};

/* ══ BUNDLE — records collapsing onto objects ═════════════════════════════ */
const bundle: Draw = (x, W, H, t, still) => {
  x.fillStyle = CREAM; x.fillRect(0, 0, W, H);
  const N = 14, M = 5, pad = H * 0.10;
  const owner = [0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4];
  const sy = Array.from({ length: N }, (_, i) => pad + i * ((H - pad * 2) / (N - 1)));
  const ey = Array.from({ length: M }, (_, e) => {
    const r = sy.filter((_, i) => owner[i] === e);
    return r.reduce((a, b) => a + b, 0) / r.length;
  });
  const x0 = W * 0.14, x1 = W * 0.82, span = x1 - x0;
  const act = still ? 4 : Math.floor(t / 2.6) % M;
  for (let i = 0; i < N; i++) {
    const on = owner[i] === act;
    x.strokeStyle = DATA[i % 4]; x.globalAlpha = on ? 0.9 : 0.24; x.lineWidth = on ? 1.5 : 1;
    x.beginPath(); x.moveTo(x0, sy[i]);
    x.bezierCurveTo(x0 + span * 0.56, sy[i], x1 - span * 0.22, ey[owner[i]], x1, ey[owner[i]]);
    x.stroke();
    x.fillStyle = DATA[i % 4]; x.globalAlpha = on ? 1 : 0.38;
    x.beginPath(); x.arc(x0, sy[i], on ? 3 : 2, 0, 7); x.fill();
    if (on && !still) {
      const k = (t * 0.42) % 1, kk = k * k * (3 - 2 * k);
      x.fillStyle = COPPER;
      x.beginPath();
      x.arc(cub(x0, x0 + span * 0.56, x1 - span * 0.22, x1, kk),
            cub(sy[i], sy[i], ey[owner[i]], ey[owner[i]], kk), 2.6, 0, 7);
      x.fill();
    }
  }
  x.globalAlpha = 1;
  for (let e = 0; e < M; e++) {
    const hot = e === act;
    x.fillStyle = hot ? TEAL : INK; x.globalAlpha = hot ? 1 : 0.42;
    x.beginPath(); x.arc(x1, ey[e], hot ? 5.5 : 3.4, 0, 7); x.fill();
    if (hot) { x.globalAlpha = 0.14; x.beginPath(); x.arc(x1, ey[e], 11 + Math.sin(t * 3) * 2, 0, 7); x.fill(); }
  }
  x.globalAlpha = 1;
};

/* ══ LATTICE — a structure with a silhouette ══════════════════════════════ */
const lattice: Draw = (x, W, H, t, still) => {
  x.fillStyle = CREAM; x.fillRect(0, 0, W, H);
  const n = 5;
  const S: { x: number; y: number; z: number; i: number; j: number; k: number }[] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++)
    S.push({ x: (i / (n - 1) - .5) * 2, y: (j / (n - 1) - .5) * 2, z: (k / (n - 1) - .5) * 2, i, j, k });
  const cx = W / 2, cy = H * 0.5, R = Math.min(W * 0.143, H * 0.225);
  const ry = still ? 1.1 : t * 0.24, rx = -0.32;
  const ca = Math.cos(rx), sa = Math.sin(rx), cb = Math.cos(ry), sb = Math.sin(ry);
  const L = [-.40, -.62, .68]; const lm = Math.hypot(L[0], L[1], L[2]);
  const Ln = [L[0] / lm, L[1] / lm, L[2] / lm];
  const P = S.map((p) => {
    const X = p.x * cb + p.z * sb; let Z = -p.x * sb + p.z * cb;
    const Y = p.y * ca - Z * sa; Z = p.y * sa + Z * ca;
    const s = 2.6 / (2.6 - Z * 0.45);
    return { X: cx + X * R * s, Y: cy + Y * R * s, Z, i: p.i, j: p.j, k: p.k,
             nl: Math.max(0, (X * Ln[0] + Y * Ln[1] + Z * Ln[2]) / 1.74) };
  });
  const at = (a: number, b: number, c: number) => P[(a * n + b) * n + c];
  const sh = cy + R * 1.95;
  const g = x.createRadialGradient(cx, sh, 2, cx, sh, R * 2.1);
  g.addColorStop(0, "rgba(22,36,58,.13)"); g.addColorStop(1, "rgba(22,36,58,0)");
  x.fillStyle = g; x.beginPath(); x.ellipse(cx, sh, R * 2, R * 0.22, 0, 0, 7); x.fill();
  const st: [typeof P[0], typeof P[0]][] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
    if (i < n - 1) st.push([at(i, j, k), at(i + 1, j, k)]);
    if (j < n - 1) st.push([at(i, j, k), at(i, j + 1, k)]);
    if (k < n - 1) st.push([at(i, j, k), at(i, j, k + 1)]);
  }
  st.sort((a, b) => (a[0].Z + a[1].Z) - (b[0].Z + b[1].Z));
  st.forEach((e) => {
    const d = ((e[0].Z + e[1].Z) / 2 + 1) / 2;
    x.globalAlpha = 0.05 + 0.38 * d * d; x.strokeStyle = INK; x.lineWidth = 0.5 + 1.4 * d;
    x.beginPath(); x.moveTo(e[0].X, e[0].Y); x.lineTo(e[1].X, e[1].Y); x.stroke();
  });
  [...P].sort((a, b) => a.Z - b.Z).forEach((p) => {
    const d = (p.Z + 1) / 2;
    let r = 1.3 + 3.2 * d;
    const corner = +(p.i === 0 || p.i === n - 1) + +(p.j === 0 || p.j === n - 1) + +(p.k === 0 || p.k === n - 1);
    x.globalAlpha = 0.18 + 0.82 * d;
    if (corner === 3) { x.fillStyle = TEAL; r *= 1.2; }
    else { const v = Math.round(150 - 96 * p.nl); x.fillStyle = `rgb(${v},${v + 8},${v + 22})`; }
    x.beginPath(); x.arc(p.X, p.Y, r, 0, 7); x.fill();
    if (p.nl > 0.66 && d > 0.62) {
      x.globalAlpha = (p.nl - .66) / .34 * .7 * d; x.fillStyle = "#fff";
      x.beginPath(); x.arc(p.X - r * .3, p.Y - r * .32, r * .36, 0, 7); x.fill();
    }
  });
  x.globalAlpha = 1;
};

/* ══ CONTOUR — marching squares over a moving field ═══════════════════════ */
const contour: Draw = (x, W, H, t, still) => {
  x.fillStyle = CREAM; x.fillRect(0, 0, W, H);
  const cols = Math.max(24, Math.round(W / 14)), rows = Math.max(12, Math.round(H / 14));
  const T = still ? 6 : t;
  const f: number[][] = [];
  for (let j = 0; j <= rows; j++) {
    f[j] = [];
    for (let i = 0; i <= cols; i++) {
      const u = i / cols, v = j / rows;
      f[j][i] = fbm(u * 2.4 + T * 0.10, v * 2.4 - T * 0.07, 4)
              + (0.42 - Math.hypot(u - 0.5, (v - 0.5) * 1.25)) * 1.1;
    }
  }
  const LV = 8;
  for (let l = 0; l < LV; l++) {
    const iso = -0.45 + l * (1.05 / LV);
    const mid = l === Math.floor(LV / 2);
    x.strokeStyle = mid ? TEAL : INK;
    x.globalAlpha = mid ? 0.7 : (0.08 + 0.14 * (l / LV));
    x.lineWidth = mid ? 1.5 : 0.9;
    x.beginPath();
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x0 = i * W / cols, x1 = (i + 1) * W / cols, y0 = j * H / rows, y1 = (j + 1) * H / rows;
      const a = f[j][i], b = f[j][i + 1], c = f[j + 1][i + 1], d = f[j + 1][i];
      const idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const ip = (p: number, q: number, vp: number, vq: number) => p + (q - p) * ((iso - vp) / (vq - vp || 1e-6));
      const Tp = { x: ip(x0, x1, a, b), y: y0 }, Rt = { x: x1, y: ip(y0, y1, b, c) };
      const Bt = { x: ip(x0, x1, d, c), y: y1 }, Lf = { x: x0, y: ip(y0, y1, a, d) };
      const seg = ({ 1: [Lf, Bt], 2: [Bt, Rt], 3: [Lf, Rt], 4: [Tp, Rt], 5: [Tp, Rt], 6: [Tp, Bt],
        7: [Tp, Lf], 8: [Tp, Lf], 9: [Tp, Bt], 10: [Tp, Lf], 11: [Tp, Rt], 12: [Lf, Rt],
        13: [Bt, Rt], 14: [Lf, Bt] } as Record<number, { x: number; y: number }[]>)[idx];
      if (!seg) continue;
      x.moveTo(seg[0].x, seg[0].y); x.lineTo(seg[1].x, seg[1].y);
    }
    x.stroke();
  }
  x.globalAlpha = 1;
};

/* ══ HALFTONE — a printed thing being exposed ═════════════════════════════ */
const halftone: Draw = (x, W, H, t, still) => {
  x.fillStyle = PAPER; x.fillRect(0, 0, W, H);
  const step = Math.max(8, W / 42), T = still ? 9 : t;
  for (let gy = step * 0.6; gy < H; gy += step) for (let gx = step * 0.6; gx < W; gx += step) {
    const u = gx / W, v = gy / H;
    const val = fbm(u * 2.6 + T * 0.13, v * 2.6 - T * 0.09, 3) * 1.5
              + (0.46 - Math.hypot(u - 0.5, (v - 0.5) * 0.9)) * 1.5;
    const r = Math.max(0, Math.min(1, val)) * step * 0.46;
    if (r < 0.35) continue;
    const hot = val > 0.78;
    x.fillStyle = hot ? TEAL : INK;
    x.globalAlpha = hot ? 0.88 : (0.14 + 0.5 * Math.min(1, val));
    x.beginPath(); x.arc(gx, gy, r, 0, 7); x.fill();
  }
  x.globalAlpha = 1;
};

/* ══ PRISM — subtractive dispersion on paper ══════════════════════════════ */
const prism: Draw = (x, W, H, t, still) => {
  x.fillStyle = PAPER; x.fillRect(0, 0, W, H);
  const T = still ? 5 : t;
  const ox = W * 0.28, oy = H * 1.02;
  const base = -1.14 + Math.sin(T * 0.17) * 0.05;
  x.save(); x.globalCompositeOperation = "multiply";
  const SPEC = [[47, 110, 143], [14, 116, 144], [14, 124, 123], [110, 122, 99], [163, 140, 66], [163, 97, 65], [150, 62, 40]];
  SPEC.forEach((c, i) => {
    const ang = base - 0.20 + (i / (SPEC.length - 1)) * 0.40 + Math.sin(T * 0.55 + i * 0.7) * 0.010;
    const len = Math.max(W, H) * 1.9;
    const ex = ox + Math.cos(ang) * len, ey = oy + Math.sin(ang) * len;
    const g = x.createLinearGradient(ox, oy, ex, ey);
    const rgb = `rgba(${c[0]},${c[1]},${c[2]},`;
    g.addColorStop(0, rgb + "0)"); g.addColorStop(0.10, rgb + "0.30)");
    g.addColorStop(0.55, rgb + "0.16)"); g.addColorStop(1, rgb + "0)");
    x.strokeStyle = g; x.lineWidth = W * 0.062; x.lineCap = "round";
    x.beginPath(); x.moveTo(ox, oy); x.lineTo(ex, ey); x.stroke();
  });
  x.restore();
  x.beginPath();
  x.moveTo(ox - W * 0.085, oy); x.lineTo(ox + W * 0.085, oy); x.lineTo(ox, oy - H * 0.30);
  x.closePath();
  const pg = x.createLinearGradient(ox - W * 0.085, oy, ox + W * 0.085, oy - H * 0.30);
  pg.addColorStop(0, "rgba(22,36,58,.10)"); pg.addColorStop(0.5, "rgba(22,36,58,.03)");
  pg.addColorStop(1, "rgba(22,36,58,.12)");
  x.fillStyle = pg; x.fill();
  x.strokeStyle = "rgba(22,36,58,.68)"; x.lineWidth = 1.4; x.stroke();
};

const SCENES: Record<string, { draw: Draw; fps: number }> = {
  schematic: { draw: schematic, fps: 30 },
  bundle: { draw: bundle, fps: 34 },
  lattice: { draw: lattice, fps: 34 },
  contour: { draw: contour, fps: 22 },
  halftone: { draw: halftone, fps: 22 },
  prism: { draw: prism, fps: 24 },
};

export type SceneName = keyof typeof SCENES;

export function Figure({ scene, className, style }: {
  scene: SceneName; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const { draw, fps } = SCENES[scene];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, t0: number | null = null, last = 0, run = false, started = false;
    const gap = 1000 / fps;

    const fit = () => {
      const b = cv.getBoundingClientRect();
      if (!b.width) return;
      W = b.width; H = b.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      /* A resize clears the backing store, so the reduced-motion still has to
         be repainted here or it is wiped by the observer's first callback. */
      if (reduced) draw(ctx, W, H, 18, true);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(cv);

    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);
      if (!run) { t0 = null; return; }
      if (t0 === null) { t0 = ts; last = 0; }
      if (ts - t0 - last < gap) return;
      last = ts - t0;
      if (W > 4) draw(ctx, W, H, (ts - t0) / 1000, false);
    };
    const io = new IntersectionObserver(
      (e) => {
        run = e[0].isIntersecting;
        if (run && !started && !reduced) { started = true; raf = requestAnimationFrame(frame); }
      },
      { rootMargin: "180px" },
    );
    io.observe(cv);
    fit();

    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [scene]);

  return <canvas ref={ref} aria-hidden="true" className={className} style={style} />;
}
