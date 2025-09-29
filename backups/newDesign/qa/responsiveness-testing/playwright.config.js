// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

/**
 * Playwright configuration for responsiveness testing
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/html-report' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['list'],
    ['./utils/custom-reporter.js']
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3005',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  projects: [
    // Desktop viewports
    {
      name: 'Desktop-4K',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 3840, height: 2160 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: 'Desktop-1920',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Desktop-1366',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'Desktop-1280',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Tablet viewports
    {
      name: 'iPad-Pro',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
      },
    },
    {
      name: 'iPad-Air',
      use: {
        ...devices['iPad Air'],
        viewport: { width: 820, height: 1180 },
      },
    },
    {
      name: 'iPad-Mini',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 },
      },
    },

    // Mobile viewports
    {
      name: 'iPhone-14-Pro-Max',
      use: {
        ...devices['iPhone 14 Pro Max'],
        viewport: { width: 430, height: 932 },
      },
    },
    {
      name: 'iPhone-14',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'iPhone-SE',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'Pixel-7',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 412, height: 915 },
      },
    },
    {
      name: 'Galaxy-S21',
      use: {
        viewport: { width: 384, height: 854 },
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Samsung Galaxy S21) AppleWebKit/537.36',
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'Small-Mobile',
      use: {
        viewport: { width: 320, height: 568 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1) AppleWebKit/603.1.30',
        hasTouch: true,
        isMobile: true,
      },
    },

    // Landscape mobile viewports
    {
      name: 'iPhone-14-Landscape',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 844, height: 390 },
      },
    },
    {
      name: 'iPad-Landscape',
      use: {
        ...devices['iPad Air'],
        viewport: { width: 1180, height: 820 },
      },
    },
  ],

  /* Configure test output */
  outputDir: 'test-results/',

  /* Shared test configuration */
  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  /* Web server configuration for local testing */
  webServer: process.env.CI ? undefined : {
    command: 'cd ../../../ && python3 -m http.server 3005',
    url: 'http://localhost:3005',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});