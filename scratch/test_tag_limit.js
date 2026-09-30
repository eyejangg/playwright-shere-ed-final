const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
  await page.waitForTimeout(500);

  const tagInput = page.locator('input[test-data="hashtag-input"]');
  const tags = ['#วิทย์', '#อวกาศ', '#จักรวาล'];
  for (const t of tags) {
    await tagInput.fill(t);
    await tagInput.press('Enter');
    await page.waitForTimeout(200);
  }

  // Check tag count label
  const label = await page.locator('label:has-text("แฮชแท็ก")').innerText();
  console.log('Tag label:', label);

  // Check input state
  console.log('Tag input visible:', await tagInput.isVisible());
  console.log('Tag input enabled:', await tagInput.isEnabled());

  // Try 4th tag
  if (await tagInput.isEnabled()) {
    await tagInput.fill('#มต้น');
    await tagInput.press('Enter');
    console.log('Tried 4th tag');
  }

  const finalLabel = await page.locator('label:has-text("แฮชแท็ก")').innerText();
  console.log('Final tag label:', finalLabel);

  const finishBtn = page.getByRole('button', { name: 'เสร็จสิ้น', exact: true });
  console.log('Finish button enabled:', await finishBtn.isEnabled());
  await finishBtn.click();
  await page.waitForTimeout(500);
  console.log('Modal closed, category button text:', await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).isVisible());

  await browser.close();
})();
