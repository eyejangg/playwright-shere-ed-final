const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/profile', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const text = await page.innerText('body');
  console.log('Includes post titles:');
  console.log(' - สมการเชิงเส้น:', text.includes('สมการเชิงเส้น'));
  console.log(' - ระบบสุริยะ:', text.includes('ระบบสุริยะ'));
  console.log(' - 12 Tenses:', text.includes('12 Tenses'));

  // Also check reports/execution-summary.json
  const summary = JSON.parse(require('fs').readFileSync('reports/execution-summary.json', 'utf8'));
  console.log('\nURLs from summary:');
  summary.forEach(s => console.log(` ${s.index}. [${s.title}]: ${s.url}`));

  await browser.close();
})();
