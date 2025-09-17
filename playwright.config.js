// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Comprehensive E2E Testing Configuration for Multi-Language E-Learning Platform
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './',
  
  /* Test organization */
  fullyParallel: process.env.PARALLEL === 'true',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : process.env.WORKERS ? parseInt(process.env.WORKERS) : 4,
  
  /* Enhanced reporting for comprehensive testing */
  reporter: [
    ['html', { 
      outputFolder: 'test-results/html-report',
      open: process.env.CI ? 'never' : 'on-failure'
    }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list', { printSteps: true }],
    ['github'] // GitHub Actions integration
  ],
  
  /* Global test settings */
  use: {
    /* Base URL configuration */
    baseURL: process.env.BASE_URL || 'http://localhost:3005',

    /* Enhanced debugging and analysis */
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* Network and security */
    ignoreHTTPSErrors: true,
    
    /* User agent for testing identification */
    userAgent: 'Mozilla/5.0 (compatible; AI-Studio-E2E-Tests/1.0; +https://aistudio555.com)',
    
    /* Locale and timezone for consistent testing */
    locale: 'en-US',
    timezoneId: 'America/New_York',
    
    /* Viewport for consistent testing */
    viewport: { width: 1280, height: 720 },
    
    /* Performance and stability */
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  /* Test projects for different browsers and scenarios */
  projects: [
    /* Desktop Browsers */
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
      testMatch: [
        '**/language-switching.spec.js',
        '**/console-errors.spec.js',
        '**/font-typography.spec.js',
        '**/accessibility.spec.js',
        '**/performance.spec.js',
        '**/comprehensive-system.spec.js',
        '**/responsive-quick.spec.js',
        '**/responsive-newdesign.spec.js',
        '**/teachers-page.spec.js'
      ]
    },
    
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
      testMatch: [
        '**/language-switching.spec.js',
        '**/accessibility.spec.js',
        '**/comprehensive-system.spec.js'
      ]
    },
    
    {
      name: 'safari-desktop',
      use: { ...devices['Desktop Safari'] },
      testMatch: [
        '**/multi-language.spec.js',
        '**/typography.spec.js',
        '**/form-validation.spec.js'
      ]
    },

    /* Mobile Devices */
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: [
        '**/responsive.spec.js',
        '**/responsive-newdesign.spec.js',
        '**/accessibility.spec.js',
        '**/performance.spec.js',
        '**/form-validation.spec.js'
      ]
    },
    
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
      testMatch: [
        '**/responsive.spec.js',
        '**/typography.spec.js',
        '**/form-validation.spec.js'
      ]
    },

    /* Tablet Testing */
    {
      name: 'tablet-chrome',
      use: { ...devices['iPad Pro'] },
      testMatch: [
        '**/responsive.spec.js',
        '**/responsive-newdesign.spec.js',
        '**/multi-language.spec.js'
      ]
    },

    /* Visual Regression Testing */
    {
      name: 'visual-regression',
      use: { 
        ...devices['Desktop Chrome'],
        // Consistent settings for visual testing
        deviceScaleFactor: 1,
        hasTouch: false
      },
      testMatch: ['**/visual-regression.spec.js']
    },

    /* API Testing (headless) */
    {
      name: 'api-testing',
      use: { 
        ...devices['Desktop Chrome'],
        headless: true
      },
      testMatch: ['**/api-testing.spec.js']
    },

    /* Performance Testing */
    {
      name: 'performance-testing',
      use: { 
        ...devices['Desktop Chrome'],
        // CPU throttling for more realistic performance testing
        launchOptions: {
          args: ['--enable-features=NetworkService']
        }
      },
      testMatch: ['**/performance.spec.js']
    }
  ],

  /* Development server configuration */
  webServer: [
    {
      command: 'python3 -m http.server 3005',
      url: 'http://127.0.0.1:3005',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        NODE_ENV: 'test'
      }
    }
  ],
  
  /* Timeouts */
  timeout: process.env.CI ? 90 * 1000 : 60 * 1000,
  expect: {
    timeout: 15 * 1000,
    // Visual comparison thresholds
    toHaveScreenshot: { 
      threshold: 0.2,
      mode: 'coverage',
      animations: 'disabled'
    },
    toMatchSnapshot: { 
      threshold: 0.2 
    }
  },
  
  /* Test result organization */
  outputDir: 'test-results/artifacts',
  
  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/global-setup.js'),
  globalTeardown: require.resolve('./tests/global-teardown.js'),
  
  /* Test metadata */
  metadata: {
    platform: 'AI Studio E-Learning Platform',
    version: '1.0.0',
    testSuite: 'Comprehensive E2E Testing Suite',
    languages: ['English', 'Russian', 'Hebrew'],
    features: [
      'Multi-language support',
      'Responsive design',
      'Accessibility (WCAG)',
      'Performance optimization',
      'Visual regression',
      'Form validation',
      'API integration',
      'SEO optimization',
      'Data privacy compliance'
    ]
  }
});