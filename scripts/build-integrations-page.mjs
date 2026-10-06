// Builds public/site/integrations.html from src/content/integrations.json, reusing the live
// header, footer and head of public/site/trust.html so the page never drifts from the site.
// Usage: node scripts/build-integrations-page.mjs   (run after gen-integrations.mjs)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

// Default: write public/site/integrations.html, then run the same normalising passes the prebuild runs (site-chrome,
// share-cards, site-postprocess) so the file on disk equals what ships. --check does the same in a throwaway copy of the
// repo and exits 1 if the result differs from the committed file (drift guard, run by prebuild).
const CHECK = process.argv.includes("--check");
const REAL = new URL("../", import.meta.url).pathname;
let root = REAL;
if (CHECK) {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "integrations-check-")) + "/";
  for (const d of ["scripts", "src/site-chrome", "public/site", "public/integrations"]) fs.cpSync(REAL + d, root + d, { recursive: true });
  fs.mkdirSync(root + "src/content", { recursive: true });
  for (const f of ["integrations.json", "logo-colors.json"]) fs.copyFileSync(REAL + "src/content/" + f, root + "src/content/" + f);
  for (const f of ["package.json", "tsconfig.json", "next.config.ts"]) if (fs.existsSync(REAL + f)) fs.copyFileSync(REAL + f, root + f);
  if (fs.existsSync(REAL + "node_modules")) fs.symlinkSync(REAL + "node_modules", root + "node_modules");
}
const data = JSON.parse(fs.readFileSync(root + "src/content/integrations.json", "utf8"));
const trust = fs.readFileSync(root + "public/site/trust.html", "utf8");
const MAIN_OPEN = '<main id="main" class="pub">';
const pre = trust.slice(0, trust.indexOf(MAIN_OPEN) + MAIN_OPEN.length);
const post = trust.slice(trust.indexOf("</main>")).replace(/<script src="\/site\/assets\/brain\.js[^>]*><\/script>/, "");

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const TITLE = "Integrations — LOVELEEDAY";
const DESC = "The accounting, CRM, commerce, property and other systems LOVELEEDAY connects to, read-only, by sign-in, key or file.";
const URL_ = "https://loveleedaystudios.com/integrations";

// The head is the Trust page's head. Swap in this page's own title, description and URL; the trust description is read
// from the trust page's own tag, so a reworded trust description can never leak into this page.
const trustDesc = (trust.match(/<meta name="description" content="([^"]*)"/) || [])[1];
if (!trustDesc) throw new Error("trust.html has no meta description to replace");
let head = pre
  .replace(/Trust center — LOVELEEDAY/g, TITLE)
  .split(trustDesc).join(esc(DESC))
  .replace(/https:\/\/loveleedaystudios\.com\/trust/g, URL_)
  .replace(/<link[^>]*\/site\/assets\/fix\/trust\.css[^>]*>/g, "");

const CSS = `.pub .ic-state{border:1px solid var(--line);border-radius:14px;padding:22px}
.pub .ic-state p{font-size:12.5px;color:var(--muted);line-height:1.65;margin-top:8px}
.pub .ic-bar{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:24px 0 8px}
.pub .ic-search{flex:0 1 300px;width:100%;border:1px solid #dce3ed;background:var(--wash2);border-radius:8px;padding:10px 12px;font-size:13px;color:#36475c;line-height:1.4}
.pub .ic-search:focus-visible{outline:2px solid #82b6ed;outline-offset:2px}
.pub button.tab{cursor:pointer;font-family:inherit}
.pub .ic-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:20px}
.pub .ic-card{border:1px solid transparent;border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:12px;color:#fff}
.pub .ic-card.lt{color:#111}
.pub .ic-card[hidden]{display:none}
.pub .ic-top{display:flex;align-items:center;gap:12px}
.pub .ic-logo{width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex:none;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.18)}
.pub .ic-logo img{width:26px;height:26px;object-fit:contain}
.pub .ic-top b{display:block;font-size:14.5px;font-weight:600;line-height:1.3}
.pub .ic-top span.xs{opacity:.78}
.pub .ic-card p{font-size:12.5px;line-height:1.65;flex:1;opacity:.86}
.pub .ic-soon{align-self:flex-start;font-size:11px;font-weight:600;letter-spacing:.02em;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.45)}
.pub .ic-card.lt .ic-soon{background:rgba(0,0,0,.08);border-color:rgba(0,0,0,.22)}
.pub .ic-soon[hidden]{display:none}
.pub .ic-empty{margin-top:28px;color:var(--muted);font-size:13px}
@media(max-width:1020px){.pub .ic-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.pub .ic-grid{grid-template-columns:minmax(0,1fr)}.pub .ic-search{flex-basis:100%}.pub .tabs{overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px;max-width:100%}}`;
head = head.replace(/<style>[\s\S]*?<\/style>/, () => `<style>${CSS}</style>`);
head = head.replace(/"@type":"WebPage"/, '"@type":"CollectionPage"');

// Every connector is listed. Anything a customer cannot connect today carries one label, "Coming soon" — never why
// (vendor approval, sign-in not configured are our business). The label is baked in at build time and then refreshed in
// the browser from the portal's public status endpoint, so a connector flips to live on its own once its credentials
// are set and the portal is deployed (Daniel 2026-10-05).
const order = new Map(data.groups.map((g, n) => [g.id, n]));
const items = [...data.items].sort((a, b) => order.get(a.group) - order.get(b.group) || a.name.localeCompare(b.name));
// "Available" came from connector status that reflects configuration, not a passing live sync, so a label must never read
// as a verified connection. This one states only what is true: the connector exists and can be connected.
const LIVE_LABEL = "Connection supported";
const STATUS_URL = "https://portal.loveleedaystudios.com/api/public/connector-status";
// No silent initials fallback: a listed connector without a logo file stops the build.
const noLogo = items.filter((i) => !i.logo || !i.logo.startsWith("/integrations/logos/") || !fs.existsSync(root + "public" + i.logo)).map((i) => i.key);
if (noLogo.length) throw new Error(`no logo for: ${noLogo.join(", ")}. Add public/integrations/logos/<key>.svg|png, then rerun gen-integrations.mjs`);
const groups = data.groups.map((g) => ({ ...g, count: items.filter((i) => i.group === g.id).length })).filter((g) => g.count);

// Calm directory cards (approved 2026-10-06): white card, brand colour as a thin accent (--brand), one status label.
const COLORS = JSON.parse(fs.readFileSync(root + "src/content/logo-colors.json", "utf8"));
const brand = (i) => { const c = COLORS[i.logo.split("/").pop()]; if (!/^#[0-9a-f]{6}$/i.test(c || "")) throw new Error(`missing brand colour for ${i.key}`); return c; };
// Relative luminance decides the text colour, so light brands (yellow, cyan) get dark text and stay readable.
const isLight = (hex) => { const [r, g, b] = [1, 3, 5].map((n) => parseInt(hex.slice(n, n + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.42; };
const tint = () => "background:#FFFFFF";
const card = (i) => {
  const c = brand(i), soon = i.status !== "Available";
  return `<article class="ic-card" style="--brand:${c}" data-key="${esc(i.key)}" data-group="${esc(i.group)}" data-q="${esc((i.name + " " + i.vendor + " " + i.category).toLowerCase())}"><div class="ic-top"><span class="ic-logo" style="${tint(i)}"><img src="${esc(i.logo)}" alt="" width="26" height="26"></span><div><b>${esc(i.name)}</b><span class="xs">${esc(i.category)}</span></div><span class="ic-soon" data-s="${soon ? "soon" : "available"}">${soon ? "Coming soon" : LIVE_LABEL}</span></div><p>${esc(i.reads)}</p></article>`;
};

const body = `

<section class="wrap pagehead" style="padding-top:64px"><span class="eyebrow">Integrations</span><h1 class="title" style="font-size:56px">Reads the systems<br><span>you already run.</span></h1>
<p class="lead">Every connection is read-only, and Arthur asks for your approval before writing anything back. Connectors are released system by system, and each card shows its status. If yours is not ready yet, tell us what you run.</p></section>

<section class="wrap" style="padding-top:48px"><span class="eyebrow">Directory</span>
<div class="ic-bar"><div class="tabs" role="group" aria-label="Filter by category"><button class="tab on" type="button" data-f="all">All<small>${items.length}</small></button>${groups.map((g) => `<button class="tab" type="button" data-f="${esc(g.id)}">${esc(g.label)}<small>${g.count}</small></button>`).join("")}</div>
<input class="ic-search" id="ic-q" type="search" placeholder="Search systems" aria-label="Search systems" autocomplete="off"></div>
<div class="ic-grid" id="ic-grid">${items.map(card).join("")}</div>
<p class="ic-empty" id="ic-empty" hidden>Nothing matches that search. Tell us the system you run and we will show you how it connects.</p></section>

<section class="wrap" style="padding-top:56px;padding-bottom:96px"><div class="panel tint row between" style="padding:36px 40px"><div><h2 class="h">Not listed?</h2><p class="muted mt8" style="max-width:520px">If your system has an export, a database or an API, we can usually read it. Tell us what you run and we will show you how it connects.</p></div><div class="row"><a class="btn dark" href="/studio#project-brief">Tell us what you run</a><a class="btn sec" href="/snapshot">Try the free snapshot</a></div></div></section>
<script>(function(){var f="all",q="",cards=[].slice.call(document.querySelectorAll(".ic-card")),tabs=[].slice.call(document.querySelectorAll(".tabs .tab")),empty=document.getElementById("ic-empty");function run(){var n=0;cards.forEach(function(c){var ok=(f==="all"||c.dataset.group===f)&&(!q||c.dataset.q.indexOf(q)>-1);c.hidden=!ok;if(ok)n++});empty.hidden=n>0}tabs.forEach(function(t){t.addEventListener("click",function(){f=t.dataset.f;tabs.forEach(function(x){x.classList.toggle("on",x===t)});run()})});document.getElementById("ic-q").addEventListener("input",function(e){q=e.target.value.trim().toLowerCase();run()});if(window.fetch)fetch("${STATUS_URL}",{mode:"cors"}).then(function(r){return r.ok?r.json():null}).then(function(d){if(!d||!d.connectors)return;cards.forEach(function(c){var s=d.connectors[c.dataset.key];if(s){var b=c.querySelector(".ic-soon");if(b){b.textContent=s==="available"?"${LIVE_LABEL}":"Coming soon";b.dataset.s=s==="available"?"available":"soon"}}})}).catch(function(){})})();</script>
`;
// The calm card styles live in their own sheet; link it once after the shared site.css.
const FIX = "<link rel=\"stylesheet\" href=\"/site/assets/fix/integrations.css?v=0\">";
const headOut = head.includes("assets/fix/integrations.css") ? head : head.replace(/(<link[^>]*\/site\/assets\/pub\.css[^>]*>)/, `$1${FIX}`);
const target = root + "public/site/integrations.html";
const committed = fs.readFileSync(REAL + "public/site/integrations.html", "utf8");
fs.writeFileSync(target, headOut + body + post);
for (const s of ["site-chrome.mjs", "share-cards.mjs", "site-postprocess.mjs"]) execFileSync("node", [root + "scripts/" + s], { cwd: root, stdio: "pipe" });
const out = fs.readFileSync(target, "utf8");
if (CHECK) {
  fs.rmSync(root, { recursive: true, force: true });
  if (out !== committed) {
    let i = 0; while (out[i] === committed[i]) i++;
    console.error(`integrations drift: public/site/integrations.html differs from the generator output at char ${i}\n  committed: ...${committed.slice(i - 60, i + 100)}\n  generated: ...${out.slice(i - 60, i + 100)}\nRun: node scripts/build-integrations-page.mjs`);
    process.exit(1);
  }
  console.log(`integrations in sync with generator (${items.length} items)`);
} else console.log("wrote integrations.html", items.length, "items");
