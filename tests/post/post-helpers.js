// @ts-check
// อธิบายตอนพรีเซนต์: helper รวมขั้นตอนกรอก/เผยแพร่โพสต์และ Cleanup ที่ใช้ซ้ำได้
// จุดที่ควรเปิดอธิบาย: fillRequiredFields → publishPost → artifacts fixture
// test.step ที่เพิ่มช่วยให้ Reporter และ n8n เห็นชื่อขั้นตอน ไม่ได้เปลี่ยน expected
const { test: base, expect } = require('@playwright/test');
const { images, pdf } = require('../../test-data/test-data');

// =============================================================================
// 1. ค่าคงที่ & รูปแบบ URL (Constants & Regex)
// =============================================================================

/** URL หน้าอ่านโพสต์ เช่น /post/64f123... */
const detailPath = /\/post\/[^/]+$/;

/** URL หน้าแก้ไขโพสต์ เช่น /post/edit/64f123... */
const editPath = /\/post\/edit\/[^/]+$/;

// =============================================================================
// 2. ฟังก์ชันช่วยจัดการ UI & Popup (Internal UI Helpers)
// =============================================================================

/**
 * รอให้ Dialog แจ้งเตือนแสดงขึ้นมา แล้วกดปุ่ม "OK"
 * @param {import('@playwright/test').Page} page
 * @param {string | RegExp} heading ข้อความหัวเรื่อง Dialog เช่น 'สำเร็จ!', 'บันทึกสำเร็จ!'
 */
async function dismissSuccess(page, heading) {
  await expect(page.getByRole('dialog', { name: heading })).toBeVisible({ timeout: 60_000 });
  await page.getByRole('button', { name: 'OK', exact: true }).click();
}

/**
 * หาการ์ดแบบร่างในหน้า Profile ตามชื่อหัวข้อ
 * @param {import('@playwright/test').Page} page
 * @param {string} title ชื่อแบบร่าง
 */
function draftCard(page, title) {
  const heading = page.getByRole('heading', { name: title, exact: true });
  return heading.locator('xpath=ancestor::*[.//button[contains(normalize-space(.), "แก้ไขโพสต์")]][1]');
}

// =============================================================================
// 3. ฟังก์ชันนำทางในระบบ (Navigation Helpers)
// =============================================================================

/**
 * นำทางไปยังหน้าโปรไฟล์ของตัวเอง แล้วสลับไปยังแท็บที่ต้องการ
 * @param {import('@playwright/test').Page} page
 * @param {'posts' | 'drafts'} tab 'posts' (โพสต์ของฉัน) หรือ 'drafts' (แบบร่าง)
 */
async function openOwnProfileTab(page, tab) {
  await page.goto('/home');
  await page.getByRole('button', { name: 'เมนูผู้ใช้' }).click();
  await page.getByRole('link', { name: tab === 'drafts' ? 'แบบร่างของฉัน' : 'โปรไฟล์ของฉัน' }).click();
  await expect(page.getByRole('button', { name: 'โพสต์ของฉัน' })).toBeVisible();
  await page.getByRole('button', { name: tab === 'drafts' ? 'แบบร่าง' : 'โพสต์ของฉัน', exact: true }).click();
  await page.waitForLoadState('networkidle');
}

/**
 * เปิดไปยังหน้ารายละเอียดของโพสต์ที่มีอยู่แล้ว ผ่านหน้า Profile ของตัวเอง
 * @param {import('@playwright/test').Page} page
 * @param {string} title ชื่อโพสต์ที่ต้องการเปิด
 * @returns {Promise<string>} URL ของโพสต์นั้น
 */
async function openPost(page, title) {
  await openOwnProfileTab(page, 'posts');
  const heading = page.getByRole('heading', { name: title, exact: true });
  await expect(heading).toBeVisible({ timeout: 15_000 });
  await heading.click();
  await expect(page).toHaveURL(detailPath);
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  return page.url();
}

/**
 * เปิดไปยังหน้าแก้ไขของโพสต์ ผ่านหน้ารายละเอียดโพสต์
 * @param {import('@playwright/test').Page} page
 * @param {string} title ชื่อโพสต์
 * @returns {Promise<{ postUrl: string, editUrl: string }>}
 */
async function openEditFromPost(page, title) {
  const postUrl = await openPost(page, title);
  await page.getByRole('link', { name: 'แก้ไขโพสต์', exact: true }).click();
  await expect(page).toHaveURL(editPath);
  await expect(page.getByTestId('edit-post-title-input')).toHaveValue(title);
  return { postUrl, editUrl: page.url() };
}

