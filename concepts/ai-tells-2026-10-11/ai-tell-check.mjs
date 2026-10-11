#!/usr/bin/env node
// ai-tell-check.mjs -- measures the tells that make a site read as AI/template-made.
// Usage:
//   node ai-tell-check.mjs <url> [<url>...]            live pages, headless CLOUD browser (computed styles)
//   node ai-tell-check.mjs --urls-file urls.txt        one URL per line
//   node ai-tell-check.mjs --dir path/to/html          static check of .html files + linked/inline CSS (no browser)
//   flags: --json out.json (full per-page data + instances)  --quiet  --config thresholds.json
// Exit 0 = under every threshold, exit 2 = at least one tell over threshold (list printed).
// Tells and sources are documented in ~/arthur/knowledge/design/ai-made-website-tells-mastery.md

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export const DEFAULTS = {
  // site-level (aggregate over all pages checked)
  maxDefaultStackShare: 0.15,     // share of visible text set in a system/Inter/Roboto/Geist default stack
  maxDefaultHexHits: 0,           // distinct Apple/Tailwind default hexes used as brand colors (ink/bg/link)
  maxTwoPartHeadlineShare: 0.15,  // share of h1/h2 that are "Short sentence. Short sentence." / "X, not Y"
  maxAllCapsLabelsPerPage: 4,     // mean uppercase/tracked small labels per page
  maxUniformCardRatio: 0.60,      // share of cards sitting in a row of 3+ identical siblings
  maxBannedCopyPerPage: 1,        // mean banned words per page
  maxCenteredSectionRatio: 0.50,  // share of sections with centered text
  maxGradientsPerPage: 1,         // gradient backgrounds/text per page
  maxEmDashPerPage: 3,            // mean em dashes in visible copy
  maxNotXButYPerPage: 1,          // "not X, it's Y" frames
  maxSameRadiusShare: 0.85,       // share of rounded surfaces sharing the single most common radius
  maxTwoToneHeadlineShare: 0.10,  // share of h1/h2 whose second half is a different color (the gray-second-line headline)
  maxH2SizeVariety: 6,            // distinct h2 font sizes site-wide (a type scale has ~4-5 steps)
  maxSingleWeightShare: 0.90,     // share of h2 using one weight (no weight contrast)
  maxTinyLabelShare: 0.40,        // share of uppercase labels at 11px or smaller
  maxStrokeIconShare: 0.50,      // share of svg icons that are Lucide/Heroicons style (24 viewBox, stroke 1.5-2, round caps)
  maxLeftAccentCards: 0,          // rounded cards with a thick one-sided colored border
  maxSameSectionPaddingShare: 0.60, // share of sections using the single most common vertical padding (no rhythm)
};

export const DEFAULT_HEXES = {
  // Apple
  '#1d1d1f': 'Apple ink', '#f5f5f7': 'Apple gray bg', '#0066cc': 'Apple link blue', '#0071e3': 'Apple button blue',
  '#86868b': 'Apple secondary gray', '#6e6e73': 'Apple muted gray', '#424245': 'Apple dark gray', '#fbfbfd': 'Apple off-white',
  // Tailwind
  '#6366f1': 'tailwind indigo-500', '#4f46e5': 'tailwind indigo-600', '#8b5cf6': 'tailwind violet-500', '#7c3aed': 'tailwind violet-600',
  '#a855f7': 'tailwind purple-500', '#9333ea': 'tailwind purple-600', '#3b82f6': 'tailwind blue-500', '#2563eb': 'tailwind blue-600',
  '#10b981': 'tailwind emerald-500', '#0f172a': 'tailwind slate-900', '#f8fafc': 'tailwind slate-50', '#64748b': 'tailwind slate-500',
  '#111827': 'tailwind gray-900', '#f9fafb': 'tailwind gray-50', '#6b7280': 'tailwind gray-500',
  // second-wave cream/terracotta
  '#f4f1ea': 'cream default', '#d97757': 'terracotta default',
};

