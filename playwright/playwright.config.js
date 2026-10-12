// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('node:path');
const projectRoot = path.resolve(__dirname, '..');
const resultsRoot = path.resolve(projectRoot, process.env.TEST_OUTPUT_DIR || 'artifacts/playwright/test-results');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/create-post.spec.js',
  // Uploads on the live site need time to finish before UI assertions.
  timeout: 120_000,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // Live writes must not be replayed automatically after a failure.
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ['html', {
    open: 'never',
    outputFolder: path.resolve(projectRoot, process.env.PLAYWRIGHT_HTML_OUTPUT_DIR || 'artifacts/playwright/report'),
  }]],
  outputDir: resultsRoot,

  // global setup: รันล็อกอินอัตโนมัติก่อนเริ่มเทสทุกครั้ง 
  globalSetup: require.resolve('./global-setup'),

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // กำหนดให้ getByTestId ค้นหาผ่าน attribute "test-data"
    testIdAttribute: 'test-data',

    // เว็บหลัก
    baseURL: process.env.BASE_URL || 'https://share-ed.online/',
    headless: true,
    // หน่วงแต่ละ action (มิลลิวินาที) ตั้ง 500 หรือ 1000 เพื่อดูขั้นตอน และ 0 เพื่อปิด
    launchOptions: {
      slowMo: 0,
    },
    screenshot: 'only-on-failure',
    // video: 'on',
    video: 'retain-on-failure',

    // ใช้สถานะ Login ที่บันทึกไว้ จาก global-setup
    storageState: path.join(__dirname, '.auth', 'member.json'),

    /* Collect trace for every test run (both passed and failed) */
    // trace: 'on',
    trace: 'retain-on-failure',
    // trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      outputDir: path.join(resultsRoot, 'chromium'),
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      outputDir: path.join(resultsRoot, 'firefox'),
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      outputDir: path.join(resultsRoot, 'webkit'),
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    {
      name: 'msedge',
      outputDir: path.join(resultsRoot, 'msedge'),
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'chrome',
      outputDir: path.join(resultsRoot, 'chrome'),
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
