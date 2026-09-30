# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: post\edit-post.spec.js >> TC-POST03 แก้ไขโพสต์ >> TC-POST03-009,010,013,016,018,020: Validation บนหน้าแก้ไขจริง
- Location: tests\post\edit-post.spec.js:48:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByRole('status')
Expected: "รูปภาพหน้าปกต้องเป็นไฟล์ .jpg, .jpeg, .png, .apng เท่านั้น"
Error: strict mode violation: getByRole('status') resolved to 2 elements:
    1) <div role="status" aria-live="polite" class="go3958317564">รูปภาพหน้าปกต้องเป็นไฟล์ .jpg, .jpeg, .png, .apng…</div> aka getByText('รูปภาพหน้าปกต้องเป็นไฟล์ .jpg')
    2) <div role="status" aria-live="polite" class="go3958317564">รูปหน้าปกต้องมีขนาดไม่เกิน 2 MB</div> aka getByText('รูปหน้าปกต้องมีขนาดไม่เกิน 2')

Call log:
  - Expect "toHaveText" getByRole('status') with timeout 5000ms
  - waiting for getByRole('status')

```

# Page snapshot

```yaml
- generic [ref=f9e3]:
  - navigation [ref=f9e5]:
    - generic [ref=f9e6]:
      - link "SHARE-ED SHARE-ED" [ref=f9e7] [cursor=pointer]:
        - /url: /
        - img "SHARE-ED" [ref=f9e8]
        - generic [ref=f9e9]: SHARE-ED
      - generic [ref=f9e11]:
        - link "หน้าหลัก" [ref=f9e12] [cursor=pointer]:
          - /url: /home
        - link "สำรวจเนื้อหา" [ref=f9e13] [cursor=pointer]:
          - /url: /explore
        - link "โพสต์ยอดนิยม" [ref=f9e14] [cursor=pointer]:
          - /url: /trending
      - generic [ref=f9e15]:
        - button "สร้างโพสต์" [ref=f9e16] [cursor=pointer]
        - button "การแจ้งเตือน 0 รายการที่ยังไม่อ่าน" [ref=f9e24]
        - link "ความสำเร็จ" [ref=f9e28] [cursor=pointer]:
          - /url: /achievements
        - button "เมนูผู้ใช้" [ref=f9e36]
  - status [ref=f9e43]:
    - generic [ref=f9e44]:
      - heading "ไม่พบโพสต์ที่คุณต้องการ" [level=1] [ref=f9e49]
      - paragraph [ref=f9e50]: โพสต์นี้อาจไม่มีอยู่ หรือ URL ที่เปิดไม่ถูกต้อง
      - link "กลับหน้า Home" [ref=f9e51] [cursor=pointer]:
        - /url: /home
  - contentinfo [ref=f9e52]:
    - generic [ref=f9e54]:
      - generic [ref=f9e55]:
        - generic [ref=f9e56]:
          - img "SHARE-ED" [ref=f9e57]
          - generic [ref=f9e58]: SHARE-ED
        - paragraph [ref=f9e59]: พื้นที่สำหรับแบ่งปันความรู้ดีๆ เพื่อการศึกษาไทย
      - generic [ref=f9e60]:
        - generic [ref=f9e65]:
          - link "ติดต่อแอดมิน" [ref=f9e66] [cursor=pointer]:
            - /url: mailto:share_ed@gmail.com
          - generic [ref=f9e67]: share_ed@gmail.com
        - link "เกี่ยวกับเรา" [ref=f9e73] [cursor=pointer]:
          - /url: /
