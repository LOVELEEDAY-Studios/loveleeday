// build-mockups.mjs : writes <id>-before.html / <id>-after.html for each pair, plus index.json (metadata for render + board).
// Before = faithful recreation of the live section (befores.mjs, extracted verbatim; do not restyle).
// After  = the proposed fix. LOVELEEDAY colors ONLY (concepts/BRAND-COLORS.md); Switzer + Sentient; each after is benchmarked
// against sections from Stripe, Linear, Ramp, Vercel, Notion, Snowflake, Datadog (refs-bench/refs.json).
import fs from 'node:fs';
import path from 'node:path';
import { BEFORE_CSS, BEFORES } from './befores.mjs';
const dir = path.dirname(new URL(import.meta.url).pathname);
const BENCH = JSON.parse(fs.readFileSync(path.join(dir, '../refs-bench/refs.json'), 'utf8'));

const AFTER_CSS = `
@import url('../fonts.css');
:root{--ink:#1d1d1f;--muted:#62656c;--blue:#0066cc;--blueh:#0059b3;--fig:#0071e3;--surf:#f5f5f7;--panel:#fafbfd;--cream:#f5f1eb;--warm:#6f6253;--warm2:#85786a;--rule:#ded8cd;
--dark:#0b0b10;--dark2:#101114;--brown:#231a11;--line:#e4e5e9;--line2:#edf0f4;--wash:#eaf1fb;--washb:#cadcf3;--washt:#3d71ac;--ok:#2f6b4f;--warn:#8a4b1d;--tan:#e0b48a;--warnwash:#fbf0e7;
--head:'Switzer',-apple-system,sans-serif;--ans:'Sentient',Georgia,serif;
--sh:0 1px 2px rgba(29,29,31,.06),0 8px 24px -10px rgba(29,29,31,.12),0 28px 56px -28px rgba(29,29,31,.16);
--dsh:0 1px 0 rgba(255,255,255,.06) inset,0 24px 60px -24px rgba(0,0,0,.6)}
*{box-sizing:border-box}
body{margin:0;font-family:var(--head);font-size:16px;line-height:1.6;color:var(--ink);background:#fff;-webkit-font-smoothing:antialiased;font-feature-settings:"ss01"}
.wrap{width:min(1120px,calc(100% - 96px));margin-inline:auto}
.dark{background:var(--dark);color:#fff}.cream{background:var(--cream)}.surf{background:var(--surf)}
h1,h2,h3,h4{font-family:var(--head);font-weight:600;margin:0;color:inherit}
.d1{font-size:60px;line-height:1.03;letter-spacing:-.038em}
.d2{font-size:40px;line-height:1.08;letter-spacing:-.03em}
.d3{font-size:28px;line-height:1.2;letter-spacing:-.022em}
.h4{font-weight:600;font-size:18px;line-height:1.35;letter-spacing:-.01em}
p{margin:0;color:var(--muted)}
.dark p{color:rgba(255,255,255,.66)}.cream p{color:var(--warm)}
.lead{font-size:20px;line-height:1.5;letter-spacing:-.008em}
.sm{font-size:14px;line-height:1.5}.xs{font-size:13px;line-height:1.45}
.btn{background:var(--blue);color:#fff;border-radius:999px;padding:0 22px;height:44px;display:inline-flex;align-items:center;font-size:15px;font-weight:500;text-decoration:none;white-space:nowrap}
.btn:hover{background:var(--blueh)}
.btn.sec{background:#fff;color:var(--ink);box-shadow:0 0 0 1px var(--line),0 1px 2px rgba(29,29,31,.06)}
.dark .btn.sec{background:transparent;color:#fff;box-shadow:0 0 0 1px rgba(255,255,255,.22)}
.tl{color:var(--blue);font-weight:500;text-decoration:none;font-size:15px}.tl:hover{color:var(--blueh)}
.dark .tl{color:#fff}
.cols{display:grid;grid-template-columns:var(--c);gap:var(--gap,64px);align-items:var(--al,start)}
.app{background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:var(--sh);overflow:hidden;color:var(--ink)}
.app p{color:var(--muted)}
.sc{overflow-x:auto}
.tbl{width:100%;border-collapse:collapse;font-size:14px;font-variant-numeric:tabular-nums;line-height:1.4}
.tbl th{text-align:left;font-weight:500;color:var(--muted);font-size:13px;padding:10px 20px;border-bottom:1px solid var(--line);background:var(--panel);white-space:nowrap}
.tbl td{padding:13px 20px;border-bottom:1px solid var(--line2);white-space:nowrap}
.tbl tr:last-child td{border-bottom:0}
.tbl .r{text-align:right}.tbl td.w{white-space:normal}
.tbl b{font-weight:600}
.mu{color:var(--muted)}.ok{color:var(--ok)}.wn{color:var(--warn)}
.st{display:inline-flex;align-items:center;gap:8px;font-weight:500}
.st:before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor}
.av{width:36px;height:36px;border-radius:8px;background:var(--surf);box-shadow:0 0 0 1px var(--line) inset;display:inline-flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;color:var(--ink);flex:none}
.dcard{background:var(--dark2);border:1px solid rgba(255,255,255,.1);border-radius:14px;box-shadow:var(--dsh);overflow:hidden}
.ico{display:inline-block;vertical-align:-3px;flex:none}
@media(max-width:900px){.wrap{width:calc(100% - 40px)}.cols{--c:1fr!important;--gap:32px!important}.cols>*{grid-column:auto!important;grid-row:auto!important}.d1{font-size:40px}.d2{font-size:32px}.d3{font-size:24px}.lead{font-size:18px}}
`;

