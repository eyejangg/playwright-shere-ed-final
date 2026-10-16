const { spawnSync } = require('node:child_process');
const { createSign } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const REPORT = path.join(ROOT, 'artifacts', 'playwright', 'sync-run-report.json');
const DEFAULT_CREDENTIALS = path.join(ROOT, 'google-service-account.local.json');
const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1iMx6hw7qZ9X4MU41BuvWgbgE3jcmv9vKXZJ-PA_P_cw';
const SHEET_GID = Number(process.env.GOOGLE_SHEET_GID || 1221386414);
const SUITES = {
  all: 'tests/post/', create: 'tests/post/create-post.spec.js',
  draft: 'tests/post/draft-post.spec.js', edit: 'tests/post/edit-post.spec.js',
  delete: 'tests/post/delete-post.spec.js', detail: 'tests/post/detail-post.spec.js',
};
const EXPECTED_RUN = {
  all: { tests: 49, ids: 74 }, create: { tests: 39, ids: 38 },
  draft: { tests: 4, ids: 11 }, edit: { tests: 2, ids: 14 },
  delete: { tests: 2, ids: 9 }, detail: { tests: 1, ids: 2 },
};

function parseArgs(args) {
  const options = { suite: 'all', dryRun: false, checkAccess: false, fromReport: false };
  for (const arg of args) {
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--check-access') options.checkAccess = true;
    else if (arg === '--from-report') options.fromReport = true;
    else if (arg.startsWith('--suite=')) options.suite = arg.slice('--suite='.length);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!SUITES[options.suite]) throw new Error(`Unknown suite: ${options.suite}`);
  return options;
}

function verifyReportSuite(report, suite) {
  if (!report.stats?.startTime || Date.now() - Date.parse(report.stats.startTime) > 24 * 60 * 60 * 1000) {
    throw new Error('Saved Playwright report is missing a valid run time or is older than 24 hours');
  }
  const files = (report.suites || []).map(item => String(item.file || '').replaceAll('\\', '/'));
  const expected = suite === 'all'
    ? [...Object.entries(SUITES).filter(([name]) => name !== 'all').map(([, file]) => file), 'tests/post/lifecycle-flow.spec.js']
    : [SUITES[suite]];
  const expectedFiles = expected.map(file => file.replace(/^tests\//, ''));
  if (files.length !== expectedFiles.length || files.some(file => !expectedFiles.includes(file))) {
    throw new Error(`Saved report does not match --suite=${suite}`);
  }
  const started = Date.parse(report.stats.startTime);
  for (const file of expected) {
    if (fs.statSync(path.join(ROOT, file)).mtimeMs > started) {
      throw new Error(`Saved report predates test changes in ${file}; rerun the selected suite`);
    }
  }
}

function caseIds(title) {
  const match = title.match(/\b(TC-POST\d{2}-)(\d{3}(?:,\d{3})*)\b/);
  return match ? match[2].split(',').map(number => `${match[1]}${number}`)
    .filter(id => id !== 'TC-POST01-039') : [];
}

function reportResults(report) {
  if (!Array.isArray(report.suites)) throw new Error('Invalid Playwright JSON report');
  const results = new Map();
  function walk(suites) {
    for (const suite of suites) {
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          const last = test.results?.at(-1)?.status;
          if (last !== 'passed' || test.status === 'flaky') continue;
          for (const id of caseIds(spec.title)) {
            if (results.has(id)) throw new Error(`Duplicate TC ID in test report: ${id}`);
            results.set(id, 'Pass');
          }
        }
      }
      walk(suite.suites || []);
    }
  }
  walk(report.suites);
  return results;
}

