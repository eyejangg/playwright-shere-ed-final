# Playwright Automation Testing — SHARE-ED

โปรเจกต์นี้ใช้ Playwright สำหรับทดสอบระบบ SHARE-ED โดยไฟล์ `tests/post/create-post.spec.js` มี Test Case การสร้างโพสต์ตั้งแต่ `TC-POST01-001` ถึง `TC-POST01-039`

## สิ่งที่ต้องติดตั้ง

- Git
- Node.js รุ่น 20 ขึ้นไป
- npm

ตรวจสอบโปรแกรมที่ติดตั้ง:

```powershell
git --version
node --version
npm --version
```

## เริ่มต้นใช้งานโปรเจกต์

### 1. ดาวน์โหลดโปรเจกต์

```powershell
git clone <URL-ของ-GitHub-Repository>
cd playwright-shere-ed-final
```

ถ้ามีโปรเจกต์อยู่ในเครื่องแล้ว ให้เปิด Terminal ที่โฟลเดอร์โปรเจกต์:

```powershell
cd D:\playwright-shere-ed-final
```

### 2. ติดตั้ง Packages

```powershell
npm install
```

หากมี `package-lock.json` และต้องการติดตั้งตามเวอร์ชันที่กำหนดไว้แน่นอน:

```powershell
npm ci
```

### 3. ติดตั้ง Browser ของ Playwright

```powershell
npx.cmd playwright install chromium
```

### 4. ตรวจสอบว่า Playwright พบ Test Case

```powershell
npx.cmd playwright test --list --project=chromium
```

## โครงสร้างโปรเจกต์

```text
playwright-shere-ed-final/
├── .github/
│   └── workflows/               # GitHub Actions workflow
├── playwright/
│   └── .auth/
│       └── member.json          # Session หลังเข้าสู่ระบบ (สร้างใหม่โดย global setup)
├── test-data/
│   ├── images/                  # รูปปกและรูปภาพประกอบสำหรับทดสอบ
│   ├── pdf/                     # PDF และไฟล์ผิดประเภทสำหรับทดสอบ
│   └── test-data.js             # รวม path ของไฟล์ทดสอบ
├── tests/
│   └── post/
│       └── create-post.spec.js  # TC-POST01-001 ถึง TC-POST01-039
├── global-setup.js              # เข้าสู่ระบบและบันทึก session ก่อนรัน Test
├── playwright.config.js         # การตั้งค่า browser, video, trace และ report
├── package.json                 # Scripts และ dependencies
└── README.md                    # คู่มือการใช้งาน
```

## ขั้นตอนการทำงานของระบบทดสอบ

เมื่อสั่งรัน Test ระบบจะทำงานตามลำดับนี้:

1. Playwright เรียก `global-setup.js`
2. `global-setup.js` เปิดเว็บไซต์และเข้าสู่ระบบด้วยบัญชี Member
3. ระบบบันทึก session ลง `playwright/.auth/member.json`
4. Test Case นำ session นี้ไปใช้ จึงไม่ต้อง Login ใหม่ทุกเคส
5. Playwright รัน Test Case ด้วย Chromium
6. หลังทดสอบ ระบบสร้าง HTML report, video, screenshot และ trace ตามการตั้งค่า

## วิธีรัน Test

### รัน Test ทั้งโปรเจกต์

```powershell
npm test
```

### รัน Test การสร้างโพสต์ทั้งหมด 39 เคส

```powershell
npx.cmd playwright test tests/post/create-post.spec.js --project=chromium
```

หรือใช้ npm script:

```powershell
npm run test:post
```

### รันเฉพาะ TC-POST01-039

```powershell
npx.cmd playwright test tests/post/create-post.spec.js --project=chromium --grep "TC-POST01-039"
```

### รันแบบเห็นหน้าต่าง Browser

```powershell
npx.cmd playwright test tests/post/create-post.spec.js --project=chromium --grep "TC-POST01-039" --headed
```

### รันแบบ Debug ทีละขั้นตอน

```powershell
$env:PWDEBUG="1"
npx.cmd playwright test tests/post/create-post.spec.js --project=chromium --grep "TC-POST01-039" --headed
```