const P = {
  doc: '<path d="M4 1.8h5l3 3v9.4H4z"/><path d="M9 1.8v3h3"/>',
  mail: '<rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="m2.5 4.8 5.5 4 5.5-4"/>',
  receipt: '<path d="M3.5 1.8h9v12.4l-2-1.2-2.5 1.2-2.5-1.2-2 1.2z"/><path d="M6 5.5h4M6 8h4"/>',
  clock: '<circle cx="8" cy="8" r="6"/><path d="M8 4.6V8l2.2 1.4"/>',
  alert: '<path d="M8 2.2 14.3 13H1.7z"/><path d="M8 6.6v3M8 11.4v.1"/>',
  check: '<path d="m3 8.5 3.2 3L13 4.5"/>',
  users: '<circle cx="6" cy="5.5" r="2.4"/><path d="M1.8 13c.4-2.3 2.1-3.5 4.2-3.5s3.8 1.2 4.2 3.5"/><path d="M10.5 3.4a2.3 2.3 0 0 1 0 4.2M12 9.7c1.3.5 2.1 1.6 2.4 3.3"/>',
  building: '<rect x="3" y="2" width="10" height="12" rx="1"/><path d="M6 5h1M9 5h1M6 8h1M9 8h1M7 14v-3h2v3"/>',
  search: '<circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3.5 3.5"/>',
  home: '<path d="M2.5 7.5 8 2.8l5.5 4.7V13.5h-11z"/><path d="M6.5 13.5v-3.5h3v3.5"/>',
  link: '<path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.7.7"/><path d="M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.7-.7"/>',
  plug: '<path d="M6 2v3M10 2v3M4.5 5h7v2.5a3.5 3.5 0 0 1-7 0zM8 11v3"/>',
  chat: '<path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z"/>',
  gear: '<circle cx="8" cy="8" r="2.2"/><path d="M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1"/>'
};
const ic = (n, s = 16) => `<svg class="ico" width="${s}" height="${s}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

const M = [];
const add = (id, title, tell, count, source, after, extra = {}) => M.push({ id, title, tell, count, source, after, ...extra });

// 01
add('01-two-tone-headline', 'Two-part, two-tone headline', 'Two short sentences, the second in gray. Same device on 54 of 185 headings.', '54 of 185 h1/h2 two-part; 46 percent two-tone', 'S1 generic slogans; S2 accenting one headline part; S11 two fragments glued together',
  `<section style="padding:112px 0"><div class="wrap cols" style="--c:5fr 7fr;--gap:72px;--al:center">
<div><h2 class="d2" style="max-width:22ch">Your systems each know a piece. We put the pieces together.</h2>
<p class="lead" style="margin-top:24px;max-width:44ch">Accounting, billing, support and contracts all describe the same customer in different words. We match them into one record and keep the source behind every fact.</p>
<div style="margin-top:32px;display:flex;gap:28px;align-items:center;flex-wrap:wrap"><a class="btn">See a worked example</a><a class="tl">How matching works</a></div></div>
<div class="app"><div style="display:flex;align-items:center;gap:14px;padding:18px 20px;border-bottom:1px solid var(--line)"><span class="av">HE</span><div style="flex:1"><div class="h4">Harbor Equipment Services</div><div class="xs mu">Vendor &middot; 4 systems matched into one record</div></div><span class="st ok xs">Confirmed Oct 9</span></div>
<div class="sc"><table class="tbl"><tr><th>System</th><th>Name on file</th><th>What we found</th><th class="r">Last seen</th></tr>
<tr><td>Ledger</td><td><b>Vendor 44127</b></td><td class="mu">1,208 payments</td><td class="r mu">Oct 7, 2026</td></tr>
<tr><td>Mailbox</td><td><b>HES</b></td><td class="mu">61 threads</td><td class="r mu">Oct 9, 2026</td></tr>
<tr><td>Contracts</td><td><b>Harbor Equipment Services</b></td><td class="mu">Agreement 2024-117</td><td class="r mu">Jan 9, 2027</td></tr>
<tr><td>Support</td><td><b>Harbor Equip.</b></td><td class="mu">3 tickets, 1 open</td><td class="r mu">Sep 22, 2026</td></tr></table></div>
<div style="display:flex;gap:10px;align-items:center;padding:14px 20px;border-top:1px solid var(--line);background:var(--panel)" class="xs mu">${ic('link', 14)}<span>Every fact links to the page it came from. Example data.</span></div></div></div></section>`);

// 02
const spec02 = (items) => `<div class="sc"><div style="display:flex;border:1px solid var(--line);border-radius:10px;margin-top:28px;min-width:620px">${items.map((x, i) => `<div style="flex:1;padding:14px 18px;${i ? 'border-left:1px solid var(--line)' : ''}"><div class="xs mu">${x[0]}</div><div style="font-size:20px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums">${x[1]}</div></div>`).join('')}</div></div>`;
add('02-eyebrow-labels', 'Tracked all-caps label above every heading', '10px uppercase labels with wide tracking on every section. 562 across 35 pages, 85 percent at 10px.', '562 labels, mean 16 per page, 42 on home', 'S5 excessive letter spacing; S2 tracked all-caps eyebrows over every heading',
  `<section style="padding:32px 0 56px"><div class="wrap">${[
    ['One picture across every system', 'Ledger, mailbox, contracts and support are read side by side, so a question about a customer gets one answer instead of four.', 'See how records connect', [['Ledger', '12,408'], ['Billing', '3,112'], ['Support', '9,870'], ['Contracts', '214'], ['Mailbox', '41,006']]],
    ['The system behind each answer', 'Every answer lists the records it used and when we learned each one. Open any of them to read the original.', 'Read a sample answer', [['Answered', 'Oct 9, 2:14 PM'], ['Sources used', '4'], ['Changed since March', '2']]],
    ['The same method in very different organizations', 'A cocktail bar, a charter school and a property manager ask different questions of the same kind of data.', 'Find your industry', [['Dabney & Co.', '8 systems'], ['Lakeshore Charter', '5 systems'], ['Meridian Property', '11 systems']]]
  ].map((r, i) => `<div style="padding:56px 0;${i ? 'border-top:1px solid var(--line)' : ''}"><div class="cols" style="--c:5fr 6fr;--gap:96px"><h2 class="d2" style="max-width:23ch">${r[0]}</h2><div><p class="lead" style="max-width:40ch">${r[1]}</p><p style="margin-top:16px"><a class="tl">${r[2]}</a></p></div></div>${spec02(r[3])}</div>`).join('')}</div></section>`);

// 03 font stack (pair rebuilt: font half only, both sides on brand colors)
const sec03 = (after) => {
  const F = after ? "font-family:var(--head)" : '';
  const hs = after ? 'font-size:56px;letter-spacing:-.035em;font-weight:600;line-height:1.04' : 'font-size:56px;letter-spacing:-.045em;font-weight:500;line-height:1.08';
  const ans = after ? "font-family:var(--ans);font-size:25px;line-height:1.32;letter-spacing:-.005em;font-weight:400" : 'font-size:20px;line-height:1.4;font-weight:500;letter-spacing:-.01em';
  return `<section style="padding:96px 0;background:#fff"><div class="wrap cols" style="--c:1fr 1fr;--gap:64px;--al:start;${F}">
