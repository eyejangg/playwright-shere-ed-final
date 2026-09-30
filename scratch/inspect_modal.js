const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
  await page.waitForTimeout(1000);

  const btns = page.locator('div.fixed button');
  console.log('Fixed buttons count:', await btns.count());
  for (let i = 0; i < await btns.count(); i++) {
    const txt = (await btns.nth(i).innerText()).replace(/\n/g, ' ').trim();
    const html = await btns.nth(i).evaluate(el => el.outerHTML.slice(0, 150));
    console.log(`Button ${i}: text="${txt}" html=${html}`);
  }

  await browser.close();
})();
