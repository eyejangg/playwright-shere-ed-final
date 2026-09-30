const fs = require('node:fs');
const path = require('node:path');

// เดินผ่านทุกประเภทขั้นตอน แต่เก็บเฉพาะชื่อที่เราเขียนด้วย test.step().
// ทำให้เห็น step ที่อยู่ใต้ beforeEach และ fixture cleanup ด้วย.
function collectSteps(steps, parentPath = []) {
  return (steps || []).flatMap(step => {
    const named = step.category === 'test.step';
    const stepPath = named ? [...parentPath, step.title] : parentPath;
    const current = named ? [{
      title: step.title,
      path: stepPath,
      status: step.error ? 'failed' : 'passed',
      duration: step.duration,
      error: step.error?.message || null,
      location: step.location || null,
    }] : [];
    return [...current, ...collectSteps(step.steps, stepPath)];
  });
}

class StepReporter {
  onBegin(config) {
    this.outputFile = path.resolve(config.rootDir, '../test-results/steps.json');
    this.attempts = [];
  }
  onTestEnd(test, result) {
    this.attempts.push({
      testId: test.id,
      retry: result.retry,
      startTime: result.startTime.toISOString(),
      status: result.status,
      steps: collectSteps(result.steps),
    });
  }
  onEnd() {
    fs.mkdirSync(path.dirname(this.outputFile), { recursive: true });
    fs.writeFileSync(this.outputFile, JSON.stringify({ attempts: this.attempts }, null, 2));
  }
}
module.exports = StepReporter;
module.exports.collectSteps = collectSteps;
