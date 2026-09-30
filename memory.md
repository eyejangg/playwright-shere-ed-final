

---

## คำสั่ง Command Prompt

เข้าโฟลเดอร์แล้วรันทดสอบ:

```cmd
cd /d D:\playwright-shere-ed-final
npx.cmd playwright test tests/post/create-post.spec.js --project=chromium
```

ตรวจรายงานก่อนส่ง:

```cmd
node scripts/send-test-results.js --dry-run
```

ถ้ามี URL เก่าค้างอยู่ ให้ล้างก่อนส่ง:

```cmd
set N8N_WEBHOOK_URL=
```

เมื่อผลตรงกับรอบที่ต้องการแล้ว ส่งเข้า n8n:

```cmd
node scripts/send-test-results.js
```

สคริปต์จะใช้ Production URL ที่ตั้งไว้ในไฟล์ scripts/send-test-results.js

## กรณี 1: ผ่านทั้งหมด

เปิด tests/post/create-post.spec.js แล้วปิดบล็อกท้ายเคส 012 และ 018
ด้วย // ทุกบรรทัด ตั้งแต่ await test.step จนถึง }); ของบล็อกนั้น
ตอนนี้สองบล็อกปิดด้วย // อยู่แล้ว
เก็บขั้นตอนทดสอบเดิมด้านบนไว้ แล้วบันทึกไฟล์

รันคำสั่งด้านบน ผลที่คาดหวัง: 5 passed / 0 failed
รัน --dry-run เพื่อตรวจรายงาน จากนั้นล้าง URL ค้างและส่งเข้า n8n
ตรวจ n8n Executions, Google Sheets และอีเมลแจ้งผ่านทั้งหมด

## กรณี 2: ผ่าน 3 / เฟล 2

เปิดไฟล์เดิม ค้นหา Fail Case แล้วเอา // ออกจากทุกบรรทัด
เฉพาะสองบล็อกท้ายเคส 012 และ 018 ตั้งแต่ await test.step จนถึง });
ไม่ต้องเปิดบรรทัดคำอธิบายหรือบรรทัด // ---------- Fail Case ----------
หากใช้ /* ... */ ครอบอยู่แทน ให้เอาเฉพาะ /* และ */ ของบล็อกนั้นออก
บันทึกไฟล์ แล้วรันทดสอบใหม่ด้วยคำสั่งเดิม

ผลที่คาดหวัง: ผ่าน 001, 003, 038 และเฟล 012, 018
- 012: Expected ชื่อทบทวนแคลคูลัส แต่ Received เป็นค่าว่าง
- 018: Expected ข้อความไม่เกิน 5 MB แต่ Received เป็นไม่เกิน 2 MB

สองจุดนี้เฟลจาก expected ที่ตั้งใจให้ไม่ตรง เป็น Test Script Failure
หลังเห็น 3 passed / 2 failed ให้รัน --dry-run ตรวจรายงานแล้วส่งเข้า n8n
ตรวจว่าอีเมลและ Sheets มีสองเคสที่เฟล ขั้นตอนและ error ตรงกับรอบล่าสุด
หากเฟลที่ขั้นตอนอื่นหรือจำนวนไม่ตรง ให้ตรวจ error ก่อนส่ง
หลังพรีเซนต์ใส่ // กลับทั้งสองบล็อกเพื่อคืนรอบปกติ

## ตรวจรายงานแบบสั้น

หลังรัน --dry-run ใช้คำสั่งนี้ดูจำนวนและเคสที่เฟล:

```cmd
node -e "const r=require('./test-results/summary.json'); console.log({total:r.total,passed:r.passed,failed:r.failed}); console.log(r.failedTests.map(t=>({title:t.title,step:t.failed_step})))"
```

## ถ้าเกิด error ให้แก้ตามนี้

