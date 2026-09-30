const { chromium } = require('playwright');
const path = require('path');
const { educationalPosts } = require('../test-data/educational/posts-data');

function formatDetailHtml(text) {
  const lines = text.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      result.push('<p>&nbsp;</p>');
      continue;
    }
    
    // Main Section Headings (e.g., "1. Frontend...", "2. Backend...")
    if (/^\d+\./.test(trimmed)) {
      result.push('<p>&nbsp;</p>');
      result.push(`<p><strong style="font-size: 1.05rem; color: #0f172a;">${trimmed}</strong></p>`);
      continue;
    }
    
    // Intro or summary title
    if (trimmed.startsWith('สรุป') || trimmed.startsWith('คู่มือ')) {
      result.push(`<p><strong style="font-size: 1.1rem; color: #0f172a;">${trimmed}</strong></p>`);
      result.push('<p>&nbsp;</p>');
      continue;
    }
    
    // Bullet points (e.g., "- ...", "* ...")
    if (trimmed.startsWith('-')) {
      const bulletText = trimmed.replace(/^-\s*/, '• ');
      result.push(`<p style="margin-left: 12px; margin-top: 4px; margin-bottom: 4px;">${bulletText}</p>`);
      continue;
    }

    if (trimmed.startsWith('*')) {
      result.push('<p>&nbsp;</p>');
      result.push(`<p style="color: #64748b; font-style: italic;">${trimmed}</p>`);
      continue;
    }
    
    result.push(`<p>${trimmed}</p>`);
  }
  
  return result.join('');
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/post/92b4eb6b-5fa4-4011-af8e-6efc1b124711');
  await page.locator('h1').waitFor({ state: 'visible' });

  const html = formatDetailHtml(educationalPosts[5].detail);
  console.log('Generated HTML preview:');
  console.log(html);

  // Inject into DOM to preview
  await page.evaluate((newHtml) => {
    const container = document.querySelector('.post-details-content');
    if (container) container.innerHTML = newHtml;
  }, html);

  const previewShot = path.resolve(__dirname, 'preview-detail.png');
  // Scroll to detail and take screenshot of the card
  const detailCard = page.getByText('รายละเอียดเพิ่มเติม').locator('xpath=ancestor::div[contains(@class, "bg-white")][1]');
  await detailCard.screenshot({ path: previewShot });
  console.log('Saved preview screenshot to', previewShot);

  await browser.close();
})();
