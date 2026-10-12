# Playwright — วิธีติดตั้ง ตั้งค่าบัญชี และรันเทส

ชุดนี้มี TC-POST01-001–039 รวม 39 เคสต่อ browser รันบน Chromium เป็นค่าเริ่มต้นทีละเคส
ทำตามขั้นตอนจากบนลงล่างใน **Terminal CMD (Command Prompt) ของ VS Code**
คำสั่งหลักรันทุกเคส ส่วนคำสั่งเลือกเคสเฉพาะอยู่ท้ายคู่มือ
คำสั่งทั้งหมดในคู่มือนี้ใช้กับ CMD (Command Prompt)

## 1. เปิด Terminal และเข้าโฟลเดอร์โปรเจกต์

เปิด CMD จาก Windows หรือใน VS Code เลือก **Terminal → New Terminal** แล้วเลือก **Command Prompt**
โปรเจกต์ตั้งค่าให้ Terminal ใหม่ใช้ CMD แล้ว หากหน้าต่างเดิมยังเป็น shell อื่นให้เปิด Terminal ใหม่
ทุกคำสั่งรันจากโฟลเดอร์หลัก ไม่ต้อง `cd` เข้า `playwright/`

```cmd
cd /d D:\playwright-shere-ed-final
```

## 2. ติดตั้งครั้งแรก

ติดตั้ง Node.js และ npm ก่อน จากนั้นติดตั้ง dependencies และ Chromium:

```cmd
npm ci
npx playwright install chromium
```

ทำครั้งแรก หรือเมื่อต้องติดตั้ง dependencies ใหม่ ไม่ต้องติดตั้งซ้ำก่อนรันทุกครั้ง

## 3. ตั้งค่าบัญชีทดสอบในไฟล์

ชุด Playwright เดิมใช้บัญชีที่ระบุใน JavaScript ให้เปิดแก้สองตำแหน่งใน editor:

1. `playwright/global-setup.js`: ใส่ `email` และ `password` ในตัวแปร `account`
   สำหรับเตรียม session ก่อนรันชุดทดสอบ
2. `playwright/tests/post/create-post.spec.js`: ในเคส `TC-POST01-001`
   เปลี่ยนค่าของ `.fill(...)` ที่ช่องอีเมลและรหัสผ่านให้เป็นบัญชีทดสอบ
   เพราะเคสนี้ล็อกอินเองและไม่ใช้ session ที่เตรียมไว้

บัญชีต้องเข้าสู่ระบบและสร้างโพสต์ได้ บันทึกไฟล์หลังแก้ไข
การตั้ง `set "TEST_EMAIL=..."` และ `set "TEST_PASSWORD=..."` เป็นวิธีของ Robot
ชุด Playwright ปัจจุบันไม่ได้อ่านตัวแปรสองตัวนี้

## 4. ตั้งค่าเว็บไซต์และการลบโพสต์ทดสอบ

```cmd
set "BASE_URL=https://share-ed.online/"
set "DELETE_TEST_POST=1"
```

`BASE_URL` มีค่าเริ่มต้นเป็นเว็บข้างต้น หากทดสอบเว็บอื่นให้เปลี่ยนค่าในบรรทัดนี้
`DELETE_TEST_POST=1` ให้เคสลบทำงานหลังเคสสร้างโพสต์
ค่ามีผลกับ Terminal นี้ ปิดแล้วเปิดใหม่ต้องกำหนดอีกครั้ง

## 5. ดูรายการทั้ง 39 เคสก่อนรัน

```cmd
npm test -- --list --reporter=list
```

`--list` แสดงรายการโดยไม่เปิดเว็บ ไม่ล็อกอิน และไม่สร้างโพสต์
ท้ายรายการควรแสดง `Total: 39 tests in 1 file`

## 6. รันทุกเคสบนเว็บจริง

### รันปกติ ไม่แสดงหน้าต่าง browser

```cmd
npm test
```

คำสั่งนี้รันครบ 39 เคส ทั้งล็อกอิน ฟอร์ม อัปโหลดไฟล์ ข้อมูลผิด
แฮชแท็ก สร้างโพสต์ และลบโพสต์ที่สร้างในรอบเดียวกัน
รอจน Terminal แสดงจำนวน `passed`, `failed` และ `skipped` หากมี

