const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://share-ed.online/create');
  const toolbarButtons = await page.locator('.ql-toolbar button, .ql-toolbar .ql-picker').evaluateAll(els => 
    els.map(e => e.className + ' | ' + (e.getAttribute('value') || e.getAttribute('title') || ''))
  );
  console.log('Quill toolbar items:', toolbarButtons);
  await browser.close();
})();