| Error / อาการ | วิธีตรวจและแก้ |
| --- | --- |
| HTTP 404: webhook not registered | ใช้ Production URL /webhook/ ให้ตรง Webhook node เปิดใช้งาน/Publish Workflow และล้างค่าเก่าด้วย set N8N_WEBHOOK_URL= ก่อนส่งใหม่ |
| URL เป็น /webhook-test/ | เปลี่ยนเป็น Production URL; หากตั้งใจใช้ Test URL ต้องกด Execute workflow รอรับข้อมูลก่อน และรับได้ครั้งเดียวต่อการกด |
| fetch failed / timeout / ngrok เข้าไม่ได้ | ตรวจอินเทอร์เน็ตและเปิด URL n8n ตรวจว่า ngrok ยังทำงานและ URL ไม่เปลี่ยน ถ้าเปลี่ยนให้แก้ในสคริปต์ ก่อนส่งซ้ำตรวจ Executions ว่ารอบก่อนเข้าแล้วหรือยัง |
| HTTP 401 / 403 | ตรวจ authentication ของ Webhook และข้อมูลยืนยันตัวตนที่สคริปต์ส่ง |
| HTTP 500 หรือส่งสำเร็จแต่ไม่มีอีเมล | เปิด n8n Executions ดู node ที่ล้มเหลวและ error ตรวจ credentials ของ Google Sheets, Gemini, Gmail และการต่อเส้นทาง |
| ENOENT: results.json หรือ summary.json ไม่มี | เข้าโฟลเดอร์โปรเจกต์ให้ถูก รัน Playwright ให้จบ แล้วรัน --dry-run ก่อนส่ง |
| SyntaxError หลังเปิด–ปิดคอมเมนต์ | ตรวจ // หรือ /* */ และปีกกาให้ครบ จากนั้นใช้ node --check ตามคำสั่งด้านล่าง |
| npx.ps1 ถูกบล็อก | ใช้ Command Prompt และ npx.cmd ตามคู่มือ |
| Login / selector / upload timeout | ดูขั้นตอนที่เฟลในรายงาน ตรวจเว็บ บัญชีและไฟล์แนบ อย่าเปลี่ยน expected เพียงเพื่อให้ผ่าน |
| 2 failed จากสองบล็อกท้าย | เป็นผลที่คาดหวังในกรณี 2; รอทดสอบจบแล้วรัน --dry-run ต่อได้ แม้ Playwright จบด้วย exit code ที่ไม่เป็นศูนย์ |
| ประวัติหรืออีเมลซ้ำ | ตรวจว่าเผลอส่งผลเดิมซ้ำหรือไม่ คำสั่งส่งไม่ได้รันทดสอบใหม่ |
| Recurring ไม่ทำงาน | เกณฑ์ fail_count >= 2 ต้องมีประวัติ Failed สะสมอย่างน้อยสองแถวต่อกลุ่มเคส หากมีแค่หนึ่งรอบให้รันทดสอบใหม่แล้วส่งผลรอบใหม่ |

ตรวจ syntax (ไม่มีข้อความออกมาแปลว่าผ่าน):

```cmd
node --check tests/post/create-post.spec.js
```

เปิดรายงานดู error และขั้นตอน:

```cmd
npx.cmd playwright show-report
```

จำลำดับ: ตั้งคอมเมนต์ → บันทึก → รันเทสใหม่ → --dry-run → ตรวจผล → ส่ง n8n
Production Workflow ต้องเปิดใช้งาน ไม่ต้องกด Execute workflow ทุกครั้ง

## อธิบาย Flow ว่าอะไรเชื่อมอะไร

### สรุปจุดอ่านข้อมูลพร้อมตัวอย่างโค้ด

อยู่ใน scripts/send-test-results.js ฟังก์ชัน main()
อ่านรายงานสองไฟล์ ไม่ได้อ่านข้อมูลจากเว็บโดยตรง:

```js
// อ่านผลรายเคส: ชื่อเคส สถานะ Error เวลา และ retry
const report = JSON.parse(
  fs.readFileSync(path.join(repo, 'test-results/results.json'), 'utf8')
);

// อ่านรายละเอียดขั้นตอน ถ้ามีไฟล์นี้
const stepPath = path.join(repo, 'test-results/steps.json');
const stepReport = fs.existsSync(stepPath)
  ? JSON.parse(fs.readFileSync(stepPath, 'utf8'))
  : undefined;

// รวมข้อมูลจากสองไฟล์เป็นรายงานสำหรับ n8n
const summary = buildSummary(report, stepReport);
```