<div><h1 style="${hs};margin-bottom:20px">Know what happened.</h1><p style="${after ? 'font-size:20px;line-height:1.5;color:#62656c;max-width:36ch;margin-bottom:28px' : 'font-size:18px;line-height:1.65;max-width:38ch;margin-bottom:28px'}">LOVELEEDAY reads the systems you already use and gives you a plain-language answer, with the source behind every figure.</p>
<div style="display:flex;gap:24px;align-items:center"><a class="${after ? 'btn' : 'btn'}" style="${after ? 'font-family:var(--head)' : ''}">See how it works</a><a class="${after ? 'tl' : 'link'}" style="${after ? 'font-family:var(--head)' : ''}">Find your industry</a></div></div>
<div style="background:#f5f5f7;border-radius:${after ? '12px' : '18px'};padding:28px"><div style="${after ? 'font-size:14px;color:#62656c;margin-bottom:10px' : 'font-size:13px;color:#62656c;margin-bottom:10px'}">You asked</div><div style="${after ? 'font-size:17px;font-weight:500;letter-spacing:-.01em' : 'font-size:16px;font-weight:500'};margin-bottom:22px">Which customers are waiting on the late part?</div>
<div style="${ans};color:#1d1d1f;padding-top:20px;border-top:1px solid #e4e5e9">14 orders across 6 customers are waiting. The East batch failed inspection on Oct 3, so those dates will slip.</div>
<div style="font-size:13px;color:#62656c;margin-top:18px;${after ? 'font-family:var(--head)' : ''}">Sources: open orders, inspection record. Example data.</div></div></div>
<div class="wrap" style="margin-top:40px;font-size:13px;color:#62656c;${after ? "font-family:var(--head)" : ''}">${after ? 'Switzer for headlines and text, Sentient only for the answer.' : 'Font: -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial'}</div></section>`;
};
add('03-font-stack', 'System default font stack', 'Every character on the site is set in -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial: the browser default, so the type carries no choice of its own.', '100 percent of 182,485 characters in the system stack', 'S8 stock tokens are a palette; S14 SF license and Apple-clone note; typography-mastery SF Pro entries',
  sec03(true), { before: sec03(false) });

// 04
const row04 = (n, size, lh, w, track, fam, text, spec) => `<div style="padding:18px 0 20px;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between;gap:16px;margin-bottom:8px" class="xs mu"><span>${n}</span><span style="font-variant-numeric:tabular-nums">${spec}</span></div><div style="font:${w} ${size}px/${lh}px ${fam};letter-spacing:${track}">${text}</div></div>`;
add('04-type-scale', 'No type scale: 13 heading sizes, one weight', 'h2 sizes: 26, 30, 34, 36, 38, 40, 44, 48, 50, 52, 60, 62 px; 98 percent at weight 500 with -0.045em tracking.', '13 distinct h2 sizes; 98 percent weight 500', 'S12 arbitrary sizes, everything equally important; S13 modular scale, two to three weights',
  `<section style="padding:80px 0"><div class="wrap cols" style="--c:7fr 5fr;--gap:72px"><div><h2 class="d3" style="margin-bottom:8px">Type scale</h2><p class="sm" style="margin-bottom:20px;max-width:52ch">Six sizes, two weights. Switzer carries headlines and text; Sentient is reserved for answers.</p>
${row04('Display', 56, 58, 600, '-.035em', 'var(--head)', 'Know what happened', '56 / 58, 600, -3.5%')}${row04('Heading', 40, 44, 600, '-.03em', 'var(--head)', 'Every answer shows its source', '40 / 44, 600, -3%')}${row04('Subhead', 28, 34, 600, '-.022em', 'var(--head)', 'One company, three names', '28 / 34, 600, -2.2%')}${row04('Lead', 20, 30, 400, '-.008em', 'var(--head)', 'We keep the source behind each fact', '20 / 30, 400, -0.8%')}${row04('Body', 16, 26, 400, '0', 'var(--head)', 'Contracts, policies and reports sit beside the ledger.', '16 / 26, 400')}${row04('Answer', 24, 32, 400, '-.005em', 'var(--ans)', '14 orders are waiting on one batch.', 'Sentient 24 / 32, 400')}</div>
<div class="app" style="padding:36px 36px 40px"><h3 class="d3" style="margin-bottom:12px">What a late batch costs</h3><p style="font-size:16px;line-height:26px;margin-bottom:20px">The East batch failed inspection on Oct 3. Fourteen open orders depend on it, across six customers.</p>
<div style="font-family:var(--ans);font-size:24px;line-height:32px;color:var(--ink);padding:20px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-bottom:16px">Call the three customers with penalty clauses first.</div><p class="xs">Sources: open orders, inspection record, contract 2024-117. Example data.</p></div></div></section>
`);

// 05 hero
add('05-hero-photo-card', 'Product card pasted over the hero photo', 'A floating white card of four tracked labels sits across the photo and hides her hands; the same card repeats on the portal sign-in.', 'home hero, portal sign-in, snapshot', 'S5 decoration cosplaying as information; S7 uniform sections; our crop rule (no overlap on faces or hands)',
  `<section style="padding:0"><div class="wrap cols" style="--c:6fr 6fr;--gap:0;--al:stretch;min-height:560px;padding-top:0" ><div style="padding:88px 64px 72px 0;display:flex;flex-direction:column;justify-content:center"><h1 class="d1" style="max-width:15ch;margin-bottom:24px">Know what happened, and what to do next.</h1><p class="lead" style="max-width:34ch;margin-bottom:36px">We read the systems you already use and answer in plain language, with the source behind every figure.</p><div style="display:flex;gap:28px;align-items:center;flex-wrap:wrap"><a class="btn">See a worked example</a><a class="tl">Talk to us</a></div></div>
