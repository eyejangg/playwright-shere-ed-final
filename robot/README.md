# Robot Framework — วิธีติดตั้ง ตั้งค่าบัญชี และรันเทส

ชุดนี้มี TC-POST01-001–039 รวม 39 เคส ใช้ Robot Framework + Browser Library
ทำตามขั้นตอนจากบนลงล่างใน **Terminal CMD (Command Prompt) ของ VS Code**
คำสั่งหลักรันทุกเคส ส่วนคำสั่งเลือกเคสเฉพาะอยู่ท้ายคู่มือ

## 1. เปิด Terminal และเข้าโฟลเดอร์โปรเจกต์

เปิด CMD จาก Windows หรือใน VS Code เลือก **Terminal → New Terminal** แล้วเลือก **Command Prompt**
โปรเจกต์ตั้งค่าให้ Terminal ใหม่ใช้ CMD แล้ว หากหน้าต่างเดิมยังเป็น shell อื่นให้เปิด Terminal ใหม่
ทุกคำสั่งด้านล่างรันจากโฟลเดอร์หลัก ไม่ต้อง `cd` เข้า `robot/`

```cmd
cd /d D:\playwright-shere-ed-final
```

## 2. เลือก Python environment

เลือกวิธีเดียวในขั้นนี้ `set "ROBOT_PYTHON=..."` กำหนด path ของ Python
เรียกผ่าน `"%ROBOT_PYTHON%"` ได้เลย โดยไม่ต้อง activate environment

### เครื่องนี้: ใช้ environment ที่ติดตั้งไว้แล้ว

environment นี้ติดตั้ง Robot Framework และ Browser Library แล้ว และใช้ตรวจเทสในเครื่องได้

```cmd
set "ROBOT_PYTHON=D:\playwright-shareed-robot\.venv-robot-313\Scripts\python.exe"
"%ROBOT_PYTHON%" --version
```

เมื่อแสดงเวอร์ชัน Python ให้ไปขั้นที่ 3 ได้เลย

### เครื่องใหม่ หรือยังไม่มี environment: ติดตั้งครั้งแรก

ติดตั้ง Python 3.13 และ Node.js ก่อน จากนั้นสร้าง environment ภายในโปรเจกต์:

```cmd
py -3.13 -m venv .venv-robot
set "ROBOT_PYTHON=%CD%\.venv-robot\Scripts\python.exe"
"%ROBOT_PYTHON%" -m pip install -r robot/requirements.txt
"%ROBOT_PYTHON%" -m Browser.entry init chromium
```

รอการติดตั้งเสร็จก่อนทำขั้นต่อไป ทำชุดคำสั่งติดตั้งเฉพาะครั้งแรก
หากสร้าง environment นี้แล้ว ครั้งถัดไปกำหนด `ROBOT_PYTHON` ด้วย `set` บรรทัดเดิม

## 3. ตั้งค่าบัญชีทดสอบ

เปิดไฟล์ `robot/config/account.local.json` ใน VS Code แล้วใส่บัญชีสมาชิก
ที่เข้าสู่ระบบและสร้างโพสต์ได้ ตั้งครั้งเดียวแล้วบันทึกไฟล์ ไม่ต้องพิมพ์บัญชีใน CMD ทุกครั้ง

```json
{
  "email": "your-test-email@example.com",
  "password": "your-test-password",
  "base_url": "https://share-ed.online/"
}
```

- `email` และ `password`: บัญชีที่ Robot ใช้ล็อกอิน
- `base_url`: เว็บไซต์ที่ทดสอบ มีค่าเริ่มต้นเป็น `https://share-ed.online/`
- `account.local.json`: ไฟล์บัญชีในเครื่อง ถูกยกเว้นจาก Git
- `account.example.json`: ตัวอย่างสำหรับเครื่องใหม่ ไม่มีบัญชีจริง

เครื่องนี้เตรียม `account.local.json` ด้วยบัญชีทดสอบเดิมให้แล้ว เปลี่ยนบัญชีในไฟล์นี้ได้
หากเป็นเครื่องใหม่ ให้สร้างไฟล์จากตัวอย่างแล้วแก้ค่าก่อนรัน:

```cmd
copy robot\config\account.example.json robot\config\account.local.json
```

Robot อ่านไฟล์อัตโนมัติ และยังกรอกรหัสผ่านผ่าน `Fill Secret`
เมื่อมีไฟล์นี้ Robot ใช้บัญชีและเว็บไซต์จากไฟล์เป็นหลัก ค่าเก่าใน CMD จะไม่ทับไฟล์
หากไม่มีไฟล์จึงใช้ `TEST_EMAIL`, `TEST_PASSWORD` และ `BASE_URL` จาก environment
ใส่อีเมลจริงแทนข้อความตัวอย่าง หากรูปแบบอีเมลไม่ถูกต้องเทสจะแจ้งก่อนเปิด browser

