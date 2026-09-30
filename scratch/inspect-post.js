const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://share-ed.online/post/92b4eb6b-5fa4-4011-af8e-6efc1b124711', { waitUntil: 'networkidle' });
  const html = await page.locator('div.prose, [class*="post-details"]').first().innerHTML();
  console.log('--- RENDERED HTML ---');
  console.log(html);
  await browser.close();
})();
