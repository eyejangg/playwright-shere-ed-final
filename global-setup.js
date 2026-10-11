const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');
const path = require('node:path');

async function globalSetup() {
    // ระบุบัญชีที่ใช้ล็อกอินสำหรับทดสอบตรงนี้
    const account = {
        email: 'ibakam1550@gmail.com',
        password: 'Eart1101',
    };

    const statePath = path.join(__dirname, 'playwright', '.auth', 'member.json');
    await fs.mkdir(path.dirname(statePath), { recursive: true });
    await fs.rm(statePath, { force: true });

    // 1. เปิด browser
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();

        // 2. เข้าเว็บและล็อกอิน
        await page.goto(process.env.BASE_URL || 'https://share-ed.online/');
        await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
        await page.getByRole('textbox', { name: 'อีเมล' }).fill(account.email);
        await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill(account.password);
        await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

        // รอให้ล็อกอินสำเร็จก่อนบันทึก session
        await page.waitForURL(url => url.pathname === '/home' || url.pathname === '/home/', { timeout: 20_000 })
            .catch(async error => {
                const screenshotPath = path.join(__dirname, 'test-results', 'setup-login-error.png');
                await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
                await page.screenshot({ path: screenshotPath, fullPage: true });
                const message = await page.locator('[role="alert"], [role="status"]').allTextContents();
                throw new Error(`ล็อกอินแล้วไม่ถึงหน้า /home ภายใน 20 วินาที URL ปัจจุบัน: ${page.url()} ข้อความบนหน้า: ${message.join(' | ')} ภาพ: ${screenshotPath}`, { cause: error });
            });
        await page.locator('[test-data="create-post-button"]').waitFor({ state: 'visible', timeout: 20_000 });

        // 3. บันทึก session ให้เทสใช้ต่อ
        await page.context().storageState({ path: statePath });
    } finally {
        // 4. ปิด browser
        await browser.close();
    }
}

module.exports = globalSetup;
