# SHARE-ED — ชุดทดสอบสร้างโพสต์

branch `robot-freamwork-create-post-convert` มีชุด Robot Framework ที่แปลงจาก
Playwright ครบ TC-POST01-001–039 โดยเก็บชุด Playwright เดิมไว้ใช้เทียบ

## โครงสร้าง

```text
playwright-shere-ed-final/
├── robot/                   # ชุด Robot Framework
│   ├── tests/               # 39 test cases
│   ├── resources/           # keywords, selectors และตัวแปรร่วม
│   ├── config/              # ไฟล์บัญชีในเครื่องและตัวอ่านค่า
│   ├── checks/              # ตรวจ Browser Library บน localhost
│   ├── requirements.txt     # Python dependencies
│   └── README.md            # คู่มือติดตั้งและรัน Robot
├── playwright/              # ชุด Playwright เดิม
│   ├── tests/               # 39 test cases
│   ├── global-setup.js      # เตรียม session ล็อกอิน
│   ├── playwright.config.js # ตั้งค่าการทดสอบ
│   └── README.md            # คู่มือ Playwright
├── test-data/               # รูปและ PDF ใช้ร่วมกัน
├── artifacts/               # ผลทดสอบทั้งสองชุด (ไม่เข้า Git)
│   ├── robot/
│   └── playwright/
└── package.json             # คำสั่ง npm และ Node dependencies
```

รันคำสั่งจาก `D:\playwright-shere-ed-final` ดูรายละเอียดบัญชีและการติดตั้งใน
[คู่มือ Robot](robot/README.md) หรือ [คู่มือ Playwright](playwright/README.md)

## Robot Framework

ตั้งค่าบัญชีใน `robot/config/account.local.json` ครั้งเดียว แล้วเปิด CMD เพื่อรัน:

```cmd
cd /d D:\playwright-shere-ed-final
set "ROBOT_PYTHON=D:\playwright-shareed-robot\.venv-robot-313\Scripts\python.exe"
"%ROBOT_PYTHON%" -m robot --outputdir artifacts/robot/results robot/tests
```

ดูคำสั่งติดตั้ง dry run และเลือกเคสใน [คู่มือ Robot สำหรับ CMD](robot/README.md)
ใช้ `npm run test:robot` หรือ `npm run test:robot -- --variable HEADLESS:False`
ได้โดยตัวรันเลือก Python environment ให้อัตโนมัติ
รายงานอยู่ใน `artifacts/robot/results/report.html` และ `log.html`

## Playwright

```cmd
cd /d D:\playwright-shere-ed-final
npm ci
npx playwright install chromium
set "DELETE_TEST_POST=1"
npm test
```

ดูการตั้งค่าบัญชีและคำสั่งเปิด browser ใน [คู่มือ Playwright สำหรับ CMD](playwright/README.md)
รันทุกเคสบน Firefox ด้วย `npm run test:firefox -- --headed`
หรือรันสาม engines ด้วย `npm run test:all-browsers` รวม 117 เคส
Robot เลือก Firefox ด้วย `--variable BROWSER:firefox` ดูคำสั่งเต็มในคู่มือ Robot
รายงานอยู่ใน `artifacts/playwright/report/index.html`
ไฟล์ผลทดสอบอยู่ใน `artifacts/playwright/test-results/`

ทั้งสองชุดรันทีละเคส เคส 038 สร้างโพสต์จริง และเคส 039 ลบเฉพาะโพสต์ที่สร้าง
ในรอบเดียวกัน ให้รัน 038 และ 039 พร้อมกันหากต้องการลบหลังทดสอบ
