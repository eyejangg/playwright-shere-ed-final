const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('scratch/database.sqlite');
const rows = db.prepare("SELECT * FROM oauth_access_tokens").all();
console.log(rows);
