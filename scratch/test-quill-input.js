const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/create');
  await page.waitForTimeout(1500);

  const editor = page.locator('[contenteditable="true"]').first();
  await editor.click();

  // Test 1: Paste HTML or set innerHTML with &nbsp;
  await editor.evaluate((el) => {
    el.innerHTML = '<p>Line 1</p><p>&nbsp;</p><p><strong>Line 2</strong></p>';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });

  const htmlAfterInput = await editor.evaluate(el => el.innerHTML);
  console.log('HTML after evaluate with &nbsp;:', htmlAfterInput);

  // Now test typing Enter with keyboard
  await editor.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('Heading 1');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Bullet item');

  const htmlAfterKeyboard = await editor.evaluate(el => el.innerHTML);
  console.log('HTML after keyboard Enter x 2:', htmlAfterKeyboard);

  await browser.close();
})();
