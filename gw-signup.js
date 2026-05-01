const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to Workspace signup...');
  await page.goto('https://workspace.google.com/business/signup/welcome?sku=businessstarter');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: '/tmp/gw-loaded.png', fullPage: true });

  // Find all inputs for debugging
  const inputs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('input')).map(i => ({
      type: i.type, name: i.name, placeholder: i.placeholder,
      ariaLabel: i.getAttribute('aria-label'), id: i.id
    }))
  );
  console.log('Inputs:', JSON.stringify(inputs, null, 2));

  // Fill business name - try multiple selectors
  const bizInput = await page.$('input[type="text"]') || await page.$('input:not([type="hidden"])');
  if (bizInput) {
    await bizInput.fill('LOVELEEDAY Studios LLC');
    console.log('Filled business name');
  }

  // Click "Just you"
  await page.click('text=Just you').catch(() => console.log('Could not click Just you'));

  await page.screenshot({ path: '/tmp/gw-step1-done.png', fullPage: true });
  await page.click('button:has-text("Next")').catch(() => console.log('No Next button'));
  await page.waitForTimeout(4000);
  await page.screenshot({ path: '/tmp/gw-step2.png', fullPage: true });

  // Step 2 - fill name + email
  const allInputs = await page.$$('input:visible');
  for (const inp of allInputs) {
    const ph = (await inp.getAttribute('placeholder') || '').toLowerCase();
    const al = (await inp.getAttribute('aria-label') || '').toLowerCase();
    const label = ph + ' ' + al;
    if (label.includes('first')) { await inp.fill('Daniel'); console.log('Filled first name'); }
    else if (label.includes('last')) { await inp.fill('May'); console.log('Filled last name'); }
    else if (label.includes('email') || label.includes('current')) { await inp.fill('blackmarble.m.g@gmail.com'); console.log('Filled email'); }
  }

  await page.screenshot({ path: '/tmp/gw-step2-done.png', fullPage: true });
  await page.click('button:has-text("Next")').catch(() => console.log('No Next button'));
  await page.waitForTimeout(4000);
  await page.screenshot({ path: '/tmp/gw-step3.png', fullPage: true });

  // Step 3 - domain
  await page.click('text=Yes, I have one I can use').catch(() =>
    page.click('text=I have a domain').catch(() => console.log('No domain option found'))
  );
  await page.waitForTimeout(2000);

  const domainInput = await page.$('input[type="text"]:visible');
  if (domainInput) {
    await domainInput.fill('loveleedaystudios.com');
    console.log('Filled domain');
  }

  await page.screenshot({ path: '/tmp/gw-step3-done.png', fullPage: true });
  await page.click('button:has-text("Next")').catch(() => console.log('No Next'));
  await page.waitForTimeout(4000);
  await page.screenshot({ path: '/tmp/gw-step4.png', fullPage: true });

  console.log('Browser open — finish payment if needed. Ctrl+C when done.');
  await new Promise(() => {});
})();
