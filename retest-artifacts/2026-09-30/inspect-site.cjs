const { chromium } = require('../../node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: 'https://share-ed.online/',
    storageState: path.resolve('playwright/.auth/member.json'),
  });
  const page = await context.newPage();
  try {
    await page.goto('/create');
    await page.waitForSelector('[test-data="post-title-input"]');
    const form = await page.locator('body').innerText();
    const fields = await page.locator('[test-data]').evaluateAll(elements => elements.map(el => ({
      id: el.getAttribute('test-data'), tag: el.tagName, text: el.textContent?.slice(0, 120),
      accept: el.getAttribute('accept'), maxLength: el.getAttribute('maxlength'),
    })));
    await page.locator('[test-data="category-tags-settings-button"]').click();
    const categoryDialog = await page.locator('body').innerText();
    const categoryFields = await page.locator('[test-data]').evaluateAll(elements => elements.map(el => ({
      id: el.getAttribute('test-data'), tag: el.tagName, text: el.textContent?.slice(0, 120),
    })));
    const validations = {};
    for (const [name, input, file] of [
      ['coverSize', 'cover-file-input', 'test-data/images/cover-over-2mb.png'],
      ['coverType', 'cover-file-input', 'test-data/images/image01.gif'],
      ['imageType', 'supporting-images-file-input', 'test-data/images/image01.gif'],
    ]) {
      await page.goto('/create');
      await page.locator(`[test-data="${input}"]`).setInputFiles(path.resolve(file));
      await page.getByRole('status').first().waitFor();
      validations[name] = await page.getByRole('status').allTextContents();
    }
    await page.goto('/home');
    await page.getByRole('button', { name: 'เมนูผู้ใช้' }).click();
    await page.getByRole('link', { name: 'โปรไฟล์ของฉัน', exact: true }).click();
    await page.getByRole('button', { name: 'โพสต์ของฉัน', exact: true }).waitFor();
    await page.waitForLoadState('networkidle');
    const profileUrl = page.url();
    const posts = await page.getByRole('heading').allTextContents();
    await page.getByRole('button', { name: 'แบบร่าง', exact: true }).click();
    await page.waitForLoadState('networkidle');
    const drafts = await page.getByRole('heading').allTextContents();
    const result = { form, fields, categoryDialog, categoryFields, validations, profileUrl, posts, drafts };
    await fs.writeFile(path.join(__dirname, 'site-before.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify({ validations, profileUrl, posts, drafts }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error.message); process.exit(1); });
