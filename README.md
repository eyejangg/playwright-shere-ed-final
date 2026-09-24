# Playwright Automation Testing — SHARE-ED

โปรเจกต์นี้ใช้ Playwright สำหรับทดสอบระบบ SHARE-ED โดยไฟล์ `tests/post/create-post.spec.js` มี Test Case การสร้างโพสต์ตั้งแต่ `TC-POST01-001` ถึง `TC-POST01-038` (ทั้งหมด 38 เคส)

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
│       └── create-post.spec.js  # TC-POST01-001 ถึง TC-POST01-038 (38 เคส)
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

## การใช้งาน Docker

### Docker ใช้ทำไม

Docker ใช้สร้างสภาพแวดล้อมสำหรับรัน Playwright ให้เหมือนกันทุกเครื่อง ภายใน Docker image มี Linux, Node.js, Chromium และ Browser dependencies ที่ Playwright ต้องใช้ครบแล้ว

ปัญหาที่ Docker ช่วยลดได้:

- เครื่องผู้ทดสอบแต่ละคนใช้ Node.js หรือ Browser คนละเวอร์ชัน
- เครื่องใหม่ยังไม่ได้ติดตั้ง Chromium หรือ Browser dependencies
- Test รันผ่านในเครื่องหนึ่ง แต่ Fail อีกเครื่องหนึ่งเพราะ environment ไม่เหมือนกัน
- ต้องเสียเวลาติดตั้งเครื่องมือใหม่ทุกครั้งที่เปลี่ยนเครื่อง

เมื่อใช้ Docker ผู้ใช้งานต้องมีเพียง Docker Desktop จากนั้น Build และ Run image ด้วยคำสั่งเดียวกัน

Docker ในโปรเจกต์นี้ใช้สำหรับ:

1. ให้สมาชิกในทีมรัน Test บนเครื่องตัวเองได้เหมือนกัน
2. แยก dependencies ของ Playwright ออกจากเครื่องผู้ใช้งาน
3. รัน Test ทั้ง 39 เคสด้วย Chromium
4. ส่ง HTML Report, Video, Screenshot และ Trace กลับมาไว้ที่เครื่อง

Docker ไม่ได้ใช้สำหรับ Deploy เว็บไซต์ SHARE-ED และไม่ได้เป็นตัวควบคุม Automation ตามเวลา หน้าที่ดังกล่าวเป็นของ GitHub Actions

โครงสร้างที่เลือกใช้คือ:

```text
การรันในเครื่อง:
ผู้ใช้งาน → Docker → Playwright → SHARE-ED → Report

การรันอัตโนมัติ:
GitHub Push → GitHub Actions → Playwright → SHARE-ED → Artifact
```

GitHub Actions สามารถรัน Playwright โดยตรงได้ จึงไม่จำเป็นต้อง Build Docker image ซ้ำทุกครั้ง Dockerfile จะเก็บไว้สำหรับการรันในเครื่องและแชร์ environment ให้สมาชิกในทีม

### ไฟล์ Docker ที่เพิ่มในโปรเจกต์

```text
Dockerfile
.dockerignore
```