<div style="position:relative;min-height:420px;margin:24px 0"><img src="../assets/hero-decision.jpg" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 22%;border-radius:14px"></div></div>
<div class="surf" style="margin-top:24px;border-top:1px solid var(--line)"><div class="wrap cols" style="--c:5fr 7fr;--gap:56px;--al:center;padding:44px 0"><div><div class="xs mu" style="margin-bottom:10px">A question we answered for a manufacturer</div><div style="font-family:var(--ans);font-size:26px;line-height:1.3;color:var(--ink)">If this part shows up late, which customers wait? 14 orders, and the last batch failed inspection.</div><p class="sm" style="margin-top:14px">Call those customers first. Sources: open orders, inspection record. Example data.</p></div>
<div class="app"><div class="sc"><table class="tbl"><tr><th>Order</th><th>Customer</th><th>Promised</th><th>Status</th></tr>
<tr><td>SO-20418</td><td><b>Alder Fabrication</b></td><td class="mu">Oct 14</td><td><span class="st wn">Will miss</span></td></tr>
<tr><td>SO-20431</td><td><b>Northgate Marine</b></td><td class="mu">Oct 16</td><td><span class="st wn">Will miss</span></td></tr>
<tr><td>SO-20447</td><td><b>Pell &amp; Moss</b></td><td class="mu">Oct 21</td><td><span class="st ok">Can recover</span></td></tr></table></div></div></div></div></section>
<style>@media(max-width:900px){.wrap.cols[style*="min-height:560px"]>div:first-child{padding:48px 0 24px!important}}</style>`);

// 06 feature row on dark
const frag = (rows) => rows;
add('06-three-feature-row', 'Three equal columns with a glyph on top', 'Rule, tiny icon, title, two lines of gray text, three times across. The icons are 14px characters.', 'home "what you get"; operating-system, product page', 'S1 three feature cards; S7 three equal feature cards, icon-title-two-lines',
  `<section class="dark" style="padding:112px 0"><div class="wrap"><div class="cols" style="--c:6fr 5fr;--gap:72px;--al:end;margin-bottom:56px"><h2 class="d2" style="max-width:22ch">Every answer shows where it came from</h2><p class="lead" style="max-width:34ch">An answer you cannot trace is a guess. Each one links back to the record it was built from, with the date we learned it.</p></div>
<div class="cols" style="--c:7fr 5fr;--gap:20px">
<div class="dcard" style="grid-row:span 2;display:flex;flex-direction:column"><div style="padding:28px 28px 0"><div style="font-family:var(--ans);font-size:24px;line-height:1.35;color:#fff">Harbor Equipment Services has an open invoice due Nov 2.<sup style="font:600 12px var(--head);color:var(--fig);margin-left:3px">1</sup> The terms moved to net 45 in April.<sup style="font:600 12px var(--head);color:var(--fig);margin-left:3px">2</sup></div>
<div style="margin-top:22px;border:1px solid rgba(255,255,255,.12);border-radius:10px;overflow:hidden"><div style="display:flex;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.1)"><span style="color:var(--fig)">${ic('receipt')}</span><div><div class="sm" style="color:#fff;font-weight:500">Invoice 20-1138 &middot; Ledger</div><div class="xs" style="color:rgba(255,255,255,.6)">Mar 14, 2026 &middot; due net 45</div></div></div>
<div style="display:flex;gap:12px;padding:14px 16px"><span style="color:var(--fig)">${ic('mail')}</span><div><div class="sm" style="color:#fff;font-weight:500">Re: updated payment terms &middot; Mailbox</div><div class="xs" style="color:rgba(255,255,255,.6)">Apr 9, 2026 &middot; J. Alvarez</div><div class="xs" style="color:rgba(255,255,255,.78);margin-top:6px">&ldquo;We are moving all accounts to net 45 effective April 1.&rdquo;</div></div></div></div></div>
<div style="padding:28px;margin-top:auto"><h3 class="h4" style="margin-bottom:6px">Follow every answer</h3><p class="sm">Click any figure and read the invoice, contract or message behind it.</p></div></div>
<div class="dcard" style="padding:26px 26px 24px"><h3 class="h4" style="margin-bottom:6px">Keep the full picture</h3><p class="sm" style="margin-bottom:20px">What was true in March stays findable after April changes it.</p>
<div style="position:relative;padding-left:22px;border-left:1px solid rgba(255,255,255,.16);margin-left:4px"><div style="margin-bottom:16px"><div class="xs" style="color:rgba(255,255,255,.55)">Known Mar 14</div><div class="sm" style="color:#fff">Payment terms: net 30</div></div><div><div class="xs" style="color:rgba(255,255,255,.55)">Known Apr 9</div><div class="sm" style="color:#fff">Payment terms: net 45</div></div></div></div>
<div class="dcard" style="padding:26px 26px 24px"><h3 class="h4" style="margin-bottom:6px">Notice what changes</h3><p class="sm" style="margin-bottom:18px">When a fact a decision rested on shifts, the decision comes back to you.</p>
<div style="border:1px solid rgba(224,180,138,.4);background:rgba(224,180,138,.08);border-radius:10px;padding:14px 16px;display:flex;gap:12px"><span style="color:var(--tan)">${ic('alert')}</span><div><div class="sm" style="color:#fff;font-weight:500">Decision of Mar 20 assumed net 30</div><div class="xs" style="color:rgba(255,255,255,.66)">Terms changed to net 45 on Apr 9.</div></div></div></div></div></div></section>`);

// 07 bento cards
const bars07 = [['North', 6], ['Harbor', 9], ['East', 14, 1], ['South', 4]];
add('07-four-identical-cards', 'Four identical dark cards with category tag and chips', 'Same radius, border, padding, label, question, chips and status pill, four times.', 'home, architecture, industries (255 rounded surfaces, 52 percent in identical rows)', 'S1/S4/S7 identical card grids; S2 card kit; S3 uniform layout',
  `<section class="surf" style="padding:96px 0"><div class="wrap"><div class="cols" style="--c:6fr 5fr;--gap:72px;--al:end;margin-bottom:48px"><h2 class="d2" style="max-width:21ch">Ask the question you would ask a colleague</h2><p class="lead" style="max-width:34ch">Each answer comes back in the shape it needs: a record, a list, a timeline or a chart.</p></div>
