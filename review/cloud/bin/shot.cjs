// Runs ON arthur-server for scripts/cloud-shot.sh: full-page screenshots of pages served on :8811.
// Scrolls each page first so lazy images load. Writes PNGs to argv[2]; names go to stderr.
const { chromium } = require('/home/danielmay/render/node_modules/playwright');
(async () => {
  const [outDir, w, ...paths] = process.argv.slice(2);
  const b = await chromium.launch();
  // One bad URL (DNS failure, redirect mid-scroll) must not kill the rest of the batch, and a fresh
  // page per URL stops a dead page's pending navigation from interrupting the next goto.
  for (const raw of paths) {
    // A trailing #keep means "this page opens a popup on purpose": no Escape/close sweep, viewport-only shot.
    const keep = raw.endsWith('#keep'), u = keep ? raw.slice(0, -5) : raw;
    const p = await b.newPage({ viewport: { width: +w, height: +w < 600 ? 844 : 900 } });
    try {
      await p.goto(/^https?:\/\//.test(u) ? u : 'http://localhost:8811/' + u, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.error('goto ' + u + ': ' + e.message.split('\n')[0]));
      if (keep) {
        await p.waitForTimeout(2500);
        const f = u.replace(/^https?:\/\//, '').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/\.html$/, '').slice(0, 110) + '-keep-' + w + '.png';
        await p.screenshot({ path: outDir + '/' + f });
        console.error('shot ' + f); await p.close().catch(() => {}); continue;
      }
      // Public sites: accept cookie/consent banners and close newsletter pop-ups so the design shows.
      if (/^https?:\/\//.test(u)) {
        for (const re of [/^(accept|allow)( all| cookies)?$/i, /^(i agree|agree|aceptar|accepter|ok|got it)$/i, /^(close|×|x)$/i]) {
          const btn = p.getByRole('button', { name: re }).first();
          if (await btn.isVisible({ timeout: 400 }).catch(() => false)) { await btn.click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(500); }
        }
        await p.keyboard.press('Escape').catch(() => {});
        await p.addStyleTag({ content: '#onetrust-consent-sdk,#CybotCookiebotDialog,#usercentrics-root,.cc-window,[id*="cookie-banner"],[class*="cookie-banner"],[class*="CookieConsent"],[aria-label*="cookie" i][role="dialog"]{display:none!important}' }).catch(() => {});
      }
      const h = Math.min(await p.evaluate(() => document.body.scrollHeight), 15000);
      for (let y = 0; y < h; y += 700) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(120); }
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1500);
      const f = u.replace(/^https?:\/\//, '').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/\.html$/, '').slice(0, 120) + '-' + w + '.png';
      await p.screenshot({ path: outDir + '/' + f, fullPage: true });
      console.error('shot ' + f);
    } catch (e) { console.error('fail ' + u + ': ' + e.message.split('\n')[0]); }
    await p.close().catch(() => {});
  }
  await b.close();
})();
