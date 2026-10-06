// The share-card system's brain: finds every public page, derives what its card and its link-preview meta should be
// FROM THE PAGE ITSELF, and compares that to what is on disk. Nothing here renders (see share-card-render.mjs) and
// nothing is hand-listed: a new public/site/**/*.html is discovered, given a card and complete meta, and checked.
//
// Source of truth, highest precedence first, per field:
//   1. the page:    <meta name="card:headline" content="Line one|Line two">   (| splits white line / tan line)
//                   <meta name="card:caption" content="...">  <meta name="card:photo" content="industry-retail.jpg">
//                   <meta name="card:image" content="/site/assets/x.jpg">     (a finished 1200x630 card made elsewhere)
//   2. scripts/share-cards/config.json  pages[<rel>] and pathRules[<prefix>]  (overrides that must not touch the page)
//   3. the page's own content: h1 (<br> or a trailing <span> splits the two lines), <title>, meta description,
//      first photo in the page, else hero.jpg.
// Hidden pages (a redirect in next.config.ts covers their route, or robots noindex, or config.hidden) are skipped.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { rendererHash, fontsHash } from "./share-card-render.mjs";

export const ORIGIN = "https://loveleedaystudios.com";
export const W = 1200;
export const H = 630;
export const LIMITS = { title: 70, description: 200, imageBytes: 5 * 1024 * 1024 };
const GENERIC = new Set(["/site/assets/share.jpg", "/site/assets/share-home.jpg"]);

const sha = (b, n = 10) => crypto.createHash("sha1").update(b).digest("hex").slice(0, n);
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
export const decode = (s) => s.replace(/&(#x[0-9a-f]+|#[0-9]+|amp|lt|gt|quot|apos|nbsp);/gi, (_, v) =>
  v[0] === "#" ? String.fromCodePoint(parseInt(v.slice(v[1] === "x" ? 2 : 1), v[1] === "x" ? 16 : 10)) : ENT[v.toLowerCase()]);
const attrEsc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
export const plain = (s) => decode(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

export function paths(root) {
  return { root, site: path.join(root, "public/site"), share: path.join(root, "public/site/assets/share"), pub: path.join(root, "public") };
}
export function loadConfig() {
  return JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "..", "share-cards", "config.json"), "utf8"));
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? (e.name === "assets" ? [] : walk(path.join(d, e.name))) : e.name.endsWith(".html") ? [path.join(d, e.name)] : []);

