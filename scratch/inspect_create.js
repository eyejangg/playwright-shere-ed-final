const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });
  console.log('URL:', page.url());

  const titleInputs = page.locator('input[type="text"]');
  console.log('Text inputs count:', await titleInputs.count());
  for (let i = 0; i < await titleInputs.count(); i++) {
    const el = titleInputs.nth(i);
    console.log(`Input ${i}: placeholder="${await el.getAttribute('placeholder')}" test-data="${await el.getAttribute('test-data')}"`);
  }

  const selects = page.locator('select');
  console.log('Selects count:', await selects.count());
  for (let i = 0; i < await selects.count(); i++) {
    const el = selects.nth(i);
    console.log(`Select ${i}: test-data="${await el.getAttribute('test-data')}" innerText="${await el.innerText()}"`);
  }

  const fileInputs = page.locator('input[type="file"]');
  console.log('File inputs count:', await fileInputs.count());
  for (let i = 0; i < await fileInputs.count(); i++) {
    const el = fileInputs.nth(i);
    console.log(`File input ${i}: test-data="${await el.getAttribute('test-data')}" multiple="${await el.getAttribute('multiple')}" accept="${await el.getAttribute('accept')}"`);
  }

  const buttons = page.locator('button');
  console.log('Buttons count:', await buttons.count());
  for (let i = 0; i < await buttons.count(); i++) {
    const el = buttons.nth(i);
    const txt = (await el.innerText()).replace(/\n/g, ' ').trim();
    if (txt) console.log(`Button ${i}: "${txt}"`);
  }

  await browser.close();
})();
