// @ts-check
const { test, expect } = require('./post-helpers');
const { test: baseTest } = require('@playwright/test');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { images, pdf, images05, images06, generateUniqueTitle } = require('../../test-data/test-data');
// ==============================
// Login Test
// ==============================

test.describe('ทดสอบขั้นตอนการเข้าสู่ระบบ', () => {
  // บังคับไม่ใช้ session เพื่อทดสอบ flow การกดล็อกอินตั้งแต่ต้น
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC-POST01-001: สมาชิกเข้าสู่หน้าสร้างโพสต์', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    const account = process.env.CI
      ? { email: process.env.MEMBER_EMAIL, password: process.env.MEMBER_PASSWORD }
      : require('../../test-account.local.json');
    if (!account.email || !account.password) throw new Error('Missing test account credentials');
    await page.getByRole('textbox', { name: 'อีเมล' }).fill(account.email);
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill(account.password);
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

    // ผลลัพธ์ที่คาดหวัง 1: เข้าสู่ระบบสำเร็จและแสดงหน้าหลัก
    await expect(page).toHaveURL(/\/home\/?$/, { timeout: 20_000 });
    await expect(page.getByRole('heading', { name: 'ยินดีต้อนรับสู่ SHARE-ED' })).toBeVisible();

    // ผลลัพธ์ที่คาดหวัง 2: แสดงเมนูสร้างโพสต์หลังเข้าสู่ระบบ
    await expect(page.getByTestId('create-post-button')).toBeVisible();
    await page.getByTestId('create-post-button').click();

    // ผลลัพธ์ที่คาดหวัง 3: แสดงหน้าสร้างโพสต์สำเร็จ
    await expect(page).toHaveURL(/\/create\/?$/, { timeout: 20_000 });
    await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();
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
    await page.getByTestId('create-post-button').click();
  });

  test('TC-POST01-002: ตรวจสอบฟิลด์ในหน้าสร้างโพสต์', async ({ page }) => {

    // ถ้า TC นี้ต้องการเข้า /create โดยตรง ด้วยตัวเอง ให้เปิด //awiat ซะ
    //await page.goto('/create');

    await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();

    // ตรวจสอบฟิลด์อินพุตและปุ่มหลักด้วย test-data
    await expect(page.getByTestId('cover-file-input')).toBeAttached();
    await expect(page.getByTestId('post-title-input')).toBeVisible();
    await expect(page.getByTestId('education-level-select')).toBeVisible();
    await expect(page.getByTestId('post-summary-input')).toBeVisible();
    await expect(page.getByTestId('category-tags-settings-button')).toBeVisible();
    await expect(page.getByTestId('post-content-input')).toBeVisible();
    await expect(page.getByTestId('pdf-file-input')).toBeAttached();
    await expect(page.getByTestId('supporting-images-file-input')).toBeAttached();
    await expect(page.getByTestId('cancel-create-post-button')).toBeVisible();
    await expect(page.getByTestId('save-draft-button')).toBeVisible();
    await expect(page.getByTestId('publish-post-button')).toBeVisible();

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
    await expect(page.getByTestId('category-tags-settings-button')).toBeVisible();
    // 6. รายละเอียดเพิ่มเติม *
    await expect(page.getByText('รายละเอียดเพิ่มเติม *', { exact: true })).toBeVisible();
    // 7. ไฟล์ PDF
    await expect(page.getByText(/ไฟล์เอกสาร PDF/i)).toBeVisible();
    // 8. รูปภาพประกอบ
    await expect(page.getByText(/รูปภาพประกอบ/i)).toBeVisible();
  });

  test('TC-POST01-003: กรอกข้อมูลโพสต์ครบถ้วนและแนบไฟล์', async ({ page }) => {

    await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
    await page.getByTestId('post-title-input').fill('ทบทวนแคลคูลัส');
    await page.getByTestId('education-level-select').selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.getByTestId('post-summary-input').fill('สรุปสูตรอนุพันธ์');
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: '#สรุปย่อ', exact: true }).click();
    await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
    await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.getByTestId('pdf-file-input').setInputFiles(pdf.normal);
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);
    await expect(page.getByTestId('post-title-input')).toHaveValue('ทบทวนแคลคูลัส');
    await expect(page.getByTestId('post-summary-input')).toHaveValue('สรุปสูตรอนุพันธ์');
    await expect(page.getByTestId('post-content-input').locator('[contenteditable="true"]')).toContainText('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await expect(page.getByText(/คณิตศาสตร์/).last()).toBeVisible();
    await expect(page.getByText(/สรุปย่อ/).last()).toBeVisible();
    await expect(page.getByRole('img', { name: 'Cover' })).toBeVisible();
    await expect(page.getByText(/document\.pdf/i)).toBeVisible();
    await expect(page.getByRole('img', { name: 'img-0' })).toBeVisible();
  });

  test('TC-POST01-004: เลือกหมวดหมู่วิชา 1 หมวด', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
    await expect(page.getByText('คณิตศาสตร์', { exact: true }).last()).toBeVisible();
    await expect(page.getByText('คณิตศาสตร์', { exact: true })).toHaveCount(1);
  });

  test('TC-POST01-005: แนบรูปหน้าปก PNG', async ({ page }) => {
    await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
    await expect(page.getByRole('img', { name: 'Cover' })).toBeVisible();
    await expect.poll(() => page.getByRole('img', { name: 'Cover' }).evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByTestId('remove-cover-button')).toBeVisible();
  });

  test('TC-POST01-006: แนบรูปหน้าปก JPG', async ({ page }) => {
    await page.getByTestId('cover-file-input').setInputFiles(images.coverJpg);
    await expect(page.getByRole('img', { name: 'Cover' })).toBeVisible();
    await expect.poll(() => page.getByRole('img', { name: 'Cover' }).evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByTestId('remove-cover-button')).toBeVisible();
  });

  test('TC-POST01-007: แนบรูปหน้าปกขนาดเท่ากับ 2 MB', async ({ page }) => {
    await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
    await expect(page.getByRole('img', { name: 'Cover' })).toBeVisible();
    await expect.poll(() => page.getByRole('img', { name: 'Cover' }).evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByTestId('remove-cover-button')).toBeVisible();
  });

  test('TC-POST01-008: แนบรูปภาพประกอบ 1 รูป', async ({ page }) => {
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);
    // 2. ตรวจสอบว่าระบบขึ้นตัวเลขนับ 1/5
    await expect(page.getByText('รูปภาพประกอบ (1/5) *', { exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'img-0' })).toBeVisible();
    await expect(page.getByTestId('remove-supporting-image-button-0')).toBeVisible();
  });

  test('TC-POST01-009: แนบรูปภาพประกอบครบ 5 รูป', async ({ page }) => {

    await page.getByTestId('supporting-images-file-input').setInputFiles(images05);
    // 1. ตรวจสอบว่าระบบขึ้นตัวเลขนับ 5/5
    await expect(page.getByText('รูปภาพประกอบ (5/5) *', { exact: true })).toBeVisible();
    // ตรวจพรีวิวและปุ่มนำออกของทุกรูปตาม Expected Result ในชีท
    for (let index = 0; index < 5; index++) {
      const preview = page.getByRole('img', { name: `img-${index}`, exact: true });
      await expect(preview).toBeVisible();
      await expect.poll(() => preview.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
      await expect(page.getByTestId(`remove-supporting-image-button-${index}`)).toBeVisible();
    }

  });

  test('TC-POST01-010: แนบไฟล์ PDF 1 ไฟล์', async ({ page }) => {
    await page.getByTestId('pdf-file-input').setInputFiles(pdf.normal);
    await expect(page.getByText(/document\.pdf/i)).toBeVisible();
  });

  test('TC-POST01-011: แนบไฟล์ PDF ขนาดเท่ากับ 20 MB', async ({ page }) => {
    await page.getByTestId('pdf-file-input').setInputFiles(pdf.size20MB);
    await expect(page.getByText(/document-20mb\.pdf/i)).toBeVisible();
  });

  test('TC-POST01-012: ไม่กรอกชื่อหัวข้อสรุป', async ({ page }) => {
    await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
    await page.getByTestId('education-level-select').selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.getByTestId('post-summary-input').fill('สรุปสูตรอนุพันธ์');
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
    await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);
    await page.getByTestId('publish-post-button').click();
    await expect(page.getByTestId('post-title-input')).toHaveValue('');
    // expect error when title is empty
    await expect(page.getByText('กรุณากรอกชื่อหัวข้อสรุปความรู้')).toBeVisible();
    // stay at create post page
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-013: ไม่เลือกระดับชั้น', async ({ page }) => {
    await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
    await page.getByTestId('post-title-input').fill('ทบทวนแคลคูลัส');
    await page.getByTestId('post-summary-input').fill('สรุปสูตรอนุพันธ์');
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
    await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);
    await page.getByTestId('publish-post-button').click();
    await expect(page.getByTestId('education-level-select')).toHaveValue('');
    await expect(page.getByText('กรุณาเลือกระดับชั้น')).toBeVisible();
    // stay at create post page
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-014: ไม่กรอกบทสรุปย่อ', async ({ page }) => {
    await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
    await page.getByTestId('post-title-input').fill('ทบทวนแคลคูลัส');
    await page.getByTestId('education-level-select').selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
    await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);
    await page.getByTestId('publish-post-button').click();
    await expect(page.getByTestId('post-summary-input')).toHaveValue('');
    await expect(page.getByText('กรุณากรอกบทสรุปย่อ')).toBeVisible();
    // stay at create post page
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-015: ไม่เลือกหมวดหมู่วิชา', async ({ page }) => {

    // 1. อัปโหลดรูปหน้าปก (เจาะจงกล่องรูปปก ไม่เข้า Editor)
    await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
    // 2. ชื่อหัวข้อสรุป
    await page.getByTestId('post-title-input').fill('ทบทวนแคลคูลัส');
    // 3. ระดับชั้น
    await page.getByTestId('education-level-select').selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    // 4. บทสรุปย่อ
    await page.getByTestId('post-summary-input').fill('สรุปสูตรอนุพันธ์');
    // 5. ไม่เลือกหมวดหมู่วิชา (ข้ามการตั้งค่าวิชา)
    // 6. รายละเอียดเพิ่มเติม
    await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    // 7. รูปภาพประกอบ (เจาะจงโซนรูปภาพประกอบด้านล่าง)
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);

    // 8. โพสต์สรุปความรู้
    await page.getByTestId('publish-post-button').click();

    await expect(page.getByText('กรุณาเลือกหมวดหมู่วิชา').last()).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-016: ไม่กรอกรายละเอียดเพิ่มเติม', async ({ page }) => {

    // 1. อัปโหลดรูปหน้าปก (เจาะจงกล่องรูปปก ไม่เข้า Editor)
    await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
    // 2. ชื่อหัวข้อสรุป
    await page.getByTestId('post-title-input').fill('ทบทวนแคลคูลัส');
    // 3. ระดับชั้น
    await page.getByTestId('education-level-select').selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    // 4. บทสรุปย่อ
    await page.getByTestId('post-summary-input').fill('สรุปสูตรอนุพันธ์');
    // 5. ตั้งค่าหมวดหมู่วิชา
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
    // 6. ไม่กรอกรายละเอียดเพิ่มเติม (เว้น [contenteditable="true"] ไว้)
    // 7. รูปภาพประกอบ (เจาะจงโซนรูปภาพประกอบด้านล่าง)
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);

    // 8. โพสต์สรุปความรู้
    await page.getByTestId('publish-post-button').click();

    await expect(page.getByText('กรุณากรอกรายละเอียดเพิ่มเติม')).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });


  test('TC-POST01-017: ไม่แนบรูปหน้าปก', async ({ page }) => {

    // กรอกข้อมูลอื่นครบถ้วน โดยไม่แนบรูปหน้าปก (ไม่ใส่ cover.png)
    await page.getByTestId('post-title-input').fill('ทบทวนแคลคูลัส');
    await page.getByTestId('education-level-select').selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.getByTestId('post-summary-input').fill('สรุปสูตรอนุพันธ์');

    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
    await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);

    // คลิกโพสต์สรุปความรู้
    await page.getByTestId('publish-post-button').click();

    // ตรวจสอบข้อความแจ้งเตือนและระบบไม่เผยแพร่โพสต์
    await expect(page.getByText(/กรุณาอัปโหลดรูปภาพหน้าปก/i)).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-018: รูปหน้าปกมีขนาดเกิน 2 MB', async ({ page }) => {
    await page.getByTestId('cover-file-input').setInputFiles(images.coverOver2MB);
    await expect(page.getByText('คลิกเพื่ออัปโหลดรูปปก', { exact: true })).toBeVisible();
    await expect(page.getByText('cover-over-2mb.png', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('รูปหน้าปกต้องมีขนาดไม่เกิน 2 MB');
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-019: รูปภาพประกอบมีขนาดเกิน 2 MB', async ({ page }) => {
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.imageOver2MB);
    await expect(page.getByText('รูปภาพประกอบ (0/5) *', { exact: true })).toBeVisible();
    await expect(page.getByText('image-over-2mb.png', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('รูปภาพประกอบต้องมีขนาดไม่เกิน 2 MB');
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-020: ไฟล์ PDF มีขนาดเกิน 20 MB', async ({ page }) => {
    await page.getByTestId('pdf-file-input').setInputFiles(pdf.over20MB);
    await expect(page.getByText('อัปโหลดไฟล์ PDF', { exact: true })).toBeVisible();
    await expect(page.getByText('document-over-20mb.pdf', { exact: true })).toHaveCount(0);
    await expect(page.getByText('ไฟล์ PDF ต้องไม่เกิน 20 MB')).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-021: รูปหน้าปกเป็นไฟล์ผิดประเภท', async ({ page }) => {
    await page.getByTestId('cover-file-input').setInputFiles(images.imageGif);
    await expect(page.getByText('คลิกเพื่ออัปโหลดรูปปก', { exact: true })).toBeVisible();
    await expect(page.getByText('image01.gif', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('รูปภาพหน้าปกต้องเป็นไฟล์ .jpg, .jpeg, .png, .apng เท่านั้น');
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-022: รูปภาพประกอบเป็นไฟล์ผิดประเภท', async ({ page }) => {
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.imageGif);
    await expect(page.getByText('รูปภาพประกอบ (0/5) *', { exact: true })).toBeVisible();
    await expect(page.getByText('image01.gif', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('รูปภาพต้องเป็นไฟล์ .jpg, .jpeg, .png, .apng เท่านั้น');
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-023: เลือกไฟล์ที่ไม่ใช่ PDF', async ({ page }) => {
    await page.getByTestId('pdf-file-input').setInputFiles(pdf.docx);
    await expect(page.getByText('อัปโหลดไฟล์ PDF', { exact: true })).toBeVisible();
    await expect(page.getByText('document.docx', { exact: true })).toHaveCount(0);
    await expect(page.getByText('ไฟล์นี้ไม่ใช่ PDF ที่ถูกต้อง')).toBeVisible();
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-024: แนบรูปภาพประกอบรูปที่ 6', async ({ page }) => {
    await page.getByTestId('supporting-images-file-input').setInputFiles(images06);
    await expect(page.getByRole('status')).toContainText('อัปโหลดรูปภาพประกอบได้สูงสุด 5 รูป');
    await expect(page.getByText('รูปภาพประกอบ (5/5) *', { exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: /^img-\d+$/ })).toHaveCount(5);
    await expect(page.getByRole('img', { name: 'img-5', exact: true })).toHaveCount(0);
    await expect(page).toHaveURL(/\/create/);
  });

  test('TC-POST01-025: เพิ่มแท็กภาษาไทย', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByTestId('hashtag-input').fill('#เรียนรู้');
    await page.getByTestId('hashtag-input').press('Enter');
    await expect(page.getByText('#เรียนรู้', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-026: เพิ่มแท็กภาษาอังกฤษ', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByTestId('hashtag-input').fill('#Learning');
    await page.getByTestId('hashtag-input').press('Enter');
    await expect(page.getByText('#Learning', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-027: เพิ่มแท็กที่มีตัวเลข', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByTestId('hashtag-input').fill('#Math123');
    await page.getByTestId('hashtag-input').press('Enter');
    await expect(page.getByText('#Math123', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-028: ระบบเติมเครื่องหมาย # ให้แท็กอัตโนมัติ', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByTestId('hashtag-input').fill('เรียนรู้');
    await page.getByTestId('hashtag-input').press('Enter');
    await expect(page.getByText('#เรียนรู้', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-029: แท็กมีเครื่องหมาย # อยู่แล้ว', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByTestId('hashtag-input').fill('#เรียนรู้');
    await page.getByTestId('hashtag-input').press('Enter');
    await expect(page.getByText('##เรียนรู้', { exact: true })).toHaveCount(0);
    await expect(page.getByText('#เรียนรู้', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-030: เพิ่มแท็กครบ 3 แท็ก', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });

    // 1. กรอกและกด Enter ทีละแท็ก
    const tagInput = page.getByTestId('hashtag-input');
    await tagInput.fill('#คณิต');
    await tagInput.press('Enter');
    await tagInput.fill('#ม6');
    await tagInput.press('Enter');
    await tagInput.fill('#เรียนรู้');
    await tagInput.press('Enter');

    // 2. กดปุ่ม "ตกลง" เพื่อบันทึกและปิด Modal
    await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();

    // 3. ตรวจสอบว่าทั้ง 3 แท็กแสดงบนหน้าฟอร์มหลักเรียบร้อย 
    await expect(page.getByText('#คณิต', { exact: true })).toBeVisible();
    await expect(page.getByText('#ม6', { exact: true })).toBeVisible();
    await expect(page.getByText('#เรียนรู้', { exact: true })).toBeVisible();
  });


  test('TC-POST01-031: เพิ่มแท็กรายการที่ 4', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    const tagInput = page.getByTestId('hashtag-input');
    await tagInput.fill('#คณิต');
    await tagInput.press('Enter');
    await tagInput.fill('#ม6');
    await tagInput.press('Enter');
    await tagInput.fill('#เรียนรู้');
    await tagInput.press('Enter');
    await expect(tagInput).toHaveCount(0);
    await expect(page.getByText('แฮชแท็ก (3/3)', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '#สรุปย่อ', exact: true }).click();
    await expect(page.getByText('แฮชแท็ก (3/3)', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'เสร็จสิ้น', exact: true }).click();
    await expect(page.getByText('#คณิต', { exact: true })).toBeVisible();
    await expect(page.getByText('#ม6', { exact: true })).toBeVisible();
    await expect(page.getByText('#เรียนรู้', { exact: true })).toBeVisible();
    await expect(page.getByText('#สรุปย่อ', { exact: true })).toHaveCount(0);
  });

  test('TC-POST01-032: แท็กมีเครื่องหมายขีดกลาง', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByTestId('hashtag-input').fill('#QA-Test');
    await page.getByTestId('hashtag-input').press('Enter');
    await expect(page.getByText('#QA-Test', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/แท็กต้องไม่มีอักษรพิเศษ/i)).toBeVisible();
  });

  test('TC-POST01-033: แท็กมีเครื่องหมายขีดล่าง', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByTestId('hashtag-input').fill('#QA_Test');
    await page.getByTestId('hashtag-input').press('Enter');
    await expect(page.getByText('#QA_Test', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/แท็กต้องไม่มีอักษรพิเศษ/i)).toBeVisible();
  });

  test('TC-POST01-034: แท็กมีเครื่องหมาย @', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByTestId('hashtag-input').fill('#QA@Test');
    await page.getByTestId('hashtag-input').press('Enter');
    await expect(page.getByText('#QA@Test', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/แท็กต้องไม่มีอักษรพิเศษ/i)).toBeVisible();
  });

  test('TC-POST01-035: แท็กมีความยาว 10 ตัวอักษร (รวม #)', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    // #123456789 ความยาว 10 ตัวอักษรรวมเครื่องหมาย #
    await page.getByTestId('hashtag-input').fill('#123456789');
    await page.getByTestId('hashtag-input').press('Enter');
    await expect(page.getByText('#123456789', { exact: true }).first()).toBeVisible();
  });

  test('TC-POST01-036: แท็กมีความยาว 11 ตัวอักษร (รวม #)', async ({ page }) => {
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    // #1234567890 ความยาว 11 ตัวอักษรรวมเครื่องหมาย #
    await page.getByTestId('hashtag-input').fill('#1234567890');
    await page.getByTestId('hashtag-input').press('Enter');
    await expect(page.getByText('#1234567890', { exact: true })).toHaveCount(0);
    await expect(page.getByText('แท็กต้องมีความยาวไม่เกิน 10 ตัวอักษร', { exact: true })).toBeVisible();
  });

  test('TC-POST01-037: แนบไฟล์ PDF จำนวน 1 ไฟล์', async ({ page }) => {
    await page.getByTestId('pdf-file-input').setInputFiles(pdf.normal);
    await expect(page.getByText('document.pdf', { exact: true })).toBeVisible();
    await expect(page.getByTestId('remove-pdf-button')).toBeVisible();
  });

  baseTest('TC-POST01-038: เผยแพร่โพสต์สำเร็จเมื่อกรอกข้อมูลครบถ้วน', async ({ page }) => {
    const runId = randomUUID().slice(0, 8);
    const title = `TC-POST01-038 ทบทวนแคลคูลัส ${runId}`;
    const summary = `สรุปสูตรอนุพันธ์ ${runId}`;
    const content = `เนื้อหาตัวอย่างสำหรับทดสอบ TC-POST01-038 ${runId}`;
    await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
    await page.getByTestId('post-title-input').fill(title);
    await page.getByTestId('education-level-select').selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.getByTestId('post-summary-input').fill(summary);
    await page.getByTestId('category-tags-settings-button').click();
    await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
    await page.getByRole('button', { name: '#สรุปย่อ', exact: true }).click();
    await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
    await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill(content);
    await page.getByTestId('pdf-file-input').setInputFiles(pdf.normal);
    await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);
    // เริ่มดัก response ก่อนกดเผยแพร่ เพื่อไม่พลาด response ที่ตอบกลับเร็ว
    // Promise.all รอทั้ง response และการคลิกเสร็จ แล้วเก็บ response ตัวแรกใน createResponse
    const [createResponse] = await Promise.all([
      page.waitForResponse(response =>
        // เลือกเฉพาะคำขอ POST ที่ส่งไปยัง API สร้างโพสต์
        response.request().method() === 'POST' &&
        // ใช้เฉพาะ path และตัด / ท้าย path เพื่อให้รองรับ /posts และ /posts/
        new URL(response.url()).pathname.replace(/\/$/, '') === '/api/v1/posts',
        // รอ response ได้สูงสุด 60 วินาที
        { timeout: 60_000 },
      ),
      // กดเผยแพร่ผ่านหน้าเว็บจริง โดยไม่ได้ยิง API เพิ่มเอง
      page.getByTestId('publish-post-button').click(),
    ]);
    // ตรวจ HTTP status: 201 Created หมายถึงสร้างข้อมูลใหม่สำเร็จ
    expect(createResponse.status()).toBe(201);
    // อ่าน JSON ที่ backend ส่งกลับ เพื่อตรวจผลการบันทึกโพสต์
    const createdPost = await createResponse.json();
    // Backend ต้องรายงานว่าการสร้างโพสต์สำเร็จ
    expect(createdPost.success).toBe(true);
    // ID โพสต์ต้องเป็นข้อความและไม่ว่าง ใช้เทียบกับ URL หน้ารายละเอียดต่อไป
    expect(createdPost.data.id).toEqual(expect.any(String));
    expect(createdPost.data.id.length).toBeGreaterThan(0);
    // เก็บเฉพาะโพสต์ที่สร้างในรอบนี้ ให้เคส 039 ลบได้แม้การตรวจ UI ต่อจากนี้ล้มเหลว
    // Playwright ล้าง outputDir ก่อนเริ่มรอบใหม่ จึงไม่ใช้ ID ของรอบเก่า
    const recordPath = path.join(baseTest.info().project.outputDir, 'created-post-038.json');
    await fs.mkdir(path.dirname(recordPath), { recursive: true });
    await fs.writeFile(recordPath, JSON.stringify({ id: createdPost.data.id, title }));
    // ตรวจสถานะใน response ว่าเผยแพร่เป็น ACTIVE ไม่ใช่แบบร่าง DRAFT
    expect(createdPost.data.post_status).toBe('ACTIVE');

    await expect(page.getByRole('dialog', { name: 'สำเร็จ!', exact: true })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole('dialog').getByText('สร้างโพสต์สรุปความรู้เรียบร้อยแล้ว', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await page.goto('/home');
    await page.getByRole('button').filter({ has: page.getByRole('img', { name: 'Profile', exact: true }) }).click();
    await page.getByRole('link', { name: 'โปรไฟล์ของฉัน' }).click();
    await page.getByRole('button', { name: 'โพสต์ของฉัน', exact: true }).click();
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await page.getByRole('heading', { name: title, exact: true }).click();
    await expect(page).toHaveURL(url => url.pathname === `/post/${createdPost.data.id}`);
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.getByText('คณิตศาสตร์', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('มัธยมศึกษาตอนปลาย', { exact: true }).first()).toBeVisible();
    // จำกัดการตรวจให้อยู่ในส่วนของโพสต์นี้ ไม่ตรงกับข้อความบนการ์ดโพสต์อื่น
    const summarySection = page.getByRole('heading', { name: 'บทสรุปย่อ', exact: true }).locator('..');
    const contentSection = page.getByRole('heading', { name: 'รายละเอียดเพิ่มเติม', exact: true }).locator('..');
    await expect(summarySection.getByText(summary, { exact: true })).toBeVisible();
    await expect(contentSection.getByText(content, { exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'gallery-0', exact: true })).toBeVisible();
    await expect(page.getByText('document.pdf', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ดาวน์โหลด', exact: true })).toBeVisible();
    await expect(page.getByText('#สรุปย่อ', { exact: true })).toBeVisible();
  });

});

// แยกจากชุดสร้างโพสต์เพื่อไม่ต้องเข้า /create ก่อนลบ และยังรันได้หาก 038 ตรวจ UI ไม่ผ่าน
baseTest('TC-POST01-039: ลบโพสต์ทดสอบที่สร้างจากเคส 038', async ({ page }) => {
  // เปิดเป็นค่าเริ่มต้น ปิดด้วย set DELETE_TEST_POST=0 ใน CMD
  test.skip(process.env.DELETE_TEST_POST === '0', 'ปิดการลบโพสต์ทดสอบ');
  const recordPath = path.join(baseTest.info().project.outputDir, 'created-post-038.json');
  let record;
  try {
    record = JSON.parse(await fs.readFile(recordPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      test.skip(true, 'ไม่มีโพสต์จากเคส 038 ในรอบนี้ ให้รัน 038 และ 039 พร้อมกัน');
      return;
    }
    throw error;
  }
  expect(record.id).toMatch(/^[0-9a-f-]{36}$/i);
  expect(record.title).toMatch(/^TC-POST01-038 /);
  await page.goto(`/post/${record.id}`);
  // ยืนยันชื่อและ ID ก่อนลบ ป้องกันการลบโพสต์อื่น
  await expect(page).toHaveURL(url => url.pathname === `/post/${record.id}`);
  await expect(page.getByRole('heading', { name: record.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ลบโพสต์', exact: true }).click();
  await expect(page.getByRole('dialog', { name: /คุณต้องการลบโพสต์/ })).toBeVisible();
  const [deleteResponse] = await Promise.all([
    page.waitForResponse(response => response.request().method() === 'DELETE' &&
      new URL(response.url()).pathname === `/api/v1/posts/${record.id}`),
    page.getByRole('button', { name: 'ใช่, ลบเลย', exact: true }).click(),
  ]);
  expect(deleteResponse.ok()).toBe(true);
  await expect(page.getByRole('dialog', { name: 'ลบสำเร็จ!', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await page.goto('/home');
  await page.getByRole('button').filter({ has: page.getByRole('img', { name: 'Profile', exact: true }) }).click();
  await page.getByRole('link', { name: 'โปรไฟล์ของฉัน' }).click();
  await page.getByRole('button', { name: 'โพสต์ของฉัน', exact: true }).click();
  await expect(page.getByRole('heading', { name: record.title, exact: true })).toHaveCount(0);
  await fs.unlink(recordPath);
});
