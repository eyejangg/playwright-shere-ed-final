const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { educationalPosts } = require('../test-data/educational/posts-data');

const summaryFile = path.resolve(__dirname, '../test-results/execution-summary.json');
const screenshotsDir = path.resolve(__dirname, '../test-results/screenshots');

(async () => {
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // โหลดรายการสรุปเดิม (ถ้ามี)
  let summary = [];
  if (fs.existsSync(summaryFile)) {
    try {
      summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
    } catch (e) {}
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  console.log('=== เริ่มกระบวนการสร้างและเผยแพร่โพสต์บน SHARE-ED (Direct Create) ===\n');

  for (let i = 0; i < educationalPosts.length; i++) {
    const post = educationalPosts[i];
    const postIndex = i + 1;

    // ตรวจสอบว่าเคยเผยแพร่แล้วหรือไม่ (เช่น โพสต์ 1)
    const existing = summary.find(s => s.id === post.id && s.status === 'PUBLISHED');
    if (existing && existing.url && existing.url.includes('/post/')) {
      console.log(`[โพสต์ที่ ${postIndex}/6] "${post.title}" เผยแพร่แล้วที่: ${existing.url}`);
      continue;
    }

    console.log(`------------------------------------------------------------`);
    console.log(`[โพสต์ที่ ${postIndex}/6] กำลังสร้างโพสต์: "${post.title}"`);
    console.log(`------------------------------------------------------------`);

    const record = {
      index: postIndex,
      id: post.id,
      title: post.title,
      grade: post.grade,
      subject: post.subject,
      status: 'FAILED',
      url: '-',
      screenshot: '-',
      files: {
        cover: path.basename(post.cover),
        gallery: post.gallery.map(g => path.basename(g)),
        pdf: path.basename(post.pdf)
      }
    };

    try {
      // 1. ไปหน้าสร้างโพสต์
      await page.goto('https://share-ed.online/create', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      // 2. อัปโหลดภาพปก
      console.log(`> อัปโหลดภาพปก: ${path.basename(post.cover)}`);
      const coverInput = page.locator('input[test-data="cover-file-input"]').or(page.locator('input[type="file"]')).first();
      await coverInput.setInputFiles(post.cover);
      await page.waitForTimeout(1000);

      // 3. กรอกชื่อเรื่อง
      console.log(`> กรอกชื่อเรื่อง: ${post.title}`);
      const titleInput = page.locator('input[test-data="post-title-input"]').or(page.getByPlaceholder(/ชื่อเรื่อง/)).first();
      await titleInput.fill(post.title);

      // 4. เลือกระดับชั้น
      console.log(`> เลือกระดับชั้น: ${post.grade}`);
      const gradeSelect = page.locator('select[test-data="education-level-select"]').first();
      await gradeSelect.selectOption({ label: post.grade });

      // 5. กรอกบทสรุปย่อ
      console.log(`> กรอกสรุปย่อ: ${post.summary.substring(0, 40)}...`);
      const summaryInput = page.locator('textarea[test-data="post-summary-input"]').first();
      await summaryInput.fill(post.summary);

      // 6. ตั้งค่าหมวดหมู่วิชาและแท็ก
      console.log(`> เลือกหมวดหมู่: ${post.subject}`);
      const openCatBtn = page.getByRole('button', { name: /ตั้งค่าวิชาและแท็ก|หมวดหมู่และแท็ก/ }).first();
      await openCatBtn.click();
      await page.waitForTimeout(500);

      const subjectSelect = page.locator('select[test-data="category-select"]').first();
      await subjectSelect.selectOption({ label: post.subject });

      // แท็ก (สูงสุด 3 แท็ก)
      const tagInput = page.locator('input[test-data="hashtag-input"]').first();
      for (const tag of post.tags.slice(0, 3)) {
        const presetBtn = page.getByRole('button', { name: tag, exact: true });
        if (await presetBtn.isVisible().catch(() => false)) {
          await presetBtn.click();
        } else if (await tagInput.isVisible().catch(() => false)) {
          await tagInput.fill(tag);
          await tagInput.press('Enter');
        }
        await page.waitForTimeout(150);
      }

      const confirmCatBtn = page.getByRole('button', { name: 'เสร็จสิ้น', exact: true }).or(page.getByRole('button', { name: 'ตกลง' })).first();
      await confirmCatBtn.click();
      await page.waitForTimeout(500);

      // 7. กรอกเนื้อหา Rich Text
      console.log(`> กรอกเนื้อหาบทเรียน`);
      const editor = page.locator('[contenteditable="true"]').first();
      await editor.click();
      await editor.fill(post.detail);

      // 8. อัปโหลดภาพประกอบ Gallery
      console.log(`> อัปโหลดรูปภาพประกอบ Gallery (${post.gallery.length} รูป)`);
      const galleryInput = page.locator('input[test-data="supporting-images-file-input"]').first();
      await galleryInput.setInputFiles(post.gallery);
      await page.waitForTimeout(1500);

      // 9. อัปโหลดเอกสาร PDF
      console.log(`> อัปโหลดไฟล์ PDF: ${path.basename(post.pdf)}`);
      const pdfInput = page.locator('input[test-data="pdf-file-input"]').first();
      await pdfInput.setInputFiles(post.pdf);
      await page.waitForTimeout(1500);

      // 10. รอให้ปุ่ม "โพสต์สรุปความรู้" พร้อมกด (รอ Cloudinary อัปโหลด)
      console.log(`> รออัปโหลดไฟล์เสร็จสิ้น และกดปุ่มเผยแพร่โพสต์...`);
      const publishBtn = page.locator('button[test-data="publish-post-button"]').or(page.getByRole('button', { name: /โพสต์สรุปความรู้|เผยแพร่/ })).first();
      await publishBtn.waitFor({ state: 'visible', timeout: 60000 });
      // รอให้ enabled
      let enabled = false;
      for (let retries = 0; retries < 30; retries++) {
        if (await publishBtn.isEnabled()) {
          enabled = true;
          break;
        }
        await page.waitForTimeout(1000);
      }
      if (!enabled) {
        throw new Error('ปุ่มโพสต์สรุปความรู้ไม่เปิดใช้งาน (อาจเกิดจากไฟล์กำลังอัปโหลด)');
      }

      await publishBtn.click();
      console.log(`> กดปุ่ม "โพสต์สรุปความรู้" เรียบร้อยแล้ว`);

      // 11. รอ SweetAlert สำเร็จและกด OK
      const swalOk = page.locator('.swal2-confirm, button:has-text("OK"), button:has-text("ตกลง")').first();
      await swalOk.waitFor({ state: 'visible', timeout: 45000 });
      await swalOk.click();

      // 12. รอระบบนำทางไปยัง URL โพสต์ใหม่
      await page.waitForURL(/\/post\/(?!edit)[a-zA-Z0-9-]+$/, { timeout: 35000 });
      const publishedUrl = page.url();
      console.log(`✓ โพสต์สำเร็จ! URL: ${publishedUrl}`);

      // 13. บันทึก Screenshot ความสำเร็จ
      const screenshotPath = path.join(screenshotsDir, `post-${postIndex}-success.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      record.status = 'PUBLISHED';
      record.url = publishedUrl;
      record.screenshot = screenshotPath;

      // บันทึกลง summary
      const sIdx = summary.findIndex(s => s.id === post.id);
      if (sIdx >= 0) summary[sIdx] = record;
      else summary.push(record);
      fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');

      console.log(`✓ บันทึกผลสำเร็จสำหรับโพสต์ที่ ${postIndex}\n`);
    } catch (err) {
      console.error(`✕ เกิดข้อผิดพลาดในโพสต์ที่ ${postIndex}:`, err.message);
      record.error = err.message;
      const errorScreenshot = path.join(screenshotsDir, `post-${postIndex}-error.png`);
      await page.screenshot({ path: errorScreenshot, fullPage: false }).catch(() => {});
      record.screenshot = errorScreenshot;

      const sIdx = summary.findIndex(s => s.id === post.id);
      if (sIdx >= 0) summary[sIdx] = record;
      else summary.push(record);
      fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    }
  }

  await browser.close();
  console.log('=== ดำเนินการเสร็จสิ้นทุกโพสต์ ===');
})();