เคสลบโพสต์เปิดเป็นค่าเริ่มต้น ไม่ต้องตั้ง `DELETE_TEST_POST` ทุกครั้ง

## 4. ตรวจโครงสร้างทั้ง 39 เคสก่อนรันจริง

```cmd
"%ROBOT_PYTHON%" -m robot --dryrun --outputdir artifacts/robot/dryrun robot/tests
```

`--dryrun` ตรวจ keyword และ arguments โดยไม่เปิดเว็บ ไม่ล็อกอิน และไม่สร้างโพสต์
ผล `39 passed` ในขั้นนี้หมายถึงโครงสร้างผ่าน ยังไม่ใช่ผลทดสอบบนเว็บจริง

## 5. รันทุกเคสบนเว็บจริง

### รันปกติ ไม่แสดงหน้าต่าง browser

```cmd
"%ROBOT_PYTHON%" -m robot --outputdir artifacts/robot/results robot/tests
```

คำสั่งนี้รันครบ 39 เคสตามลำดับ ทั้งล็อกอิน ฟอร์ม อัปโหลดไฟล์ ข้อมูลผิด
แฮชแท็ก สร้างโพสต์ และลบโพสต์ที่สร้างในรอบเดียวกัน
รอจน Terminal แสดงจำนวน `passed`, `failed` และ `skipped`

### รันทุกเคสโดยเปิด browser ให้เห็น

```cmd
"%ROBOT_PYTHON%" -m robot --variable HEADLESS:False --outputdir artifacts/robot/results robot/tests
```

เลือกคำสั่งรันปกติหรือเปิด browser อย่างใดอย่างหนึ่ง ไม่ต้องรันทั้งสองซ้ำ

เทสเลื่อนไปยังจุดตรวจบนหน้าเว็บอัตโนมัติเมื่อใช้ `Expect Element Visible`,
`Expect Property` หรือ `Expect Text` หากจุดนั้นอยู่ในหน้าต่างอยู่แล้วจะไม่เลื่อนซ้ำ
ปิดการเลื่อนอัตโนมัติได้ โดยยังรันครบทุกเคส:

```cmd
"%ROBOT_PYTHON%" -m robot --variable HEADLESS:False --variable SCROLL_TO_EXPECT:False --outputdir artifacts/robot/results robot/tests
```

## 6. เปิดรายงานหลังรัน

```cmd
start "" "artifacts\robot\results\report.html"
start "" "artifacts\robot\results\log.html"
```

- `report.html`: ภาพรวม จำนวนผ่าน ไม่ผ่าน และข้าม
- `log.html`: รายละเอียดแต่ละเคสและ keyword ที่ล้มเหลว
- `output.xml`: ผลในรูปแบบที่เครื่องมืออื่นอ่านต่อได้
- screenshot และ trace ของเคสที่ล้มเหลวอยู่ใต้ output directory เดียวกัน

รายงาน dry run อยู่ใน `artifacts/robot/dryrun/` แยกจากผลรันจริง

## 7. ครั้งถัดไป: เปิด Terminal ใหม่แล้วรันทุกเคส

ใช้คำสั่ง npm ได้โดยไม่ต้องกำหนด Python หรือบัญชีใน CMD อีก:

```cmd
cd /d D:\playwright-shere-ed-final
npm run test:robot
```

เปิด browser ให้เห็นขณะรันครบทุกเคส:

```cmd
npm run test:robot -- --variable HEADLESS:False
```

ตัวรันเลือก `ROBOT_PYTHON` หากกำหนดไว้ มิฉะนั้นเลือก `.venv-robot` ในโปรเจกต์
หรือ environment เดิมข้างโปรเจกต์ที่ใช้ตรวจบนเครื่องนี้ แล้วจึงลอง `python` ใน PATH
บัญชียังอ่านจากไฟล์ `robot/config/account.local.json` ตามเดิม
ตรวจโครงสร้างด้วย `npm run test:robot:dryrun` หรือ localhost ด้วย `npm run test:robot:smoke`

สำหรับเครื่องนี้ที่ใช้ environment เดิมและบันทึกบัญชีในไฟล์แล้ว คัดลอกชุดนี้ได้เลย:

```cmd
cd /d D:\playwright-shere-ed-final
set "ROBOT_PYTHON=D:\playwright-shareed-robot\.venv-robot-313\Scripts\python.exe"
"%ROBOT_PYTHON%" -m robot --outputdir artifacts/robot/results robot/tests
```

