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

console.log('Total rows in CSV:', records.length);
records.forEach((r, idx) => {
  const rowNum = idx + 1;
  if (r[0]) {
    console.log(`Row ${rowNum}: ${r[0]} | ${r[2] ? r[2].slice(0, 30) : ''}`);
  }
});
