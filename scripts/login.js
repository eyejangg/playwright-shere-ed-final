const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('\n================================================================');
  console.log('       เปิดหน้าต่างเบราว์เซอร์สำหรับเข้าสู่ระบบ SHARE-ED       ');
  console.log('================================================================');
  console.log('เบราว์เซอร์เปิดขึ้นมาแล้ว (รองรับทั้ง Google Sign-In และ Email)');
  console.log('เมื่อคุณเข้าสู่ระบบสำเร็จ ระบบจะบันทึกเซสชันลงไฟล์ member.json อัตโนมัติ\n');

  const authDir = path.resolve(__dirname, '../playwright/.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  const authPath = path.join(authDir, 'member.json');

  // เปิด Chrome โดยปลดบล็อก automation flags เพื่อให้ Google Sign-In ผ่านได้
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-infobars'
    ]
  }).catch(() => chromium.launch({
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-infobars'
    ]
  }));

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/login', { waitUntil: 'domcontentloaded' });

  console.log('กำลังรอให้ผู้ใช้เข้าสู่ระบบ (ระบบจะตรวจจับอัตโนมัติทันทีที่เข้าสู่ระบบสำเร็จ)...');

  // ตรวจจับเมื่อมี access token หรือเปลี่ยนหน้าสำเร็จ
  let loggedIn = false;
  for (let i = 0; i < 300; i++) { // รอสูงสุด 5 นาที
    await page.waitForTimeout(1000);
    const url = page.url();

    // ตรวจสอบ localStorage สำหรับ Supabase token
    const tokenInStorage = await page.evaluate(() => {
      for (let j = 0; j < localStorage.length; j++) {
        const k = localStorage.key(j);
        if (k && k.includes('auth-token')) {
          const val = localStorage.getItem(k);
          if (val && val.includes('access_token')) return true;
        }
      }
      return false;
    }).catch(() => false);

    const hasCreateBtn = await page.locator('[data-testid="create-post-btn"], a[href="/create"], button:has-text("สร้างโพสต์")').isVisible().catch(() => false);

    if (tokenInStorage || (hasCreateBtn && !url.includes('/login'))) {
      loggedIn = true;
      console.log('\n✓ ตรวจพบการเข้าสู่ระบบสำเร็จ!');
      break;
    }
  }

  if (loggedIn) {
    await page.waitForTimeout(2000);
    await context.storageState({ path: authPath });
    console.log('================================================================');
    console.log('✓ บันทึกเซสชันลงไฟล์เรียบร้อยแล้ว:');
    console.log('  ->', authPath);
    console.log('================================================================\n');
  } else {
    console.warn('\n⚠️ ยังไม่พบการเข้าสู่ระบบสำเร็จ หรือปิดหน้าต่างก่อน');
  }

  await browser.close().catch(() => {});
}

main().catch(err => {
  console.error('Login error:', err);
  process.exit(1);
});
