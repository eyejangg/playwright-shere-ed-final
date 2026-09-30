// @ts-check
const { generateUniqueTitle } = require('../../test-data/test-data');
const {
  test, expect, editPath, saveDraft, openOwnProfileTab,
  fillRequiredFields, deleteCurrentPost,
} = require('./post-helpers');

test.describe('TC-POST02 แบบร่าง', () => {
  test('TC-POST02-002,005,007,013,014,019,020: บันทึกแบบร่างและตรวจข้อมูลหลัง Refresh', async ({ page, artifacts }) => {
    const title = generateUniqueTitle('TC-POST02-002 แบบร่าง');
    const summary = 'ข้อมูลแบบร่างต้องคงอยู่หลัง Refresh';
    const editUrl = await saveDraft(page, artifacts, { title, summary });

    await expect(page).toHaveURL(editPath);
    await page.reload();
    await expect(page.getByTestId('edit-post-title-input')).toHaveValue(title);
    await expect(page.getByTestId('edit-post-summary-input')).toHaveValue(summary);
    await page.goto(editUrl);
    await expect(page.getByTestId('edit-post-title-input')).toHaveValue(title);

    await openOwnProfileTab(page, 'drafts');
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  });

  test('TC-POST02-009: แก้ไขแบบร่างและบันทึกซ้ำใน URL เดิม', async ({ page, artifacts }) => {
    const title = generateUniqueTitle('TC-POST02-009 แบบร่างเดิม');
    const updatedTitle = generateUniqueTitle('TC-POST02-009 แบบร่างแก้ไข');
    const editUrl = await saveDraft(page, artifacts, { title });

    artifacts.rename(title, updatedTitle);
    await page.getByTestId('edit-post-title-input').fill(updatedTitle);
    await page.getByTestId('edit-post-summary-input').fill('บันทึกครั้งที่สอง');
    await page.getByRole('button', { name: 'บันทึกแบบร่าง' }).click();
    await expect(page.getByRole('dialog', { name: 'บันทึกการแก้ไขสำเร็จ!' })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    await page.goto(editUrl);
    await expect(page.getByTestId('edit-post-title-input')).toHaveValue(updatedTitle);
    await expect(page.getByTestId('edit-post-summary-input')).toHaveValue('บันทึกครั้งที่สอง');
    await openOwnProfileTab(page, 'drafts');
    await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toHaveCount(1);
    await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  });

  test('TC-POST02-011,012: แบบร่างข้อมูลไม่ครบเผยแพร่ไม่ได้ แล้วเผยแพร่ด้วย ID เดิม', async ({ page, artifacts }) => {
    test.setTimeout(120_000);
    const title = generateUniqueTitle('TC-POST02-011 เผยแพร่แบบร่าง');
    const editUrl = await saveDraft(page, artifacts, { title });
    const id = new URL(editUrl).pathname.split('/').pop();
    expect(id).toBeTruthy();

    await fillRequiredFields(page, { title });
    await page.getByTestId('edit-post-title-input').fill('');
    await page.getByRole('button', { name: 'บันทึกและโพสต์' }).click();
    await expect(page).toHaveURL(editPath);
    await expect(page.getByText('กรุณากรอกชื่อหัวข้อสรุปความรู้', { exact: true })).toBeVisible();

    await page.getByTestId('edit-post-title-input').fill(title);
    await page.getByRole('button', { name: 'บันทึกและโพสต์' }).click();
    await expect(page.getByRole('dialog', { name: /สำเร็จ/ })).toBeVisible({ timeout: 60_000 });
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await openOwnProfileTab(page, 'posts');
    await page.getByRole('heading', { name: title, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/post/${id}$`));
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    artifacts.rememberUrl(title, page.url());
  });

  test('TC-POST02-015: ลบแบบร่างของตนเอง', async ({ page, artifacts }) => {
    const title = generateUniqueTitle('TC-POST02-015 ลบแบบร่าง');
    const editUrl = await saveDraft(page, artifacts, { title });
    await deleteCurrentPost(page);
    await openOwnProfileTab(page, 'drafts');
    await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
    await page.goto(editUrl);
    await expect(page.getByTestId('edit-post-title-input')).toHaveCount(0);
  });
});