หลัง Debug เสร็จ สามารถลบค่า `PWDEBUG` ได้ด้วย:

```powershell
Remove-Item Env:PWDEBUG
```

### ใช้ Playwright Codegen

Codegen ใช้เปิดเว็บไซต์และบันทึกคำสั่งจากการคลิกหรือกรอกข้อมูล:

```powershell
npx.cmd playwright codegen --load-storage=playwright/.auth/member.json https://share-ed.online/
```

ควรตรวจและปรับ locator ที่ Codegen สร้างก่อนนำไปใช้จริง โดยหลีกเลี่ยงข้อมูลที่เปลี่ยนทุกครั้ง เช่น ID หรือ timestamp แบบตายตัว

ตัวอย่างที่ไม่ควรใช้:

```js
await page.getByRole('link', {
  name: 'TC-POST01-039 ทบทวนแคลคูลัส 1790158281392 คณิตศาสตร์'
}).click();
```

ควรใช้ตัวแปรชื่อโพสต์ที่สร้างใน Test Case:

```js
const postTitle = `TC-POST01-039 ทบทวนแคลคูลัส ${Date.now()}`;
await page.getByText(postTitle, { exact: true }).first().click();
```

## TC-POST01-039 ทำอะไรบ้าง

Test Case นี้ทำงานดังนี้:

1. กรอกข้อมูลฟิลด์บังคับ
2. อัปโหลดรูปปก
3. เลือกระดับชั้น
4. เลือกหมวดวิชาและแท็ก
5. กรอกรายละเอียดเพิ่มเติม
6. อัปโหลดรูปภาพประกอบและ PDF
7. กดโพสต์สรุปความรู้
8. ตรวจข้อความโพสต์สำเร็จ
9. ตรวจว่าโพสต์ปรากฏบนหน้าแรก
10. เปิดรายละเอียดโพสต์
11. ตรวจชื่อ หมวดวิชา ระดับชั้น บทสรุป รายละเอียด รูปภาพ PDF และแท็ก
12. ลบโพสต์ที่สร้างขึ้น
13. ตรวจว่าโพสต์หายจากหน้า Explore
14. ตรวจว่าโพสต์หายจากหน้า Home

ขั้นตอนลบอยู่ใน `finally` เพื่อให้ระบบพยายามลบโพสต์ แม้ assertion ก่อนหน้าจะ Fail

## Known Defect ของ TC-POST01-039

ไฟล์ที่อัปโหลดมีชื่อ `document.pdf` แต่หน้ารายละเอียดโพสต์แสดงชื่อที่ระบบสร้างใหม่ เช่น:

```text
xbughsemnw...pdf
```

Test จึงตรวจชื่อเดิมด้วยคำสั่ง:

```js
await expect(page.getByText('document.pdf', { exact: true })).toBeVisible();
```

ถ้าระบบยังแสดงชื่อสุ่ม Test Case จะ Fail ซึ่งเป็นผลที่ถูกต้องสำหรับ defect นี้ แต่ส่วน `finally` จะยังลบโพสต์ทดสอบออก

## Video, Screenshot และ Trace

การตั้งค่าอยู่ใน `playwright.config.js`:

```js
use: {
  screenshot: 'only-on-failure',
  video: 'on',
  trace: 'on',
}
```

ไฟล์ผลการทดสอบอยู่ใน:

```text
test-results/
```

ไฟล์ที่อาจพบ:

```text
video.webm
trace.zip
test-failed-1.png
error-context.md
```

หากต้องการเก็บวิดีโอเฉพาะ Test ที่ Fail ให้เปลี่ยนเป็น:

```js
video: 'retain-on-failure',
```

## เปิด HTML Report

หลังรัน Test ให้ใช้คำสั่ง:

```powershell
npx.cmd playwright show-report
```

หาก port ถูกใช้งานอยู่:

```powershell
npx.cmd playwright show-report --port 9324
```

## เปิด Trace

```powershell
npx.cmd playwright show-trace "test-results\ตำแหน่งโฟลเดอร์\trace.zip"
```

