# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: post\draft-post.spec.js >> TC-POST02 แบบร่าง >> TC-POST02-002,005,007,013,020: บันทึกแบบร่างและตรวจข้อมูลหลัง Refresh
- Location: tests\post\draft-post.spec.js:9:3

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator: getByTestId('post-title-input')
Expected: "TC-POST02-002 แบบร่าง local-5022592b"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveValue" getByTestId('post-title-input') with timeout 5000ms
  - waiting for getByTestId('post-title-input')

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
- button "ยกเลิกการแก้ไข"
- heading "แก้ไขโพสต์สรุปความรู้" [level=1]
- paragraph: อัปเดตเนื้อหาหรือไฟล์ประกอบการเรียนรู้ของคุณ
- text: แบบร่าง (Draft) รูปปก * ไม่เกิน 2 MB
- paragraph: แนะนำอัตราส่วน 16:9 (เช่น 1280×720px) เพื่อให้แสดงผลสวยที่สุด
- img "Cover"
- button "ลบรูปปก"
- text: ชื่อหัวข้อสรุป * 36/100 ตัวอักษร
- textbox "เช่น สรุปสูตรฟิสิกส์ ม.4 เทอม 1": TC-POST02-002 แบบร่าง local-5022592b
- text: ระดับชั้น *
- combobox:
  - option "เลือกระดับชั้น" [disabled]
  - option "มัธยมศึกษาตอนต้น"
  - option "มัธยมศึกษาตอนปลาย"
  - option "มหาวิทยาลัย" [selected]
- text: บทสรุปย่อ (Summary) * 35/200 ตัวอักษร
- textbox "อธิบายสั้นๆ เกี่ยวกับไฟล์สรุปนี้...": ข้อมูลแบบร่างต้องคงอยู่หลัง Refresh
- text: "หมวดหมู่วิชาและแฮชแท็ก * วิชาที่เลือก: ทั่วไป ยังไม่มีแฮชแท็ก (สามารถเพิ่มแท็กช่วยให้ค้นหาง่ายขึ้น)"
- button "ตั้งค่าวิชาและแท็ก"
- text: รายละเอียดเพิ่มเติม *
- toolbar:
  - button "Normal":
    - text: Normal
    - img
  - button "bold":
    - img
  - button "italic":
    - img
  - button "underline":
    - img
  - button "strike":
    - img
  - button:
    - img
  - button:
    - img
  - 'button "list: ordered"':
    - img
  - 'button "list: bullet"':
    - img
  - 'button "indent: -1"':
    - img
  - 'button "indent: +1"':
    - img
  - button:
    - img
  - button "blockquote":
    - img
  - button "link":
    - img
  - button "image":
    - img
  - button "clean":
    - img
