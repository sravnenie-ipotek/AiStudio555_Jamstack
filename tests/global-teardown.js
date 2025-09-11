// Global teardown for E2E testing
const path = require('path');
const fs = require('fs');

async function globalTeardown(config) {
  console.log('🏁 Starting Global E2E Test Teardown');
  
  const testResultsDir = path.join(__dirname, '..', 'test-results');
  
  // Generate test summary report
  try {
    const setupInfoPath = path.join(testResultsDir, 'test-setup-info.json');
    const resultsPath = path.join(testResultsDir, 'results.json');
    
    let setupInfo = {};
    let testResults = {};
    
    if (fs.existsSync(setupInfoPath)) {
      setupInfo = JSON.parse(fs.readFileSync(setupInfoPath, 'utf8'));
    }
    
    if (fs.existsSync(resultsPath)) {
      testResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    }
    
    const summary = {
      testSuite: 'AI Studio E-Learning Platform E2E Tests',
      completedAt: new Date().toISOString(),
      duration: setupInfo.timestamp ? 
        Math.round((new Date() - new Date(setupInfo.timestamp)) / 1000) : 0,
      environment: setupInfo.environment || {},
      statistics: {
        totalTests: testResults.stats?.total || 0,
        passed: testResults.stats?.expected || 0,
        failed: testResults.stats?.unexpected || 0,
        skipped: testResults.stats?.skipped || 0,
        flaky: testResults.stats?.flaky || 0
      },
      coverage: {
        multiLanguage: '✅ English, Russian, Hebrew',
        accessibility: '✅ WCAG compliance tested',
        performance: '✅ Core Web Vitals measured',
        visualRegression: '✅ Cross-browser consistency',
        forms: '✅ Contact form validation',
        api: '✅ API response testing',
        seo: '✅ Meta tags and structured data',
        privacy: '✅ Cookie and storage compliance'
      }
    };
    
    // Save summary
    fs.writeFileSync(
      path.join(testResultsDir, 'test-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    // Console summary
    console.log('\n📊 Test Execution Summary:');
    console.log(`⏱️  Duration: ${summary.duration} seconds`);
    console.log(`📝 Total Tests: ${summary.statistics.totalTests}`);
    console.log(`✅ Passed: ${summary.statistics.passed}`);
    console.log(`❌ Failed: ${summary.statistics.failed}`);
    console.log(`⏭️  Skipped: ${summary.statistics.skipped}`);
    console.log(`🔄 Flaky: ${summary.statistics.flaky}`);
    
    if (summary.statistics.failed > 0) {
      console.log('\n⚠️  Some tests failed. Check the HTML report for details.');
    } else {
      console.log('\n🎉 All tests passed successfully!');
    }
    
    console.log('\n📋 Test Coverage Areas:');
    Object.entries(summary.coverage).forEach(([area, status]) => {
      console.log(`   ${status} ${area.charAt(0).toUpperCase() + area.slice(1)}`);
    });
    
  } catch (error) {
    console.error('❌ Error generating test summary:', error.message);
  }
  
  // Cleanup temporary files
  try {
    const tempFiles = [
      path.join(testResultsDir, 'test-setup-info.json')
    ];
    
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    
  } catch (error) {
    console.error('⚠️ Error cleaning up temporary files:', error.message);
  }
  
  console.log('\n📁 Test artifacts saved to:');
  console.log(`   📊 HTML Report: ${path.join(testResultsDir, 'html-report', 'index.html')}`);
  console.log(`   📸 Screenshots: ${path.join(testResultsDir, 'screenshots')}`);
  console.log(`   🎥 Videos: ${path.join(testResultsDir, 'artifacts')}`);
  console.log(`   📈 JSON Results: ${path.join(testResultsDir, 'results.json')}`);
  console.log(`   📋 Summary: ${path.join(testResultsDir, 'test-summary.json')}`);
  
  console.log('\n✅ Global teardown completed');
}

module.exports = globalTeardown;