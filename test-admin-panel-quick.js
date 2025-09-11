/**
 * ADMIN PANEL FUNCTIONALITY TEST
 * Test cleaned up admin panel with essential sections only
 */

const { chromium } = require('playwright');

async function testAdminPanel() {
  console.log('🔍 TESTING CLEANED UP ADMIN PANEL');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to admin panel
    console.log('📂 Opening admin panel...');
    await page.goto('http://localhost:3000/content-admin-comprehensive.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check essential tabs are present
    console.log('\n📊 CHECKING ESSENTIAL TABS:');
    const tabs = [
      '🏠 Home Page',
      '⚙️ Site Settings', 
      '🧭 Navigation Menu',
      '📊 Statistics',
      '🔘 Button Texts',
      '🏢 Company Logos'
    ];
    
    for (const tabName of tabs) {
      const tabExists = await page.locator(`button:has-text("${tabName}")`).count() > 0;
      console.log(`${tabExists ? '✅' : '❌'} ${tabName}: ${tabExists ? 'FOUND' : 'MISSING'}`);
    }
    
    // Test Site Settings section for errors
    console.log('\n⚙️ TESTING SITE SETTINGS SECTION:');
    await page.click('button:has-text("Site Settings")');
    await page.waitForTimeout(1000);
    
    // Check for JavaScript errors in console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Check if site name field exists
    const siteNameField = await page.locator('#siteName').count();
    console.log(`${siteNameField > 0 ? '✅' : '❌'} Site Name Field: ${siteNameField > 0 ? 'FOUND' : 'MISSING'}`);
    
    // Test Statistics section
    console.log('\n📊 TESTING STATISTICS SECTION:');
    await page.click('button:has-text("Statistics")');
    await page.waitForTimeout(1000);
    
    const statsFields = ['#coursesCount', '#learnersCount', '#yearsCount'];
    for (const fieldId of statsFields) {
      const fieldExists = await page.locator(fieldId).count() > 0;
      console.log(`${fieldExists ? '✅' : '❌'} ${fieldId}: ${fieldExists ? 'FOUND' : 'MISSING'}`);
    }
    
    // Report any JavaScript errors
    console.log('\n⚠️ JAVASCRIPT ERRORS:');
    if (errors.length === 0) {
      console.log('✅ No JavaScript errors detected');
    } else {
      errors.forEach(error => {
        console.log(`❌ ${error}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 FINAL RESULT: ${errors.length === 0 ? 'ADMIN PANEL CLEAN ✅' : 'ERRORS NEED FIXING ❌'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run test
testAdminPanel().catch(console.error);