const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('scratch/database.sqlite');
const rows = db.prepare("SELECT * FROM webhook_entity").all();
console.log(rows);
