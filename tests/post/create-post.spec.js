// @ts-check
const { test, expect, publishPost } = require('./post-helpers');
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
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('member01@test.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('Test1234');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

    // ผลลัพธ์ที่คาดหวัง 1: เข้าสู่ระบบสำเร็จและแสดงหน้าหลัก
    await expect(page).toHaveURL(/share-ed\.online\/(home)?\/?$/);
    await expect(page.getByRole('heading', { name: 'ยินดีต้อนรับสู่ SHARE-ED' })).toBeVisible();

    // ผลลัพธ์ที่คาดหวัง 2: แสดงเมนูสร้างโพสต์หลังเข้าสู่ระบบ
    await expect(page.getByTestId('create-post-button')).toBeVisible();
    await page.getByTestId('create-post-button').click();

    // ผลลัพธ์ที่คาดหวัง 3: แสดงหน้าสร้างโพสต์สำเร็จ
    await expect(page).toHaveURL(/share-ed\.online\/create/);
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
    // 2. ตรวจว่ารูปแรก (img-0) และรูปสุดท้าย (img-4) แสดงบนหน้าจอ
    await expect(page.getByRole('img', { name: 'img-0' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'img-4' })).toBeVisible();
    await expect(page.getByTestId('remove-supporting-image-button-0')).toBeVisible();
    await expect(page.getByTestId('remove-supporting-image-button-4')).toBeVisible();

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

  test('TC-POST01-038: เผยแพร่โพสต์สำเร็จเมื่อกรอกข้อมูลครบถ้วน', async ({ page, artifacts }) => {
    test.setTimeout(120_000);
    const title = generateUniqueTitle('TC-POST01-038 ทบทวนแคลคูลัส');
    const postUrl = await publishPost(page, artifacts, {
      title, summary: 'สรุปสูตรอนุพันธ์', withPdf: true, tag: '#สรุปย่อ',
    });
    await expect(page).toHaveURL(postUrl);
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.getByText('คณิตศาสตร์', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('มัธยมศึกษาตอนปลาย', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('สรุปสูตรอนุพันธ์', { exact: true })).toBeVisible();
    await expect(page.getByText('เนื้อหาตัวอย่างสำหรับทดสอบ TC-02', { exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'gallery-0', exact: true })).toBeVisible();
    await expect(page.getByText('document.pdf', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ดาวน์โหลด', exact: true })).toBeVisible();
    await expect(page.getByText('#สรุปย่อ', { exact: true })).toBeVisible();
  });

});
