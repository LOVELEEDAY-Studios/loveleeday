// Builds public/site/work.html and public/site/work/<slug>.html from src/content/work.ts, reusing the live
// head, header and footer of public/site/trust.html so the pages never drift from the site.
// Usage: node scripts/build-work-pages.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const root = new URL("../", import.meta.url).pathname;

// work.ts imports ./assetVersion (extensionless, which plain node cannot resolve). Swap that one import for the same
// content-hash helper, write the module to a temp file and import it, so the content has a single source of truth.
const src = fs.readFileSync(root + "src/content/work.ts", "utf8").replace(
  /import \{ v \} from "\.\/assetVersion";/,
  `import crypto from "node:crypto"; import fs from "node:fs";
const v = (p: string): string => { try { const h = crypto.createHash("sha1").update(fs.readFileSync(${JSON.stringify(root + "public/")} + p.replace(/^\\//, ""))).digest("hex").slice(0, 8); return p + "?v=" + h; } catch { return p; } };`,
);
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "work-")), "work.ts");
fs.writeFileSync(tmp, src);
const { operated, studies } = await import(tmp);
void crypto;

const trust = fs.readFileSync(root + "public/site/trust.html", "utf8");
const MAIN_OPEN = '<main id="main" class="pub">';
const pre = trust.slice(0, trust.indexOf(MAIN_OPEN) + MAIN_OPEN.length);
const post = trust.slice(trust.indexOf("</main>"));
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const BASE = "https://loveleedaystudios.com";

const CSS = `.pub .wk-row{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:20px 56px;padding:40px 0;border-top:1px solid var(--line)}
.pub .wk-row:last-child{border-bottom:1px solid var(--line)}
.pub .wk-idx{font-size:10px;letter-spacing:.16em;font-weight:600;color:#777980}
.pub .wk-row h3.h{font-size:26px;letter-spacing:-.035em;font-weight:500;margin-top:6px}
.pub .pill-list{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.pub .wk-ship{font-size:13px;color:var(--muted);margin-top:14px;line-height:1.6}
.pub .wk-body{max-width:640px;display:grid;gap:20px}
.pub .wk-body p{font-size:14px;line-height:1.7;color:var(--muted);margin-top:8px}
.pub .wk-out{border-left:2px solid var(--action);padding-left:18px}
.pub .wk-out p{color:var(--ink);margin-top:0}
.pub .wk-links{display:flex;gap:20px;flex-wrap:wrap;align-items:center}
.pub .wk-fig{border:1px solid #2a2a33;border-radius:14px;overflow:hidden;background:#13131a;margin:0}
.pub .wk-fig img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;object-position:top;border-bottom:1px solid #2a2a33}
.pub .wk-fig figcaption{padding:20px}
.pub .wk-fig .top{display:flex;justify-content:space-between;gap:12px;font-size:10px;letter-spacing:.16em;font-weight:600;text-transform:uppercase;color:#b4a697}
.pub .wk-fig p{font-size:12.5px;line-height:1.65;color:#9c9aa8;margin-top:12px}
.pub .wk-note{font-size:11px;line-height:1.6;color:#8e8d99;max-width:760px;margin-top:28px}
.pub .wk-sec{padding:96px 0}
.pub .wk-back{color:#777980;font-size:10px;letter-spacing:.16em;font-weight:600;text-transform:uppercase}
.pub .wk-case{display:grid;grid-template-columns:minmax(0,220px) minmax(0,1fr);gap:12px 56px;padding:32px 0;border-top:1px solid var(--line)}
.pub .wk-case:last-child{border-bottom:1px solid var(--line)}
.pub .wk-case p{font-size:15px;line-height:1.7;color:var(--muted);max-width:660px}
.pub .wk-case.out p{color:var(--ink);border-left:2px solid var(--action);padding-left:18px}
@media(max-width:700px){.pub .wk-row,.pub .wk-case{grid-template-columns:minmax(0,1fr);gap:16px;padding:32px 0}.pub .wk-sec{padding:64px 0}.pub .wk-row h3.h{font-size:24px}}`;