หากใช้ `.venv-robot` ในโปรเจกต์ ให้เปลี่ยนบรรทัด `ROBOT_PYTHON` เป็น
`set "ROBOT_PYTHON=%CD%\.venv-robot\Scripts\python.exe"`
ไม่ต้องสร้าง environment หรือติดตั้งแพ็กเกจใหม่ทุกครั้ง

## 8. ตรวจ Browser Library บน localhost (ทางเลือก)

ใช้เมื่อต้องการตรวจการเปิด browser, selectors, upload, session และ response wait
โดยไม่เข้าเว็บ SHARE-ED และไม่ต้องตั้งค่าบัญชี:

```cmd
"%ROBOT_PYTHON%" -m robot --outputdir artifacts/robot/smoke robot/checks/browser_smoke.robot
start "" "artifacts\robot\smoke\report.html"
```

ชุดนี้มี 7 เคส ผลปกติคือผ่าน 5 เคส และข้าม 2 เคสตามเงื่อนไขการลบ
ผลนี้แยกจาก 39 เคสบนเว็บจริง

## 9. โครงสร้างที่ใช้รันและการตรวจปัญหา

- `robot/tests/create_post.robot`: 39 test cases
- `robot/config/account.local.json`: บัญชีและเว็บไซต์ในเครื่อง
- `robot/config/variables.py`: อ่านค่าจากไฟล์และตัวแปร environment
- `robot/resources/share_ed.resource`: session selectors และ keywords ร่วม
- `robot/requirements.txt`: เวอร์ชัน Python packages
- `test-data/`: รูปและ PDF ใช้ร่วมกับ Playwright
- `artifacts/robot/`: ผลทดสอบและ session ไม่เข้า Git

รันทีละเคส ไม่มีการรันขนานหรือ retry อัตโนมัติ
แต่ละเคสมี context ใหม่ โดยใช้ session สมาชิกจาก Suite Setup ยกเว้นเคสล็อกอิน

หากแจ้งว่าไม่พบ Robot หรือ Browser ให้ตรวจว่า `ROBOT_PYTHON` ชี้ไป environment
ที่ติดตั้ง `robot/requirements.txt` แล้ว หากแจ้งว่าไม่มีบัญชี ให้ตรวจไฟล์ในขั้นที่ 3
หาก Suite Setup ล้มเหลว ให้ดูรายละเอียดล็อกอินใน `log.html` ก่อนตรวจเคสอื่น

ชุดนี้แปลงจาก Playwright commit `202f918` และยังเก็บชุดเดิมไว้ใน `playwright/`
เคสขนาดไฟล์ใช้รูป 2 MiB และ PDF 20 MiB ตามไฟล์ต้นฉบับ แม้ชื่อเคสจะเขียนว่า MB
คู่มือ Browser Library: <https://github.com/MarketSquare/robotframework-browser>

### Expected result และการเลื่อนไปยังจุดตรวจ

Expected result คือผลที่เทสคาดหวัง คำสั่ง assertion นำผลจริงมาเทียบกับค่านี้
Robot ใช้ keywords สำหรับตรวจผล ไม่ได้มีคำสั่ง `expect()` แบบ Playwright Test
ส่วน `Expect ...` ในโปรเจกต์นี้เป็น keywords ที่เพิ่มไว้ใน `share_ed.resource`
เพื่อเลื่อนหน้าและเรียก assertion ของ Browser Library

```robot
Expect Element Visible    [test-data="post-title-input"]
Expect Property    [test-data="post-title-input"]    value    ==    ทบทวนแคลคูลัส
Expect Text    ${EDITOR}    contains    ข้อความตัวอย่าง
```

บรรทัดแรกคาดว่าฟิลด์แสดง บรรทัดที่สองคาดว่าค่าฟิลด์ตรงกับชื่อที่กรอก
บรรทัดที่สามคาดว่าเนื้อหามีข้อความที่กำหนด หากไม่ตรง เทสจะแจ้ง FAIL
การเลื่อนใช้ `Scroll To Element` ของ Browser Library ให้เป้าหมายอยู่ในหน้าต่าง
คำสั่งตรวจ URL, API, จำนวนองค์ประกอบ และไฟล์ input ที่ซ่อนไว้คงการตรวจเดิม
โดยไม่พยายามเลื่อนไปยังองค์ประกอบที่ไม่มีหรือซ่อนอยู่
เอกสาร keyword: <https://robotframework-browser.org/keywords/#scroll-to-element>

## 10. เลือก browser โดยรันครบ 39 เคส

