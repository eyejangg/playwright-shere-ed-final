const fs = require('fs'); // File System ของ Node.js ใช้สำหรับอ่าน/เขียนไฟล์

const report = JSON.parse( // <<<< js object
    fs.readFileSync('test-results/results.json', 'utf8')
    // อ่านไฟล์ results.json 
    // และแปลงจากข้อความ JSON เป็น JavaScript Object เพื่อให้เรียกใช้ข้อมูลข้างในได้
);


const stats = report.stats;
// result.json / stats ดูได้เลยใน stats บรรทัดท้ายสุด
// เพื่อให้รู้ว่า มีจำนวน ผ่านเท่าไหร่ เฟลเท่าไหร่ หรือ ผลอื่นเท่าไหร่
// total = จำนวนที่เทสทั้งหมด
// passed = จำนวนที่เทสผ่าน
// failed = จำนวนที่เทสไม่ผ่าน
// skipped = จำนวนที่เทสข้าม
// flaky = จำนวนที่เทสกระพือ
// duration = ระยะเวลาที่ใช้ในการเทส


const failedTests = []; // เก็บ Test ที่ เฟล เลยต้องเปิด array ว่างไว้เก็บข้อมูลเทสที่มันเฟล

// ฟังก์ชันสำหรับค้นหา Test Case ที่รันแล้วมีสถานะ Failed
// รับ suites เข้ามา ซึ่งเป็นรายการกลุ่ม Test จาก Playwright JSON Report
// ใช้ Recursion เพื่อให้ฟังก์ชันสามารถค้นหา Test ที่ Failed ลงไปใน Suite
function collectFailedTests(suites) {
    // วนดู Suite ทีละตัว
    // Suite อาจเป็นไฟล์ Test หรือกลุ่มที่เกิดจาก test.describe()
    for (const suite of suites) {
        // แสดงชื่อ Suite ที่กำลังตรวจสอบ
        // ใช้สำหรับ Debug ว่าฟังก์ชันกำลังเดินผ่าน Suite ไหนอยู่
        console.log('Suite:', suite.title);

        // ==============================
        // 1. ตรวจ Test Case ใน Suite นี้
        // ==============================
        // เช็คก่อนว่า Suite นี้มี specs หรือไม่
        // specs คือรายการ Test Case เช่น test('TC-POST01-001...', ...)
        if (suite.specs) {
            // วน Test Case ทีละตัว
            for (const spec of suite.specs) {
                // spec คือ Test Case หนึ่งตัว
                // เช่น: TC-POST01-001: สมาชิกเข้าสู่หน้าสร้างโพสต์
                // ชื่อ Test Case สามารถอ่านได้จาก: spec.title

                // ==============================
                // 2. ตรวจการรันของ Test Case
                // ==============================
                // spec.tests เก็บข้อมูลการรันของ Test Case
                // เช่น การรันบน chromium, firefox หรือ webkit
                // ใช้ || [] เพื่อป้องกัน Error ถ้า spec.tests ไม่มีข้อมูลจะใช้ Array ว่างแทน
                for (const test of spec.tests || []) {

                    // ==============================
                    // 3. ตรวจผลการรันแต่ละรอบ
                    // ==============================
                    // test.results เก็บผลการ Execute Test
                    // อาจมีหลาย Result ได้ เช่นกรณีเปิด Retry
                    // รอบแรก  → failed
                    // Retry 1 → failed
                    // Retry 2 → passed
                    // ดังนั้นจึงต้องวน results ทุกตัว
                    for (const result of test.results || []) {

                        // ==============================
                        // 4. ตรวจว่า Test Failed หรือไม่
                        // ==============================
                        // result.status คือสถานะการ Execute จริง
                        // ตัวอย่าง: "passed", "failed", "skipped"
                        // ถ้า status เป็น failed แสดงว่าเจอ Test ที่ไม่ผ่าน
                        if (result.status === 'failed') {
                            // เก็บข้อมูล Test Case ที่ไม่ผ่านลงใน failedTests Array
                            failedTests.push({
                                title: spec.title,
                                file: spec.file,
                                line: result.error?.location?.line || null,
                                column: result.error?.location?.column || null,
                                error: result.error?.message || 'Unknown error',
                                duration: result.duration
                            });
                        }
                    }
                }
            }
        }

        // ==========================================
        // 5. ตรวจว่ามี Suite ลูกซ้อนอยู่หรือไม่
        // ==========================================
        // Playwright สามารถมี test.describe() ซ้อนกันได้
        // ตัวอย่าง: Suite A └── Suite B └── Suite C
        // เพราะฉะนั้นเราไม่รู้ล่วงหน้าว่าจะซ้อนกันกี่ชั้น
        if (suite.suites) {
            // เรียกฟังก์ชัน collectFailedTests() ตัวเดิมอีกครั้ง แต่ส่ง Suite ลูกเข้าไปตรวจ
            // วิธีที่ฟังก์ชันเรียกตัวเองแบบนี้เรียกว่า Recursion
            collectFailedTests(suite.suites);
        }
    }
}

// ==========================================
// จุดเริ่มต้นของการค้นหา
// ==========================================
// report คือข้อมูลทั้งหมดที่อ่านมาจาก results.json
// report.suites คือ Suites ชั้นนอกสุด
// เราจึงส่ง report.suites เข้าไปให้ฟังก์ชันเพื่อเริ่มค้นหา Test ที่ Failed ตั้งแต่ชั้นแรก
collectFailedTests(report.suites);
// แสดงข้อมูล Test ที่ Failed ที่เก็บไว้ใน Array
console.log('Failed Tests:', failedTests);




// เปลี่ยน json ใหญ่ๆให้เป็น การสร้าง summary เล็กๆออกมา
const summary = {
    total: stats.expected + stats.unexpected + stats.skipped + stats.flaky,
    passed: stats.expected,
    failed: stats.unexpected,
    skipped: stats.skipped,
    flaky: stats.flaky,
    duration: Math.round(stats.duration),
    failedTests: failedTests, // เพิ่มข้อมูล Test ที่ Failed
};

console.log(summary);

const webhookUrl = 'https://unpremonished-lizzette-semiproductive.ngrok-free.dev/webhook/playwright-results';


// ยิง webhook ส่งข้อมูลไปยัง n8n 
fetch(webhookUrl, {
    method: 'POST', // post ใน ทิคเก้ตแรก
    headers: {
        'Content-Type': 'application/json', // กำหนดว่าข้อมูลที่ส่งเป็น json
    },
    body: JSON.stringify(summary), // แปลง js object เป็น json string
})
    .then(response => response.text()) // รับค่าจากทิคเก้ต 2
    .then(data => {
        console.log('Sent to n8n successfully'); // แสดงว่าส่งสำเร็จ
        console.log(data);
    })
    .catch(error => {
        console.error('Failed to send to n8n:', error); // แสดงว่าส่งไม่สำเร็จ
    });