function head(title, desc, url, type = "WebPage") {
  return pre
    .replace(/Trust center — LOVELEEDAY/g, () => esc(title))
    .replace(/LOVELEEDAY trust center: documents on request[^"]*?unfinished\./g, () => esc(desc))
    .replace(/https:\/\/loveleedaystudios\.com\/trust/g, () => esc(url))
    .replace(/<style>[\s\S]*?<\/style>/, () => `<style>${CSS}</style>`)
    .replace(/"@type":"WebPage"/, `"@type":"${type}"`);
}

const cta = `<section class="wrap" style="padding-top:56px;padding-bottom:96px"><div class="panel tint row between" style="padding:36px 40px"><div><h2 class="h">Ready to start?</h2><p class="muted mt8" style="max-width:520px">Tell us what you run and what is slowing it down. A person on our team answers in writing.</p></div><div class="row"><a class="btn dark" href="/studio#project-brief">Start a project</a></div></div></section>
`;

const pills = (p) => `<ul class="pill-list">${p.tech.map((t) => `<li class="pill">${esc(t)}</li>`).join("")}</ul>`;
const live = (p) => (p.link ? `<a class="link" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">Visit the live site &#8599;</a>` : "");

const fig = (s) => `<figure class="wk-fig"><img src="${esc(s.frame)}" alt="${esc("Rebuilt " + s.sector.toLowerCase() + " site, top of page")}" width="1440" height="900" loading="lazy"><figcaption><div class="top"><span>${esc(s.id)}</span><span>${esc(s.sector)}</span></div><p>${esc(s.thesis)}</p></figcaption></figure>`;

const row = (p) => `<article class="wk-row"><div><span class="wk-idx">${esc(p.index)}</span><h3 class="h">${esc(p.title)}</h3><span class="eyebrow" style="margin-top:12px">${esc(p.category)}</span><p class="wk-ship">${esc(p.shipped)}</p>${pills(p)}</div>
<div class="wk-body"><div><span class="eyebrow">The problem</span><p>${esc(p.problem)}</p></div><div><span class="eyebrow">What we built</span><p>${esc(p.built)}</p></div><div class="wk-out"><p>${esc(p.outcome)}</p></div><div class="wk-links"><a class="btn sec sm" href="/work/${esc(p.slug)}">Read the build</a>${live(p)}</div></div></article>`;

const listBody = `

<section class="wrap pagehead" style="padding-top:64px"><span class="eyebrow">Selected work</span><h1 class="title" style="font-size:56px">Shipped, not<br><span>proposed.</span></h1>
<p class="lead">Two different things, kept separate on purpose. First, work for companies that are not ours: six sites we rebuilt without being asked, because the argument was easier to make in working HTML than in a deck. Then the five software companies LOVELEEDAY owns and runs, which show that we ship but do not show that anyone hired us.</p></section>

<section class="stage" id="studies" style="margin-top:48px;padding:80px 0"><div class="wrap"><span class="eyebrow">Uncommissioned</span><h2 class="title sm" style="max-width:640px">Thirty-eight sites. <span>Six rebuilds.</span></h2>
<p class="lead" style="max-width:640px">One venture portfolio, measured end to end on page weight, Lighthouse, live search position and accessibility. Six of the companies were then rebuilt as running pages. None of it was commissioned, and every measurement names its source.</p>
<div class="grid g3 mt48">${studies.map(fig).join("")}</div>
<p class="wk-note">The companies are not named here. Each rebuild carries measured criticism of the site it replaces, and that belongs in a private review addressed to the company rather than on a marketing page. Full packages are available on request.</p></div></section>

<section class="wrap" style="padding-top:72px"><span class="eyebrow">Companies we own and operate</span><h2 class="h" style="font-size:32px;margin:12px 0 12px">Built in-house, running in production.</h2>
<p class="muted" style="max-width:640px;font-size:14px;line-height:1.7">These are LOVELEEDAY-owned businesses. They are listed as evidence that the studio ships, not as client engagements: we were our own customer on every one of them.</p>
<div class="mt32">${operated.map(row).join("\n")}</div></section>

${cta}`;

const write = (rel, html) => {
  fs.mkdirSync(path.dirname(root + rel), { recursive: true });
  fs.writeFileSync(root + rel, html);
};

write(
  "public/site/work.html",
  head(
    "Work — LOVELEEDAY",
    "Production software from LOVELEEDAY: operations, multi-entity finance, invoice automation and internal tools, plus six uncommissioned portfolio rebuilds.",
    BASE + "/work",
    "CollectionPage",
  ) +
    listBody +
    post,
);

operated.forEach((p, i) => {
  const next = operated[(i + 1) % operated.length];
  const body = `

<section class="wrap pagehead" style="padding-top:64px"><a class="wk-back" href="/work">&larr; All work</a>
<div class="row between" style="align-items:flex-end;margin-top:28px;gap:40px"><div><span class="eyebrow">${esc(p.category)}</span><h1 class="title" style="font-size:56px">${esc(p.title)}</h1><p class="lead">${esc(p.shipped)}</p>${pills(p)}</div>${p.link ? `<div class="row"><a class="btn dark" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">Visit the live site &#8599;</a></div>` : ""}</div></section>

<section class="wrap" style="padding-top:32px"><div class="wk-case"><span class="eyebrow" style="padding-top:6px">The problem</span><p>${esc(p.problem)}</p></div><div class="wk-case"><span class="eyebrow" style="padding-top:6px">What we built</span><p>${esc(p.built)}</p></div><div class="wk-case out"><span class="eyebrow" style="padding-top:6px">Outcome</span><p>${esc(p.outcome)}</p></div></section>

<section class="wrap" style="padding-top:72px"><div class="panel tint row between" style="padding:36px 40px"><div><span class="eyebrow">Next project</span><h2 class="h mt8">${esc(next.title)}</h2><p class="muted mt8" style="max-width:520px">${esc(next.category)}</p></div><div class="row"><a class="btn sec" href="/work/${esc(next.slug)}">Read the build</a><a class="btn dark" href="/studio#project-brief">Start a project</a></div></div></section>
<div style="height:96px"></div>
`;
  write(
    `public/site/work/${p.slug}.html`,
    head(`${p.title} — LOVELEEDAY`, p.meta, `${BASE}/work/${p.slug}`) + body + post,
  );
});
console.log("wrote work.html and", operated.length, "project pages");
