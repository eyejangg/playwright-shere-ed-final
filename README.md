# Playwright — SHARE-ED

ทดสอบการสร้างโพสต์ในเครื่องด้วย `tests/post/create-post.spec.js` (38 เคสสร้างโพสต์ และเคส 039 ลบโพสต์ทดสอบ)

## เริ่มต้น

```powershell
npm ci
npx playwright install chromium
```

ระบุ `email` และ `password` ในตัวแปร `account` ของ `global-setup.js` โดยตรง

```powershell
npm test
npm run test:headed
npm run test:ui
```

`global-setup.js` ล็อกอินด้วยบัญชีที่ระบุในโค้ดและสร้าง `playwright/.auth/member.json` ใหม่ก่อนรันแต่ละครั้ง โดยเคสทดสอบ login ใช้บัญชีที่ระบุไว้ภายในเคสนั้น

เว็บไซต์เริ่มต้นคือ https://share-ed.online/ สามารถกำหนด `BASE_URL` ในเครื่องได้

ข้อมูลรูปภาพและ PDF ที่ใช้ทดสอบอยู่ใน `test-data/` ผลลัพธ์จะสร้างใน `test-results/` และ `playwright-report/` เมื่อรันเทส

ดูคำสั่งเพิ่มเติมใน [PLAYWRIGHT_COMMANDS.md](PLAYWRIGHT_COMMANDS.md)

เคส 039 ลบเฉพาะโพสต์จาก 038 ในรอบเดียวกัน เปิดเป็นค่าเริ่มต้น ปิดด้วย set DELETE_TEST_POST=0 ใน CMD ดูคำสั่งสร้างและลบใน PLAYWRIGHT_COMMANDS.md
