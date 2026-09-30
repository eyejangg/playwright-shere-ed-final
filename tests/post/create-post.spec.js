// @ts-check
const { test, expect, publishPost } = require('./post-helpers');
const { images, pdf, generateUniqueTitle } = require('../../test-data/test-data');
// ==============================
// Login Test
// ==============================

test.describe('ทดสอบขั้นตอนการเข้าสู่ระบบ', () => {
  // บังคับไม่ใช้ session เพื่อทดสอบ flow การกดล็อกอินตั้งแต่ต้น
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC-POST01-001: สมาชิกเข้าสู่หน้าสร้างโพสต์', async ({ page }) => {
    await test.step('เข้าสู่ระบบด้วยบัญชีสมาชิก', async () => {
      await page.goto('/');
      await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
      await page.getByRole('textbox', { name: 'อีเมล' }).fill('member01@test.com');
      await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('Test1234');
      await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    });
    await test.step('ตรวจสอบการเข้าสู่ระบบสำเร็จ', async () => {
      // ผลลัพธ์ที่คาดหวัง 1: เข้าสู่ระบบสำเร็จและแสดงหน้าหลัก
      await expect(page).toHaveURL(/share-ed\.online\/(home)?\/?$/);
      await expect(page.getByRole('heading', { name: 'ยินดีต้อนรับสู่ SHARE-ED' })).toBeVisible();
    });
    await test.step('เปิดหน้าสร้างโพสต์', async () => {
      // ผลลัพธ์ที่คาดหวัง 2: แสดงเมนูสร้างโพสต์หลังเข้าสู่ระบบ
      await expect(page.getByTestId('create-post-button')).toBeVisible();
      await page.getByTestId('create-post-button').click();
    });
    await test.step('ตรวจสอบหน้าสร้างโพสต์', async () => {
      // ผลลัพธ์ที่คาดหวัง 3: แสดงหน้าสร้างโพสต์สำเร็จ
      await expect(page).toHaveURL(/share-ed\.online\/create/);
      await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();
    });
  });
});

// ==============================
// Create Post Tests
// ==============================

