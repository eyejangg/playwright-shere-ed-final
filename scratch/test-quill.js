const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/create');
  await page.waitForTimeout(1500);

  const editor = page.locator('[contenteditable="true"]').first();
  await editor.click();

  // Test what happens when we set Quill contents with Quill API or clipboard
  const testResult = await editor.evaluate((el) => {
    // Check if Quill instance is attached to el
    // Usually Quill stores instance in Quill.find(el) or el.__quill
    let q = window.Quill ? window.Quill.find(el) : null;
    return {
      hasWindowQuill: !!window.Quill,
      hasQuillFind: !!q,
      elClass: el.className,
      parentClass: el.parentElement ? el.parentElement.className : ''
    };
  });
  console.log('Quill detection:', testResult);

  await browser.close();
})();
