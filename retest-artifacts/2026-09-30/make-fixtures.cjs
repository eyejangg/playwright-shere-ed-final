const { chromium } = require('../../node_modules/playwright');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.setContent('<html><body style="margin:0;background:steelblue"><h1>SHARE-ED Test Cover</h1></body></html>');
    const jpeg = await page.screenshot({ type: 'jpeg', quality: 90 });
    await fs.writeFile('test-data/images/cover.jpg', Buffer.concat([jpeg, Buffer.alloc(1048576 - jpeg.length)]));
    const webp = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 128; canvas.height = 72;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'steelblue'; ctx.fillRect(0, 0, 128, 72);
      return canvas.toDataURL('image/webp').split(',')[1];
    });
    await fs.writeFile('test-data/images/cover.webp', Buffer.from(webp, 'base64'));
    console.log('Valid JPG and WEBP fixtures generated');
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exit(1); });
