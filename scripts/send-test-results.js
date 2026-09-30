// อธิบายตอนพรีเซนต์: ไฟล์นี้เชื่อมผล Playwright กับ Webhook ของ n8n
// อ่าน results.json และ steps.json → สร้าง summary.json → ส่ง HTTP POST
// ต้องรันหลัง Playwright จบ; รันไฟล์นี้อย่างเดียวจะส่งผลที่มีอยู่ ไม่ได้ทดสอบเว็บใหม่
// คำสั่งตรวจข้อมูล: node scripts/send-test-results.js --dry-run
// คำสั่งส่งข้อมูล: node scripts/send-test-results.js
const fs = require('node:fs');
const path = require('node:path');

// นับทั้ง assertion ไม่ผ่าน หมดเวลา และการถูกหยุด เป็นสถานะล้มเหลวที่ต้องส่งรายละเอียด
const failedStatuses = new Set(['failed', 'timedOut', 'interrupted']);

// รองรับ JSON report เดิม หากไม่มี sidecar จาก step-reporter.
function flattenSteps(steps, parentPath = []) {
  // แปลงขั้นตอนที่ซ้อนกันให้เป็นรายการเดียว สำหรับใช้เมื่อไม่มี steps.json ที่จับคู่ได้
  // หาก report เดิมไม่มี steps จะได้รายการว่าง จึงไม่สามารถอ้างว่าขั้นตอนใดผ่านได้
  return (steps || []).flatMap(step => {
    const stepPath = [...parentPath, step.title];
    return [{ title: step.title, path: stepPath,
      status: step.error ? 'failed' : 'passed', duration: step.duration,
      error: step.error?.message || null, location: null },
      ...flattenSteps(step.steps, stepPath)];
  });
}

// โฟลอ่านข้อมูล 
function buildSummary(report, stepReport = { attempts: [] }) {
  // แปลงรายงานดิบเป็นข้อมูลที่ Workflow ใช้ โดยคงผลทุก attempt ไว้ตรวจย้อนหลัง
  const tests = [];
  function visit(suites) {
    // suites อาจซ้อนหลายชั้น จึงเดินอ่านทุก suite → spec → project → attempt
    for (const suite of suites || []) {
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          const attempts = (test.results || []).map(result => {
            // startTime ป้องกันอ่าน steps.json เก่าที่มาจากการรันคนละรอบ.
            const recorded = (stepReport.attempts || []).find(attempt =>
              attempt.testId === spec.id && attempt.retry === result.retry &&
              attempt.startTime === result.startTime);
            // ใช้ชื่อขั้นตอนจาก custom Reporter ก่อน; ถ้าไม่พบจึงใช้ report เดิมเป็น fallback
            const steps = recorded?.steps || flattenSteps(result.steps);
            const failedSteps = steps.filter(step => step.status === 'failed');
            // parent และ child อาจมี error เดียวกัน เลือกขั้นตอนย่อยที่ลึกที่สุด.
            const deepest = failedSteps.reduce((best, step) =>
              !best || step.path.length > best.path.length ? step : best, null);
            // เก็บ error ทั้งหมด รวม error เพิ่มเติม เช่น Cleanup ไม่สำเร็จ
            // error ใช้ข้อความแรกเพื่อแสดงแบบสั้น ส่วน errors เก็บรายการครบ
            const errors = (result.errors?.length ? result.errors : result.error ? [result.error] : [])
              .map(error => error.message || error.value || 'Unknown error');
            const isFailed = failedStatuses.has(result.status);
            // test หมายถึงความล้มเหลวในการรันทดสอบ ไม่ได้ยืนยันว่าเป็นบั๊กเว็บไซต์
            // category และสาเหตุจะถูกประเมินต่อโดย AI ใน n8n
            const failureType = !isFailed ? null : 'test';
            return {
              retry: result.retry || 0, status: result.status, duration: result.duration,
              error: errors[0] || null, errors,
              line: result.error?.location?.line || result.errorLocation?.line || null,
              column: result.error?.location?.column || result.errorLocation?.column || null,
              // ส่งชื่อ step, เส้นทางของ step และทุก step ที่เฟล ให้ AI มีหลักฐานประกอบ
              // ถ้าไม่มีข้อมูลให้เป็น null แทนการแต่งชื่อขั้นตอนขึ้นมา
              steps, failed_step: deepest?.title || null,
              failed_step_path: deepest?.path || null,
              failed_steps: failedSteps, failure_type: failureType,
            };
          });
          // สรุปผลรอบสุดท้าย ป้องกัน retry ที่ผ่านแล้วถูกนับเป็น Failed ซ้ำ.
          // outcome คือผลสรุปของ Playwright ส่วน status คือสถานะ attempt ล่าสุด
          const last = attempts.at(-1);
          tests.push({ title: spec.title, file: spec.file,
            project: test.projectName, outcome: test.status,
            ...(last || { status: 'notRun', steps: [], failed_step: null, failure_type: null }),
            attempts });
        }
      }
      // เดินอ่าน suite ลูกต่อจนหมด
      visit(suite.suites);
    }
  }
  visit(report.suites);
  // ตัวเลขสรุปใช้ stats ของ Playwright: expected, unexpected, skipped และ flaky
  // flaky แยกไว้ต่างหาก; ไม่ได้รวมเป็น passed ในฟิลด์ passed นี้
  const stats = report.stats;
  return {
    total: stats.expected + stats.unexpected + stats.skipped + stats.flaky,
    passed: stats.expected, failed: stats.unexpected,
    skipped: stats.skipped, flaky: stats.flaky, duration: Math.round(stats.duration),
    // tests ส่งรายละเอียดครบทุกเคส; failedTests คัดเฉพาะสถานะ attempt ล่าสุดที่ล้มเหลว
    tests,
    failedTests: tests.filter(test => failedStatuses.has(test.status)),
    // runErrors คือปัญหาระดับการรันที่อาจไม่ผูกกับ Test Case เช่น global setup
    runErrors: report.errors || [],
  };
}
    