// ---- routing: which URL a page is served at, and whether a redirect hides it --------------------------------------
const tokens = (src) => src.split(/(:\w+\([^)]*\)|:\w+\*|:\w+)/);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function routeRegex(src) {
  return new RegExp("^" + tokens(src).map((t) => {
    if (!t.startsWith(":")) return esc(t);
    const alt = t.match(/^:\w+\(([^)]*)\)$/);
    return alt ? `(?:${alt[1]})` : t.endsWith("*") ? ".*" : "[^/]+";
  }).join("") + "$");
}
export function readRouting(root) {
  const cfg = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
  const rewrites = [...cfg.matchAll(/\{\s*source:\s*["']([^"']+)["']\s*,\s*destination:\s*["']([^"']+)["']/g)]
    .map((m) => ({ source: m[1], destination: m[2] })).filter((r) => r.destination.startsWith("/site/"));
  const i = cfg.indexOf("async redirects"), j = cfg.indexOf("async headers");
  const block = i > -1 ? cfg.slice(i, j > i ? j : undefined) : "";
  const redirects = block.split(/(?=\{\s*source:)/).filter((s) => /^\{\s*source:/.test(s) && !/\bhas\s*:/.test(s))
    .map((s) => routeRegex(s.match(/source:\s*["']([^"']+)["']/)[1]));
  return { rewrites, redirects };
}
function routeFor(rel, routing) {
  for (const r of routing.rewrites) {
    const names = [...r.destination.matchAll(/:(\w+)/g)].map((m) => m[1]);
    const re = new RegExp("^" + tokens(r.destination).map((t) => (t.startsWith(":") ? "([^/]+)" : esc(t))).join("") + "$");
    const m = ("/site/" + rel).match(re);
    if (m) return names.reduce((src, n, k) => src.replace(new RegExp(`:${n}\\b`), m[k + 1]), r.source);
  }
  return rel === "index.html" ? "/" : "/" + rel.replace(/\.html$/, "");
}

// ---- reading one page -----------------------------------------------------------------------------------------------
const metaTags = (html) => [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => ({
  tag: m[0], attrs: Object.fromEntries([...m[0].matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map((a) => [a[1].toLowerCase(), decode(a[2])])),
}));
const metaVal = (tags, key) => tags.find((t) => t.attrs.name === key || t.attrs.property === key)?.attrs.content;

function deriveHeadline(html) {
  const inner = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "";
  const parts = inner.split(/<br\s*\/?>/i);
  if (parts.length > 1) return [plain(parts[0]), plain(parts.slice(1).join(" "))];
  const sp = inner.match(/^([\s\S]*?)<span\b[^>]*>([\s\S]*?)<\/span>\s*$/i);
  if (sp && plain(sp[1])) return [plain(sp[1]), plain(sp[2])];
  return [plain(inner), ""];
}

export function discover(root) {
  const cfg = loadConfig();
  const routing = readRouting(root);
  const p = paths(root);
  const pages = [];
  for (const file of walk(p.site).sort()) {
    const rel = path.relative(p.site, file).split(path.sep).join("/");
    const html = fs.readFileSync(file, "utf8");
    const tags = metaTags(html);
    const route = routeFor(rel, routing);
    const robots = metaVal(tags, "robots") || "";
    const hidden = routing.redirects.some((re) => re.test(route)) || /noindex/i.test(robots) || (cfg.hidden || []).includes(rel);
    pages.push({ file, rel, html, tags, route, hidden, url: ORIGIN + (route === "/" ? "/" : route), slug: rel === "index.html" ? "home" : rel.replace(/\.html$/, "").replace(/\//g, "-") });
  }
  return pages;
}

const photoPath = (p, ref) => (ref.startsWith("/") ? path.join(p.pub, ref) : path.join(p.site, "assets", ref));

// Everything the card and meta need, derived. `problems` collects things no build step can fix (missing photo,
// colliding slugs...) so the check can report them and the generator can refuse to guess.
export function specFor(page, root) {
  const cfg = loadConfig();
  const p = paths(root);
  const over = { ...(cfg.pathRules || []).filter((r) => page.rel.startsWith(r.prefix)).reduce((a, r) => ({ ...a, ...r }), {}), ...(cfg.pages?.[page.rel] || {}) };
  const problems = [];

  const titleRaw = (page.html.match(/<title>([^<]*)<\/title>/i) || [])[1];
  const [h1a, h1b] = deriveHeadline(page.html);
  const title = titleRaw ? plain(titleRaw) : `${[h1a, h1b].filter(Boolean).join(" ")} — LOVELEEDAY`;
  let description = metaVal(page.tags, "description");
  if (!description) {
    const lead = (page.html.match(/<p\b[^>]*class="[^"]*\blead\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i) || page.html.match(/<main[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/i) || [])[1];
    const t = lead ? plain(lead) : "";
    description = t.length > 155 ? t.slice(0, 155).replace(/\s+\S*$/, "") + "…" : t;
  }
  if (!description) problems.push("no meta description and nothing on the page to derive one from");

  const headline = (metaVal(page.tags, "card:headline") || over.headline || "").split("|").map((s) => s.trim());
  const [l1, l2] = headline[0] ? [headline[0], headline.slice(1).join(" ")] : [over.line1 || h1a, over.line2 ?? h1b];
  const baseTitle = title.replace(/\s+[—–-]\s+LOVELEEDAY.*$/, "");
  const caption = metaVal(page.tags, "card:caption") || over.caption || baseTitle;

  // A page may point at a finished card made elsewhere (the notes generator does); those are validated, not rendered.
  const ogRaw = metaVal(page.tags, "og:image") || "";
  const ogPath = ogRaw.startsWith(ORIGIN) ? ogRaw.slice(ORIGIN.length).replace(/\?.*$/, "") : "";
  const explicit = metaVal(page.tags, "card:image");
  const external = explicit || (ogPath.startsWith("/site/assets/") && !ogPath.startsWith("/site/assets/share/") && !GENERIC.has(ogPath) ? ogPath : null);

  let photo = metaVal(page.tags, "card:photo") || over.photo;
  if (!photo && !external) {
    const used = [...page.html.matchAll(/assets\/([a-z0-9-]+\.jpg)/g)].map((m) => m[1]).filter((f) => !f.startsWith("share") && fs.existsSync(path.join(p.site, "assets", f)));
    photo = used[0] || "hero.jpg";
  }
  const photoFile = photo ? photoPath(p, photo) : null;
  if (photo && !fs.existsSync(photoFile)) problems.push(`card photo not found: ${photo}`);

  const markFile = path.join(p.site, "assets/notes/mark-white.png");
  const spec = { l1, l2, caption, photo, external };
  const hash = external ? null : sha(JSON.stringify({
    spec: { l1, l2, caption }, photo: photoFile && fs.existsSync(photoFile) ? sha(fs.readFileSync(photoFile)) : photo,
    mark: fs.existsSync(markFile) ? sha(fs.readFileSync(markFile)) : null, renderer: rendererHash(), fonts: fontsHash(),
  }), 16);
  return { ...page, ogType: over.ogType || "website", title, description, ...spec, photoFile, markFile, hash, problems, cardRel: `assets/share/${page.slug}.jpg` };
}

// ---- the meta block --------------------------------------------------------------------------------------------------
export function imageUrl(s, root) {
  const p = paths(root);
  const rel = s.external ? s.external.replace(/^\/site\//, "") : s.cardRel;
  const file = path.join(p.site, rel);
  const v = fs.existsSync(file) ? sha(fs.readFileSync(file)) : "missing";
  return `${ORIGIN}/site/${rel}?v=${v}`;
}
const alt = (s) => `LOVELEEDAY — ${[s.l1, s.l2].filter(Boolean).join(" ")}`;

// Ordered, complete set. Existing tags are updated IN PLACE (so a page that is already correct is not touched at all);
// missing ones are inserted after the previous tag in this list.
export function desiredTags(s, img) {
  return [
    ["link", "rel", "canonical", "href", s.url],
    ["meta", "property", "og:type", "content", s.ogType],
    ["meta", "property", "og:site_name", "content", "LOVELEEDAY"],
    ["meta", "property", "og:title", "content", s.title],
    ["meta", "property", "og:description", "content", s.description],
    ["meta", "property", "og:url", "content", s.url],
    ["meta", "property", "og:image", "content", img],
    ["meta", "property", "og:image:width", "content", String(W)],
    ["meta", "property", "og:image:height", "content", String(H)],
    ["meta", "property", "og:image:alt", "content", alt(s)],
    ["meta", "property", "og:locale", "content", "en_US"],
    ["meta", "name", "twitter:card", "content", "summary_large_image"],
    ["meta", "name", "twitter:title", "content", s.title],
    ["meta", "name", "twitter:description", "content", s.description],
    ["meta", "name", "twitter:image", "content", img],
  ];
}

export function applyMeta(html, s, img) {
  const changes = [];
  const find = (kind, k, v) => {
    const re = kind === "link" ? new RegExp(`<link\\b[^>]*\\b${k}="${esc(v)}"[^>]*>`, "i") : new RegExp(`<meta\\b[^>]*\\b${k}="${esc(v)}"[^>]*>`, "i");
    const m = html.match(re);
    return m ? { at: m.index, tag: m[0] } : null;
  };
  const splice = (at, len, str) => { html = html.slice(0, at) + str + html.slice(at + len); };

  // Title and description first: they anchor everything else.
  if (!/<title>/i.test(html)) { const at = html.search(/<meta\b[^>]*viewport[^>]*>/i); const end = at < 0 ? html.search(/<head[^>]*>/i) : at; const m = html.slice(end).match(/^<[^>]*>/); splice(end + (m ? m[0].length : 0), 0, `<title>${attrEsc(s.title)}</title>`); changes.push("title added"); }
  if (!find("meta", "name", "description")) { const at = html.search(/<title>/i); splice(at, 0, `<meta name="description" content="${attrEsc(s.description)}">`); changes.push("meta description added"); }
  let last = html.search(/<\/title>/i) + "</title>".length;

  for (const [kind, k, v, ck, want] of desiredTags(s, img)) {
    const found = find(kind, k, v);
    const tag = kind === "link" ? `<link rel="${v}" href="${attrEsc(want)}">` : `<meta ${k}="${v}" content="${attrEsc(want)}">`;
    if (found) {
      const have = decode((found.tag.match(new RegExp(`\\b${ck}="([^"]*)"`)) || [])[1] ?? "");
      if (have !== want) { splice(found.at, found.tag.length, tag); changes.push(`${v} differs (${have.slice(0, 60) || "empty"})`); last = found.at + tag.length; }
      else last = found.at + found.tag.length;
    } else { splice(last, 0, tag); changes.push(`${v} missing`); last += tag.length; }
  }
  return { html, changes };
}

// ---- image facts without a dependency ------------------------------------------------------------------------------
export function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { type: "png", w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { type: "jpeg", h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

export const fileHash = (buf) => sha(buf, 16);
export const manifestPath =(root) => path.join(paths(root).share, "manifest.json");
export function readManifest(root) {
  try { return JSON.parse(fs.readFileSync(manifestPath(root), "utf8")); } catch { return {}; }
}

// Build the full picture once; both the generator and the check consume it.
export function plan(root) {
  const manifest = readManifest(root);
  const all = discover(root).map((pg) => specFor(pg, root));
  const pages = all.filter((s) => !s.hidden);
  const bySlug = new Map();
  for (const s of pages) bySlug.set(s.slug, [...(bySlug.get(s.slug) || []), s.rel]);
  return { manifest, all, pages, hidden: all.filter((s) => s.hidden), collisions: [...bySlug].filter(([, v]) => v.length > 1) };
}

// Every reason the cards or meta are not right. Empty array = ship. Pure read; safe in pre-push and CI.
export function checkCards(root) {
  const p = paths(root);
  const { manifest, pages, collisions } = plan(root);
  const out = [];
  const seenImg = new Map(), seenBytes = new Map();
  const owners = new Map(pages.map((s) => [imageUrl(s, root).slice(ORIGIN.length).replace(/\?.*$/, ""), s.rel]));
  for (const [slug, rels] of collisions) out.push(`share card slug "${slug}" is claimed by ${rels.join(" and ")}: rename one page`);

  for (const s of pages) {
    const at = (m) => out.push(`${s.rel}: ${m}`);
    for (const m of s.problems) at(m);
    if (s.title.length > LIMITS.title) at(`title is ${s.title.length} chars, over the ${LIMITS.title} that link previews show`);
    if (s.description.length > LIMITS.description) at(`description is ${s.description.length} chars, over the ${LIMITS.description} that link previews show`);
    if (s.description.length && s.description.length < 40) at(`description is only ${s.description.length} chars`);
    if (!s.l1) at("no headline for the card (no h1, no card:headline)");

    const img = imageUrl(s, root);
    const actual = (metaVal(s.tags, "og:image") || "").replace(ORIGIN, "").replace(/\?.*$/, "");
    const owner = owners.get(actual);
    if (owner && owner !== s.rel) at(`og:image is the card of ${owner} (${actual}): a page must not reuse another page's card`);
    const { changes } = applyMeta(s.html, s, img);
    if (changes.length) at(`share meta out of date: ${changes.join("; ")}. Run: npm run cards`);

    const imgPath = img.slice(ORIGIN.length).replace(/\?.*$/, "");
    const file = path.join(p.pub, imgPath);
    if (GENERIC.has(imgPath)) at(`og:image is the generic site card ${imgPath}`);
    if (!fs.existsSync(file)) at(`og:image file does not exist: ${imgPath}. Run: npm run cards`);
    else {
      const buf = fs.readFileSync(file);
      const sz = imageSize(buf);
      if (!sz) at(`og:image ${imgPath} is not a readable JPEG/PNG`);
      else if (sz.w !== W || sz.h !== H) at(`og:image ${imgPath} is ${sz.w}x${sz.h}, must be ${W}x${H}`);
      if (buf.length > LIMITS.imageBytes) at(`og:image ${imgPath} is ${(buf.length / 1048576).toFixed(1)} MB, over the 5 MB X/Twitter limit`);
      const sameFile = seenImg.get(imgPath), sameBytes = seenBytes.get(sha(buf, 20));
      if (sameFile) at(`reuses the card of ${sameFile} (${imgPath}); every page needs its own`);
      else if (sameBytes) at(`card ${imgPath} is byte-identical to ${sameBytes}'s; every page needs its own`);
      seenImg.set(imgPath, s.rel); seenBytes.set(sha(buf, 20), s.rel);
      const rec = manifest[s.slug];
      if (!s.external && rec?.file && rec.file !== sha(buf, 16)) at(`${imgPath} was changed by hand (not what the generator wrote). Run: npm run cards, or use <meta name="card:image"> for a custom card`);
    }
    if (!s.external) {
      const m = manifest[s.slug];
      if (!m) at(`no card recorded for it. Run: npm run cards`);
      else if (m.hash !== s.hash) at(`card is out of date with the page (headline, caption, photo or template changed). Run: npm run cards`);
      if (!imgPath.startsWith("/site/assets/share/")) at(`generated card should live in assets/share/, og:image is ${imgPath}`);
    }
  }
  const live = new Set(pages.filter((s) => !s.external).map((s) => `${s.slug}.jpg`));
  if (fs.existsSync(p.share)) for (const f of fs.readdirSync(p.share)) if (f.endsWith(".jpg") && !live.has(f)) out.push(`assets/share/${f}: orphan card (no public page uses it). Run: npm run cards`);
  return out;
}
