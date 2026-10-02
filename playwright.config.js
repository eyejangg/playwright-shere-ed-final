// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',

  // ล็อกอินอัตโนมัติก่อนเริ่มเทส
  globalSetup: require.resolve('./global-setup'),

  use: {
    testIdAttribute: 'test-data',
    baseURL: 'https://share-ed.online/',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'on', // บันทึกวิดีโอทุกรอบ (ทั้ง Pass และ Fail) เพื่อเก็บผลไว้เป็นหลักฐาน
    storageState: 'playwright/.auth/member.json',
    trace: 'retain-on-failure',
    launchOptions: {
      slowMo: 1000,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
