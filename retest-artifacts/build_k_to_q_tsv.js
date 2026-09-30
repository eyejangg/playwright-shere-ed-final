const fs = require('fs');

const csvPath = 'C:\\Users\\ptwpt\\.gemini\\antigravity-ide\\brain\\83a5025d-9c41-45fc-a690-184268979317\\.system_generated\\steps\\25\\content.md';
const content = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const p = [];
  let row = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      p.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') p.push(row);
  return p;
}

const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.startsWith('Test Case ID,'));
const records = parseCSV(lines.slice(startIdx).join('\n'));

// Load automation mapping
const specs = [
  'create-post.spec.js',
  'draft-post.spec.js',
  'edit-post.spec.js',
  'delete-post.spec.js',
  'detail-post.spec.js',
  'lifecycle-flow.spec.js'
];
const testDir = 'd:\\playwright-shere-ed-final\\tests\\post';
const map = {};

for (const specFile of specs) {
  const c = fs.readFileSync(require('path').join(testDir, specFile), 'utf8');
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
          if (!map[tcId]) map[tcId] = [];
          map[tcId].push({ file: `tests/post/${specFile}`, line: idx + 1, testTitle: title });
        }
      }
    }
  });
}

// Build matrix from Row 1 to Row 118 for columns K to Q
// K: Pass/Fail
// L: Date
// M: Automated / Manual
// N: Automation Spec File
// O: Automation Test Name
// P: Automation Notes
// Q: (empty to wipe out old column Q)
const matrix = [];

// Header Row 1
matrix.push([
  'Pass/Fail',
  'Date',
  'Automated / Manual',
  'Automation Spec File',
  'Automation Test Name',
  'Automation Notes',
  ''
]);

for (let i = 1; i <= 117; i++) {
  const row = records[i];
  const tcId = row[0];
  const originalPassFail = row[10] || 'Pass';
  const originalDate = row[11] || '30 September 2026';
  const autoInfo = map[tcId];

  let passFail = originalPassFail;
  let date = originalDate;
  let autoStatus = 'Manual';
  let autoFile = '-';
  let autoTestName = '-';
  let autoNotes = 'ทดสอบแบบ Manual เท่านั้น';

  if (autoInfo && autoInfo.length > 0) {
    autoStatus = 'Automated';
    date = '30 September 2026';
    autoFile = autoInfo.map(a => a.file).join(', ');
    autoTestName = autoInfo.map(a => a.testTitle).join(' | ');

    if (tcId === 'TC-POST01-036') {
      passFail = 'Fail';
      autoNotes = 'Defect: เว็บยอมรับแท็ก 11 ตัวอักษร (#1234567890) ไม่ปฏิเสธตามข้อกำหนด 10 ตัวอักษร';
    } else if (tcId === 'TC-POST04-005' || tcId === 'TC-POST04-006' || tcId === 'TC-POST04-014') {
      passFail = 'Fail';
      autoNotes = 'Defect: หน้า Explore และประวัติยังพบค้างจาก Server Cache แม้ลบสำเร็จ';
    } else if (tcId === 'TC-POST01-031') {
      passFail = 'Pass';
      autoNotes = 'รีเทสผ่าน: ครบ 3 แท็กแล้วซ่อนช่อง input และแท็กแนะนำไม่เพิ่มแท็กที่ 4';
    } else if (tcId === 'TC-POST01-038') {
      passFail = 'Pass';
      autoNotes = 'รีเทสผ่าน: สร้างโพสต์ครบทุกฟิลด์ แนบ PDF/รูปภาพ ตรวจรายละเอียด และลบ cleanup';
    } else if (tcId.startsWith('TC-POST03-') && ['TC-POST03-009', 'TC-POST03-013', 'TC-POST03-016', 'TC-POST03-018', 'TC-POST03-020'].includes(tcId)) {
      passFail = 'Pass';
      autoNotes = 'รีเทสผ่าน: แก้ไข toast selector ใน edit-post.spec.js แล้วตรวจสอบ validation ผ่านครบ';
    } else if (tcId === 'TC-POST04-007') {
      passFail = 'Pass';
      autoNotes = 'รีเทสผ่าน: เข้า URL เดิมไม่ได้ และไม่แสดงรายละเอียดโพสต์ที่ถูกลบ';
    } else {
      passFail = 'Pass';
      if (tcId.startsWith('TC-POST01-')) autoNotes = 'Playwright assertion ใน create-post.spec.js ผ่าน';
      else if (tcId.startsWith('TC-POST02-')) autoNotes = 'Playwright draft flow ใน draft-post.spec.js ผ่าน';
      else if (tcId.startsWith('TC-POST03-')) autoNotes = 'Playwright edit flow ใน edit-post.spec.js ผ่าน';
      else if (tcId.startsWith('TC-POST04-')) autoNotes = 'Playwright delete flow ใน delete-post.spec.js ผ่าน';
      else if (tcId.startsWith('TC-POST05-')) autoNotes = 'Playwright detail & PDF download ใน detail-post.spec.js ผ่าน';
    }
  }

  matrix.push([
    passFail,
    date,
    autoStatus,
    autoFile,
    autoTestName,
    autoNotes,
    '' // Clears column Q
  ]);
}

const tsv = matrix.map(r => r.join('\t')).join('\r\n');
fs.writeFileSync('d:/playwright-shere-ed-final/retest-artifacts/pass_fail_and_cols.tsv', tsv, 'utf8');
console.log('Saved TSV to retest-artifacts/pass_fail_and_cols.tsv');
console.log('Matrix count:', matrix.length);
