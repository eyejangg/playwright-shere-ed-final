const { chromium } = require('playwright');
const { educationalPosts } = require('../test-data/educational/posts-data');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();
  const post = educationalPosts[1]; // Post 2

  page.on('console', msg => console.log('LOG:', msg.text()));

  await page.goto('https://share-ed.online/create', { waitUntil: 'domcontentloaded' });
  console.log('Opened /create');

  console.log('Opening Category Modal...');
  const openCatModalBtn = page.getByRole('button', { name: 'ตั้งค่าวิชาและแท็ก' }).or(page.getByRole('button', { name: /หมวดหมู่และแท็ก/ })).first();
  await openCatModalBtn.click();
  await page.waitForTimeout(500);

  console.log('Selecting Subject:', post.subject);
  const subjectSelect = page.locator('select[test-data="category-select"]').or(page.getByTestId('category-select')).first();
  await subjectSelect.selectOption({ label: post.subject });

  console.log('Adding tags...');
  const tagInput = page.locator('input[test-data="hashtag-input"]').or(page.getByTestId('hashtag-input')).first();
  for (const tag of post.tags) {
    console.log('Processing tag:', tag);
    const presetBtn = page.getByRole('button', { name: tag, exact: true });
    if (await presetBtn.isVisible().catch(() => false)) {
      console.log('Clicking preset:', tag);
      await presetBtn.click();
    } else {
      console.log('Typing tag:', tag);
      await tagInput.fill(tag);
      await tagInput.press('Enter');
    }
    await page.waitForTimeout(200);
  }

  console.log('Confirming modal...');
  const confirmCatBtn = page.getByRole('button', { name: 'เสร็จสิ้น', exact: true }).or(page.getByRole('button', { name: 'ตกลง' })).first();
  await confirmCatBtn.click();
  await page.waitForTimeout(500);

  console.log('Checking subject visible on page...');
  await page.getByText(post.subject).first().waitFor({ state: 'visible', timeout: 5000 });
  console.log('Category modal confirmed successfully!');

  console.log('Filling Rich Text...');
  const editor = page.locator('[contenteditable="true"]').first();
  await editor.click();
  await editor.fill(post.detail);
  console.log('Rich text filled!');

  await browser.close();
})();
