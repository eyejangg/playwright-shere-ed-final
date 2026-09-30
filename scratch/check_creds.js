const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('scratch/database.sqlite');
const creds = db.prepare("SELECT id, name, type, data FROM credentials_entity").all();
console.log(creds.map(c => ({ id: c.id, name: c.name, type: c.type, hasData: !!c.data })));