`Dockerfile` ใช้ Playwright image เวอร์ชันเดียวกับ `package-lock.json`:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.63.0-noble
```

การใช้เวอร์ชันตรงกันมีความสำคัญ เพราะถ้า Playwright package และ Browser image คนละเวอร์ชัน อาจเกิดปัญหาหา Browser executable ไม่พบ

Dockerfile ทำงานตามลำดับ:

1. ใช้ Playwright image `v1.63.0-noble`
2. กำหนดโฟลเดอร์ทำงานเป็น `/app`
3. กำหนด `CI=true`
4. คัดลอก `package.json` และ `package-lock.json`
5. ติดตั้ง packages ด้วย `npm ci`
6. คัดลอก Test, Config และ Test data เข้า image
7. เตรียมโฟลเดอร์ session และผลทดสอบ
8. รันไฟล์ `tests/post/create-post.spec.js` ด้วย Chromium

คำสั่งเริ่มต้นของ Container:

```dockerfile
CMD ["npx", "playwright", "test", "tests/post/create-post.spec.js", "--project=chromium"]
```

ดังนั้นหากรัน Container โดยไม่ส่งคำสั่งเพิ่มเติม ระบบจะรัน Test การสร้างโพสต์ทั้ง 39 เคส

### หน้าที่ของ `.dockerignore`

`.dockerignore` ป้องกันไม่ให้ไฟล์ที่ไม่จำเป็นถูกส่งเข้า Docker build context เช่น:

```text
node_modules
test-results
playwright-report
playwright/.auth
.git
.env
```

เหตุผลสำคัญคือ:

- ลดขนาด Docker image
- Build เร็วขึ้น
- ไม่คัดลอก Report เก่าเข้า image
- ไม่คัดลอก session Login เข้า image
- ไม่คัดลอก Environment Variables หรือไฟล์ลับเข้า image

### Build Docker image

เปิด Docker Desktop และรอจน Docker Engine พร้อมทำงาน จากนั้นเปิด Terminal ที่โฟลเดอร์โปรเจกต์:

```cmd
cd D:\playwright-shere-ed-final
docker build -t share-ed-playwright .
```

ชื่อ image ที่ได้:

```text
share-ed-playwright:latest
```

ตรวจสอบ image:

```cmd
docker images share-ed-playwright
```

หากมีการแก้ Test, Config, `global-setup.js` หรือ Test data ต้อง Build image ใหม่ก่อนรัน:

```cmd
docker build -t share-ed-playwright .
```

หากต้องการ Build ใหม่ทั้งหมดโดยไม่ใช้ cache:

```cmd
docker build --no-cache -t share-ed-playwright .
```

### การส่งข้อมูล Login เข้า Container

บัญชีทดสอบต้องส่งผ่าน Environment Variables:

```text
MEMBER_EMAIL
MEMBER_PASSWORD
BASE_URL
```

`global-setup.js` อ่านค่าเหล่านี้แล้วนำไป Login และบันทึก session ลง:

```text
playwright/.auth/member.json
```

ไม่ควรเขียน Email และ Password ตายตัวไว้ใน source code หรือ Dockerfile เพราะผู้ที่ได้รับ image สามารถตรวจสอบข้อมูลภายใน image ได้

### รัน Docker ผ่าน Command Prompt

ใช้ `^` สำหรับต่อคำสั่งหลายบรรทัด และห้ามมีช่องว่างหลัง `^`:

```cmd
docker run --rm --ipc=host ^
-e "MEMBER_EMAIL=ใส่อีเมลบัญชีทดสอบ" ^
-e "MEMBER_PASSWORD=ใส่รหัสผ่านบัญชีทดสอบ" ^
-e "BASE_URL=https://share-ed.online/" ^
--mount "type=bind,source=%cd%\test-results,target=/app/test-results" ^
--mount "type=bind,source=%cd%\playwright-report,target=/app/playwright-report" ^
share-ed-playwright
```

หาก Command Prompt แสดง `More?` หมายความว่ากำลังรอคำสั่งบรรทัดต่อไป ถือเป็นการทำงานปกติ

ห้ามเริ่มคำสั่งด้วย `-e` โดยไม่มี `docker run` และห้ามใช้ backtick แบบ PowerShell ใน Command Prompt

### รัน Docker ผ่าน PowerShell

PowerShell ใช้ backtick สำหรับต่อบรรทัด:

```powershell
docker run --rm --ipc=host `
  -e "MEMBER_EMAIL=ใส่อีเมลบัญชีทดสอบ" `
  -e "MEMBER_PASSWORD=ใส่รหัสผ่านบัญชีทดสอบ" `
  -e "BASE_URL=https://share-ed.online/" `
  -v "${PWD}/test-results:/app/test-results" `
  -v "${PWD}/playwright-report:/app/playwright-report" `
  share-ed-playwright