<div class="cols" style="--c:repeat(12,1fr);--gap:16px;--al:stretch">
<div class="app" style="grid-column:span 7;padding:26px 26px 6px"><div class="h4" style="margin-bottom:16px">Who is this customer, across CRM, billing and support?</div><div class="sc"><table class="tbl" style="margin:0 -20px;width:calc(100% + 40px)"><tr><th>System</th><th>Name</th><th class="r">Records</th></tr><tr><td>CRM</td><td><b>Ridgeline Outfitters</b></td><td class="r mu">1 account</td></tr><tr><td>Billing</td><td><b>RIDGELINE OUTFIT LLC</b></td><td class="r mu">38 invoices</td></tr><tr><td>Support</td><td><b>J. Tran, Ridgeline</b></td><td class="r mu">5 tickets</td></tr></table></div></div>
<div class="app" style="grid-column:span 5;padding:26px"><div class="h4" style="margin-bottom:6px">Is this one vendor with three names?</div><p class="sm" style="margin-bottom:18px">Yes. All three point to one company, and each original name is kept.</p><div style="font-size:15px;line-height:2.1"><div style="display:flex;justify-content:space-between;border-top:1px solid var(--line2)"><b>HES</b><span class="mu">Mailbox</span></div><div style="display:flex;justify-content:space-between;border-top:1px solid var(--line2)"><b>Vendor 44127</b><span class="mu">Ledger</span></div><div style="display:flex;justify-content:space-between;border-top:1px solid var(--line2)"><b>Harbor Equipment Services</b><span class="mu">Contract</span></div></div></div>
<div class="app" style="grid-column:span 5;padding:26px"><div class="h4" style="margin-bottom:16px">Which contracts renew next quarter, and who owns them?</div>${[['Harbor Equipment', 'M. Okafor', 'Jan 9', 76], ['Lakeshore Linen', 'D. Reyes', 'Feb 1', 55], ['Northwind Freight', 'M. Okafor', 'Mar 15', 22]].map(c => `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:14px"><b style="font-weight:600">${c[0]}</b><span class="mu">${c[1]} &middot; ${c[2]}</span></div><div style="height:6px;border-radius:3px;background:var(--wash);margin-top:7px"><div style="height:6px;border-radius:3px;width:${c[3]}%;background:var(--blue)"></div></div></div>`).join('')}<p class="xs">Bar shows how close each renewal is.</p></div>
<div class="app" style="grid-column:span 7;padding:26px"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:18px"><div class="h4">Where are open work orders piling up, by site?</div></div>${bars07.map(b => `<div style="display:grid;grid-template-columns:64px 1fr 32px;gap:14px;align-items:center;margin-bottom:12px;font-size:14px"><span class="mu">${b[0]}</span><div style="height:12px;border-radius:3px;background:var(--line2)"><div style="height:12px;border-radius:3px;width:${b[1] / 14 * 100}%;background:${b[2] ? 'var(--warn)' : 'var(--washb)'}"></div></div><b style="font-variant-numeric:tabular-nums;text-align:right">${b[1]}</b></div>`).join('')}<p class="xs" style="margin-top:18px;padding-top:14px;border-top:1px solid var(--line2)">Each site's limit is 10 open orders. Updated Oct 9, 2:14 PM. Example data.</p></div></div></div></section>`);

// 08 status in a table
add('08-status-pills', 'Pill chips that carry no state', '351 pills: tags, status dots, "Illustrative example" badges, "Talk to us" capsules. A green dot beside "One customer" is not a status.', '351 pill-shaped chips across the site', 'S5 generic Live/New badges, decoration cosplaying as information',
  `<section class="surf" style="padding:88px 0"><div class="wrap"><h2 class="d3" style="max-width:38ch;margin-bottom:10px">One site is flagged: the East warehouse has 14 open orders and a failed inspection.</h2><p class="sm" style="margin-bottom:28px">Status appears only where something has a state, and it says what the state is.</p>
<div class="app"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px 16px;flex-wrap:wrap;padding:16px 20px;border-bottom:1px solid var(--line)"><div class="h4">Open orders at East</div><span class="xs mu">6 of 14 shown &middot; updated Oct 9, 2:14 PM</span></div>
<div class="sc"><table class="tbl"><tr><th>Order</th><th>Customer</th><th>Part</th><th>Promised</th><th>Status</th><th>Source</th></tr>
${[['SO-20418', 'Alder Fabrication', 'Bracket 4410', 'Oct 14', 'Will miss', 'wn', 'Inspection record'], ['SO-20431', 'Northgate Marine', 'Bracket 4410', 'Oct 16', 'Will miss', 'wn', 'Inspection record'], ['SO-20447', 'Pell & Moss', 'Flange 220', 'Oct 21', 'Can recover', 'ok', 'Supplier update'], ['SO-20452', 'Lakeshore Linen', 'Bracket 4410', 'Oct 22', 'Will miss', 'wn', 'Inspection record'], ['SO-20460', 'Ridgeline Outfitters', 'Flange 220', 'Oct 28', 'Can recover', 'ok', 'Supplier update'], ['SO-20475', 'Meridian Property', 'Gasket 90', 'Nov 3', 'On time', 'ok', 'Open orders']].map(r => `<tr><td>${r[0]}</td><td><b>${r[1].replace('&', '&amp;')}</b></td><td class="mu">${r[2]}</td><td class="mu">${r[3]}</td><td><span class="st ${r[5]}">${r[4]}</span></td><td class="mu">${r[6]}</td></tr>`).join('')}</table></div></div>
<p class="xs" style="margin-top:14px">Sources: open orders, inspection record, supplier update. Example data.</p></div></section>`);

