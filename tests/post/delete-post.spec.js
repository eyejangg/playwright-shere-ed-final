// @ts-check
const { generateUniqueTitle } = require('../../test-data/test-data');
const {
  test, expect, publishPost, openOwnProfileTab,
  deleteCurrentPost,
} = require('./post-helpers');

test.describe('TC-POST04 ลบโพสต์', () => {
  test('TC-POST04-001,003,004,008: เจ้าของเห็นปุ่มลบและยกเลิกได้', async ({ page, artifacts }) => {
    const title = generateUniqueTitle('TC-POST04-003 ยกเลิกการลบ');
    await publishPost(page, artifacts, { title });
    await expect(page.getByRole('button', { name: 'ลบโพสต์' })).toBeVisible();

    await page.getByRole('button', { name: 'ลบโพสต์' }).click();
    await expect(page.getByRole('dialog', { name: /คุณต้องการลบโพสต์/ })).toBeVisible();
    await expect(page.getByRole('dialog').getByText(title, { exact: false })).toBeVisible();

    await page.getByRole('button', { name: 'ยกเลิก' }).click();
    await expect(page.getByRole('dialog', { name: /คุณต้องการลบโพสต์/ })).toBeHidden();

    await page.reload();
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  });

  test('TC-POST04-005,006,007,014,015: ลบแล้วรายการและ URL เดิมไม่แสดงโพสต์', async ({ page, artifacts }) => {
    const title = generateUniqueTitle('TC-POST04-005 ลบจริง');
    const postUrl = await publishPost(page, artifacts, { title });
    await deleteCurrentPost(page);
    await openOwnProfileTab(page, 'posts');
    await page.reload();
    await expect.soft(page.getByRole('heading', { name: title, exact: true }), 'TC-POST04-005,014: รายการเจ้าของหลังลบ').toHaveCount(0);
    
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    await expect.soft(page.getByRole('heading', { name: title, exact: true }), 'TC-POST04-006: หน้าสาธารณะหลังลบ').toHaveCount(0);
    
    await page.goto(postUrl);
    await expect(page.getByText(/โพสต์ของคุณถูกลบไปแล้ว|โพสต์นี้ถูกลบไปแล้ว|ไม่พบโพสต์/).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'ลบโพสต์' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  });

});