/**
 * เปิดหน้าแก้ไขแบบร่างจากแท็บ "แบบร่าง" ในหน้าโปรไฟล์
 * @param {import('@playwright/test').Page} page
 * @param {string} title ชื่อแบบร่าง
 * @returns {Promise<string>} URL หน้าแก้ไขแบบร่าง
 */
async function openDraft(page, title) {
  await openOwnProfileTab(page, 'drafts');
  const card = draftCard(page, title);
  await expect(card).toBeVisible({ timeout: 15_000 });
  await card.getByRole('button', { name: 'แก้ไขโพสต์' }).click();
  await expect(page).toHaveURL(editPath);
  await expect(page.getByTestId('edit-post-title-input')).toHaveValue(title);
  return page.url();
}

// =============================================================================
// 4. ฟังก์ชันจัดการฟอร์มและบันทึกโพสต์ (Form & Post Actions)
// =============================================================================

/**
 * กรอกข้อมูลในฟิลด์ที่จำเป็น (รองรับทั้งหน้าสร้างใหม่ /create และหน้าแก้ไข /post/edit/:id)
 * @param {import('@playwright/test').Page} page
 * @param {{
 *   title: string,
 *   summary?: string,
 *   category?: string,
 *   withPdf?: boolean,
 *   tag?: string
 * }} options
 */
async function fillRequiredFields(page, {
  title,
  summary = 'สรุปเนื้อหาสำหรับทดสอบ',
  category = 'คณิตศาสตร์',
  withPdf = false,
  tag
} = {}) {
  const isEdit = editPath.test(page.url());
  const prefix = isEdit ? 'edit-' : '';

  // แบ่งงานกรอกฟอร์มเป็น test.step เพื่อระบุได้ว่าเฟลที่ไฟล์แนบ หมวดหมู่ หรือเนื้อหา

  await test.step('แนบหน้าปกและกรอกข้อมูลบังคับ', async () => {
    if (isEdit && await page.getByTestId('remove-edit-cover-button').count()) {
      await page.getByTestId('remove-edit-cover-button').click();
    }
    await page.getByTestId(`${prefix}cover-file-input`).setInputFiles(images.coverJpg);
    await page.getByTestId(`${prefix}post-title-input`).fill(title);
    await page.getByTestId(`${prefix}education-level-select`).selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
    await page.getByTestId(`${prefix}post-summary-input`).fill(summary);
  });
  await test.step('เลือกหมวดหมู่และแท็ก', async () => {
    // ตั้งค่าหมวดหมู่และแท็ก
    await page.getByTestId(`${prefix}category-tags-settings-button`).click();
    await page.getByTestId(`${prefix}category-select`).selectOption({ label: category });
    if (tag) {
      await page.getByTestId(`${prefix}hashtag-input`).fill(tag);
      await page.getByTestId(`${prefix}hashtag-input`).press('Enter');
    }
    await page.getByRole('button', { name: 'เสร็จสิ้น' }).click();
  });
  await test.step('กรอกเนื้อหาและแนบรูปประกอบ', async () => {
    // รายละเอียดเนื้อหาและรูปประกอบ
    await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('เนื้อหาตัวอย่างสำหรับทดสอบ TC-02');
    await page.getByTestId(`${prefix}supporting-images-file-input`).setInputFiles(images.image01);
  });
  await test.step('แนบไฟล์ PDF หากระบุ', async () => {
    // แนบ PDF (ถ้ามี)
    if (withPdf) {
      await page.getByTestId(`${prefix}pdf-file-input`).setInputFiles(pdf.normal);
    }
  });

}

/**
 * สร้างโพสต์และเผยแพร่จริงจนสำเร็จ พร้อมลงทะเบียนให้ลบอัตโนมัติเมื่อเทสจบ
 * @param {import('@playwright/test').Page} page
 * @param {any} artifacts Fixture สำหรับจัดการ Cleanup
 * @param {{ title: string, summary?: string, category?: string, withPdf?: boolean, tag?: string }} options
 * @returns {Promise<string>} URL ของโพสต์ที่สร้างเสร็จ
 */
