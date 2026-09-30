const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const reportsDir = path.resolve(__dirname, '../reports');
const screenshotsDir = path.resolve(reportsDir, 'screenshots');
const testResultsScreenshots = path.resolve(__dirname, '../test-results/screenshots');
const summaryJsonPath = path.join(reportsDir, 'execution-summary.json');
const testResultsJson = path.resolve(__dirname, '../test-results/execution-summary.json');

fs.mkdirSync(screenshotsDir, { recursive: true });
fs.mkdirSync(testResultsScreenshots, { recursive: true });

(async () => {
  const posts = JSON.parse(fs.readFileSync(summaryJsonPath, 'utf8'));

  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  console.log('=== กำลังตรวจสอบความถูกต้องของทั้ง 6 โพสต์บน Share-Ed จริง ===\n');

  for (const post of posts) {
    console.log(`ตรวจสอบโพสต์ ${post.index}/6: ${post.title}`);
    await page.goto(post.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const heading = await page.locator('h1').innerText().catch(() => '');
    const text = await page.innerText('body');
    const hasAuthor = text.includes('Yahu_Yamaro') || text.includes('อายจัง');
    const hasGrade = text.includes(post.grade);
    const hasSubject = text.includes(post.subject);

    console.log(`  URL: ${post.url}`);
    console.log(`  Heading: "${heading}"`);
    console.log(`  Author: ${hasAuthor}, Grade: ${hasGrade}, Subject: ${hasSubject}`);

    const shot1 = path.join(screenshotsDir, `post-${post.index}-success.png`);
    const shot2 = path.join(testResultsScreenshots, `post-${post.index}-success.png`);
    await page.screenshot({ path: shot1, fullPage: true });
    await page.screenshot({ path: shot2, fullPage: true });

    post.screenshot = shot1;
    console.log(`  ✓ Screenshot บันทึกเรียบร้อย: ${shot1}\n`);
  }

  fs.writeFileSync(summaryJsonPath, JSON.stringify(posts, null, 2), 'utf8');
  fs.writeFileSync(testResultsJson, JSON.stringify(posts, null, 2), 'utf8');

  console.log(`✓ บันทึกรายงานสรุปที่: ${summaryJsonPath}`);
  await browser.close();
})();
