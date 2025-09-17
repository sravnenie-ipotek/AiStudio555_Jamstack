const { test, expect } = require('@playwright/test');

test('CRITICAL: Website not using admin/API data', async ({ page }) => {
  console.log('\n🚨 CRITICAL ISSUE: Website shows STATIC content, not DYNAMIC from admin!\n');
  console.log('=' .repeat(80));
  
  // 1. Check what API returns
  console.log('\n📡 API DATA:');
  const apiResponse = await page.request.get('https://aistudio555jamstack-production.up.railway.app/api/home-page');
  const apiData = await apiResponse.json();
  
  const apiContent = apiData.data?.attributes || {};
  console.log(`   Hero Title: "${apiContent.heroTitle}"`);
  console.log(`   Hero Subtitle: "${apiContent.heroSubtitle}"`);
  console.log(`   Hero Description: "${apiContent.heroDescription}"`);
  
  // 2. Check what website displays
  console.log('\n🌐 WEBSITE DISPLAYS:');
  await page.goto('https://www.aistudio555.com/dist/en/index.html');
  await page.waitForLoadState('networkidle');
  
  const websiteContent = {
    heroTitle: await page.locator('h1.banner-heading').textContent(),
    heroSubtitle: await page.locator('.banner-subtitle').first().textContent(),
    heroDescription: await page.locator('p.banner-description-text').textContent()
  };
  
  console.log(`   Hero Title: "${websiteContent.heroTitle}"`);
  console.log(`   Hero Subtitle: "${websiteContent.heroSubtitle}"`);
  console.log(`   Hero Description: "${websiteContent.heroDescription}"`);
  
  // 3. Compare and identify issue
  console.log('\n❌ MISMATCHES:');
  console.log('=' .repeat(80));
  
  const mismatches = [];
  
  if (apiContent.heroTitle !== websiteContent.heroTitle) {
    console.log(`\n❌ Hero Title MISMATCH:`);
    console.log(`   Admin/API: "${apiContent.heroTitle}"`);
    console.log(`   Website:   "${websiteContent.heroTitle}"`);
    mismatches.push('Hero Title');
  }
  
  if (apiContent.heroSubtitle !== websiteContent.heroSubtitle) {
    console.log(`\n❌ Hero Subtitle MISMATCH:`);
    console.log(`   Admin/API: "${apiContent.heroSubtitle}"`);
    console.log(`   Website:   "${websiteContent.heroSubtitle}"`);
    mismatches.push('Hero Subtitle');
  }
  
  if (apiContent.heroDescription !== websiteContent.heroDescription) {
    console.log(`\n❌ Hero Description MISMATCH:`);
    console.log(`   Admin/API: "${apiContent.heroDescription}"`);
    console.log(`   Website:   "${websiteContent.heroDescription}"`);
    mismatches.push('Hero Description');
  }
  
  // 4. Check if JavaScript is loading
  console.log('\n\n🔧 CHECKING JAVASCRIPT:');
  console.log('=' .repeat(80));
  
  // Check if strapi-integration.js exists and loads
  const scriptResponse = await page.request.get('https://www.aistudio555.com/dist/en/js/strapi-integration.js');
  console.log(`   Script status: ${scriptResponse.status()} ${scriptResponse.status() === 200 ? '✅' : '❌'}`);
  
  // Check for console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // Reload to catch errors
  await page.reload();
  await page.waitForTimeout(2000);
  
  if (consoleErrors.length > 0) {
    console.log('   ❌ JavaScript Errors Found:');
    consoleErrors.forEach(err => console.log(`      - ${err}`));
  } else {
    console.log('   ✅ No JavaScript errors');
  }
  
  // 5. ROOT CAUSE ANALYSIS
  console.log('\n\n🔍 ROOT CAUSE ANALYSIS:');
  console.log('=' .repeat(80));
  
  if (mismatches.length > 0) {
    console.log('\n🚨 PROBLEM: Website is NOT using data from admin panel/API!');
    console.log('\nThe website is showing HARDCODED/STATIC content instead of dynamic content.');
    console.log('\nPOSSIBLE CAUSES:');
    console.log('1. JavaScript integration not running on page load');
    console.log('2. Script loads but doesn\'t execute properly');
    console.log('3. API structure doesn\'t match what JavaScript expects');
    console.log('4. Authentication/CORS issues preventing API access');
    
    // Check if API is being called
    console.log('\n📊 Checking if API is called by website...');
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('api/home-page')) {
        networkRequests.push(request.url());
      }
    });
    
    await page.reload();
    await page.waitForTimeout(3000);
    
    if (networkRequests.length > 0) {
      console.log('   ✅ API is being called by website');
      console.log(`   Calls made: ${networkRequests.join(', ')}`);
    } else {
      console.log('   ❌ API is NOT being called by website!');
      console.log('   This means JavaScript is not fetching dynamic content');
    }
  }
  
  // 6. SOLUTION
  console.log('\n\n💡 SOLUTION NEEDED:');
  console.log('=' .repeat(80));
  console.log('The strapi-integration.js file needs to:');
  console.log('1. Actually execute on page load');
  console.log('2. Fetch data from API');
  console.log('3. Update the DOM with fetched data');
  console.log('4. Handle the flat API structure (heroTitle, not hero.title)');
  
  console.log('\n📸 Taking screenshots...');
  await page.screenshot({ path: 'website-static-content.png', fullPage: false });
  
  // Fail if mismatches found
  expect(mismatches.length).toBe(0);
});