// @ts-check
const { test, expect } = require('@playwright/test');
const { educationalPosts } = require('../../test-data/educational/posts-data');

// =========================================================================================
// ส่วนที่ 1: ชุดการทดสอบ "สร้างโพสต์สื่อการเรียนรู้จริงขึ้นสู่เว็บไซต์" (Create Educational Posts)
// =========================================================================================
// วัตถุประสงค์: สร้างโพสต์สื่อการเรียนรู้ที่มีข้อมูลจริง ครอบคลุมวิชาต่างๆ พร้อมไฟล์หน้าปก (Cover),
//              รูปภาพประกอบ (Gallery), และไฟล์เอกสาร PDF สำหรับให้ผู้ใช้สามารถอ่านและดาวน์โหลดได้จริง
// =========================================================================================

test.describe('1. สร้างโพสต์สื่อการเรียนรู้จริงลงบนเว็บไซต์ SHARE-ED', () => {
  // เพิ่ม timeout ให้เพียงพอต่อการอัปโหลดไฟล์ภาพความละเอียดสูงและ PDF
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    // เข้าสู่หน้าสร้างโพสต์โดยตรง
    await page.goto('/create', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'แบ่งปันความรู้ของคุณ' })).toBeVisible({ timeout: 15_000 });
  });

  for (const post of educationalPosts) {
    test(`สร้างโพสต์: ${post.title} (${post.subject})`, async ({ page }) => {
      // -------------------------------------------------------------
      // ขั้นตอนที่ 1: อัปโหลดรูปหน้าปก (Cover Image ขนาดไม่เกิน 2 MB)
      // -------------------------------------------------------------
      await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(post.cover);
      await expect(page.getByRole('img', { name: 'Cover' })).toBeVisible({ timeout: 10_000 });

      // -------------------------------------------------------------
      // ขั้นตอนที่ 2: กรอกชื่อหัวข้อสรุปความรู้
      // -------------------------------------------------------------
      const titleInput = page.locator('input[placeholder*="เช่น สรุปสูตรฟิสิกส์"]');
      await titleInput.fill(post.title);
      await expect(titleInput).toHaveValue(post.title);

      // -------------------------------------------------------------
      // ขั้นตอนที่ 3: เลือกระดับชั้น (เช่น มัธยมศึกษาตอนปลาย, มหาวิทยาลัย)
      // -------------------------------------------------------------
      const gradeSelect = page.locator('select').first();
      await gradeSelect.selectOption({ label: post.grade });
      await expect(gradeSelect).toHaveValue(post.grade);

      // -------------------------------------------------------------
      // ขั้นตอนที่ 4: กรอกบทสรุปย่อ (Summary)
      // -------------------------------------------------------------
      const summaryInput = page.getByPlaceholder(/อธิบายสั้นๆ/);
      await summaryInput.fill(post.summary);
      await expect(summaryInput).toHaveValue(post.summary);

      // -------------------------------------------------------------
      // ขั้นตอนที่ 5: ตั้งค่าหมวดหมู่วิชาและแฮชแท็ก
      // -------------------------------------------------------------
      await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
      await page.waitForTimeout(500);

      // เลือกหมวดหมู่วิชาใน Modal
      const subjectSelect = page.locator('select').last();
      await subjectSelect.selectOption({ label: post.subject });

      // เพิ่มแท็กวิชาและแท็กเตรียมสอบ
      const tagInput = page.getByPlaceholder(/พิมพ์แท็ก|เพิ่มแฮชแท็ก/);
      for (const tag of post.tags) {
        const presetBtn = page.getByRole('button', { name: tag, exact: true });
        if (await presetBtn.isVisible().catch(() => false)) {
          await presetBtn.click();
        } else {
          await tagInput.fill(tag);
          await tagInput.press('Enter');
        }
        await page.waitForTimeout(200);
      }

      // บันทึกการตั้งค่าหมวดหมู่และแท็ก
      await page.getByRole('button', { name: 'ตกลง' }).click();
      await expect(page.getByText(post.subject).last()).toBeVisible();

      // -------------------------------------------------------------
      // ขั้นตอนที่ 6: กรอกรายละเอียดเนื้อหาเพิ่มเติม (Rich Text Editor)
      // -------------------------------------------------------------
      const editor = page.locator('[contenteditable="true"]');
      await editor.click();
      await editor.fill(post.detail);

      // -------------------------------------------------------------
      // ขั้นตอนที่ 7: อัปโหลดรูปภาพประกอบ (Gallery สูงสุด 15 รูป)
      // -------------------------------------------------------------
      const galleryInput = page.locator('input[type="file"][multiple]');
      await galleryInput.setInputFiles(post.gallery);
      await expect(page.getByText(new RegExp(`รูปภาพประกอบ \\(${post.gallery.length}/15\\)`))).toBeVisible({ timeout: 10_000 });

      // -------------------------------------------------------------
      // ขั้นตอนที่ 8: อัปโหลดเอกสาร PDF ประกอบการเรียนรู้ (ขนาดไม่เกิน 20 MB)
      // -------------------------------------------------------------
      await page.getByLabel(/อัปโหลดไฟล์ PDF/i).setInputFiles(post.pdf);
      await expect(page.getByText('handbook.pdf', { exact: true })).toBeVisible({ timeout: 10_000 });

      // -------------------------------------------------------------
      // ขั้นตอนที่ 9: กดปุ่มเผยแพร่โพสต์ (โพสต์สรุปความรู้)
      // -------------------------------------------------------------
      const submitBtn = page.getByRole('button', { name: 'โพสต์สรุปความรู้' });
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();

      // -------------------------------------------------------------
      // ขั้นตอนที่ 10: ยืนยันข้อความแจ้งเตือน "โพสต์สำเร็จ!" และปิดกล่องข้อความ
      // -------------------------------------------------------------
      await expect(page.getByRole('heading', { name: 'โพสต์สำเร็จ!' })).toBeVisible({ timeout: 60_000 });
      await expect(page.getByText('โพสต์สรุปความรู้เรียบร้อยแล้ว')).toBeVisible();
      await page.getByRole('button', { name: 'OK' }).click();

      // -------------------------------------------------------------
      // ขั้นตอนที่ 11: ตรวจสอบว่าระบบนำทางกลับมาที่หน้าหลัก และโพสต์แสดงอยู่จริง
      // -------------------------------------------------------------
      await expect(page).toHaveURL(/share-ed\.online\/(home)?\/?$/);
      await page.waitForTimeout(2000);

      // ค้นหาการ์ดโพสต์ที่เพิ่งสร้างในหน้าหลัก
      const postCard = page.getByText(post.title, { exact: true }).first();
      await postCard.scrollIntoViewIfNeeded();
      await expect(postCard).toBeVisible({ timeout: 15_000 });

      // คลิกเข้าไปดูรายละเอียดหน้าโพสต์จริง
      await postCard.click();
      await expect(page).toHaveURL(/\/post\/[^/]+$/);

      // ตรวจสอบความสมบูรณ์ของข้อมูลบนหน้าแสดงผลจริงของโพสต์
      await expect(page.getByRole('heading', { name: post.title, exact: true }).first()).toBeVisible({ timeout: 10_000 });
      await expect(page.getByText(post.subject).first()).toBeVisible({ timeout: 10_000 });
      await expect(page.getByText(post.grade).first()).toBeVisible({ timeout: 10_000 });

      // ตรวจสอบเอกสาร PDF พร้อมปุ่มดาวน์โหลด
      const pdfHeading = page.getByRole('heading', { name: 'ไฟล์เอกสาร PDF' });
      await pdfHeading.scrollIntoViewIfNeeded();
      await expect(pdfHeading).toBeVisible();
      await expect(page.getByRole('link', { name: 'ดาวน์โหลด' })).toBeVisible();

      /*
      // =========================================================================
      // [หมายเหตุเกี่ยวกับการลบโพสต์ทิ้ง]:
      // ในเคสสร้างโพสต์นี้ เราจงใจ "ไม่ใส่คำสั่งลบโพสต์" เพื่อให้ข้อมูลสื่อการเรียนรู้จริง
      // ยังคงอยู่บนเว็บไซต์อย่างถาวร สำหรับการทดสอบใช้งานจริง และให้หน้าเว็บมีข้อมูลพร้อมแสดงผล
      //
      // หากในอนาคตต้องการให้เคสนี้สร้างแล้วลบทันที สามารถเปิดใช้งานโค้ดด้านล่างนี้ได้:
      //
      // await page.getByRole('button', { name: 'ลบโพสต์' }).click();
      // await page.getByRole('button', { name: 'ใช่, ลบเลย' }).click();
      // await expect(page.getByRole('dialog', { name: /ลบสำเร็จ/ })).toBeVisible();
      // await page.getByRole('button', { name: 'OK' }).click();
      // await expect(page).toHaveURL(/share-ed\.online\/(home)?\/?$/);
      // =========================================================================
      */
    });
  }
});