export const BANNED_WORDS = ['seamless', 'seamlessly', 'unlock', 'unleash', 'empower', 'elevate', 'supercharge', 'streamline', 'leverage',
  'robust', 'cutting-edge', 'next-generation', 'next-gen', 'game-changer', 'transform your', 'revolutionize', 'delve', 'tapestry',
  'journey', 'holistic', 'synergy', 'effortless', 'effortlessly', 'powerful', 'all-in-one', 'end-to-end', 'world-class', 'best-in-class',
  'at scale', 'turbocharge', 'harness', 'navigate the', 'landscape', 'in today\'s'];

export const DEFAULT_FONT_RE = /^(-apple-system|blinkmacsystemfont|system-ui|ui-sans-serif|inter|inter variable|roboto|arial|helvetica neue|helvetica|segoe ui|open sans|lato|geist|geist sans|plus jakarta sans|sf pro|san francisco)$/i;

// In-page measurement. Runs inside the browser; must be self-contained.
export const MEASURE_FN = `(() => {
  const BANNED = ${JSON.stringify(BANNED_WORDS)};
  const hex = (c) => { const m = c && c.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?/); if (!m) return null; if (m[4] !== undefined && +m[4] === 0) return null;
    return '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join(''); };
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
  const sel = (el) => { if (el.id) return el.tagName.toLowerCase() + '#' + el.id; let s = el.tagName.toLowerCase(); if (el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.'); return s; };
  const rect = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x + scrollX), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const out = { fonts: {}, hexes: {}, headings: [], labels: [], cards: [], gradients: [], banned: [], emDash: 0, notXY: [], radii: {}, sections: [], icons: { total: 0, stroke: 0 }, leftAccent: [], pills: [], arrows: 0, numbered: 0, textChars: 0, paddings: {} };
  const root = document.body;
  // fonts by character weight + colors
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n; while ((n = walker.nextNode())) {
    const t = n.nodeValue.trim(); if (!t) continue; const el = n.parentElement; if (!el || /SCRIPT|STYLE|NOSCRIPT/.test(el.tagName) || !vis(el)) continue;
    const cs = getComputedStyle(el); const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    out.fonts[fam] = (out.fonts[fam] || 0) + t.length; out.textChars += t.length;
    const h = hex(cs.color); if (h) out.hexes['text ' + h] = (out.hexes['text ' + h] || 0) + t.length;
  }
  const text = root.innerText || '';
  out.emDash = (text.match(/\\u2014/g) || []).length;
  out.arrows = (text.match(/\\u2192/g) || []).length;
  const lower = text.toLowerCase();
  for (const w of BANNED) { const re = new RegExp('\\\\b' + w.replace(/[-]/g, '[- ]') , 'g'); const c = (lower.match(re) || []).length; if (c) out.banned.push([w, c]); }
  const nxy = text.match(/[^.\\n]{0,60}\\b(isn't|is not|not|aren't|don't|doesn't)\\b[^.\\n]{0,60}[,.;\\u2014-]\\s*(it's|it is|but|they're|it)\\b[^.\\n]{0,60}/gi) || [];
  out.notXY = nxy.slice(0, 12).map(s => s.trim());
  // backgrounds / borders / radii / gradients / cards
  const all = [...root.querySelectorAll('*')].filter(vis);
  const bgHexes = {};
  for (const el of all) {
    const cs = getComputedStyle(el); const r = rect(el);
    const bg = hex(cs.backgroundColor); if (bg && r.w * r.h > 4000) bgHexes[bg] = (bgHexes[bg] || 0) + r.w * r.h;
    if (/gradient/.test(cs.backgroundImage) && !/url\\(/.test(cs.backgroundImage) && r.w * r.h > 20000) out.gradients.push({ sel: sel(el), rect: r, kind: 'bg', val: cs.backgroundImage.slice(0, 80) });
    if ((cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text') && /gradient/.test(cs.backgroundImage)) out.gradients.push({ sel: sel(el), rect: r, kind: 'text' });
    const rad = parseFloat(cs.borderTopLeftRadius) || 0;
    const surface = (bg && bg !== '#ffffff') || cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0;
    if (rad >= 8 && surface && r.w > 120 && r.h > 60) { out.radii[Math.round(rad)] = (out.radii[Math.round(rad)] || 0) + 1; out.cards.push({ sel: sel(el), rect: r, radius: Math.round(rad), parent: el.parentElement, shadow: cs.boxShadow !== 'none' }); }
    const bl = parseFloat(cs.borderLeftWidth) || 0, bt = parseFloat(cs.borderTopWidth) || 0;
    if (rad >= 6 && bl >= 3 && bt <= 1 && r.h > 50) out.leftAccent.push({ sel: sel(el), rect: r });
    if (rad >= 999 || (rad >= r.h / 2 - 1 && r.h < 44 && r.h > 16 && r.w < 260)) { const tx = (el.innerText || '').trim(); if (tx && tx.length < 40 && (bg || parseFloat(cs.borderTopWidth) > 0)) out.pills.push({ sel: sel(el), rect: r, text: tx }); }
    // uppercase / tracked labels
    if (cs.textTransform === 'uppercase' && !/^H[1-6]$/.test(el.tagName) && (el.innerText || '').trim().length > 1 && el.children.length === 0) {
      out.labels.push({ sel: sel(el), rect: r, text: (el.innerText || '').trim().slice(0, 40), ls: cs.letterSpacing, size: cs.fontSize, weight: cs.fontWeight });
    }
    if (el.tagName === 'svg' && r.w <= 48) { out.icons.total++; const vb = el.getAttribute('viewBox') || ''; const sw = el.getAttribute('stroke-width') || (el.querySelector('[stroke-width]') || {}).getAttribute?.('stroke-width');
      if (vb === '0 0 24 24' && (el.getAttribute('fill') === 'none' || cs.fill === 'none') && /^(1\\.5|2)$/.test(String(sw || '')) ) out.icons.stroke++; }
  }
  out.bgHexes = Object.entries(bgHexes).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => [k, Math.round(v / 1000)]);
  // headings
  for (const h of root.querySelectorAll('h1,h2,h3')) { if (!vis(h)) continue; const cs = getComputedStyle(h); const t = h.innerText.trim().replace(/\\s+/g, ' ');
    const hc = cs.color; const toneKids = [...h.querySelectorAll('span,em,i,b,strong')].filter(k => !k.closest('a') && getComputedStyle(k).color !== hc && (k.innerText || '').trim().length > 3);
    out.headings.push({ twoTone: toneKids.length > 0, tag: h.tagName, text: t, sel: sel(h), rect: rect(h), size: cs.fontSize, weight: cs.fontWeight, ls: cs.letterSpacing, align: cs.textAlign, family: cs.fontFamily.split(',')[0].replace(/["']/g, '') }); }
  // sections
  for (const s of root.querySelectorAll('main > section, body > section, section, main > div > section')) { if (!vis(s)) continue; const cs = getComputedStyle(s); const r = rect(s); if (r.h < 120) continue;
    const h = s.querySelector('h1,h2'); const ta = h ? getComputedStyle(h).textAlign : cs.textAlign;
    const pad = Math.round(parseFloat(cs.paddingTop)) + '/' + Math.round(parseFloat(cs.paddingBottom));
    out.paddings[pad] = (out.paddings[pad] || 0) + 1;
    out.sections.push({ sel: sel(s), rect: r, centered: ta === 'center', pad, bg: hex(cs.backgroundColor) }); }
  // card rows: group by parent, same width/height +-4px, >=3
  const byParent = new Map(); for (const c of out.cards) { if (!c.parent) continue; if (!byParent.has(c.parent)) byParent.set(c.parent, []); byParent.get(c.parent).push(c); }
  let uniform = 0; out.cardRows = [];
  for (const [p, list] of byParent) { if (list.length < 3) continue; const w = list[0].rect.w, h = list[0].rect.h; const same = list.filter(c => Math.abs(c.rect.w - w) <= 4 && Math.abs(c.rect.h - h) <= 24 && c.radius === list[0].radius); if (same.length >= 3) { uniform += same.length; out.cardRows.push({ sel: sel(p), rect: rect(p), count: same.length, radius: list[0].radius }); } }
  out.uniformCards = uniform; out.cardCount = out.cards.length;
  out.cards = out.cards.map(({ parent, ...rest }) => rest).slice(0, 60);
  out.title = document.title; out.url = location.href;
  return out;
})()`;

