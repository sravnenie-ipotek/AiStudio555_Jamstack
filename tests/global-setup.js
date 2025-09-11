// Global setup for E2E testing
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function globalSetup(config) {
  console.log('🚀 Starting Global E2E Test Setup for AI Studio E-Learning Platform');
  
  // Create test results directories
  const testResultsDir = path.join(__dirname, '..', 'test-results');
  const dirs = [
    testResultsDir,
    path.join(testResultsDir, 'screenshots'),
    path.join(testResultsDir, 'html-report'),
    path.join(testResultsDir, 'artifacts'),
    path.join(testResultsDir, 'visual-regression')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  // Setup test environment information
  const setupInfo = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    testConfig: {
      baseURL: config.use.baseURL,
      browsers: config.projects.map(p => p.name),
      parallel: config.fullyParallel,
      workers: config.workers
    },
    environment: {
      CI: !!process.env.CI,
      NODE_ENV: process.env.NODE_ENV || 'test'
    }
  };

  // Save setup information
  fs.writeFileSync(
    path.join(testResultsDir, 'test-setup-info.json'),
    JSON.stringify(setupInfo, null, 2)
  );

  console.log('✅ Global setup completed successfully');
  console.log(`📊 Test results will be saved to: ${testResultsDir}`);
  
  return setupInfo;
}

module.exports = globalSetup;