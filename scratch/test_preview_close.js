const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });
  
  // upload cover
  const coverPath = 'd:/playwright-shere-ed-final/test-data/educational/post-1-equation/cover.png';
  await page.locator('input[test-data="cover-file-input"]').setInputFiles(coverPath);
  await page.getByRole('img', { name: 'Cover' }).waitFor({ state: 'visible' });

  // click cover to open preview
  await page.getByRole('img', { name: 'Cover' }).click();
  await page.waitForTimeout(500);

  const previewModal = page.locator('div.fixed:has-text("ดูตัวอย่างไฟล์")');
  console.log('Modal visible?:', await previewModal.isVisible());

  // close modal
  const closeBtn = previewModal.locator('button').first();
  await closeBtn.click();
  await page.waitForTimeout(500);

  console.log('Modal still visible?:', await previewModal.isVisible());

  await browser.close();
})();
