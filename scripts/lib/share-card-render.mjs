// Pure-Node renderer for the LOVELEEDAY 1200x630 share card: satori (layout to SVG, text becomes paths, so no system
// font is needed) + sharp (photo crop and JPEG encode). No headless browser, so it runs the same on a laptop and in
// Vercel's build container. The template is the notes-card template: full-bleed photo under a dark wash, white heart
// and wordmark top left, white first line, tan second line, small caption bottom left.
// The sha1 of THIS file is part of every card's content hash (see share-cards.mjs), so editing the template re-renders
// every card on the next build with nobody having to remember to.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const W = 1200;
export const H = 630;
const HERE = import.meta.dirname;
const FONT_DIR = path.join(HERE, "..", "share-cards", "fonts");
const FONT_FILES = { 400: "inter-latin-400-normal.woff", 600: "inter-latin-600-normal.woff", 700: "inter-latin-700-normal.woff" };
const TAN = "#d5b185";
const MAX_W = 1040; // 1200 less 80px each side

export const rendererHash = () => crypto.createHash("sha1").update(fs.readFileSync(import.meta.filename)).digest("hex");
export const fontsHash = () => crypto.createHash("sha1").update(Object.values(FONT_FILES).map((f) => fs.readFileSync(path.join(FONT_DIR, f))).join("")).digest("hex");

let _deps;
async function deps() {
  if (_deps) return _deps;
  const [{ default: satori }, { default: sharp }, ot] = await Promise.all([import("satori"), import("sharp"), import("opentype.js")]);
  const buf = Object.fromEntries(Object.entries(FONT_FILES).map(([w, f]) => [w, fs.readFileSync(path.join(FONT_DIR, f))]));
  const parse = (b) => (ot.default || ot).parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
  _deps = {
    satori, sharp,
    fonts: [400, 600, 700].map((w) => ({ name: "Inter", data: buf[w], weight: w, style: "normal" })),
    measure: parse(buf[700]),
  };
  return _deps;
}

// Width of a string at a size, with the template's -0.045em tracking.
// Advance widths are summed per glyph with pair kerning. opentype.js's own getAdvanceWidth runs the GSUB table, which
// throws on some lookup types in Inter, and the text only needs measuring, not shaping.
const advance = (font, text, size) => {
  const g = [...text].map((c) => font.charToGlyph(c));
  let w = 0;
  g.forEach((x, i) => { w += x.advanceWidth + (i ? font.getKerningValue(g[i - 1], x) : 0); });
  return (w * size) / font.unitsPerEm;
};
const widthOf = (font, text, size) => advance(font, text, size) - 0.045 * size * text.length;

function wrap(font, text, size) {
  const out = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && widthOf(font, next, size) > MAX_W) { out.push(line); line = word; } else line = next;
  }
  if (line) out.push(line);
  return out;
}

function ellipsize(font, text, size, maxW, tracking) {
  const w = (t) => advance(font, t, size) + tracking * size * t.length;
  if (w(text) <= maxW) return text;
  let t = text;
  while (t.length > 1 && w(t + "…") > maxW) t = t.slice(0, -1);
  return t.trimEnd() + "…";
}

// Headline fit: keep each of the two lines on one line and shrink 66 -> 52px; failing that, wrap to at most three
// lines between 60 and 44px; last resort, truncate. A long headline can therefore never overflow or collide.
export function layoutHeadline(font, l1, l2) {
  const logical = [[l1, false], [l2, true]].filter(([t]) => t);
  for (let size = 66; size >= 52; size -= 2) {
    if (logical.every(([t]) => widthOf(font, t, size) <= MAX_W)) return { size, lines: logical.map(([t, tan]) => ({ t, tan })) };
  }
  for (let size = 60; size >= 44; size -= 2) {
    const lines = logical.flatMap(([t, tan]) => wrap(font, t, size).map((x) => ({ t: x, tan })));
    if (lines.length <= 3 && lines.every((l) => widthOf(font, l.t, size) <= MAX_W)) return { size, lines };
  }
  return { size: 44, lines: logical.map(([t, tan]) => ({ t: ellipsize(font, t, 44, MAX_W, -0.045), tan })) };
}

const el = (type, style, children, extra = {}) => ({ type, props: { style, ...(children !== undefined ? { children } : {}), ...extra } });

export async function renderCard({ l1, l2, caption, photoFile, markFile }) {
  const { satori, sharp, fonts, measure } = await deps();
  const photo = await sharp(photoFile).resize(W, H, { fit: "cover", position: "centre" }).jpeg({ quality: 92 }).toBuffer();
  const photoUri = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const markUri = `data:image/png;base64,${fs.readFileSync(markFile).toString("base64")}`;
  const { size, lines } = layoutHeadline(measure, l1, l2);
  const cap = ellipsize(measure, caption, 21, MAX_W, 0);

  const tree = el("div", { display: "flex", position: "relative", width: W, height: H, color: "#fff", fontFamily: "Inter", backgroundColor: "#000" }, [
    el("img", { position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover" }, undefined, { src: photoUri, width: W, height: H }),
    el("div", { position: "absolute", left: 0, top: 0, width: W, height: H, backgroundImage: "linear-gradient(0deg, rgba(12,11,10,0.86) 0%, rgba(12,11,10,0.55) 50%, rgba(12,11,10,0.5) 100%)" }, ""),
    el("div", { position: "absolute", left: 80, top: 60, display: "flex", alignItems: "center", fontSize: 17, letterSpacing: 3.4, fontWeight: 600 }, [
      el("img", { width: 24, height: 24, marginRight: 12 }, undefined, { src: markUri, width: 24, height: 24 }),
      el("div", { display: "flex" }, "LOVELEEDAY"),
    ]),
    el("div", { position: "absolute", left: 80, right: 80, bottom: 64, display: "flex", flexDirection: "column" }, [
      ...lines.map((l) => el("div", { display: "flex", fontSize: size, lineHeight: 1.04, letterSpacing: -0.045 * size, fontWeight: 700, color: l.tan ? TAN : "#fff" }, l.t)),
      el("div", { display: "flex", marginTop: 24, fontSize: 21, fontWeight: 400, color: "rgba(255,255,255,0.78)" }, cap),
    ]),
  ]);

  const svg = await satori(tree, { width: W, height: H, fonts });
  return sharp(Buffer.from(svg)).resize(W, H).jpeg({ quality: 84 }).toBuffer();
}
