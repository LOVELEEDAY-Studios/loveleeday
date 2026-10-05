// Builds public/site/integrations.html from src/content/integrations.json, reusing the live
// header, footer and head of public/site/trust.html so the page never drifts from the site.
// Usage: node scripts/build-integrations-page.mjs   (run after gen-integrations.mjs)
import fs from "node:fs";

const root = new URL("../", import.meta.url).pathname;
const data = JSON.parse(fs.readFileSync(root + "src/content/integrations.json", "utf8"));
const trust = fs.readFileSync(root + "public/site/trust.html", "utf8");
const MAIN_OPEN = '<main id="main" class="pub">';
const pre = trust.slice(0, trust.indexOf(MAIN_OPEN) + MAIN_OPEN.length);
const post = trust.slice(trust.indexOf("</main>"));

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const TITLE = "Integrations — LOVELEEDAY";
const DESC = `A plain directory of the ${data.items.length} accounting, CRM, commerce, property and other systems LOVELEEDAY can read, with an honest label on each: Available, Vendor approval or Coming soon.`;
const URL_ = "https://loveleedaystudios.com/integrations";

let head = pre
  .replace(/Trust center — LOVELEEDAY/g, TITLE)
  .replace(/LOVELEEDAY trust center: documents on request[^"]*?unfinished\./g, esc(DESC))
  .replace(/https:\/\/loveleedaystudios\.com\/trust/g, URL_);

const CSS = `.pub .ic-state{border:1px solid var(--line);border-radius:14px;padding:22px}
.pub .ic-state p{font-size:12.5px;color:var(--muted);line-height:1.65;margin-top:8px}
.pub .ic-bar{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:24px 0 8px}
.pub .ic-search{flex:0 1 300px;width:100%;border:1px solid #dce3ed;background:var(--wash2);border-radius:8px;padding:10px 12px;font-size:13px;color:#36475c;line-height:1.4}
.pub .ic-search:focus-visible{outline:2px solid #82b6ed;outline-offset:2px}
.pub button.tab{cursor:pointer;font-family:inherit}
.pub .ic-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:20px}
.pub .ic-card{border:1px solid var(--line);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:12px;background:#fff}
.pub .ic-card[hidden]{display:none}
.pub .ic-top{display:flex;align-items:center;gap:12px}
.pub .ic-logo{width:36px;height:36px;border:1px solid var(--line2);border-radius:8px;display:flex;align-items:center;justify-content:center;flex:none;background:#fff;overflow:hidden;font-size:13px;font-weight:600;color:var(--muted)}
.pub .ic-logo img{width:24px;height:24px;object-fit:contain}
.pub .ic-top b{display:block;font-size:14px;font-weight:550;line-height:1.3}
.pub .ic-top span.xs{color:var(--muted)}
.pub .ic-card p{font-size:12.5px;color:var(--muted);line-height:1.65;flex:1}
.pub .ic-meta{display:flex;gap:8px;flex-wrap:wrap}
.pub .ic-empty{margin-top:28px;color:var(--muted);font-size:13px}
@media(max-width:1020px){.pub .ic-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.pub .ic-grid{grid-template-columns:minmax(0,1fr)}.pub .ic-search{flex-basis:100%}.pub .tabs{overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px;max-width:100%}}`;
head = head.replace(/<style>[\s\S]*?<\/style>/, () => `<style>${CSS}</style>`);
head = head.replace(/"@type":"WebPage"/, '"@type":"CollectionPage"');

const count = (s) => data.items.filter((i) => i.status === s).length;
const STATES = [
  ["Available", "good", "You can connect this today, by signing in, sharing a key, or sending a file."],
  ["Vendor approval", "wait", "The vendor has to approve our access first. We request it with you, and nothing is read until it is granted."],
  ["Coming soon", "info", "Built, but the vendor sign-in is not switched on yet. Ask and we will tell you where it stands."],
];
const pillClass = Object.fromEntries(STATES.map(([k, c]) => [k, c]));

const order = new Map(data.groups.map((g, n) => [g.id, n]));
const items = [...data.items].sort((a, b) => order.get(a.group) - order.get(b.group) || a.name.localeCompare(b.name));
const groups = data.groups.filter((g) => items.some((i) => i.group === g.id));

const card = (i) => `<article class="ic-card" data-group="${esc(i.group)}" data-q="${esc((i.name + " " + i.vendor + " " + i.category).toLowerCase())}"><div class="ic-top"><span class="ic-logo">${i.logo ? `<img src="${esc(i.logo)}" alt="" width="24" height="24">` : esc(i.name[0])}</span><div><b>${esc(i.name)}</b><span class="xs">${esc(i.category)}</span></div></div><p>${esc(i.reads)}</p><div class="ic-meta"><span class="pill ${pillClass[i.status]}"><span class="dot${i.status === "Available" ? "" : i.status === "Vendor approval" ? " wait" : " off"}"></span>${i.status}</span><span class="pill">${esc(i.method)}</span></div></article>`;

const body = `

<section class="wrap pagehead" style="padding-top:64px"><span class="eyebrow">Integrations</span><h1 class="title" style="font-size:56px">Reads the systems<br><span>you already run.</span></h1>
<p class="lead">A directory of the ${items.length} systems LOVELEEDAY can read, and where each one stands today. Every connection is read-only, and every one carries one of three plain labels.</p></section>

<section class="wrap"><div class="grid g3">${STATES.map(([k, c, t]) => `<div class="ic-state"><div class="row between"><b style="font-size:14px">${k}</b><span class="pill ${c}">${count(k)}</span></div><p>${t}</p></div>`).join("")}</div></section>

<section class="wrap" style="padding-top:48px"><span class="eyebrow">Directory</span>
<div class="ic-bar"><div class="tabs" role="group" aria-label="Filter by category"><button class="tab on" type="button" data-f="all">All<small>${items.length}</small></button>${groups.map((g) => `<button class="tab" type="button" data-f="${esc(g.id)}">${esc(g.label)}<small>${g.count}</small></button>`).join("")}</div>
<input class="ic-search" id="ic-q" type="search" placeholder="Search systems" aria-label="Search systems" autocomplete="off"></div>
<div class="ic-grid" id="ic-grid">${items.map(card).join("")}</div>
<p class="ic-empty" id="ic-empty" hidden>Nothing matches that search. Tell us the system and we will tell you where it stands.</p></section>

<section class="wrap" style="padding-top:56px;padding-bottom:96px"><div class="panel tint row between" style="padding:36px 40px"><div><h2 class="h">Not listed?</h2><p class="muted mt8" style="max-width:520px">If your system has an export, a database or an API, we can usually read it. Tell us what you run and we will say honestly how it connects.</p></div><div class="row"><a class="btn dark" href="/studio#project-brief">Tell us what you run</a></div></div></section>
<script>(function(){var f="all",q="",cards=[].slice.call(document.querySelectorAll(".ic-card")),tabs=[].slice.call(document.querySelectorAll(".tabs .tab")),empty=document.getElementById("ic-empty");function run(){var n=0;cards.forEach(function(c){var ok=(f==="all"||c.dataset.group===f)&&(!q||c.dataset.q.indexOf(q)>-1);c.hidden=!ok;if(ok)n++});empty.hidden=n>0}tabs.forEach(function(t){t.addEventListener("click",function(){f=t.dataset.f;tabs.forEach(function(x){x.classList.toggle("on",x===t)});run()})});document.getElementById("ic-q").addEventListener("input",function(e){q=e.target.value.trim().toLowerCase();run()})})();</script>
`;
fs.writeFileSync(root + "public/site/integrations.html", head + body + post);
console.log("wrote integrations.html", items.length, "items");
