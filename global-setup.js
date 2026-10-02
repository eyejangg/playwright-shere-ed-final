const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');
const path = require('node:path');

async function globalSetup() {
    // เครื่องของคุณใช้บัญชีจากไฟล์ ส่วน GitHub Actions ใช้ secrets
    const account = process.env.CI
        ? { email: process.env.MEMBER_EMAIL, password: process.env.MEMBER_PASSWORD }
        : require('./test-account.local.json');

    if (!account.email || !account.password) {
        throw new Error('ไม่พบบัญชีทดสอบสำหรับล็อกอิน');
    }

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

        // 3. รอให้ล็อกอินสำเร็จ
        await page.waitForSelector('[test-data="create-post-button"]', { timeout: 20_000 });

        // 4. บันทึก session ให้เทสใช้ต่อ
        await page.context().storageState({ path: statePath });
    } finally {
        // 5. ปิด browser
        await browser.close();
    }
}

module.exports = globalSetup;