### รันทุกเคสโดยเปิด browser ให้เห็น

```cmd
npm run test:headed
```

เลือกคำสั่งรันปกติหรือเปิด browser อย่างใดอย่างหนึ่ง ไม่ต้องรันทั้งสองซ้ำ

### เปิดหน้า UI สำหรับดูและสั่งรันชุดทดสอบ

```cmd
npm run test:ui
```

ในหน้าต่าง Playwright UI เลือกชุดทดสอบแล้วกด Run
เลือก project ของ browser ก่อนรัน ให้รันชุดเต็มหากต้องการให้เคสสร้างและลบโพสต์ทำงานต่อกัน

## 7. เปิดรายงานหลังรัน

```cmd
npx playwright show-report artifacts/playwright/report
```

คำสั่งนี้เปิด HTML report ผ่าน local server ตาม URL ที่ Terminal แสดง
กด `Ctrl + C` ใน Terminal เมื่อเลิกดูรายงาน
หรือเปิดไฟล์ HTML โดยตรงได้:

```cmd
start "" "artifacts\playwright\report\index.html"
```

- `artifacts/playwright/report/`: รายงาน HTML และข้อมูลประกอบ
- `artifacts/playwright/test-results/<browser>/`: ผลทดสอบ screenshot video และ trace ของแต่ละ browser
- `playwright/.auth/member.json`: session ที่ global setup สร้างใหม่ก่อนรัน

หาก global setup ล้มเหลว เคสทดสอบจะยังไม่เริ่ม
ตรวจ error ใน Terminal และ `artifacts/playwright/test-results/chromium/setup-login-error.png` หากมี

## 8. ครั้งถัดไป: เปิด Terminal ใหม่แล้วรันทุกเคส

เมื่อ dependencies และบัญชีในไฟล์ตั้งค่าไว้แล้ว ใช้ชุดคำสั่งนี้:

```cmd
cd /d D:\playwright-shere-ed-final
set "BASE_URL=https://share-ed.online/"
set "DELETE_TEST_POST=1"
npm test
```

## 9. Debug และดู browser ทำงานช้าลง (ทางเลือก)

เปิด Inspector เพื่อเดินคำสั่งทีละขั้นของทั้งชุด:

```cmd
npm test -- --debug
```

ใช้ Step over เพื่อเดินทีละขั้น หรือ Resume เพื่อรันต่อ
หากต้องการหน่วง action ในโหมดเปิด browser ให้แก้ `launchOptions.slowMo`
ใน `playwright/playwright.config.js` เป็น `500` หรือ `1000` แล้วรัน:

```cmd
npm run test:headed
```

ตั้งกลับเป็น `0` เพื่อปิดการหน่วง ค่านี้ใช้กับ browser ของเคส ไม่รวม global setup

## 10. โครงสร้างที่ใช้รัน

- `playwright/tests/post/create-post.spec.js`: 39 test cases
- `playwright/global-setup.js`: ล็อกอินและบันทึก session สมาชิก
- `playwright/playwright.config.js`: config, selectors, timeout และรายงาน
- `test-data/`: รูปและ PDF ใช้ร่วมกับ Robot
- `package.json`: คำสั่ง npm ชี้ไป config ภายใน `playwright/` แล้ว

รันด้วย worker เดียว ไม่มี retry อัตโนมัติ
เคสขนาดไฟล์ใช้รูป 2 MiB และ PDF 20 MiB ตามไฟล์ต้นฉบับ แม้ชื่อเคสจะเขียนว่า MB

## 11. เลือก browser โดยรันครบ 39 เคส

ติดตั้ง Firefox และ WebKit เพิ่มครั้งแรก:

```cmd
npx playwright install firefox webkit
```

global setup เตรียม session ผ่าน Chromium จึงต้องมี Chromium จากขั้นที่ 2 ด้วย
คำสั่งแต่ละบรรทัดต่อไปนี้รันทั้ง 39 เคสบน browser ที่เลือก เลือกบรรทัดที่ต้องการ:

