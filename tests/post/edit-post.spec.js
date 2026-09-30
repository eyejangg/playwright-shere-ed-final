// @ts-check
const { images, pdf, images06, generateUniqueTitle } = require('../../test-data/test-data');
const {
  test, expect, editPath, publishPost, openEditFromPost, openOwnProfileTab,
} = require('./post-helpers');

function saveEditButton(page) {
  return page.getByRole('button', { name: /^(บันทึกการแก้ไข|บันทึกและโพสต์)$/ });
}

test.describe('TC-POST03 แก้ไขโพสต์', () => {
  test('TC-POST03-001,003,005,008,017,021,022,025: แก้ไขโพสต์เดิมและตรวจหลัง Refresh', async ({ page, artifacts }) => {
    test.setTimeout(150_000);
    const title = generateUniqueTitle('TC-POST03-003 โพสต์เดิม');
    const updatedTitle = generateUniqueTitle('TC-POST03-003 โพสต์แก้ไข');
    const postUrl = await publishPost(page, artifacts, { title });
    const originalCover = await page.getByRole('img', { name: title, exact: true }).getAttribute('src');
    const { editUrl } = await openEditFromPost(page, title);

    await expect(page).toHaveURL(editPath);
    artifacts.rename(title, updatedTitle);
    await page.getByTestId('edit-post-title-input').fill(updatedTitle);
    await page.getByTestId('edit-post-summary-input').fill('บทสรุปที่แก้ไขแล้ว');
    await page.getByTestId('remove-edit-cover-button').click();
    await page.getByTestId('edit-cover-file-input').setInputFiles(images.coverPng);
    await saveEditButton(page).click();
    await expect(page.getByRole('dialog', { name: /บันทึกการแก้ไขสำเร็จ|แก้ไขสำเร็จ/ })).toBeVisible({ timeout: 60_000 });
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    await page.goto(postUrl);
    await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toBeVisible();
    await expect(page.getByText('บทสรุปที่แก้ไขแล้ว', { exact: true })).toBeVisible();
    const cover = page.getByRole('img', { name: updatedTitle, exact: true });
    await expect(cover).toBeVisible();
    expect(await cover.getAttribute('src')).not.toBe(originalCover);
    const updatedCover = await cover.getAttribute('src');
    await page.reload();
    await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toBeVisible();
    await expect(page.getByText('บทสรุปที่แก้ไขแล้ว', { exact: true })).toBeVisible();
    await expect(cover).toHaveAttribute('src', updatedCover);
    expect(new URL(page.url()).pathname).toBe(new URL(postUrl).pathname);
    expect(new URL(editUrl).pathname.split('/').pop()).toBe(new URL(postUrl).pathname.split('/').pop());
    await openOwnProfileTab(page, 'posts');
    await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toHaveCount(1);
    await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  });

  test('TC-POST03-009,010,013,016,018,020: Validation บนหน้าแก้ไขจริง', async ({ page, artifacts }) => {
    test.setTimeout(150_000);
    const title = generateUniqueTitle('TC-POST03 ตรวจ Validation');
    await publishPost(page, artifacts, { title });
    await openEditFromPost(page, title);
    await expect(page).toHaveURL(editPath);

    await page.getByTestId('remove-edit-cover-button').click();
    await page.getByTestId('edit-cover-file-input').setInputFiles(images.coverOver2MB);
    await expect(page.getByRole('status').filter({ hasText: 'รูปหน้าปกต้องมีขนาดไม่เกิน 2 MB' }).last()).toBeVisible();
    await page.getByTestId('edit-cover-file-input').setInputFiles(require('node:path').resolve('test-data/images/cover.webp'));
    await expect(page.getByRole('status').filter({ hasText: 'รูปภาพหน้าปกต้องเป็นไฟล์ .jpg, .jpeg, .png, .apng เท่านั้น' }).last()).toBeVisible();
    await page.getByTestId('edit-cover-file-input').setInputFiles(images.coverJpg);
    await page.getByTestId('edit-supporting-images-file-input').setInputFiles(images06);
    await expect(page.getByRole('status').filter({ hasText: 'อัปโหลดรูปภาพประกอบได้สูงสุด 5 รูป' }).last()).toBeVisible();
    await expect(page.getByText('รูปภาพประกอบ (5/5) *', { exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'img-5' })).toHaveCount(0);
    await page.getByTestId('edit-pdf-file-input').setInputFiles(pdf.docx);
    await expect(page.getByText(/ไฟล์นี้ไม่ใช่ PDF ที่ถูกต้อง|สามารถอัปโหลดไฟล์ \.pdf เท่านั้น/)).toBeVisible();

    await page.getByTestId('edit-post-title-input').fill('');
    await saveEditButton(page).click();
    await expect(page.getByText('กรุณากรอกชื่อหัวข้อสรุปความรู้')).toBeVisible();
    await expect(page).toHaveURL(editPath);
    await page.getByTestId('edit-post-title-input').fill(title);
    await page.getByTestId('edit-post-summary-input').fill('');
    await saveEditButton(page).click();
    await expect(page.getByText('กรุณากรอกบทสรุปย่อ')).toBeVisible();
    await expect(page).toHaveURL(editPath);
  });

});
