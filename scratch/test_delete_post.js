const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  // Test on currently published post 1
  const testUrl = 'https://share-ed.online/post/137eb0a0-bffe-4956-8c95-60008eaf6ee5';
  await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  console.log('Post Page URL:', page.url());

  const buttons = await page.locator('button').all();
  for (let i = 0; i < buttons.length; i++) {
    const txt = (await buttons[i].innerText().catch(() => '')).trim();
    const testData = await buttons[i].getAttribute('test-data').catch(() => '');
    if (txt || testData) console.log(`Post Page Button ${i}: test-data="${testData}", text="${txt}"`);
  }

  // Also check profile page "โพสต์ของฉัน"
  await page.goto('https://share-ed.online/profile', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  console.log('\nProfile URL:', page.url());
  const profileButtons = await page.locator('button').all();
  for (let i = 0; i < profileButtons.length; i++) {
    const txt = (await profileButtons[i].innerText().catch(() => '')).trim();
    const testData = await profileButtons[i].getAttribute('test-data').catch(() => '');
    if (txt.includes('ลบ') || txt.includes('แก้ไข') || testData) {
      console.log(`Profile Button ${i}: test-data="${testData}", text="${txt}"`);
    }
  }

  await browser.close();
})();