// 09 resolution diagram
const srcs09 = [['Ledger', 'Vendor 44127', '1,208 payments, last Oct 7'], ['Mailbox', 'HES', '61 threads, last Oct 9'], ['Contracts', 'Harbor Equipment Services', 'Agreement 2024-117'], ['Support', 'Harbor Equip.', '3 tickets, 1 open']];
add('09-particle-brain', 'Glowing multicolor network brain', 'A rotating mesh of green, blue, orange and purple nodes on black. This is the stock "AI brain" vocabulary.', 'home hero-adjacent stage, product page, operating-system (brain.js canvas)', 'S16 stock listings for glowing neural brains; S1/S4 glow with no reason. The brand idea (records connecting) stays; the rendering changes.',
  `<section class="dark" style="padding:96px 0"><div class="wrap"><div class="cols" style="--c:6fr 5fr;--gap:72px;--al:end;margin-bottom:48px"><h2 class="d2" style="max-width:22ch">Four records, one company</h2><p class="lead" style="max-width:34ch">Each system keeps its own name. We match them and keep every original.</p></div>
<svg class="d9" viewBox="0 0 1120 440" style="width:100%;height:auto;display:block" role="img" aria-label="Four system records resolve to one company"><g font-family="Switzer, sans-serif">
<g fill="none" stroke="#0071e3" stroke-width="1.5">${srcs09.map((s, i) => `<path d="M312 ${58 + i * 108} C 430 ${58 + i * 108}, 440 210, 540 210"/>`).join('')}</g>
${srcs09.map((s, i) => `<g><rect x="0.5" y="${10 + i * 108}" width="312" height="96" rx="12" fill="#101114" stroke="#ffffff" stroke-opacity=".14"/><text x="22" y="${42 + i * 108}" font-size="13" fill="#ffffff" fill-opacity=".55">${s[0]}</text><text x="22" y="${68 + i * 108}" font-size="17" font-weight="600" fill="#ffffff">${s[1]}</text><text x="22" y="${90 + i * 108}" font-size="13" fill="#ffffff" fill-opacity=".66">${s[2]}</text><circle cx="312" cy="${58 + i * 108}" r="4" fill="#0071e3"/></g>`).join('')}
<circle cx="540" cy="210" r="4" fill="#0071e3"/>
<rect x="540.5" y="10.5" width="579" height="399" rx="14" fill="#ffffff"/>
<text x="572" y="62" font-size="13" fill="#62656c">Matched record</text>
<text x="572" y="102" font-size="30" font-weight="600" fill="#1d1d1f" letter-spacing="-0.6">Harbor Equipment Services</text>
<text x="572" y="130" font-size="14" fill="#62656c">Vendor &#183; 4 of 4 sources agree &#183; confirmed Oct 9</text>
<g stroke="#e4e5e9"><path d="M572 156H1087"/><path d="M572 216H1087"/><path d="M572 276H1087"/><path d="M572 336H1087"/></g>
<g font-size="14" fill="#62656c"><text x="572" y="192">Names on file</text><text x="572" y="252">Payment terms</text><text x="572" y="312">Renews</text><text x="572" y="372">Open work</text></g>
<g font-size="15" font-weight="600" fill="#1d1d1f" text-anchor="end"><text x="1087" y="192">HES, Vendor 44127, Harbor Equip.</text><text x="1087" y="252">Net 45, learned Apr 9</text><text x="1087" y="312">Jan 9, 2027</text><text x="1087" y="372">14 orders, 1 ticket</text></g></g></svg>
<div class="m9" style="display:none">${srcs09.map(s => `<div class="dcard" style="padding:14px 16px;margin-bottom:10px"><div class="xs" style="color:rgba(255,255,255,.55)">${s[0]}</div><div style="font-weight:600">${s[1]}</div><div class="xs" style="color:rgba(255,255,255,.66)">${s[2]}</div></div>`).join('')}<div style="background:#fff;color:var(--ink);border-radius:14px;padding:18px"><div class="xs mu">Matched record</div><div style="font-size:22px;font-weight:600;letter-spacing:-.02em">Harbor Equipment Services</div><div class="sm mu">4 of 4 sources agree &middot; confirmed Oct 9</div></div></div>
<p class="xs" style="margin-top:20px">How four records resolve to one. Example data.</p></div></section><style>@media(max-width:900px){.d9{display:none!important}.m9{display:block!important}}</style>`);

// 10 product UI, no window chrome
const nav10 = [['home', 'Home'], ['chat', 'Answers', 1], ['doc', 'Records'], ['link', 'Sources'], ['users', 'People'], ['gear', 'Settings']];
add('10-fake-browser-frame', 'Fake browser window around a mock UI', 'Three gray traffic-light dots, a breadcrumb and a "preview" label wrap a hand-built interface; pills and a sparkle glyph decorate it.', 'home interactive preview, operating-system', 'S8 template screenshot genre; S5 decoration cosplaying as information (our judgment; no source names browser chrome)',
  `<section class="surf" style="padding:96px 0"><div class="wrap cols" style="--c:4fr 8fr;--gap:56px;--al:center"><div><h2 class="d2" style="max-width:19ch;margin-bottom:18px">Ask in plain words</h2><p class="lead" style="max-width:30ch">The answer names the company, lists every name it goes by, and points to the record behind each.</p><p style="margin-top:24px"><a class="tl">Try a question</a></p></div>
<div class="app" style="display:grid;grid-template-columns:176px 1fr;min-height:430px" ><div style="background:var(--panel);border-right:1px solid var(--line);padding:16px 12px;display:flex;flex-direction:column;gap:2px" class="n10"><div style="display:flex;gap:10px;align-items:center;padding:4px 8px 14px"><span class="av" style="width:28px;height:28px;border-radius:7px;font-size:12px;background:var(--ink);color:#fff">D</span><b style="font-size:14px">Dabney &amp; Co.</b></div>${nav10.map(n => `<div style="display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:8px;font-size:14px;${n[2] ? 'background:var(--wash);color:var(--blue);font-weight:500' : 'color:var(--muted)'}">${ic(n[0])}${n[1]}</div>`).join('')}</div>
<div style="padding:22px 26px;min-width:0"><div class="xs mu" style="margin-bottom:14px">Answers &nbsp;/&nbsp; Who is HES</div><div style="display:flex;align-items:center;gap:10px;border:1px solid var(--line);border-radius:10px;padding:10px 14px;font-size:15px;margin-bottom:22px;box-shadow:0 1px 2px rgba(29,29,31,.05)">${ic('search')}<span>Who is HES, across our systems?</span></div>
<div style="font-family:var(--ans);font-size:24px;line-height:1.3;margin-bottom:6px">One company: Harbor Equipment Services.</div><p class="sm" style="margin-bottom:18px">Four systems know it under three names. All point to the same vendor.</p>
<div><div class="sc" style="border:1px solid var(--line);border-radius:10px"><table class="tbl"><tr><th>Name on file</th><th>Source</th><th class="r">Learned</th></tr><tr><td><b>HES</b></td><td class="mu">Mailbox</td><td class="r mu">May 2</td></tr><tr><td><b>Vendor 44127</b></td><td class="mu">Ledger</td><td class="r mu">Mar 14</td></tr><tr><td><b>Harbor Equip.</b></td><td class="mu">Support</td><td class="r mu">Feb 11</td></tr><tr><td><b>Harbor Equipment Services</b></td><td class="mu">Contracts</td><td class="r mu">Jan 9</td></tr></table></div>
<div style="border:1px solid var(--washb);background:var(--wash);border-radius:10px;padding:14px 16px;margin-top:16px"><div class="xs" style="color:var(--washt);font-weight:500;margin-bottom:6px">Evidence &middot; Mailbox, May 2</div><div class="sm" style="color:var(--ink)">&ldquo;Hi team, HES invoice 20-1138 is attached for the April service visit.&rdquo;</div><div class="xs" style="margin-top:10px"><a class="tl" style="font-size:13px">Open message</a></div></div></div></div></div></div></section>
<style>@media(max-width:900px){.app[style*="176px"]{grid-template-columns:1fr!important}.n10{display:none!important}.app .cols{--c:1fr!important}}</style>`);

