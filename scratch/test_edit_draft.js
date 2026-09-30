const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/profile?tab=drafts', { waitUntil: 'networkidle' });
  console.log('Profile URL:', page.url());

  const draftTab = page.getByRole('button', { name: /แบบร่าง/ }).first();
  await draftTab.click();
  console.log('Clicked Drafts tab');
  await page.waitForTimeout(2000);

  // Find edit post button
  const editBtn = page.getByRole('button', { name: /แก้ไขโพสต์/ }).first();
  console.log('Found edit button:', await editBtn.isVisible());
  await editBtn.click();

  await page.waitForURL(/\/post\/edit\/[^/]+/, { timeout: 15000 });
  console.log('Navigated to edit URL:', page.url());

  await page.waitForTimeout(2000);
  const title = await page.locator('input[test-data="post-title-input"]').inputValue();
  console.log('Title in edit form:', title);

  const buttons = page.locator('button');
  for (let i = 0; i < await buttons.count(); i++) {
    const b = buttons.nth(i);
    const txt = (await b.innerText()).trim();
    if (txt) console.log(`Edit Page Button ${i}: "${txt}"`);
  }

  await browser.close();
})();
