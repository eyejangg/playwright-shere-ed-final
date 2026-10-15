# SHARE-ED Playwright Tests

ชุดทดสอบหน้าโพสต์ของ [SHARE-ED](https://share-ed.online/) ด้วย Playwright บน Chromium ครอบคลุมการสร้างโพสต์ แบบร่าง การแก้ไข การลบ รายละเอียดโพสต์ และลำดับการใช้งานตั้งแต่สร้างจนลบ

## รันในเครื่อง

ต้องมี Node.js และ npm จากนั้นติดตั้งแพ็กเกจและเบราว์เซอร์:

```bash
npm ci
npx playwright install chromium
```

สร้างไฟล์ `test-account.local.json` ที่โฟลเดอร์หลักของโปรเจกต์:

```json
{
  "email": "อีเมลบัญชีทดสอบ",
  "password": "รหัสผ่านบัญชีทดสอบ"
}
```

ไฟล์นี้ถูก `.gitignore` ไว้แล้ว ห้าม commit บัญชีหรือรหัสผ่านลง Git การรันจะล็อกอินด้วยบัญชีนี้ผ่าน `global-setup.js` ก่อนเริ่มเทส และบางเทสจะสร้างหรือแก้ไขข้อมูลบนเว็บจริง

รันทุกชุด:

```bash
npx playwright test tests/post/ --project=chromium --workers=1
```

รันเฉพาะชุด เช่น Create หรือ Draft:

```bash
npx playwright test tests/post/create-post.spec.js --project=chromium
npx playwright test tests/post/draft-post.spec.js --project=chromium
```

ชื่อไฟล์สำหรับชุดอื่นคือ `edit-post.spec.js`, `delete-post.spec.js`, `detail-post.spec.js` และ `lifecycle-flow.spec.js` ใน `tests/post/` บน PowerShell ที่ไม่อนุญาตให้รัน `npx.ps1` ให้ใช้ `npx.cmd` แทน `npx`

หลังรัน ดูรายงาน HTML ที่ `artifacts/playwright/report/index.html` และไฟล์ประกอบของเทสที่ `artifacts/playwright/test-results/` ทั้งสองโฟลเดอร์ไม่ถูก commit

## รันผ่าน GitHub Actions

1. ใน repository ไปที่ **Settings → Secrets and variables → Actions** แล้วตั้งค่า repository secrets ชื่อ `MEMBER_EMAIL` และ `MEMBER_PASSWORD` เป็นบัญชีทดสอบ
2. ไปที่ **Actions → SHARE-ED Automation Test Suite → Run workflow**
3. เลือก branch `main` และเลือก `test_suite`:

| ตัวเลือก | ชุดทดสอบ |
| --- | --- |
| `create` | สร้างโพสต์ |
| `draft` | แบบร่าง |
| `edit` | แก้ไขโพสต์ |
| `delete` | ลบโพสต์ |
| `detail` | รายละเอียดโพสต์ |
| `lifecycle` | สร้าง ตรวจ แก้ไข และลบต่อเนื่อง |
| `all` | ทุกชุด (ค่าเริ่มต้น) |

การ push ไป `main` หรือ branch `work/**` และการเปิด pull request เข้า `main` จะรันทุกชุดอัตโนมัติ เมื่อรันเสร็จ สามารถดาวน์โหลด `playwright-report` และ `playwright-test-results` จากหน้า run ใน Actions ได้

การซิงก์ Google Sheet ยังไม่ได้เปิดใช้ใน Actions ให้ใช้รายงาน Playwright เป็นผลอ้างอิงของแต่ละรอบเทส
