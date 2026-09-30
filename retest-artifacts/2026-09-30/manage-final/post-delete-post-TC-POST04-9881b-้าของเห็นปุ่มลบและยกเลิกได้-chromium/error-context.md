# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: post\delete-post.spec.js >> TC-POST04 ลบโพสต์ >> TC-POST04-001,003,004,008: เจ้าของเห็นปุ่มลบและยกเลิกได้
- Location: tests\post\delete-post.spec.js:9:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog', { name: 'โพสต์สำเร็จ!' })
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('dialog', { name: 'โพสต์สำเร็จ!' }) with timeout 60000ms
  - waiting for getByRole('dialog', { name: 'โพสต์สำเร็จ!' })
    - waiting for "https://share-ed.online/home" navigation to finish...
    - navigated to "https://share-ed.online/home"
  - Test timeout of 30000ms exceeded.

```

```yaml
- navigation:
  - link "SHARE-ED SHARE-ED":
    - /url: /
    - img "SHARE-ED"
    - text: SHARE-ED
  - link "หน้าหลัก":
    - /url: /home
  - link "สำรวจเนื้อหา":
    - /url: /explore
  - link "โพสต์ยอดนิยม":
    - /url: /trending
  - button "สร้างโพสต์"
  - button "การแจ้งเตือน 0 รายการที่ยังไม่อ่าน"
  - link "ความสำเร็จ":
    - /url: /achievements
  - button "เมนูผู้ใช้"
- img "Avatar"
- heading "Testeye" [level=1]
- text: 6 โพสต์
- button "0 ผู้ติดตาม"
- button "1 กำลังติดตาม"
- text: 0 ถูกใจรวม มหาวิทยาลัย
- button "แก้ไขโปรไฟล์"
- heading "เกี่ยวกับฉัน (Bio)" [level=3]
- paragraph: ยินดีต้อนรับสู่โปรไฟล์ของฉัน ชอบเรียนรู้และแบ่งปันความรู้เสมอครับ
- button "โพสต์ของฉัน"
- button "แบบร่าง"
- button "บุ๊กมาร์ก"
- img "Untitled draft"
- text: แบบร่าง ทั่วไป มหาวิทยาลัย แบบร่าง
- heading "Untitled draft" [level=3]
- paragraph: ไม่มีคำอธิบาย
- text: "แก้ไขล่าสุด: 25/9/2569"
- button "แก้ไขโพสต์"
- img "Untitled draft"
- text: แบบร่าง ทั่วไป มหาวิทยาลัย แบบร่าง
- heading "Untitled draft" [level=3]
- paragraph: ไม่มีคำอธิบาย
- text: "แก้ไขล่าสุด: 25/9/2569"
- button "แก้ไขโพสต์"
- contentinfo:
  - img "SHARE-ED"
  - text: SHARE-ED
  - paragraph: พื้นที่สำหรับแบ่งปันความรู้ดีๆ เพื่อการศึกษาไทย
  - link "ติดต่อแอดมิน":
    - /url: mailto:share_ed@gmail.com
  - text: share_ed@gmail.com
  - link "เกี่ยวกับเรา":
    - /url: /
