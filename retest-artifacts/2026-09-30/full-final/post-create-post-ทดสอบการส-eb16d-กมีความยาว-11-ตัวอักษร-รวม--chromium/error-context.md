# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: post\create-post.spec.js >> ทดสอบการสร้างโพสต์ >> TC-POST01-036: แท็กมีความยาว 11 ตัวอักษร (รวม #)
- Location: tests\post\create-post.spec.js:461:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByText('#1234567890', { exact: true })
Expected: 0
Received: 2
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" getByText('#1234567890', { exact: true }) with timeout 5000ms
  - waiting for getByText('#1234567890', { exact: true })
    14 × locator resolved to 2 elements
       - unexpected value "2"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e5]:
    - generic [ref=e6]:
      - link "SHARE-ED SHARE-ED" [ref=e7] [cursor=pointer]:
        - /url: /
        - img "SHARE-ED" [ref=e8]
        - generic [ref=e9]: SHARE-ED
      - generic [ref=e11]:
        - link "หน้าหลัก" [ref=e12] [cursor=pointer]:
          - /url: /home
        - link "สำรวจเนื้อหา" [ref=e13] [cursor=pointer]:
          - /url: /explore
        - link "โพสต์ยอดนิยม" [ref=e14] [cursor=pointer]:
          - /url: /trending
      - generic [ref=e15]:
        - button "สร้างโพสต์" [ref=e16] [cursor=pointer]
        - button "การแจ้งเตือน 0 รายการที่ยังไม่อ่าน" [ref=e24]
        - link "ความสำเร็จ" [ref=e28] [cursor=pointer]:
          - /url: /achievements
        - button "เมนูผู้ใช้" [ref=e36]
  - generic [ref=e43]:
    - generic [ref=e44]:
      - generic [ref=e46]:
        - heading "สร้างโพสต์สรุปความรู้" [level=1] [ref=e47]
        - paragraph [ref=e48]: แบ่งปันความรู้ของคุณให้เพื่อนๆ ได้เรียนรู้ไปด้วยกัน
      - generic [ref=e49]:
        - generic [ref=e50]:
          - generic [ref=e51]:
            - generic [ref=e52]:
              - generic [ref=e53]: รูปปก *
              - generic [ref=e54]: ไม่เกิน 2 MB
            - paragraph [ref=e55]: แนะนำอัตราส่วน 16:9 (เช่น 1280×720px) เพื่อให้แสดงผลสวยที่สุด
            - generic [ref=e56] [cursor=pointer]:
              - generic [ref=e61]: คลิกเพื่ออัปโหลดรูปปก
              - generic [ref=e62]: อัตราส่วน 16:9 (1280×720px) ขนาดไม่เกิน 2 MB
          - generic [ref=e63]:
            - generic [ref=e64]:
              - generic [ref=e65]: ชื่อหัวข้อสรุป *
              - generic [ref=e66]: 0/100 ตัวอักษร
            - textbox "เช่น สรุปสูตรฟิสิกส์ ม.4 เทอม 1" [ref=e67]
            - generic [ref=e68]:
              - generic [ref=e69]:
                - text: ระดับชั้น
                - generic [ref=e73]: "*"
              - combobox [ref=e74]:
                - option "เลือกระดับชั้น" [disabled] [selected]
                - option "มัธยมศึกษาตอนต้น"
                - option "มัธยมศึกษาตอนปลาย"
                - option "มหาวิทยาลัย"
        - generic [ref=e75]:
          - generic [ref=e76]:
            - generic [ref=e77]:
              - text: บทสรุปย่อ (Summary)
              - generic [ref=e81]: "*"
            - generic [ref=e82]: 0/200 ตัวอักษร
          - textbox "อธิบายสั้นๆ เกี่ยวกับไฟล์สรุปนี้ (จะนำไปแสดงบนการ์ดในหน้ารายการ) เช่น สรุปฟิสิกส์ ม.4 เทอม 1 เหมาะกับทบทวนสอบกลางภาค..." [ref=e83]
        - generic [ref=e84]:
          - generic [ref=e85]:
            - text: หมวดหมู่วิชาและแฮชแท็ก
            - generic [ref=e89]: "*"
          - generic [ref=e90] [cursor=pointer]:
            - generic [ref=e91]:
              - generic [ref=e92]:
                - generic [ref=e93]: "วิชาที่เลือก:"
                - generic [ref=e94]: คณิตศาสตร์
              - generic [ref=e95]:
                - generic [ref=e96]: "แฮชแท็ก:"
                - generic [ref=e97]: "#1234567890"
            - button "ตั้งค่าวิชาและแท็ก" [ref=e99]
        - generic [ref=e101]:
          - generic [ref=e102]:
            - text: รายละเอียดเพิ่มเติม
            - generic [ref=e104]: "*"
          - generic [ref=e105]:
            - generic [ref=e107]:
              - toolbar [ref=e108]:
                - generic [ref=e110]:
                  - button "Normal" [ref=e111] [cursor=pointer]
                  - text: Heading 1 Heading 2 Heading 3 Normal
                - generic [ref=e115]:
                  - button "bold" [ref=e116] [cursor=pointer]
                  - button "italic" [ref=e120] [cursor=pointer]
                  - button "underline" [ref=e123] [cursor=pointer]
                  - button "strike" [ref=e127] [cursor=pointer]
                - generic [ref=e132]:
                  - button [ref=e134] [cursor=pointer]
                  - button [ref=e138] [cursor=pointer]
                - generic [ref=e188]:
                  - 'button "list: ordered" [ref=e189] [cursor=pointer]'
                  - 'button "list: bullet" [ref=e194] [cursor=pointer]'
                  - 'button "indent: -1" [ref=e196] [cursor=pointer]'
                  - 'button "indent: +1" [ref=e199] [cursor=pointer]'
                - button [ref=e204] [cursor=pointer]
                - generic [ref=e206]:
                  - button "blockquote" [ref=e207] [cursor=pointer]
                  - button "link" [ref=e213] [cursor=pointer]
                  - button "image" [ref=e218] [cursor=pointer]
                - button "clean" [ref=e224] [cursor=pointer]
              - generic [ref=e230]:
                - generic [ref=e231]:
                  - text: อธิบายเพิ่มเติมเกี่ยวกับเนื้อหา เทคนิคการจำ หรือที่มา...
                  - paragraph [ref=e232]
                - text: "Visit URL: EditRemove"
            - paragraph [ref=e233]: เพิ่มรูปจากปุ่มใน toolbar, ลากไฟล์ หรือวางจาก clipboard (สูงสุด 5 รูป, JPEG, PNG และ WEBP, รูปละไม่เกิน 2 MB)
        - generic [ref=e238]:
          - generic [ref=e239]:
            - generic [ref=e240]:
              - generic [ref=e241]: ไฟล์เอกสาร PDF (ถ้ามี)
              - generic [ref=e242]: PDF ไม่เกิน 20 MB
            - generic [ref=e243] [cursor=pointer]:
              - generic [ref=e247]: อัปโหลดไฟล์ PDF
              - generic [ref=e248]: PDF ไม่เกิน 20 MB
          - generic [ref=e249]:
            - generic [ref=e250]:
              - generic [ref=e251]: รูปภาพประกอบ (0/5) *
              - generic [ref=e252]: ไม่เกินรูปละ 2 MB
            - generic [ref=e255] [cursor=pointer]
      - generic [ref=e257]:
        - button "ยกเลิก" [ref=e258] [cursor=pointer]
        - generic [ref=e259]:
          - button "บันทึกแบบร่าง" [ref=e260] [cursor=pointer]
          - button "โพสต์สรุปความรู้" [ref=e266] [cursor=pointer]
    - generic [ref=e269]:
      - generic [ref=e270]:
        - heading "ตั้งค่าวิชาและแท็ก" [level=2] [ref=e271]
        - button [ref=e275] [cursor=pointer]
      - generic [ref=e279]:
        - generic [ref=e280]:
          - generic [ref=e281]:
            - text: หมวดหมู่วิชา
            - generic [ref=e284]: "*"
          - combobox [ref=e285] [cursor=pointer]:
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
        - generic [ref=e286]:
          - generic [ref=e287]:
            - generic [ref=e288]: แฮชแท็ก (1/3)
            - generic [ref=e292]: กด Enter เพื่อเพิ่มแท็ก
          - generic [ref=e293]:
            - generic [ref=e294]:
              - text: "#1234567890"
              - button [ref=e295] [cursor=pointer]
            - textbox [active] [ref=e299]
          - generic [ref=e300]:
            - generic [ref=e301]: "แท็กแนะนำที่น่าสนใจ:"
            - generic [ref=e302]:
              - button "#สรุป" [ref=e303] [cursor=pointer]
              - button "#ความรู้" [ref=e304] [cursor=pointer]
              - button "#โน้ตเรียน" [ref=e305] [cursor=pointer]
              - button "#สาระ" [ref=e306] [cursor=pointer]
              - button "#ทบทวน" [ref=e307] [cursor=pointer]
              - button "#สรุปย่อ" [ref=e308] [cursor=pointer]
              - button "#บทเรียน" [ref=e309] [cursor=pointer]
              - button "#อ่านสอบ" [ref=e310] [cursor=pointer]
      - button "เสร็จสิ้น" [ref=e312] [cursor=pointer]
  - contentinfo [ref=e313]:
    - generic [ref=e315]:
      - generic [ref=e316]:
        - generic [ref=e317]:
          - img "SHARE-ED" [ref=e318]
          - generic [ref=e319]: SHARE-ED
        - paragraph [ref=e320]: พื้นที่สำหรับแบ่งปันความรู้ดีๆ เพื่อการศึกษาไทย
      - generic [ref=e321]:
        - generic [ref=e326]:
          - link "ติดต่อแอดมิน" [ref=e327] [cursor=pointer]:
            - /url: mailto:share_ed@gmail.com
          - generic [ref=e328]: share_ed@gmail.com
        - link "เกี่ยวกับเรา" [ref=e334] [cursor=pointer]:
          - /url: /
```

# Test source

```ts
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
  419 |     await expect(tagInput).toBeDisabled();
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
> 467 |     await expect(page.getByText('#1234567890', { exact: true })).toHaveCount(0);
      |                                                                  ^ Error: expect(locator).toHaveCount(expected) failed
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