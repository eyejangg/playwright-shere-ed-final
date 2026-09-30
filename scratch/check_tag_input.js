const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
  await page.waitForTimeout(1000);

  const input = page.locator('input[test-data="hashtag-input"]');
  console.log('Input visible:', await input.isVisible());
  await input.fill('#วิทย์');
  await input.press('Enter');
  await page.waitForTimeout(500);

  // Check if tag appeared
  const modalText = await page.locator('div.fixed').innerText();
  console.log('Modal text includes #วิทย์?:', modalText.includes('#วิทย์'));

  await browser.close();
})();
