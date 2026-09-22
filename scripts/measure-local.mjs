#!/usr/bin/env node
/**
 * measure-local — run Lighthouse against a fund's portfolio, locally.
 *
 * The PageSpeed Insights API was the obvious route and it 429s hard: 16 URLs with
 * retries exhausted the keyless quota for this IP on the first attempt, and it did
 * not recover at one request at a time either. Local Lighthouse has no quota, uses
 * the same engine, and is reproducible — the only thing it cannot give us is CrUX
 * field data, which is a real gap and is reported as such rather than faked.
 *
 *   node scripts/measure-local.mjs lightship
 *   node scripts/measure-local.mjs venturehue --only "VentureHue"
 *
 * Writes data/<fund>-measured.json. A site that fails to load is recorded with its
 * error, never dropped — a missing row would quietly shrink the denominator.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PORTFOLIOS = {
  lightship: [
    ['Proov', 'https://proovtest.com/'],
    ['Allergy Amulet', 'https://allergyamulet.com/'],
    ['Healthy Roots Dolls', 'https://healthyrootsdolls.com/'],
    ['Boddle', 'https://boddlelearning.com/'],
    ['Undock', 'https://undock.com/'],
    ['Haute Hijab', 'https://hautehijab.com/'],
    ['Femi Secrets', 'https://femisecrets.com/'],
    ['Vyrill', 'https://vyrill.com/'],
    ['Fresh Fry', 'https://freshfry.me/'],
    ['Kare Mobile', 'https://karemobile.com/'],
    ['Enable Injections', 'https://enableinjections.com/'],
    ['Arbit', 'https://getarbit.com/'],
    ['CurlMix', 'https://curlmix.com/'],
    ['Brevity', 'https://brevitypitch.com/'],
    ['CModel', 'https://cmodel.io/'],
  ],
  venturehue: [
    ['VentureHue', 'https://venturehue.com/'],
    ['Career Karma', 'https://careerkarma.com/'],
    ['Upright Oats', 'https://uprightoats.com/'],
    ['Small Business Brain', 'https://smallbusinessbrain.com/'],
    ['Link to Any', 'https://linktoany.com/'],
    ['Paladin', 'https://joinpaladin.com/'],
  ],
  hundredkm: [
    ['Novarna', 'https://novarna.ai/'],
    ['Femly', 'https://www.femly.com/'],
    ['iCardio.ai', 'https://www.icardio.ai/'],
    ['Dopl Technologies', 'https://www.dopltechnologies.com/'],
    ['Scout Space', 'https://www.scout.space/'],
    ['Scout Financial', 'https://www.scout-financial.com/'],
    ['Opine', 'https://tryopine.com/'],
    ['Beam Dynamics', 'https://www.beamdynamics.io/'],
    ['Bump', 'https://usebump.com/'],
    ['Social Cascade', 'https://www.socialcascade.co/'],
    ['Keep Company', 'https://keep-company.com/'],
    ['Health In Her HUE', 'https://healthinherhue.com/'],
    ['Athlytic', 'https://app.athlytic.io/'],
    ['Axal', 'https://axal.ai/'],
    ['Singulate', 'https://www.singulate.com/'],
  ],
};

const fund = process.argv[2];
if (!PORTFOLIOS[fund]) {
  console.log('usage: node scripts/measure-local.mjs <' + Object.keys(PORTFOLIOS).join('|') + '>');
  process.exit(1);
}
const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx > -1 ? process.argv[onlyIdx + 1] : null;
const targets = PORTFOLIOS[fund].filter(([n]) => !only || n === only);

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
const rows = [];

for (const [company, url] of targets) {
  try {
    const r = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'seo', 'accessibility', 'best-practices'],
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false },
    });
    const c = r.lhr.categories;
    const pct = (k) => (typeof c[k]?.score === 'number' ? Math.round(c[k].score * 100) : null);
    rows.push({
      company, url,
      performance: pct('performance'),
      seo: pct('seo'),
      accessibility: pct('accessibility'),
      best_practices: pct('best-practices'),
      lcp_ms: Math.round(r.lhr.audits['largest-contentful-paint']?.numericValue ?? 0) || null,
      total_bytes: Math.round(r.lhr.audits['total-byte-weight']?.numericValue ?? 0) || null,
      final_url: r.lhr.finalDisplayedUrl || url,
    });
    const t = rows.at(-1);
    console.log(`${company.padEnd(22)} perf ${String(t.performance).padStart(3)}  seo ${String(t.seo).padStart(3)}  a11y ${String(t.accessibility).padStart(3)}  LCP ${t.lcp_ms}ms  ${((t.total_bytes || 0) / 1048576).toFixed(1)}MB`);
  } catch (e) {
    rows.push({ company, url, error: String(e.message || e).slice(0, 140) });
    console.log(`${company.padEnd(22)} FAILED — ${String(e.message || e).slice(0, 70)}`);
  }
}

await chrome.kill();

const ok = rows.filter((r) => !r.error);
const med = (xs) => {
  const s = xs.filter((x) => x != null).sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};
console.log(`\n${ok.length} measured, ${rows.length - ok.length} failed`);
console.log(`median performance ${med(ok.map((r) => r.performance))} · median seo ${med(ok.map((r) => r.seo))} · median a11y ${med(ok.map((r) => r.accessibility))}`);
console.log(`under 50 performance: ${ok.filter((r) => r.performance != null && r.performance < 50).length} of ${ok.length}`);

fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
const out = path.join(ROOT, 'data', `${fund}-measured.json`);
fs.writeFileSync(out, JSON.stringify(rows, null, 2));
console.log('wrote', out);
