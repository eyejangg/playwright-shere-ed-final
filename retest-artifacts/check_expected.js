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

// Get all automated cases
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
          map[tcId].push({ file: specFile, line: idx + 1, testTitle: title });
        }
      }
    }
  });
}

console.log('Automated cases count:', Object.keys(map).length);

const automatedList = [];
for (let i = 1; i <= 117; i++) {
  const row = records[i];
  const tcId = row[0];
  const desc = row[2];
  const expected = row[8];
  if (map[tcId]) {
    automatedList.push({
      tcId,
      desc,
      expected: expected.replace(/\n/g, ' '),
      spec: map[tcId][0].file,
      testName: map[tcId][0].testTitle
    });
  }
}

console.log(`Matched ${automatedList.length} automated cases.`);
fs.writeFileSync('retest-artifacts/automated_expected_check.json', JSON.stringify(automatedList, null, 2), 'utf8');
