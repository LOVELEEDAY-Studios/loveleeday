// Builds public/site/integrations.html from src/content/integrations.json, reusing the head of public/site/trust.html
// and the one-brand chrome, so the page never drifts from the site. Styles live in public/site/assets/ob/integrations.css.
// Usage: node scripts/build-integrations-page.mjs   (run after gen-integrations.mjs)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

// Default: write the page, then stamp the chrome and share card so the file on disk equals what ships. --check does the
// same in a throwaway copy of the repo and exits 1 if the result differs from the committed file.
const CHECK = process.argv.includes("--check");
const REAL = new URL("../", import.meta.url).pathname;
let root = REAL;
if (CHECK) {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "integrations-check-")) + "/";
  for (const d of ["scripts", "public/site", "public/integrations"]) fs.cpSync(REAL + d, root + d, { recursive: true });
  fs.mkdirSync(root + "src/content", { recursive: true });
  for (const f of ["integrations.json", "logo-colors.json", "connector-verified.json"]) fs.copyFileSync(REAL + "src/content/" + f, root + "src/content/" + f);
  for (const f of ["package.json", "tsconfig.json", "next.config.ts"]) if (fs.existsSync(REAL + f)) fs.copyFileSync(REAL + f, root + f);
  if (fs.existsSync(REAL + "node_modules")) fs.symlinkSync(REAL + "node_modules", root + "node_modules");
}
const data = JSON.parse(fs.readFileSync(root + "src/content/integrations.json", "utf8"));
const trust = fs.readFileSync(root + "public/site/trust.html", "utf8");
const MAIN_OPEN = '<main id="main">';
if (!trust.includes(MAIN_OPEN)) throw new Error("trust.html has no main element to split on");
const pre = trust.slice(0, trust.indexOf(MAIN_OPEN) + MAIN_OPEN.length);
const post = trust.slice(trust.indexOf("</main>"));

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const TITLE = "Integrations: the business systems we plan to support — LOVELEEDAY";
const DESC = "See the business systems we plan to support and what each one could help you answer. Connections read your data and change nothing in your systems.";
const URL_ = "https://loveleedaystudios.com/integrations";

// The head is the Trust page's head with this page's own title, description and URL; the trust description is read from
// the trust page's own tag, so a reworded trust description can never leak into this page.
const trustDesc = (trust.match(/<meta name="description" content="([^"]*)"/) || [])[1];
const trustTitle = (trust.match(/<title>([^<]*)<\/title>/) || [])[1];
if (!trustDesc || !trustTitle) throw new Error("trust.html has no title or description to replace");
const head = pre
  .split(trustTitle).join(TITLE)
  .split(trustDesc).join(esc(DESC))
  .replace(/https:\/\/loveleedaystudios\.com\/trust/g, URL_)
  .replace(/(<link[^>]*\/site\/assets\/ob\/scene\.css[^>]*>)/, '$1\n<link rel="stylesheet" href="/site/assets/ob/integrations.css?v=1">');

const order = new Map(data.groups.map((g, n) => [g.id, n]));
const items = [...data.items].sort((a, b) => order.get(a.group) - order.get(b.group) || a.name.localeCompare(b.name));
// Reality ladder (Daniel 2026-10-09/11): only a connector with a passing live probe says "Ready to connect". Its keys live
// in src/content/connector-verified.json, written from the capability board. Everything else is covered by the page's
// plain statement that this is the list we plan to support, so no row carries a status of its own.
const VERIFIED = new Set(JSON.parse(fs.readFileSync(root + "src/content/connector-verified.json", "utf8")).keys);
// No silent initials fallback: a listed connector without a logo file stops the build.
const noLogo = items.filter((i) => !i.logo || !i.logo.startsWith("/integrations/logos/") || !fs.existsSync(root + "public" + i.logo)).map((i) => i.key);
if (noLogo.length) throw new Error(`no logo for: ${noLogo.join(", ")}. Add public/integrations/logos/<key>.svg|png, then rerun gen-integrations.mjs`);
const groups = data.groups.map((g) => ({ ...g, items: items.filter((i) => i.group === g.id) })).filter((g) => g.items.length);

