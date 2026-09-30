# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: post\create-post.spec.js >> ทดสอบการสร้างโพสต์ >> TC-POST01-031: เพิ่มแท็กรายการที่ 4
- Location: tests\post\create-post.spec.js:409:3

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: getByTestId('hashtag-input')
Expected: disabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeDisabled" getByTestId('hashtag-input') with timeout 5000ms
  - waiting for getByTestId('hashtag-input')

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
- heading "สร้างโพสต์สรุปความรู้" [level=1]
- paragraph: แบ่งปันความรู้ของคุณให้เพื่อนๆ ได้เรียนรู้ไปด้วยกัน
- text: รูปปก * ไม่เกิน 2 MB
- paragraph: แนะนำอัตราส่วน 16:9 (เช่น 1280×720px) เพื่อให้แสดงผลสวยที่สุด
- text: คลิกเพื่ออัปโหลดรูปปก อัตราส่วน 16:9 (1280×720px) ขนาดไม่เกิน 2 MB ชื่อหัวข้อสรุป * 0/100 ตัวอักษร
- textbox "เช่น สรุปสูตรฟิสิกส์ ม.4 เทอม 1"
- text: ระดับชั้น *
- combobox:
  - option "เลือกระดับชั้น" [disabled] [selected]
  - option "มัธยมศึกษาตอนต้น"
  - option "มัธยมศึกษาตอนปลาย"
  - option "มหาวิทยาลัย"
- text: บทสรุปย่อ (Summary) * 0/200 ตัวอักษร
- textbox "อธิบายสั้นๆ เกี่ยวกับไฟล์สรุปนี้ (จะนำไปแสดงบนการ์ดในหน้ารายการ) เช่น สรุปฟิสิกส์ ม.4 เทอม 1 เหมาะกับทบทวนสอบกลางภาค..."
- text: "หมวดหมู่วิชาและแฮชแท็ก * วิชาที่เลือก: คณิตศาสตร์ แฮชแท็ก: #คณิต #ม6 #เรียนรู้"
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
- text: ไฟล์เอกสาร PDF (ถ้ามี) PDF ไม่เกิน 20 MB อัปโหลดไฟล์ PDF PDF ไม่เกิน 20 MB รูปภาพประกอบ (0/5) * ไม่เกินรูปละ 2 MB
- button "ยกเลิก"
- button "บันทึกแบบร่าง"
- button "โพสต์สรุปความรู้"
- heading "ตั้งค่าวิชาและแท็ก" [level=2]
- button
- text: หมวดหมู่วิชา *
- combobox:
  - option "เลือกหมวดหมู่วิชา" [disabled]
  - option "คณิตศาสตร์" [selected]
  - option "คอมพิวเตอร์และเทคโนโลยี"
  - option "เคมี"
  - option "ชีววิทยา"
  - option "ฟิสิกส์"
  - option "ภาษาไทย"
  - option "ภาษาอังกฤษ"
  - option "วิทยาศาสตร์"
  - option "สังคมศึกษา"
  - option "อื่นๆ"
