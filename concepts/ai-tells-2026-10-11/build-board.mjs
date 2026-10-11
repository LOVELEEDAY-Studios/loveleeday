// build-board.mjs : writes board.html (self-contained, relative paths) from mockups/index.json and the S1..S16 list in EXPERTISE.md.
// Run from this folder: node build-board.mjs   (run mockups/build-mockups.mjs first)
import fs from 'node:fs';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const idx = JSON.parse(fs.readFileSync(path.join(dir, 'mockups/index.json'), 'utf8'));
const src = {};
for (const l of fs.readFileSync(path.join(dir, 'EXPERTISE.md'), 'utf8').split('\n')) {
  const m = /^- (S\d+) (.+?): (https?:\/\/\S+)\s*$/.exec(l) || /^- (S\d+) (.+?) \((.+?)\): (https?:\/\/\S+)\s*$/.exec(l);
  if (m) src[m[1]] = { title: m[2], url: m[m.length - 1] };
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const safeUrl = u => (/^https?:\/\/[^\s"'<>]+$/.test(u) ? u : '#');
const linkSources = s => esc(s).replace(/\bS(\d+)\b/g, (t, n) => src['S' + n] ? `<a href="#src-S${n}">S${n}</a>` : t);
const tiles = idx.map((m, i) => `<article class="pair" id="p${i + 1}"><header><h2><span class="n">${i + 1}</span>${esc(m.title)}</h2>
<dl><div><dt>Count on the live site</dt><dd>${esc(m.count)}</dd></div><div><dt>What it is</dt><dd>${esc(m.tell)}</dd></div><div><dt>Cited source</dt><dd>${linkSources(m.source)}</dd></div></dl></header>
<div class="sides"><figure><figcaption>Before: the site today</figcaption><a class="stage" href="mockups/${esc(m.id)}-before.html" target="_blank" rel="noopener" aria-label="Open before at full size"><div class="box"><iframe src="mockups/${esc(m.id)}-before.html" title="Before ${esc(m.title)}" scrolling="no"></iframe></div></a></figure>
<figure><figcaption>After: proposed</figcaption><a class="stage" href="mockups/${esc(m.id)}-after.html" target="_blank" rel="noopener" aria-label="Open after at full size"><div class="box"><iframe src="mockups/${esc(m.id)}-after.html" title="After ${esc(m.title)}" scrolling="no"></iframe></div></a></figure></div>
<div class="bench"><h3>Benchmarked against</h3><div class="bgrid">${(m.bench || []).map(b => `<figure><a href="${esc(b.file)}" target="_blank" rel="noopener"><img src="${esc(b.file)}" alt="${esc(b.site)} section" loading="lazy"></a><figcaption><b>${esc(b.site)}</b>. ${esc(b.what)}</figcaption></figure>`).join('')}</div></div></article>`).join('\n');
const srcList = Object.entries(src).map(([k, v]) => `<li id="src-${k}"><b>${k}</b> <a href="${safeUrl(v.url)}" target="_blank" rel="noopener">${esc(v.title)}</a></li>`).join('\n');
const top10 = [
  ['Default system font stack', '100 percent of 182,485 characters'],
    ['Tracked all-caps labels', '562 across 35 pages, 42 on the home page, 85 percent at 10px'],
  ['Two-tone headlines', '46 percent of h1 and h2'],
  ['Two-part headlines ("Short. Short.")', '54 of 185 headings, 8 on the home page'],
  ['No type scale', '13 distinct h2 sizes, 98 percent at one weight'],
  ['Pill chips that carry no state', '351'],
  ['Rounded surfaces in identical rows', '255 surfaces, 132 (52 percent) in rows of 3 or more'],
  ['Stock AI brain and pasted hero card', 'multicolor network brain on 3 pages; card over photo on home and portal sign-in'],
  ['Copy frames and arrows', '18 "not X, it is Y" frames; 27 arrow glyphs plus one per list row']
];
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>How the site reads as AI-made</title>
<link rel="stylesheet" href="fonts.css">
<style>
:root{--navy:#1d1d1f;--cream:#fff;--paper:#fff;--teal:#0066cc;--muted:#62656c;--line:#e4e5e9}
*{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--navy);font:400 16px/1.55 'Switzer',sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--teal)}
.wrap{width:min(1400px,calc(100% - 48px));margin:0 auto}
header.top{padding:40px 0 16px;display:flex;gap:32px;justify-content:space-between;align-items:flex-end;flex-wrap:wrap}
h1{font:400 clamp(34px,4vw,52px)/1.05 'Sentient',Georgia,serif;margin:0 0 10px}
.sub{margin:0;max-width:700px;color:var(--muted);font-size:17px}
.tog{display:inline-flex;border:1px solid var(--navy);border-radius:999px;padding:4px;background:var(--paper)}
.tog button{border:0;background:transparent;border-radius:999px;padding:9px 20px;font:600 15px 'Switzer',sans-serif;color:var(--navy);cursor:pointer}
.tog button[aria-pressed=true]{background:var(--navy);color:var(--paper)}
.top10{background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:20px 24px;margin:16px 0 40px}
.top10 h2{font:600 22px/1.2 'Switzer',sans-serif;margin:0 0 12px}
.top10 ol{margin:0;padding-left:24px;columns:2;column-gap:48px}
.top10 li{margin-bottom:8px;break-inside:avoid}.top10 li span{display:block;color:var(--muted);font-size:14px}
.pair{border-top:1px solid var(--line);padding:32px 0 40px}
.pair header{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:32px;margin-bottom:20px}
.pair h2{font:600 24px/1.2 'Switzer',sans-serif;margin:0;letter-spacing:-.02em}
.n{display:inline-block;min-width:34px;color:var(--teal);margin-right:6px}
.bench{margin-top:20px}.bench h3{font:600 14px/1.3 'Switzer',sans-serif;color:var(--muted);margin:0 0 10px}.bgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.bgrid figure a{display:block;border:1px solid var(--line);overflow:hidden;border-radius:6px}.bgrid img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;object-position:top}.bgrid figcaption{margin:6px 0 0;font-weight:400;font-size:13px;color:var(--muted)}.bgrid figcaption b{color:#1d1d1f;font-weight:600}
dl{margin:0;display:grid;gap:10px}dt{font-size:13px;font-weight:600;color:var(--teal)}dd{margin:0;font-size:15px;color:#1d1d1f}
.sides{display:grid;grid-template-columns:1fr 1fr;gap:20px}
figure{margin:0}figcaption{font-size:14px;font-weight:600;margin-bottom:8px;color:var(--muted)}
.stage{display:block;position:relative;overflow:hidden;border:1px solid var(--line);background:#fff}
.stage .box{position:absolute;top:0;left:0;transform-origin:0 0;background:#fff}
.stage iframe{border:0;display:block;width:100%;height:100%;pointer-events:none}
.sources{border-top:1px solid var(--line);padding:32px 0 64px}
.sources h2{font:400 30px/1.1 'Sentient',Georgia,serif;margin:0 0 16px}
.sources ul{margin:0;padding:0;list-style:none;columns:2;column-gap:40px;font-size:14px}.sources li{margin-bottom:6px;break-inside:avoid}
@media(max-width:1000px){.pair header{grid-template-columns:1fr}.top10 ol,.sources ul{columns:1}}
@media(max-width:700px){.wrap{width:calc(100% - 32px)}.sides{grid-template-columns:1fr}}
</style></head><body>
<div class="wrap">
<header class="top"><div><h1>Fourteen ways the site reads as AI-made</h1>
<p class="sub">Each pair shows the live pattern on the left and a proposed fix on the right, in LOVELEEDAY's own colors (white, ink, blue, cream, dark) with Switzer and Sentient and real photography. Under each pair is the section from a company site it was benchmarked against. Counts come from a crawl of 35 live pages on Oct 11. Click any side for full size.</p></div>
<div class="tog" role="group" aria-label="Preview width"><button type="button" data-w="1440" aria-pressed="true">1440 wide</button><button type="button" data-w="390" aria-pressed="false">390 wide</button></div></header>
<section class="top10"><h2>The ten biggest tells, by count</h2><ol>${top10.map(t => `<li>${esc(t[0])}<span>${esc(t[1])}</span></li>`).join('')}</ol></section>
<main>${tiles}</main>
<section class="sources"><h2>Sources</h2><ul>${srcList}</ul><p class="sub" style="margin-top:16px">Sources are blogs, wikis and skill pages, not studies. S9 and S11 were read from search snippets only. Thresholds in the checker are judgment calls; see EXPERTISE.md.</p></section>
</div>
<script>
let W=1440;
function layout(){
 document.querySelectorAll('.stage').forEach(s=>{
  const box=s.querySelector('.box'),f=s.querySelector('iframe');const tw=s.clientWidth;
  const fh=W===390?900:720;const scale=Math.min(tw/W,1);
  s.style.height=Math.round(fh*scale)+'px';
  box.style.width=W+'px';box.style.height=fh+'px';f.style.width=W+'px';f.style.height=fh+'px';
  box.style.transform='translate('+Math.round((tw-W*scale)/2)+'px,0) scale('+scale+')';
  s.style.background=W===390?'#f5f5f7':'#fff';box.style.boxShadow=W===390?'0 0 0 1px #e4e5e9':'none';
 });
}
document.querySelectorAll('.tog button').forEach(b=>b.onclick=()=>{W=+b.dataset.w;document.querySelectorAll('.tog button').forEach(x=>x.setAttribute('aria-pressed',x===b));layout()});
addEventListener('resize',layout);layout();
</script></body></html>
`;
fs.writeFileSync(path.join(dir, 'board.html'), html);
console.log('board.html written,', idx.length, 'pairs,', Object.keys(src).length, 'sources');
