const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/post/db01e083-0c77-41c4-838c-42d6655be5c7', { waitUntil: 'networkidle' });
  console.log('Post Page URL:', page.url());
  const h1 = await page.locator('h1').innerText().catch(() => '');
  console.log('H1:', h1);
  const text = await page.innerText('body');
  console.log('Contains author Yahu_Yamaro?:', text.includes('Yahu_Yamaro'));
  console.log('Contains tag #คณิต?:', text.includes('#คณิต'));
  console.log('Contains มัธยมศึกษาตอนต้น?:', text.includes('มัธยมศึกษาตอนต้น'));
  console.log('Contains PDF?:', text.includes('.pdf') || text.includes('handbook.pdf') || text.includes('เอกสาร'));

  await page.screenshot({ path: 'test-results/screenshots/post-1-success.png', fullPage: true });
  console.log('Saved success screenshot to test-results/screenshots/post-1-success.png');

  await browser.close();
})();