- text: "แฮชแท็ก (3/3) กด Enter เพื่อเพิ่มแท็ก #คณิต"
- button
- text: "#ม6"
- button
- text: "#เรียนรู้"
- button
- text: "แท็กแนะนำที่น่าสนใจ:"
- button "#สรุป"
- button "#ความรู้"
- button "#โน้ตเรียน"
- button "#สาระ"
- button "#ทบทวน"
- button "#สรุปย่อ"
- button "#บทเรียน"
- button "#อ่านสอบ"
- button "เสร็จสิ้น"
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
  319 | 
  320 |   test('TC-POST01-022: รูปภาพประกอบเป็นไฟล์ผิดประเภท', async ({ page }) => {
  321 |     await page.getByTestId('supporting-images-file-input').setInputFiles(images.imageGif);
  322 |     await expect(page.getByText('รูปภาพประกอบ (0/5) *', { exact: true })).toBeVisible();
  323 |     await expect(page.getByText('image01.gif', { exact: true })).toHaveCount(0);
  324 |     await expect(page.getByRole('status')).toHaveText('รูปภาพต้องเป็นไฟล์ .jpg, .jpeg, .png, .apng เท่านั้น');
  325 |     await expect(page).toHaveURL(/\/create/);
  326 |   });
  327 | 
  328 |   test('TC-POST01-023: เลือกไฟล์ที่ไม่ใช่ PDF', async ({ page }) => {
  329 |     await page.getByTestId('pdf-file-input').setInputFiles(pdf.docx);
  330 |     await expect(page.getByText('อัปโหลดไฟล์ PDF', { exact: true })).toBeVisible();
  331 |     await expect(page.getByText('document.docx', { exact: true })).toHaveCount(0);
  332 |     await expect(page.getByText('ไฟล์นี้ไม่ใช่ PDF ที่ถูกต้อง')).toBeVisible();
  333 |     await expect(page).toHaveURL(/\/create/);
  334 |   });
  335 | 
  336 |   test('TC-POST01-024: แนบรูปภาพประกอบรูปที่ 6', async ({ page }) => {
  337 |     await page.getByTestId('supporting-images-file-input').setInputFiles(images06);
  338 |     await expect(page.getByRole('status')).toContainText('อัปโหลดรูปภาพประกอบได้สูงสุด 5 รูป');
  339 |     await expect(page.getByText('รูปภาพประกอบ (5/5) *', { exact: true })).toBeVisible();
  340 |     await expect(page.getByRole('img', { name: /^img-\d+$/ })).toHaveCount(5);
  341 |     await expect(page.getByRole('img', { name: 'img-5', exact: true })).toHaveCount(0);
  342 |     await expect(page).toHaveURL(/\/create/);
  343 |   });
  344 | 
  345 |   test('TC-POST01-025: เพิ่มแท็กภาษาไทย', async ({ page }) => {
  346 |     await page.getByTestId('category-tags-settings-button').click();
  347 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  348 |     await page.getByTestId('hashtag-input').fill('#เรียนรู้');
  349 |     await page.getByTestId('hashtag-input').press('Enter');
  350 |     await expect(page.getByText('#เรียนรู้', { exact: true }).first()).toBeVisible();
  351 |   });
  352 | 
  353 |   test('TC-POST01-026: เพิ่มแท็กภาษาอังกฤษ', async ({ page }) => {
  354 |     await page.getByTestId('category-tags-settings-button').click();
  355 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  356 |     await page.getByTestId('hashtag-input').fill('#Learning');
  357 |     await page.getByTestId('hashtag-input').press('Enter');
  358 |     await expect(page.getByText('#Learning', { exact: true }).first()).toBeVisible();
  359 |   });
  360 | 
  361 |   test('TC-POST01-027: เพิ่มแท็กที่มีตัวเลข', async ({ page }) => {
  362 |     await page.getByTestId('category-tags-settings-button').click();
  363 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  364 |     await page.getByTestId('hashtag-input').fill('#Math123');
  365 |     await page.getByTestId('hashtag-input').press('Enter');
  366 |     await expect(page.getByText('#Math123', { exact: true }).first()).toBeVisible();
  367 |   });
  368 | 
  369 |   test('TC-POST01-028: ระบบเติมเครื่องหมาย # ให้แท็กอัตโนมัติ', async ({ page }) => {
  370 |     await page.getByTestId('category-tags-settings-button').click();
  371 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  372 |     await page.getByTestId('hashtag-input').fill('เรียนรู้');
  373 |     await page.getByTestId('hashtag-input').press('Enter');
  374 |     await expect(page.getByText('#เรียนรู้', { exact: true }).first()).toBeVisible();
  375 |   });
  376 | 
  377 |   test('TC-POST01-029: แท็กมีเครื่องหมาย # อยู่แล้ว', async ({ page }) => {
  378 |     await page.getByTestId('category-tags-settings-button').click();
  379 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  380 |     await page.getByTestId('hashtag-input').fill('#เรียนรู้');
  381 |     await page.getByTestId('hashtag-input').press('Enter');
  382 |     await expect(page.getByText('##เรียนรู้', { exact: true })).toHaveCount(0);
  383 |     await expect(page.getByText('#เรียนรู้', { exact: true }).first()).toBeVisible();
  384 |   });
  385 | 
  386 |   test('TC-POST01-030: เพิ่มแท็กครบ 3 แท็ก', async ({ page }) => {
  387 |     await page.getByTestId('category-tags-settings-button').click();
  388 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  389 | 
  390 |     // 1. กรอกและกด Enter ทีละแท็ก
  391 |     const tagInput = page.getByTestId('hashtag-input');
  392 |     await tagInput.fill('#คณิต');
  393 |     await tagInput.press('Enter');
  394 |     await tagInput.fill('#ม6');
  395 |     await tagInput.press('Enter');
  396 |     await tagInput.fill('#เรียนรู้');
  397 |     await tagInput.press('Enter');
  398 | 
  399 |     // 2. กดปุ่ม "ตกลง" เพื่อบันทึกและปิด Modal
  400 |     await page.getByRole('button', { name: 'เสร็จสิ้น' }).or(page.getByTestId('confirm-category-tags-button')).first().click();
  401 | 
  402 |     // 3. ตรวจสอบว่าทั้ง 3 แท็กแสดงบนหน้าฟอร์มหลักเรียบร้อย 
  403 |     await expect(page.getByText('#คณิต', { exact: true })).toBeVisible();
  404 |     await expect(page.getByText('#ม6', { exact: true })).toBeVisible();
  405 |     await expect(page.getByText('#เรียนรู้', { exact: true })).toBeVisible();
  406 |   });
  407 | 
  408 | 
  409 |   test('TC-POST01-031: เพิ่มแท็กรายการที่ 4', async ({ page }) => {
  410 |     await page.getByTestId('category-tags-settings-button').click();
  411 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  412 |     const tagInput = page.getByTestId('hashtag-input');
  413 |     await tagInput.fill('#คณิต');
  414 |     await tagInput.press('Enter');
  415 |     await tagInput.fill('#ม6');
  416 |     await tagInput.press('Enter');
  417 |     await tagInput.fill('#เรียนรู้');
  418 |     await tagInput.press('Enter');
> 419 |     await expect(tagInput).toBeDisabled();
      |                            ^ Error: expect(locator).toBeDisabled() failed
  420 |     await expect(page.getByText('แฮชแท็ก (3/3)', { exact: true })).toBeVisible();
  421 |     await expect(page.getByRole('button', { name: '#สรุปย่อ', exact: true })).toBeDisabled();
  422 |     await expect(page.getByText('#โจทย์', { exact: true })).toHaveCount(0);
  423 |   });
  424 | 
  425 |   test('TC-POST01-032: แท็กมีเครื่องหมายขีดกลาง', async ({ page }) => {
  426 |     await page.getByTestId('category-tags-settings-button').click();
  427 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  428 |     await page.getByTestId('hashtag-input').fill('#QA-Test');
  429 |     await page.getByTestId('hashtag-input').press('Enter');
  430 |     await expect(page.getByText('#QA-Test', { exact: true })).toHaveCount(0);
  431 |     await expect(page.getByText(/แท็กต้องไม่มีอักษรพิเศษ/i)).toBeVisible();
  432 |   });
  433 | 
  434 |   test('TC-POST01-033: แท็กมีเครื่องหมายขีดล่าง', async ({ page }) => {
  435 |     await page.getByTestId('category-tags-settings-button').click();
  436 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  437 |     await page.getByTestId('hashtag-input').fill('#QA_Test');
  438 |     await page.getByTestId('hashtag-input').press('Enter');
  439 |     await expect(page.getByText('#QA_Test', { exact: true })).toHaveCount(0);
  440 |     await expect(page.getByText(/แท็กต้องไม่มีอักษรพิเศษ/i)).toBeVisible();
  441 |   });
  442 | 
  443 |   test('TC-POST01-034: แท็กมีเครื่องหมาย @', async ({ page }) => {
  444 |     await page.getByTestId('category-tags-settings-button').click();
  445 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  446 |     await page.getByTestId('hashtag-input').fill('#QA@Test');
  447 |     await page.getByTestId('hashtag-input').press('Enter');
  448 |     await expect(page.getByText('#QA@Test', { exact: true })).toHaveCount(0);
  449 |     await expect(page.getByText(/แท็กต้องไม่มีอักษรพิเศษ/i)).toBeVisible();
  450 |   });
  451 | 
  452 |   test('TC-POST01-035: แท็กมีความยาว 10 ตัวอักษร (รวม #)', async ({ page }) => {
  453 |     await page.getByTestId('category-tags-settings-button').click();
  454 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  455 |     // #123456789 ความยาว 10 ตัวอักษรรวมเครื่องหมาย #
  456 |     await page.getByTestId('hashtag-input').fill('#123456789');
  457 |     await page.getByTestId('hashtag-input').press('Enter');
  458 |     await expect(page.getByText('#123456789', { exact: true }).first()).toBeVisible();
  459 |   });
  460 | 
  461 |   test('TC-POST01-036: แท็กมีความยาว 11 ตัวอักษร (รวม #)', async ({ page }) => {
  462 |     await page.getByTestId('category-tags-settings-button').click();
  463 |     await page.getByTestId('category-select').selectOption({ label: 'คณิตศาสตร์' });
  464 |     // #1234567890 ความยาว 11 ตัวอักษรรวมเครื่องหมาย #
  465 |     await page.getByTestId('hashtag-input').fill('#1234567890');
  466 |     await page.getByTestId('hashtag-input').press('Enter');
  467 |     await expect(page.getByText('#1234567890', { exact: true })).toHaveCount(0);
  468 |     await expect(page.getByText('แท็กต้องมีความยาวไม่เกิน 10 ตัวอักษร', { exact: true })).toBeVisible();
  469 |   });
  470 | 
  471 |   test('TC-POST01-037: แนบไฟล์ PDF จำนวน 1 ไฟล์', async ({ page }) => {
  472 |     await page.getByTestId('pdf-file-input').setInputFiles(pdf.normal);
  473 |     await expect(page.getByText('document.pdf', { exact: true })).toBeVisible();
  474 |     await expect(page.getByTestId('remove-pdf-button')).toBeVisible();
  475 |   });
  476 | 
  477 |   test('TC-POST01-038: เผยแพร่โพสต์สำเร็จเมื่อกรอกข้อมูลครบถ้วน', async ({ page, artifacts }) => {
  478 |     test.setTimeout(120_000);
  479 |     const title = generateUniqueTitle('TC-POST01-038 ทบทวนแคลคูลัส');
  480 |     const postUrl = await publishPost(page, artifacts, {
  481 |       title, summary: 'สรุปสูตรอนุพันธ์', withPdf: true, tag: '#สรุปย่อ',
  482 |     });
  483 |     await expect(page).toHaveURL(postUrl);
  484 |     await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  485 |     await expect(page.getByText('คณิตศาสตร์', { exact: true }).first()).toBeVisible();
  486 |     await expect(page.getByText('มัธยมศึกษาตอนปลาย', { exact: true }).first()).toBeVisible();
  487 |     await expect(page.getByText('สรุปสูตรอนุพันธ์', { exact: true })).toBeVisible();
  488 |     await expect(page.getByText('เนื้อหาตัวอย่างสำหรับทดสอบ TC-02', { exact: true })).toBeVisible();
  489 |     await expect(page.getByRole('img', { name: 'gallery-0', exact: true })).toBeVisible();
  490 |     await expect(page.getByText('document.pdf', { exact: true })).toBeVisible();
  491 |     await expect(page.getByRole('button', { name: 'ดาวน์โหลด', exact: true })).toBeVisible();
  492 |     await expect(page.getByText('#สรุปย่อ', { exact: true })).toBeVisible();
  493 |   });
  494 | 
  495 | });
  496 | 
```