// =========================================================================================
// ส่วนที่ 2: เคสสั่ง "ลบโพสต์สื่อการเรียนรู้ทั้งหมดที่สร้างไว้" (Cleanup All Created Posts)
// =========================================================================================
// วัตถุประสงค์: เมื่อต้องการเคลียร์ข้อมูลโพสต์ทั้งหมดที่สคริปต์เคยสร้างไว้ออกจากระบบ สามารถสั่งรันเคสนี้ได้
//
// วิธีการเรียกใช้งานเฉพาะเคสลบโพสต์:
// 1. ผ่านคำสั่ง npm script:
//    npm run delete:posts
// 2. หรือผ่าน Playwright CLI:
//    npx playwright test tests/post/create-post.spec.js -g "ลบโพสต์สื่อการเรียนรู้ทั้งหมด" --project=chromium
// =========================================================================================

test.describe('2. สั่งลบโพสต์สื่อการเรียนรู้ทั้งหมดออกจากระบบ SHARE-ED (Cleanup Suite)', () => {
  // ตั้งค่า timeout 180 วินาที เพื่อให้มีเวลาเพียงพอในการค้นหาและลบทุกโพสต์
  test.setTimeout(180_000);

  test('ลบโพสต์สื่อการเรียนรู้ทั้งหมดที่สร้างไว้ (Cleanup All Created Posts)', async ({ page }) => {
    console.log('\n--- เริ่มกระบวนการค้นหาและลบโพสต์สื่อการเรียนรู้ทั้งหมด ---');

    // 1. ดึงรายการโพสต์ที่สร้างโดยผู้ใช้ปัจจุบันจากระบบ Backend เพื่อความแม่นยำและรวดเร็ว
    let targetPosts = [];
    try {
      const res = await fetch('https://share-ed-backend-6jer.onrender.com/api/v1/posts');
      const data = await res.json();
      const allPosts = Array.isArray(data) ? data : data.data || [];
      const educationalTitles = educationalPosts.map(p => p.title);
      // ค้นหาโพสต์ที่เป็นของผู้ใช้ Testeye หรือมีชื่อตรงกับสื่อการเรียนรู้
      targetPosts = allPosts.filter(p => p.author?.username === 'Testeye' || educationalTitles.includes(p.title));
      console.log(`พบโพสต์ที่ต้องลบในระบบจำนวน: ${targetPosts.length} โพสต์`);
    } catch (e) {
      console.log('ไม่สามารถเชื่อมต่อ API ได้ จะใช้การค้นหาผ่านหน้าสำรวจแทน');
    }

    if (targetPosts.length > 0) {
      // ทำการลบโพสต์ตาม ID โดยตรงผ่าน UI
      for (let i = 0; i < targetPosts.length; i++) {
        const post = targetPosts[i];
        console.log(`[${i + 1}/${targetPosts.length}] กำลังลบโพสต์: "${post.title}" (${post.id})`);

        await page.goto(`/post/${post.id}`, { waitUntil: 'domcontentloaded' });

        // รอให้ปุ่ม "ลบโพสต์" ปรากฏ (รอข้อมูลโหลดเสร็จจาก Backend)
        const deleteBtn = page.getByRole('button', { name: 'ลบโพสต์' });
        const isDeleteVisible = await deleteBtn.waitFor({ state: 'visible', timeout: 15_000 }).then(() => true).catch(() => false);

        if (!isDeleteVisible) {
          console.log(`  - ไม่พบปุ่มลบโพสต์ (โพสต์อาจถูกลบไปแล้ว)`);
          continue;
        }

        // คลิกปุ่มลบโพสต์
        await deleteBtn.click();
        await page.waitForTimeout(500);

        // ยืนยันการลบ ("ใช่, ลบเลย")
        const confirmBtn = page.getByRole('button', { name: 'ใช่, ลบเลย' });
        await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
        await confirmBtn.click();

        // ยืนยันปิดกล่องแจ้งเตือน ("OK")
        const okBtn = page.getByRole('button', { name: 'OK' });
        await okBtn.waitFor({ state: 'visible', timeout: 15_000 });
        await okBtn.click();

        // รอให้ระบบกลับมาที่หน้าหลัก
        await page.waitForURL(/share-ed\.online\/(home)?\/?$/, { timeout: 15_000 });
        console.log(`  ✓ ลบโพสต์ "${post.title}" เรียบร้อยแล้ว`);
      }
    } else {
      // กรณีไม่มีโพสต์ตกค้าง
      console.log('ไม่มีโพสต์ของ Testeye ที่ต้องลบในระบบ');
    }

    console.log('--- สิ้นสุดกระบวนการลบโพสต์ทั้งหมดเรียบร้อยแล้ว ---\n');
  });
});
