// build-mockups.mjs : writes <id>-before.html / <id>-after.html for each tell, plus index.json (metadata for render + board).
// Before = a faithful recreation of the live section (tokens read from site.css and the computed-style crawl).
// After  = the proposed fix, in the proposed direction (navy/teal/cream, Newsreader + Public Sans, see DESIGN-DIRECTION in WIRING.md).
import fs from 'node:fs';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const IMG = 'https://loveleedaystudios.com/assets/';

const BEFORE_CSS = `
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;color:#1d1d1f;background:#fff;-webkit-font-smoothing:antialiased}
.wrap{width:min(1080px,calc(100% - 80px));margin-inline:auto}
.sec{padding:96px 0}.dark{background:#14151b;color:#fff}.gray{background:#f5f5f7}.cream{background:#f5f1eb}
.eyebrow{font-size:10px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:#62656c;margin:0 0 20px}
.dark .eyebrow{color:#8e96a8}
h1,h2,h3{font-weight:500;letter-spacing:-.045em;line-height:1.08;margin:0}
h1{font-size:64px}h2{font-size:48px}
.dim{display:block;color:#75767d}.dark .dim{color:#8b8d99}
p{margin:0;font-size:18px;line-height:1.65;color:#62656c}.dark p{color:#b3b6c2}
.btn{background:#0066cc;color:#fff;border-radius:999px;padding:0 24px;height:44px;display:inline-flex;align-items:center;font-size:14px;text-decoration:none}
.btn.ghost{background:none;color:#fff;border:1px solid #6b6d78}.light.ghost{color:#1d1d1f;border-color:#bbb}
.link{color:#0066cc;font-size:13px;margin-right:22px}
.pill{display:inline-flex;align-items:center;gap:6px;border:1px solid #e4e5e9;border-radius:999px;padding:3px 10px;font-size:11px;color:#62656c;background:#fff}
.dark .pill{border-color:#2f3140;background:#1b1c24;color:#b3b6c2}
.two{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:end}
@media(max-width:760px){.wrap{width:calc(100% - 40px)}.sec{padding:56px 0}.two{grid-template-columns:1fr;gap:24px}h1{font-size:40px}h2{font-size:34px}}
`;

