// @ts-check
const { test, expect } = require('@playwright/test');
const { images, pdf, images15, images16 } = require('../../test-data/test-data');
// ==============================
// Login Test
// ==============================

test.describe('ทดสอบขั้นตอนการเข้าสู่ระบบ', () => {
  // บังคับไม่ใช้ session เพื่อทดสอบ flow การกดล็อกอินตั้งแต่ต้น
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC-POST01-001: สมาชิกเข้าสู่หน้าสร้างโพสต์', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('member01@test.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('Test1234');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

    // ผลลัพธ์ที่คาดหวัง 1: เข้าสู่ระบบสำเร็จและแสดงหน้าหลัก
    await expect(page).toHaveURL(/share-ed\.online\/(home)?\/?$/);
    await expect(page.getByRole('heading', { name: 'ยินดีต้อนรับสู่ SHARE-ED' })).toBeVisible();

    // ผลลัพธ์ที่คาดหวัง 2: แสดงเมนูสร้างโพสต์หลังเข้าสู่ระบบ
    await expect(page.getByTestId('create-post-btn')).toBeVisible();
    await page.getByTestId('create-post-btn').click();

    // ผลลัพธ์ที่คาดหวัง 3: แสดงหน้าสร้างโพสต์สำเร็จ
    await expect(page).toHaveURL(/share-ed\.online\/create/);
    await expect(page.getByRole('heading', { name: 'แบ่งปันความรู้ของคุณ' })).toBeVisible();
  });
});

// ==============================
// Create Post Tests
// ==============================