ใน buildSummary() เลือกข้อมูลหลัก ตัวอย่างย่อจากโค้ดจริง:

```js
// ผลรวมทั้งรอบ
passed: stats.expected,
failed: stats.unexpected,

// รายละเอียดเคสและข้อผิดพลาด
title: spec.title,
file: spec.file,
status: result.status,
error: errors[0] || null,

// รายละเอียดขั้นตอน
steps,
failed_step: deepest?.title || null,
failed_step_path: deepest?.path || null,
failed_steps: failedSteps,
```

ตัวอย่างด้านบนแสดง field จากหลาย Object เพื่ออธิบาย ไม่ใช่โค้ดสำหรับรันเดี่ยว
ข้อมูลเพิ่มเติมที่เก็บ: total, skipped, flaky, duration, project, errors,
line/column ถ้ามี, failure_type, attempts และ runErrors

หลังรวมข้อมูลแล้ว main() บันทึกและส่ง:

```js
// เก็บสำเนารายงานในเครื่อง
fs.writeFileSync(
  path.join(repo, 'test-results/summary.json'),
  JSON.stringify(summary, null, 2)
);

// ส่ง JSON เข้า Webhook ของ n8n
const response = await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(summary),
  signal: AbortSignal.timeout(30_000),
});
```

พูดสั้น ๆ: “เราอ่านผลรายเคสจาก results.json และรายละเอียดขั้นตอนจาก steps.json
แล้วรวมชื่อเคส ไฟล์ ผลผ่าน–เฟล Error และขั้นตอนที่ล้มเหลว ส่งเป็น JSON ให้ n8n ครับ”
รูป วิดีโอ และ Trace เก็บไว้ในเครื่อง ไม่ได้แนบไปใน HTTP POST นี้

### ภาพรวมตั้งแต่เริ่มจนเข้า n8n

```text
ผู้ใช้สั่งรัน Playwright ใน Command Prompt
  ↓
playwright.config.js ตั้งค่า Browser, Login และ Reporter
  ↓
global-setup.js ล็อกอินและบันทึก session
  ↓
create-post.spec.js ทดสอบ 5 เคส
  ├─ test-data.js เตรียม path รูป/PDF และชื่อโพสต์
  └─ post-helpers.js ช่วยกรอก/เผยแพร่โพสต์ และ Cleanup หลังเคสจบ
  ↓
Reporter เก็บผลระหว่างการรันและเขียนรายงานเมื่อรันจบ
  ├─ JSON Reporter → test-results/results.json
  └─ StepReporter → test-results/steps.json
  ↓
ผู้ใช้สั่ง node scripts/send-test-results.js
  ↓
อ่าน results.json + steps.json → buildSummary()
  ↓
เขียน test-results/summary.json
  ↓
fetch() ส่ง HTTP POST พร้อม JSON ไปยัง Production Webhook URL
  ↓
ngrok ส่งคำขอไปยัง n8n → Receive Playwright Results
  ↓
Check Test Result แยกเส้นทางผ่านทั้งหมด / มีเคสเฟล
```

### 1. เริ่มจากคำสั่งรันทดสอบ

```cmd
cd /d D:\playwright-shere-ed-final
npx.cmd playwright test tests/post/create-post.spec.js --project=chromium
```

คำสั่งนี้ให้ Playwright โหลด config และเลือกทดสอบไฟล์ที่ระบุด้วย Chromium
global-setup.js ล็อกอินก่อนเริ่มเคส และบันทึกสถานะไว้ใน playwright/.auth/member.json
เคสสร้างโพสต์ใช้สถานะนี้ ส่วนเคส 001 ตั้ง session ว่างเพื่อทดสอบ Login ตั้งแต่ต้น
test.step ตั้งชื่อขั้นตอน และ expect ตรวจผลที่แสดงบนเว็บ
post-helpers.js ทำงานช่วยสร้างโพสต์และพยายาม Cleanup โพสต์ที่เคสนั้นติดตามไว้