async function publishPost(page, artifacts, options) {
  // ลงทะเบียนชื่อก่อนสร้าง เผื่อสร้างสำเร็จแต่การตรวจสอบภายหลังเฟล ยังมีชื่อให้ Cleanup
  artifacts.track(options.title);

  await test.step('เปิดหน้าสร้างโพสต์', async () => {
    await page.goto('/create');
    await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();
  });
  await fillRequiredFields(page, options);

  await test.step('เผยแพร่โพสต์และตรวจข้อความสำเร็จ', async () => {
    await page.getByTestId('publish-post-button').click();
    await expect(page.getByRole('dialog', { name: 'สำเร็จ!', exact: true })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole('dialog').getByText('สร้างโพสต์สรุปความรู้เรียบร้อยแล้ว', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
  });
  const url = await test.step('เปิดรายละเอียดโพสต์ที่เผยแพร่', async () => {
    return await openPost(page, options.title);
  });
  // จด URL ที่สร้างไว้สำหรับตรวจยืนยันการลบหลังจบเคส
  artifacts.rememberUrl(options.title, url);
  return url;
}

/**
 * บันทึกข้อมูลเป็นแบบร่าง (Draft)
 * @param {import('@playwright/test').Page} page
 * @param {any} artifacts Fixture สำหรับจัดการ Cleanup
 * @param {{ title: string, summary?: string }} options
 * @returns {Promise<string>} URL หน้าแก้ไขแบบร่าง
 */
async function saveDraft(page, artifacts, { title, summary }) {
  artifacts.track(title);

  await page.goto('/create');
  await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();
  await page.getByTestId('post-title-input').fill(title);
  if (summary) {
    await page.getByTestId('post-summary-input').fill(summary);
  }

  await page.getByTestId('save-draft-button').click();
  await dismissSuccess(page, 'บันทึกสำเร็จ!');

  const url = await openDraft(page, title);
  artifacts.rememberUrl(title, url);
  return url;
}

/**
 * กดปุ่มลบโพสต์ในหน้าปัจจุบัน พร้อมกดยืนยัน Dialog จนเสร็จสิ้น
 * @param {import('@playwright/test').Page} page
 */
async function deleteCurrentPost(page) {
  await page.getByRole('button', { name: 'ลบโพสต์' }).click();
  await expect(page.getByRole('dialog', { name: /คุณต้องการลบโพสต์/ })).toBeVisible();
  await page.getByRole('button', { name: 'ใช่, ลบเลย' }).click();
  await dismissSuccess(page, 'ลบสำเร็จ!');
}

// =============================================================================
// 5. ระบบเคลียร์ข้อมูลทดสอบอัตโนมัติ (Auto-Cleanup Fixture)
// =============================================================================

/**
 * ล้างข้อมูลโพสต์หรือแบบร่างที่สร้างไว้ตอนทดสอบ เพื่อป้องกันข้อมูลขยะค้างในระบบ
 * @param {import('@playwright/test').Page} page
 * @param {{ title: string, aliases: string[], url: string }} item
 */
async function cleanupTitle(page, item) {
  // ค้นเฉพาะชื่อ/ชื่อเดิมที่ fixture ติดตามไว้ในโปรไฟล์ของบัญชีทดสอบ
  // ตรวจทั้งโพสต์เผยแพร่และแบบร่าง แล้วลบรายการที่พบผ่าน UI
  for (const tab of ['posts', 'drafts']) {
    await openOwnProfileTab(page, tab);
    for (const title of item.aliases) {
      const heading = page.getByRole('heading', { name: title, exact: true });
      if (await heading.count()) {
        if (tab === 'drafts') {
          await draftCard(page, title).getByRole('button', { name: 'แก้ไขโพสต์' }).click();
          await expect(page).toHaveURL(editPath);
        } else {
          await heading.click();
          await expect(page).toHaveURL(detailPath);
          await page.waitForLoadState('networkidle');
        }
        item.url = page.url();
        await deleteCurrentPost(page);
        await openOwnProfileTab(page, tab);
      }
    }
    await openOwnProfileTab(page, tab);
    for (const title of item.aliases) {
      await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
    }
  }

  // หากรู้ URL ให้เปิดกลับไปตรวจว่ารายละเอียดและปุ่มลบของโพสต์ไม่แสดงแล้ว
  // เป็นการตรวจผลผ่าน UI ไม่ใช่การ query ฐานข้อมูลโดยตรง
  if (item.url) {
    await page.goto(item.url);
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'ลบโพสต์' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: item.title, exact: true })).toHaveCount(0);
  }
}