Trace สามารถใช้ดูคำสั่งแต่ละขั้นตอน หน้าเว็บ Network และ Error ที่เกิดขึ้นได้

## การเตรียม GitHub Secrets

ไม่ควรเก็บ email และ password ไว้ใน source code เมื่อนำไปรันบน GitHub Actions

แก้ `global-setup.js` ให้ใช้ Environment Variables:

```js
const email = process.env.MEMBER_EMAIL;
const password = process.env.MEMBER_PASSWORD;

if (!email || !password) {
  throw new Error('ไม่พบ MEMBER_EMAIL หรือ MEMBER_PASSWORD');
}

await page.getByRole('textbox', { name: 'อีเมล' }).fill(email);
await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill(password);
```

จากนั้นเข้า GitHub repository:

```text
Settings
→ Secrets and variables
→ Actions
→ New repository secret
```

เพิ่ม Secrets:

```text
MEMBER_EMAIL
MEMBER_PASSWORD
```

## GitHub Actions สำหรับ Test ทั้ง 39 เคส

สร้างไฟล์ `.github/workflows/post-tests.yml`:

```yaml
name: POST Test Report - 39 Cases

on:
  workflow_dispatch:

  push:
    branches:
      - main

  pull_request:
    branches:
      - main

permissions:
  contents: read

concurrency:
  group: post-tests
  cancel-in-progress: false

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout source code
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: npm

      - name: Install packages
        run: npm ci

      - name: Install Chromium
        run: npx playwright install --with-deps chromium

      - name: Run all POST test cases
        run: npx playwright test tests/post/create-post.spec.js --project=chromium
        env:
          MEMBER_EMAIL: ${{ secrets.MEMBER_EMAIL }}
          MEMBER_PASSWORD: ${{ secrets.MEMBER_PASSWORD }}
          BASE_URL: https://share-ed.online/

      - name: Upload HTML report
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v5
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload video screenshot and trace
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v5
        with:
          name: playwright-test-results
          path: test-results/
          retention-days: 30
```

## การส่งโค้ดขึ้น GitHub

ตรวจสอบไฟล์ที่เปลี่ยน:

```powershell
git status
```

เพิ่มไฟล์และ Commit:

```powershell
git add .
git commit -m "Add Playwright POST automation tests"
git push
```

## รัน GitHub Actions ด้วยตัวเอง

1. เปิด GitHub repository
2. เลือกแท็บ **Actions**
3. เลือก Workflow **POST Test Report - 39 Cases**
4. กด **Run workflow**
5. รอจน Workflow ทำงานเสร็จ
6. ดาวน์โหลดรายงานจากส่วน **Artifacts**

Artifacts ที่ได้:

```text
playwright-report
playwright-test-results
```

แม้มี Test Fail ขั้นตอน Upload Artifact ยังทำงาน ตราบใดที่ Workflow ไม่ถูกยกเลิก

## ปัญหาที่พบบ่อย

### PowerShell ไม่อนุญาตให้รัน `npx.ps1`

ใช้ `npx.cmd` แทน:

```powershell
npx.cmd playwright test
```

### เปิด Report ไม่ได้เพราะ port ถูกใช้งาน

```powershell
npx.cmd playwright show-report --port 9324
```

### Test หา element มากกว่าหนึ่งตัว

ข้อความ Error:

```text
strict mode violation
```

ควรจำกัดพื้นที่ค้นหาหรือใช้ข้อมูลเฉพาะของโพสต์ เช่น:

```js
await page.locator('main').getByText('คณิตศาสตร์', { exact: true }).first();
```

### Test รันผ่านในเครื่องแต่ Fail บน GitHub Actions

ตรวจสอบ:

- GitHub Secrets ถูกต้องหรือไม่
- เว็บไซต์เข้าถึงได้จาก GitHub runner หรือไม่
- Test data ถูก commit ครบหรือไม่
- Browser ถูกติดตั้งด้วย `playwright install --with-deps chromium` หรือไม่
- เปิด `trace.zip`, screenshot และ video จาก Artifact เพื่อดูจุดที่ผิดพลาด

