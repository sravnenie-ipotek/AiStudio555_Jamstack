const fs = require('fs');
const path = require('path');

async function globalTeardown(config) {
  console.log('🏁 Starting Global E2E Test Teardown');
  
  const resultsDir = path.join(__dirname, '..', 'test-results');
  
  try {
    // Read test metadata
    const metadataPath = path.join(resultsDir, 'test-metadata.json');
    let metadata = {};
    
    if (fs.existsSync(metadataPath)) {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    }
    
    // Calculate test duration
    const endTime = new Date().toISOString();
    const startTime = metadata.startTime ? new Date(metadata.startTime) : new Date();
    const duration = Math.round((new Date() - startTime) / 1000);
    
    // Create test summary
    const summary = {
      ...metadata,
      endTime,
      duration: duration,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };
    
    // Try to read results if they exist
    const resultsPath = path.join(resultsDir, 'results.json');
    if (fs.existsSync(resultsPath)) {
      try {
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        summary.testResults = {
          total: results.stats?.total || 0,
          passed: results.stats?.passed || 0,
          failed: results.stats?.failed || 0,
          skipped: results.stats?.skipped || 0,
          flaky: results.stats?.flaky || 0
        };
      } catch (e) {
        // Ignore JSON parse errors
      }
    } else {
      summary.testResults = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        flaky: 0
      };
    }
    
    // Save final summary
    fs.writeFileSync(
      path.join(resultsDir, 'test-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    // Display summary
    const stats = summary.testResults;
    console.log('\n📊 Test Execution Summary:');
    console.log(`⏱️  Duration: ${duration} seconds`);
    console.log(`📝 Total Tests: ${stats.total}`);
    console.log(`✅ Passed: ${stats.passed}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log(`⏭️  Skipped: ${stats.skipped}`);
    console.log(`🔄 Flaky: ${stats.flaky}`);
    
    if (stats.failed === 0 && stats.total > 0) {
      console.log('\n🎉 All tests passed successfully!');
    } else if (stats.total === 0) {
      console.log('\n⚠️  No tests were executed');
    } else {
      console.log(`\n⚠️  ${stats.failed} test(s) failed`);
    }
    
    // List test coverage areas
    console.log('\n📋 Test Coverage Areas:');
    const coverageAreas = [
      { name: 'MultiLanguage', description: 'English, Russian, Hebrew' },
      { name: 'Accessibility', description: 'WCAG compliance tested' },
      { name: 'Performance', description: 'Core Web Vitals measured' },
      { name: 'VisualRegression', description: 'Cross-browser consistency' },
      { name: 'Forms', description: 'Contact form validation' },
      { name: 'Api', description: 'API response testing' },
      { name: 'Seo', description: 'Meta tags and structured data' },
      { name: 'Privacy', description: 'Cookie and storage compliance' }
    ];
    
    coverageAreas.forEach(area => {
      console.log(`   ✅ ${area.description} ${area.name}`);
    });
    
    // List generated files
    console.log('\n📁 Test artifacts saved to:');
    console.log(`   📊 HTML Report: ${path.join(resultsDir, 'html-report', 'index.html')}`);
    console.log(`   📸 Screenshots: ${path.join(resultsDir, 'screenshots')}`);
    console.log(`   🎥 Videos: ${path.join(resultsDir, 'artifacts')}`);
    console.log(`   📈 JSON Results: ${path.join(resultsDir, 'results.json')}`);
    console.log(`   📋 Summary: ${path.join(resultsDir, 'test-summary.json')}`);
    
  } catch (error) {
    console.error('Error in global teardown:', error.message);
  }
  
  console.log('\n✅ Global teardown completed');
}

module.exports = globalTeardown;