test.describe('ทดสอบการสร้างโพสต์', () => {

  test.beforeEach(async ({ page }) => {
    // ก่อนเริ่มแต่ละ Test Case ให้เปิดหน้าเว็บ
    await page.goto('/');

    // เข้าหน้าสร้างโพสต์
    await page.getByTestId('create-post-btn').click();
  });

  test('TC-POST01-002: ตรวจสอบฟิลด์ในหน้าสร้างโพสต์', async ({ page }) => {

    // ถ้า TC นี้ต้องการเข้า /create โดยตรง ด้วยตัวเอง ให้เปิด //awiat ซะ
    //await page.goto('/create');

    await expect(page.getByRole('heading', { name: 'แบ่งปันความรู้ของคุณ' })).toBeVisible();

    // 1. รูปหน้าปก *
    await expect(page.getByText('รูปปก *', { exact: true })).toBeVisible();
    await expect(page.getByText('ไม่เกิน 2 MB', { exact: true }).first()).toBeVisible();
    // 2. ชื่อหัวข้อสรุป *
    await expect(page.getByText(/ชื่อหัวข้อสรุป/i)).toBeVisible();
    // 3. ระดับชั้น *
    await expect(page.getByText('ระดับชั้น *', { exact: true })).toBeVisible();
    // 4. บทสรุปย่อ *
    await expect(page.getByText(/บทสรุปย่อ \(Summary\)/i)).toBeVisible();
    // 5. หมวดหมู่วิชา/แฮชแท็ก *
    await expect(page.getByText(/หมวดหมู่วิชาและแฮชแท็ก/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' })).toBeVisible();
    // 6. รายละเอียดเพิ่มเติม *
    await expect(page.getByText('รายละเอียดเพิ่มเติม *', { exact: true })).toBeVisible();
    // 7. ไฟล์ PDF
    await expect(page.getByText(/ไฟล์เอกสาร PDF/i)).toBeVisible();
    // 8. รูปภาพประกอบ
    await expect(page.getByText(/รูปภาพประกอบ/i)).toBeVisible();
  });

  test('TC-POST01-003: กรอกข้อมูลโพสต์ครบถ้วนและแนบไฟล์', async ({ page }) => {

    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverPng);
    await page.locator('input[placeholder*="เช่น สรุปสูตรฟิสิกส์"]').fill('ทบทวนแคลคูลัส');
    await page.locator('select').first().selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.locator('textarea').fill('สรุปสูตรอนุพันธ์');

    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: '#สรุปย่อ' }).click();
    await page.getByRole('button', { name: 'ตกลง' }).click();

    await page.locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.getByLabel(/อัปโหลดไฟล์ PDF/i).setInputFiles(pdf.normal);
    await page.locator('div').filter({ hasText: /^รูปภาพประกอบ/ }).locator('input[type="file"]').setInputFiles(images.image01);

    await expect(page.locator('input[placeholder*="เช่น สรุปสูตรฟิสิกส์"]')).toHaveValue('ทบทวนแคลคูลัส');
    await expect(page.locator('textarea')).toHaveValue('สรุปสูตรอนุพันธ์');
    await expect(page.locator('[contenteditable="true"]')).toContainText('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await expect(page.getByText(/คณิตศาสตร์/).last()).toBeVisible();
    await expect(page.getByText(/สรุปย่อ/).last()).toBeVisible();
    await expect(page.getByRole('img', { name: 'Cover' })).toBeVisible();
    await expect(page.getByText(/document\.pdf/i)).toBeVisible();
    await expect(page.getByRole('img', { name: 'img-0' })).toBeVisible();
  });

  test('TC-POST01-004: เลือกหมวดหมู่วิชา 1 หมวด', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    // ถ้าจะเปลี่ยนไปใช้  select อันดับอื่น  ใช้ nth() เช่น  locator('select').nth(2)  (คืออันดับที่ 3 เพราะนับ 0,1,2) 
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'ตกลง' }).click();
    await expect(page.getByText('คณิตศาสตร์', { exact: true }).last()).toBeVisible();
  });

  test('TC-POST01-005: แนบรูปหน้าปก PNG', async ({ page }) => {
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverPng);
    await expect(page.getByRole('img', { name: 'Cover' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ลบรูปปก' })).toBeVisible();
  });

  test('TC-POST01-006: แนบรูปหน้าปก JPG', async ({ page }) => {
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverJpg);
    await expect(page.getByRole('img', { name: 'Cover' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ลบรูปปก' })).toBeVisible();
  });

  test('TC-POST01-007: แนบรูปหน้าปกขนาดเท่ากับ 2 MB', async ({ page }) => {
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverPng);
    await expect(page.getByRole('img', { name: 'Cover' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ลบรูปปก' })).toBeVisible();
  });

  test('TC-POST01-008: แนบรูปภาพประกอบ 1 รูป', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^รูปภาพประกอบ/ }).locator('input[type="file"]').setInputFiles(images.image01);

    // 2. ตรวจสอบว่าระบบขึ้นตัวเลขนับ 1/15
    await expect(page.getByText('รูปภาพประกอบ (1/15) *', { exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'img-0' })).toBeVisible();
  });

  test('TC-POST01-009: แนบรูปภาพประกอบครบ 15 รูป', async ({ page }) => {

    await page.locator('input[type="file"][multiple]').setInputFiles(images15);
    // 1. ตรวจสอบว่าระบบขึ้นตัวเลขนับ 15/15
    await expect(page.getByText('รูปภาพประกอบ (15/15) *', { exact: true })).toBeVisible();
    // 2. ตรวจว่ารูปแรก (img-0) และรูปสุดท้าย (img-14) แสดงบนหน้าจอ
    await expect(page.getByRole('img', { name: 'img-0' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'img-14' })).toBeVisible();

  });

  test('TC-POST01-010: แนบไฟล์ PDF 1 ไฟล์', async ({ page }) => {
    await page.getByLabel(/อัปโหลดไฟล์ PDF/i).setInputFiles(pdf.normal);
    await expect(page.getByText(/document\.pdf/i)).toBeVisible();
  });

  test('TC-POST01-011: แนบไฟล์ PDF ขนาดเท่ากับ 20 MB', async ({ page }) => {
    await page.getByLabel(/อัปโหลดไฟล์ PDF/i).setInputFiles(pdf.size20MB);
    await expect(page.getByText(/document-20mb\.pdf/i)).toBeVisible();
  });

  test('TC-POST01-012: ไม่กรอกชื่อหัวข้อสรุป', async ({ page }) => {
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverPng);
    await page.locator('select').first().selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.locator('textarea').fill('สรุปสูตรอนุพันธ์');
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'ตกลง' }).click();
    await page.locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.locator('div').filter({ hasText: /^รูปภาพประกอบ/ }).locator('input[type="file"]').setInputFiles(images.image01);
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();
    await expect(page.locator('input[placeholder*="เช่น สรุปสูตรฟิสิกส์"]')).toHaveValue('');
    // expect error when title is empty
    await expect(page.getByText('กรุณากรอกชื่อหัวข้อสรุปความรู้')).toBeVisible();
    // stay at create post page
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-013: ไม่เลือกระดับชั้น', async ({ page }) => {
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverPng);
    await page.locator('input[placeholder*="เช่น สรุปสูตรฟิสิกส์"]').fill('ทบทวนแคลคูลัส');
    await page.locator('textarea').fill('สรุปสูตรอนุพันธ์');
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'ตกลง' }).click();
    await page.locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.locator('div').filter({ hasText: /^รูปภาพประกอบ/ }).locator('input[type="file"]').setInputFiles(images.image01);
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();
    await expect(page.locator('select').first()).toHaveValue('');
    await expect(page.getByText('กรุณาเลือกระดับชั้น')).toBeVisible();
    // stay at create post page
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-014: ไม่กรอกบทสรุปย่อ', async ({ page }) => {
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverPng);
    await page.locator('input[placeholder*="เช่น สรุปสูตรฟิสิกส์"]').fill('ทบทวนแคลคูลัส');
    await page.locator('select').first().selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'ตกลง' }).click();
    await page.locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.locator('div').filter({ hasText: /^รูปภาพประกอบ/ }).locator('input[type="file"]').setInputFiles(images.image01);
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();
    await expect(page.locator('textarea')).toHaveValue('');
    await expect(page.getByText('กรุณากรอกบทสรุปย่อ')).toBeVisible();
    // stay at create post page
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-015: ไม่เลือกหมวดหมู่วิชา', async ({ page }) => {

    // 1. อัปโหลดรูปหน้าปก (เจาะจงกล่องรูปปก ไม่เข้า Editor)
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverPng);
    // 2. ชื่อหัวข้อสรุป
    await page.locator('input[placeholder*="เช่น สรุปสูตรฟิสิกส์"]').fill('ทบทวนแคลคูลัส');
    // 3. ระดับชั้น
    await page.locator('select').first().selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    // 4. บทสรุปย่อ
    await page.locator('textarea').fill('สรุปสูตรอนุพันธ์');
    // 5. ไม่เลือกหมวดหมู่วิชา (ข้ามการตั้งค่าวิชา)
    // 6. รายละเอียดเพิ่มเติม
    await page.locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    // 7. รูปภาพประกอบ (เจาะจงโซนรูปภาพประกอบด้านล่าง)
    await page.locator('div').filter({ hasText: /^รูปภาพประกอบ/ }).locator('input[type="file"]').setInputFiles(images.image01);

    // 8. โพสต์สรุปความรู้
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();

    await expect(page.getByText('กรุณาเลือกหมวดหมู่วิชา').last()).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-016: ไม่กรอกรายละเอียดเพิ่มเติม', async ({ page }) => {

    // 1. อัปโหลดรูปหน้าปก (เจาะจงกล่องรูปปก ไม่เข้า Editor)
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverPng);
    // 2. ชื่อหัวข้อสรุป
    await page.locator('input[placeholder*="เช่น สรุปสูตรฟิสิกส์"]').fill('ทบทวนแคลคูลัส');
    // 3. ระดับชั้น
    await page.locator('select').first().selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    // 4. บทสรุปย่อ
    await page.locator('textarea').fill('สรุปสูตรอนุพันธ์');
    // 5. ตั้งค่าหมวดหมู่วิชา
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'ตกลง' }).click();
    // 6. ไม่กรอกรายละเอียดเพิ่มเติม (เว้น [contenteditable="true"] ไว้)
    // 7. รูปภาพประกอบ (เจาะจงโซนรูปภาพประกอบด้านล่าง)
    await page.locator('div').filter({ hasText: /^รูปภาพประกอบ/ }).locator('input[type="file"]').setInputFiles(images.image01);

    // 8. โพสต์สรุปความรู้
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();

    await expect(page.getByText('กรุณากรอกรายละเอียดเพิ่มเติม')).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });


  test('TC-POST01-017: ไม่แนบรูปหน้าปก', async ({ page }) => {

    // กรอกข้อมูลอื่นครบถ้วน โดยไม่แนบรูปหน้าปก (ไม่ใส่ cover.png)
    await page.locator('input[placeholder*="เช่น สรุปสูตรฟิสิกส์"]').fill('ทบทวนแคลคูลัส');
    await page.locator('select').first().selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.locator('textarea').fill('สรุปสูตรอนุพันธ์');
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'ตกลง' }).click();
    await page.locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.locator('input[type="file"][multiple]').setInputFiles(images.image01);

    // คลิกโพสต์สรุปความรู้
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();

    // ตรวจสอบข้อความแจ้งเตือนและระบบไม่เผยแพร่โพสต์
    await expect(page.getByText(/กรุณาอัปโหลดรูปภาพหน้าปก/i)).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-018: รูปหน้าปกมีขนาดเกิน 2 MB', async ({ page }) => {
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverOver2MB);
    await expect(page.getByText('คลิกเพื่ออัปโหลดรูปปก', { exact: true })).toBeVisible();
    await expect(page.getByText('cover-over-2mb.png', { exact: true })).toHaveCount(0);
    await expect(page.getByText('รูปปกต้องมีขนาดไม่เกิน 2 MB')).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-019: รูปภาพประกอบมีขนาดเกิน 2 MB', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^รูปภาพประกอบ/ }).locator('input[type="file"]').setInputFiles(images.imageOver2MB);
    await expect(page.getByText('รูปภาพประกอบ (0/15) *', { exact: true })).toBeVisible();
    await expect(page.getByText('image-over-2mb.png', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('รูปภาพประกอบต้องมีขนาดไม่เกิน 2 MB');
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-020: ไฟล์ PDF มีขนาดเกิน 20 MB', async ({ page }) => {
    await page.getByLabel(/อัปโหลดไฟล์ PDF/i).setInputFiles(pdf.over20MB);
    await expect(page.getByText('อัปโหลดไฟล์ PDF', { exact: true })).toBeVisible();
    await expect(page.getByText('document-over-20mb.pdf', { exact: true })).toHaveCount(0);
    await expect(page.getByText('ไฟล์ PDF ต้องมีขนาดไม่เกิน 20 MB')).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-021: รูปหน้าปกเป็นไฟล์ผิดประเภท', async ({ page }) => {
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.imageGif);
    await expect(page.getByText('คลิกเพื่ออัปโหลดรูปปก', { exact: true })).toBeVisible();
    await expect(page.getByText('image01.gif', { exact: true })).toHaveCount(0);
    await expect(page.getByText('สามารถอัปโหลดไฟล์ .jpg,.jpeg,.png เท่านั้น')).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-022: รูปภาพประกอบเป็นไฟล์ผิดประเภท', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^รูปภาพประกอบ/ }).locator('input[type="file"]').setInputFiles(images.imageGif);
    await expect(page.getByText('รูปภาพประกอบ (0/15) *', { exact: true })).toBeVisible();
    await expect(page.getByText('image01.gif', { exact: true })).toHaveCount(0);
    await expect(page.getByText('สามารถอัปโหลดไฟล์ .jpg,.jpeg,.png เท่านั้น')).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-023: เลือกไฟล์ที่ไม่ใช่ PDF', async ({ page }) => {
    await page.getByLabel(/อัปโหลดไฟล์ PDF/i).setInputFiles(pdf.docx);
    await expect(page.getByText('อัปโหลดไฟล์ PDF', { exact: true })).toBeVisible();
    await expect(page.getByText('document.docx', { exact: true })).toHaveCount(0);
    await expect(page.getByText('สามารถอัปโหลดไฟล์ .pdf เท่านั้น')).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-024: แนบรูปภาพประกอบรูปที่ 16', async ({ page }) => {
    await page.locator('input[type="file"][multiple]').setInputFiles(images16);
    await expect(page.getByText('รูปภาพประกอบ (15/15) *', { exact: true })).toBeVisible();
    await expect(page.getByText('คุณสามารถอัปโหลดรูปภาพประกอบได้สูงสุด 15 รูปเท่านั้น', { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-025: เพิ่มแท็กภาษาไทย', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).fill('#เรียนรู้');
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).press('Enter');
    await expect(page.getByText('#เรียนรู้', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-026: เพิ่มแท็กภาษาอังกฤษ', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).fill('#Learning');
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).press('Enter');
    await expect(page.getByText('#Learning', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-027: เพิ่มแท็กที่มีตัวเลข', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).fill('#Math123');
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).press('Enter');
    await expect(page.getByText('#Math123', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-028: ระบบเติมเครื่องหมาย # ให้แท็กอัตโนมัติ', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).fill('เรียนรู้');
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).press('Enter');
    await expect(page.getByText('#เรียนรู้', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-029: แท็กมีเครื่องหมาย # อยู่แล้ว', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).fill('#เรียนรู้');
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).press('Enter');
    await expect(page.getByText('##เรียนรู้', { exact: true })).toHaveCount(0);
    await expect(page.getByText('#เรียนรู้', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-030: เพิ่มแท็กครบ 3 แท็ก', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });

    // 1. กรอกและกด Enter ทีละแท็ก
    const tagInput = page.getByPlaceholder(/พิมพ์แท็ก|เพิ่มแฮชแท็ก/);
    await tagInput.fill('#คณิต');
    await tagInput.press('Enter');
    await tagInput.fill('#ม6');
    await tagInput.press('Enter');
    await tagInput.fill('#เรียนรู้');
    await tagInput.press('Enter');

    // 2. กดปุ่ม "ตกลง" เพื่อบันทึกและปิด Modal
    await page.getByRole('button', { name: 'ตกลง' }).click();

    // 3. ตรวจสอบว่าทั้ง 3 แท็กแสดงบนหน้าฟอร์มหลักเรียบร้อย 
    await expect(page.getByText('#คณิต', { exact: true })).toBeVisible();
    await expect(page.getByText('#ม6', { exact: true })).toBeVisible();
    await expect(page.getByText('#เรียนรู้', { exact: true })).toBeVisible();
  });


  test('TC-POST01-031: เพิ่มแท็กรายการที่ 4', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    const tagInput = page.getByPlaceholder(/พิมพ์แท็ก|เพิ่มแฮชแท็ก/);
    await tagInput.fill('#คณิต');
    await tagInput.press('Enter');
    await tagInput.fill('#ม6');
    await tagInput.press('Enter');
    await tagInput.fill('#เรียนรู้');
    await tagInput.press('Enter');
    await tagInput.fill('#โจทย์');
    await tagInput.press('Enter');
    await expect(page.getByText(/ไม่สามารถเพิ่ม(แท็ก)?เกิน 3 อัน/i)).toBeVisible();
    await expect(page.getByText('#โจทย์', { exact: true })).toHaveCount(0);
  });

  test('TC-POST01-032: แท็กมีเครื่องหมายขีดกลาง', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).fill('#QA-Test');
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).press('Enter');
    await expect(page.getByText('#QA-Test', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/แท็กต้องไม่มีอักษรพิเศษ/i)).toBeVisible();
  });

  test('TC-POST01-033: แท็กมีเครื่องหมายขีดล่าง', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).fill('#QA_Test');
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).press('Enter');
    await expect(page.getByText('#QA_Test', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/แท็กต้องไม่มีอักษรพิเศษ/i)).toBeVisible();
  });

  test('TC-POST01-034: แท็กมีเครื่องหมาย @', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).fill('#QA@Test');
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).press('Enter');
    await expect(page.getByText('#QA@Test', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/แท็กต้องไม่มีอักษรพิเศษ/i)).toBeVisible();
  });

  test('TC-POST01-035: แท็กมีความยาว 10 ตัวอักษร', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).fill('#1234567890');
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).press('Enter');
    await expect(page.getByText('#1234567890', { exact: true }).first()).toBeVisible(); // ใช้ .first เพื่อตรวจ element ตัวแรกที่ปรากฎบนหน้าจอ เพื่อหา #1234567890 ให้เจอ
  });

  test('TC-POST01-036: แท็กมีความยาว 11 ตัวอักษร', async ({ page }) => {
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).fill('#12345678901');
    await page.getByRole('textbox', { name: 'พิมพ์แท็กที่ต้องการแล้วกด Enter หรือ Space...' }).press('Enter');
    await expect(page.getByText('#12345678901', { exact: true })).toHaveCount(0);
    await expect(page.getByText('แท็กต้องมีความยาวไม่เกิน 10 ตัวอักษร', { exact: true })).toBeVisible();
  });

  test('TC-POST01-037: แนบไฟล์ PDF จำนวน 1 ไฟล์', async ({ page }) => {
    await page.getByLabel(/อัปโหลดไฟล์ PDF/i).setInputFiles(pdf.normal);
    await expect(page.getByText('document.pdf', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ลบไฟล์ PDF' })).toBeVisible();
  });

  test('TC-POST01-038: เผยแพร่โพสต์สำเร็จเมื่อกรอกข้อมูลครบถ้วน', async ({ page }) => {
    test.setTimeout(120_000);
    const postTitle = `TC-POST01-039 ทบทวนแคลคูลัส ${Date.now()}`;
    await page.getByLabel(/คลิกเพื่ออัปโหลดรูปปก/i).setInputFiles(images.coverPng);
    await page.locator('input[placeholder*="เช่น สรุปสูตรฟิสิกส์"]').fill(postTitle);
    await page.locator('select').first().selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.locator('textarea').fill('สรุปสูตรอนุพันธ์');
    await page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).click();
    await page.locator('select').last().selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: '#สรุปย่อ' }).click();
    await page.getByRole('button', { name: 'ตกลง' }).click();
    await page.locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.locator('div').filter({ hasText: /^รูปภาพประกอบ/ }).locator('input[type="file"]').setInputFiles(images.image01);
    await page.getByLabel(/อัปโหลดไฟล์ PDF/i).setInputFiles(pdf.normal);
    await page.getByRole('button', { name: 'โพสต์สรุปความรู้' }).click();
    await expect(page.getByRole('heading', { name: 'โพสต์สำเร็จ!' })).toBeVisible({ timeout: 60000 });
    await expect(page.getByText('โพสต์สรุปความรู้เรียบร้อยแล้ว')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page).toHaveURL(/\/home\/?$/);
    await expect(page.getByRole('heading', { name: 'โพสต์สำเร็จ!' })).toBeHidden();

    try {
      const createdPost = page.getByText(postTitle, { exact: true }).first();
      await createdPost.scrollIntoViewIfNeeded();
      await expect(createdPost).toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(1000);
      await createdPost.click();
      await expect(page).toHaveURL(/\/post\/[^/]+$/);

      // ตรวจชื่อ หมวดวิชา และระดับชั้น
      await expect(page.getByRole('heading', { name: postTitle, exact: true })).toBeVisible();
      await expect(page.locator('main').getByText('คณิตศาสตร์', { exact: true }).first()).toBeVisible();
      await expect(page.locator('main').getByText('มัธยมศึกษาตอนปลาย', { exact: true }).first()).toBeVisible();
      await page.waitForTimeout(1000);

      // เลื่อนลงไปตรวจบทสรุปย่อ
      const summary = page.getByText('สรุปสูตรอนุพันธ์', { exact: true });
      await summary.scrollIntoViewIfNeeded();
      await expect(summary).toBeVisible();
      await page.waitForTimeout(1000);

      // เลื่อนลงไปตรวจรายละเอียดเพิ่มเติม
      const detail = page.getByText('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์', { exact: true });
      await detail.scrollIntoViewIfNeeded();
      await expect(detail).toBeVisible();
      await page.waitForTimeout(1000);

      // เลื่อนลงไปตรวจรูปภาพประกอบ
      const galleryImage = page.getByRole('img', { name: 'gallery-0' });
      await galleryImage.scrollIntoViewIfNeeded();
      await expect(galleryImage).toBeVisible();
      await page.waitForTimeout(1000);

      // เลื่อนลงไปตรวจไฟล์ PDF
      const pdfHeading = page.getByRole('heading', { name: 'ไฟล์เอกสาร PDF' });
      await pdfHeading.scrollIntoViewIfNeeded();
      await expect(pdfHeading).toBeVisible();
      await expect(page.getByText('document.pdf', { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'ดาวน์โหลด' })).toHaveAttribute('href', /\.pdf$/);
      await page.waitForTimeout(1000);

      // เลื่อนลงไปตรวจแฮชแท็ก
      const tag = page.getByText('#สรุปย่อ', { exact: true });
      await tag.scrollIntoViewIfNeeded();
      await expect(tag).toBeVisible();
      await page.waitForTimeout(1000);
    } finally {
      // กลับหน้าแรกและค้นหาโพสต์จากชื่อที่สร้างในเคสนี้
      await page.goto('/home');
      const postToDelete = page.getByText(postTitle, { exact: true }).first();
      await expect(postToDelete).toBeVisible({ timeout: 15_000 });
      await postToDelete.click();
      await expect(page).toHaveURL(/\/post\/[^/]+$/);

      // ลบโพสต์
      await page.getByRole('button', { name: 'ลบโพสต์' }).click();
      await expect(page.getByRole('dialog', { name: /คุณต้องการลบโพสต์/ })).toBeVisible();
      await expect(page.getByText(`คุณต้องการลบโพสต์ "${postTitle}" ใช่หรือไม่?`)).toBeVisible();
      await page.getByRole('button', { name: 'ใช่, ลบเลย' }).click();

      // ตรวจข้อความลบสำเร็จ
      await expect(page.getByRole('dialog', { name: /ลบสำเร็จ/ })).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('โพสต์และไฟล์ที่เกี่ยวข้องถูกลบถาวรแล้ว')).toBeVisible();
      await page.getByRole('button', { name: 'OK' }).click();

      // ตรวจว่าโพสต์ที่ลบหายไปจากหน้าสำรวจแล้ว
      await expect(page).toHaveURL(/\/home\/?$/);
      await page.reload();
      await page.keyboard.press('Home');
      await page.waitForTimeout(1000);
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(5000);
      await page.reload();
      await expect(page.getByText(postTitle, { exact: true })
      ).toHaveCount(0, { timeout: 15000 });

      await page.waitForTimeout(15000);
      await page.reload();
    }
  });
});
