# 🚀 คู่มือคำสั่งการรัน Test: ทีละเคส, รวมกลุ่มเคส และโหมดต่างๆ (Playwright)

คู่มือนี้รวบรวมคำสั่งสำหรับการรันชุดทดสอบ Playwright ในโปรเจกต์ **SHARE-ED** ครอบคลุมทั้งการรันแบบเจาะจงรายเคส, การรันทั้งกลุ่ม/ไฟล์, การดีบั๊ก (Debug), โหมดกราฟิก (UI Mode) และการส่งผลเข้า Google Sheet

> 💡 **ข้อสังเกตสำหรับ Windows:**  
> ใน PowerShell แนะนำให้ใช้ `npx.cmd` หรือใช้คำสั่งผ่าน `npm run` เพื่อหลีกเลี่ยงปัญหา Execution Policy ของระบบ

---

## 📌 สารบัญ
1. [คำสั่งด่วนผ่าน NPM Scripts (ใน package.json)](#1-คำสั่งด่วนผ่าน-npm-scripts)
2. [การรันแบบ "ทีละเคส" (Single Test Case)](#2-การรันแบบ-ทีละเคส-single-test-case)
3. [การรันแบบ "รวมเคส" (Batch / Module / Suite)](#3-การรันแบบ-รวมเคส-batch--module--suite)
4. [โหมดช่วยเหลือและการดีบั๊ก (Debug & UI Mode)](#4-โหมดช่วยเหลือและการดีบั๊ก-debug--ui-mode)
5. [การดูรายงานผลย้อนหลัง (Report & Trace)](#5-การดูรายงานผลย้อนหลัง-report--trace)
6. [การรันพร้อม Sync เข้า Google Sheet อัตโนมัติ](#6-การรันพร้อม-sync-เข้า-google-sheet-อัตโนมัติ)
7. [ตารางสรุปคำสั่งลัด (Cheat Sheet)](#7-ตารางสรุปคำสั่งลัด-cheat-sheet)

---

## 1. คำสั่งด่วนผ่าน NPM Scripts

คำสั่งมาตรฐานที่ตั้งค่าไว้ใน [package.json](file:///d:/playwright-shere-ed-final/package.json):

```powershell
# 1. รันทุกเคสในโปรเจกต์ (Headless เบื้องหลัง)
npm test

# 2. รันเคสสร้างโพสต์ทั้งหมด
npm run test:post

# 3. รันเคส End-to-End รวมครบวงจร (สร้าง -> ตรวจ -> แก้ไข -> ลบ) แบบเปิดหน้าต่างเบราว์เซอร์
npm run test:lifecycle

# 4. รันทุกเคสแบบเปิดหน้าต่างเบราว์เซอร์ (Headed)
npm run test:headed

# 5. เปิดหน้าต่างควบคุมแบบ UI Dashboard สำหรับคลิกเลือกเคสรันเอง
npm run test:ui

# 6. รันทุกเคส และนำผล Pass/Fail ไปอัปเดตลง Google Sheet อัตโนมัติ
npm run test:sync-sheet
```

---

## 2. การรันแบบ "ทีละเคส" (Single Test Case)

เหมาะสำหรับช่วงพัฒนาสคริปต์ หรือต้องการรีเทสเฉพาะเคสที่มีปัญหา

### 2.1 รันด้วยรหัสเคส หรือชื่อ Test Case (`-g` หรือ `--grep`)
ใช้ flag `-g` แล้วระบุรหัสเคสหรือข้อความบางส่วนในชื่อ test:

```powershell
# รันเฉพาะเคส TC-POST01-001 (เปิดหน้าสร้างโพสต์)
npx.cmd playwright test -g "TC-POST01-001" --project=chromium

# รันเฉพาะเคสเปลี่ยนรูปหน้าปกเกินขนาด
npx.cmd playwright test -g "TC-POST01-018" --project=chromium

# รันเฉพาะเคสแนบรูปประกอบครบ 5 รูป
npx.cmd playwright test -g "TC-POST01-024" --project=chromium

# รันเคสแบบเปิดหน้าจอให้เห็น (Headed)
npx.cmd playwright test -g "TC-POST01-001" --project=chromium --headed
```

### 2.2 รันด้วยเลขบรรทัดของไฟล์ (Line Number)
สามารถชี้ไปที่เลขบรรทัดที่คำสั่ง `test(...)` เริ่มต้นได้ทันที:

```powershell
# รันเทสแรกของไฟล์ edit-post.spec.js ที่บรรทัด 12
npx.cmd playwright test tests/post/edit-post.spec.js:12 --project=chromium

# รันเทส Validation ของไฟล์ edit-post.spec.js ที่บรรทัด 48
npx.cmd playwright test tests/post/edit-post.spec.js:48 --project=chromium
```

### 2.3 รันเคสเดี่ยวแบบปรับลดความเร็ว (SlowMo)
ช่วยให้มองเห็นขั้นตอนการกด การพิมพ์ ได้ทันตา:

```powershell
npx.cmd playwright test -g "TC-POST01-001" --project=chromium --headed --slowmo=500
```
*(ค่า `500` คือหน่วงเวลา 500 มิลลิวินาทีในแต่ละขั้นตอน)*

---

## 3. การรันแบบ "รวมเคส" (Batch / Module / Suite)

### 3.1 รันเฉพาะไฟล์ใดไฟล์หนึ่ง (แยกตามโมดูล)

```powershell
# รันชุดทดสอบ "การสร้างโพสต์" (POST01 ทั้งหมด 38 เคส)
npx.cmd playwright test tests/post/create-post.spec.js --project=chromium

# รันชุดทดสอบ "การจัดการแบบร่าง Draft" (POST02)
npx.cmd playwright test tests/post/draft-post.spec.js --project=chromium

# รันชุดทดสอบ "การแก้ไขโพสต์" (POST03)
npx.cmd playwright test tests/post/edit-post.spec.js --project=chromium

# รันชุดทดสอบ "การลบโพสต์" (POST04)
npx.cmd playwright test tests/post/delete-post.spec.js --project=chromium

# รันชุดทดสอบ "หน้ารายละเอียดโพสต์ & โหลด PDF" (POST05)
npx.cmd playwright test tests/post/detail-post.spec.js --project=chromium

# รันชุดทดสอบ "End-to-End รวมครบวงจร"
npx.cmd playwright test tests/post/lifecycle-flow.spec.js --project=chromium
```

### 3.2 รันรวมทั้งโมดูลโพสต์ (ทุกไฟล์ในโฟลเดอร์ tests/post/)

```powershell
# รันทุกไฟล์ในโฟลเดอร์ tests/post/ แบบเรียงลำดับ 1 worker ป้องกันข้อมูลชนกัน
npx.cmd playwright test tests/post/ --project=chromium --workers=1
```

### 3.3 รันหลายไฟล์ที่ต้องการร่วมกัน

```powershell
# รันเฉพาะไฟล์สร้างและแก้ไขโพสต์
npx.cmd playwright test tests/post/create-post.spec.js tests/post/edit-post.spec.js --project=chromium
```

### 3.4 รันตามกลุ่มคำหรือเงื่อนไข (Pattern Matching)

```powershell
# รันทุกเคสที่มีคำว่า "แท็ก" หรือ "Tag"
npx.cmd playwright test -g "แท็ก|Tag" --project=chromium

# รันทุกเคสที่มีคำว่า "Validation"
npx.cmd playwright test -g "Validation" --project=chromium

# รันทุกเคส ยกเว้น เคสที่ติด Known Defect (ใช้ --grep-invert)
npx.cmd playwright test tests/post/ -g "(TC-POST01-036|TC-POST04-006)" --grep-invert --project=chromium
```

### 3.5 รันเฉพาะเคสที่ "เพิ่งพังรอบที่แล้ว" (Last Failed)
ไม่ต้องเสียเวลารันเคสที่ผ่านแล้วซ้ำ:

```powershell
npx.cmd playwright test --last-failed --project=chromium
```

---

## 4. โหมดช่วยเหลือและการดีบั๊ก (Debug & UI Mode)

### 4.1 Playwright UI Mode (แนะนำที่สุดสำหรับการพัฒนาและตรวจงาน)
เปิด Dashboard กราฟิกขึ้นมา มีฟีเจอร์ Timeline, ถอยเวลาดูภาพหน้าจอ (Time Travel), เช็ก Network และคลิก Play เฉพาะเคสที่ต้องการได้:

```powershell
npx.cmd playwright test --ui
# หรือ
npm run test:ui
```

### 4.2 Playwright Inspector (Debug Mode)
เปิดหน้าต่าง Debugger ขึ้นมาควบคู่กับเบราว์เซอร์ ช่วยให้กด Step Over ทีละบรรทัด, ดูตัวแปร และกด Record สดได้:

```powershell
# Debug เฉพาะเคสที่ต้องการ
npx.cmd playwright test -g "TC-POST03-003" --project=chromium --debug
```

### 4.3 รันพร้อมบังคับบันทึก Trace และ Video ทุกครั้ง
ใช้เมื่อต้องการเก็บหลักฐานการทำงานแบบละเอียดที่สุด:

```powershell
npx.cmd playwright test tests/post/lifecycle-flow.spec.js --project=chromium --trace on --video on
```

---

## 5. การดูรายงานผลย้อนหลัง (Report & Trace)

### 5.1 เปิดดู HTML Report สรุปผลรอบล่าสุด
เปิดรายงานผลสรุปบนหน้าเว็บของ Playwright (มีกราฟ, ตารางเวลา, และภาพบันทึกข้อผิดพลาด):

```powershell
npx.cmd playwright show-report
```

### 5.2 เปิดดูไฟล์ Trace Viewer ย้อนหลัง
หากการทดสอบล้มเหลว Playwright จะสร้างไฟล์ `trace.zip` ในโฟลเดอร์ `test-results/`:

```powershell
# เปิดดูไฟล์ Trace เจาะลึก
npx.cmd playwright show-trace test-results/<ชื่อโฟลเดอร์ผลการรัน>/trace.zip
```

---

## 6. การรันพร้อม Sync เข้า Google Sheet อัตโนมัติ (100% Fully Automated)

โปรเจกต์นี้มีระบบส่งผลการทดสอบขึ้น Google Sheet อัตโนมัติ โดยที่คุณ**ไม่ต้องทำอะไรเลย** (ไม่ต้อง Copy-Paste และไม่ต้องล็อกอิน Google ด้วยตัวเอง):

### 6.1 คำสั่งสั่งงาน (รันคำสั่งเดียวจบ)

```powershell
# รันผ่านคำสั่งย่อ npm:
npm run test:sync-sheet

# หรือรันผ่าน node โดยตรง:
node scripts/sync-test-to-sheet.js
```

---

### 6.2 ขั้นตอนที่ระบบจัดการให้เองทั้งหมด (นั่งรอเฉยๆ ได้เลย)

```
[1. รัน Playwright] ──> [2. สรุปผล Pass/Fail] ──> [3. เปิด Google Sheet] ──> [4. วางข้อมูล K1:Q118] ──> [5. แคปภาพยืนยัน]
```

1. **🚀 รัน Test อัตโนมัติ:**
   - สั่งรันทุกเคสในโฟลเดอร์ `tests/post/` แบบเรียงลำดับทีละเคส (`--workers=1`) ป้องกันข้อมูลชนกัน
   - ส่งออกผลการรันเป็นไฟล์ JSON Report ละเอียด
2. **📊 รวบรวมและวิเคราะห์ผล:**
   - อ่านผลลัพธ์ว่าแต่ละเคส (`TC-POST01-001` ถึง `TC-POST05-022`) มีผลเป็น `Pass` หรือ `Fail`
   - แมปเข้ากับ 117 เคสในตารางหลัก พร้อมระบุชื่อไฟล์ Spec และเคสที่เป็น Known Defect ให้อัตโนมัติ
3. **🌐 เชื่อมต่อ Google Sheet แบบ Headless:**
   - เปิดเบราว์เซอร์ Chromium ในพื้นหลังไปยัง [Google Spreadsheet: TC-02](https://docs.google.com/spreadsheets/d/1iMx6hw7qZ9X4MU41BuvWgbgE3jcmv9vKXZJ-PA_P_cw/edit?gid=1221386414#gid=1221386414)
   - ไม่ต้องล็อกอิน Google เพราะชีตเปิดสิทธิ์แก้ไขไว้เรียบร้อยแล้ว
4. **📝 กรอกข้อมูลลงตารางอัตโนมัติ:**
   - นำเคอร์เซอร์ไปที่เซลล์ **`K1`**
   - วางข้อมูล (Paste) อัปเดตคอลัมน์ `K (Pass/Fail)`, `L (Date)`, `M (Automated/Manual)`, `N (Spec File)`, `O (Test Name)`, `P (Notes)` ครบทั้ง 117 แถวในครั้งเดียว
5. **📸 บันทึกหลักฐาน:**
   - รอ Google Sheet เซฟข้อมูลเรียบร้อย
   - แคปภาพ Screenshot หน้าชีตหลังอัปเดตเก็บไว้ที่ `retest-artifacts/sheet_after_sync.png`

---

### 6.3 ตัวอย่างข้อความเมื่อทำงานเสร็จสมบูรณ์

เมื่อรันเสร็จ จะแสดงข้อความใน Terminal:

```text
====================================================
🌐 Step 3: Syncing Results to Google Sheets...
====================================================
Connecting to Google Sheet...
📸 Screenshot captured: d:\playwright-shere-ed-final\retest-artifacts\sheet_after_sync.png
✅ Google Sheet Updated and Saved Successfully!
👉 URL: https://docs.google.com/spreadsheets/d/1iMx6hw7qZ9X4MU41BuvWgbgE3jcmv9vKXZJ-PA_P_cw/edit?gid=1221386414#gid=1221386414
```

> ⏱️ **ระยะเวลาที่ใช้:** ประมาณ **3 - 5 นาที** (ขึ้นอยู่กับความเร็วการโหลดเว็บและการตอบสนองของเซิร์ฟเวอร์)

---

## 7. ตารางสรุปคำสั่งลัด (Cheat Sheet)

| สิ่งที่ต้องการทำ | คำสั่งที่ใช้ |
|---|---|
| **รันเคสเดียว** | `npx.cmd playwright test -g "TC-POST01-001" --project=chromium` |
| **รันเคสเดียวแบบเปิดจอ** | `npx.cmd playwright test -g "TC-POST01-001" --project=chromium --headed` |
| **รันด้วยเลขบรรทัด** | `npx.cmd playwright test tests/post/edit-post.spec.js:12 --project=chromium` |
| **รันทั้งไฟล์สร้างโพสต์** | `npx.cmd playwright test tests/post/create-post.spec.js --project=chromium` |
| **รันทั้งไฟล์แก้ไขโพสต์** | `npx.cmd playwright test tests/post/edit-post.spec.js --project=chromium` |
| **รันทั้งไฟล์แบบร่าง** | `npx.cmd playwright test tests/post/draft-post.spec.js --project=chromium` |
| **รันทั้งไฟล์ลบโพสต์** | `npx.cmd playwright test tests/post/delete-post.spec.js --project=chromium` |
| **รันครบวงจร E2E** | `npm run test:lifecycle` |
| **เปิดโหมด UI Dashboard** | `npx.cmd playwright test --ui` |
| **เปิดโหมด Debug ทีละสเต็ป** | `npx.cmd playwright test -g "เคสที่ต้องการ" --debug` |
| **รันซ้ำเฉพาะเคสที่เพิ่ง Fail** | `npx.cmd playwright test --last-failed --project=chromium` |
| **เปิดดูรายงานผล HTML** | `npx.cmd playwright show-report` |
| **รันและ Sync ผลลง Google Sheet** | `npm run test:sync-sheet` |
