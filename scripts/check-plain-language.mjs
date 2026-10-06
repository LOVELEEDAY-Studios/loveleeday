#!/usr/bin/env node
// Enforces VOICE.md on the public site: no city/region anchoring anywhere public, and no data-engineer jargon on pages
// written for owners and managers. Technical pages (architecture, integrations, trust, privacy, terms) may use the
// technical words; nothing public may anchor the company to one place.
//   node scripts/check-plain-language.mjs        exits 1 and lists each hit as page: phrase "...context..."
//   --root <dir>      project root holding public/site and VOICE.md (default: this repo; tests point it at a temp copy)
//   --site <dir>      override the site dir (default <root>/public/site)
//   --portal <dir>    arthur-launch checkout whose login and invite pages hold LOGIN_EXAMPLE / INVITE_EXAMPLE
//                     (default: ~/Projects/arthur-launch-auth-approved, else origin/main of ~/Projects/arthur-launch)
//   --no-portal       explicitly skip the portal link check. Without it, a missing portal source FAILS (never silently skipped).
//                     Vercel has no sibling arthur-launch checkout, so package.json "prebuild" passes --no-portal; the portal
//                     link is still enforced locally by "check:site" and "test:voice", which run without it.
//   --inventory       print every example question with its owner and source, then exit 0 (replaces the scratch qdump.py)
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const argv = process.argv.slice(2);
const opt = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };
const ROOT = path.resolve(opt("root") ?? path.join(path.dirname(new URL(import.meta.url).pathname), ".."));
const SITE = path.resolve(opt("site") ?? path.join(ROOT, "public/site"));
const HOME = process.env.HOME ?? "";
// Default portal source: the clean main worktree, else committed origin/main of the arthur-launch checkout (never its working tree).
const PORTAL = opt("portal") ? path.resolve(opt("portal")) : fs.existsSync(path.join(HOME, "Projects/arthur-launch-auth-approved/app")) ? path.join(HOME, "Projects/arthur-launch-auth-approved") : null;
const PORTAL_GIT = path.join(HOME, "Projects/arthur-launch");
const NO_PORTAL = argv.includes("--no-portal");
const INVENTORY = argv.includes("--inventory");
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
if (!INVENTORY) for (const file of pages) {
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
// Every question-bearing source feeds one list of {question, owner, source}; a repeat inside one owner passes.
const norm = (q) => q.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/^\s*(for example:|you ask)\s*/i, "").replace(/[^a-z0-9% ]/gi, "").replace(/\s+/g, " ").trim().toLowerCase();
const ASK = [
  ["html .eq", /<div class="eq">[\s\S]*?<span>([\s\S]*?)<\/span>/g],
  ["html .ip-q", /<div class="ip-q">(?:<b>[^<]*<\/b>)?([\s\S]*?)<\/div>/g],
  ["html .ha-ask", /<div class="ha-ask">[\s\S]*?<dd>([\s\S]*?)<\/dd>/g],
  ["html .tv3-q", /<div class="tv3-q">[\s\S]*?<p>([\s\S]*?)<\/p>/g],
  ["html .cv3-card", /<div class="cv3-card">[\s\S]*?<p>([\s\S]*?)<\/p>/g],
  ["html placeholder", /<textarea[^>]*name="question"[^>]*placeholder="([^"]+)"/g],
  ["html placeholder", /<(?:input|textarea)[^>]*placeholder="([^"]*\?)"[^>]*name="question"/g],
  ["html rotation q", /"q":\s*"([^"]+)"/g],
  // data-q attributes: the integrations grid uses data-q for search keywords, so only values that read as a question count.
  ["html data-q", /\sdata-q="([^"]*\?[^"]*)"/g],
];
const entries = []; // {q, owner, source}
const add = (q, owner, source) => { const n = norm(q); if (n.length > 12) entries.push({ q: n, owner, source }); };
const unescapeJs = (s) => s.replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\(['"\\])/g, "$1");
const voicePath = path.join(ROOT, "VOICE.md");
const voice = fs.existsSync(voicePath) ? fs.readFileSync(voicePath, "utf8") : "";
const registry = [];
for (const m of voice.matchAll(/^- (\w[\w -]*): (.+\?)$/gm)) { add(m[2], `${m[1]} (VOICE.md)`, "VOICE.md registry"); registry.push({ name: m[1], q: norm(m[2]) }); }

const pageRaw = new Map();
for (const file of pages) pageRaw.set(path.relative(SITE, file), fs.readFileSync(file, "utf8"));
for (const [rel, raw] of pageRaw) for (const [src, re] of ASK) for (const m of raw.matchAll(re)) add(m[1], rel, src);

// Body of the array whose opening "[" the regex ends on: bracket/brace/paren matched, strings and comments skipped, so multi-line
// arrays, nested objects and a "]" inside a string all resolve to the real closing bracket. Returns "" when absent or unclosed.
function bracketBody(src, startRe) {
  const m = startRe.exec(src); if (!m) return "";
  const open = m.index + m[0].length; let depth = 1;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === "'" || c === '"' || c === "`") { for (i++; i < src.length && src[i] !== c; i++) if (src[i] === "\\") i++; continue; }
    if (c === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "/" && src[i + 1] === "*") { const j = src.indexOf("*/", i + 2); if (j < 0) return ""; i = j + 1; continue; }
    if (c === "[" || c === "{" || c === "(") depth++;
    else if (c === "]" || c === "}" || c === ")") { if (--depth === 0) return src.slice(open, i); }
  }
  return "";
}

