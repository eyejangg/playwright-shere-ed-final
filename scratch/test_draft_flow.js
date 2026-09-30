const { chromium } = require('playwright');
const path = require('path');
const { educationalPosts } = require('../test-data/educational/posts-data');

(async () => {
  const post = educationalPosts[0];
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/create', { waitUntil: 'networkidle' });

  // 1. Cover
  await page.locator('input[test-data="cover-file-input"]').setInputFiles(post.cover);
  await page.getByRole('img', { name: 'Cover' }).waitFor({ state: 'visible' });

  // 2. Title
  await page.locator('input[test-data="post-title-input"]').fill(post.title);

  // 3. Grade
  await page.locator('select[test-data="education-level-select"]').selectOption({ label: post.grade });

  // 4. Summary
  await page.locator('textarea[test-data="post-summary-input"]').fill(post.summary);

  // 5. Category & Tags
  await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
  await page.waitForTimeout(500);
  await page.locator('select[test-data="category-select"]').selectOption({ label: post.subject });
  for (const tag of post.tags) {
    await page.locator('input[test-data="hashtag-input"]').fill(tag);
    await page.locator('input[test-data="hashtag-input"]').press('Enter');
    await page.waitForTimeout(100);
  }
  await page.getByRole('button', { name: 'เสร็จสิ้น', exact: true }).click();
  await page.waitForTimeout(500);

  // 6. Editor
  const editor = page.locator('[contenteditable="true"]').first();
  await editor.click();
  await editor.fill(post.detail);

  // 7. Gallery
  await page.locator('input[test-data="supporting-images-file-input"]').setInputFiles(post.gallery);
  await page.waitForTimeout(2000);

  // 8. PDF
  await page.locator('input[test-data="pdf-file-input"]').setInputFiles(post.pdf);
  await page.waitForTimeout(2000);

  console.log('Submitting draft...');
  const draftBtn = page.getByRole('button', { name: /บันทึกแบบร่าง/ }).first();
  await draftBtn.click();

  // wait for response or URL
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(1000);
    console.log(`[${i}s] URL: ${page.url()}`);
    const swal = page.locator('.swal2-popup');
    if (await swal.isVisible().catch(() => false)) {
      console.log('Swal title:', await swal.locator('.swal2-title').innerText());
      const okBtn = swal.getByRole('button', { name: /OK|ตกลง/i });
      if (await okBtn.isVisible().catch(() => false)) {
        await okBtn.click();
        console.log('Clicked Swal OK');
      }
    }
    if (page.url().includes('/profile')) break;
  }

  console.log('Final URL after draft:', page.url());
  await browser.close();
})();
