# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: post\delete-post.spec.js >> TC-POST04 ลบโพสต์ >> TC-POST04-005,006,007,014,015: ลบแล้วรายการและ URL เดิมไม่แสดงโพสต์
- Location: tests\post\delete-post.spec.js:22:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('heading', { name: 'TC-POST04-005 ลบจริง local-70b18144', exact: true })
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" getByRole('heading', { name: 'TC-POST04-005 ลบจริง local-70b18144', exact: true }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'TC-POST04-005 ลบจริง local-70b18144', exact: true })
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=f10e3]:
  - navigation [ref=f10e5]:
    - generic [ref=f10e6]:
      - link "SHARE-ED SHARE-ED" [ref=f10e7] [cursor=pointer]:
        - /url: /
        - img "SHARE-ED" [ref=f10e8]
        - generic [ref=f10e9]: SHARE-ED
      - generic [ref=f10e11]:
        - link "หน้าหลัก" [ref=f10e12] [cursor=pointer]:
          - /url: /home
        - link "สำรวจเนื้อหา" [ref=f10e13] [cursor=pointer]:
          - /url: /explore
        - link "โพสต์ยอดนิยม" [ref=f10e14] [cursor=pointer]:
          - /url: /trending
      - generic [ref=f10e15]:
        - button "สร้างโพสต์" [ref=f10e16] [cursor=pointer]
        - button "การแจ้งเตือน 0 รายการที่ยังไม่อ่าน" [ref=f10e24]
        - link "ความสำเร็จ" [ref=f10e28] [cursor=pointer]:
          - /url: /achievements
        - button "เมนูผู้ใช้" [ref=f10e36]
  - status [ref=f10e43]:
    - generic [ref=f10e44]:
      - heading "ไม่พบโพสต์ที่คุณต้องการ" [level=1] [ref=f10e49]
      - paragraph [ref=f10e50]: โพสต์นี้อาจไม่มีอยู่ หรือ URL ที่เปิดไม่ถูกต้อง
      - link "กลับหน้า Home" [ref=f10e51] [cursor=pointer]:
        - /url: /home
  - contentinfo [ref=f10e52]:
    - generic [ref=f10e54]:
      - generic [ref=f10e55]:
        - generic [ref=f10e56]:
          - img "SHARE-ED" [ref=f10e57]
          - generic [ref=f10e58]: SHARE-ED
        - paragraph [ref=f10e59]: พื้นที่สำหรับแบ่งปันความรู้ดีๆ เพื่อการศึกษาไทย
      - generic [ref=f10e60]:
        - generic [ref=f10e65]:
          - link "ติดต่อแอดมิน" [ref=f10e66] [cursor=pointer]:
            - /url: mailto:share_ed@gmail.com
          - generic [ref=f10e67]: share_ed@gmail.com
        - link "เกี่ยวกับเรา" [ref=f10e73] [cursor=pointer]:
          - /url: /
```

# Test source

```ts
  1  | // @ts-check
  2  | const { generateUniqueTitle } = require('../../test-data/test-data');
  3  | const {
  4  |   test, expect, publishPost, openOwnProfileTab,
  5  |   deleteCurrentPost,
  6  | } = require('./post-helpers');
  7  | 
  8  | test.describe('TC-POST04 ลบโพสต์', () => {
  9  |   test('TC-POST04-001,003,004,008: เจ้าของเห็นปุ่มลบและยกเลิกได้', async ({ page, artifacts }) => {
  10 |     const title = generateUniqueTitle('TC-POST04-003 ยกเลิกการลบ');
  11 |     await publishPost(page, artifacts, { title });
  12 |     await expect(page.getByRole('button', { name: 'ลบโพสต์' })).toBeVisible();
  13 |     await page.getByRole('button', { name: 'ลบโพสต์' }).click();
  14 |     await expect(page.getByRole('dialog', { name: /คุณต้องการลบโพสต์/ })).toBeVisible();
  15 |     await expect(page.getByRole('dialog').getByText(title, { exact: false })).toBeVisible();
  16 |     await page.getByRole('button', { name: 'ยกเลิก' }).click();
  17 |     await expect(page.getByRole('dialog', { name: /คุณต้องการลบโพสต์/ })).toBeHidden();
  18 |     await page.reload();
  19 |     await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  20 |   });
  21 | 
  22 |   test('TC-POST04-005,006,007,014,015: ลบแล้วรายการและ URL เดิมไม่แสดงโพสต์', async ({ page, artifacts }) => {
  23 |     const title = generateUniqueTitle('TC-POST04-005 ลบจริง');
  24 |     const postUrl = await publishPost(page, artifacts, { title });
  25 |     await deleteCurrentPost(page);
  26 |     await openOwnProfileTab(page, 'posts');
  27 |     await page.reload();
  28 |     await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  29 |     await page.goto('/explore');
  30 |     await page.waitForLoadState('networkidle');
> 31 |     await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
     |                                                                           ^ Error: expect(locator).toHaveCount(expected) failed
  32 |     await page.goto(postUrl);
  33 |     await expect(page.getByText(/โพสต์ของคุณถูกลบไปแล้ว|โพสต์นี้ถูกลบไปแล้ว|ไม่พบโพสต์/).first()).toBeVisible({ timeout: 10_000 });
  34 |     await expect(page.getByRole('button', { name: 'ลบโพสต์' })).toHaveCount(0);
  35 |   });
  36 | 
  37 | });
  38 | 
```