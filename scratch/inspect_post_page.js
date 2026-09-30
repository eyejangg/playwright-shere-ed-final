const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  const testUrl = 'https://share-ed.online/post/137eb0a0-bffe-4956-8c95-60008eaf6ee5';
  await page.goto(testUrl, { waitUntil: 'networkidle' });
  console.log('Post Page URL:', page.url());

  const buttons = await page.locator('button').all();
  console.log('Total buttons on post page:', buttons.length);
  for (let i = 0; i < buttons.length; i++) {
    const txt = (await buttons[i].innerText().catch(() => '')).trim();
    const testData = await buttons[i].getAttribute('test-data').catch(() => '');
    const title = await buttons[i].getAttribute('title').catch(() => '');
    const aria = await buttons[i].getAttribute('aria-label').catch(() => '');
    console.log(`Button ${i}: text="${txt}", testData="${testData}", title="${title}", aria="${aria}"`);
  }

  // Check SVG icons or menu triggers (three dots)
  const svgs = await page.locator('button svg').all();
  console.log('Total button SVGs:', svgs.length);

  await browser.close();
})();