// The list states once that a connection reads and changes nothing, so each entry names only the records.
const PLAIN = [["customer, vendor, invoice and bill", "customers, vendors, invoices and bills"], ["tenants and AR", "tenants and receivables"], ["files metadata", "file details"]];
const reads = (i) => {
  const t = PLAIN.reduce((s, [a, b]) => s.split(a).join(b), i.reads.replace(/\s*Read-only\.$/, "").replace(/^Reads /, ""));
  return t[0].toUpperCase() + t.slice(1);
};
const row = (i) => `<article class="ic-r" data-q="${esc((i.name + " " + i.vendor + " " + i.category).toLowerCase())}"><span class="ic-l"><img src="${esc(i.logo)}" alt="" width="28" height="28" loading="lazy"></span><div><h4>${esc(i.name)}${VERIFIED.has(i.key) ? ' <span class="ic-ok">Ready to connect</span>' : ""}</h4><p>${esc(reads(i))}</p></div></article>`;
// The opening wall takes the first system of each category, then the second, so it spans the directory and fills its rows.
const picks = [...groups.map((g) => g.items[0]), ...groups.map((g) => g.items[1]).filter(Boolean)].slice(0, 12);
const wall = picks.map((i) => `<span class="ic-w"><img src="${esc(i.logo)}" alt="${esc(i.name)}" width="44" height="44"></span>`).join("");

const body = `
<section class="ic-lead"><div class="ic-lead-t"><h1>Find the systems your organization already runs.</h1><p class="sc-lede">This list shows the business systems we plan to support and what each one could help you answer. A connection reads your data and changes nothing in the system, which stays where it is.</p><div class="sc-act"><a class="sc-b" href="#systems">Search the list</a><a class="sc-g" href="/contact">Tell us what you run</a></div></div><div class="ic-wall" >${wall}</div></section>
<section class="ic-dir" id="systems"><h2>Each entry lists what a connection would read.</h2><div class="ic-bar"><div class="ic-tabs" role="group" aria-label="Filter by category"><button class="on" type="button" data-f="all">All systems</button>${groups.map((g) => `<button type="button" data-f="${esc(g.id)}">${esc(g.label)}</button>`).join("")}</div><select id="ic-pick" aria-label="Filter by category"><option value="all">All systems</option>${groups.map((g) => `<option value="${esc(g.id)}">${esc(g.label)}</option>`).join("")}</select><input id="ic-q" type="search" placeholder="Search systems" aria-label="Search systems" autocomplete="off"></div>
${groups.map((g) => `<div class="ic-g" data-g="${esc(g.id)}"><h3>${esc(g.label)}</h3><div class="ic-rows">${g.items.map(row).join("")}</div></div>`).join("\n")}
<p class="ic-none" id="ic-none" hidden>No listed system matches your search. Tell us what you use, and we will check whether we can read it or work from an export.</p></section>
<section class="sc-state"><h2>What to expect from a connection.</h2><div class="sc-four t3">
<div><h3>It reads and changes nothing</h3><p>A connection reads what the system holds. If you ever want Arthur to write something back, it asks for your approval first.</p></div>
<div><h3>It is set up for your account</h3><p>We set up each connection for your organization and check the records it returns before you rely on them.</p></div>
<div><h3>An export can stand in for it</h3><p>If your system can export its data, we can often start there. We will tell you what we can read and explain any limits.</p></div>
</div></section>
<section class="ob-close">
  <div class="ob-wrap">
    <p class="ob-close-l">Tell us which systems you run.<em>A person reads every note and replies in writing.</em></p>
    <p class="ob-btns"><a class="ob-btn ob-btn--blue" href="/contact">Talk to us</a><a class="ob-btn ob-btn--ghost" href="/trust">See how we protect your data</a></p>
  </div>
</section>
<script>(function(){var f="all",q="",pick=document.getElementById("ic-pick"),tabs=[].slice.call(document.querySelectorAll(".ic-tabs button")),gs=[].slice.call(document.querySelectorAll(".ic-g")),none=document.getElementById("ic-none");function run(){var n=0;gs.forEach(function(g){var c=0;[].forEach.call(g.querySelectorAll(".ic-r"),function(r){var ok=(f==="all"||g.dataset.g===f)&&(!q||r.dataset.q.indexOf(q)>-1);r.hidden=!ok;if(ok)c++});g.hidden=!c;n+=c});none.hidden=n>0}tabs.forEach(function(t){t.addEventListener("click",function(){f=t.dataset.f;tabs.forEach(function(x){x.classList.toggle("on",x===t)});pick.value=f;run()})});pick.addEventListener("change",function(){f=pick.value;tabs.forEach(function(x){x.classList.toggle("on",x.dataset.f===f)});run()});document.getElementById("ic-q").addEventListener("input",function(e){q=e.target.value.trim().toLowerCase();run()})})();</script>
`;
const target = root + "public/site/integrations.html";
const committed = fs.readFileSync(REAL + "public/site/integrations.html", "utf8");
fs.writeFileSync(target, head + body + post);
execFileSync("node", [root + "scripts/one-brand-chrome.mjs", target], { cwd: root, stdio: "pipe" });
execFileSync("node", [root + "scripts/share-cards.mjs"], { cwd: root, stdio: "pipe" });
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
