// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests', // Directory for test files
  timeout: 30000, // Timeout for each test (30 seconds)
  retries: 2, // Number of retries for flaky tests
  use: {
    headless: true, // Run tests in headless mode
    baseURL: 'http://localhost:3000', // Base URL of your app
    video: 'on', // Record videos for failed tests on the
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    //{ name: 'firefox', use: { browserName: 'firefox' } },
    //{ name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
