# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: post\detail-post.spec.js >> TC-POST05 รายละเอียดโพสต์ >> TC-POST05-001,012: โพสต์ ACTIVE แสดงข้อมูลและดาวน์โหลด PDF ได้
- Location: tests\post\detail-post.spec.js:7:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog', { name: 'โพสต์สำเร็จ!' })
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('dialog', { name: 'โพสต์สำเร็จ!' }) with timeout 60000ms
  - waiting for getByRole('dialog', { name: 'โพสต์สำเร็จ!' })

```

```yaml
- dialog "เกิดข้อผิดพลาด":
  - heading "เกิดข้อผิดพลาด" [level=2]
  - text: Invalid image file
  - button "OK"
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
  55  | async function fillRequiredFields(page, { title, summary = 'สรุปเนื้อหาสำหรับทดสอบ', category = 'คณิตศาสตร์', withPdf = false, tag } = {}) {
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
  66  |   if (tag) {
  67  |     await page.getByTestId(`${prefix}hashtag-input`).fill(tag);
  68  |     await page.getByTestId(`${prefix}hashtag-input`).press('Enter');
  69  |   }
  70  |   await page.getByRole('button', { name: 'เสร็จสิ้น' }).click();
  71  |   await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('เนื้อหาตัวอย่างสำหรับทดสอบ TC-02');
  72  |   await page.getByTestId(`${prefix}supporting-images-file-input`).setInputFiles(images.image01);
  73  |   if (withPdf) await page.getByTestId(`${prefix}pdf-file-input`).setInputFiles(pdf.normal);
  74  | }
  75  | 
  76  | async function fillCompletePost(page, options) {
  77  |   await page.goto('/create');
  78  |   await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();
  79  |   await fillRequiredFields(page, options);
  80  | }
  81  | 
  82  | async function publishPost(page, artifacts, options) {
  83  |   artifacts.track(options.title);
  84  |   await fillCompletePost(page, options);
  85  |   await page.getByTestId('publish-post-button').click();
  86  |   await dismissSuccess(page, 'โพสต์สำเร็จ!');
  87  |   const url = await openPost(page, options.title);
  88  |   artifacts.rememberUrl(options.title, url);
  89  |   return url;
  90  | }
  91  | 
  92  | async function saveDraft(page, artifacts, { title, summary }) {
  93  |   artifacts.track(title);
  94  |   await page.goto('/create');
  95  |   await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();
  96  |   await page.getByTestId('post-title-input').fill(title);
  97  |   if (summary) await page.getByTestId('post-summary-input').fill(summary);
  98  |   await page.getByTestId('save-draft-button').click();
  99  |   await dismissSuccess(page, 'บันทึกสำเร็จ!');
  100 |   const url = await openDraft(page, title);
  101 |   artifacts.rememberUrl(title, url);
  102 |   return url;
  103 | }
  104 | 
  105 | async function deleteCurrentPost(page) {
  106 |   await page.getByRole('button', { name: 'ลบโพสต์' }).click();
  107 |   await expect(page.getByRole('dialog', { name: /คุณต้องการลบโพสต์/ })).toBeVisible();
  108 |   await page.getByRole('button', { name: 'ใช่, ลบเลย' }).click();
```