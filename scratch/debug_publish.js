const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGEERROR:', err.message));
  page.on('response', res => {
    if (res.url().includes('/api/') || res.status() >= 400) {
      console.log(`HTTP ${res.status()} ${res.request().method()} ${res.url()}`);
    }
  });

  await page.goto('https://share-ed.online/post/edit/db01e083-0c77-41c4-838c-42d6655be5c7', { waitUntil: 'networkidle' });
  console.log('Loaded edit page');

  const publishBtn = page.locator('button[test-data="update-post-button"]');
  console.log('Clicking publish button...');
  await publishBtn.click();

  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'scratch/edit_publish_attempt.png', fullPage: true });
  console.log('Saved screenshot to scratch/edit_publish_attempt.png');

  // Check error alerts or sweetalerts or toaster
  const alerts = await page.locator('.swal2-popup, [role="alert"], .text-red-500').allInnerTexts().catch(() => []);
  console.log('Visible alerts:', alerts);

  await browser.close();
})();