function verifyCompleteReport(report, suite, results) {
  const expected = EXPECTED_RUN[suite];
  const stats = report.stats || {};
  if (stats.expected !== expected.tests || stats.unexpected !== 0 ||
      stats.skipped !== 0 || stats.flaky !== 0 || results.size !== expected.ids) {
    throw new Error(`Incomplete ${suite} run: expected ${expected.tests} passed tests and ${expected.ids} TC IDs; got ${stats.expected || 0} passed, ${stats.unexpected || 0} failed, ${stats.skipped || 0} skipped, ${stats.flaky || 0} flaky, ${results.size} TC IDs. Sheet was not changed.`);
  }
}

function sheetRows(values) {
  const rows = new Map();
  for (let index = 1; index < values.length; index++) {
    const id = String(values[index]?.[0] || '').trim();
    if (!/^TC-POST\d{2}-\d{3}$/.test(id)) continue;
    if (rows.has(id)) throw new Error(`Duplicate TC ID in Google Sheet: ${id}`);
    rows.set(id, index + 1);
  }
  return rows;
}

function formatRunTime(report) {
  const started = Date.parse(report.stats?.startTime);
  if (!Number.isFinite(started)) throw new Error('Playwright report has no valid start time');
  const duration = Number(report.stats?.duration || 0);
  const finished = new Date(started + Math.max(0, duration));
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bangkok', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(finished).map(part => [part.type, part.value]));
  return `${parts.day} ${parts.month} ${parts.year} ${parts.hour}:${parts.minute}`;
}

function makeUpdates(results, rows, runTime, tabTitle) {
  const updates = [];
  const missing = [];
  const quotedTab = `'${tabTitle.replaceAll("'", "''")}'`;
  for (const [id, status] of results) {
    if (status !== 'Pass' || !/^TC-POST\d{2}-\d{3}$/.test(id)) continue;
    const row = rows.get(id);
    if (!row) { missing.push(id); continue; }
    updates.push({ range: `${quotedTab}!K${row}`, values: [['Pass']] });
    updates.push({ range: `${quotedTab}!L${row}`, values: [[runTime]] });
    updates.push({ range: `${quotedTab}!M${row}`, values: [['Automated']] });
  }
  return { updates, missing };
}

function loadCredentials() {
  const file = path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_FILE || DEFAULT_CREDENTIALS);
  if (!fs.existsSync(file)) throw new Error(`Missing Google service account file: ${file}`);
  const credentials = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (credentials.type !== 'service_account' || !credentials.client_email || !credentials.private_key) {
    throw new Error('Google credential file must contain a service account email and private key');
  }
  return credentials;
}

