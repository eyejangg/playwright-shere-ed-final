const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { educationalPosts } = require('../test-data/educational/posts-data');

const reportsDir = path.resolve(__dirname, '../reports');
const screenshotsDir = path.resolve(reportsDir, 'screenshots');
const summaryJsonPath = path.join(reportsDir, 'execution-summary.json');
const testResultsJson = path.resolve(__dirname, '../test-results/execution-summary.json');
const testResultsScreenshots = path.resolve(__dirname, '../test-results/screenshots');

fs.mkdirSync(screenshotsDir, { recursive: true });
fs.mkdirSync(testResultsScreenshots, { recursive: true });

/**
 * จัดรูปแบบเนื้อหาสำหรับ Quill editor ให้แสดงผลเป็นย่อหน้า เว้นวรรคบรรทัดสวยงาม
 * และไม่ถูก CSS prose ยุบเป็น 0px
 */
function formatDetailHtml(text) {
  const lines = text.split('\n');
  const result = [];
  let lastWasSpacer = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      if (!lastWasSpacer && result.length > 0) {
        result.push('<p>&nbsp;</p>');
        lastWasSpacer = true;
      }
      continue;
    }

    // Main Section Headings (e.g., "1. นิยามและรูปแบบมาตรฐาน", "2. สมบัติ...")
    if (/^\d+\./.test(trimmed)) {
      if (!lastWasSpacer && result.length > 0) {
        result.push('<p>&nbsp;</p>');
      }
      result.push(`<p><strong>${trimmed}</strong></p>`);
      lastWasSpacer = false;
      continue;
    }

    // Intro or summary title
    if (trimmed.startsWith('สรุป') || trimmed.startsWith('คู่มือ')) {
      result.push(`<p><strong>${trimmed}</strong></p>`);
      result.push('<p>&nbsp;</p>');
      lastWasSpacer = true;
      continue;
    }

    // Bullet points (e.g., "- ...", "* ...")
    if (trimmed.startsWith('-')) {
      const bulletText = trimmed.replace(/^-\s*/, '• ');
      result.push(`<p>${bulletText}</p>`);
      lastWasSpacer = false;
      continue;
    }

    if (trimmed.startsWith('*')) {
      if (!lastWasSpacer && result.length > 0) {
        result.push('<p>&nbsp;</p>');
      }
      result.push(`<p><em>${trimmed}</em></p>`);
      lastWasSpacer = false;
      continue;
    }

    result.push(`<p>${trimmed}</p>`);
    lastWasSpacer = false;
  }

  return result.join('');
}

