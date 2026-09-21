// ตรวจสอบข้อความหรือ Element แสดง
await expect(locator).toBeVisible();

// ตรวจสอบข้อความ
await expect(locator).toHaveText('Login สำเร็จ');

// ตรวจสอบ URL
await expect(page).toHaveURL(/dashboard/);

// ตรวจสอบค่าใน Input
await expect(locator).toHaveValue('testuser');

// ตรวจสอบว่า Element หายไป
await expect(locator).not.toBeVisible();