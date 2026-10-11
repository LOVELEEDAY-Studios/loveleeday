// analyze.mjs <crawl.json> : prints the counted tells from an ai-tell-check --json dump
import fs from 'node:fs';
import { isTwoPart } from '/Users/danielmay/arthur/scripts/ai-tell-check.mjs';
const { pages } = JSON.parse(fs.readFileSync(process.argv[2] || 'crawl/all.json', 'utf8'));
const short = u => u.replace(/https?:\/\/[^/]+/, '') || '/';
const sum = (f) => pages.reduce((a, p) => a + f(p), 0);
const tally = (obj, k, c = 1) => { obj[k] = (obj[k] || 0) + c; };
let h12 = 0; const tp = []; const sizes = {}, weights = {}, ls = {};
for (const p of pages) for (const h of p.headings) { if (h.tag === 'H3') continue; h12++; if (isTwoPart(h.text)) tp.push([short(p.url), h.text]);
  if (h.tag === 'H2') { tally(sizes, h.size); tally(weights, h.weight); tally(ls, h.ls); } }
console.log('h1/h2 total', h12, 'two-part', tp.length); console.log(tp.map(x => x.join('  ')).join('\n'));
console.log('H2 sizes', sizes, 'weights', weights, 'ls', ls);
const labSizes = {}, labLs = {}, labPer = []; let lab = 0;
for (const p of pages) { lab += p.labels.length; labPer.push(short(p.url) + ':' + p.labels.length); for (const l of p.labels) { tally(labSizes, l.size); tally(labLs, l.ls); } }
console.log('labels', lab, labSizes, labLs); console.log(labPer.join(' '));
console.log('label samples', pages[0].labels.slice(0, 8).map(l => l.text));
for (const p of pages) if (p.gradients.length) console.log('grad', short(p.url), p.gradients.map(g => g.sel + ':' + g.kind + ':' + (g.val || '')).join(' ; ').slice(0, 300));
for (const p of pages) if (p.leftAccent.length) console.log('leftaccent', short(p.url), JSON.stringify(p.leftAccent));
console.log('pills', sum(p => p.pills.length), pages[0].pills.slice(0, 8).map(x => x.text));
const f = {}; for (const p of pages) for (const [k, c] of Object.entries(p.fonts)) tally(f, k, c); console.log('fonts', f);
const rad = {}; for (const p of pages) for (const [r, c] of Object.entries(p.radii)) tally(rad, r, c);
console.log('radii', rad, 'cardRows', sum(p => p.cardRows.length), 'cards', sum(p => p.cardCount), 'uniform', sum(p => p.uniformCards));
console.log('cardrows', pages.flatMap(p => p.cardRows.map(r => short(p.url) + ' ' + r.sel + ' x' + r.count)).slice(0, 25).join(' | '));
const nxy = pages.flatMap(p => p.notXY.map(s => [short(p.url), s]));
console.log('arrows', sum(p => p.arrows), 'emdash', sum(p => p.emDash), 'notXY', nxy.length); console.log(nxy.slice(0, 15).map(x => x.join(' :: ')).join('\n'));
const hx = {}; for (const p of pages) for (const [k, c] of Object.entries(p.hexes)) tally(hx, k, c);
console.log('text hexes', Object.entries(hx).sort((a, b) => b[1] - a[1]).slice(0, 10));
const bg = {}; for (const p of pages) for (const [h, a] of p.bgHexes) tally(bg, h, a); console.log('bg hexes', Object.entries(bg).sort((a, b) => b[1] - a[1]).slice(0, 10));
const pd = {}; for (const p of pages) for (const [k, c] of Object.entries(p.paddings)) tally(pd, k, c);
console.log('paddings', Object.entries(pd).sort((a, b) => b[1] - a[1]).slice(0, 8), 'sections', sum(p => p.sections.length), 'centered', sum(p => p.sections.filter(s => s.centered).length));
console.log('banned', pages.flatMap(p => p.banned.map(b => short(p.url) + ':' + b)));
console.log('mono pages', pages.filter(p => Object.keys(p.fonts).some(k => /mono/i.test(k))).map(p => short(p.url)).slice(0, 8));
