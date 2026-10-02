# 🚀 Playwright Command Cheat Sheet (คู่มือคำสั่งทดสอบระบบ)

> **สำหรับน้องๆ ในทีม:** คู่มือนี้รวบรวมคำสั่งสำหรับรัน Automation Test โดยเน้นการเปิดหน้าต่าง Browser จริง (**`--headed`**) เพื่อให้น้องๆ ได้เห็นหน้าจอ UI การทำงาน และการคลิกของบอทแบบ Step-by-Step ชัดเจนที่สุดครับ ✨

---

## ⚡ 1. คำสั่งด่วนยอดฮิต (Copy แล้วกด Enter ได้เลย!)

### 🌟 รันชุดค้นหาและกรองโพสต์ (เปิดจอ Browser ให้เห็น UI)
```bash
npm run test:search
```
*(หรือใช้คำสั่งเต็ม)*
```bash
npx playwright test tests/search-.spec.js --headed
```

---

## 🖥️ 2. รันแบบแยกราย Test Case (เน้นเปิดดู UI ทีละข้อ)

ถ้าน้องๆ ต้องการดูการทำงานเฉพาะข้อใดข้อหนึ่ง สามารถระบุรหัสเคสด้วย flag `-g` ได้เลย:

### 🔹 ข้อ 1: ค้นหาจาก "ชื่อโพสต์" (`TC-SEARCH01-001`)
```bash
npx playwright test tests/search-.spec.js -g "TC-SEARCH01-001" --headed
```

### 🔹 ข้อ 2: ค้นหาจาก "ชื่อผู้เขียน" (`TC-SEARCH01-002`)
```bash
npx playwright test tests/search-.spec.js -g "TC-SEARCH01-002" --headed
```

### 🔹 ข้อ 3: ค้นหาจาก "แท็ก (#จักรวาล)" (`TC-SEARCH01-003`)
```bash
npx playwright test tests/search-.spec.js -g "TC-SEARCH01-003" --headed
```

### 🔹 ข้อ 4: ค้นหาคำที่ไม่มีในระบบ / Negative Test (`TC-SEARCH01-004`)
```bash
npx playwright test tests/search-.spec.js -g "TC-SEARCH01-004" --headed
```

### 🔹 ข้อ 5: กรองระดับการศึกษาและหมวดหมู่วิชา (`TC-SEARCH01-005`)
```bash
npx playwright test tests/search-.spec.js -g "TC-SEARCH01-005" --headed
```

---

## 🎮 3. โหมด UI Interactive (Playwright UI Mode)
โหมดนี้จะมีแผงควบคุมสวยงาม มีปุ่มกด Play/Pause ดูไทม์ไลน์ และดูโค้ดขณะทำงานแบบเรียลไทม์ เหมาะสำหรับการเดโม่หรือตรวจดูหน้าเว็บอย่างละเอียด:

```bash
npm run test:ui
```
*(หรือใช้คำสั่งเต็ม)*
```bash
npx playwright test --ui
```

---

## 📊 4. ดูรายงานผลการทดสอบ (HTML Report)
หลังจากรันเสร็จแล้ว สามารถเปิดรายงานผลแบบกราฟิกสวยงามในเบราว์เซอร์ได้ทันที:

```bash
npm run report
```
*(หรือใช้คำสั่งเต็ม)*
```bash
npx playwright show-report
```

---

## 🎥 5. ไฟล์วิดีโอบันทึกหน้าจอ (Saved Videos)
ระบบเปิดการบันทึกวิดีโออัตโนมัติ (**`video: 'on'`**) ไว้ใน `playwright.config.js` เรียบร้อยแล้ว:

### 📁 อยากได้ไฟล์วิดีโอไปเปิดดูได้ตลอดเวลา (ก๊อปไปลง Flash Drive / ส่งให้อาจารย์):
ได้รวบรวมไฟล์คลิปวิดีโอของทั้ง 5 ข้อ พร้อมตั้งชื่อเข้าใจง่ายไว้ที่โฟลเดอร์:
👉 **`saved-videos/`**
- `01_ค้นหาชื่อโพสต์_TC-001.webm`
- `02_ค้นหาชื่อผู้เขียน_เจเองคับ_TC-002.webm`
- `03_ค้นหาแท็กจักรวาล_TC-003.webm`
- `04_ค้นหาไม่พบ_TC-004.webm`
- `05_กรองระดับการศึกษาและวิชา_TC-005.webm`

*(หากรันเทสรอบใหม่แล้วอยากอัปเดตไฟล์ใน `saved-videos/` ให้รันคำสั่ง: `npm run save:videos`)*

---

## 📋 ตารางสรุปภาพรวม Test Cases ในไฟล์ `tests/search-.spec.js`

| Test Case ID | ชนิดการทดสอบ | รายละเอียดการทำงาน |
| :--- | :---: | :--- |
| **`TC-SEARCH01-001`** | Positive | ค้นหาจากชื่อโพสต์ `Frontend Backend Database` และตรวจชื่อในหน้ารายละเอียด |
| **`TC-SEARCH01-002`** | Positive | ค้นหาจากชื่อผู้เขียน `เจเองคับ` และตรวจชื่อผู้เขียนในหน้ารายละเอียด |
| **`TC-SEARCH01-003`** | Positive | ค้นหาจากแท็ก `#จักรวาล` และตรวจแท็กในหน้ารายละเอียด |
| **`TC-SEARCH01-004`** | Negative | ค้นหาคำที่ไม่มีอยู่ ตรวจสอบข้อความแจ้งเตือน และปุ่มล้างตัวกรอง |
| **`TC-SEARCH01-005`** | Positive | ติ๊กกรอง `มัธยมศึกษาตอนปลาย` + `ภาษาอังกฤษ` และตรวจป้ายบนหน้าปก |

---

## 💡 เคล็ดลับน่ารู้ (Tips & Troubleshooting)

### 1. ความเร็วในการรัน (SlowMo)
- ระบบได้ตั้งค่าหน่วงเวลาไว้ **1 วินาทีต่อการกระทำ (`slowMo: 1000`)** ในไฟล์ `playwright.config.js` เรียบร้อยแล้ว เพื่อให้น้องๆ มองเห็นการพิมพ์ การคลิก และการเลื่อนหน้าจอได้อย่างชัดเจน ไม่เร็วเกินไป

### 2. ถ้าติดปัญหา PowerShell ExecutionPolicy (Script Blocked)
หากน้องๆ รันคำสั่งใน PowerShell แล้วขึ้นข้อผิดพลาดสีแดงเรื่อง Script Policy:
- **วิธีที่ 1:** ให้เปิด Terminal แล้วเปลี่ยนเป็น **Command Prompt (CMD)** แทน PowerShell
- **วิธีที่ 2:** พิมพ์ `cmd /c` นำหน้าคำสั่ง เช่น:
  ```bash
  cmd /c "npm run test:search"
  ```
  หรือ
  ```bash
  cmd /c "npx playwright test --headed"
  ```
