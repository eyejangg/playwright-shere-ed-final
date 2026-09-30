// @ts-check
const fs = require('node:fs/promises');
const { generateUniqueTitle } = require('../../test-data/test-data');
const { test, expect, publishPost } = require('./post-helpers');

test.describe('TC-POST05 รายละเอียดโพสต์', () => {
  test('TC-POST05-001,012: โพสต์ ACTIVE แสดงข้อมูลและดาวน์โหลด PDF ได้', async ({ page, artifacts }) => {
    test.setTimeout(150_000);
    const title = generateUniqueTitle('TC-POST05-001 รายละเอียด PDF');
    const summary = 'ข้อมูลสรุปสำหรับตรวจรายละเอียด';
    await publishPost(page, artifacts, { title, summary, withPdf: true });

    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.getByText(summary, { exact: true })).toBeVisible();
    await expect(page.getByText('คณิตศาสตร์', { exact: true }).first()).toBeVisible();
    const downloadButton = page.getByRole('button', { name: 'ดาวน์โหลด' });
    await expect(downloadButton).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    const bytes = await fs.readFile(await download.path());
    expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
    expect(bytes.length).toBeGreaterThan(100);

  });
});
