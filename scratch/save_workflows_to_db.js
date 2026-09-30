const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const jsonPath = fs.existsSync('/tmp/n8n_workflows_cleaned.json')
  ? '/tmp/n8n_workflows_cleaned.json'
  : 'scratch/n8n_workflows_cleaned.json';

const workflows = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const dbPath = fs.existsSync('/home/node/.n8n/database.sqlite')
  ? '/home/node/.n8n/database.sqlite'
  : 'scratch/database.sqlite';

const db = new DatabaseSync(dbPath);

const updateStmt = db.prepare(`
  UPDATE workflow_entity
  SET nodes = ?,
      connections = ?,
      updatedAt = datetime('now'),
      versionCounter = versionCounter + 1
  WHERE id = ?
`);

for (const wf of workflows) {
  const info = updateStmt.run(
    JSON.stringify(wf.nodes),
    JSON.stringify(wf.connections),
    wf.id
  );
  console.log('Updated workflow', wf.id, '(', wf.name, '): changes =', info.changes);
}
