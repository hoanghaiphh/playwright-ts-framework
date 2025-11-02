import { defineConfig, devices } from '@playwright/test';
import { currentConfig } from 'configs/env.config';

export default defineConfig({

  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : 3,

  reporter: [
    ['html'],
    ['line'],
    ['allure-playwright', { resultsDir: 'allure-results', suitesTitle: true, }]
  ],

  use: {
    baseURL: currentConfig.appUrl,
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
    { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
