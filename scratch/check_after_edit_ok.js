const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/post/edit/db01e083-0c77-41c4-838c-42d6655be5c7', { waitUntil: 'networkidle' });
  const publishBtn = page.locator('button[test-data="update-post-button"]');
  await publishBtn.click();

  const okBtn = page.getByRole('button', { name: 'OK', exact: true });
  await okBtn.waitFor({ state: 'visible', timeout: 10000 });
  await okBtn.click();

  await page.waitForTimeout(3000);
  console.log('URL after clicking OK in edit post:', page.url());

  await browser.close();
})();
