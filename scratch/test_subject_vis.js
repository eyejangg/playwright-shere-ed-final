const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
  await page.waitForTimeout(500);

  const subjectSelect = page.locator('select[test-data="category-select"]');
  await subjectSelect.selectOption({ label: 'วิทยาศาสตร์' });

  const confirmCatBtn = page.getByRole('button', { name: 'เสร็จสิ้น', exact: true });
  await confirmCatBtn.click();
  await page.waitForTimeout(500);

  const loc = page.getByText('วิทยาศาสตร์');
  const count = await loc.count();
  console.log('Count of "วิทยาศาสตร์":', count);
  for (let i = 0; i < count; i++) {
    console.log(`Element ${i} visible:`, await loc.nth(i).isVisible());
  }

  await browser.close();
})();