/**
 * Playwright Custom Fixture:
 * ติดตามโพสต์และแบบร่างที่สร้างในแต่ละเคส และสั่งลบทิ้งอัตโนมัติเมื่อเคสนั้นรันจบ
 */
const test = base.extend({
  // Fixture คือส่วนเตรียม/เก็บกวาดของแต่ละเคส; auto: true ทำให้ทำงานอัตโนมัติ
  artifacts: [async ({ page }, use) => {
    /** @type {Array<{ title: string, aliases: string[], url: string }>} */
    const items = [];
    const artifacts = {
      track(title) {
        // จดเฉพาะชื่อโพสต์ของเคสนี้และหลีกเลี่ยงการจดชื่อเดิมซ้ำ
        if (!items.some((item) => item.aliases.includes(title))) {
          items.push({ title, aliases: [title], url: '' });
        }
      },
      rememberUrl(title, url) {
        // ผูกชื่อที่ลงทะเบียนแล้วกับ URL ของโพสต์
        const item = items.find((entry) => entry.title === title);
        if (!item) throw new Error(`Untracked post: ${title}`);
        item.url = url;
      },
      rename(oldTitle, newTitle) {
        // รองรับการเปลี่ยนชื่อโดยเก็บ aliases ไว้ให้ค้น Cleanup ได้ทั้งชื่อเก่าและใหม่
        const item = items.find((entry) => entry.aliases.includes(oldTitle));
        if (!item) throw new Error(`Untracked post: ${oldTitle}`);
        item.aliases.push(newTitle);
        item.title = newTitle;
      },
    };

    try {
      // ส่ง artifacts ให้ตัว Test ใช้งาน; รอจน Test จบก่อนเข้าสู่ finally
      await use(artifacts);
    } finally {
      // finally ทำให้พยายาม Cleanup ทั้งเมื่อ Test ผ่านและเมื่อเกิด assertion error
      // หาก process ถูกปิดทันทีหรือเว็บล่ม Cleanup ยังอาจทำไม่สำเร็จได้
      const failures = [];
      // ลบย้อนลำดับการสร้าง และหากรายการหนึ่งผิดพลาดยังลองลบรายการอื่นต่อ
      for (const item of [...items].reverse()) {
        try {
          // ตั้งชื่อ Cleanup ให้ Reporter เก็บผลผ่าน/เฟลเป็นหลักฐานอีกขั้นตอนหนึ่ง
          await test.step('Cleanup: ลบโพสต์ทดสอบและตรวจสอบว่าลบแล้ว', async () => {
            await cleanupTitle(page, item);
          });
        } catch (error) {
          failures.push(`${item.title} (${item.url || 'URL unknown'}): ${error.message}`);
        }
      }
      if (failures.length) {
        // รายงานความล้มเหลว Cleanup แทนการซ่อน error แม้ขั้นตอนหลักจะผ่านแล้ว
        throw new Error(`Test data cleanup failed:\n${failures.join('\n')}`);
      }
      if (items.length) {
        // แนบรายการที่เก็บกวาดแล้วในรายงาน Playwright สำหรับตรวจย้อนหลัง
        await base.info().attach('created-posts-cleaned', {
          body: JSON.stringify(items),
          contentType: 'application/json',
        });
      }
    }
  // ให้ fixture มีเวลาสูงสุด 120 วินาทีสำหรับงานของ fixture รวม Cleanup
  }, { auto: true, timeout: 120_000 }],
});

// =============================================================================
// 6. Exports เฉพาะสิ่งที่ไฟล์ Test ต้องใช้งานจริง
// =============================================================================

module.exports = {
  test,                 // Playwright test runner (มี auto cleanup)
  expect,               // Assertion expect
  editPath,             // Regex ตรวจ URL หน้าแก้ไข (/post/edit/:id)
  fillRequiredFields,   // ฟังก์ชันกรอกข้อมูลฟอร์ม
  publishPost,          // ฟังก์ชันสร้างและเผยแพร่โพสต์จริง
  saveDraft,            // ฟังก์ชันบันทึกแบบร่าง
  openEditFromPost,     // ฟังก์ชันเปิดหน้าแก้ไขจากหน้ารายละเอียดโพสต์
  openOwnProfileTab,    // ฟังก์ชันเปิดหน้า Profile แท็บ 'posts' หรือ 'drafts'
  deleteCurrentPost,    // ฟังก์ชันกดยืนยันลบโพสต์ในหน้ารายละเอียด
};