test.describe('ทดสอบการสร้างโพสต์', () => {

  test.beforeEach(async ({ page }) => {
    await test.step('เตรียมหน้าสร้างโพสต์', async () => {
      // ก่อนเริ่มแต่ละ Test Case ให้เปิดหน้าเว็บ
      await page.goto('/');

      // เข้าหน้าสร้างโพสต์
      await page.getByTestId('create-post-button').click();
    });
  });

  test('TC-POST01-003: กรอกข้อมูลโพสต์ครบถ้วนและแนบไฟล์', async ({ page }) => {

    await test.step('แนบหน้าปกและกรอกข้อมูลโพสต์', async () => {
      await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
      await page.getByTestId('post-title-input').fill('ทบทวนแคลคูลัส');
      await page.getByTestId('education-level-select').selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
      await page.getByTestId('post-summary-input').fill('สรุปสูตรอนุพันธ์');
    });
    await test.step('เลือกหมวดหมู่และแท็ก', async () => {
      await page.getByTestId('category-tags-settings-button').click();
      await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
      await page.getByRole('button', { name: '#สรุปย่อ', exact: true }).click();
      await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
    });
    await test.step('กรอกเนื้อหาและแนบ PDF กับรูปประกอบ', async () => {
      await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
      await page.getByTestId('pdf-file-input').setInputFiles(pdf.normal);
      await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);
    });
    await test.step('ตรวจสอบข้อมูลและพรีวิวไฟล์', async () => {
      await expect(page.getByTestId('post-title-input')).toHaveValue('ทบทวนแคลคูลัส');
      await expect(page.getByTestId('post-summary-input')).toHaveValue('สรุปสูตรอนุพันธ์');
      await expect(page.getByTestId('post-content-input').locator('[contenteditable="true"]')).toContainText('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
      await expect(page.getByText(/คณิตศาสตร์/).last()).toBeVisible();
      await expect(page.getByText(/สรุปย่อ/).last()).toBeVisible();
      await expect(page.getByRole('img', { name: 'Cover' })).toBeVisible();
      await expect(page.getByText(/document\.pdf/i)).toBeVisible();
      await expect(page.getByRole('img', { name: 'img-0' })).toBeVisible();
    });
  });

  test('TC-POST01-012: ไม่กรอกชื่อหัวข้อสรุป', async ({ page }) => {
    await test.step('กรอกข้อมูลโดยเว้นชื่อหัวข้อ', async () => {
      await page.getByTestId('cover-file-input').setInputFiles(images.coverPng);
      await page.getByTestId('education-level-select').selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
      await page.getByTestId('post-summary-input').fill('สรุปสูตรอนุพันธ์');
      await page.getByTestId('category-tags-settings-button').click();
      await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
      await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
      await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์');
      await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);
    });
    await test.step('ตรวจสอบการแจ้งเตือนเมื่อไม่มีชื่อหัวข้อ', async () => {
      await page.getByTestId('publish-post-button').click();
      await expect(page.getByTestId('post-title-input')).toHaveValue('');
      // expect error when title is empty
      await expect(page.getByText('กรุณากรอกชื่อหัวข้อสรุปความรู้')).toBeVisible();
      // stay at create post page
      await expect(page).toHaveURL(/\/create/);
    });

    // รอบเฟล: ลบ /* และ */ ของบล็อกด้านล่างเพื่อเปิดใช้งาน
    // Expected นี้ตั้งใจให้ไม่ตรงกับชื่อหัวข้อที่เว้นว่าง

    // ---------- Fail Case ----------

    // await test.step('ตรวจสอบค่าชื่อหัวข้อสรุป', async () => {
    //   await expect(page.getByTestId('post-title-input')).toHaveValue(
    //     'ทบทวนแคลคูลัส',
    //     { timeout: 1_000 }
    //   );
    // });

     // ---------- Fail Case ----------tt

  });

  test('TC-POST01-018: รูปหน้าปกมีขนาดเกิน 2 MB', async ({ page }) => {
    await test.step('แนบหน้าปกขนาดเกิน 2 MB', async () => {
      await page.getByTestId('cover-file-input').setInputFiles(images.coverOver2MB);
    });
    await test.step('ตรวจสอบการปฏิเสธรูปเกินขนาด', async () => {
      await expect(page.getByText('คลิกเพื่ออัปโหลดรูปปก', { exact: true })).toBeVisible();
      await expect(page.getByText('cover-over-2mb.png', { exact: true })).toHaveCount(0);
      await expect(page.getByRole('status')).toHaveText('รูปหน้าปกต้องมีขนาดไม่เกิน 2 MB');
      await expect(page).toHaveURL(/\/create/);
    });

    // รอบเฟล: ลบ /* และ */ ของบล็อกด้านล่างเพื่อเปิดใช้งาน
    // Expected นี้ตั้งใจให้ไม่ตรงกับข้อความแจ้งเตือนที่ระบบแสดง
    // ---------- Fail Case ----------


    // await test.step('ตรวจสอบข้อความแจ้งเตือนขนาดรูปหน้าปก', async () => {
    //   await expect(page.getByRole('status')).toHaveText(
    //     'รูปหน้าปกต้องมีขนาดไม่เกิน 5 MB',
    //     { timeout: 1_000 }
    //   );
    // });

     // ---------- Fail Case ----------

  });



  test('TC-POST01-038: เผยแพร่โพสต์สำเร็จเมื่อกรอกข้อมูลครบถ้วน', async ({ page, artifacts }) => {
    test.setTimeout(120_000);
    const title = generateUniqueTitle('TC-POST01-038 ทบทวนแคลคูลัส');
    const postUrl = await publishPost(page, artifacts, {
      title, summary: 'สรุปสูตรอนุพันธ์', withPdf: true, tag: '#สรุปย่อ',
    });
    await test.step('ตรวจสอบข้อมูลบนหน้ารายละเอียดโพสต์', async () => {
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
});
