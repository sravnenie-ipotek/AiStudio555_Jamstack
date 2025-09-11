const fs = require('fs');
const path = require('path');

async function globalSetup(config) {
  console.log('🎭 Setting up Playwright responsive testing...');
  
  // Create test-results directory structure
  const testResultsDir = path.join(__dirname, '..', 'test-results');
  const screenshotsDir = path.join(testResultsDir, 'screenshots');
  const artifactsDir = path.join(testResultsDir, 'artifacts');
  const htmlReportDir = path.join(testResultsDir, 'html-report');
  
  // Create directories if they don't exist
  [testResultsDir, screenshotsDir, artifactsDir, htmlReportDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
  
  // Clean up old screenshots
  if (fs.existsSync(screenshotsDir)) {
    const files = fs.readdirSync(screenshotsDir);
    files.forEach(file => {
      if (file.endsWith('.png')) {
        fs.unlinkSync(path.join(screenshotsDir, file));
      }
    });
    console.log('🧹 Cleaned up old screenshots');
  }
  
  console.log('✅ Global setup complete');
}

module.exports = globalSetup;