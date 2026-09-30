const { chromium } = require('../../node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ baseURL: 'https://share-ed.online/', storageState: path.resolve('playwright/.auth/member.json') });
    await page.goto('/home');
    await page.getByRole('button', { name: 'เมนูผู้ใช้' }).click();
    await page.getByRole('link', { name: 'แบบร่างของฉัน', exact: true }).click();
    await page.getByRole('button', { name: 'แบบร่าง', exact: true }).click();
    await page.getByRole('button', { name: 'แก้ไขโพสต์', exact: true }).first().click();
    await page.waitForURL(/\/post\/edit\//);
    await page.getByRole('textbox').first().waitFor();
    const result = {
      url: page.url(), text: await page.locator('body').innerText(),
      fields: await page.locator('[test-data]').evaluateAll(elements => elements.map(el => ({ id: el.getAttribute('test-data'), text: el.textContent?.slice(0, 100), value: el.value }))),
      fileInputs: await page.locator('input[type="file"]').evaluateAll(elements => elements.map(el => el.outerHTML)),
    };
    await page.locator('[test-data="remove-edit-cover-button"]').click();
    result.emptyCoverInputs = await page.locator('input[type="file"]').evaluateAll(elements => elements.map(el => el.outerHTML));
    await page.locator('[test-data="edit-category-tags-settings-button"]').click();
    result.modalFields = await page.locator('[test-data]').evaluateAll(elements => elements.map(el => ({ id: el.getAttribute('test-data'), text: el.textContent?.slice(0, 100) })));
    await page.goto('/home');
    await page.getByRole('button', { name: 'เมนูผู้ใช้' }).click();
    await page.getByRole('link', { name: 'โปรไฟล์ของฉัน', exact: true }).click();
    await page.getByRole('heading', { name: 'TC-LIFE-001 (แก้ไขแล้ว) ฟิสิกส์ ม.ปลาย 1790748677196', exact: true }).click();
    await page.waitForURL(/\/post\/[^/]+$/);
    await page.waitForLoadState('networkidle');
    await page.getByRole('heading', { name: 'TC-LIFE-001 (แก้ไขแล้ว) ฟิสิกส์ ม.ปลาย 1790748677196', exact: true }).waitFor();
    result.detail = {
      url: page.url(), buttons: await page.getByRole('button').allTextContents(),
      images: await page.locator('img').evaluateAll(elements => elements.map(el => ({ alt: el.alt, src: el.src }))),
      text: await page.locator('body').innerText(),
    };
    await fs.writeFile(path.join(__dirname, 'edit-ui.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exit(1); });
