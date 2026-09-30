# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: post\draft-post.spec.js >> TC-POST02 แบบร่าง >> TC-POST02-011,012: แบบร่างข้อมูลไม่ครบเผยแพร่ไม่ได้ แล้วเผยแพร่ด้วย ID เดิม
- Location: tests\post\draft-post.spec.js:48:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog', { name: /สำเร็จ/ })
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('dialog', { name: /สำเร็จ/ }) with timeout 60000ms
  - waiting for getByRole('dialog', { name: /สำเร็จ/ })

```

```yaml
- dialog "เกิดข้อผิดพลาด":
  - heading "เกิดข้อผิดพลาด" [level=2]
  - text: Failed to update post
  - button "OK"
```

# Test source

```ts
  1  | // @ts-check
  2  | const { generateUniqueTitle } = require('../../test-data/test-data');
  3  | const {
  4  |   test, expect, editPath, saveDraft, openOwnProfileTab,
  5  |   fillRequiredFields, deleteCurrentPost,
  6  | } = require('./post-helpers');
  7  | 
  8  | test.describe('TC-POST02 แบบร่าง', () => {
  9  |   test('TC-POST02-002,005,007,013,014,019,020: บันทึกแบบร่างและตรวจข้อมูลหลัง Refresh', async ({ page, artifacts }) => {
  10 |     const title = generateUniqueTitle('TC-POST02-002 แบบร่าง');
  11 |     const summary = 'ข้อมูลแบบร่างต้องคงอยู่หลัง Refresh';
  12 |     const editUrl = await saveDraft(page, artifacts, { title, summary });
  13 | 
  14 |     await expect(page).toHaveURL(editPath);
  15 |     await page.reload();
  16 |     await expect(page.getByTestId('edit-post-title-input')).toHaveValue(title);
  17 |     await expect(page.getByTestId('edit-post-summary-input')).toHaveValue(summary);
  18 |     await page.goto(editUrl);
  19 |     await expect(page.getByTestId('edit-post-title-input')).toHaveValue(title);
  20 | 
  21 |     await openOwnProfileTab(page, 'drafts');
  22 |     await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  23 |     await page.goto('/explore');
  24 |     await page.waitForLoadState('networkidle');
  25 |     await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  26 |   });
  27 | 
  28 |   test('TC-POST02-009: แก้ไขแบบร่างและบันทึกซ้ำใน URL เดิม', async ({ page, artifacts }) => {
  29 |     const title = generateUniqueTitle('TC-POST02-009 แบบร่างเดิม');
  30 |     const updatedTitle = generateUniqueTitle('TC-POST02-009 แบบร่างแก้ไข');
  31 |     const editUrl = await saveDraft(page, artifacts, { title });
  32 | 
  33 |     artifacts.rename(title, updatedTitle);
  34 |     await page.getByTestId('edit-post-title-input').fill(updatedTitle);
  35 |     await page.getByTestId('edit-post-summary-input').fill('บันทึกครั้งที่สอง');
  36 |     await page.getByRole('button', { name: 'บันทึกแบบร่าง' }).click();
  37 |     await expect(page.getByRole('dialog', { name: 'บันทึกสำเร็จ!' })).toBeVisible({ timeout: 30_000 });
  38 |     await page.getByRole('button', { name: 'OK', exact: true }).click();
  39 | 
  40 |     await page.goto(editUrl);
  41 |     await expect(page.getByTestId('edit-post-title-input')).toHaveValue(updatedTitle);
  42 |     await expect(page.getByTestId('edit-post-summary-input')).toHaveValue('บันทึกครั้งที่สอง');
  43 |     await openOwnProfileTab(page, 'drafts');
  44 |     await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toHaveCount(1);
  45 |     await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  46 |   });
  47 | 
  48 |   test('TC-POST02-011,012: แบบร่างข้อมูลไม่ครบเผยแพร่ไม่ได้ แล้วเผยแพร่ด้วย ID เดิม', async ({ page, artifacts }) => {
  49 |     test.setTimeout(120_000);
  50 |     const title = generateUniqueTitle('TC-POST02-011 เผยแพร่แบบร่าง');
  51 |     const editUrl = await saveDraft(page, artifacts, { title });
  52 |     const id = new URL(editUrl).pathname.split('/').pop();
  53 |     expect(id).toBeTruthy();
  54 | 
  55 |     await fillRequiredFields(page, { title });
  56 |     await page.getByTestId('edit-post-title-input').fill('');
  57 |     await page.getByRole('button', { name: 'บันทึกและโพสต์' }).click();
  58 |     await expect(page).toHaveURL(editPath);
  59 |     await expect(page.getByText('กรุณากรอกชื่อหัวข้อสรุปความรู้', { exact: true })).toBeVisible();
  60 | 
  61 |     await page.getByTestId('edit-post-title-input').fill(title);
  62 |     await page.getByRole('button', { name: 'บันทึกและโพสต์' }).click();
> 63 |     await expect(page.getByRole('dialog', { name: /สำเร็จ/ })).toBeVisible({ timeout: 60_000 });
     |                                                                ^ Error: expect(locator).toBeVisible() failed
  64 |     await page.getByRole('button', { name: 'OK', exact: true }).click();
  65 |     await openOwnProfileTab(page, 'posts');
  66 |     await page.getByRole('heading', { name: title, exact: true }).click();
  67 |     await expect(page).toHaveURL(new RegExp(`/post/${id}$`));
  68 |     await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  69 |     artifacts.rememberUrl(title, page.url());
  70 |   });
  71 | 
  72 |   test('TC-POST02-015: ลบแบบร่างของตนเอง', async ({ page, artifacts }) => {
  73 |     const title = generateUniqueTitle('TC-POST02-015 ลบแบบร่าง');
  74 |     const editUrl = await saveDraft(page, artifacts, { title });
  75 |     await deleteCurrentPost(page);
  76 |     await openOwnProfileTab(page, 'drafts');
  77 |     await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  78 |     await page.goto(editUrl);
  79 |     await expect(page.getByTestId('edit-post-title-input')).toHaveCount(0);
  80 |   });
  81 | });
  82 | 
```