### 2. ทำไมมี results.json และ steps.json

playwright.config.js ลงทะเบียน Reporter ไว้ จึงทำงานอัตโนมัติในการรันทดสอบ
results.json เก็บผลรายเคส จำนวนผ่าน/เฟล Error และ attempts
steps.json เก็บรายละเอียด test.step รวมขั้นตอนใน hook และ Cleanup
StepReporter จดผลตอน onTestEnd และเขียนไฟล์ตอน onEnd
สองไฟล์นี้คือจุดเชื่อมแบบไฟล์ระหว่าง Playwright กับสคริปต์ส่งผล
ไม่ต้องให้ Test Case เรียก send-test-results.js โดยตรง

### 3. send-test-results.js เริ่มทำงานตอนไหน

สั่งแยกหลังรันทดสอบจบ:

```cmd
node scripts/send-test-results.js --dry-run
```

Node.js เปิดไฟล์ scripts/send-test-results.js
เงื่อนไข require.main === module ที่ท้ายไฟล์ตรวจว่ากำลังรันไฟล์นี้โดยตรง
ถ้าใช่จะเรียก main() แล้วอ่านรายงานจากโฟลเดอร์ test-results ของโปรเจกต์
buildSummary() จับคู่ขั้นตอนด้วย testId + retry + startTime เพื่อหลีกเลี่ยงข้อมูลคนละรอบ
จากนั้นรวมจำนวนผล รายการ tests, failedTests และขั้นตอนที่เฟล ลง summary.json
--dry-run หยุดก่อน fetch() จึงตรวจข้อมูลได้โดยยังไม่ส่ง n8n

สำคัญ: คำสั่ง Playwright ปัจจุบันไม่ได้เรียกสคริปต์ส่งผลให้อัตโนมัติ
ต้องสั่ง node scripts/send-test-results.js เองหลังรันเสร็จ
สคริปต์อ่าน results.json และ steps.json แล้วสร้าง summary ใหม่ทุกครั้ง
ไม่ได้อ่าน summary.json เพื่อส่งซ้ำโดยตรง และไม่ได้เริ่มทดสอบเว็บใหม่

### 4. ทำไมส่งไป n8n ได้

```cmd
set N8N_WEBHOOK_URL=
node scripts/send-test-results.js
```

main() เลือก URL จาก process.env.N8N_WEBHOOK_URL ก่อน
ถ้าไม่มีค่านั้นจะใช้ Production URL ที่เขียนไว้ในสคริปต์
set N8N_WEBHOOK_URL= ล้างค่าเก่าที่ค้างในหน้าต่าง cmd

fetch(webhookUrl, ...) เป็นตัวส่งข้อมูลผ่านเครือข่าย โดยกำหนด:
- method: POST ส่งข้อมูลเข้า Webhook
- Content-Type: application/json แจ้งว่าเนื้อหาเป็น JSON
- body: JSON.stringify(summary) แปลง Object เป็นข้อความ JSON สำหรับส่ง
- timeout: 30 วินาที จำกัดเวลารอคำตอบ

Webhook node ของ n8n ต้องเปิดรับ POST ที่ path playwright-results
Production URL ต้องตรงกับ URL ปัจจุบัน และ Workflow ต้องเปิดใช้งาน
ngrok ทำหน้าที่เปิดทางให้ URL ภายนอกส่งคำขอถึง n8n ที่รันอยู่
ข้อมูล JSON ที่รับจะอยู่ใน body ของ Webhook output จากนั้น node เตรียมข้อมูลจึงนำไปใช้

HTTP สำเร็จจะแสดง Sent to n8n successfully
แต่ยังต้องเปิด n8n Executions ตรวจว่า node ภายในทำงานสำเร็จจนถึง Sheets/Gmail
การตอบรับ HTTP ไม่ได้ยืนยันว่าอีเมลส่งสำเร็จทุกฉบับ

### 5. n8n เชื่อมต่ออย่างไรเมื่อผ่านทั้งหมด