async function main() {
  // หา root จากตำแหน่งสคริปต์ เพื่ออ่านรายงานจากโปรเจกต์นี้เสมอ
  const repo = path.resolve(__dirname, '..');
  const report = JSON.parse(fs.readFileSync(path.join(repo, 'test-results/results.json'), 'utf8'));
  const stepPath = path.join(repo, 'test-results/steps.json');
  const stepReport = fs.existsSync(stepPath) ? JSON.parse(fs.readFileSync(stepPath, 'utf8')) : undefined;
  // steps.json เป็นข้อมูลเสริม: ไม่มีไฟล์นี้ยังสรุปผลจาก results.json ได้
  const summary = buildSummary(report, stepReport);
  fs.writeFileSync(path.join(repo, 'test-results/summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  // เรียนรู้และตรวจ payload ได้โดยไม่ส่ง webhook.
  // --dry-run ยังสร้าง summary.json แต่หยุดก่อน POST จึงใช้ตรวจ payload ก่อนส่งได้
  if (process.argv.includes('--dry-run')) return;
  // URL ใน environment มีลำดับก่อน URL ด้านล่าง
  // ใน cmd ใช้ set N8N_WEBHOOK_URL= เพื่อล้างค่าเก่า แล้วใช้ URL ในโค้ด
  // Production URL /webhook/ ต้องตรงกับ Webhook node และ Workflow ต้องเปิดใช้งาน
  const webhookUrl = process.env.N8N_WEBHOOK_URL ||
    'https://unpremonished-lizzette-semiproductive.ngrok-free.dev/webhook/playwright-results';
  // POST ส่ง JSON ทั้งก้อนเข้า n8n; จำกัดเวลารอ 30 วินาทีเพื่อไม่ค้างไม่มีกำหนด
  const response = await fetch(webhookUrl, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(summary), signal: AbortSignal.timeout(30_000),
  });
  // ถ้า HTTP ไม่ใช่ 2xx ให้แสดง status และข้อความตอบกลับเพื่อใช้ตรวจปัญหา Webhook
  // HTTP สำเร็จยืนยันเพียงว่าปลายทางตอบรับ; ต้องดู n8n Executions ว่า node ภายในสำเร็จด้วย
  if (!response.ok) throw new Error(`n8n returned HTTP ${response.status}: ${await response.text()}`);
  console.log('Sent to n8n successfully:', await response.text());
}

// import ฟังก์ชันไปตรวจได้โดยไม่ส่งข้อมูลออกไป.
module.exports = { buildSummary, flattenSteps };
// เริ่ม main เฉพาะเมื่อรันไฟล์นี้โดยตรง; require เพื่อทดสอบฟังก์ชันจะไม่ส่ง Webhook
// หากอ่าน JSON, เครือข่าย หรือ HTTP ผิดพลาด จะแสดงข้อความและ exit code 1
if (require.main === module) main().catch(error => {
  console.error('Failed to send to n8n:', error.message);
  process.exitCode = 1;
});
