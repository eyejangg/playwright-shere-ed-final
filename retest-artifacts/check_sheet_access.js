const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page = await context.newPage();
  await page.goto('https://docs.google.com/spreadsheets/d/1iMx6hw7qZ9X4MU41BuvWgbgE3jcmv9vKXZJ-PA_P_cw/edit?gid=1221386414#gid=1221386414');
  await page.waitForTimeout(5000);
  
  const title = await page.title();
  console.log('Title:', title);
  
  const bodyText = await page.innerText('body');
  const isReadOnly = bodyText.includes('View only') || bodyText.includes('ดูอย่างเดียว') || bodyText.includes('Request edit access') || bodyText.includes('ขอสิทธิ์แก้ไข');
  console.log('Is Read Only:', isReadOnly);

  // Check if we can find the name box
  const nameBox = await page.locator('#t-name-box').first();
  const hasNameBox = await nameBox.count();
  console.log('Has name box:', hasNameBox);
  if (hasNameBox) {
    console.log('Name box value:', await nameBox.inputValue());
  }

  // Check formula bar
  const formulaBar = await page.locator('.cell-input').first();
  console.log('Has cell input:', await formulaBar.count());

  await page.screenshot({ path: 'd:/playwright-shere-ed-final/retest-artifacts/sheet_ui.png' });
  console.log('Saved screenshot to sheet_ui.png');

  await browser.close();
})();