```text
Receive Playwright Results (Webhook)
  → Check Test Result (IF ไม่มีเคสเฟล)
  → Prepare Passed Result (Edit Fields)
  → Log Passed Run (Google Sheets)
  → All Automated Tests Passed (Gmail)
```

เส้นทางนี้จัดเก็บผลรวมและส่งอีเมลแจ้งผ่าน โดยไม่ต้องส่งเคสผ่านให้ AI วิเคราะห์ Failure

### 6. n8n เชื่อมต่ออย่างไรเมื่อมีเคสเฟล

```text
Receive Playwright Results
  → Check Test Result (IF มีเคสเฟล)
  → Prepare Failed Result
      ├─ Log Failed Run to Test Runs (บันทึกประวัติรอบ)
      └─ Clean Failure Errors
          → Split Failed Tests (แยก failedTests ทีละเคส)
          → AI Failure Analysis
              ├─ Google Gemini Chat Model เป็นโมเดล
              └─ GitHub MCP เป็นเครื่องมืออ่านโค้ด
          → Prepare AI Classification
          → Google Sheets บันทึกผลวิเคราะห์
          → Build Failure Email
              ├─ Switch → Gmail ตาม Severity ที่ตั้งไว้
              └─ Execute Sub-workflow → วิเคราะห์ประวัติเฟลซ้ำ
```

AI ใช้ชื่อเคส ไฟล์ Error และ failed_step เป็นหลักฐาน พร้อมอ่าน GitHub เมื่อเข้าถึงได้
ผล AI เป็นข้อสันนิษฐานและคำแนะนำ ไม่ใช่การยืนยัน root cause
Severity ใช้แยกเส้นทางอีเมลตามกฎ Switch ปัจจุบันใน n8n

### 7. Workflow เฟลซ้ำเชื่อมต่ออย่างไร

```text
When Executed by Another Workflow
  → Read Failed Test Analysis (Google Sheets)
  → Aggregate & Count Failures (Code จัดกลุ่มและนับประวัติ)
  → Check fail count (IF fail_count >= 2)
      ├─ ไม่ถึงเกณฑ์ → จบเส้นทางนี้
      └─ ถึงเกณฑ์ → Gemini Health Agent
          → Prepare Developer Recommendation
          → Loop Over Items (ส่งทีละเคสจากช่อง loop)
          → Find Existing Health Report
          → IF ตรวจ row_number
              ├─ มีแถว → Update Row
              └─ ไม่มีแถว → Append Row
          → Gmail
          → กลับเข้า Loop Over Items เพื่อประมวลผลเคสถัดไป
          → เมื่อครบทั้งหมดออกทาง done
```

fail_count นับแถว Failed สะสมในประวัติ ไม่ได้หมายความว่าเฟลติดต่อกัน
Google Sheets เป็นจุดเชื่อมข้อมูลจาก Workflow วิเคราะห์แต่ละเคสไปยัง Workflow เฟลซ้ำ

### บทพูดสั้นสำหรับพรีเซนต์

“ผมเริ่มจากรัน Playwright เพื่อทดสอบเว็บครับ Reporter จะบันทึกผลรายเคส
และขั้นตอนลงไฟล์ JSON หลังทดสอบจบ ผมรัน send-test-results.js เพื่อรวมข้อมูล
และส่งผ่าน HTTP POST ไปยัง Webhook ของ n8n โดยใช้ ngrok เชื่อมจากภายนอก
n8n ตรวจว่ามีเคสเฟลหรือไม่ ถ้าผ่านทั้งหมดจะบันทึกและส่งอีเมล
ถ้ามีเคสเฟลจะใช้ AI วิเคราะห์ พร้อมอ่านโค้ดจาก GitHub เมื่อเข้าถึงได้
แล้วบันทึกและแจ้งเตือน นอกจากนี้ยังมี Workflow ย่อยที่อ่านประวัติจาก Sheets
เพื่อวิเคราะห์เคสที่เฟลซ้ำตั้งแต่สองครั้งขึ้นไปครับ”