```

# Test source

```ts
  1   | const { test: base, expect } = require('@playwright/test');
  2   | const { images, pdf } = require('../../test-data/test-data');
  3   | 
  4   | const detailPath = /\/post\/[^/]+$/;
  5   | const editPath = /\/post\/edit\/[^/]+$/;
  6   | 
  7   | async function dismissSuccess(page, heading) {
> 8   |   await expect(page.getByRole('dialog', { name: heading })).toBeVisible({ timeout: 60_000 });
      |                                                             ^ Error: expect(locator).toBeVisible() failed
  9   |   await page.getByRole('button', { name: 'OK', exact: true }).click();
  10  | }
  11  | 
  12  | async function openOwnProfileTab(page, tab) {
  13  |   await page.goto('/home');
  14  |   await page.getByRole('button', { name: 'เมนูผู้ใช้' }).click();
  15  |   await page.getByRole('link', { name: tab === 'drafts' ? 'แบบร่างของฉัน' : 'โปรไฟล์ของฉัน' }).click();
  16  |   await expect(page.getByRole('button', { name: 'โพสต์ของฉัน' })).toBeVisible();
  17  |   await page.getByRole('button', { name: tab === 'drafts' ? 'แบบร่าง' : 'โพสต์ของฉัน', exact: true }).click();
  18  |   await page.waitForLoadState('networkidle');
  19  | }
  20  | 
  21  | function draftCard(page, title) {
  22  |   const heading = page.getByRole('heading', { name: title, exact: true });
  23  |   return heading.locator('xpath=ancestor::*[.//button[contains(normalize-space(.), "แก้ไขโพสต์")]][1]');
  24  | }
  25  | 
  26  | async function openDraft(page, title) {
  27  |   await openOwnProfileTab(page, 'drafts');
  28  |   const card = draftCard(page, title);
  29  |   await expect(card).toBeVisible({ timeout: 15_000 });
  30  |   await card.getByRole('button', { name: 'แก้ไขโพสต์' }).click();
  31  |   await expect(page).toHaveURL(editPath);
  32  |   await expect(page.getByTestId('edit-post-title-input')).toHaveValue(title);
  33  |   return page.url();
  34  | }
  35  | 
  36  | async function openPost(page, title) {
  37  |   await openOwnProfileTab(page, 'posts');
  38  |   const heading = page.getByRole('heading', { name: title, exact: true });
  39  |   await expect(heading).toBeVisible({ timeout: 15_000 });
  40  |   await heading.click();
  41  |   await expect(page).toHaveURL(detailPath);
  42  |   await page.waitForLoadState('networkidle');
  43  |   await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  44  |   return page.url();
  45  | }
  46  | 
  47  | async function openEditFromPost(page, title) {
  48  |   const postUrl = await openPost(page, title);
  49  |   await page.getByRole('link', { name: 'แก้ไขโพสต์', exact: true }).click();
  50  |   await expect(page).toHaveURL(editPath);
  51  |   await expect(page.getByTestId('edit-post-title-input')).toHaveValue(title);
  52  |   return { postUrl, editUrl: page.url() };
  53  | }
  54  | 
  55  | async function fillRequiredFields(page, { title, summary = 'สรุปเนื้อหาสำหรับทดสอบ', category = 'คณิตศาสตร์', withPdf = false } = {}) {
  56  |   const prefix = editPath.test(page.url()) ? 'edit-' : '';
  57  |   if (prefix && await page.getByTestId('remove-edit-cover-button').count()) {
  58  |     await page.getByTestId('remove-edit-cover-button').click();
  59  |   }
  60  |   await page.getByTestId(`${prefix}cover-file-input`).setInputFiles(images.coverJpg);
  61  |   await page.getByTestId(`${prefix}post-title-input`).fill(title);
  62  |   await page.getByTestId(`${prefix}education-level-select`).selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
  63  |   await page.getByTestId(`${prefix}post-summary-input`).fill(summary);
  64  |   await page.getByTestId(`${prefix}category-tags-settings-button`).click();
  65  |   await page.getByTestId(`${prefix}category-select`).selectOption({ label: category });
  66  |   await page.getByRole('button', { name: 'เสร็จสิ้น' }).click();
  67  |   await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('เนื้อหาตัวอย่างสำหรับทดสอบ TC-02');
  68  |   await page.getByTestId(`${prefix}supporting-images-file-input`).setInputFiles(images.image01);
  69  |   if (withPdf) await page.getByTestId(`${prefix}pdf-file-input`).setInputFiles(pdf.normal);
  70  | }
  71  | 
  72  | async function fillCompletePost(page, options) {
  73  |   await page.goto('/create');
  74  |   await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();
  75  |   await fillRequiredFields(page, options);
  76  | }
  77  | 
  78  | async function publishPost(page, artifacts, options) {
  79  |   artifacts.track(options.title);
  80  |   await fillCompletePost(page, options);
  81  |   await page.getByTestId('publish-post-button').click();
  82  |   await dismissSuccess(page, 'โพสต์สำเร็จ!');
  83  |   const url = await openPost(page, options.title);
  84  |   artifacts.rememberUrl(options.title, url);
  85  |   return url;
  86  | }
  87  | 
  88  | async function saveDraft(page, artifacts, { title, summary }) {
  89  |   artifacts.track(title);
  90  |   await page.goto('/create');
  91  |   await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();
  92  |   await page.getByTestId('post-title-input').fill(title);
  93  |   if (summary) await page.getByTestId('post-summary-input').fill(summary);
  94  |   await page.getByTestId('save-draft-button').click();
  95  |   await dismissSuccess(page, 'บันทึกสำเร็จ!');
  96  |   const url = await openDraft(page, title);
  97  |   artifacts.rememberUrl(title, url);
  98  |   return url;
  99  | }
  100 | 
  101 | async function deleteCurrentPost(page) {
  102 |   await page.getByRole('button', { name: 'ลบโพสต์' }).click();
  103 |   await expect(page.getByRole('dialog', { name: /คุณต้องการลบโพสต์/ })).toBeVisible();
  104 |   await page.getByRole('button', { name: 'ใช่, ลบเลย' }).click();
  105 |   await dismissSuccess(page, 'ลบสำเร็จ!');
  106 | }
  107 | 
  108 | async function cleanupTitle(page, item) {
```