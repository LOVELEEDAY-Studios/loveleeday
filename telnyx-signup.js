const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to Telnyx signup...');
  await page.goto('https://portal.telnyx.com/#/signup');
  await page.waitForTimeout(3000);

  // Click "Sign up" link since this is the login page
  const signupLink = await page.$('a:has-text("Sign up")');
  if (signupLink) {
    await signupLink.click();
    await page.waitForTimeout(3000);
    console.log('Clicked Sign up link');
  }

  await page.screenshot({ path: '/tmp/telnyx-step1.png', fullPage: true });

  // Look for email field and fill it
  const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="mail"]');
  if (emailInput) {
    await emailInput.fill('daniel@loveleedaystudios.com');
    console.log('Filled email');
  }

  // Look for all visible inputs
  const inputs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('input:not([type="hidden"])')).map(i => ({
      type: i.type, name: i.name, placeholder: i.placeholder,
      ariaLabel: i.getAttribute('aria-label'), id: i.id, visible: i.offsetParent !== null
    }))
  );
  console.log('Inputs found:', JSON.stringify(inputs, null, 2));

  await page.screenshot({ path: '/tmp/telnyx-current.png', fullPage: true });
  console.log('Browser open — complete signup if needed. Ctrl+C when done.');
  await new Promise(() => {});
})();
