const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const tsv = fs.readFileSync('d:/playwright-shere-ed-final/retest-artifacts/pass_fail_and_cols.tsv', 'utf8');
  console.log('TSV length in bytes:', Buffer.byteLength(tsv, 'utf8'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'],
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to Google Sheet...');
  await page.goto('https://docs.google.com/spreadsheets/d/1iMx6hw7qZ9X4MU41BuvWgbgE3jcmv9vKXZJ-PA_P_cw/edit?gid=1221386414#gid=1221386414', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.waitForSelector('#t-name-box', { timeout: 30000 });
  await page.waitForTimeout(3000);

  // Jump to K1 via name box
  const nameBox = page.locator('#t-name-box');
  await nameBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('K1');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  console.log('Selected cell in name box:', await nameBox.inputValue());

  // Put TSV onto clipboard
  await page.evaluate((text) => {
    return navigator.clipboard.writeText(text);
  }, tsv);

  console.log('Pasting TSV into K1...');
  await page.keyboard.press('Control+V');

  // Wait for paste processing and auto-save
  await page.waitForTimeout(5000);

  // Jump to M1 to view top columns K to P
  await nameBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('M1');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'd:/playwright-shere-ed-final/retest-artifacts/sheet_k_to_q_updated.png' });
  console.log('Saved sheet_k_to_q_updated.png');

  // Wait for Google Drive sync
  await page.waitForTimeout(5000);

  await browser.close();
  console.log('Done updating Google Sheet!');
})();