// assets/site.js: carousel arrays. `questions` belongs to index.html, `questionsOS` to the page with
// data-question-set="os", and each brain demo (`ask`) to the pages whose data-brain-set lists it (all brain pages if unset).
const siteJs = path.join(SITE, "assets/site.js");
const jsLabel = "assets/site.js";
if (fs.existsSync(siteJs)) {
  const js = fs.readFileSync(siteJs, "utf8");
  const arrayOf = (name) => bracketBody(js, new RegExp(`const ${name}\\s*=\\s*\\[`));
  const qs = (body) => [...body.matchAll(/(?:^|[{,\s])["']?q["']?\s*:\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")/g)].map((m) => unescapeJs(m[1] ?? m[2]));
  const osPages = [...pageRaw].filter(([, r]) => /data-question-set="os"/.test(r)).map(([rel]) => rel);
  for (const q of qs(arrayOf("questions"))) add(q, "index.html", `${jsLabel} questions`);
  for (const q of qs(arrayOf("questionsOS"))) for (const rel of osPages.length ? osPages : [`${jsLabel} questionsOS`]) add(q, rel, `${jsLabel} questionsOS`);
  const demoBody = arrayOf("brainDemos");
  if (demoBody) {
    const demos = [...demoBody.matchAll(/["']?ask["']?\s*:\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")/g)].map((m) => unescapeJs(m[1] ?? m[2]));
    const brainPages = [...pageRaw].filter(([, r]) => /id="brain-question"/.test(r));
    demos.forEach((q, i) => {
      for (const [rel, raw] of brainPages) {
        const set = (raw.match(/data-brain-set="([^"]*)"/)?.[1] ?? "").split(",").filter((x) => x !== "").map(Number);
        if (!set.length || set.includes(i)) add(q, rel, `${jsLabel} brainDemos[${i}]`);
      }
    });
  }
}

// Portal link: the sign-in and invitation pages declare LOGIN_EXAMPLE / INVITE_EXAMPLE; each must be in the VOICE.md "- portal ...:" registry.
const portalFiles = [["LOGIN_EXAMPLE", "app/client/login/page.tsx"], ["INVITE_EXAMPLE", "app/client/invite/[token]/page.tsx"]];
const portalNotes = [];
const readPortal = (rel) => {
  if (PORTAL) { const f = path.join(PORTAL, rel); return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null; }
  const r = spawnSync("git", ["-C", PORTAL_GIT, "show", `origin/main:${rel}`], { encoding: "utf8" });
  return r.status === 0 ? r.stdout : null;
};
const STR = "(?:'((?:\\\\.|[^'\\\\])*)'|\"((?:\\\\.|[^\"\\\\])*)\"|`([^`]*)`)";
if (NO_PORTAL) portalNotes.push("portal link check skipped (--no-portal)");
for (const [name, rel] of NO_PORTAL ? [] : portalFiles) {
  const src = readPortal(rel);
  if (src === null) { hits.push(`portal ${rel}: source not found (pass --portal <arthur-launch dir>, or --no-portal to skip the portal link check)`); continue; }
  // The constant is an object: const LOGIN_EXAMPLE = { ask: "...", answer: ..., next: ... }. A plain string also works.
  const m = src.match(new RegExp(`\\b${name}\\b[^=\\n]*=\\s*\\{[^}]*?\\bask\\s*:\\s*${STR}`)) ?? src.match(new RegExp(`\\b${name}\\b[^=\\n]*=\\s*${STR}`));
  if (!m) { hits.push(`portal ${rel}: ${name} (with an ask field) not found, so the registry link cannot be checked`); continue; }
  const q = unescapeJs(m[1] ?? m[2] ?? m[3]);
  if (!registry.some((r) => /^portal\b/.test(r.name) && r.q === norm(q))) hits.push(`portal ${rel}: ${name} "${norm(q)}" is missing from the VOICE.md "- portal ...:" registry lines`);
}

if (INVENTORY) {
  const w = Math.max(...entries.map((e) => e.owner.length), 5);
  for (const e of entries.sort((a, b) => a.owner.localeCompare(b.owner))) console.log(`${e.owner.padEnd(w)}  ${e.source.padEnd(34)}  ${e.q}`);
  console.log(`\n${entries.length} questions, ${new Set(entries.map((e) => e.owner)).size} owners`);
  for (const n of portalNotes) console.log(n);
  if (hits.length) console.log(hits.join("\n"));
  process.exit(0);
}

const byQ = new Map();
for (const e of entries) { if (!byQ.has(e.q)) byQ.set(e.q, new Map()); const o = byQ.get(e.q); if (!o.has(e.owner)) o.set(e.owner, e.source); }
for (const [q, owners] of byQ) {
  if (owners.size < 2) continue;
  hits.push(`${[...owners.keys()].join(" and ")}: both ask "${q}" (${[...owners].map(([o, s]) => `${o} [${s}]`).join(" vs ")})`);
}
if (hits.length) {
  console.error(`plain language: ${hits.length} hit(s) against VOICE.md\n  ` + hits.join("\n  "));
  process.exit(1);
}
console.log(`plain language: ${pages.length} pages and ${entries.length} questions checked against VOICE.md, clean`);