function hexNorm(h) { return h.toLowerCase(); }

export function evaluatePages(pages, cfg = DEFAULTS) {
  const n = pages.length || 1;
  let chars = 0, defaultChars = 0; const famTotals = {};
  const hexUse = {}; let h12 = 0, twoPart = 0; const twoPartList = [];
  let labels = 0, cards = 0, uniform = 0, banned = 0, centered = 0, sections = 0, gradients = 0, em = 0, nxy = 0, leftAcc = 0;
  const radii = {}; let icons = 0, strokeIcons = 0; const paddingSet = new Set(); const bannedTotals = {};
  for (const p of pages) {
    for (const [f, c] of Object.entries(p.fonts)) { famTotals[f] = (famTotals[f] || 0) + c; chars += c; if (DEFAULT_FONT_RE.test(f)) defaultChars += c; }
    for (const [k, v] of Object.entries(p.hexes)) { const h = k.split(' ')[1]; if (DEFAULT_HEXES[h]) hexUse[h] = (hexUse[h] || 0) + 1; }
    for (const [h] of (p.bgHexes || [])) if (DEFAULT_HEXES[h]) hexUse[h] = (hexUse[h] || 0) + 1;
    for (const h of p.headings.filter(x => x.tag !== 'H3')) { h12++; if (isTwoPart(h.text)) { twoPart++; twoPartList.push({ page: p.url, text: h.text }); } }
    labels += p.labels.length; cards += p.cardCount; uniform += p.uniformCards; gradients += p.gradients.length; em += p.emDash; nxy += p.notXY.length; leftAcc += p.leftAccent.length;
    for (const [w, c] of p.banned) { banned += c; bannedTotals[w] = (bannedTotals[w] || 0) + c; }
    for (const s of p.sections) { sections++; if (s.centered) centered++; paddingSet.add(s.pad); }
    for (const [r, c] of Object.entries(p.radii)) radii[r] = (radii[r] || 0) + c;
    icons += p.icons.total; strokeIcons += p.icons.stroke;
  }
  const padCounts = {}; for (const p of pages) for (const [k, c] of Object.entries(p.paddings || {})) padCounts[k] = (padCounts[k] || 0) + c;
  const padTotal = Object.values(padCounts).reduce((a, b) => a + b, 0), padTop = Math.max(0, ...Object.values(padCounts));
  const radTotal = Object.values(radii).reduce((a, b) => a + b, 0), radTop = Math.max(0, ...Object.values(radii));
  let twoTone = 0; const h2sizes = new Set(), h2w = {}; let h2n = 0, tiny = 0, labN = 0;
  for (const p of pages) { for (const h of p.headings) { if (h.tag === 'H3') continue; if (h.twoTone) twoTone++; if (h.tag === 'H2') { h2sizes.add(h.size); h2w[h.weight] = (h2w[h.weight] || 0) + 1; h2n++; } }
    for (const l of p.labels) { if (l.size) { labN++; if (parseFloat(l.size) <= 11) tiny++; } } }
  const m = {
    twoToneHeadlineShare: h12 ? twoTone / h12 : 0, h2SizeVariety: h2sizes.size, singleWeightShare: h2n ? Math.max(0, ...Object.values(h2w)) / h2n : 0, tinyLabelShare: labN ? tiny / labN : 0,
    defaultStackShare: chars ? defaultChars / chars : 0,
    defaultHexHits: Object.keys(hexUse).length,
    twoPartHeadlineShare: h12 ? twoPart / h12 : 0,
    allCapsLabelsPerPage: labels / n,
    uniformCardRatio: cards ? uniform / cards : 0,
    bannedCopyPerPage: banned / n,
    centeredSectionRatio: sections ? centered / sections : 0,
    gradientsPerPage: gradients / n,
    emDashPerPage: em / n,
    notXButYPerPage: nxy / n,
    sameRadiusShare: radTotal ? radTop / radTotal : 0,
    strokeIconShare: icons ? strokeIcons / icons : 0,
    leftAccentCards: leftAcc,
    sameSectionPaddingShare: padTotal ? padTop / padTotal : 0,
  };
  const lim = {
    defaultStackShare: ['max', cfg.maxDefaultStackShare], defaultHexHits: ['max', cfg.maxDefaultHexHits], twoPartHeadlineShare: ['max', cfg.maxTwoPartHeadlineShare],
    allCapsLabelsPerPage: ['max', cfg.maxAllCapsLabelsPerPage], uniformCardRatio: ['max', cfg.maxUniformCardRatio], bannedCopyPerPage: ['max', cfg.maxBannedCopyPerPage],
    centeredSectionRatio: ['max', cfg.maxCenteredSectionRatio], gradientsPerPage: ['max', cfg.maxGradientsPerPage], emDashPerPage: ['max', cfg.maxEmDashPerPage],
    notXButYPerPage: ['max', cfg.maxNotXButYPerPage], sameRadiusShare: ['max', cfg.maxSameRadiusShare], strokeIconShare: ['max', cfg.maxStrokeIconShare],
    twoToneHeadlineShare: ['max', cfg.maxTwoToneHeadlineShare], h2SizeVariety: ['max', cfg.maxH2SizeVariety], singleWeightShare: ['max', cfg.maxSingleWeightShare], tinyLabelShare: ['max', cfg.maxTinyLabelShare],
    leftAccentCards: ['max', cfg.maxLeftAccentCards], sameSectionPaddingShare: ['max', cfg.maxSameSectionPaddingShare],
  };
  const fails = [];
  for (const [k, [kind, v]] of Object.entries(lim)) { const val = m[k]; if (kind === 'max' ? val > v : val < v) fails.push({ tell: k, value: val, limit: v, kind }); }
  return { pages: n, metrics: m, fails, detail: { famTotals, hexUse: Object.fromEntries(Object.entries(hexUse).map(([h, c]) => [h + ' (' + DEFAULT_HEXES[h] + ')', c])), twoPartList, bannedTotals, radii, paddings: [...paddingSet] } };
}

