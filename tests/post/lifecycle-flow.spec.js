// @ts-check
const { generateUniqueTitle } = require('../../test-data/test-data');
const {
  test, expect, publishPost, openEditFromPost, openOwnProfileTab, deleteCurrentPost,
} = require('./post-helpers');

test('TC-LIFE-001: สร้างโพสต์ ตรวจรายละเอียด แก้ไข Refresh และลบ', async ({ page, artifacts }) => {
  test.setTimeout(180_000);
  const title = generateUniqueTitle('TC-LIFE-001 โพสต์เริ่มต้น');
  const updatedTitle = generateUniqueTitle('TC-LIFE-001 โพสต์แก้ไข');
  const postUrl = await publishPost(page, artifacts, {
    title, summary: 'บทสรุปก่อนแก้ไข', category: 'วิทยาศาสตร์', withPdf: true,
  });
  await expect(page.getByText('บทสรุปก่อนแก้ไข', { exact: true })).toBeVisible();
  await expect(page.getByText('document.pdf', { exact: true })).toBeVisible();

  const { editUrl } = await openEditFromPost(page, title);
  expect(new URL(editUrl).pathname.split('/').pop()).toBe(new URL(postUrl).pathname.split('/').pop());
  artifacts.rename(title, updatedTitle);
  await page.getByTestId('edit-post-title-input').fill(updatedTitle);
  await page.getByTestId('edit-post-summary-input').fill('บทสรุปหลังแก้ไข');
  await page.getByTestId('update-post-button').click();
  await expect(page.getByRole('dialog', { name: 'บันทึกการแก้ไขสำเร็จ!' })).toBeVisible({ timeout: 60_000 });
  await page.getByRole('button', { name: 'OK', exact: true }).click();

  await page.goto(postUrl);
  await page.reload();
  await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toBeVisible();
  await expect(page.getByText('บทสรุปหลังแก้ไข', { exact: true })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(new URL(postUrl).pathname);

  await deleteCurrentPost(page);
  await openOwnProfileTab(page, 'posts');
  await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toHaveCount(0);
  await page.goto(postUrl);
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'ลบโพสต์', exact: true })).toHaveCount(0);
});
