const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ptwpt\\.gemini\\antigravity-ide\\brain\\c8ce70bd-b4d3-4bd3-94ea-6f91ac6071c3';

function findLatestImage(prefix) {
  const files = fs.readdirSync(brainDir);
  const matched = files.filter(f => f.startsWith(prefix) && (f.endsWith('.jpg') || f.endsWith('.png')));
  if (matched.length === 0) throw new Error(`No image found for prefix ${prefix}`);
  matched.sort((a, b) => fs.statSync(path.join(brainDir, b)).mtimeMs - fs.statSync(path.join(brainDir, a)).mtimeMs);
  return path.join(brainDir, matched[0]);
}

const coverMappings = [
  { prefix: 'cover_equation_math', target: 'post-1-equation' },
  { prefix: 'cover_solar_system', target: 'post-2-solar-system' },
  { prefix: 'cover_english_tenses', target: 'post-3-english-tenses' },
  { prefix: 'cover_newton_laws', target: 'post-4-newton-laws' },
  { prefix: 'cover_cell_structure', target: 'post-5-cell-structure' },
  { prefix: 'cover_web_architecture', target: 'post-6-web-architecture' },
];

(async () => {
  const TARGET_W = 1280;
  const TARGET_H = 720;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: TARGET_W, height: TARGET_H } });

  for (const item of coverMappings) {
    const srcPath = findLatestImage(item.prefix);
    const destDir = path.resolve(__dirname, `../test-data/educational/${item.target}`);
    const destPath = path.join(destDir, 'cover.png');

    console.log(`Processing ${item.prefix}: ${srcPath}`);

    const base64Data = fs.readFileSync(srcPath).toString('base64');
    const mime = srcPath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const dataUri = `data:${mime};base64,${base64Data}`;

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body, html { width: ${TARGET_W}px; height: ${TARGET_H}px; overflow: hidden; background: #000; }
            img { width: 100%; height: 100%; object-fit: cover; display: block; }
          </style>
        </head>
        <body>
          <img src="${dataUri}" />
        </body>
      </html>
    `);

    await page.waitForTimeout(500);
    await page.screenshot({ path: destPath, type: 'png' });

    const stat = fs.statSync(destPath);
    console.log(`✓ Saved ${destPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB, ${TARGET_W}x${TARGET_H})`);
  }

  await browser.close();
  console.log('\nAll 6 new covers converted to 1280x720 PNG successfully!');
})();
