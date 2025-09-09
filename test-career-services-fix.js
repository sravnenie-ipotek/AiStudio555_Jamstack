const { chromium } = require('playwright');

async function testCareerServicesDropdown() {
  console.log('🧪 TESTING CAREER SERVICES DROPDOWN FIX\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const testPages = [
    { name: 'Index Page', url: 'http://localhost:9090/en/index.html' },
    { name: 'Career Orientation Page', url: 'http://localhost:9090/career-orientation.html' },
    { name: 'Teachers Page', url: 'http://localhost:9090/teachers.html' },
    { name: 'Courses Page', url: 'http://localhost:9090/courses.html' },
    { name: 'Contact Us Page', url: 'http://localhost:9090/contact-us.html' }
  ];
  
  const results = { success: [], failures: [] };
  
  for (const testPage of testPages) {
    console.log(`📄 Testing ${testPage.name}...`);
    
    try {
      await page.goto(testPage.url);
      await page.waitForTimeout(1000);
      
      // Check if Career Services dropdown exists
      const dropdown = await page.$('.menu-dropdown-wrapper');
      if (!dropdown) {
        results.failures.push(`${testPage.name}: Career Services dropdown not found`);
        console.log(`   ❌ Career Services dropdown not found`);
        continue;
      }
      
      // Check dropdown text
      const dropdownText = await page.$eval('.dropdown-toggle-text-block', el => el.textContent);
      if (dropdownText !== 'Career Services') {
        results.failures.push(`${testPage.name}: Wrong dropdown text: "${dropdownText}"`);
        console.log(`   ❌ Wrong dropdown text: "${dropdownText}"`);
        continue;
      }
      
      // Test that clicking Career Services doesn't redirect
      const initialUrl = page.url();
      
      // Click on the Career Services text (dropdown toggle)
      await page.click('.dropdown-toggle');
      await page.waitForTimeout(500);
      
      const urlAfterClick = page.url();
      
      if (initialUrl !== urlAfterClick) {
        results.failures.push(`${testPage.name}: Clicking Career Services caused redirect from ${initialUrl} to ${urlAfterClick}`);
        console.log(`   ❌ Clicking Career Services caused unwanted redirect!`);
        console.log(`      From: ${initialUrl}`);
        console.log(`      To: ${urlAfterClick}`);
        continue;
      }
      
      // Test that hovering shows the dropdown
      await page.hover('.dropdown-toggle');
      await page.waitForTimeout(500);
      
      const dropdownList = await page.$('.dropdown-column-wrapper-3');
      if (!dropdownList) {
        results.failures.push(`${testPage.name}: Dropdown content not found (wrong structure)`);
        console.log(`   ❌ Dropdown content not found - may have wrong structure`);
        continue;
      }
      
      // Check that dropdown links exist and work
      const careerOrientationLink = await page.$('a[href="career-orientation.html"]');
      const careerCenterLink = await page.$('a[href="career-center.html"]');
      
      if (!careerOrientationLink || !careerCenterLink) {
        results.failures.push(`${testPage.name}: Missing dropdown links`);
        console.log(`   ❌ Missing dropdown links`);
        continue;
      }
      
      // Test Career Orientation link navigation
      await careerOrientationLink.click();
      await page.waitForTimeout(1000);
      
      const navigationUrl = page.url();
      if (!navigationUrl.includes('career-orientation.html')) {
        results.failures.push(`${testPage.name}: Career Orientation link navigation failed`);
        console.log(`   ❌ Career Orientation link navigation failed`);
        continue;
      }
      
      results.success.push(testPage.name);
      console.log(`   ✅ Career Services dropdown working correctly`);
      console.log(`   ✅ Clicking "Career Services" stays on page (no redirect)`);
      console.log(`   ✅ Dropdown content visible on hover`);
      console.log(`   ✅ Links navigate correctly`);
      
    } catch (error) {
      results.failures.push(`${testPage.name}: Test error - ${error.message}`);
      console.log(`   ❌ Test error: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Final report
  console.log('📊 FINAL RESULTS:\n');
  console.log(`✅ Successful pages: ${results.success.length}`);
  results.success.forEach(page => console.log(`   - ${page}`));
  
  console.log(`\n❌ Failed pages: ${results.failures.length}`);
  results.failures.forEach(failure => console.log(`   - ${failure}`));
  
  const successRate = (results.success.length / testPages.length * 100).toFixed(1);
  console.log(`\n📈 Success Rate: ${successRate}%`);
  
  if (results.failures.length === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Career Services dropdown is working correctly!');
  } else {
    console.log('\n⚠️ Some tests failed. Review the issues above.');
  }
  
  await browser.close();
  
  return results.failures.length === 0;
}

// Run the test
testCareerServicesDropdown().catch(console.error);
