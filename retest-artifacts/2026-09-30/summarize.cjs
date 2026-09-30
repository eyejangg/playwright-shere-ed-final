const fs = require('node:fs');
const path = require('node:path');
const folder = __dirname;
const reports = process.argv.slice(2).map(name => JSON.parse(fs.readFileSync(path.join(folder, name), 'utf8')));
const entries = [];
function walk(suites) {
  for (const suite of suites) {
    for (const spec of suite.specs || []) {
      const t = spec.tests[0];
      const result = t.results.at(-1);
      const match = spec.title.match(/TC-POST(\d{2})-(\d{3}(?:,\d{3})*)/);
      const ids = match ? match[2].split(',').map(n => `TC-POST${match[1]}-${n}`) : [];
      const cleanup = result.attachments?.find(a => a.name === 'created-posts-cleaned');
      let items = [];
      if (cleanup?.body) items = JSON.parse(Buffer.from(cleanup.body, 'base64').toString());
      entries.push({ title: spec.title, ids, status: result.status, duration: result.duration, errors: result.errors?.map(e => e.message), items });
    }
    walk(suite.suites || []);
  }
}
reports.forEach(report => walk(report.suites));
const latest = [...new Map(entries.map(e => [e.title, e])).values()];
const cases = latest.flatMap(e => e.ids.map(id => ({ id, status: e.status, flow: e.title, items: e.items })));
const summary = { tests: latest.length, passed: latest.filter(e => e.status === 'passed').length, failed: latest.filter(e => e.status !== 'passed').length, cases, entries: latest };
fs.writeFileSync(path.join(folder, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ tests: summary.tests, passed: summary.passed, failed: summary.failed, caseCount: cases.length, failedTests: latest.filter(e => e.status !== 'passed'), cleanupAttachments: latest.filter(e => e.items.length).length }, null, 2));
