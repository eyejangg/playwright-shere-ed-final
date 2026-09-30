const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });
  const openCatBtn = page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' });
  await openCatBtn.click();
  await page.waitForTimeout(1000);

  const buttons = await page.locator('button').all();
  for (let i = 0; i < buttons.length; i++) {
    const txt = (await buttons[i].innerText()).trim();
    if (txt) console.log(`Modal Button ${i}: "${txt}"`);
  }

  await browser.close();
})();
