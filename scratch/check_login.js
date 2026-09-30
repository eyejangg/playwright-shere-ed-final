const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to login...');
  await page.goto('https://share-ed.online/login', { waitUntil: 'networkidle' });
  console.log('Current URL:', page.url());

  await page.getByRole('textbox', { name: 'อีเมล' }).fill('member01@test.com');
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('Test1234');
  
  const responsePromise = page.waitForResponse(resp => resp.url().includes('auth') || resp.url().includes('login'), { timeout: 10000 }).catch(e => null);
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  
  const resp = await responsePromise;
  if (resp) {
    console.log('Auth response status:', resp.status(), resp.url());
    try {
      console.log('Auth response body:', await resp.text());
    } catch (e) {}
  }

  await page.waitForTimeout(4000);
  console.log('URL after login:', page.url());
  
  // check for errors on screen
  const text = await page.innerText('body');
  console.log('Body text includes error?:', text.slice(0, 500));

  await page.screenshot({ path: 'scratch/login_result.png' });
  await browser.close();
})();
