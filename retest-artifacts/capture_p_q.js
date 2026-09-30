const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  await page.goto('https://docs.google.com/spreadsheets/d/1iMx6hw7qZ9X4MU41BuvWgbgE3jcmv9vKXZJ-PA_P_cw/edit?gid=1221386414#gid=1221386414', {
    waitUntil: 'domcontentloaded', timeout: 60000
  });
  await page.waitForSelector('#t-name-box', { timeout: 30000 });
  await page.waitForTimeout(3000);

  const nameBox = page.locator('#t-name-box');
  await nameBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('Q1');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'd:/playwright-shere-ed-final/retest-artifacts/sheet_columns_p_and_q.png' });
  console.log('Saved sheet_columns_p_and_q.png');
  await browser.close();
})();
