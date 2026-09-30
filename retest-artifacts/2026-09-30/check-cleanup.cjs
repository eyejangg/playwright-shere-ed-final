const { chromium } = require('../../node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const baseline = JSON.parse(await fs.readFile(path.join(__dirname, 'site-before.json'), 'utf8'));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ baseURL: 'https://share-ed.online/', storageState: path.resolve('playwright/.auth/member.json') });
    await page.goto(baseline.profileUrl);
    await page.getByRole('button', { name: 'โพสต์ของฉัน', exact: true }).click();
    await page.waitForLoadState('networkidle');
    const posts = await page.getByRole('heading').allTextContents();
    await page.getByRole('button', { name: 'แบบร่าง', exact: true }).click();
    await page.waitForLoadState('networkidle');
    const drafts = await page.getByRole('heading').allTextContents();
    const extraPosts = posts.filter(t => !baseline.posts.includes(t));
    const extraDrafts = drafts.filter(t => !baseline.drafts.includes(t));
    const result = { posts, drafts, extraPosts, extraDrafts, clean: !extraPosts.length && !extraDrafts.length };
    await fs.writeFile(path.join(__dirname, 'site-after.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result));
    if (!result.clean) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
