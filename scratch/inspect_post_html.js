const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/post/92b4eb6b-5fa4-4011-af8e-6efc1b124711');
  await page.locator('h1').waitFor({ state: 'visible' });

  // Find the detail container
  const headings = page.locator('h2, h3, div');
  const detailHeader = page.getByText('รายละเอียดเพิ่มเติม').first();
  const detailSection = detailHeader.locator('xpath=following-sibling::div[1]');
  console.log('Detail Section Tag & Classes:', await detailSection.evaluate(el => el.outerHTML.slice(0, 300)));
  console.log('Detail Section Full HTML:');
  console.log(await detailSection.innerHTML());

  await browser.close();
})();
