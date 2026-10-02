const { chromium, expect } = require('@playwright/test');

async function globalSetup() {
    // 1. เปิด Browser จำลองขึ้นมา
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // 2. ไปที่หน้าเว็บและกรอกข้อมูล Login
    await page.goto('https://share-ed.online/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'อีเมล' }).fill('ibakam1550@gmail.com');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('Eart1101');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

    // 3. รอให้ระบบล็อกอินสำเร็จและเปลี่ยนไปหน้า home
    await page.waitForURL('**/home');
    // 4. เปิดหน้าสำรวจเนื้อหา
    await page.getByRole('navigation').getByRole('link', { name: 'สำรวจเนื้อหา' }).click();
    await page.waitForURL('**/explore');
    // 5. บันทึก Cookie และ LocalStorage (Access Token) ลงไฟล์ JSON
    await page.context().storageState({
        path: 'playwright/.auth/member.json'
    });
    // 6. ปิด Browser จำลอง
    await browser.close();
}

module.exports = globalSetup;
