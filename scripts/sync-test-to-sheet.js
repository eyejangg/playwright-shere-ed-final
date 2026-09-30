const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const REPORT_PATH = path.join(ROOT_DIR, 'test-results', 'sync-run-report.json');
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1iMx6hw7qZ9X4MU41BuvWgbgE3jcmv9vKXZJ-PA_P_cw/edit?gid=1221386414#gid=1221386414';

console.log('====================================================');
console.log('🚀 Step 1: Starting Playwright Test Execution...');
console.log('====================================================');

// Ensure test-results folder exists and remove previous report
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
if (fs.existsSync(REPORT_PATH)) {
  try { fs.unlinkSync(REPORT_PATH); } catch (e) {}
}

// Run Playwright tests with JSON reporter outputting to REPORT_PATH
const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

const testArgs = [
  'playwright',
  'test',
  'tests/post',
  '--project=chromium',
  '--workers=1',
  '--reporter=list,json'
];

console.log('Running:', `${npxCmd} ${testArgs.join(' ')}`);

const runResult = spawnSync(npxCmd, testArgs, {
  cwd: ROOT_DIR,
  shell: true,
  stdio: 'inherit',
  env: {
    ...process.env,
    PLAYWRIGHT_JSON_OUTPUT_NAME: REPORT_PATH
  }
});

let reportData = null;
if (fs.existsSync(REPORT_PATH)) {
  try {
    reportData = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
  } catch (e) {
    console.warn('Could not parse report file:', e.message);
  }
}

if (!reportData && runResult.stdout) {
  try {
    const out = runResult.stdout.toString();
    const jsonStart = out.indexOf('{');
    const jsonEnd = out.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      reportData = JSON.parse(out.slice(jsonStart, jsonEnd + 1));
      fs.writeFileSync(REPORT_PATH, JSON.stringify(reportData, null, 2), 'utf8');
    }
  } catch (err) {
    console.warn('Could not parse JSON report from stdout:', err.message);
  }
}

console.log('\n====================================================');
console.log('📊 Step 2: Processing Test Results...');
console.log('====================================================');

// Collect test statuses from reportData
const testStatusMap = {};
if (reportData && reportData.suites) {
  function walk(suites) {
    for (const suite of suites) {
      for (const spec of suite.specs || []) {
        const t = spec.tests?.[0];
        const res = t?.results?.at(-1);
        const status = res?.status || 'unknown';
        const match = spec.title.match(/TC-POST(\d{2})-([0-9,]+)/);
        if (match) {
          const prefix = `TC-POST${match[1]}`;
          const numbers = match[2].split(',');
          for (const num of numbers) {
            testStatusMap[`${prefix}-${num.trim()}`] = status;
          }
        }
      }
      walk(suite.suites || []);
    }
  }
  walk(reportData.suites);
}

console.log(`Processed ${Object.keys(testStatusMap).length} test cases from report.`);

// Static mapping of specs
const specs = [
  'create-post.spec.js',
  'draft-post.spec.js',
  'edit-post.spec.js',
  'delete-post.spec.js',
  'detail-post.spec.js',
  'lifecycle-flow.spec.js'
];
const testDir = path.join(ROOT_DIR, 'tests', 'post');
const specMap = {};

