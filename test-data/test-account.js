const fs = require('node:fs');
const path = require('node:path');

function getTestAccount() {
  const envAccount = {
    email: process.env.MEMBER_EMAIL,
    password: process.env.MEMBER_PASSWORD,
  };
  if (envAccount.email && envAccount.password) return envAccount;

  const localPath = path.resolve(__dirname, '..', 'test-account.local.json');
  if (fs.existsSync(localPath)) {
    const localAccount = require(localPath);
    if (localAccount.email && localAccount.password) return localAccount;
  }

  throw new Error('Missing test account: set MEMBER_EMAIL and MEMBER_PASSWORD, or create test-account.local.json with email and password.');
}

module.exports = { getTestAccount };
