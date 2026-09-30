// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const summaryJsonPath = path.resolve(__dirname, '../../reports/execution-summary.json');

test.describe('ฟังก์ชั่นการลบโพสต์บน SHARE-ED ผ่านหน้าเว็บ', () => {
  test.setTimeout(120_000);

  test('ลบโพสต์ทั้งหมดที่บันทึกไว้ในระบบ', async ({ page }) => {
    let posts = [];
    if (fs.existsSync(summaryJsonPath)) {
      try {
        posts = JSON.parse(fs.readFileSync(summaryJsonPath, 'utf8'));
      } catch (e) {}
    }

    test.skip(posts.length === 0, 'ไม่พบโพสต์ที่บันทึกไว้');

    for (const post of posts) {
      if (!post.url || !post.url.includes('/post/')) continue;

      console.log(`> ดำเนินการลบโพสต์: ${post.title} (${post.url})`);
      await page.goto(post.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      const delBtn = page.getByRole('button', { name: 'ลบโพสต์' }).first();
      if (await delBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await delBtn.click();
        await page.waitForTimeout(500);

        const confirmBtn = page.locator('.swal2-confirm, button:has-text("ใช่, ลบเลย"), button:has-text("ใช่"), button:has-text("ยืนยัน")').first();
        await expect(confirmBtn).toBeVisible({ timeout: 5000 });
        await confirmBtn.click();

        await page.waitForTimeout(2000);
        console.log(`✓ ลบโพสต์สำเร็จ: ${post.url}`);
      }
    }
  });
});
