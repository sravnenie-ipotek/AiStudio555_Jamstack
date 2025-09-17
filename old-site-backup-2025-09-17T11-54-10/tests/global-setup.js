const fs = require('fs');
const path = require('path');

async function globalSetup(config) {
  console.log('🚀 Starting Global E2E Test Setup for AI Studio E-Learning Platform');
  
  // Create test results directories
  const resultsDir = path.join(__dirname, '..', 'test-results');
  const dirs = [
    resultsDir,
    path.join(resultsDir, 'artifacts'),
    path.join(resultsDir, 'screenshots'),
    path.join(resultsDir, 'videos'),
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
  
  // Create test metadata
  const metadata = {
    startTime: new Date().toISOString(),
    platform: process.platform,
    nodeVersion: process.version,
    arch: process.arch,
    testConfig: {
      baseURL: config?.use?.baseURL || 'http://localhost:3005',
      browsers: config?.projects?.map(p => p.name) || ['chromium'],
      parallel: config?.fullyParallel || false,
      workers: config?.workers || 1
    }
  };
  
  fs.writeFileSync(
    path.join(resultsDir, 'test-metadata.json'), 
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('✅ Global setup completed');
}

module.exports = globalSetup;