```cmd
npm test
npm run test:firefox
npm run test:webkit
npm run test:chrome
npm run test:edge
```

`chrome` และ `msedge` ใช้ Google Chrome และ Microsoft Edge ที่ติดตั้งในเครื่อง
`webkit` เป็น WebKit engine สำหรับทดสอบพฤติกรรมของ Safari ไม่ได้เปิดแอป Safari บน Windows
เปิดหน้าต่าง Firefox ให้เห็นขณะรัน:

```cmd
npm run test:firefox -- --headed
```

ใช้ `-- --headed` ต่อท้ายคำสั่ง browser อื่นได้เช่นเดียวกัน
รันทั้ง Chromium, Firefox และ WebKit ในคำสั่งเดียว รวม 117 เคส:

```cmd
npm run test:all-browsers
```

ผลและ record โพสต์ทดสอบแยกโฟลเดอร์ตาม browser เพื่อให้เคสลบใช้ record ของ project เดียวกัน
รายงาน HTML รวมผลไว้ใน `artifacts/playwright/report/`
เอกสาร browser: <https://playwright.dev/docs/browsers>

## 12. เลือกเคสเฉพาะ (ใช้หลังตั้งค่าขั้นที่ 1–4 แล้ว)

คำสั่งในส่วนนี้เป็นทางเลือก หากต้องการรันทั้งหมดให้ใช้ขั้นที่ 6
`-g` เลือกเคสจากชื่อด้วย regular expression
เมื่อส่ง options ผ่าน npm ต้องใส่ `--` คั่นก่อน options ของ Playwright

### รันเคสเดียว เช่น ตรวจฟิลด์ในหน้าสร้างโพสต์

```cmd
npm test -- -g "TC-POST01-002"
```

### รันหลายเคส เช่น ล็อกอินและตรวจฟิลด์

```cmd
npm test -- -g "TC-POST01-00[12]"
```

### รันกลุ่มแฮชแท็ก 025–036

```cmd
npm test -- -g "TC-POST01-(02[5-9]|03[0-6])"
```

### รันเคสเดียวโดยเปิด browser หรือ debug

```cmd
npm run test:headed -- -g "TC-POST01-003"
npm test -- -g "TC-POST01-003" --debug
```

เลือกคำสั่งตามรูปแบบที่ต้องการ ไม่ต้องรันทั้งสองซ้ำ

### รันเคสที่ต้องต่อเนื่องกัน: สร้างและลบโพสต์ (038 + 039)

```cmd
set "DELETE_TEST_POST=1"
npm test -- -g "TC-POST01-03[89]"
```

เคส 038 สร้างโพสต์ผ่านหน้าเว็บ ตรวจ POST ตอบ 201, success, ID และสถานะ ACTIVE
แล้วตรวจโพสต์ในรายการเจ้าของ หน้ารายละเอียด และการแสดงรายการไฟล์แนบ
การตรวจไฟล์แนบตรวจรูป ชื่อ PDF และปุ่มดาวน์โหลด ยังไม่ได้เปิดอ่านหรือดาวน์โหลด PDF

เคส 039 อ่าน ID และชื่อจาก `created-post-038.json` ใน output directory ของรอบนั้น
ตรวจว่าเป็นโพสต์ทดสอบเดียวกันก่อนลบ และตรวจว่าหายจากรายการเจ้าของ
Playwright ล้าง output directory ก่อนเริ่มรอบใหม่ จึงต้องรัน 038 และ 039 ในคำสั่งเดียวกัน
รัน 039 เดี่ยวจะข้ามเพราะไม่มี record ส่วนรัน 038 เดี่ยวจะเก็บโพสต์ไว้

หากต้องการเก็บโพสต์ไว้ตรวจเอง ตั้ง `set "DELETE_TEST_POST=0"` ก่อนรัน
แล้วคืนค่าเป็น `set "DELETE_TEST_POST=1"` เมื่อกลับมาทดสอบตามปกติ
หากลบไม่สำเร็จ ให้ตรวจ report และ `artifacts/playwright/test-results/<browser>/created-post-038.json`
ก่อนรันใหม่