export function isTwoPart(t) {
  const s = t.trim();
  if (/^[^.?!]{2,48}[.]\s+[^.?!]{2,60}[.]?$/.test(s)) return true;            // "Short. Short."
  if (/\b(not|isn't|aren't)\b[^.]{0,50}[,.—;:-]\s*(it's|it is|but|they're|that's|just|and)\b/i.test(s)) return true; // "X, not Y"
  if (/^[^,]{3,40},\s+not\s+[^,]{3,40}\.?$/i.test(s)) return true;
  return false;
}

// ----- static (dir) mode: no browser; CSS regex + visible text
function staticPage(file, cssText) {
  const html = fs.readFileSync(file, 'utf8');
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ');
  const text = body.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const css = cssText + '\n' + (html.match(/<style[\s\S]*?<\/style>/g) || []).join('\n');
  const fonts = {}; const fam = css.match(/font-family\s*:\s*([^;}{]+)/g) || [];
  for (const f of fam) { const first = f.split(':')[1].split(',')[0].replace(/["']/g, '').trim(); fonts[first] = (fonts[first] || 0) + 1000; }
  const hexes = {}; for (const h of css.match(/#[0-9a-fA-F]{6}\b/g) || []) hexes['css ' + hexNorm(h)] = 1;
  const heads = [...html.matchAll(/<h([12])[^>]*>([\s\S]*?)<\/h\1>/g)].map(m => ({ tag: 'H' + m[1], text: m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }));
  const lower = text.toLowerCase(); const banned = [];
  for (const w of BANNED_WORDS) { const c = (lower.match(new RegExp('\\b' + w.replace(/-/g, '[- ]'), 'g')) || []).length; if (c) banned.push([w, c]); }
  const upper = (css.match(/text-transform\s*:\s*uppercase/g) || []).length;
  const grads = (css.match(/gradient\(/g) || []).length;
  const radii = {}; for (const r of css.match(/border-radius\s*:\s*(\d+)px/g) || []) { const v = r.match(/(\d+)/)[1]; radii[v] = (radii[v] || 0) + 1; }
  return { url: file, fonts, hexes, bgHexes: [], headings: heads, labels: new Array(Math.min(upper, 40)).fill({}), cardCount: 0, uniformCards: 0, gradients: new Array(grads).fill({}),
    emDash: (text.match(/—/g) || []).length, notXY: text.match(/\b(isn't|is not|not)\b[^.]{0,50}[,;—-]\s*(it's|it is|but)\b/gi) || [], leftAccent: [], banned, radii,
    sections: [], icons: { total: 0, stroke: 0 }, paddings: {} };
}

async function cloudMeasure(urls, onPage) {
  const client = require(`${process.env.HOME}/arthur/lib/arthur-browser/client.js`);
  const s = await client.createSession({ stealth: true });
  const { browser, page } = await client.cdpConnect(s.session_id, client.loadConfig());
  const results = [];
  try {
    for (const url of urls) {
      try {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
        await page.waitForTimeout(800);
        const r = await page.evaluate(MEASURE_FN);
        r.requestedUrl = url; results.push(r);
        if (onPage) await onPage(page, r);
      } catch (e) { console.error('measure failed', url, e.message); }
    }
  } finally { try { await browser.close(); } catch {} try { await client.releaseSession(s.session_id); } catch {} }
  return results;
}
export { cloudMeasure };

function fmt(v) { return typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : v; }

async function main() {
  const a = process.argv.slice(2); const urls = []; let dir, fromJson, jsonOut, cfgPath, quiet = false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--from-json') fromJson = a[++i]; else if (a[i] === '--dir') dir = a[++i]; else if (a[i] === '--json') jsonOut = a[++i]; else if (a[i] === '--config') cfgPath = a[++i];
    else if (a[i] === '--urls-file') urls.push(...fs.readFileSync(a[++i], 'utf8').split('\n').map(s => s.trim()).filter(Boolean)); else if (a[i] === '--quiet') quiet = true; else urls.push(a[i]);
  }
  const cfg = { ...DEFAULTS, ...(cfgPath ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : {}) };
  let pages;
  if (fromJson) pages = JSON.parse(fs.readFileSync(fromJson, 'utf8')).pages;
  else if (dir) {
    const files = []; (function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) { if (f.name !== 'node_modules') walk(p); } else if (p.endsWith('.html')) files.push(p); } })(dir);
    let css = ''; (function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) { if (f.name !== 'node_modules') walk(p); } else if (p.endsWith('.css')) css += fs.readFileSync(p, 'utf8') + '\n'; } })(dir);
    pages = files.map(f => staticPage(f, css));
  } else if (urls.length) pages = await cloudMeasure(urls);
  else { console.error('usage: ai-tell-check.mjs <url...> | --urls-file f | --dir d'); process.exit(1); }
  const res = evaluatePages(pages, cfg);
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ res, pages }, null, 1));
  if (!quiet) {
    console.log(`AI-TELL CHECK  pages=${res.pages}  mode=${dir ? 'static' : 'computed'}`);
    for (const [k, v] of Object.entries(res.metrics)) { const f = res.fails.find(x => x.tell === k); console.log(`  ${f ? 'FAIL' : 'ok  '} ${k.padEnd(24)} ${String(fmt(v)).padStart(7)}  ${f ? '(limit ' + (f.kind === 'max' ? '<= ' : '>= ') + f.limit + ')' : ''}`); }
    console.log('  top fonts:', Object.entries(res.detail.famTotals).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([f, c]) => f).join(' | '));
    console.log('  default hexes in use:', JSON.stringify(res.detail.hexUse));
    console.log('  banned words:', JSON.stringify(res.detail.bannedTotals));
    console.log('  two-part headlines (first 6):', res.detail.twoPartList.slice(0, 6).map(x => x.text).join(' || '));
  }
  if (res.fails.length) { console.log(`\nEXIT 2: ${res.fails.length} tells over threshold: ${res.fails.map(f => f.tell).join(', ')}`); process.exit(2); }
  console.log('\nPASS: no tell over threshold');
}
if (import.meta.url === `file://${process.argv[1]}`) main();
