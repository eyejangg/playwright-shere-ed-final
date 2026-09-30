const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  const url = 'https://share-ed.online/post/a6fc1bfe-5f35-45cb-8ab1-e84168809978';
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check cover image src
  const imgLocator = page.locator('img[alt*="ปก"], img.w-full, img[class*="rounded"]').first();
  const src = await imgLocator.getAttribute('src');
  console.log('Post 1 cover image src:', src);

  const shot1 = path.resolve(__dirname, '../reports/screenshots/post-1-success.png');
  const shot2 = path.resolve(__dirname, '../test-results/screenshots/post-1-success.png');
  await page.screenshot({ path: shot1, fullPage: true });
  await page.screenshot({ path: shot2, fullPage: true });
  console.log('Retaken screenshot for Post 1');

  await browser.close();
})();