async function deletePost(page, postUrl) {
  try {
    console.log(`> ลบโพสต์เดิม: ${postUrl}`);
    await page.goto(postUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const delBtn = page.getByRole('button', { name: 'ลบโพสต์' }).first();
    if (await delBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await delBtn.click();
      await page.waitForTimeout(600);

      const confirmBtn = page.locator('.swal2-confirm, button:has-text("ใช่, ลบเลย"), button:has-text("ใช่"), button:has-text("ยืนยัน"), button:has-text("ลบ")').first();
      await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
      await confirmBtn.click();

      // รอ popup สำเร็จ หรือกลับหน้าหลัก
      await page.waitForTimeout(1500);
      const okBtn = page.locator('.swal2-confirm:has-text("OK"), .swal2-confirm:has-text("ตกลง")').first();
      if (await okBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await okBtn.click().catch(() => {});
      }
      await page.waitForTimeout(2000);
      console.log(`✓ ลบโพสต์เดิมสำเร็จ: ${postUrl}`);
    } else {
      console.log(`- ไม่พบปุ่มลบโพสต์ หรือโพสต์ถูกลบไปแล้ว: ${postUrl}`);
    }
  } catch (err) {
    console.warn(`! คำเตือนการลบโพสต์ (${postUrl}):`, err.message);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  console.log('============================================================');
  console.log('เริ่มต้นฟังก์ชั่น: ลบโพสต์เดิมทิ้ง และสร้างโพสต์ใหม่');
  console.log('- ภาพปก AI สวยงาม 1280x720 PNG');
  console.log('- รายละเอียดเนื้อหาเว้นวรรคบรรทัดสวยงาม (Non-breaking spacer)');
  console.log('============================================================\n');

  // 1. รวบรวมโพสต์เดิมที่ต้องลบ
  const toDeleteUrls = new Set([
    'https://share-ed.online/post/3fa0883e-059d-4c4f-a2cc-ffcd1e8270f9',
    'https://share-ed.online/post/a3558ef9-225e-4e98-bdaf-6f27d3bd2e98',
    'https://share-ed.online/post/26eeb8ce-782a-4714-972a-c2ef0c0b3f8a',
    'https://share-ed.online/post/aed35a01-d1bf-45c6-b142-c04d1f2b8f3f',
    'https://share-ed.online/post/8803a74f-1ec5-4b3b-9673-56b175dda43f',
    'https://share-ed.online/post/92b4eb6b-5fa4-4011-af8e-6efc1b124711'
  ]);

  for (const f of [summaryJsonPath, testResultsJson]) {
    if (fs.existsSync(f)) {
      try {
        const arr = JSON.parse(fs.readFileSync(f, 'utf8'));
        for (const item of arr) {
          if (item.url && item.url.includes('/post/')) toDeleteUrls.add(item.url);
        }
      } catch (e) {}
    }
  }

  console.log(`พบโพสต์เดิมที่จะลบทั้งหมด ${toDeleteUrls.size} รายการ`);
  for (const url of toDeleteUrls) {
    await deletePost(page, url);
  }

  console.log('\n--- เริ่มต้นสร้างโพสต์ใหม่ทั้ง 6 โพสต์ ---\n');
  const newSummary = [];

  // 2. สร้างโพสต์ใหม่ 6 โพสต์
  for (let i = 0; i < educationalPosts.length; i++) {
    const post = educationalPosts[i];
    const postIndex = i + 1;

    console.log(`------------------------------------------------------------`);
    console.log(`[โพสต์ที่ ${postIndex}/6] กำลังสร้างโพสต์ใหม่: "${post.title}"`);
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
      await page.goto('https://share-ed.online/create', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      // อัปโหลดภาพปกใหม่ AI 1280x720 PNG
      console.log(`> อัปโหลดภาพปก AI ใหม่: ${post.cover}`);
      const coverInput = page.locator('input[test-data="cover-file-input"]').or(page.locator('input[type="file"]')).first();
      await coverInput.setInputFiles(post.cover);
      await page.waitForTimeout(1000);

      // กรอกชื่อเรื่อง
      console.log(`> กรอกชื่อเรื่อง: ${post.title}`);
      const titleInput = page.locator('input[test-data="post-title-input"]').first();
      await titleInput.fill(post.title);

      // เลือกระดับชั้น
      console.log(`> เลือกระดับชั้น: ${post.grade}`);
      const gradeSelect = page.locator('select[test-data="education-level-select"]').first();
      await gradeSelect.selectOption({ label: post.grade });

      // กรอกสรุปย่อ
      console.log(`> กรอกสรุปย่อ (${post.summary.length} ตัวอักษร)`);
      const summaryInput = page.locator('textarea[test-data="post-summary-input"]').first();
      await summaryInput.fill(post.summary);

      // หมวดหมู่วิชาและแท็ก
      console.log(`> ตั้งค่าหมวดหมู่ "${post.subject}" และแท็ก: ${post.tags.slice(0, 3).join(', ')}`);
      const openCatBtn = page.getByRole('button', { name: /ตั้งค่าวิชาและแท็ก|หมวดหมู่และแท็ก/ }).first();
      await openCatBtn.click();
      await page.waitForTimeout(500);

      const subjectSelect = page.locator('select[test-data="category-select"]').first();
      await subjectSelect.selectOption({ label: post.subject });

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

      // กรอกรายละเอียดเนื้อหาพร้อมจัดย่อหน้าเว้นวรรคบรรทัดสวยงาม (Quill HTML)
      console.log(`> จัดรูปแบบเนื้อหาด้วยย่อหน้าและเว้นวรรคบรรทัดที่สวยงาม`);
      const formattedHtml = formatDetailHtml(post.detail);
      const editor = page.locator('[contenteditable="true"]').first();
      await editor.click();
      await editor.evaluate((el, htmlContent) => {
        el.innerHTML = htmlContent;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, formattedHtml);

      // อัปโหลด Gallery รูปภาพประกอบ
      console.log(`> อัปโหลดรูปภาพประกอบ Gallery (${post.gallery.length} รูป)`);
      const galleryInput = page.locator('input[test-data="supporting-images-file-input"]').first();
      await galleryInput.setInputFiles(post.gallery);
      await page.waitForTimeout(1500);

      // อัปโหลดไฟล์ PDF
      console.log(`> อัปโหลดไฟล์เอกสาร PDF: ${path.basename(post.pdf)}`);
      const pdfInput = page.locator('input[test-data="pdf-file-input"]').first();
      await pdfInput.setInputFiles(post.pdf);
      await page.waitForTimeout(1500);

      // เผยแพร่โพสต์
      console.log(`> รอไฟล์อัปโหลดเสร็จสิ้น และกดปุ่มเผยแพร่โพสต์...`);
      const publishBtn = page.locator('button[test-data="publish-post-button"]').or(page.getByRole('button', { name: /โพสต์สรุปความรู้|เผยแพร่/ })).first();
      await publishBtn.waitFor({ state: 'visible', timeout: 60000 });

      let enabled = false;
      for (let retries = 0; retries < 30; retries++) {
        if (await publishBtn.isEnabled()) {
          enabled = true;
          break;
        }
        await page.waitForTimeout(1000);
      }
      if (!enabled) throw new Error('ปุ่มเผยแพร่ไม่เปิดใช้งาน');

      await publishBtn.click();
      console.log(`> กดปุ่ม "โพสต์สรุปความรู้" เรียบร้อยแล้ว`);

      // SweetAlert OK
      const swalOk = page.locator('.swal2-confirm, button:has-text("OK"), button:has-text("ตกลง")').first();
      await swalOk.waitFor({ state: 'visible', timeout: 45000 });
      await swalOk.click();

      // รอ Redirect ไปที่หน้าโพสต์
      await page.waitForURL(/\/post\/(?!edit)[a-zA-Z0-9-]+$/, { timeout: 35000 });
      const publishedUrl = page.url();
      console.log(`✓ โพสต์สำเร็จ! URL: ${publishedUrl}`);

      // รอโหลดเนื้อหาและองค์ประกอบครบถ้วน
      await page.waitForTimeout(2000);

      // บันทึกภาพหน้าจอ
      const shot1 = path.join(screenshotsDir, `post-${postIndex}-success.png`);
      const shot2 = path.join(testResultsScreenshots, `post-${postIndex}-success.png`);
      await page.screenshot({ path: shot1, fullPage: true });
      await page.screenshot({ path: shot2, fullPage: true });

      record.status = 'PUBLISHED';
      record.url = publishedUrl;
      record.screenshot = shot1;
      newSummary.push(record);

      fs.writeFileSync(summaryJsonPath, JSON.stringify(newSummary, null, 2), 'utf8');
      fs.writeFileSync(testResultsJson, JSON.stringify(newSummary, null, 2), 'utf8');
      console.log(`✓ บันทึกผลสำเร็จสำหรับโพสต์ที่ ${postIndex}\n`);
    } catch (err) {
      console.error(`✕ เกิดข้อผิดพลาดในโพสต์ที่ ${postIndex}:`, err.message);
      record.error = err.message;
      newSummary.push(record);
      fs.writeFileSync(summaryJsonPath, JSON.stringify(newSummary, null, 2), 'utf8');
      fs.writeFileSync(testResultsJson, JSON.stringify(newSummary, null, 2), 'utf8');
    }
  }

  await browser.close();
  console.log('=== ดำเนินการอัปเดตและเผยแพร่ใหม่เสร็จสมบูรณ์ทั้ง 6 โพสต์ ===');
})();