```

### ความหมายของ Docker options

| Option | ความหมาย |
|---|---|
| `--rm` | ลบ Container หลังรันเสร็จ แต่ไม่ลบ image และไฟล์ Report ที่ mount ไว้ |
| `--ipc=host` | ให้ Chromium ใช้ shared memory ของ host ลดปัญหา Browser crash |
| `-e` | ส่ง Environment Variable เข้า Container |
| `--mount` หรือ `-v` | เชื่อมโฟลเดอร์ในเครื่องกับโฟลเดอร์ภายใน Container |
| `share-ed-playwright` | ชื่อ Docker image ที่ใช้รัน |

หากไม่ mount `test-results` และ `playwright-report` ไฟล์ผลทดสอบจะถูกลบตาม Container เนื่องจากใช้ `--rm`

### รันเฉพาะ TC-POST01-038 ใน Docker

Command Prompt:

```cmd
docker run --rm --ipc=host -e "MEMBER_EMAIL=ใส่อีเมลบัญชีทดสอบ" -e "MEMBER_PASSWORD=ใส่รหัสผ่านบัญชีทดสอบ" -e "BASE_URL=https://share-ed.online/" --mount "type=bind,source=%cd%\test-results,target=/app/test-results" --mount "type=bind,source=%cd%\playwright-report,target=/app/playwright-report" share-ed-playwright npx playwright test tests/post/create-post.spec.js --project=chromium --grep TC-POST01-038
```

คำสั่งที่เขียนต่อท้ายชื่อ image จะใช้แทน `CMD` ใน Dockerfile

### ผลการทดลอง Docker ในเครื่อง

ได้ Build image จริงด้วยคำสั่ง:

```cmd
docker build -t share-ed-playwright .
```

ผลการ Build:

```text
Image: share-ed-playwright:latest
Exit code: 0
```

จากนั้นทดลองรัน Test ทั้ง 38 เคสใน Container:

```text
Running 38 tests using 1 worker
37 passed
1 failed
```

Docker สามารถทำงานได้ครบดังนี้:

- เปิด Chromium ใน Container
- Login ด้วยบัญชี Member
- รัน Test Case ทั้ง 38 เคส
- อัปโหลดไฟล์จาก `test-data`
- สร้างและตรวจโพสต์
- บันทึก Video, Screenshot และ Trace
- สร้าง HTML Report
- เขียน Report กลับมายังโฟลเดอร์ในเครื่อง

Test ที่ Fail คือ `TC-POST01-038` ในขั้นตอนตรวจสอบหลังลบโพสต์ ระบบแสดงข้อความว่าลบสำเร็จ แต่ยังพบชื่อโพสต์ในหน้า Explore แม้ Reload หน้าแล้ว:

```text
Expected: 0
Received: 1
```

Assertion ที่พบปัญหา:

```js
await expect(
  page.getByText(postTitle, { exact: true })
).toHaveCount(0);
```

ผลนี้แสดงว่า Docker ทำงานถูกต้อง แต่ Test ตรวจพบพฤติกรรมของระบบ SHARE-ED ที่ไม่ตรงกับ Expected Result จึงไม่ควรแก้ assertion เพียงเพื่อให้ Test ผ่าน

### ตำแหน่งผลการทดสอบจาก Docker

```text
test-results/
playwright-report/
```

เปิด HTML Report:

```cmd
npx.cmd playwright show-report
```

หาก port เดิมถูกใช้งาน:

```cmd
npx.cmd playwright show-report --port 9324
```

### ปัญหา Docker ที่เคยพบ

#### `'-e' is not recognized`

เกิดจากรันเฉพาะบรรทัด `-e` หรือใช้รูปแบบ PowerShell ใน Command Prompt ต้องเริ่มด้วย `docker run` และใช้ `^` ต่อบรรทัด

#### Login Timeout

```text
TimeoutError: waiting for locator('[data-testid="create-post-btn"]')
```

หมายความว่า Login ไม่สำเร็จ ให้ตรวจ `MEMBER_EMAIL`, `MEMBER_PASSWORD` และตรวจว่าไม่มีช่องว่างหลัง `^`

#### Test Exit Code 1

ไม่ได้หมายความว่า Docker เสียเสมอไป ต้องอ่านผล Playwright ด้านบน หาก Container รัน Test ได้และมีบาง Test Fail Docker จะส่ง Exit Code 1 ตามผล Test

#### แก้โค้ดแล้ว Docker ยังใช้โค้ดเดิม

Docker image เก็บ source code ตอน Build ต้อง Build ใหม่หลังแก้ไฟล์:

```cmd
docker build -t share-ed-playwright .
```

## วิธีรัน Test

### รัน Test ทั้งโปรเจกต์

```powershell
npm test
```

### รัน Test การสร้างโพสต์ทั้งหมด 38 เคส

รันผ่าน npm script (แนะนำบน Windows เพื่อลดปัญหา path และ execution policy):

```powershell
npm run test:post
```

หรือรันผ่านคำสั่ง Playwright:

```powershell
npx.cmd playwright test tests/post/create-post.spec.js --project=chromium
```

> **ข้อควรระวังบน Windows:** ต้องใช้เครื่องหมาย Slash (`/`) เช่น `tests/post/...` เสมอ ห้ามใช้ Backslash (`\`) เช่น `tests\post\...` เพราะ Playwright จะตีจำเป็น Regular Expression และทำให้เกิดข้อผิดพลาด `Error: No tests found`

### รันเฉพาะ Test Case ที่ต้องการ (เช่น TC-POST01-038)

ใช้ flag `-g` (หรือ `--grep`) เพื่อระบุชื่อ Test Case:

```powershell
npx.cmd playwright test tests/post/create-post.spec.js -g "TC-POST01-038"
```

> **หมายเหตุ:** ต้องใส่ `-g` นำหน้าเสมอ หากใส่ชื่อ Test Case เข้าไปตรงๆ Playwright จะเข้าใจว่าเป็นชื่อไฟล์และแจ้ง `Error: No tests found` และในไฟล์นี้ Test Case สุดท้ายคือ `TC-POST01-038` (ไม่ใช่ 039)

### รันแบบเปิด UI Mode (แนะนำ สะดวกที่สุด)

เปิดหน้าต่าง Playwright UI เพื่อคลิกเลือกรันทีละเคส ดูผลลัพธ์ขั้นตอนย่อยและ Time Travel Debug ได้ทันที ไม่ต้องพิมพ์ regex หรือจำคำสั่ง:

```powershell
npm run test:ui
```

หรือ:

```powershell
npx.cmd playwright test --ui
```

### รันแบบเห็นหน้าต่าง Browser (Headed)

```powershell
npx.cmd playwright test tests/post/create-post.spec.js -g "TC-POST01-038" --headed
```

### รันแบบ Debug ทีละขั้นตอน

```powershell
$env:PWDEBUG="1"
npx.cmd playwright test tests/post/create-post.spec.js -g "TC-POST01-038" --headed
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

