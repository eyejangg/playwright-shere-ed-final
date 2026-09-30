const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  // Test on duplicate post 1
  const testUrl = 'https://share-ed.online/post/db01e083-0c77-41c4-838c-42d6655be5c7';
  await page.goto(testUrl, { waitUntil: 'networkidle' });
  console.log('Post Page URL:', page.url());

  const delBtn = page.getByRole('button', { name: 'ลบโพสต์' }).first();
  console.log('Delete button visible:', await delBtn.isVisible());

  if (await delBtn.isVisible()) {
    console.log('Clicking "ลบโพสต์"...');
    await delBtn.click();
    await page.waitForTimeout(1000);

    const swal = page.locator('.swal2-popup');
    if (await swal.isVisible()) {
      console.log('Swal title:', await swal.locator('.swal2-title').innerText());
      console.log('Swal text:', await swal.locator('.swal2-html-container').innerText().catch(() => ''));

      const confirmBtn = swal.locator('.swal2-confirm, button:has-text("ใช่"), button:has-text("ยืนยัน"), button:has-text("ลบ")').first();
      console.log('Confirm button text:', await confirmBtn.innerText());
      await confirmBtn.click();
      await page.waitForTimeout(2000);

      const swal2 = page.locator('.swal2-popup');
      if (await swal2.isVisible()) {
        console.log('Swal2 title:', await swal2.locator('.swal2-title').innerText());
        const okBtn = swal2.locator('.swal2-confirm, button:has-text("OK"), button:has-text("ตกลง")').first();
        if (await okBtn.isVisible()) await okBtn.click();
      }
    }

    await page.waitForTimeout(2000);
    console.log('Current URL after deletion:', page.url());
  }

  await browser.close();
})();