// 11 copy
add('11-copy-frames', 'Copy built from stock frames', '"The problem isn\'t X. It\'s Y." and "It isn\'t A. It\'s B." open 18 sentences across the notes essays; one-line example disclaimers repeat under nearly every figure.', '18 not-X-it\'s-Y frames; two-part headline on 29 pages', 'S11 not-X-it\'s-Y, two fragments, always three things; S10 predictable rhythm is the real tell; S2 delete any number you cannot source',
  `<section style="padding:104px 0"><div class="wrap cols" style="--c:6fr 5fr;--gap:80px"><div><h2 class="d2" style="max-width:24ch;margin-bottom:28px">Most alerts watch events. The useful ones watch conditions.</h2>
<p style="font-size:18px;line-height:1.65;color:var(--ink);margin-bottom:20px">A late shipment is an event. A late shipment for the one customer whose contract has a penalty clause is a condition. Event alerts fire hundreds of times a week; a condition fires when something is actually wrong.</p>
<p style="font-size:18px;line-height:1.65;color:var(--ink);margin-bottom:20px">A migration is finished when someone can ask last year's question and get last year's answer, not when the last row lands.</p>
<p style="font-size:18px;line-height:1.65;color:var(--ink)">Give each old name an alias that points to the one record, and keep where the name came from.</p></div>
<div class="app" style="margin-top:8px"><div style="padding:18px 20px;border-bottom:1px solid var(--line)" class="h4">Last 7 days at a distributor</div><div class="sc"><table class="tbl"><tr><th>Alert rule</th><th class="r">Fired</th><th class="r">Needed action</th></tr><tr><td><b>Shipment is late</b><div class="xs mu">An event</div></td><td class="r">312</td><td class="r mu">9</td></tr><tr><td class="w"><b>Shipment is late and the contract has a penalty clause</b><div class="xs mu">A condition</div></td><td class="r">4</td><td class="r ok"><b>4</b></td></tr></table></div><div class="xs mu" style="padding:14px 20px;border-top:1px solid var(--line);background:var(--panel)">Example data from a distributor with 1,900 open shipments.</div></div></div></section>`);

// 12 varied sections
add('12-repeating-section-pattern', 'Every section is the same two-column split', 'Label, two-tone headline left, one gray paragraph right, 96px above and below, alternating dark, white, gray and cream bands. 72 sections share one 96/96 padding.', '72 sections at 96/96 padding; split pattern on most pages', 'S7 uniform sections, same height padding and heading size; S8 visibly undecided; S3 uniform layout',
  `<div style="padding:96px 0 72px"><div class="wrap"><h2 class="d1" style="max-width:20ch;margin-bottom:56px">Every fact on file, with the page it came from</h2><div class="cols" style="--c:repeat(3,1fr);--gap:0">${[['12,408', 'ledger records read'], ['41,006', 'messages matched to customers'], ['214', 'contracts with owners and dates']].map((s, i) => `<div style="padding:0 32px;${i ? 'border-left:1px solid var(--line)' : 'padding-left:0'}"><div style="font-size:56px;font-weight:600;letter-spacing:-.04em;line-height:1">${s[0]}</div><p class="sm" style="margin-top:10px">${s[1]}</p></div>`).join('')}</div><p class="xs" style="margin-top:28px">Example data from one mid-sized distributor.</p></div></div>
<div class="cream" style="padding:72px 0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)"><div class="wrap cols" style="--c:4fr 7fr;--gap:72px;--al:center"><div><h3 class="d3" style="margin-bottom:12px;color:var(--ink)">A section that is mostly the work</h3><p class="sm" style="max-width:34ch">The table carries the point, so the heading stays small.</p></div>
<div style="background:#fff;border:1px solid var(--rule);border-radius:12px;overflow:hidden" class="sc"><table class="tbl"><tr><th>Renewal</th><th>Owner</th><th>Date</th><th class="r">Notice due</th></tr><tr><td><b>Harbor Equipment</b></td><td class="mu">M. Okafor</td><td class="mu">Jan 9, 2027</td><td class="r wn"><b>Nov 10</b></td></tr><tr><td><b>Lakeshore Linen</b></td><td class="mu">D. Reyes</td><td class="mu">Feb 1, 2027</td><td class="r mu">Dec 3</td></tr><tr><td><b>Northwind Freight</b></td><td class="mu">M. Okafor</td><td class="mu">Mar 15, 2027</td><td class="r mu">Jan 14</td></tr></table></div></div></div>
<div class="dark"><div class="cols" style="--c:1fr 1fr;--gap:0;--al:stretch;min-height:380px" ><div style="padding:64px 56px 64px max(48px,calc((100vw - 1120px)/2));display:flex;align-items:center"><div style="font-family:var(--ans);font-size:32px;line-height:1.28;color:#fff;max-width:20ch">An answer on a dark band, beside a real place, and then nothing else.</div></div><img src="../assets/talk-schools.jpg" alt="" style="width:100%;height:100%;min-height:280px;object-fit:cover;display:block"></div></div>`);

