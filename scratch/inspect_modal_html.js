const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
  await page.waitForTimeout(1000);

  // Get the modal HTML
  const modal = page.locator('div.fixed').last();
  console.log('Modal HTML:');
  console.log(await modal.innerHTML());

  await browser.close();
})();
