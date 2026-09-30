// อธิบายตอนพรีเซนต์: ไฟล์นี้เป็น Reporter เพิ่มเติมสำหรับเก็บรายละเอียดขั้นตอน
// Playwright เรียกไฟล์นี้อัตโนมัติผ่าน reporter ใน playwright.config.js
// ผลลัพธ์คือ test-results/steps.json เพื่อให้ n8n และ AI ทราบว่าล้มเหลวตรงขั้นตอนใด
// ไฟล์นี้เก็บรายงานเท่านั้น ไม่ได้สั่งรัน Test และไม่ได้ส่งข้อมูลเข้า n8n
const fs = require('node:fs');
const path = require('node:path');

// เดินผ่านทุกประเภทขั้นตอน แต่เก็บเฉพาะชื่อที่เราเขียนด้วย test.step().
// ทำให้เห็น step ที่อยู่ใต้ beforeEach และ fixture cleanup ด้วย.
function collectSteps(steps, parentPath = []) {
  // ขั้นตอนมีโครงสร้างซ้อนกัน: ตรวจทั้งขั้นตอนหลัก ขั้นตอนย่อย และ hook
  // เลือกเก็บเฉพาะ test.step ที่ผู้เขียนตั้งชื่อ เพื่อให้อ่านเป็นขั้นตอนทางธุรกิจได้
  return (steps || []).flatMap(step => {
    const named = step.category === 'test.step';
    const stepPath = named ? [...parentPath, step.title] : parentPath;
    // path เก็บลำดับชื่อขั้นตอนจากชั้นนอกถึงชั้นใน ช่วยแยกชื่อที่ซ้ำกันได้
    // status อิง error ของขั้นตอนนั้น และ location เก็บตำแหน่งโค้ดถ้ามี
    const current = named ? [{
      title: step.title,
      path: stepPath,
      status: step.error ? 'failed' : 'passed',
      duration: step.duration,
      error: step.error?.message || null,
      location: step.location || null,
    }] : [];
    // เรียกตัวเองเพื่อเก็บขั้นตอนลูก แม้ขั้นตอนแม่จะเป็น hook ที่ไม่ต้องบันทึกชื่อ
    return [...current, ...collectSteps(step.steps, stepPath)];
  });
}

class StepReporter {
  onBegin(config) {
    // เริ่มรอบทดสอบ: กำหนดไฟล์ปลายทางและเริ่มรายการ attempts ของรอบนี้
    this.outputFile = path.resolve(config.rootDir, '../test-results/steps.json');
    this.attempts = [];
  }
  onTestEnd(test, result) {
    // จบแต่ละเคส/แต่ละ retry: เก็บผลและขั้นตอน พร้อมตัวระบุสำหรับจับคู่ results.json
    // testId + retry + startTime ช่วยแยกการลองซ้ำและข้อมูลคนละรอบ
    this.attempts.push({
      testId: test.id,
      retry: result.retry,
      startTime: result.startTime.toISOString(),
      status: result.status,
      steps: collectSteps(result.steps),
    });
  }
  onEnd() {
    // จบทั้งรอบ: สร้างโฟลเดอร์หากยังไม่มี แล้วบันทึกข้อมูลเป็น JSON อ่านง่าย
    fs.mkdirSync(path.dirname(this.outputFile), { recursive: true });
    fs.writeFileSync(this.outputFile, JSON.stringify({ attempts: this.attempts }, null, 2));
  }
}
// export class ให้ Playwright โหลด และ export ฟังก์ชันเพื่อเรียกตรวจแยกได้
module.exports = StepReporter;
module.exports.collectSteps = collectSteps;