// 13 industries
const ind13 = [['hospitality', 'Hospitality', '41 events and one calendar that agrees with the ledger'], ['schools', 'Schools and charters', 'Attendance, enrollment and family contact on one record'], ['retail', 'Retail', 'What sold, what it earned, what to reorder'], ['manufacturing', 'Manufacturing', 'One part across every system it touches'], ['professional-services', 'Professional services', 'Time, billing and engagements that agree'], ['property', 'Property', 'Leases, work orders and vendors by building'], ['government', 'Local government', 'Rules on file and the gaps still open'], ['nonprofit', 'Nonprofits', 'Donors, grants and programs on one record']];
add('13-arrow-list', 'An arrow on every row, a link with an arrow under it', 'Eight single-line rows each ending in a diagonal arrow, then "Explore your industry" and "Explore the work" with more arrows.', '27 arrow glyphs in copy plus one per list row', 'S7 chevron CTAs on every link; S2 arrow on every link',
  `<section style="padding:88px 0"><div class="wrap"><div class="cols" style="--c:6fr 5fr;--gap:72px;--al:end;margin-bottom:48px"><h2 class="d2" style="max-width:23ch">The same method, in very different places</h2><p class="lead" style="max-width:34ch">Pick the place that looks most like yours.</p></div>
<div class="cols" style="--c:repeat(6,1fr);--gap:32px 20px;--al:start">${ind13.map((x, i) => { const span = i < 2 ? 3 : 2; const ar = i < 2 ? '16/9' : '4/3'; return `<a style="display:block;grid-column:span ${span};text-decoration:none;color:inherit" class="t13"><img src="../assets/industry-${x[0] === 'schools' ? 'schools' : x[0]}.jpg" alt="" style="width:100%;aspect-ratio:${ar};object-fit:cover;display:block;border-radius:10px;margin-bottom:14px"><span class="h4" style="display:block;margin-bottom:3px">${x[1]}</span><span class="sm" style="display:block;color:var(--muted)">${x[2]}</span></a>`; }).join('')}</div></div></section>
<style>@media(min-width:901px) and (max-width:1100px){.t13{grid-column:span 3!important}}</style>`);

// 14 portal home
add('14-portal-dashboard', 'Portal home: checklist, empty card, blue links', 'Eyebrow plus big tight heading, a "Getting started" rounded card with struck-through steps in default blue, then a centered empty state in a second identical card.', 'portal.loveleedaystudios.com home (screenshot qa_client_1440); cards centered, links #0066cc', 'S3 missing unhappy paths and empty states that prompt the next action; S7 missing states; S2 card kit',
  `<section class="surf" style="padding:48px 0 72px"><div class="wrap"><div class="app" style="display:grid;grid-template-columns:208px 1fr;min-height:620px"><div style="background:var(--panel);border-right:1px solid var(--line);padding:18px 12px;display:flex;flex-direction:column;gap:2px" class="n14"><div style="display:flex;gap:10px;align-items:center;padding:4px 8px 16px"><span class="av" style="width:30px;height:30px;font-size:12px;background:var(--ink);color:#fff;border-radius:8px">D</span><b style="font-size:14px">Dabney &amp; Co.</b></div>${[['home', 'Home', 1], ['chat', 'Answers'], ['doc', 'Documents'], ['plug', 'Connections'], ['users', 'People']].map(n => `<div style="display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:8px;font-size:14px;${n[2] ? 'background:var(--wash);color:var(--blue);font-weight:500' : 'color:var(--muted)'}">${ic(n[0])}${n[1]}</div>`).join('')}</div>
<div style="padding:30px 34px 34px;min-width:0"><div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:24px"><div><h1 class="d3" style="margin-bottom:4px">Dabney &amp; Co.</h1><p class="sm">Two of four setup steps are done.</p></div><a class="btn">Add documents</a></div>
<div style="display:flex;gap:16px;align-items:center;border:1px solid var(--washb);background:var(--wash);border-radius:12px;padding:16px 18px;margin-bottom:28px"><span style="color:var(--washt)">${ic('doc', 20)}</span><div style="flex:1"><div style="font-weight:600;font-size:15px">Next: share the documents behind your numbers</div><div class="sm" style="color:var(--washt)">Contracts, policies and reports, so every figure can point to its source.</div></div></div>
<div class="cols" style="--c:7fr 5fr;--gap:36px"><div><div class="h4" style="margin-bottom:6px">Setup</div>${[['Connect a system or upload a file', 'Done Oct 7', 1], ['Share the documents behind your numbers', 'About 5 minutes', 0], ['Invite the people who need answers', 'Done Oct 9', 1], ['Review what needs your decision', 'After the first answer', 0]].map(s => `<div style="display:flex;gap:12px;align-items:center;padding:13px 0;border-top:1px solid var(--line2);font-size:15px"><span style="width:20px;height:20px;border-radius:50%;flex:none;display:inline-flex;align-items:center;justify-content:center;${s[2] ? 'background:var(--ok);color:#fff' : 'box-shadow:0 0 0 1.5px var(--line) inset'}">${s[2] ? ic('check', 12) : ''}</span><span style="flex:1;${s[2] ? 'color:var(--muted)' : 'font-weight:500'}">${s[0]}</span><span class="xs mu">${s[1]}</span></div>`).join('')}</div>
<div><div class="h4" style="margin-bottom:6px">Recent activity</div>${[['Invite accepted by Terri Okafor', 'Oct 9, 4:02 PM'], ['2025 liquor licence.pdf received', 'Oct 8, 11:40 AM'], ['Toast connected, read only', 'Oct 7, 9:15 AM']].map(a => `<div style="padding:13px 0;border-top:1px solid var(--line2)"><div style="font-size:14px;font-weight:500">${a[0]}</div><div class="xs mu">${a[1]}</div></div>`).join('')}</div></div>
<div style="margin-top:28px"><div class="h4" style="margin-bottom:10px">Answers and completed work</div><div style="border:1px dashed var(--line);border-radius:12px;padding:22px 24px;display:flex;gap:20px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div><div style="font-weight:600;font-size:15px">Your first answer appears here</div><p class="sm" style="max-width:52ch">It starts when a system is connected and the documents behind your numbers are shared.</p></div><a class="btn sec">See an example answer</a></div></div></div></div></div></section>
<style>@media(max-width:900px){.app[style*="208px"]{grid-template-columns:1fr!important}.n14{display:none!important}.app[style*="208px"] .cols{--c:1fr!important}}</style>`);

// write files
const bench = id => (BENCH[id] || []).map(b => ({ site: b.site, file: 'refs-bench/' + b.file + '.jpg', what: b.what }));
const doc = (css, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>mockup</title><style>${css}</style></head><body><div id="stage">${body}</div></body></html>`;
for (const f of fs.readdirSync(dir)) if (/^03-apple-palette-stack/.test(f)) fs.unlinkSync(path.join(dir, f));
for (const m of M) {
  fs.writeFileSync(path.join(dir, `${m.id}-before.html`), doc(BEFORE_CSS, m.before || BEFORES[m.id]));
  fs.writeFileSync(path.join(dir, `${m.id}-after.html`), doc(AFTER_CSS, m.after));
}
fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(M.map(({ before, after, ...r }) => ({ ...r, bench: bench(r.id) })), null, 1));
console.log('wrote', M.length, 'pairs');
