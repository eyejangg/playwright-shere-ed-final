const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page = await context.newPage();
  await page.goto('https://docs.google.com/spreadsheets/d/1iMx6hw7qZ9X4MU41BuvWgbgE3jcmv9vKXZJ-PA_P_cw/edit?gid=1221386414#gid=1221386414', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Jump to M1 via name box
  const nameBox = page.locator('#t-name-box');
  await nameBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('M1');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  // Check current selection
  console.log('Selected cell in name box:', await nameBox.inputValue());

  // Test setting clipboard and pressing Ctrl+V
  const testText = 'Automation Status\tAutomation Spec File\r\nAutomated\ttests/post/create-post.spec.js';
  await page.evaluate((text) => {
    return navigator.clipboard.writeText(text);
  }, testText);

  // Focus the sheet canvas/grid and press Control+V
  await page.keyboard.press('Control+V');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'd:/playwright-shere-ed-final/retest-artifacts/paste_test.png' });
  console.log('Saved screenshot to paste_test.png');

  await browser.close();
})();
