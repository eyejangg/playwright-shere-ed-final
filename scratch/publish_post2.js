const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/profile?tab=drafts', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Close any sweetalert if present
  const swalOk = page.locator('.swal2-confirm, button:has-text("OK"), button:has-text("ตกลง")').first();
  if (await swalOk.isVisible().catch(() => false)) {
    await swalOk.click();
    await page.waitForTimeout(500);
  }

  // Click draft tab
  const draftTabBtn = page.getByRole('button', { name: /แบบร่าง/ }).first();
  await draftTabBtn.click({ force: true });
  await page.waitForTimeout(1500);

  // Click edit on the solar system card
  const card = page.locator('div').filter({ hasText: 'ระบบสุริยะ' }).last();
  const editBtn = card.getByRole('button', { name: /แก้ไขโพสต์/ }).first();
  await editBtn.click();

  await page.waitForURL(/\/post\/edit\/[^/]+/, { timeout: 20000 });
  console.log('Opened edit URL:', page.url());

  await page.waitForTimeout(1500);
  // Click publish
  const publishBtn = page.locator('button[test-data="update-post-button"], button[test-data="publish-post-button"]').or(page.getByRole('button', { name: /บันทึกและโพสต์/ })).first();
  await publishBtn.click();
  console.log('Clicked publish button');

  // Wait for Swal confirm
  const confirmBtn = page.locator('.swal2-confirm, button:has-text("OK")').first();
  await confirmBtn.waitFor({ state: 'visible', timeout: 30000 });
  await confirmBtn.click();
  console.log('Clicked Swal OK');

  // Wait for redirect to /post/:id
  await page.waitForURL(/\/post\/(?!edit)[a-zA-Z0-9-]+$/, { timeout: 30000 });
  const publishedUrl = page.url();
  console.log('Published Post 2 URL:', publishedUrl);

  const screenshotPath = path.resolve('test-results/screenshots/post-2-success.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Saved screenshot:', screenshotPath);

  // Update execution-summary.json
  const summaryPath = path.resolve('test-results/execution-summary.json');
  let summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  summary.push({
    index: 2,
    id: 'post-2-solar-system',
    title: 'ระบบสุริยะ: สรุปข้อมูลดาวเคราะห์และวัตถุท้องฟ้าในระบบสุริยะ',
    grade: 'มัธยมศึกษาตอนต้น',
    subject: 'วิทยาศาสตร์',
    status: 'PUBLISHED',
    url: publishedUrl,
    draftUrl: 'https://share-ed.online/profile?tab=drafts',
    screenshot: screenshotPath,
    error: null,
    files: {
      cover: 'cover.png',
      gallery: ['gallery-1.png', 'gallery-2.png', 'gallery-3.png'],
      pdf: 'handbook.pdf'
    }
  });
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log('Updated summary successfully!');

  await browser.close();
})();