## TC-POST01-038 ทำอะไรบ้าง

Test Case นี้ทดสอบการเผยแพร่โพสต์แบบใส่ข้อมูลครบทุกฟิลด์ (`TC-POST01-038: เผยแพร่โพสต์สำเร็จเมื่อกรอกข้อมูลครบถ้วน`) โดยมีขั้นตอนดังนี้:

1. กรอกข้อมูลฟิลด์บังคับ: แนบรูปปก, กรอกหัวข้อโพสต์, เลือกระดับชั้น, กรอกบทสรุปย่อ
2. กำหนดหมวดวิชาและแท็ก: เลือกวิชาคณิตศาสตร์ และเลือกแท็ก `#สรุปย่อ`
3. กรอกรายละเอียดเนื้อหาเพิ่มเติม
4. แนบรูปภาพประกอบ และแนบไฟล์ PDF (`document.pdf`)
5. กดปุ่ม "โพสต์สรุปความรู้" และตรวจยืนยันข้อความ "โพสต์สำเร็จ!"
6. ตรวจสอบว่าระบบนำทางกลับหน้าแรก (`/home`) และพบโพสต์ที่เพิ่งสร้าง
7. คลิกเข้าสู่หน้ารายละเอียดของโพสต์ (`/post/:id`)
8. ตรวจสอบข้อมูลในโพสต์: ชื่อหัวข้อ, หมวดวิชา, ระดับชั้น, บทสรุปย่อ, รายละเอียด, รูปภาพประกอบ
9. ตรวจสอบไฟล์เอกสาร PDF (`document.pdf` และปุ่มดาวน์โหลดลิงก์ `.pdf`)
10. ตรวจสอบแฮชแท็ก (`#สรุปย่อ`)
11. ส่วน Cleanup ในบล็อก `finally`:
    - ย้อนกลับมาที่หน้าแรก (`/home`) และค้นหาโพสต์ทดสอบ
    - คลิกเข้าโพสต์ แล้วกดปุ่ม "ลบโพสต์"
    - กดยืนยันการลบ ("ใช่, ลบเลย")
    - กดยืนยัน Pop-up ยืนยันลบสำเร็จ ("ลบสำเร็จ!")
    - ตรวจสอบว่าระบบนำทางสู่หน้าสำรวจ (`/explore`) แล้วตรวจนับว่าโพสต์ที่ถูกลบต้องไม่ปรากฏอีก (`toHaveCount(0)`)

