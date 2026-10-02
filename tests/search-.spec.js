// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('SEARCH01-S1: ค้นหาและกรองโพสต์ในหน้า “สำรวจเนื้อหา”', () => {
    test.beforeEach(async ({ page }) => {
        // เข้าหน้าสำรวจเนื้อหา โดยใช้สถานะ Login จาก global-setup
        await page.goto('/explore');
    });

    test('TC-SEARCH01-001: ค้นหาโพสต์จากชื่อโพสต์และตรวจสอบชื่อในหน้ารายละเอียด', async ({ page }) => {
        // 1. คลิกช่องค้นหา
        const searchInput = page.getByTestId('search-keyword-input');
        await searchInput.click();
        // 2. กรอก Frontend Backend Database
        const keyword = 'Frontend Backend Database';
        await searchInput.fill(keyword);
        // 3. กด Enter
        await searchInput.press('Enter');
        // 4. ตรวจสอบผลลัพธ์

        // 1) ระบบแสดงผลการค้นหา และพบโพสต์ที่คาดหวัง
        const expectedTitle = 'Frontend Backend Database และ API: พื้นฐานสถาปัตยกรรมเว็บ';
        const targetPost = page.getByRole('heading', { name: expectedTitle, exact: true });
        await expect(targetPost).toBeVisible();
        // 2) ตรวจสอบว่าชื่อโพสต์มีคำค้นปรากฏอยู่
        await expect(targetPost).toContainText(keyword);
        // 3) คลิกเข้าไปดูโพสต์เพื่อยืนยันว่าเข้าถึงโพสต์ได้ถูกต้อง
        await targetPost.click();
        // 4) เลื่อนจอลงมาหาหัวข้อโพสต์ในหน้ารายละเอียด (เพราะมีรูปภาพปกขนาดใหญ่อยู่ด้านบน)
        const detailHeading = page.getByRole('heading', { name: expectedTitle, exact: true });
        await detailHeading.scrollIntoViewIfNeeded();
        await expect(detailHeading).toBeVisible();

        await page.waitForTimeout(1000);
    });

    test('TC-SEARCH01-002: ค้นหาโพสต์จากชื่อผู้เขียนและตรวจสอบชื่อผู้เขียนในหน้ารายละเอียด', async ({ page }) => {
        // 1. คลิกช่องค้นหา
        const searchInput = page.getByTestId('search-keyword-input');
        await searchInput.click();
        // 2. กรอกชื่อผู้เขียน: เจเองคับ
        const authorKeyword = 'เจเองคับ';
        await searchInput.fill(authorKeyword);
        // 3. กด Enter
        await searchInput.press('Enter');
        // 4. ตรวจสอบผลลัพธ์

        // 1) ระบบแสดงโพสต์ และพบโพสต์ตัวอย่างเรื่องโครงสร้างเซลล์
        const expectedTitle = 'สรุปพื้นฐาน Docker ฉบับเริ่มต้น: เข้าใจ Container, Image และคำสั่งพื้นฐานที่ต้องรู้';
        const targetPost = page.getByRole('heading', { name: expectedTitle, exact: true });
        await expect(targetPost).toBeVisible();

        // 2) ตรวจสอบว่าโพสต์แสดงชื่อผู้เขียน เจเองคับ
        await expect(page.getByText(authorKeyword).first()).toBeVisible();

        // 3) คลิกเข้าไปดูโพสต์เพื่อยืนยันว่าเข้าถึงโพสต์ได้ถูกต้อง
        await targetPost.click();
        // 4) เลื่อนจอลงมาและตรวจสอบว่าในหน้ารายละเอียดแสดงชื่อผู้เขียน "เจเองคับ"
        const authorElement = page.getByText(authorKeyword).first();
        await authorElement.scrollIntoViewIfNeeded();
        await expect(authorElement).toBeVisible();

        await page.waitForTimeout(1000);
    });

    test('TC-SEARCH01-003: ค้นหาโพสต์จากแท็กและตรวจสอบแท็กในหน้ารายละเอียด', async ({ page }) => {
        // 1. คลิกช่องค้นหา
        const searchInput = page.getByTestId('search-keyword-input');
        await searchInput.click();
        // 2. กรอกแท็ก: #จักรวาล
        const tagKeyword = '#จักรวาล';
        await searchInput.fill(tagKeyword);
        // 3. กด Enter
        await searchInput.press('Enter');
        // 4. ตรวจสอบผลลัพธ์

        // 1) ระบบแสดงผลการค้นหา และพบโพสต์ตัวอย่างเรื่องระบบสุริยะ
        const expectedTitle = 'ระบบสุริยะ: สรุปข้อมูลดาวเคราะห์และวัตถุท้องฟ้าในระบบสุริยะ';
        const targetPost = page.getByRole('heading', { name: expectedTitle, exact: true });
        await expect(targetPost).toBeVisible();

        // 2) คลิกเข้าไปดูโพสต์เพื่อยืนยันว่าเข้าถึงโพสต์ได้ถูกต้อง
        await targetPost.click();

        // 3) เลื่อนจอลงมาและตรวจสอบว่าในหน้ารายละเอียดแสดงแท็ก #จักรวาล
        const tagElement = page.getByText(tagKeyword).first();
        await tagElement.scrollIntoViewIfNeeded();
        await expect(tagElement).toBeVisible();

        await page.waitForTimeout(1000);
    });

    test('TC-SEARCH01-004: ค้นหาโพสต์ด้วยคำค้นที่ไม่มีอยู่ในระบบ', async ({ page }) => {
        // 1. คลิกช่องค้นหา
        const searchInput = page.getByTestId('search-keyword-input');
        await searchInput.click();
        // 2. กรอกคำค้น: โพสต์ที่ไม่มีอยู่-Error-404
        const notFoundKeyword = 'โพสต์ที่ไม่มีอยู่-Error-404-XXXXXXXXX';
        await searchInput.fill(notFoundKeyword);
        // 3. กด Enter
        await searchInput.press('Enter');
        // 4. ตรวจสอบผลลัพธ์

        // 1) ระบบไม่แสดงรายการโพสต์ที่ตรงกับคำค้น
        await expect(page.getByRole('heading', { name: notFoundKeyword })).toHaveCount(0);

        // 2) ระบบแสดงข้อความ "ไม่พบโพสต์ที่ตรงกับตัวกรอง"
        const notFoundMessage = page.getByText('ไม่พบโพสต์ที่ตรงกับตัวกรอง');
        await expect(notFoundMessage).toBeVisible();

        // 3) ระบบแสดงตัวเลือก "ล้างตัวกรองทั้งหมด"
        const clearFilterOption = page.getByText('ล้างตัวกรองทั้งหมด');
        await expect(clearFilterOption).toBeVisible();

        await page.waitForTimeout(1000);
    });

    test('TC-SEARCH01-005: กรองโพสต์ตามระดับการศึกษาและหมวดหมู่วิชา แล้วตรวจสอบข้อมูลในหน้ารายละเอียด', async ({ page }) => {
        // 1. ไปที่ส่วน "ตัวกรอง"
        // 2. เลือกระดับการศึกษา มัธยมศึกษาตอนปลาย
        await page.getByRole('checkbox', { name: 'มัธยมศึกษาตอนปลาย' }).check();
        // 3. เลือกหมวดหมู่วิชา ภาษาอังกฤษ
        await page.getByRole('checkbox', { name: 'ภาษาอังกฤษ' }).check();


        // 4. ตรวจสอบว่าพบโพสต์ที่คาดหวัง
        const expectedTitle = '12 Tenses ภาษาอังกฤษ: สรุปหลักการใช้ โครงสร้าง และตัวบอกเวลา';
        const targetPost = page.getByRole('heading', { name: expectedTitle, exact: true });
        await expect(targetPost).toBeVisible();

        // 5. คลิกโพสต์เพื่อเข้าสู่หน้ารายละเอียด
        await targetPost.click();

        // 6. ตรวจสอบระดับการศึกษาและหมวดหมู่วิชาบนป้ายปกของโพสต์ (มองเห็นทันทีด้านบน ไม่ต้องเลื่อนจอ)
        await expect(page.getByText('มัธยมศึกษาตอนปลาย').first()).toBeVisible();
        await expect(page.getByText('ภาษาอังกฤษ').first()).toBeVisible();
        await page.waitForTimeout(1000);
    });
});