const AFTER_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Public+Sans:wght@400;500;600&display=swap');
:root{--ink:#0f2233;--ink2:#3d5063;--paper:#f6f1e7;--paper2:#ece4d3;--teal:#0e6a6a;--teal2:#0a4f50;--line:#d9cfba;--night:#0c1a28;--night2:#8fa6b8;
--head:'Newsreader',Georgia,serif;--body:'Public Sans',system-ui,sans-serif}
*{box-sizing:border-box}body{margin:0;font-family:var(--body);font-size:17px;line-height:1.6;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}
.wrap{width:min(1120px,calc(100% - 96px));margin-inline:auto}
.night{background:var(--night);color:#f6f1e7}
h1,h2,h3{font-family:var(--head);font-weight:500;letter-spacing:-.012em;line-height:1.1;margin:0}
h1{font-size:64px}h2{font-size:40px}h3{font-size:28px}
p{margin:0;max-width:62ch;color:var(--ink2)}.night p{color:#c5d2dc}
.lead{font-size:20px;line-height:1.55}
.kicker{font-size:14px;font-weight:600;color:var(--teal);margin:0 0 12px}.night .kicker{color:#7fd0c9}
.btn{background:var(--teal);color:#fff;border-radius:6px;padding:0 22px;height:48px;display:inline-flex;align-items:center;font-size:16px;font-weight:600;text-decoration:none}
.night .btn{background:#f6f1e7;color:var(--ink)}
.tl{color:var(--teal2);font-weight:600;text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}.night .tl{color:#f6f1e7}
@media(max-width:760px){.wrap{width:calc(100% - 40px)}h1{font-size:40px}h2{font-size:32px}h3{font-size:24px}.lead{font-size:18px}}
`;

const M = [];
const add = (id, title, tell, count, source, before, after, extra = {}) => M.push({ id, title, tell, count, source, before, after, ...extra });

// 01 two-tone two-part headline
add('01-two-tone-headline', 'Two-part, two-tone headline', 'Two short sentences, the second in gray. Same device on 54 of 185 headings.', '54 of 185 h1/h2 two-part; 46 percent two-tone', 'S1 generic slogans; S2 accenting one headline part; S11 two fragments glued together',
`<section class="sec"><div class="wrap two"><div><p class="eyebrow">A new layer of understanding</p><h2>All the complexity.<span class="dim">One clear thought.</span></h2></div>
<p>A general-purpose AI does not know your business. It does not know your suppliers, your history or what you call things. The information exists, but it is spread across systems that describe the same things in different ways. <b style="color:#1d1d1f;font-weight:500">LOVELEEDAY brings them into one shared understanding</b>, connecting what happened, what it means, and what deserves your attention.</p></div></section>`,
`<section style="padding:96px 0"><div class="wrap" style="display:grid;grid-template-columns:7fr 5fr;gap:72px;align-items:start"><div><h2 style="font-size:44px;max-width:15ch">Your systems each know a piece. We put the pieces together.</h2></div>
<div><p class="lead" style="margin-bottom:18px">Your accounting, billing, support and contracts all describe the same customer in different words. We match them into one record and keep the source behind each fact.</p><p>So when someone asks what happened to an account, the answer comes with the page it came from.</p></div></div></section>
<style>@media(max-width:760px){.wrap[style*="7fr"]{grid-template-columns:1fr!important;gap:24px!important}}</style>`);

// 02 eyebrow labels
add('02-eyebrow-labels', 'Tracked all-caps label above every heading', '10px uppercase labels with wide tracking on every section. 562 across 35 pages, 85 percent at 10px.', '562 labels, mean 16 per page, 42 on home', 'S5 excessive letter spacing; S2 tracked all-caps eyebrows over every heading',
`<section class="sec"><div class="wrap"><p class="eyebrow">What it does with your data</p><h2 style="font-size:40px;margin-bottom:56px">One picture across every system.</h2>
<p class="eyebrow">Intelligence, by architecture</p><h2 style="font-size:40px;margin-bottom:56px">Meet the system behind the answer.</h2>
<p class="eyebrow">Built around your world</p><h2 style="font-size:40px">Many industries, one architecture.</h2></div></section>`,
`<section style="padding:96px 0"><div class="wrap"><h2 style="margin-bottom:56px;max-width:20ch">One picture across every system</h2>
<h2 style="margin-bottom:56px;max-width:20ch">The system behind each answer</h2>
<p class="kicker">Industries</p><h2 style="max-width:20ch">The same method in very different organizations</h2></div></section>`);

// 03 apple palette and stack
add('03-apple-palette-stack', 'Apple palette and system font stack', 'Ink #1d1d1f, gray #f5f5f7, link #0066cc and the -apple-system stack: another brand\'s tokens, used on every page.', '34 of 35 pages ink; 28 link blue; 26 gray; 100 percent of text in the system stack', 'S8 stock tokens are a palette; S14 SF license and Apple-clone note; typography-mastery SF Pro entries',
`<section class="sec"><div class="wrap"><div style="display:flex;gap:12px;margin-bottom:36px;flex-wrap:wrap">
<div style="width:120px;height:72px;background:#1d1d1f;color:#fff;font-size:12px;padding:8px;border-radius:8px">#1d1d1f<br>Apple ink</div>
<div style="width:120px;height:72px;background:#f5f5f7;font-size:12px;padding:8px;border-radius:8px;border:1px solid #e4e5e9">#f5f5f7<br>Apple gray</div>
<div style="width:120px;height:72px;background:#0066cc;color:#fff;font-size:12px;padding:8px;border-radius:8px">#0066cc<br>Apple blue</div></div>
<h2 style="font-size:44px;margin-bottom:16px">Know what happened.</h2><p style="max-width:56ch;margin-bottom:24px">Reads the systems you already use and gives you a plain-language answer, with the source behind every figure.</p>
<a class="btn">See how it works</a> <a class="link" style="margin-left:18px">Explore your industry &#8599;</a>
<p style="font-size:12px;margin-top:28px">Font: -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial</p></div></section>`,
`<section style="padding:96px 0"><div class="wrap"><div style="display:flex;gap:12px;margin-bottom:36px;flex-wrap:wrap">
<div style="width:120px;height:72px;background:#0f2233;color:#fff;font:500 12px var(--body);padding:8px;border-radius:6px">#0f2233<br>Harbor navy</div>
<div style="width:120px;height:72px;background:#f6f1e7;font:500 12px var(--body);padding:8px;border-radius:6px;border:1px solid #d9cfba">#f6f1e7<br>Paper</div>
<div style="width:120px;height:72px;background:#0e6a6a;color:#fff;font:500 12px var(--body);padding:8px;border-radius:6px">#0e6a6a<br>Deep teal</div></div>
<h2 style="font-size:44px;margin-bottom:16px">Know what happened.</h2><p style="margin-bottom:24px">We read the systems you already use and give you a plain answer, with the source behind every figure.</p>
<a class="btn">See how it works</a> <a class="tl" style="margin-left:22px">Find your industry</a>
<p style="font-size:13px;margin-top:28px">Fonts: Newsreader for headlines, Public Sans for text</p></div></section>`);

// 04 type scale
const ladder = (sizes, color, fam, w) => sizes.map(s => `<div style="display:flex;align-items:baseline;gap:18px;border-bottom:1px solid ${color};padding:6px 0"><span style="width:56px;font:12px monospace;color:#888">${s}px</span><span style="font:${w} ${s}px/1.1 ${fam};letter-spacing:${fam.includes('Newsreader') ? '-.012em' : '-.045em'}">Know what happened</span></div>`).join('');
add('04-type-scale', 'No type scale: 13 heading sizes, one weight', 'h2 sizes: 26, 30, 34, 36, 38, 40, 44, 48, 50, 52, 60, 62 px; 98 percent at weight 500 with -0.045em tracking.', '13 distinct h2 sizes; 98 percent weight 500', 'S12 arbitrary sizes, everything equally important; S13 modular scale, two to three weights',
`<section class="sec"><div class="wrap"><p class="eyebrow">Live h2 sizes found on the site</p>${ladder([62, 60, 52, 50, 48, 44, 40, 38, 36, 34, 30, 26], '#e4e5e9', 'inherit', '500')}</div></section>`,
`<section style="padding:80px 0"><div class="wrap"><p class="kicker">Proposed scale: five steps, two weights</p>${ladder([64, 40, 28, 20, 17], '#d9cfba', "'Newsreader',Georgia,serif", '500')}<p style="font-size:14px;margin-top:20px">Headlines Newsreader 500, text Public Sans 400 and 600. Every page picks from these five.</p></div></section>`);

// 05 hero card on photo
const heroBefore = `<section class="dark" style="padding:72px 0 96px"><div class="wrap" style="display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center">
<div><p class="eyebrow">Data intelligence for the decisions in front of you</p><h1 style="font-size:60px">Know what happened.<span class="dim">Know what to do next.</span></h1><p style="margin:24px 0 32px">LOVELEEDAY reads the systems you already use and gives you a plain-language answer: what happened, why it matters and what to do next, with the source behind every figure.</p><a class="btn">See how it works &#8599;</a> <a class="btn ghost" style="margin-left:8px">Talk to us</a></div>
<div style="position:relative;height:440px;border-radius:14px"><img src="${IMG}hero-decision.jpg" style="width:100%;height:100%;object-fit:cover;border-radius:14px"><div style="position:absolute;left:-60px;right:-30px;bottom:-60px;background:#fff;color:#1d1d1f;border-radius:20px;padding:22px 24px;box-shadow:0 20px 60px rgba(0,0,0,.4)">
<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600">LOVELEEDAY <span class="pill">Illustrative example</span></div>
<div class="eyebrow" style="margin:12px 0 4px">What you would ask</div><div style="font-size:14px;color:#1d1d1f">If this part shows up late, which orders and customers does it hold up?</div>
<div class="eyebrow" style="margin:10px 0 4px">What you are told</div><div style="font-size:14px">14 orders are waiting, and the latest batch failed inspection.</div>
<div class="eyebrow" style="margin:10px 0 4px">Why it matters</div><div style="font-size:14px">Those customers may miss the dates you promised them.</div>
<div class="eyebrow" style="margin:10px 0 4px">What to do next</div><div style="font-size:14px;color:#0066cc;font-weight:600">Call the affected customers first.</div></div></div></div></section>
<style>@media(max-width:760px){.dark .wrap{grid-template-columns:1fr!important}.dark h1{font-size:38px!important}.dark [style*="position:absolute"]{left:0!important;right:0!important;bottom:-120px!important}.dark [style*="height:440px"]{margin-bottom:140px}}</style>`;
const heroAfter = `<section class="night" style="padding:0"><div style="display:grid;grid-template-columns:1fr 1fr;min-height:560px" class="hg"><div style="padding:88px 56px 72px max(48px,calc((100vw - 1120px)/2));display:flex;flex-direction:column;justify-content:center">
<h1 style="font-size:58px;margin-bottom:24px">Know what happened, and what to do next.</h1><p class="lead" style="margin-bottom:32px">We read the systems you already use and answer in plain language, with the source behind every figure.</p><div><a class="btn">See a worked example</a> <a class="tl" style="margin-left:24px">Talk to us</a></div></div>
<div style="position:relative;min-height:380px"><img src="${IMG}hero-decision.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div></div>
<div style="background:#f6f1e7;color:#0f2233"><div class="wrap" style="padding:28px 0;display:grid;grid-template-columns:auto 1fr;gap:12px 32px;align-items:baseline"><p style="font-size:14px;font-weight:600;color:#0e6a6a;margin:0">A question we answered</p>
<p style="color:#0f2233;max-width:none;margin:0;font-family:var(--head);font-size:22px;line-height:1.35">If this part shows up late, which customers wait? <b style="font-weight:600">14 orders, and the last batch failed inspection. Call those customers first.</b> <span style="font:14px var(--body);color:#3d5063;white-space:nowrap">Source: open orders, inspection record. Example data.</span></p></div></div></section>
<style>@media(max-width:760px){.hg{grid-template-columns:1fr!important}.hg>div:first-child{padding:48px 20px!important}.hg h1{font-size:38px!important}}</style>`;
add('05-hero-photo-card', 'Product card pasted over the hero photo', 'A floating white card of four tracked labels sits across the photo and hides her hands; the same card repeats on the portal sign-in.', 'home hero, portal sign-in, snapshot', 'S5 decoration cosplaying as information; S7 uniform sections; our crop rule (no overlap on faces or hands)', heroBefore, heroAfter);

// 06 three glyph feature row
add('06-three-feature-row', 'Three equal columns with a glyph on top', 'Rule, tiny icon, title, two lines of gray text, three times across. The icons are 14px characters.', 'home "what you get"; operating-system; arthur', 'S1 three feature cards; S7 three equal feature cards, icon-title-two-lines',
`<section class="dark sec"><div class="wrap"><p class="eyebrow">What you get</p><h2 style="margin-bottom:56px">Intelligence should bring clarity.<span class="dim">And show its work.</span></h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px">${[['&#8599;', 'Follow every answer.', 'Trace a claim to the system and record behind it. Evidence stays connected to the answer.'], ['&#9719;', 'Keep the full picture.', 'Preserve what was true and when it became known. New information adds context without erasing history.'], ['&#8972;', 'Notice what changes.', 'It watches for the changes that matter and brings a decision back into focus when its assumptions shift.']].map(c => `<div style="border-top:1px solid #3a3c48;padding-top:28px"><div style="color:#7fb4ff;margin-bottom:28px">${c[0]}</div><h3 style="font-size:20px;margin-bottom:10px">${c[1]}</h3><p style="font-size:15px">${c[2]}</p></div>`).join('')}</div></div></section>
<style>@media(max-width:760px){.dark [style*="repeat(3"]{grid-template-columns:1fr!important}}</style>`,
`<section class="night" style="padding:96px 0"><div class="wrap"><h2 style="max-width:18ch;margin-bottom:56px">Every answer shows where it came from</h2>
<div class="f6" style="display:grid;grid-template-columns:5fr 4fr;gap:72px"><div><p class="lead" style="color:#f6f1e7;font-family:var(--head);font-size:30px;line-height:1.25;max-width:22ch">Click any figure and see the invoice, contract or message behind it.</p><p style="margin-top:20px">An answer you cannot trace is a guess. Each one links back to the record it was built from, with the date we learned it.</p></div>
<div style="border-top:1px solid #2c4256">${[['Keeps history', 'What was true in March stays findable after April changes it.'], ['Flags change', 'When a fact an earlier decision rested on shifts, the decision comes back to you.']].map((c, i) => `<div style="display:grid;grid-template-columns:40px 1fr;gap:12px;padding:22px 0;border-bottom:1px solid #2c4256"><span style="font-family:var(--head);font-size:24px;color:#7fd0c9">${i + 1}</span><div><h3 style="font-size:22px;margin-bottom:6px">${c[0]}</h3><p style="font-size:16px">${c[1]}</p></div></div>`).join('')}</div></div></div></section>
<style>@media(max-width:760px){.f6{grid-template-columns:1fr!important;gap:32px!important}}</style>`);

// 07 four identical cards with chips
const cards4 = [['CUSTOMERS', '#5aa9ff', 'Who is this customer, across CRM, billing and support?', ['CRM', 'Ledger', 'Support'], 'One customer'], ['VENDORS', '#5aa9ff', 'Is this one vendor with three names?', ['Ledger', 'Mailbox', 'Contract'], 'One vendor'], ['CONTRACTS', '#5aa9ff', 'Which contracts renew next quarter, and who owns them?', ['Agreement', 'Owner', 'Source'], 'Listed with owners'], ['OPERATIONS', '#5aa9ff', 'Where are open work orders piling up, by site?', ['North', 'Harbor', 'East'], 'One site flagged']];
add('07-four-identical-cards', 'Four identical dark cards with category tag and chips', 'Same radius, border, padding, label, question, chips and status pill, four times.', 'home, architecture, industries (255 rounded surfaces, 52 percent in identical rows)', 'S1/S4/S7 identical card grids; S2 card kit; S3 uniform layout',
`<section class="dark sec" style="background:#0b0b10"><div class="wrap"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${cards4.map(c => `<div style="border:1px solid #2a2c37;border-radius:14px;padding:20px;background:#14151b;min-height:260px"><div style="font-size:10px;letter-spacing:.14em;color:${c[1]};font-weight:700;margin-bottom:14px">${c[0]}</div><div style="font-size:16px;margin-bottom:22px;line-height:1.35">${c[2]}</div>${c[3].map(x => `<div style="border:1px solid #2f3140;border-radius:8px;padding:8px 10px;font-size:11px;letter-spacing:.08em;margin-bottom:8px;color:#b3b6c2">${x}</div>`).join('')}<span class="pill" style="margin-top:6px;color:#58d6a4">&#9679; ${c[4]}</span></div>`).join('')}</div></div></section>
<style>@media(max-width:900px){.dark [style*="repeat(4"]{grid-template-columns:1fr 1fr!important}}@media(max-width:560px){.dark [style*="repeat(4"]{grid-template-columns:1fr!important}}</style>`,
`<section class="night" style="padding:88px 0"><div class="wrap"><div class="c7" style="display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start"><div><p class="kicker">One question, followed through</p><h2 style="margin-bottom:18px">Is this one vendor with three names?</h2><p>Yes. Three systems call it three things. We matched them and kept every original name.</p></div>
<div style="background:#f6f1e7;color:#0f2233;border-radius:4px;padding:8px 28px 12px"><table style="width:100%;border-collapse:collapse;font-size:16px"><tr style="text-align:left;font-size:14px;color:#3d5063"><th style="padding:14px 0;font-weight:600">System</th><th style="font-weight:600">Calls it</th><th style="font-weight:600">Note</th></tr>
${[['Ledger', 'Vendor 44127', 'Payment history'], ['Mailbox', 'HES', 'Most recent message'], ['Contract', 'Harbor Equipment Services', 'Renews next quarter']].map(r => `<tr style="border-top:1px solid #d9cfba"><td style="padding:14px 0">${r[0]}</td><td style="font-weight:600">${r[1]}</td><td style="color:#3d5063">${r[2]}</td></tr>`).join('')}</table>
<p style="color:#0f2233;margin-top:14px;font-family:var(--head);font-size:20px">One company. Three names on file. Example data.</p></div></div></div></section>
<style>@media(max-width:760px){.c7{grid-template-columns:1fr!important;gap:32px!important}}</style>`);

// 08 pills
add('08-status-pills', 'Pill chips that carry no state', '351 pills: tags, status dots, "Illustrative example" badges, "Talk to us" capsules. A green dot beside "One customer" is not a status.', '351 pill-shaped chips across the site', 'S5 generic Live/New badges, decoration cosplaying as information',
`<section class="dark sec" style="background:#14151b"><div class="wrap"><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px"><span class="pill" style="color:#58d6a4">&#9679; One customer</span><span class="pill" style="color:#58d6a4">&#9679; One vendor</span><span class="pill" style="color:#5aa9ff">&#9679; Listed with owners</span><span class="pill" style="color:#f0b04a">&#9679; One site flagged</span><span class="pill" style="color:#f0b04a">&#9679; What changed</span></div>
<div style="display:flex;gap:8px;flex-wrap:wrap"><span class="pill">Open orders</span><span class="pill">Inspection record</span><span class="pill">Supplier update</span><span class="pill">Illustrative example</span></div></div></section>`,
`<section class="night" style="padding:72px 0"><div class="wrap"><p style="font-size:18px;max-width:60ch;color:#f6f1e7"><b style="font-weight:600">One site is flagged.</b> The east warehouse has 14 open orders and a failed inspection.</p>
<p style="font-size:14px;margin-top:14px;color:#8fa6b8;max-width:none">Sources: open orders, inspection record, supplier update. Example data.</p></div></section>`);

// 09 brain
add('09-particle-brain', 'Glowing multicolor network brain', 'A rotating mesh of green, blue, orange and purple nodes on black. This is the stock "AI brain" vocabulary.', 'home hero-adjacent stage, arthur, operating-system (brain.js canvas)', 'S16 stock listings for glowing neural brains; S1/S4 glow with no reason. The brand idea (records connecting) stays; the rendering changes.',
`<section class="dark sec" style="background:#0b0b10"><div class="wrap" style="text-align:center"><img src="${IMG}brain.png" style="width:min(420px,80%);margin:auto"><p style="font-size:13px;margin-top:20px">Illustrative sequence: questions, evidence, and answers</p></div></section>`,
`<section class="night" style="padding:72px 0"><div class="wrap"><div style="max-width:880px;margin:auto"><svg viewBox="0 0 880 300" style="width:100%;height:auto" role="img" aria-label="Three names resolve to one company">
<g font-family="Public Sans, sans-serif" font-size="17" fill="#f6f1e7">
<g stroke="#7fd0c9" stroke-width="1.5" fill="none"><path d="M250 60 C 400 60, 440 150, 560 150"/><path d="M250 150 L 560 150"/><path d="M250 240 C 400 240, 440 150, 560 150"/></g>
<g><rect x="30" y="38" width="220" height="44" rx="4" fill="none" stroke="#5d7488"/><text x="48" y="66">Ledger: Vendor 44127</text>
<rect x="30" y="128" width="220" height="44" rx="4" fill="none" stroke="#5d7488"/><text x="48" y="156">Mailbox: HES</text>
<rect x="30" y="218" width="220" height="44" rx="4" fill="none" stroke="#5d7488"/><text x="48" y="246">Contract: Harbor Equipment</text></g>
<rect x="560" y="104" width="290" height="92" rx="4" fill="#f6f1e7"/><text x="580" y="140" fill="#0f2233" font-family="Newsreader, serif" font-size="26" font-weight="500">Harbor Equipment Services</text><text x="580" y="172" fill="#3d5063" font-size="15">One company, three names kept as aliases</text></g></svg>
<p style="text-align:center;font-size:14px;margin:12px auto 0;color:#8fa6b8">How three records resolve to one. Example data.</p></div></div></section>`);

// 10 fake browser frame
add('10-fake-browser-frame', 'Fake browser window around a mock UI', 'Three gray traffic-light dots, a breadcrumb and a "preview" label wrap a hand-built interface; pills and a sparkle glyph decorate it.', 'home interactive preview, operating-system', 'S8 template screenshot genre; S5 decoration cosplaying as information (our judgment; no source names browser chrome)',
`<section class="gray sec"><div class="wrap"><div style="background:#fff;border:1px solid #e4e5e9;border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,.08);overflow:hidden"><div style="display:flex;gap:6px;align-items:center;padding:14px 18px;border-bottom:1px solid #eee;font-size:12px;color:#62656c"><i style="width:9px;height:9px;border-radius:50%;background:#dcdce0;display:block"></i><i style="width:9px;height:9px;border-radius:50%;background:#dcdce0;display:block"></i><i style="width:9px;height:9px;border-radius:50%;background:#dcdce0;display:block"></i><span style="margin-left:12px">LOVELEEDAY / Intelligence</span><span style="margin-left:auto">&#9679; Interactive system preview</span></div>
<div style="display:grid;grid-template-columns:180px 1fr;min-height:260px"><div style="background:#fafafb;padding:20px;border-right:1px solid #eee;font-size:13px;line-height:2.2;color:#62656c"><div class="eyebrow" style="margin-bottom:6px">Workspace</div><div style="background:#e8f0fc;color:#0066cc;border-radius:8px;padding:0 10px;line-height:2">&#10022; Intelligence</div>&#9671; Relationships<br>&#9719; Memory<br>&#8972; Conditions</div>
<div style="padding:26px"><div style="display:flex;gap:8px;margin-bottom:18px"><span class="pill" style="background:#e8f0fc;color:#0066cc">Resolve an identity</span><span class="pill">Recall a moment</span><span class="pill">Verify a claim</span></div><div style="font-size:24px;letter-spacing:-.02em;margin-bottom:14px">Who is HES, across our systems?</div><p style="font-size:15px">One company. Several names. HES and Harbor Equipment Services resolve to the same company.</p></div></div></div></div></section>
<style>@media(max-width:760px){.gray [style*="180px 1fr"]{grid-template-columns:1fr!important}}</style>`,
`<section style="padding:80px 0"><div class="wrap"><div style="display:grid;grid-template-columns:4fr 6fr;gap:56px;align-items:center" class="c10"><div><p class="kicker">Ask in plain words</p><h2 style="margin-bottom:16px;font-size:36px">Who is HES, across our systems?</h2><p>The answer names the company, lists every name it goes by, and points to the record behind each.</p></div>
<div style="background:#fff;border:1px solid #d9cfba;padding:28px 30px"><div style="font-size:14px;color:#3d5063;margin-bottom:8px">Answer</div><div style="font-family:var(--head);font-size:26px;line-height:1.25;margin-bottom:18px">One company: Harbor Equipment Services.</div>
<table style="width:100%;border-collapse:collapse;font-size:15px">${[['HES', 'Mailbox', 'May 2'], ['Vendor 44127', 'Ledger', 'Mar 14'], ['Harbor Equipment Services', 'Contract', 'Jan 9']].map(r => `<tr style="border-top:1px solid #e6dcc6"><td style="padding:10px 0;font-weight:600">${r[0]}</td><td style="color:#3d5063">${r[1]}</td><td style="color:#3d5063;text-align:right">${r[2]}</td></tr>`).join('')}</table></div></div></div></section>
<style>@media(max-width:760px){.c10{grid-template-columns:1fr!important;gap:28px!important}}</style>`);

// 11 copy frames
add('11-copy-frames', 'Copy built from stock frames', '"The problem isn\'t X. It\'s Y." and "It isn\'t A. It\'s B." open 18 sentences across the notes essays; one-line example disclaimers repeat under nearly every figure.', '18 not-X-it\'s-Y frames; two-part headline on 29 pages', 'S11 not-X-it\'s-Y, two fragments, always three things; S10 predictable rhythm is the real tell; S2 delete any number you cannot source',
`<section class="sec"><div class="wrap" style="max-width:760px"><h2 style="font-size:36px;margin-bottom:24px">Alerts are noise. Conditions are signal.</h2><p style="color:#1d1d1f;margin-bottom:16px">The problem isn't that there are too many alerts. It's that alerts watch events, and most events don't matter.</p><p style="color:#1d1d1f;margin-bottom:16px">A migration isn't done when the rows arrive. It's done when the old questions still have answers.</p><p style="color:#1d1d1f">The fix isn't renaming everything. It's giving every name somewhere to point.</p></div></section>`,
`<section style="padding:96px 0"><div class="wrap" style="max-width:760px"><h2 style="margin-bottom:24px;font-size:36px">Most alerts watch events. The useful ones watch conditions.</h2><p style="color:var(--ink);margin-bottom:16px">A late shipment is an event. A late shipment for the one customer whose contract has a penalty clause is a condition. Event alerts fire hundreds of times a week; a condition fires when something is actually wrong.</p><p style="color:var(--ink);margin-bottom:16px">A migration is finished when someone can ask last year's question and get last year's answer, not when the last row lands.</p><p style="color:var(--ink)">Give each old name an alias that points to the one record, and keep where the name came from.</p></div></section>`);

// 12 repeated section rhythm
const miniB = (cls, tone) => `<div class="${cls}" style="padding:44px 0;border-bottom:1px solid rgba(128,128,128,.25)"><div class="wrap two" style="gap:40px"><div><p class="eyebrow" style="margin-bottom:12px">Label</p><h2 style="font-size:30px">Headline one.<span class="dim">Headline two.</span></h2></div><p style="font-size:15px">One paragraph of supporting copy sits on the right, in gray, aligned to the bottom of the headline.</p></div></div>`;
add('12-repeating-section-pattern', 'Every section is the same two-column split', 'Label, two-tone headline left, one gray paragraph right, 96px above and below, alternating dark, white, gray and cream bands. 72 sections share one 96/96 padding.', '72 sections at 96/96 padding; split pattern on most pages', 'S7 uniform sections, same height padding and heading size; S8 visibly undecided; S3 uniform layout',
`${miniB('dark', 1)}${miniB('', 1)}${miniB('gray', 1)}${miniB('cream', 1)}<style>.dark .wrap,.gray .wrap,.cream .wrap{}</style>`,
`<div style="padding:48px 0 28px"><div class="wrap"><h2 style="font-size:52px;max-width:18ch">Short statement, set large, with room around it</h2></div></div>
<div style="padding:28px 0 28px;background:var(--paper2)"><div class="wrap" style="display:grid;grid-template-columns:3fr 2fr;gap:56px" class="c12"><div><h3 style="margin-bottom:10px">A section that is mostly the work</h3><p>Dense, with a table or a figure carrying the point; the heading is small because the content is not.</p></div><p style="font-size:15px;align-self:end;color:var(--ink2)">A side note at a smaller measure.</p></div></div>
<div class="night" style="padding:56px 0"><div class="wrap" style="max-width:720px"><p style="font-family:var(--head);font-size:30px;line-height:1.3;color:#f6f1e7;max-width:none">A single quoted answer on a dark band, left-aligned, then nothing else.</p></div></div>`);

// 13 industries list with arrows
const inds = ['Hospitality & experiences', 'Retail & commerce', 'Manufacturing & distribution', 'Professional services', 'Property & facilities', 'Local government', 'Nonprofits & community organizations', 'Groups & portfolios'];
add('13-arrow-list', 'An arrow on every row, a link with an arrow under it', 'Eight single-line rows each ending in a diagonal arrow, then "Explore your industry" and "Explore the work" with more arrows.', '27 arrow glyphs in copy plus one per list row', 'S7 chevron CTAs on every link; S2 arrow on every link',
`<section class="sec"><div class="wrap"><div style="display:grid;grid-template-columns:1fr 1fr;column-gap:64px" class="i13">${inds.map(x => `<div style="display:flex;justify-content:space-between;padding:24px 0;border-bottom:1px solid #e4e5e9;font-size:20px;letter-spacing:-.01em">${x}<span style="color:#8a8d95">&#8599;</span></div>`).join('')}</div><p style="margin-top:28px"><a class="link">Explore your industry &#8599;</a><a class="link">Explore the work &#8594;</a></p></div></section><style>@media(max-width:760px){.i13{grid-template-columns:1fr!important}}</style>`,
`<section style="padding:88px 0"><div class="wrap"><div style="display:grid;grid-template-columns:1fr 1fr;column-gap:64px" class="i13">${[['Hospitality', 'Reservations, events and inventory in one picture'], ['Retail', 'What sold, what it earned, what to reorder'], ['Manufacturing', 'One part across every system it touches'], ['Professional services', 'Time, billing and engagements that agree'], ['Property', 'Leases, work orders and vendors by building'], ['Local government', 'Rules on file and the gaps still open'], ['Nonprofits', 'Donors, grants and programs on one record'], ['Portfolios', 'Many entities, one comparable view']].map(x => `<a style="display:block;padding:20px 0;border-top:1px solid var(--line);text-decoration:none;color:inherit"><span style="font-family:var(--head);font-size:24px;display:block">${x[0]}</span><span style="font-size:15px;color:var(--ink2)">${x[1]}</span></a>`).join('')}</div></div></section><style>@media(max-width:760px){.i13{grid-template-columns:1fr!important}}</style>`);

// 14 portal dashboard
add('14-portal-dashboard', 'Portal home: checklist, empty card, blue links', 'Eyebrow plus big tight heading, a "Getting started" rounded card with struck-through steps in default blue, then a centered empty state in a second identical card.', 'portal.loveleedaystudios.com home (screenshot qa_client_1440); cards centered, links #0066cc', 'S3 missing unhappy paths and empty states that prompt the next action; S7 missing states; S2 card kit',
`<section class="sec" style="padding:56px 0"><div class="wrap"><p class="eyebrow">DABNEY &amp; CO.</p><h1 style="font-size:48px;margin-bottom:16px">What needs your attention</h1><p style="font-size:16px;max-width:520px;margin-bottom:32px">See the answers we have prepared for Dabney &amp; Co., the work waiting on you, and the records behind it.</p>
<div style="border:1px solid #e4e5e9;border-radius:20px;padding:24px 24px 8px;margin-bottom:28px"><div style="display:flex;justify-content:space-between;margin-bottom:18px"><h3 style="font-size:22px;font-weight:400">Getting started</h3><span style="font-size:13px;color:#62656c">2 of 4 done</span></div>
${[['Connect your first system or upload a file', 1], ['Share the documents behind your numbers', 0], ['Invite the people who need answers', 1], ['Review what needs your decision', 0]].map(s => `<div style="display:flex;gap:12px;margin-bottom:16px;font-size:14px"><i style="width:14px;height:14px;border-radius:50%;margin-top:3px;flex:none;${s[1] ? 'background:#1d1d1f' : 'border:1px solid #ccc'}"></i><span style="${s[1] ? 'text-decoration:line-through;color:#62656c' : 'color:#0066cc'}">${s[0]}</span></div>`).join('')}</div>
<h3 style="font-size:22px;font-weight:400;margin-bottom:14px">Answers and completed work</h3><div style="border:1px solid #e4e5e9;border-radius:20px;padding:44px 30px;text-align:center"><h3 style="font-size:20px;font-weight:400;margin-bottom:10px">Nothing is ready to review yet</h3><p style="font-size:15px;max-width:380px;margin:auto">Studies, audits and compliance documents prepared for you appear here. Connecting a system or sharing documents is what gets the first one started.</p></div></div></section>`,
`<section style="padding:48px 0 64px"><div class="wrap" style="max-width:880px"><h1 style="font-size:44px;margin-bottom:6px">Dabney &amp; Co.</h1><p style="margin-bottom:36px">Two of four setup steps are done. Next up: share the documents behind your numbers.</p>
<div style="background:var(--teal2);color:#f6f1e7;padding:28px 30px;display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;margin-bottom:36px" class="c14"><div><div style="font-size:14px;color:#bfe3df;margin-bottom:6px">Next step</div><div style="font-family:var(--head);font-size:26px;line-height:1.2">Share the documents behind your numbers</div><div style="font-size:15px;color:#d8ebe8;margin-top:6px">Contracts, policies and reports, so every figure can point to its source.</div></div><a class="btn" style="background:#f6f1e7;color:#0f2233">Add documents</a></div>
<h3 style="font-size:24px;margin-bottom:10px">Setup</h3><div>${[['Connect a system or upload a file', 'Done'], ['Share documents', 'To do'], ['Invite your team', 'Done'], ['Review what needs your decision', 'To do']].map(s => `<div style="display:flex;justify-content:space-between;padding:12px 0;border-top:1px solid var(--line);font-size:16px"><span>${s[0]}</span><span style="color:${s[1] === 'Done' ? 'var(--teal2)' : 'var(--ink2)'};font-weight:600">${s[1]}</span></div>`).join('')}</div>
<h3 style="font-size:24px;margin:36px 0 8px">Answers</h3><p style="border-top:1px solid var(--line);padding-top:14px">No answers yet. The first appears here after you connect a system or share documents.</p></div></section>
<style>@media(max-width:760px){.c14{grid-template-columns:1fr!important}}</style>`);

// write files
const doc = (css, body, extraHead = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>mockup</title><style>${css}</style>${extraHead}</head><body><div id="stage">${body}</div></body></html>`;
for (const m of M) {
  fs.writeFileSync(path.join(dir, `${m.id}-before.html`), doc(BEFORE_CSS, m.before));
  fs.writeFileSync(path.join(dir, `${m.id}-after.html`), doc(AFTER_CSS, m.after));
}
fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(M.map(({ before, after, ...r }) => r), null, 1));
console.log('wrote', M.length, 'pairs');
