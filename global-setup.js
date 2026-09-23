const { chromium } = require('@playwright/test');

async function globalSetup() {
    // 1. เปิด Browser จำลองขึ้นมาเงียบๆ
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // 2. ไปที่หน้าเว็บและกรอกข้อมูล Login
    await page.goto('https://share-ed.online/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('member01@test.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('Test1234');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

    // 3. รอให้ระบบล็อกอินสำเร็จจริง โดยรอให้ปุ่ม "สร้างโพสต์" โผล่ขึ้นมาก่อน
    await page.waitForSelector('[data-testid="create-post-btn"]');
    await page.waitForTimeout(1000);

    // 4. บันทึก Cookie และ LocalStorage (Access Token จาก Supabase) ลงไฟล์ JSON
    await page.context().storageState({
        path: 'playwright/.auth/member.json'
    });

    // 5. ปิด Browser จำลอง
    await browser.close();
}

module.exports = globalSetup;