- text: อธิบายเพิ่มเติมเกี่ยวกับเนื้อหา เทคนิคการจำ หรือที่มา...
- paragraph
- paragraph: เพิ่มรูปจากปุ่มใน toolbar, ลากไฟล์ หรือวางจาก clipboard (สูงสุด 5 รูป, JPEG, PNG และ WEBP, รูปละไม่เกิน 2 MB)
- text: ไฟล์เอกสารประกอบ PDF (ถ้ามี) PDF ไม่เกิน 20 MB อัปโหลดไฟล์ PDF ใหม่ PDF ไม่เกิน 20 MB รูปภาพประกอบ (0/5) * ไม่เกินรูปละ 2 MB
- button "ยกเลิกการแก้ไข"
- button "ลบโพสต์"
- button "บันทึกแบบร่าง"
- button "บันทึกและโพสต์"
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
  8   |   await expect(page.getByRole('dialog', { name: heading })).toBeVisible({ timeout: 60_000 });
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
> 32  |   await expect(page.getByTestId('post-title-input')).toHaveValue(title);
      |                                                      ^ Error: expect(locator).toHaveValue(expected) failed
  33  |   return page.url();
  34  | }
  35  | 
  36  | async function openPost(page, title) {
  37  |   await openOwnProfileTab(page, 'posts');
  38  |   const heading = page.getByRole('heading', { name: title, exact: true });
  39  |   await expect(heading).toBeVisible({ timeout: 15_000 });
  40  |   await heading.click();
  41  |   await expect(page).toHaveURL(detailPath);
  42  |   await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  43  |   return page.url();
  44  | }
  45  | 
  46  | async function openEditFromPost(page, title) {
  47  |   const postUrl = await openPost(page, title);
  48  |   await page.getByRole('button', { name: 'แก้ไขโพสต์' }).click();
  49  |   await expect(page).toHaveURL(editPath);
  50  |   await expect(page.getByTestId('post-title-input')).toHaveValue(title);
  51  |   return { postUrl, editUrl: page.url() };
  52  | }
  53  | 
  54  | async function fillRequiredFields(page, { title, summary = 'สรุปเนื้อหาสำหรับทดสอบ', category = 'คณิตศาสตร์', withPdf = false } = {}) {
  55  |   await page.getByTestId('cover-file-input').setInputFiles(images.coverJpg);
  56  |   await page.getByTestId('post-title-input').fill(title);
  57  |   await page.getByTestId('education-level-select').selectOption({ label: 'มัธยมศึกษาตอนปลาย' });
  58  |   await page.getByTestId('post-summary-input').fill(summary);
  59  |   await page.getByTestId('category-tags-settings-button').click();
  60  |   await page.getByTestId('category-select').selectOption({ label: category });
  61  |   await page.getByRole('button', { name: 'เสร็จสิ้น' }).click();
  62  |   await page.getByTestId('post-content-input').locator('[contenteditable="true"]').fill('เนื้อหาตัวอย่างสำหรับทดสอบ TC-02');
  63  |   await page.getByTestId('supporting-images-file-input').setInputFiles(images.image01);
  64  |   if (withPdf) await page.getByTestId('pdf-file-input').setInputFiles(pdf.normal);
  65  | }
  66  | 
  67  | async function fillCompletePost(page, options) {
  68  |   await page.goto('/create');
  69  |   await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();
  70  |   await fillRequiredFields(page, options);
  71  | }
  72  | 
  73  | async function publishPost(page, artifacts, options) {
  74  |   artifacts.track(options.title);
  75  |   await fillCompletePost(page, options);
  76  |   await page.getByTestId('publish-post-button').click();
  77  |   await dismissSuccess(page, 'โพสต์สำเร็จ!');
  78  |   const url = await openPost(page, options.title);
  79  |   artifacts.rememberUrl(options.title, url);
  80  |   return url;
  81  | }
  82  | 
  83  | async function saveDraft(page, artifacts, { title, summary }) {
  84  |   artifacts.track(title);
  85  |   await page.goto('/create');
  86  |   await expect(page.getByRole('heading', { name: 'สร้างโพสต์สรุปความรู้' })).toBeVisible();
  87  |   await page.getByTestId('post-title-input').fill(title);
  88  |   if (summary) await page.getByTestId('post-summary-input').fill(summary);
  89  |   await page.getByTestId('save-draft-button').click();
  90  |   await dismissSuccess(page, 'บันทึกสำเร็จ!');
  91  |   const url = await openDraft(page, title);
  92  |   artifacts.rememberUrl(title, url);
  93  |   return url;
  94  | }
  95  | 
  96  | async function deleteCurrentPost(page) {
  97  |   await page.getByRole('button', { name: 'ลบโพสต์' }).click();
  98  |   await expect(page.getByRole('dialog', { name: /คุณต้องการลบโพสต์/ })).toBeVisible();
  99  |   await page.getByRole('button', { name: 'ใช่, ลบเลย' }).click();
  100 |   await dismissSuccess(page, 'ลบสำเร็จ!');
  101 | }
  102 | 
  103 | async function cleanupTitle(page, item) {
  104 |   // Check both tabs because a failed publish can still have committed a draft or a post.
  105 |   for (const tab of ['posts', 'drafts']) {
  106 |     await openOwnProfileTab(page, tab);
  107 |     for (const title of item.aliases) {
  108 |       const heading = page.getByRole('heading', { name: title, exact: true });
  109 |       if (await heading.count()) {
  110 |         if (tab === 'drafts') {
  111 |           await draftCard(page, title).getByRole('button', { name: 'แก้ไขโพสต์' }).click();
  112 |           await expect(page).toHaveURL(editPath);
  113 |         } else {
  114 |           await heading.click();
  115 |           await expect(page).toHaveURL(detailPath);
  116 |         }
  117 |         await deleteCurrentPost(page);
  118 |         await openOwnProfileTab(page, tab);
  119 |       }
  120 |     }
  121 |     await openOwnProfileTab(page, tab);
  122 |     for (const title of item.aliases) {
  123 |       await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  124 |     }
  125 |   }
  126 |   if (item.url) {
  127 |     await page.goto(item.url);
  128 |     await expect(page.getByRole('button', { name: 'ลบโพสต์' })).toHaveCount(0);
  129 |     await expect(page.getByRole('heading', { name: item.title, exact: true })).toHaveCount(0);
  130 |   }
  131 | }
  132 | 
```