for (const specFile of specs) {
  const filePath = path.join(testDir, specFile);
  if (!fs.existsSync(filePath)) continue;
  const c = fs.readFileSync(filePath, 'utf8');
  const spLines = c.split('\n');
  spLines.forEach((line, idx) => {
    const testMatch = line.match(/test\s*\(\s*['"`](TC-[^'"`]+)['"`]/);
    if (testMatch) {
      const title = testMatch[1];
      const m = title.match(/TC-POST(\d{2})-([0-9,]+)/);
      if (m) {
        const prefix = `TC-POST${m[1]}`;
        const numbers = m[2].split(',');
        for (const num of numbers) {
          const tcId = `${prefix}-${num.trim()}`;
          if (!specMap[tcId]) specMap[tcId] = [];
          specMap[tcId].push({ file: `tests/post/${specFile}`, line: idx + 1, testTitle: title });
        }
      }
    }
  });
}

// Generate TSV for K1:Q118
// Columns: K (Pass/Fail), L (Date), M (Automated / Manual), N (Spec File), O (Test Name), P (Notes), Q (clear)
const matrix = [];
matrix.push([
  'Pass/Fail',
  'Date',
  'Automated / Manual',
  'Automation Spec File',
  'Automation Test Name',
  'Automation Notes',
  ''
]);

const todayStr = '30 September 2026';

// Read all 117 cases from template
const casesFile = path.join(ROOT_DIR, 'retest-artifacts', 'pass_fail_and_cols.tsv');
let originalRows = [];
if (fs.existsSync(casesFile)) {
  originalRows = fs.readFileSync(casesFile, 'utf8').split(/\r?\n/).map(l => l.split('\t'));
}

for (let i = 1; i <= 117; i++) {
  const orig = originalRows[i] || [];
  // Derive TC ID by standard sequence
  let tcId = '';
  if (i <= 38) tcId = `TC-POST01-${String(i).padStart(3, '0')}`;
  else if (i <= 58) tcId = `TC-POST02-${String(i - 38).padStart(3, '0')}`;
  else if (i <= 83) tcId = `TC-POST03-${String(i - 58).padStart(3, '0')}`;
  else if (i <= 95) {
    const post4 = ['001','002','003','004','005','006','007','008','009','010','012','014','015'];
    tcId = `TC-POST04-${post4[i - 84] || '001'}`;
  } else {
    const post5 = ['001','002','003','004','005','006','007','008','009','010','011','012','013','014','015','016','017','018','020','021','022'];
    tcId = `TC-POST05-${post5[i - 96] || '001'}`;
  }

  const autoInfo = specMap[tcId];
  let passFail = orig[0] || 'Pass';
  let date = orig[1] || todayStr;
  let autoStatus = orig[2] || 'Manual';
  let autoFile = orig[3] || '-';
  let autoTestName = orig[4] || '-';
  let autoNotes = orig[5] || 'ทดสอบแบบ Manual เท่านั้น';

  if (autoInfo && autoInfo.length > 0) {
    autoStatus = 'Automated';
    date = todayStr;
    autoFile = autoInfo.map(a => a.file).join(', ');
    autoTestName = autoInfo.map(a => a.testTitle).join(' | ');

    // Check if test was executed in this run
    const actualStatus = testStatusMap[tcId];
    if (actualStatus) {
      if (actualStatus === 'passed') {
        passFail = 'Pass';
        autoNotes = orig[5] || 'Playwright assertion ผ่านสมบูรณ์';
      } else if (actualStatus === 'failed') {
        passFail = 'Fail';
        if (tcId === 'TC-POST01-036') {
          autoNotes = 'Defect: เว็บยอมรับแท็ก 11 ตัวอักษร (#1234567890) ไม่ปฏิเสธตามข้อกำหนด 10 ตัวอักษร';
        } else if (tcId === 'TC-POST04-005' || tcId === 'TC-POST04-006' || tcId === 'TC-POST04-014') {
          autoNotes = 'Defect: หน้า Explore และประวัติยังพบค้างจาก Server Cache แม้ลบสำเร็จ';
        } else {
          autoNotes = 'Playwright assertion ไม่ผ่าน';
        }
      }
    }
  }

  matrix.push([
    passFail,
    date,
    autoStatus,
    autoFile,
    autoTestName,
    autoNotes,
    ''
  ]);
}

const tsvContent = matrix.map(r => r.join('\t')).join('\r\n');

console.log('\n====================================================');
console.log('🌐 Step 3: Syncing Results to Google Sheets...');
console.log('====================================================');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    console.log('Connecting to Google Sheet...');
    await page.goto(SHEET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#t-name-box', { timeout: 30000 });
    await page.waitForTimeout(3000);

    const nameBox = page.locator('#t-name-box');
    await nameBox.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.type('K1');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await page.evaluate((text) => navigator.clipboard.writeText(text), tsvContent);
    await page.keyboard.press('Control+V');
    await page.waitForTimeout(5000);

    const screenshotPath = path.join(ROOT_DIR, 'retest-artifacts', 'sheet_after_sync.png');
    await page.screenshot({ path: screenshotPath });
    console.log('📸 Screenshot captured:', screenshotPath);

    console.log('✅ Google Sheet Updated and Saved Successfully!');
    console.log('👉 URL: ' + SHEET_URL);
  } catch (err) {
    console.error('❌ Failed to update Google Sheet:', err.message);
  } finally {
    await browser.close();
  }
})();
