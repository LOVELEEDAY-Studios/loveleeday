const { chromium } = require('playwright');
const PAGES = ['home','calendar','menu','profile','events','reserve','about','spaces','roster','press','society','contact','gift'];
const VPS = [{ w:1440, h:900, tag:'d' }, { w:390, h:844, tag:'m' }];
(async () => {
  const browser = await chromium.launch();
  const errsAll = [];
  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    page.on('pageerror', e => errsAll.push(`${vp.tag}: ${e.message}`));
    await page.goto('file:///Users/danielmay/Projects/dabney-v4/index.html', { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(800);
    for (const pname of PAGES) {
      await page.evaluate((p) => { if (typeof go === 'function') go(p); else { state.page = p; render(); } }, pname);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `/tmp/dabney4_${vp.tag}_${pname}.png`, fullPage: true });
    }
    await ctx.close();
  }
  console.log('done; errors:', errsAll.length ? errsAll : 'none');
  await browser.close();
})();