ขั้นตอนลบอยู่ใน `finally` เพื่อให้ระบบพยายามลบโพสต์ทดสอบเสมอ แม้ assertion ก่อนหน้าจะ Fail

## Known Defect ของ TC-POST01-038

1. **ชื่อไฟล์ PDF แสดงผลไม่ตรงกับชื่อต้นฉบับ:**  
   ไฟล์ที่อัปโหลดมีชื่อ `document.pdf` แต่หน้ารายละเอียดโพสต์แสดงชื่อที่ระบบสุ่มสร้างใหม่ เช่น:
   ```text
   xbughsemnw...pdf
   ```
   Test จึงตรวจชื่อเดิมด้วยคำสั่ง:
   ```js
   await expect(page.getByText('document.pdf', { exact: true })).toBeVisible();
   ```
   ถ้าระบบยังแสดงชื่อสุ่ม Test Case จะ Fail ซึ่งเป็นผลที่ถูกต้องสำหรับ defect นี้ แต่ส่วน `finally` จะยังคงลบโพสต์ทดสอบออกตามปกติ

2. **การลบโพสต์ในหน้า Explore:**  
   หลังยืนยันการลบโพสต์สำเร็จแล้ว บางครั้งในหน้า `/explore` ยังคงแสดงชื่อโพสต์เดิมอยู่ (เกิดจากแคชฝั่งเซิร์ฟเวอร์ยังไม่อัปเดตทันที) ทำให้ assertion ตรวจนับจำนวนเป็น 0 ไม่ผ่าน

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

## การรัน Test ด้วย Docker

สามารถรัน Test ทั้งหมดผ่าน Docker ได้ เพื่อความสะดวกในการทำงานร่วมกันโดยไม่ต้องกังวลเรื่องสภาพแวดล้อมหรือ dependencies ในเครื่อง

### ลำดับขั้นตอนการทำงาน (Workflow)

```text
1. เปิด Docker Desktop ในเครื่อง
         ↓
2. Build Docker Image (ทำครั้งแรก หรือเมื่อมีการแก้โค้ด)
         ↓
3. สั่ง docker run พร้อมส่ง Email/Password และ Mount Volume
         ↓
4. เปิดดู HTML Report บนเครื่อง
```

---

### ขั้นตอนที่ 1: ตรวจสอบความพร้อม

- ติดตั้งและเปิดโปรแกรม **Docker Desktop**
- ตรวจสอบว่าคำสั่ง docker ใช้งานได้:
  ```powershell
  docker --version
  ```

---

### ขั้นตอนที่ 2: Build Docker Image

เปิด PowerShell ในโฟลเดอร์โปรเจกต์ แล้วรัน:

```powershell
docker build -t playwright-tests .
```

