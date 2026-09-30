const fs = require('node:fs');
const path = require('node:path');

const failedStatuses = new Set(['failed', 'timedOut', 'interrupted']);

// รองรับ JSON report เดิม หากไม่มี sidecar จาก step-reporter.
function flattenSteps(steps, parentPath = []) {
  return (steps || []).flatMap(step => {
    const stepPath = [...parentPath, step.title];
    return [{ title: step.title, path: stepPath,
      status: step.error ? 'failed' : 'passed', duration: step.duration,
      error: step.error?.message || null, location: null },
      ...flattenSteps(step.steps, stepPath)];
  });
}

function buildSummary(report, stepReport = { attempts: [] }) {
  const tests = [];
  function visit(suites) {
    for (const suite of suites || []) {
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          const attempts = (test.results || []).map(result => {
            // startTime ป้องกันอ่าน steps.json เก่าที่มาจากการรันคนละรอบ.
            const recorded = (stepReport.attempts || []).find(attempt =>
              attempt.testId === spec.id && attempt.retry === result.retry &&
              attempt.startTime === result.startTime);
            const steps = recorded?.steps || flattenSteps(result.steps);
            const failedSteps = steps.filter(step => step.status === 'failed');
            // parent และ child อาจมี error เดียวกัน เลือกขั้นตอนย่อยที่ลึกที่สุด.
            const deepest = failedSteps.reduce((best, step) =>
              !best || step.path.length > best.path.length ? step : best, null);
            const errors = (result.errors?.length ? result.errors : result.error ? [result.error] : [])
              .map(error => error.message || error.value || 'Unknown error');
            const isFailed = failedStatuses.has(result.status);
            const failureType = !isFailed ? null : 'test';
            return {
              retry: result.retry || 0, status: result.status, duration: result.duration,
              error: errors[0] || null, errors,
              line: result.error?.location?.line || result.errorLocation?.line || null,
              column: result.error?.location?.column || result.errorLocation?.column || null,
              steps, failed_step: deepest?.title || null,
              failed_step_path: deepest?.path || null,
              failed_steps: failedSteps, failure_type: failureType,
            };
          });
          // สรุปผลรอบสุดท้าย ป้องกัน retry ที่ผ่านแล้วถูกนับเป็น Failed ซ้ำ.
          const last = attempts.at(-1);
          tests.push({ title: spec.title, file: spec.file,
            project: test.projectName, outcome: test.status,
            ...(last || { status: 'notRun', steps: [], failed_step: null, failure_type: null }),
            attempts });
        }
      }
      visit(suite.suites);
    }
  }
  visit(report.suites);
  const stats = report.stats;
  return {
    total: stats.expected + stats.unexpected + stats.skipped + stats.flaky,
    passed: stats.expected, failed: stats.unexpected,
    skipped: stats.skipped, flaky: stats.flaky, duration: Math.round(stats.duration),
    tests,
    failedTests: tests.filter(test => failedStatuses.has(test.status)),
    runErrors: report.errors || [],
  };
}

async function main() {
  const repo = path.resolve(__dirname, '..');
  const report = JSON.parse(fs.readFileSync(path.join(repo, 'test-results/results.json'), 'utf8'));
  const stepPath = path.join(repo, 'test-results/steps.json');
  const stepReport = fs.existsSync(stepPath) ? JSON.parse(fs.readFileSync(stepPath, 'utf8')) : undefined;
  const summary = buildSummary(report, stepReport);
  fs.writeFileSync(path.join(repo, 'test-results/summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  // เรียนรู้และตรวจ payload ได้โดยไม่ส่ง webhook.
  if (process.argv.includes('--dry-run')) return;
  const webhookUrl = process.env.N8N_WEBHOOK_URL ||
    'https://unpremonished-lizzette-semiproductive.ngrok-free.dev/webhook/playwright-results';
  const response = await fetch(webhookUrl, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(summary), signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`n8n returned HTTP ${response.status}: ${await response.text()}`);
  console.log('Sent to n8n successfully:', await response.text());
}

// import ฟังก์ชันไปตรวจได้โดยไม่ส่งข้อมูลออกไป.
module.exports = { buildSummary, flattenSteps };
if (require.main === module) main().catch(error => {
  console.error('Failed to send to n8n:', error.message);
  process.exitCode = 1;
});