async function accessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const tokenUri = 'https://oauth2.googleapis.com/token';
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const input = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: tokenUri, iat: now, exp: now + 3600,
  })}`;
  const signer = createSign('RSA-SHA256');
  signer.update(input);
  signer.end();
  const assertion = `${input}.${signer.sign(credentials.private_key, 'base64url')}`;
  const response = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  const body = await response.json();
  if (!response.ok || !body.access_token) throw new Error(`Google authentication failed (${response.status}): ${body.error || 'no access token'}`);
  return body.access_token;
}

async function sheetsRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`Google Sheets API ${response.status}: ${body.error?.message || 'request failed'}`);
  return body;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const credentials = loadCredentials();
  if (options.checkAccess) {
    const token = await accessToken(credentials);
    const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SHEET_ID)}`;
    const metadata = await sheetsRequest(`${base}?fields=sheets(properties(sheetId,title))`, token);
    const sheet = metadata.sheets?.find(item => item.properties?.sheetId === SHEET_GID)?.properties;
    if (!sheet) throw new Error(`Sheet tab gid ${SHEET_GID} was not found`);
    const tab = `'${sheet.title.replaceAll("'", "''")}'`;
    const header = await sheetsRequest(`${base}/values/${encodeURIComponent(`${tab}!A1:M1`)}`, token);
    const columns = header.values?.[0] || [];
    if (columns[0] !== 'Test Case ID' || columns[10] !== 'Pass/Fail' || columns[12] !== 'Automated / Manual') {
      throw new Error('Sheet columns A, K and M do not match the expected headers');
    }
    console.log(`Google Sheet access confirmed: ${sheet.title} (read-only check)`);
    return;
  }
  let runStatus = 0;
  if (!options.fromReport) {
    fs.mkdirSync(path.dirname(REPORT), { recursive: true });
    fs.rmSync(REPORT, { force: true });
    const run = spawnSync(process.execPath, [
      path.join(ROOT, 'node_modules', 'playwright', 'cli.js'),
      'test', SUITES[options.suite], '--project=chromium', '--workers=1', '--reporter=list,json,html',
    ], {
      cwd: ROOT,
      stdio: 'inherit',
      env: {
        ...process.env,
        PLAYWRIGHT_JSON_OUTPUT_FILE: REPORT,
        PLAYWRIGHT_HTML_OUTPUT_DIR: path.join(ROOT, 'artifacts', 'playwright', 'report'),
        PLAYWRIGHT_HTML_OPEN: 'never',
      },
    });
    if (run.error) throw run.error;
    if (run.signal) throw new Error(`Playwright was interrupted by ${run.signal}`);
    runStatus = run.status || 0;
  }
  if (!fs.existsSync(REPORT)) throw new Error(`No Playwright JSON report was found: ${REPORT}`);

  const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
  if (options.fromReport) verifyReportSuite(report, options.suite);
  const results = reportResults(report);
  verifyCompleteReport(report, options.suite, results);

  const token = await accessToken(credentials);
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SHEET_ID)}`;
  const metadata = await sheetsRequest(`${base}?fields=sheets(properties(sheetId,title,gridProperties(rowCount)))`, token);
  const sheet = metadata.sheets?.find(item => item.properties?.sheetId === SHEET_GID)?.properties;
  if (!sheet) throw new Error(`Sheet tab gid ${SHEET_GID} was not found`);
  const tab = `'${sheet.title.replaceAll("'", "''")}'`;
  const header = await sheetsRequest(`${base}/values/${encodeURIComponent(`${tab}!A1:M1`)}`, token);
  const columns = header.values?.[0] || [];
  if (columns[0] !== 'Test Case ID' || columns[10] !== 'Pass/Fail' || columns[12] !== 'Automated / Manual') {
    throw new Error('Sheet columns A, K and M do not match the expected headers');
  }
  const idData = await sheetsRequest(`${base}/values/${encodeURIComponent(`${tab}!A1:A${sheet.gridProperties.rowCount}`)}`, token);
  const rows = sheetRows(idData.values || []);
  const runTime = formatRunTime(report);
  const { updates, missing } = makeUpdates(results, rows, runTime, sheet.title);
  if (missing.length) throw new Error(`TC IDs missing from sheet: ${missing.join(', ')}. Sheet was not changed.`);

  console.log(`Passed TC-POST IDs: ${results.size}; matched sheet rows: ${updates.length / 3}; missing TC IDs: ${missing.length}`);
  if (missing.length) console.warn(`Missing in sheet: ${missing.join(', ')}`);
  if (options.dryRun) {
    console.log(`Dry run: no cells changed. Planned K, L and M updates: ${JSON.stringify(updates)}`);
  } else if (updates.length) {
    const response = await sheetsRequest(`${base}/values:batchUpdate`, token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valueInputOption: 'RAW', data: updates }),
    });
    if (response.totalUpdatedCells !== updates.length) {
      throw new Error(`Google Sheets updated ${response.totalUpdatedCells || 0} of ${updates.length} cells`);
    }
    console.log(`Marked ${updates.length / 3} passed rows in Google Sheet: ${sheet.title}`);
  }
  if (runStatus !== 0) process.exitCode = runStatus;
}

if (require.main === module) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}

module.exports = { caseIds, reportResults, verifyCompleteReport, sheetRows, makeUpdates, formatRunTime, parseArgs, verifyReportSuite };
