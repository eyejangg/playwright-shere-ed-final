const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const summaryJsonPath = path.resolve(__dirname, '../reports/execution-summary.json');
const testResultsJson = path.resolve(__dirname, '../test-results/execution-summary.json');

async function deleteSinglePost(page, postUrl) {
  try {
    console.log(`> กำลังเข้าสู่หน้าโพสต์: ${postUrl}`);
    await page.goto(postUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const delBtn = page.getByRole('button', { name: 'ลบโพสต์' }).first();
    if (await delBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await delBtn.click();
      await page.waitForTimeout(600);

      const confirmBtn = page.locator('.swal2-confirm, button:has-text("ใช่, ลบเลย"), button:has-text("ใช่"), button:has-text("ยืนยัน"), button:has-text("ลบ")').first();
      await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
      await confirmBtn.click();

      // รอ popup สำเร็จ หรือยืนยัน
      await page.waitForTimeout(1500);
      const okBtn = page.locator('.swal2-confirm:has-text("OK"), .swal2-confirm:has-text("ตกลง")').first();
      if (await okBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await okBtn.click().catch(() => {});
      }
      await page.waitForTimeout(2000);
      console.log(`✓ ลบโพสต์สำเร็จ: ${postUrl}`);
      return true;
    } else {
      console.log(`- ไม่พบปุ่มลบโพสต์ หรือโพสต์นี้ถูกลบไปแล้ว: ${postUrl}`);
      return false;
    }
  } catch (err) {
    console.warn(`! คำเตือนการลบโพสต์ (${postUrl}):`, err.message);
    return false;
  }
}

(async () => {
  const customUrls = process.argv.slice(2).filter(arg => arg.startsWith('http'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  console.log('============================================================');
  console.log('คำสั่งลบโพสต์บน SHARE-ED (Delete Posts Script)');
  console.log('============================================================\n');

  const targetUrls = new Set(customUrls);

  // 1. อ่าน URL จาก reports/execution-summary.json
  if (targetUrls.size === 0) {
    for (const f of [summaryJsonPath, testResultsJson]) {
      if (fs.existsSync(f)) {
        try {
          const arr = JSON.parse(fs.readFileSync(f, 'utf8'));
          for (const item of arr) {
            if (item.url && item.url.includes('/post/')) {
              targetUrls.add(item.url);
            }
          }
        } catch (e) {}
      }
    }
  }

  // 2. ตรวจสอบหน้าโปรไฟล์เพื่อค้นหาโพสต์เพิ่มเติมของผู้ใช้
  try {
    console.log('> ตรวจสอบรายการโพสต์ในหน้าโปรไฟล์...');
    await page.goto('https://share-ed.online/profile', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const profileLinks = await page.locator('a[href*="/post/"]').evaluateAll(links => 
      links.map(l => l.href).filter(href => !href.includes('/edit'))
    );

    for (const link of profileLinks) {
      targetUrls.add(link);
    }
  } catch (err) {
    console.log('- ไม่สามารถดึงลิงก์จากโปรไฟล์เพิ่มเติมได้:', err.message);
  }

  if (targetUrls.size === 0) {
    console.log('ไม่พบรายการ URL ของโพสต์ที่ต้องการลบ');
    await browser.close();
    return;
  }

  console.log(`พบโพสต์ทั้งหมด ${targetUrls.size} รายการที่จะดำเนินการลบ:\n`);
  Array.from(targetUrls).forEach((url, i) => console.log(` ${i + 1}. ${url}`));
  console.log('------------------------------------------------------------\n');

  let deletedCount = 0;
  for (const url of targetUrls) {
    const ok = await deleteSinglePost(page, url);
    if (ok) deletedCount++;
  }

  console.log(`\n============================================================`);
  console.log(`ผลลัพธ์: ลบโพสต์สำเร็จทั้งหมด ${deletedCount}/${targetUrls.size} รายการ`);
  console.log(`============================================================`);

  await browser.close();
})();
