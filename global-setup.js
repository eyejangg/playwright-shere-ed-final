const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function globalSetup() {
    const authPath = path.resolve(__dirname, 'playwright/.auth/member.json');
    const authDir = path.dirname(authPath);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    const email = process.env.MEMBER_EMAIL;
    const password = process.env.MEMBER_PASSWORD;

    // หากมีการกำหนด Environment Variables ให้ล็อกอินอัตโนมัติ
    if (email && password) {
        console.log('พบ MEMBER_EMAIL ใน Environment Variables กำลังเข้าสู่ระบบ...');
        const browser = await chromium.launch();
        try {
            const page = await browser.newPage();
            await page.goto(process.env.BASE_URL || 'https://share-ed.online/', { waitUntil: 'domcontentloaded' });
            await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
            await page.getByRole('textbox', { name: 'อีเมล' }).fill(email);
            await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill(password);
            await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

            await page.waitForSelector('[data-testid="create-post-btn"], a[href="/create"], button:has-text("สร้างโพสต์")', { timeout: 30000 });
            await page.context().storageState({ path: authPath });
            console.log('✓ เข้าสู่ระบบสำเร็จและบันทึกเซสชันลงไฟล์ member.json เรียบร้อยแล้ว');
        } catch (err) {
            console.warn('✕ ไม่สามารถเข้าสู่ระบบด้วย Credentials จาก Environment ได้:', err.message);
        } finally {
            await browser.close();
        }
        return;
    }

    // หากมีไฟล์ member.json อยู่แล้ว ให้ตรวจสอบสถานะการเข้าสู่ระบบ
    if (fs.existsSync(authPath)) {
        try {
            const browser = await chromium.launch();
            const context = await browser.newContext({ storageState: authPath });
            const page = await context.newPage();
            await page.goto('https://share-ed.online/create', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(1500);

            if (!page.url().includes('/login')) {
                console.log('✓ ตรวจสอบเซสชันใน member.json: เข้าสู่ระบบอยู่แล้ว');
                await browser.close();
                return;
            }
            console.log('⚠️ เซสชันใน member.json หมดอายุแล้ว');
            await browser.close();
        } catch (e) {
            console.log('⚠️ ไม่สามารถตรวจสอบสถานะเซสชันเดิมได้:', e.message);
        }
    }

    console.log('ℹ️ ยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบผ่านเบราว์เซอร์ด้วยคำสั่ง npm run login หรือระบุ MEMBER_EMAIL / MEMBER_PASSWORD');
}

module.exports = globalSetup;
