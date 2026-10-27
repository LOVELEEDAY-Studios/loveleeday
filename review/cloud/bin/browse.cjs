// browse.cjs <width> <path> [--click="visible text"]... [--fill="label=value"]... [--zoom=2] [--tab=N] [--out=dir]
// For beta testers. Opens http://localhost:8850/<path> (e.g. site/index.html) at the given width, optionally types into fields
// (by label or placeholder), presses Tab N times, clicks elements by visible text in order, then prints: final URL, title,
// visible text (first 7000 chars), every link with its HTTP status (internal links only), form fields, buttons, images that
// failed to load, horizontal overflow, elements under 44px tall that can be tapped (phones), console errors, focused element.
// Saves a viewport shot and a full-page shot to --out (default ~/llr/beta/tmp). Forms never reach the outside world.
const { chromium } = require('/home/danielmay/render/node_modules/playwright');
const a = process.argv.slice(2);
const W = +a[0], P = a[1];
const opt = k => a.filter(x => x.startsWith(`--${k}=`)).map(x => x.slice(k.length + 3));
const out = (opt('out')[0] || process.env.HOME + '/llr/beta/tmp'); require('fs').mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: W < 600 ? 844 : 900 }, deviceScaleFactor: +(opt('zoom')[0] || 1), isMobile: W < 600, hasTouch: W < 600 });
  await ctx.route(u => !/^http:\/\/localhost:\d+\//.test(u.toString()) && !/fonts\.(googleapis|gstatic)|fontshare|cdnjs|jsdelivr|unpkg/.test(u.toString()), r => r.abort());
  const p = await ctx.newPage(); const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(m.text().slice(0, 200)));
  p.on('pageerror', e => errs.push('pageerror ' + e.message.slice(0, 200)));
  await p.goto('http://localhost:' + (process.env.BROWSE_PORT || 8850) + '/' + P.replace(/^\//, ''), { waitUntil: 'networkidle', timeout: 45000 }).catch(e => errs.push('goto ' + e.message.split('\n')[0]));
  for (const f of opt('fill')) { const [k, ...v] = f.split('='); const el = p.getByLabel(k).or(p.getByPlaceholder(k)).first(); await el.fill(v.join('=')).catch(e => errs.push('fill ' + k + ': ' + e.message.split('\n')[0])); }
  for (let i = 0; i < +(opt('tab')[0] || 0); i++) await p.keyboard.press('Tab');
  for (const t of opt('click')) { await p.getByText(t, { exact: false }).first().click({ timeout: 5000 }).catch(e => errs.push('click ' + t + ': ' + e.message.split('\n')[0])); await p.waitForTimeout(1200); }
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < Math.min(h, 16000); y += 700) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(80); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const vis = e => { const s = getComputedStyle(e), b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0; };
    const links = [...document.querySelectorAll('a[href]')].filter(vis).map(e => ({ t: (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60), h: e.getAttribute('href') }));
    const small = innerWidth < 600 ? [...document.querySelectorAll('a,button,summary,input,select')].filter(vis).filter(e => e.getBoundingClientRect().height < 44 && !e.closest('p,li')).map(e => (e.innerText || e.name || e.tagName).trim().slice(0, 40)).slice(0, 25) : [];
    return {
      url: location.href, title: document.title,
      text: document.body.innerText.replace(/\n{3,}/g, '\n\n').slice(0, 7000),
      links, small,
      fields: [...document.querySelectorAll('input,textarea,select')].filter(vis).map(e => `${e.tagName.toLowerCase()} name=${e.name} type=${e.type} label="${(e.labels && e.labels[0] ? e.labels[0].innerText : e.placeholder || '').trim().slice(0, 50)}" required=${e.required}`),
      buttons: [...document.querySelectorAll('button,input[type=submit]')].filter(vis).map(e => (e.innerText || e.value || e.getAttribute('aria-label') || '').trim().slice(0, 40)),
      brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && vis(i)).map(i => i.src.split('/').slice(-2).join('/')),
      overflowX: document.documentElement.scrollWidth - innerWidth,
      focused: document.activeElement ? (document.activeElement.innerText || document.activeElement.tagName).trim().slice(0, 60) : ''
    };
  });
  const seen = new Set(), status = [];
  for (const l of r.links) {
    if (!l.h || /^(mailto|tel|#|javascript)/.test(l.h) || seen.has(l.h)) continue; seen.add(l.h);
    if (/^https?:\/\//.test(l.h) && !/loveleedaystudios\.com/.test(l.h)) { status.push(`external ${l.h}`); continue; }
    let u = l.h.replace(/^https?:\/\/(www\.)?loveleedaystudios\.com/, '').split('#')[0];
    if (!u.startsWith('/')) u = new URL(u, r.url).pathname;
    const cand = u === '/' ? ['/site/index.html'] : [u, '/site' + u + '.html', '/site' + u.replace(/\/$/, '') + '.html', '/site' + u + 'index.html', u + '.html'];
    let ok = 0; for (const c of cand) { const s = await p.request.head('http://localhost:' + (process.env.BROWSE_PORT || 8850) + c).then(x => x.status()).catch(() => 0); if (s === 200) { ok = 200; break; } }
    status.push(`${ok === 200 ? 'ok ' : 'BROKEN'} ${l.h}  "${l.t}"`);
  }
  const tag = P.replace(/[^A-Za-z0-9]+/g, '_') + '-' + W + '-' + Date.now() % 100000;
  await p.screenshot({ path: `${out}/${tag}-view.png` });
  await p.screenshot({ path: `${out}/${tag}-full.png`, fullPage: true });
  console.log(`URL ${r.url}\nTITLE ${r.title}\nOVERFLOW_X ${r.overflowX}px\nFOCUSED ${r.focused}\nSHOTS ${out}/${tag}-view.png ${out}/${tag}-full.png\n\n--- TEXT ---\n${r.text}\n\n--- LINKS ---\n${status.join('\n')}\n\n--- FIELDS ---\n${r.fields.join('\n')}\n--- BUTTONS ---\n${r.buttons.join(' | ')}\n--- BROKEN IMAGES ---\n${r.brokenImgs.join('\n') || 'none'}\n--- SMALL TAP TARGETS ---\n${r.small.join(' | ') || 'none'}\n--- CONSOLE ERRORS ---\n${errs.join('\n') || 'none'}`);
  await b.close();
})();
