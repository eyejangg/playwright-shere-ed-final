const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });
  const textareas = page.locator('textarea');
  console.log('Textareas count:', await textareas.count());
  for (let i = 0; i < await textareas.count(); i++) {
    const el = textareas.nth(i);
    console.log(`Textarea ${i}: placeholder="${await el.getAttribute('placeholder')}" test-data="${await el.getAttribute('test-data')}"`);
  }

  await browser.close();
})();
