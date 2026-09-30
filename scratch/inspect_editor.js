const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });
  const editor = page.locator('[contenteditable="true"]').first();
  console.log('Editor visible?:', await editor.isVisible());
  await editor.click();
  await editor.fill('ทดสอบเนื้อหา');
  console.log('Editor text:', await editor.innerText());

  await browser.close();
})();
