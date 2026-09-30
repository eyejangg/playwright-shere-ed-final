const { chromium } = require('playwright');
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
      result.push(`<p><strong>${trimmed}</strong></p>`);
      continue;
    }
    
    // Intro or summary title
    if (trimmed.startsWith('สรุป') || trimmed.startsWith('คู่มือ')) {
      result.push(`<p><strong>${trimmed}</strong></p>`);
      result.push('<p>&nbsp;</p>');
      continue;
    }
    
    // Bullet points (e.g., "- ...", "* ...")
    if (trimmed.startsWith('-')) {
      const bulletText = trimmed.replace(/^-\s*/, '• ');
      result.push(`<p>${bulletText}</p>`);
      continue;
    }

    if (trimmed.startsWith('*')) {
      result.push('<p>&nbsp;</p>');
      result.push(`<p><em>${trimmed}</em></p>`);
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

  await page.goto('https://share-ed.online/create');
  await page.waitForTimeout(1500);

  const editor = page.locator('[contenteditable="true"]').first();
  await editor.click();

  const formattedHtml = formatDetailHtml(educationalPosts[0].detail);

  await editor.evaluate((el, htmlContent) => {
    el.innerHTML = htmlContent;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, formattedHtml);

  const editorHtml = await editor.evaluate(el => el.innerHTML);
  console.log('Quill editor HTML after evaluate:');
  console.log(editorHtml);

  await browser.close();
})();
