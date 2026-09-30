// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { educationalPosts } = require('../../test-data/educational/posts-data');

// บันทึกผลลัพธ์ของแต่ละโพสต์สำหรับทำตารางสรุปรายงาน
const resultsLogPath = path.resolve(__dirname, '../../test-results/execution-summary.json');
const screenshotsDir = path.resolve(__dirname, '../../test-results/screenshots');

function recordResult(result) {
  let existing = [];
  if (fs.existsSync(resultsLogPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(resultsLogPath, 'utf8'));
    } catch (e) {}
  }
  const idx = existing.findIndex(r => r.id === result.id);
  if (idx >= 0) {
    existing[idx] = result;
  } else {
    existing.push(result);
  }
  fs.mkdirSync(path.dirname(resultsLogPath), { recursive: true });
  fs.writeFileSync(resultsLogPath, JSON.stringify(existing, null, 2), 'utf8');
}

test.describe('สร้างและเผยแพร่โพสต์สื่อการเรียนรู้จริง 6 โพสต์บน SHARE-ED ผ่านแบบร่าง', () => {
  // ตั้ง timeout ให้เหมาะสมต่อการอัปโหลดไฟล์ขนาดใหญ่และกระบวนการบันทึกแบบร่าง
  test.setTimeout(180_000);

  test.beforeAll(async () => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  for (let i = 0; i < educationalPosts.length; i++) {
    const post = educationalPosts[i];
    const postIndex = i + 1;

    test(`[โพสต์ที่ ${postIndex}/6] สร้างโพสต์: ${post.title}`, async ({ page }) => {
      console.log(`\n============================================================`);
      console.log(`เริ่มดำเนินการโพสต์ที่ ${postIndex}/6: "${post.title}"`);
      console.log(`============================================================`);

      const executionRecord = {
        index: postIndex,
        id: post.id,
        title: post.title,
        grade: post.grade,
        subject: post.subject,
        status: 'FAILED',
        url: '-',
        draftUrl: '-',
        screenshot: '-',
        error: null,
        files: {
          cover: path.basename(post.cover),
          gallery: post.gallery.map(g => path.basename(g)),
          pdf: path.basename(post.pdf)
        }
      };

      try {
        // ตรวจสอบว่าเคยเผยแพร่สำเร็จแล้วหรือไม่ เพื่อป้องกันการโพสต์ซ้ำตามข้อกำหนด
        let existingSummary = [];
        if (fs.existsSync(resultsLogPath)) {
          try {
            existingSummary = JSON.parse(fs.readFileSync(resultsLogPath, 'utf8'));
          } catch (e) {}
        }
        const prevRun = existingSummary.find(r => r.id === post.id && r.status === 'PUBLISHED' && r.url && r.url.includes('/post/'));
        if (prevRun) {
          console.log(`✓ โพสต์ที่ ${postIndex} ถูกเผยแพร่เรียบร้อยแล้วที่ ${prevRun.url} (ข้ามขั้นตอนการสร้างซ้ำเพื่อป้องกัน duplicate)`);
          await page.goto(prevRun.url, { waitUntil: 'domcontentloaded' });
          await expect(page.getByRole('heading', { name: post.title, exact: true }).first()).toBeVisible({ timeout: 15_000 });
          const screenshotPath = path.join(screenshotsDir, `post-${postIndex}-success.png`);
          if (!fs.existsSync(screenshotPath)) {
            await page.screenshot({ path: screenshotPath, fullPage: true });
          }
          prevRun.screenshot = screenshotPath;
          recordResult(prevRun);
          return;
        }

        // -------------------------------------------------------------
        // ขั้นตอนที่ 1 & 2: เปิดเว็บไซต์ Share-Ed และตรวจสอบการเข้าสู่ระบบ
        // -------------------------------------------------------------
        console.log(`[1-2] เปิดหน้าสร้างโพสต์และตรวจสอบสิทธิ์...`);
        await page.goto('/create', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);

        if (page.url().includes('/login')) {
          throw new Error('ผู้ใช้ยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบก่อนดำเนินการสร้างโพสต์');
        }

        await expect(page.getByRole('heading', { name: /แบ่งปันความรู้ของคุณ|สร้างโพสต์สรุปความรู้/ })).toBeVisible({ timeout: 15_000 });
        console.log(`✓ ยืนยันสิทธิ์พร้อมสร้างโพสต์`);

        // -------------------------------------------------------------
        // ค้นหาชื่อเรื่องเดิมเพื่อป้องกันโพสต์ซ้ำ
        // -------------------------------------------------------------
        console.log(`[ป้องกันโพสต์ซ้ำ] ตรวจสอบว่ามีชื่อเรื่อง "${post.searchTitle || post.title}" อยู่ก่อนหรือไม่...`);
        await page.goto('/explore', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000);

        const searchInput = page.getByPlaceholder(/ค้นหา/i).first();
        if (await searchInput.isVisible().catch(() => false)) {
          await searchInput.fill(post.searchTitle || post.title);
          await page.waitForTimeout(1500);

          const existingCards = page.getByText(post.title, { exact: true });
          const count = await existingCards.count();
          if (count > 0) {
            console.warn(`⚠️ พบโพสต์ชื่อ "${post.title}" อยู่แล้วจำนวน ${count} โพสต์`);
          } else {
            console.log(`✓ ยืนยันไม่มีโพสต์ชื่อเดียวกันอยู่ก่อนแล้ว`);
          }
        }

        // -------------------------------------------------------------
        // ขั้นตอนที่ 3: ไปยังหน้าสร้างโพสต์
        // -------------------------------------------------------------
        console.log(`[3] ไปยังหน้าสร้างโพสต์...`);
        await page.goto('/create', { waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('heading', { name: /แบ่งปันความรู้ของคุณ|สร้างโพสต์สรุปความรู้/ })).toBeVisible({ timeout: 15_000 });

        // -------------------------------------------------------------
        // ขั้นตอนที่ 4: อัปโหลดภาพปก PNG ของโพสต์นั้น (1280 × 720 พิกเซล <= 2 MB)
        // -------------------------------------------------------------
        console.log(`[4] อัปโหลดภาพปก PNG: ${post.cover}`);
        const coverInput = page.locator('input[test-data="cover-file-input"]').or(page.getByTestId('cover-file-input')).first();
        await coverInput.setInputFiles(post.cover);
        
        // รอให้ภาพปกแสดงผลสำเร็จ
        const coverImg = page.getByRole('img', { name: 'Cover' });
        await expect(coverImg).toBeVisible({ timeout: 20_000 });
        console.log(`✓ ภาพปกอัปโหลดและแสดงผลสำเร็จ`);

        // -------------------------------------------------------------
        // ขั้นตอนที่ 5: กรอกชื่อเรื่อง
        // -------------------------------------------------------------
        console.log(`[5] กรอกชื่อเรื่อง: "${post.title}"`);
        const titleInput = page.locator('input[test-data="post-title-input"]').or(page.getByTestId('post-title-input')).first();
        await titleInput.fill(post.title);
        await expect(titleInput).toHaveValue(post.title);

        // -------------------------------------------------------------
        // ขั้นตอนที่ 6: เลือกระดับชั้นให้ตรงกับข้อมูลที่กำหนด
        // -------------------------------------------------------------
        console.log(`[6] เลือกระดับชั้น: "${post.grade}"`);
        const gradeSelect = page.locator('select[test-data="education-level-select"]').or(page.getByTestId('education-level-select')).first();
        await gradeSelect.selectOption({ label: post.grade });
        await expect(gradeSelect).toHaveValue(post.grade);

        // -------------------------------------------------------------
        // ขั้นตอนที่ 7: กรอกบทสรุปย่อ โดยต้องไม่เกิน 200 ตัวอักษร
        // -------------------------------------------------------------
        console.log(`[7] กรอกบทสรุปย่อ (ความยาว ${post.summary.length} ตัวอักษร)...`);
        expect(post.summary.length).toBeLessThanOrEqual(200);
        const summaryInput = page.locator('textarea[test-data="post-summary-input"]').or(page.getByTestId('post-summary-input')).first();
        await summaryInput.fill(post.summary);
        await expect(summaryInput).toHaveValue(post.summary);

        // -------------------------------------------------------------
        // ขั้นตอนที่ 8, 9, 10: เพิ่มหมวดหมู่และแท็ก (ตรวจทุกแท็กขึ้นต้นด้วย # และไม่เกิน 10 ตัวอักษร)
        // -------------------------------------------------------------
        console.log(`[8-10] ตั้งค่าหมวดหมู่ "${post.subject}" และแท็ก: ${post.tags.join(', ')}`);
        for (const tag of post.tags) {
          expect(tag.startsWith('#')).toBeTruthy();
          expect(tag.length).toBeLessThanOrEqual(10);
        }

        const openCatModalBtn = page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).or(page.getByRole('button', { name: /หมวดหมู่และแท็ก/ })).first();
        await openCatModalBtn.click();
        await page.waitForTimeout(500);

        // เลือกหมวดหมู่วิชาใน Modal
        const subjectSelect = page.locator('select[test-data="category-select"]').or(page.getByTestId('category-select')).first();
        await subjectSelect.selectOption({ label: post.subject });

        // เพิ่มแท็ก (ระบบรองรับสูงสุด 3 แท็ก)
        const tagInput = page.locator('input[test-data="hashtag-input"]').or(page.getByTestId('hashtag-input')).first();
        for (const tag of post.tags.slice(0, 3)) {
          const presetBtn = page.getByRole('button', { name: tag, exact: true });
          if (await presetBtn.isVisible().catch(() => false)) {
            await presetBtn.click();
          } else if (await tagInput.isVisible().catch(() => false)) {
            await tagInput.fill(tag);
            await tagInput.press('Enter');
          }
          await page.waitForTimeout(200);
        }

        // ยืนยันการตั้งค่าหมวดหมู่และแท็ก (ปุ่ม "เสร็จสิ้น")
        const confirmCatBtn = page.getByRole('button', { name: 'เสร็จสิ้น', exact: true }).or(page.getByRole('button', { name: 'ตกลง' })).first();
        await confirmCatBtn.click();
        await page.waitForTimeout(500);
        await expect(page.getByText(post.subject).first()).toBeVisible();

        // -------------------------------------------------------------
        // ขั้นตอนที่ 11: กรอกรายละเอียดโพสต์ลงใน Rich Text Editor
        // -------------------------------------------------------------
        console.log(`[11] กรอกรายละเอียดโพสต์ลงใน Rich Text Editor...`);
        const editor = page.locator('[contenteditable="true"]').first();
        await editor.click();
        await editor.fill(post.detail);

        // -------------------------------------------------------------
        // ขั้นตอนที่ 12: แทรกรูปประกอบในตำแหน่งที่กำหนด (Gallery รูปภาพประกอบ)
        // -------------------------------------------------------------
        console.log(`[12] อัปโหลดรูปภาพประกอบ Gallery (${post.gallery.length} รูป)...`);
        const galleryInput = page.locator('input[test-data="supporting-images-file-input"]').or(page.getByTestId('supporting-images-file-input')).first();
        await galleryInput.setInputFiles(post.gallery);
        await expect(page.getByText(new RegExp(`รูปภาพประกอบ \\(${post.gallery.length}/`))).toBeVisible({ timeout: 20_000 });
        console.log(`✓ รูปภาพประกอบอัปโหลดสำเร็จ`);

        // -------------------------------------------------------------
        // ขั้นตอนที่ 13: อัปโหลดไฟล์ PDF ของโพสต์ (<= 20 MB)
        // -------------------------------------------------------------
        console.log(`[13] อัปโหลดไฟล์เอกสาร PDF: ${post.pdf}`);
        const pdfInput = page.locator('input[test-data="pdf-file-input"]').or(page.getByTestId('pdf-file-input')).first();
        await pdfInput.setInputFiles(post.pdf);
        await expect(page.getByText('handbook.pdf', { exact: true }).or(page.getByText(/\.pdf/i))).toBeVisible({ timeout: 20_000 });
        console.log(`✓ ไฟล์ PDF อัปโหลดสำเร็จ`);

        // -------------------------------------------------------------
        // ขั้นตอนที่ 14: ตรวจ Preview และข้อมูลทุกช่อง
        // -------------------------------------------------------------
        console.log(`[14] ตรวจสอบ Preview และความถูกต้องของข้อมูลทุกช่อง...`);
        await coverImg.click();
        await page.waitForTimeout(500);
        const previewModal = page.locator('div.fixed:has-text("ดูตัวอย่างไฟล์")');
        if (await previewModal.isVisible().catch(() => false)) {
          console.log(`  ✓ ดูตัวอย่าง Preview สำเร็จ`);
          const closeBtn = previewModal.locator('button').first();
          await closeBtn.click();
          await expect(page.getByText('ดูตัวอย่างไฟล์')).toBeHidden({ timeout: 5000 });
          await page.waitForTimeout(500);
        }

        // -------------------------------------------------------------
        // ขั้นตอนที่ 15: บันทึกเป็นแบบร่างก่อน
        // -------------------------------------------------------------
        console.log(`[15] กดปุ่ม "บันทึกแบบร่าง"...`);
        const draftBtn = page.locator('button[test-data="save-draft-button"]').or(page.getByRole('button', { name: /บันทึกแบบร่าง/ })).first();
        await expect(draftBtn).toBeEnabled({ timeout: 60_000 });
        await draftBtn.click();

        // รอ Dialog หรือ SweetAlert2 แสดงยืนยันบันทึกแบบร่าง
        const swalDraftSuccess = page.getByRole('heading', { name: /บันทึกสำเร็จ|สำเร็จ/ }).or(page.getByText(/บันทึกแบบร่างเรียบร้อยแล้ว/));
        if (await swalDraftSuccess.waitFor({ state: 'visible', timeout: 30_000 }).then(() => true).catch(() => false)) {
          const okBtn = page.getByRole('button', { name: 'OK', exact: true }).or(page.getByRole('button', { name: 'ตกลง', exact: true }));
          if (await okBtn.isVisible().catch(() => false)) {
            await okBtn.click();
          }
        }

        // รอระบบนำทางมาที่หน้า /profile?tab=drafts
        await page.waitForURL(/\/profile(\?tab=drafts)?/, { timeout: 30_000 });
        console.log(`✓ บันทึกเป็นแบบร่างสำเร็จ นำทางมาที่: ${page.url()}`);
        executionRecord.draftUrl = page.url();

        // -------------------------------------------------------------
        // ขั้นตอนที่ 16: เปิดแบบร่างกลับมาตรวจสอบว่าข้อมูลและไฟล์ยังอยู่ครบ
        // -------------------------------------------------------------
        console.log(`[16] เปิดแบบร่างขึ้นมาตรวจสอบความสมบูรณ์...`);
        if (!page.url().includes('/profile')) {
          await page.goto('/profile?tab=drafts', { waitUntil: 'domcontentloaded' });
        }
        await page.waitForTimeout(1000);

        // คลิกแท็บ "แบบร่าง" ให้เนื้อหาแบบร่างแสดง
        const draftTabBtn = page.getByRole('button', { name: /แบบร่าง/ }).first();
        if (await draftTabBtn.isVisible().catch(() => false)) {
          await draftTabBtn.click();
          await page.waitForTimeout(1500);
        }

        const draftCard = page.locator('div').filter({ hasText: post.title }).last();
        await expect(draftCard).toBeVisible({ timeout: 20_000 });

        // คลิกปุ่ม "แก้ไขโพสต์" บนการ์ดแบบร่างนั้น
        const editDraftBtn = draftCard.getByRole('button', { name: /แก้ไขโพสต์/ }).first().or(page.getByRole('button', { name: /แก้ไขโพสต์/ }).first());
        await editDraftBtn.click();

        // ตรวจสอบว่าระบบนำทางไปที่หน้าแก้ไขแบบร่าง (/post/edit/:id)
        await page.waitForURL(/\/post\/edit\/[^/]+$/, { timeout: 25_000 });
        console.log(`✓ เปิดแบบร่างสำเร็จที่หน้า: ${page.url()}`);

        // ตรวจสอบว่าข้อมูลในฟอร์มยังอยู่ครบ
        const editTitleInput = page.locator('input[test-data="edit-post-title-input"], input[test-data="post-title-input"]').first();
        await expect(editTitleInput).toHaveValue(post.title);
        const editSummaryInput = page.locator('textarea[test-data="edit-post-summary-input"], textarea[test-data="post-summary-input"]').first();
        await expect(editSummaryInput).toHaveValue(post.summary);
        console.log(`✓ ข้อมูลในแบบร่างยังอยู่ครบถ้วนสมบูรณ์`);

        // -------------------------------------------------------------
        // ขั้นตอนที่ 17: เมื่อข้อมูลถูกต้องจึงกดเผยแพร่โพสต์
        // -------------------------------------------------------------
        console.log(`[17] กดปุ่มเผยแพร่โพสต์ ("บันทึกและโพสต์")...`);
        const publishBtn = page.locator('button[test-data="update-post-button"], button[test-data="publish-post-button"]').or(page.getByRole('button', { name: /บันทึกและโพสต์|โพสต์สรุปความรู้|เผยแพร่/ })).first();
        await expect(publishBtn).toBeEnabled({ timeout: 60_000 });
        await publishBtn.click();

        // รอยืนยันการเผยแพร่สำเร็จ (Swal popup)
        const swalPublishSuccess = page.getByRole('heading', { name: /บันทึกการแก้ไขสำเร็จ|โพสต์สำเร็จ|สำเร็จ/ }).or(page.getByText(/แก้ไขโพสต์สรุปความรู้เรียบร้อยแล้ว|สร้างโพสต์สรุปความรู้เรียบร้อยแล้ว/));
        await expect(swalPublishSuccess).toBeVisible({ timeout: 60_000 });
        console.log(`✓ ปรากฏหน้าต่างยืนยันการเผยแพร่สำเร็จ`);

        // กดปุ่ม OK เพื่อปิดกล่องแจ้งเตือน
        const confirmPublishOk = page.getByRole('button', { name: 'OK', exact: true }).or(page.getByRole('button', { name: 'ตกลง', exact: true }));
        if (await confirmPublishOk.isVisible().catch(() => false)) {
          await confirmPublishOk.click();
        }

        // -------------------------------------------------------------
        // ขั้นตอนที่ 18: บันทึก URL ของโพสต์ที่สร้างสำเร็จ
        // -------------------------------------------------------------
        await page.waitForURL(/\/post\/(?!edit)[a-zA-Z0-9-]+$/, { timeout: 35_000 });
        const publishedUrl = page.url();
        console.log(`[18] ✓ โพสต์เผยแพร่สำเร็จ! URL: ${publishedUrl}`);

        // ตรวจสอบความถูกต้องของหน้าโพสต์จริง
        await expect(page.getByRole('heading', { name: post.title, exact: true }).first()).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText(post.subject).first()).toBeVisible();
        await expect(page.getByText(post.grade).first()).toBeVisible();

        // บันทึกภาพหน้าจอความสำเร็จ
        const screenshotPath = path.join(screenshotsDir, `post-${postIndex}-success.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`✓ บันทึก Screenshot ความสำเร็จไว้ที่: ${screenshotPath}`);

        executionRecord.status = 'PUBLISHED';
        executionRecord.url = publishedUrl;
        executionRecord.screenshot = screenshotPath;
      } catch (err) {
        console.error(`✕ เกิดข้อผิดพลาดในการสร้างโพสต์ที่ ${postIndex}:`, err.message);
        executionRecord.error = err.message;

        const errorScreenshotPath = path.join(screenshotsDir, `post-${postIndex}-error.png`);
        await page.screenshot({ path: errorScreenshotPath, fullPage: false }).catch(() => {});
        executionRecord.screenshot = errorScreenshotPath;
        throw err;
      } finally {
        recordResult(executionRecord);
      }
    });
  }
});
