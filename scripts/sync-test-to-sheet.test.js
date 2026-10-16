const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { caseIds, reportResults, verifyCompleteReport, sheetRows, makeUpdates, formatRunTime, parseArgs, verifyReportSuite } = require('./sync-test-to-sheet');

test('expands grouped case IDs', () => {
  assert.deepEqual(caseIds('TC-POST04-001,003,004,008: delete'), [
    'TC-POST04-001', 'TC-POST04-003', 'TC-POST04-004', 'TC-POST04-008',
  ]);
  assert.deepEqual(caseIds('TC-LIFE-001: full lifecycle'), []);
  assert.deepEqual(caseIds('TC-POST01-038: publish'), ['TC-POST01-038']);
  assert.deepEqual(caseIds('TC-POST01-039: cleanup'), []);
  assert.deepEqual(caseIds('TC-POST02-002,004,005,007,008,011,015: draft'), [
    'TC-POST02-002', 'TC-POST02-004', 'TC-POST02-005', 'TC-POST02-007', 'TC-POST02-008',
    'TC-POST02-011', 'TC-POST02-015',
  ]);
  assert.deepEqual(caseIds('TC-POST03-001,003,005,008,017,021,022,025: edit'), [
    'TC-POST03-001', 'TC-POST03-003', 'TC-POST03-005', 'TC-POST03-008',
    'TC-POST03-017', 'TC-POST03-021', 'TC-POST03-022', 'TC-POST03-025',
  ]);
});

test('uses only passed TC-POST results and never marks lifecycle', () => {
  const report = { suites: [{ suites: [], specs: [
    { title: 'TC-POST01-001: login', tests: [{ status: 'expected', results: [{ status: 'passed' }] }] },
    { title: 'TC-POST01-002: fields', tests: [{ status: 'unexpected', results: [{ status: 'failed' }] }] },
    { title: 'TC-POST01-003: upload', tests: [{ status: 'skipped', results: [{ status: 'skipped' }] }] },
    { title: 'TC-LIFE-001: lifecycle', tests: [{ status: 'expected', results: [{ status: 'passed' }] }] },
  ] }] };
  assert.deepEqual([...reportResults(report)], [['TC-POST01-001', 'Pass']]);
});

test('refuses to sync partial or failed runs', () => {
  const ids = new Map(Array.from({ length: 11 }, (_, index) => [`TC-POST02-${String(index + 1).padStart(3, '0')}`, 'Pass']));
  const complete = { stats: { expected: 4, unexpected: 0, skipped: 0, flaky: 0 } };
  assert.doesNotThrow(() => verifyCompleteReport(complete, 'draft', ids));
  assert.throws(() => verifyCompleteReport({ stats: { ...complete.stats, unexpected: 1 } }, 'draft', ids), /Sheet was not changed/);
  assert.throws(() => verifyCompleteReport(complete, 'draft', new Map([...ids].slice(1))), /Sheet was not changed/);
});

test('matches actual sheet rows and reports missing IDs', () => {
  const rows = sheetRows([['Test Case ID'], ['TC-POST01-001'], [], ['TC-POST01-002']]);
  const { updates, missing } = makeUpdates(new Map([
    ['TC-POST01-001', 'Pass'], ['TC-POST01-002', 'Fail'],
    ['TC-LIFE-001', 'Pass'], ['TC-POST01-039', 'Pass'],
  ]), rows, '16 October 2026 18:18', 'TC-02 สร้างโพสและจัดการโพสต์');
  assert.deepEqual(updates.map(item => item.range), [
    "'TC-02 สร้างโพสและจัดการโพสต์'!K2",
    "'TC-02 สร้างโพสและจัดการโพสต์'!L2",
    "'TC-02 สร้างโพสและจัดการโพสต์'!M2",
  ]);
  assert.deepEqual(updates.map(item => item.values), [[['Pass']], [['16 October 2026 18:18']], [['Automated']]]);
  assert.deepEqual(missing, ['TC-POST01-039']);
});

test('formats the test completion time in Bangkok', () => {
  assert.equal(formatRunTime({ stats: { startTime: '2026-10-16T11:13:00Z', duration: 300000 } }), '16 October 2026 18:18');
});

test('accepts only named suites', () => {
  assert.deepEqual(parseArgs(['--suite=create', '--dry-run']), { suite: 'create', dryRun: true, checkAccess: false, fromReport: false });
  assert.deepEqual(parseArgs(['--check-access']), { suite: 'all', dryRun: false, checkAccess: true, fromReport: false });
  assert.deepEqual(parseArgs(['--suite=draft', '--from-report']), { suite: 'draft', dryRun: false, checkAccess: false, fromReport: true });
  assert.deepEqual(parseArgs(['--suite=all', '--from-report']), { suite: 'all', dryRun: false, checkAccess: false, fromReport: true });
  assert.throws(() => parseArgs(['--suite=unknown']), /Unknown suite/);
});

test('saved report must be recent and belong to the selected suite', () => {
  const report = { stats: { startTime: new Date().toISOString() }, suites: [{ file: 'post/draft-post.spec.js' }] };
  assert.doesNotThrow(() => verifyReportSuite(report, 'draft'));
  assert.throws(() => verifyReportSuite(report, 'create'), /does not match/);
  const full = { stats: report.stats, suites: [
    'create', 'draft', 'edit', 'delete', 'detail', 'lifecycle',
  ].map(name => ({ file: `post/${name === 'lifecycle' ? 'lifecycle-flow' : `${name}-post`}.spec.js` })) };
  assert.doesNotThrow(() => verifyReportSuite(full, 'all'));
  assert.throws(() => verifyReportSuite({ ...full, suites: full.suites.slice(1) }, 'all'), /does not match/);
});

test('saved report cannot predate a changed test file', () => {
  const file = path.join(__dirname, '..', 'tests', 'post', 'draft-post.spec.js');
  const changed = fs.statSync(file).mtimeMs;
  const report = {
    stats: { startTime: new Date(changed - 1000).toISOString() },
    suites: [{ file: 'post/draft-post.spec.js' }],
  };
  assert.throws(() => verifyReportSuite(report, 'draft'), /predates test changes/);
});
