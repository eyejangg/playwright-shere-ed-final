const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/profile?tab=drafts', { waitUntil: 'networkidle' });
  const draftTab = page.getByRole('button', { name: /แบบร่าง/ }).first();
  await draftTab.click();
  await page.waitForTimeout(2000);

  const cards = await page.locator('div.bg-white, article, div.rounded-xl, div.rounded-2xl').all();
  for (let i = 0; i < cards.length; i++) {
    const text = (await cards[i].innerText().catch(() => '')).trim();
    if (text.includes('แก้ไขโพสต์')) {
      console.log(`Draft Card ${i} text:\n${text}\n---`);
    }
  }

  await browser.close();
})();
