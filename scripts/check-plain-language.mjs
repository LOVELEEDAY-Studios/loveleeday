#!/usr/bin/env node
// Enforces VOICE.md on the public site: no city/region anchoring anywhere public, and no data-engineer jargon on pages
// written for owners and managers. Technical pages (architecture, integrations, trust, privacy, terms) may use the
// technical words; nothing public may anchor the company to one place.
//   node scripts/check-plain-language.mjs        exits 1 and lists each hit as page: phrase "...context..."
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const SITE = path.join(ROOT, "public/site");
const TECHNICAL = new Set(["architecture.html", "integrations.html", "trust.html", "privacy.html", "terms.html", "security.html"]);
const PLACE = /\b(kalamazoo|michigan)\b/i;
const JARGON = [
  "item master", "source coverage", "realized prices", "ingest", "entity resolution", "canonical record", "data pipeline",
  "schema", "source history", "observation", "normalized", "dedupe", "deduplicate", "ETL", "cost exposure", "supporting records",
];

const pages = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!/assets|notes/.test(e.name)) walk(p); } else if (e.name.endsWith(".html")) pages.push(p); } };
walk(SITE);

const visible = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ");
const hits = [];
for (const file of pages) {
  const rel = path.relative(SITE, file);
  const raw = fs.readFileSync(file, "utf8");
  const text = visible(raw);
  // Place anchoring counts in structured data and meta too, not only visible text.
  for (const src of [text, raw.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? ""]) {
    const m = src.match(new RegExp(`.{0,40}${PLACE.source}.{0,40}`, "i"));
    if (m) { hits.push(`${rel}: place "${m[0].trim()}"`); break; }
  }
  if (TECHNICAL.has(path.basename(file))) continue;
  for (const w of JARGON) {
    const m = text.match(new RegExp(`.{0,40}\\b${w}\\b.{0,40}`, "i"));
    if (m) hits.push(`${rel}: jargon "${w}" "${m[0].trim()}"`);
  }
}
// One example question per page (VOICE.md): the same question on two pages, or one the portal already uses, fails.
const norm = (q) => q.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/^\s*(for example:|you ask)\s*/i, "").replace(/[^a-z0-9% ]/gi, "").replace(/\s+/g, " ").trim().toLowerCase();
const ASK = [
  /<div class="eq">[\s\S]*?<span>([\s\S]*?)<\/span>/g,
  /<div class="ip-q">(?:<b>[^<]*<\/b>)?([\s\S]*?)<\/div>/g,
  /<div class="ha-ask">[\s\S]*?<dd>([\s\S]*?)<\/dd>/g,
  /<div class="tv3-q">[\s\S]*?<p>([\s\S]*?)<\/p>/g,
  /<div class="cv3-card">[\s\S]*?<p>([\s\S]*?)<\/p>/g,
  /<textarea[^>]*name="question"[^>]*placeholder="([^"]+)"/g,
  /"q":\s*"([^"]+)"/g,
];
const owner = new Map();
const voice = fs.readFileSync(path.join(ROOT, "VOICE.md"), "utf8");
for (const m of voice.matchAll(/^- (\w[\w ]*): (.+\?)$/gm)) owner.set(norm(m[2]), `${m[1]} (VOICE.md)`);
for (const file of pages) {
  const rel = path.relative(SITE, file);
  const raw = fs.readFileSync(file, "utf8");
  const mine = new Set();
  for (const re of ASK) for (const m of raw.matchAll(re)) { const q = norm(m[1]); if (q.length > 12) mine.add(q); }
  for (const q of mine) {
    if (owner.has(q)) hits.push(`${rel}: example question repeats ${owner.get(q)} "${q}"`);
    else owner.set(q, rel);
  }
}
if (hits.length) {
  console.error(`plain language: ${hits.length} hit(s) against VOICE.md\n  ` + hits.join("\n  "));
  process.exit(1);
}
console.log(`plain language: ${pages.length} pages checked against VOICE.md, clean`);
