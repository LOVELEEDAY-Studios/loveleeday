#!/usr/bin/env node
// One 1200x630 link-preview card per public page, in the same template as the notes cards
// (scripts/build-notes.py): full-bleed photo under a dark wash, white heart + wordmark, white first
// line, tan second line, small caption. Headline = the page's own two-line h1; caption = its title.
// Writes public/site/assets/share/<slug>.jpg and points og:image + twitter:image at it.
// Usage: PW_EXEC=<chrome> node scripts/build-page-cards.mjs     (needs playwright resolvable from ~/arthur)
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(path.join(os.homedir(), "arthur", "package.json"));
const { chromium } = require("playwright");
const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "public/site");
const OUT = path.join(SITE, "assets/share");
fs.mkdirSync(OUT, { recursive: true });

const photoFor = {
  "integrations.html": "operating-system.jpg", "privacy.html": "outdoors.jpg", "terms.html": "industry-government.jpg",
  "snapshot.html": "industry-retail.jpg", "trust.html": "industry-nonprofit.jpg", "work.html": "hero.jpg",
  "work/dabney.html": "dinner.jpg", "work/hospitality-ops.html": "industries.jpg", "work/kronos.html": "industry-portfolios.jpg",
  "work/duezy.html": "industry-professional-services.jpg", "work/olldae.html": "industry-hospitality.jpg",
  "industries.html": "industries.jpg",
};
const e = (s) => s.replace(/&(?!amp;|#)/g, "&amp;").replace(/</g, "&lt;");
const text = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, " ").trim();

const pages = execFileSync("grep", ["-rlE", "assets/share(\\.jpg|/[a-z0-9-]+\\.jpg)", SITE, "--include=*.html"]).toString().trim().split("\n").sort();
const cards = [];
for (const file of pages) {
  const rel = path.relative(SITE, file);
  const html = fs.readFileSync(file, "utf8");
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "";
  let [l1, l2 = ""] = h1.split(/<br[^>]*>/).map(text);
  const title = text((html.match(/<title>([^<]*)/) || [])[1] || "").replace(/\s+[—-]\s+LOVELEEDAY.*$/, "");
  const desc = text((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "");
  let sub = title;
  if (rel.startsWith("work/")) { l2 = "Selected work."; sub = "Case study"; }
  const photo = photoFor[rel] || (html.match(/assets\/([a-z0-9-]+\.jpg)/g) || []).map((m) => m.slice(7)).find((p) => !p.startsWith("share")) || "hero.jpg";
  const slug = rel.replace(/\.html$/, "").replace(/\//g, "-");
  cards.push({ rel, slug, l1, l2, sub, photo, file });
}

const A = `file://${SITE}/assets/`;
const css = "body{margin:0;background:#000;font-family:-apple-system,Helvetica,Arial,sans-serif}" +
  ".card{width:1200px;height:630px;position:relative;overflow:hidden;color:#fff}" +
  ".ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}" +
  ".card::after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(12,11,10,.86) 0%,rgba(12,11,10,.55) 50%,rgba(12,11,10,.5) 100%)}" +
  ".brand{position:absolute;z-index:1;left:80px;top:60px;display:flex;align-items:center;gap:12px;font-size:17px;letter-spacing:.2em;font-weight:600}" +
  ".brand img{width:24px;height:24px}.txt{position:absolute;z-index:1;left:80px;right:80px;bottom:64px}" +
  "h1{font-size:66px;line-height:1.04;letter-spacing:-.045em;font-weight:600;margin:0}h1 span{color:#d5b185}" +
  "p{font-size:21px;color:rgba(255,255,255,.78);margin:24px 0 0}";
const doc = `<!doctype html><meta charset=utf-8><style>${css}</style>` + cards.map((c) =>
  `<div class="card" id="c-${c.slug}"><img class="ph" src="${A}${c.photo}" alt=""><div class="brand"><img src="${A}notes/mark-white.png" alt="">LOVELEEDAY</div>` +
  `<div class="txt"><h1>${e(c.l1)}${c.l2 ? `<br><span>${e(c.l2)}</span>` : ""}</h1><p>${e(c.sub)}</p></div></div>`).join("");
const tmp = path.join(os.tmpdir(), "ll-page-cards.html");
fs.writeFileSync(tmp, doc);

const b = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : {});
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto(`file://${tmp}`, { waitUntil: "load" });
for (const c of cards) {
  await p.locator(`#c-${c.slug}`).screenshot({ path: path.join(OUT, `${c.slug}.jpg`), type: "jpeg", quality: 84 });
  const url = `https://loveleedaystudios.com/site/assets/share/${c.slug}.jpg`;
  const html = fs.readFileSync(c.file, "utf8").replace(/https:\/\/loveleedaystudios\.com\/site\/assets\/share(\.jpg|\/[a-z0-9-]+\.jpg)/g, url);
  fs.writeFileSync(c.file, html);
  console.log(`${c.rel.padEnd(32)} ${c.photo.padEnd(34)} ${c.l1} / ${c.l2}`);
}
await b.close();
console.log(`${cards.length} cards -> public/site/assets/share/`);