```

# Test source

```ts
  1  | // @ts-check
  2  | const { images, pdf, images06, generateUniqueTitle } = require('../../test-data/test-data');
  3  | const {
  4  |   test, expect, editPath, publishPost, openEditFromPost, openOwnProfileTab,
  5  | } = require('./post-helpers');
  6  | 
  7  | function saveEditButton(page) {
  8  |   return page.getByRole('button', { name: /^(บันทึกการแก้ไข|บันทึกและโพสต์)$/ });
  9  | }
  10 | 
  11 | test.describe('TC-POST03 แก้ไขโพสต์', () => {
  12 |   test('TC-POST03-001,003,005,008,017,021,022,025: แก้ไขโพสต์เดิมและตรวจหลัง Refresh', async ({ page, artifacts }) => {
  13 |     test.setTimeout(150_000);
  14 |     const title = generateUniqueTitle('TC-POST03-003 โพสต์เดิม');
  15 |     const updatedTitle = generateUniqueTitle('TC-POST03-003 โพสต์แก้ไข');
  16 |     const postUrl = await publishPost(page, artifacts, { title });
  17 |     const originalCover = await page.getByRole('img', { name: title, exact: true }).getAttribute('src');
  18 |     const { editUrl } = await openEditFromPost(page, title);
  19 | 
  20 |     await expect(page).toHaveURL(editPath);
  21 |     artifacts.rename(title, updatedTitle);
  22 |     await page.getByTestId('edit-post-title-input').fill(updatedTitle);
  23 |     await page.getByTestId('edit-post-summary-input').fill('บทสรุปที่แก้ไขแล้ว');
  24 |     await page.getByTestId('remove-edit-cover-button').click();
  25 |     await page.getByTestId('edit-cover-file-input').setInputFiles(images.coverPng);
  26 |     await saveEditButton(page).click();
  27 |     await expect(page.getByRole('dialog', { name: /บันทึกการแก้ไขสำเร็จ|แก้ไขสำเร็จ/ })).toBeVisible({ timeout: 60_000 });
  28 |     await page.getByRole('button', { name: 'OK', exact: true }).click();
  29 | 
  30 |     await page.goto(postUrl);
  31 |     await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toBeVisible();
  32 |     await expect(page.getByText('บทสรุปที่แก้ไขแล้ว', { exact: true })).toBeVisible();
  33 |     const cover = page.getByRole('img', { name: updatedTitle, exact: true });
  34 |     await expect(cover).toBeVisible();
  35 |     expect(await cover.getAttribute('src')).not.toBe(originalCover);
  36 |     const updatedCover = await cover.getAttribute('src');
  37 |     await page.reload();
  38 |     await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toBeVisible();
  39 |     await expect(page.getByText('บทสรุปที่แก้ไขแล้ว', { exact: true })).toBeVisible();
  40 |     await expect(cover).toHaveAttribute('src', updatedCover);
  41 |     expect(new URL(page.url()).pathname).toBe(new URL(postUrl).pathname);
  42 |     expect(new URL(editUrl).pathname.split('/').pop()).toBe(new URL(postUrl).pathname.split('/').pop());
  43 |     await openOwnProfileTab(page, 'posts');
  44 |     await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toHaveCount(1);
  45 |     await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  46 |   });
  47 | 
  48 |   test('TC-POST03-009,010,013,016,018,020: Validation บนหน้าแก้ไขจริง', async ({ page, artifacts }) => {
  49 |     test.setTimeout(150_000);
  50 |     const title = generateUniqueTitle('TC-POST03 ตรวจ Validation');
  51 |     await publishPost(page, artifacts, { title });
  52 |     await openEditFromPost(page, title);
  53 |     await expect(page).toHaveURL(editPath);
  54 | 
  55 |     await page.getByTestId('remove-edit-cover-button').click();
  56 |     await page.getByTestId('edit-cover-file-input').setInputFiles(images.coverOver2MB);
  57 |     await expect(page.getByRole('status')).toHaveText('รูปหน้าปกต้องมีขนาดไม่เกิน 2 MB');
  58 |     await page.getByTestId('edit-cover-file-input').setInputFiles(require('node:path').resolve('test-data/images/cover.webp'));
> 59 |     await expect(page.getByRole('status')).toHaveText('รูปภาพหน้าปกต้องเป็นไฟล์ .jpg, .jpeg, .png, .apng เท่านั้น');
     |                                            ^ Error: expect(locator).toHaveText(expected) failed
  60 |     await page.getByTestId('edit-cover-file-input').setInputFiles(images.coverJpg);
  61 |     await page.getByTestId('edit-supporting-images-file-input').setInputFiles(images06);
  62 |     await expect(page.getByRole('status')).toContainText('อัปโหลดรูปภาพประกอบได้สูงสุด 5 รูป');
  63 |     await expect(page.getByText('รูปภาพประกอบ (5/5) *', { exact: true })).toBeVisible();
  64 |     await expect(page.getByRole('img', { name: 'img-5' })).toHaveCount(0);
  65 |     await page.getByTestId('edit-pdf-file-input').setInputFiles(pdf.docx);
  66 |     await expect(page.getByText(/ไฟล์นี้ไม่ใช่ PDF ที่ถูกต้อง|สามารถอัปโหลดไฟล์ \.pdf เท่านั้น/)).toBeVisible();
  67 | 
  68 |     await page.getByTestId('edit-post-title-input').fill('');
  69 |     await saveEditButton(page).click();
  70 |     await expect(page.getByText('กรุณากรอกชื่อหัวข้อสรุปความรู้')).toBeVisible();
  71 |     await expect(page).toHaveURL(editPath);
  72 |     await page.getByTestId('edit-post-title-input').fill(title);
  73 |     await page.getByTestId('edit-post-summary-input').fill('');
  74 |     await saveEditButton(page).click();
  75 |     await expect(page.getByText('กรุณากรอกบทสรุปย่อ')).toBeVisible();
  76 |     await expect(page).toHaveURL(editPath);
  77 |   });
  78 | 
  79 | });
  80 | 
```