> **คำอธิบาย:** คำสั่งนี้จะอ่าน [Dockerfile](file:///d:/playwright-shere-ed-final/Dockerfile) เพื่อดาวน์โหลดสภาพแวดล้อม Playwright และติดตั้ง dependencies อัตโนมัติ

---

### ขั้นตอนที่ 3: สั่งรัน Test

รันคำสั่งโดยส่งค่าบัญชีผู้ใช้ผ่าน `-e` และเชื่อมโฟลเดอร์ Report ออกมาที่เครื่องเราผ่าน `-v`:

#### รันทุก Test Case (38 เคส):
```powershell
docker run --rm `
  -v ${PWD}/playwright-report:/app/playwright-report `
  -v ${PWD}/test-results:/app/test-results `
  -e MEMBER_EMAIL="your_email@example.com" `
  -e MEMBER_PASSWORD="your_password" `
  playwright-tests
```

#### รันเฉพาะเคสที่ต้องการ (เช่น TC-POST01-038):
```powershell
docker run --rm `
  -v ${PWD}/playwright-report:/app/playwright-report `
  -v ${PWD}/test-results:/app/test-results `
  -e MEMBER_EMAIL="your_email@example.com" `
  -e MEMBER_PASSWORD="your_password" `
  playwright-tests npx playwright test tests/post/create-post.spec.js --grep "TC-POST01-038"
```

---

### ขั้นตอนที่ 4: เปิดดู Report หลังรันเสร็จ

เนื่องจากเราตั้งค่า `-v` (Volume Mount) ไว้ ไฟล์รายงานจะถูกซิงค์ออกมาที่เครื่องทันที

#### วิธีที่ 1: เปิดผ่านเครื่องเรา (แนะนำ)
```powershell
npx.cmd playwright show-report
```
*หรือดับเบิลคลิกไฟล์ `playwright-report/index.html` บนเว็บเบราว์เซอร์*

#### วิธีที่ 2: เปิด Report ผ่าน Web Server ใน Docker
```powershell
docker run --rm -it -p 9323:9323 `
  -v ${PWD}/playwright-report:/app/playwright-report `
  playwright-tests npx playwright show-report --host 0.0.0.0 --port 9323
```
จากนั้นเปิดเว็บเบราว์เซอร์ไปที่: `http://localhost:9323`

---

## ปัญหาที่พบบ่อย

### Error: No tests found

ข้อความ Error:

```text
Error: No tests found.
Make sure that arguments are regular expressions matching test files.
You may need to escape symbols like "$" or "*" and quote the arguments.
```

**สาเหตุและวิธีแก้ไข:**

1. **ใช้เครื่องหมาย Backslash (`\`) บน Windows (พบบ่อยที่สุด):**
   - ❌ `npx playwright test tests\post\create-post.spec.js` (บน Windows สัญลักษณ์ `\` จะถูกตีความเป็น Regex escape sequence เช่น `\p`, `\c` ทำให้ค้นหาไฟล์ไม่พบ)
   - ✅ ให้เปลี่ยนมาใช้ Slash (`/`) เสมอ:
     ```powershell
     npx.cmd playwright test tests/post/create-post.spec.js
     ```
     หรือรันผ่าน npm script ใน `package.json` (สะดวกและปลอดภัยที่สุด):
     ```powershell
     npm run test:post
     ```

2. **ต้องการรันเฉพาะชื่อ Test Case แต่ไม่ได้ใส่ flag `-g` (หรือ `--grep`):**
   - ❌ `npx.cmd playwright test "TC-POST01-038"` (หากไม่ใส่ `-g` Playwright จะเข้าใจว่าข้อความนั้นคือ **ชื่อไฟล์** ไม่ใช่ชื่อ Test Case จึงแจ้ง No tests found)
   - ✅ ต้องระบุ `-g` หรือ `--grep` นำหน้าเสมอ:
     ```powershell
     npx.cmd playwright test -g "TC-POST01-038"
     ```
     หรือระบุทั้งชื่อไฟล์และชื่อเคส:
     ```powershell
     npx.cmd playwright test tests/post/create-post.spec.js -g "TC-POST01-038"
     ```

3. **ระบุชื่อ Test Case หรือชื่อโฟลเดอร์ผิด:**
   - ในไฟล์ `tests/post/create-post.spec.js` มีทั้งหมด 38 เคส เคสสุดท้ายตั้งชื่อว่า `TC-POST01-038: เผยแพร่โพสต์สำเร็จเมื่อกรอกข้อมูลครบถ้วน` (หากเผลอระบุ `--grep "TC-POST01-039"` จะหาไม่พบ)
   - ตรวจสอบชื่อโฟลเดอร์: โฟลเดอร์ในโปรเจกต์นี้คือ `tests/post/` (ไม่มี `s` หลัง post)

4. **ชื่อ Test Case มีตัวอักษรพิเศษของ Regex:**
   - หากชื่อ Test มีสัญลักษณ์ เช่น `( )`, `[ ]`, `$`, `*`, `+`, `?` ให้ครอบด้วยเครื่องหมายคำพูด (Quote) หรือระบุเฉพาะคีย์เวิร์ดสั้นๆ เช่น `-g "TC-POST01-038"`

5. **แนะนำให้ใช้ Playwright UI Mode:**
   - สามารถคลิกเลือกรัน Test แต่ละข้อผ่านหน้าจอ UI ได้สะดวก ไม่ต้องพิมพ์คำสั่ง Regex เอง:
     ```powershell
     npm run test:ui
     ```

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
