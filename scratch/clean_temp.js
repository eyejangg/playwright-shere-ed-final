const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('/home/node/.n8n/database.sqlite');
db.prepare('DELETE FROM workflow_entity WHERE id = ?').run('clear001demo0001');
console.log('Cleaned up temp workflow');
