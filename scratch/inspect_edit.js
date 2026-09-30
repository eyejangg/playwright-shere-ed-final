const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/post/edit/db01e083-0c77-41c4-838c-42d6655be5c7', { waitUntil: 'networkidle' });

  const textareas = await page.locator('textarea').all();
  for (let i = 0; i < textareas.length; i++) {
    const val = await textareas[i].inputValue().catch(() => '');
    const testData = await textareas[i].getAttribute('test-data').catch(() => '');
    console.log(`Textarea ${i}: test-data="${testData}", val="${val.substring(0, 30)}..."`);
  }

  const selects = await page.locator('select').all();
  for (let i = 0; i < selects.length; i++) {
    const val = await selects[i].inputValue().catch(() => '');
    const testData = await selects[i].getAttribute('test-data').catch(() => '');
    console.log(`Select ${i}: test-data="${testData}", val="${val}"`);
  }

  await browser.close();
})();
