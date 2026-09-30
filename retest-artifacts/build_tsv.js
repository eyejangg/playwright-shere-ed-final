const fs = require('fs');
const path = require('path');

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
  const c = fs.readFileSync(path.join(testDir, specFile), 'utf8');
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

// Build matrix from Row 1 to Row 118
const matrix = [];

// Row 1: Header
matrix.push([
  'Automated / Manual',
  'Automation Spec File',
  'Automation Test Name',
  'Automation Retest Status',
  'Automation Notes'
]);

for (let i = 1; i <= 117; i++) {
  const row = records[i];
  const tcId = row[0];
  const autoInfo = map[tcId];

  let autoStatus = 'Manual';
  let autoFile = '-';
  let autoTestName = '-';
  let autoResult = '-';
  let autoNotes = 'ทดสอบแบบ Manual เท่านั้น';

  if (autoInfo && autoInfo.length > 0) {
    autoStatus = 'Automated';
    autoFile = autoInfo.map(a => a.file).join(', ');
    autoTestName = autoInfo.map(a => a.testTitle).join(' | ');

    if (tcId === 'TC-POST01-036') {
      autoResult = 'Fail (Defect)';
      autoNotes = 'Defect: เว็บยอมรับแท็ก 11 ตัวอักษร (#1234567890) ไม่ปฏิเสธตามข้อกำหนด 10 ตัวอักษร';
    } else if (tcId === 'TC-POST04-005' || tcId === 'TC-POST04-006' || tcId === 'TC-POST04-014') {
      autoResult = 'Fail (Defect)';
      autoNotes = 'Defect: หน้า Explore และประวัติยังพบค้างจาก Server Cache แม้ลบสำเร็จ';
    } else if (tcId === 'TC-POST01-031') {
      autoResult = 'Pass';
      autoNotes = 'ครบ 3 แท็กแล้วซ่อนช่อง input และแท็กแนะนำไม่เพิ่มแท็กที่ 4';
    } else if (tcId === 'TC-POST01-038') {
      autoResult = 'Pass';
      autoNotes = 'สร้างโพสต์ครบทุกฟิลด์ แนบ PDF/รูปภาพ ตรวจรายละเอียด และลบ cleanup';
    } else if (tcId.startsWith('TC-POST01-')) {
      autoResult = 'Pass';
      autoNotes = 'Playwright assertion ใน create-post.spec.js ผ่าน';
    } else if (tcId.startsWith('TC-POST02-')) {
      autoResult = 'Pass';
      autoNotes = 'Playwright draft flow ใน draft-post.spec.js ผ่าน';
    } else if (tcId.startsWith('TC-POST03-')) {
      autoResult = 'Pass';
      autoNotes = 'Playwright edit & validation flow ใน edit-post.spec.js ผ่าน';
    } else if (tcId.startsWith('TC-POST04-')) {
      autoResult = 'Pass';
      autoNotes = 'Dialog ยืนยันลบ แสดงชื่อโพสต์ และยกเลิกการลบได้สำเร็จ';
    } else if (tcId.startsWith('TC-POST05-')) {
      autoResult = 'Pass';
      autoNotes = 'เปิดหน้ารายละเอียดและดาวน์โหลด PDF ตรวจสอบ magic bytes ผ่าน';
    }
  }

  matrix.push([
    autoStatus,
    autoFile,
    autoTestName,
    autoResult,
    autoNotes
  ]);
}

console.log('Matrix rows:', matrix.length);
console.log('Sample Row 2:', matrix[1]);
console.log('Sample Row 37 (TC-POST01-036):', matrix[36]);
console.log('Sample Row 41 (TC-POST02-002):', matrix[40]);

// Convert matrix to TSV
const tsv = matrix.map(row => row.join('\t')).join('\r\n');
fs.writeFileSync('d:/playwright-shere-ed-final/retest-artifacts/sheet_columns.tsv', tsv, 'utf8');
console.log('Saved TSV to retest-artifacts/sheet_columns.tsv');
