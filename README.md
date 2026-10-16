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

## ซิงก์ผลลง Google Sheet จากเครื่อง

คำสั่งนี้รันเทสใหม่หนึ่งรอบ แล้วอัปเดตเคส `TC-POST...` ในแท็บ `TC-02 สร้างโพสและจัดการโพสต์` เมื่อเทสในชุดที่เลือกผ่านครบและพบ Test Case ID ทุกตัวในชีท โดยจับคู่กับคอลัมน์ A และเขียน `Pass` ลงคอลัมน์ K, วันที่และเวลาสิ้นสุดการรันทดสอบตามเวลาไทยลงคอลัมน์ L และ `Automated` ลงคอลัมน์ M หากมีเทสเฟล ข้าม หรือหารหัสในชีทไม่พบ จะไม่เขียนชีทเลย ไม่แก้ Actual Result (คอลัมน์ J) และไม่ส่ง `TC-LIFE-001` ลงชีท การซิงก์ไม่ได้รันจาก GitHub Actions

ตั้งค่าครั้งแรก:

1. สร้าง Google Cloud project และเปิด **Google Sheets API**
2. สร้าง **service account** และดาวน์โหลด JSON key มาไว้ที่โฟลเดอร์หลักในชื่อ `google-service-account.local.json`
3. เปิดไฟล์ JSON แล้วคัดลอกค่า `client_email` ไปแชร์ Google Sheet ให้เป็น **Editor**
4. เตรียม `test-account.local.json` ของบัญชีทดสอบตามขั้นตอนด้านบน

ไฟล์ JSON key ทั้งสองถูก `.gitignore` ไว้ ห้าม commit หรือส่งต่อ private key

ตรวจสิทธิ์อ่านชีทก่อน โดยไม่รันเทสและไม่เขียนชีท: `npm.cmd run test:sync-sheet -- --check-access`

บน PowerShell ลองตรวจรายการที่จะอัปเดตโดยยังไม่เขียนชีท:

```powershell
npm.cmd run test:sync-sheet -- --suite=create --dry-run
```

เมื่อรายการตรงกับชีทแล้ว รันจริง:

```powershell
npm.cmd run test:sync-sheet -- --suite=create
```

เปลี่ยน `create` เป็น `draft`, `edit`, `delete`, `detail` หรือ `all` ได้ `all` รัน 49 เทส รวม `TC-LIFE-001` แต่จะไม่ส่งผลของ lifecycle ลงชีท คำสั่งจะรันเทสใหม่ทุกครั้งและสร้างรายงานที่ `artifacts/playwright/sync-run-report.json` เฉพาะ `TC-POST01-001` ถึง `TC-POST01-038` จะถูกส่งจากชุด create; `TC-POST01-039` ยังรันเพื่อลบโพสต์ทดสอบแต่ไม่ส่งลงชีท

หากต้องการซิงก์ทุกชุดจากเครื่อง ให้ใช้ `npm.cmd run test:sync-sheet -- --suite=all` (ลองเพิ่ม `--dry-run` ก่อนเพื่อดูรายการโดยยังไม่เขียนชีท) ไม่ต้องเพิ่ม `TC-POST01-039` หรือ `TC-LIFE-001` ลงชีท

หลังจาก dry-run หากต้องการใช้ผลจากรอบนั้นโดยไม่รันเทสซ้ำ ให้ใช้ `npm.cmd run test:sync-sheet -- --suite=draft --from-report` (เปลี่ยน suite ให้ตรงกับรอบที่รัน รวมถึง `all` ได้) รายงานต้องอายุไม่เกิน 24 ชั่วโมง มาจากชุดที่เลือก และต้องไม่เก่ากว่าการแก้ไฟล์เทส
