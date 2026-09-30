const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  
  await page.goto('https://share-ed.online/post/edit/db01e083-0c77-41c4-838c-42d6655be5c7', { waitUntil: 'networkidle' });

  console.log('Ready to click publish ("บันทึกและโพสต์")...');
  const publishBtn = page.locator('button[test-data="update-post-button"]');
  console.log('Publish button enabled:', await publishBtn.isEnabled());
  await publishBtn.click();

  await page.waitForTimeout(2000);
  console.log('Current URL after click:', page.url());

  // Check if dialog / swal appears
  const swal = page.locator('.swal2-popup');
  if (await swal.isVisible()) {
    console.log('Swal title:', await swal.locator('.swal2-title').innerText());
    console.log('Swal text:', await swal.locator('.swal2-html-container').innerText().catch(() => ''));
    const confirmBtn = swal.locator('.swal2-confirm');
    if (await confirmBtn.isVisible()) {
      console.log('Clicking Swal Confirm button...');
      await confirmBtn.click();
    }
  }

  await page.waitForTimeout(3000);
  console.log('Final URL:', page.url());
  const postHeading = await page.locator('h1').innerText().catch(() => '');
  console.log('H1 Heading on page:', postHeading);

  await browser.close();
})();
