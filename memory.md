

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
