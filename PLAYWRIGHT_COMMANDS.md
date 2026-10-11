# คำสั่ง Playwright สำหรับ Windows CMD

ระบุบัญชีที่ล็อกอินได้ในตัวแปร `account` ของ `global-setup.js` ก่อนรัน

## เข้าโฟลเดอร์โปรเจกต์

```cmd
cd /d D:\playwright-shere-ed-final
```

## ติดตั้งครั้งแรก

```cmd
npm ci
npx playwright install chromium
```

## ดูรายการเคสโดยไม่รัน

```cmd
npx playwright test --list --project=chromium --reporter=list
```

## รันทุกเคสใน create-post.spec.js

```cmd
npm test
```

แสดง browser ขณะรัน:

```cmd
npm run test:headed
```

## รันเฉพาะเคส 038

```cmd
npx playwright test -g "TC-POST01-038" --project=chromium
```

แสดง browser ขณะรัน:

```cmd
npx playwright test -g "TC-POST01-038" --project=chromium --headed
```

เคส 038 สร้างโพสต์จริงหนึ่งรายการต่อการรัน ตรวจ POST /api/v1/posts ตอบ 201, success, ID และสถานะ ACTIVE จากนั้นตรวจ dialog สำเร็จ พบโพสต์ในรายการเจ้าของ เปิด /post/<ID> ที่ตรงกับ response และตรวจข้อมูลกับรายการไฟล์แนบ

การตรวจไฟล์แนบในเคสนี้ตรวจการแสดงรูป ชื่อ PDF และปุ่มดาวน์โหลด ยังไม่ได้ทดสอบดาวน์โหลดหรือเปิดอ่าน PDF

## Debug เคส 038 และดู Network

```cmd
npx playwright test -g "TC-POST01-038" --project=chromium --debug
```

หาก browser อยู่ที่ about:blank ให้เปิด Playwright Inspector ด้วย Alt+Tab แล้วใช้ Step over เพื่อเดินทีละขั้น หรือ Resume เพื่อรันต่อ

ก่อนกดเผยแพร่ เปิด F12 > Network > Fetch/XHR และติ๊ก Preserve log แล้วเดินต่อจนกดเผยแพร่ ดู Headers > General ของ POST /api/v1/posts: Status Code ต้องเป็น 201 Created ส่วน GET /api/v1/posts/<ID> ตอนเปิดรายละเอียดตอบ 200 OK

## รันเคสอื่นหรือหลายเคส

```cmd
npx playwright test -g "TC-POST01-002" --project=chromium
npx playwright test -g "TC-POST01-03[56]" --project=chromium
```

## เปิด UI

```cmd
npm run test:ui
```

## ดูรายงานหลังรัน

```cmd
npx playwright show-report
```

ผลทดสอบอยู่ใน test-results และ HTML report อยู่ใน playwright-report ตาม config ปัจจุบัน video กับ trace เก็บเฉพาะเคสที่ล้มเหลว

หาก global setup ล้มเหลว เคสทดสอบจะยังไม่เริ่ม ตรวจข้อความ error และภาพ test-results/setup-login-error.png หากมี

## รันสร้างและลบโพสต์ทดสอบ (038 + 039)

เคส 039 เปิดเป็นค่าเริ่มต้น และลบเฉพาะ ID ที่เคส 038 สร้างในรอบเดียวกัน ตรวจชื่อก่อนลบ แล้วตรวจว่าไม่ปรากฏในรายการเจ้าของ ไม่ลบโพสต์เก่าหรือโพสต์อื่น

```cmd
set DELETE_TEST_POST=1
npx playwright test -g "TC-POST01-03[89]" --project=chromium
```

รันทุกเคสพร้อมลบโพสต์หลังตรวจ:

```cmd
set DELETE_TEST_POST=1
npm test
```

ปิดเคสลบเพื่อเก็บโพสต์ไว้ตรวจเอง:

```cmd
set DELETE_TEST_POST=0
npx playwright test -g "TC-POST01-03[89]" --project=chromium --headed
```

คืนค่าเริ่มต้นหลังตรวจเสร็จ (CMD จำค่าที่ set ไว้จนปิดหน้าต่าง):

```cmd
set DELETE_TEST_POST=
```

คำสั่งเลือกเฉพาะ 038 จะไม่รัน 039 จึงเก็บโพสต์ไว้ ส่วนการรัน 039 เดี่ยวจะ Skip เพราะไม่มี ID จากการสร้างในรอบนั้น เคสลบอ่านไฟล์ created-post-038.json ใน outputDir ซึ่ง Playwright ล้างก่อนรอบใหม่ ถ้าลบไม่สำเร็จ ให้ตรวจ report และไฟล์นี้ก่อนรันใหม่
## เปิด browser และหน่วงแต่ละ action (slowMo)

แก้ `launchOptions.slowMo` ใน `playwright.config.js` เป็น `500` หรือ `1000` (มิลลิวินาที) แล้วรัน:

```cmd
npm run test:headed
```

ตั้ง `slowMo: 0` เพื่อปิดการหน่วง การหน่วงนี้ใช้กับ browser ของเคสทดสอบ ไม่รวม browser ที่ global setup เปิดเอง