ค่าเริ่มต้นคือ `chromium` เปลี่ยนผ่าน `--variable BROWSER:ชื่อ` ได้
เครื่องนี้เตรียม Chromium, Firefox และ WebKit พร้อมแล้ว ไม่ต้องติดตั้งซ้ำ
หากเป็นเครื่องใหม่หรือต้องติดตั้ง browser ใหม่ ให้ติดตั้งทั้งสามใน environment ที่ใช้รัน Robot:

```cmd
"%ROBOT_PYTHON%" -m Browser.entry init chromium firefox webkit
```

รันทุกเคสบน Firefox และเปิด browser ให้เห็น:

```cmd
"%ROBOT_PYTHON%" -m robot --variable BROWSER:firefox --variable HEADLESS:False --outputdir artifacts/robot/firefox robot/tests
```

รันทุกเคสบน WebKit:

```cmd
"%ROBOT_PYTHON%" -m robot --variable BROWSER:webkit --variable HEADLESS:False --outputdir artifacts/robot/webkit robot/tests
```

ใช้ `BROWSER:chrome` หรือ `BROWSER:msedge` สำหรับ Chrome หรือ Edge ที่ติดตั้งในเครื่อง:

```cmd
"%ROBOT_PYTHON%" -m robot --variable BROWSER:chrome --variable HEADLESS:False --outputdir artifacts/robot/chrome robot/tests
"%ROBOT_PYTHON%" -m robot --variable BROWSER:msedge --variable HEADLESS:False --outputdir artifacts/robot/msedge robot/tests
```

เลือกคำสั่งเดียวตาม browser ที่ต้องการ แต่ละคำสั่งรันครบ 39 เคส
แยก output directory เพื่อเก็บรายงานแต่ละ browser เช่น `artifacts/robot/firefox/report.html`
`webkit` เป็น WebKit engine สำหรับทดสอบพฤติกรรมของ Safari ไม่ได้เปิดแอป Safari บน Windows
บัญชีอ่านจากไฟล์เดิม การเลื่อนไปจุด expect ยังทำงานตามเดิม
เอกสาร browser: <https://robotframework-browser.org/keywords/#new-browser>

## 11. เลือกเคสเฉพาะ (ใช้หลังตั้งค่าขั้นที่ 1–3 แล้ว)

คำสั่งในส่วนนี้เป็นทางเลือก หากต้องการรันทั้งหมดให้ใช้ขั้นที่ 5
`--include` เลือกจาก tag ของเคส และ `--exclude` ตัดกลุ่มที่ไม่ต้องการ

### รันเคสเดียว เช่น ตรวจฟิลด์ในหน้าสร้างโพสต์

```cmd
"%ROBOT_PYTHON%" -m robot --include TC-POST01-002 --outputdir artifacts/robot/selected robot/tests
```

### รันหลายเคส เช่น ล็อกอินและตรวจฟิลด์

```cmd
"%ROBOT_PYTHON%" -m robot --include TC-POST01-001 --include TC-POST01-002 --outputdir artifacts/robot/selected robot/tests
```

### รันกลุ่มแฮชแท็ก 025–036

```cmd
"%ROBOT_PYTHON%" -m robot --include "TC-POST01-02[5-9]" --include "TC-POST01-03[0-6]" --outputdir artifacts/robot/selected robot/tests
```

### รัน 001–037 โดยตัดเคสสร้างและลบโพสต์ออก

```cmd
"%ROBOT_PYTHON%" -m robot --exclude live-write --outputdir artifacts/robot/selected robot/tests
```

เคส validation ในกลุ่มนี้ยังคลิกเผยแพร่เพื่อตรวจข้อความแจ้งข้อผิดพลาดตามต้นฉบับ

### รันเคสที่ต้องต่อเนื่องกัน: สร้างและลบโพสต์ (038 + 039)

```cmd
set "DELETE_TEST_POST=1"
"%ROBOT_PYTHON%" -m robot --include TC-POST01-038 --include TC-POST01-039 --outputdir artifacts/robot/selected robot/tests
```

เคส 039 ลบเฉพาะ ID และชื่อที่เคส 038 สร้างใน suite รอบเดียวกัน
หากรัน 039 เดี่ยวจะข้ามเพราะไม่มีโพสต์จาก 038 ในรอบนั้น
คำสั่งรัน 038 เดี่ยวจะเก็บโพสต์ไว้ เพราะไม่ได้เลือกเคสลบ

หากต้องการเก็บโพสต์ไว้ตรวจเอง ตั้ง `set "DELETE_TEST_POST=0"` ก่อนรัน
แล้วคืนค่าเป็น `set "DELETE_TEST_POST=1"` เมื่อกลับมาทดสอบตามปกติ
เปิดรายงานของคำสั่งเลือกเคสด้วย:

```cmd
start "" "artifacts\robot\selected\report.html"
start "" "artifacts\robot\selected\log.html"
```
