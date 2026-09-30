const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/profile?tab=drafts', { waitUntil: 'networkidle' });
  console.log('Profile URL:', page.url());

  const draftTab = page.getByRole('button', { name: /แบบร่าง/ }).first();
  if (await draftTab.isVisible()) {
    await draftTab.click();
    console.log('Clicked Drafts tab');
    await page.waitForTimeout(2000);
  }

  const text = await page.innerText('body');
  console.log('Page text includes "สมการเชิงเส้น"?:', text.includes('สมการเชิงเส้น'));
  console.log('Page text includes "แบบร่าง"?:', text.includes('แบบร่าง'));
  
  const buttons = page.locator('button');
  for (let i = 0; i < await buttons.count(); i++) {
    const b = buttons.nth(i);
    const txt = (await b.innerText()).trim();
    if (txt.includes('แก้ไข') || txt.includes('ร่าง') || txt.includes('โพสต์')) {
      console.log(`Button ${i}: "${txt}"`);
    }
  }

  await browser.close();
})();
