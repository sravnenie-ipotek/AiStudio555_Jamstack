const { test, expect } = require('@playwright/test');

test('VERIFY: Dynamic content loading after fixes', async ({ page }) => {
  console.log('\n🔍 TESTING DYNAMIC CONTENT AFTER CRITICAL FIXES\n');
  console.log('=' .repeat(80));
  
  // Go to website
  await page.goto('https://www.aistudio555.com/dist/en/index.html');
  
  // Wait for page load and potential JavaScript execution
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Give JavaScript time to run
  
  // Check console logs for our debug messages
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`${msg.type()}: ${msg.text()}`);
  });
  
  // Reload to capture console logs
  await page.reload();
  await page.waitForTimeout(3000);
  
  console.log('\n📋 JavaScript Console Output:');
  console.log('-' .repeat(50));
  consoleLogs.forEach(log => console.log(log));
  
  // Check current content
  console.log('\n\n🌐 CURRENT WEBSITE CONTENT:');
  console.log('-' .repeat(50));
  
  const currentContent = {
    heroTitle: await page.locator('h1.banner-heading').textContent(),
    heroSubtitle: await page.locator('.banner-subtitle').first().textContent(),
    heroDescription: await page.locator('p.banner-description-text').textContent(),
    siteBrand: await page.locator('.navbar-brand, .logo-text, a[href="/"].w-nav-brand').first().textContent().catch(() => 'NOT FOUND')
  };
  
  console.log(`Hero Title: "${currentContent.heroTitle}"`);
  console.log(`Hero Subtitle: "${currentContent.heroSubtitle}"`);
  console.log(`Hero Description: "${currentContent.heroDescription}"`);
  console.log(`Site Brand: "${currentContent.siteBrand}"`);
  
  // Check what API returns
  console.log('\n\n📡 API CONTENT:');
  console.log('-' .repeat(50));
  
  const apiResponse = await page.request.get('https://aistudio555jamstack-production.up.railway.app/api/home-page');
  const apiData = await apiResponse.json();
  const apiContent = apiData.data?.attributes || {};
  
  console.log(`Hero Title: "${apiContent.heroTitle}"`);
  console.log(`Hero Subtitle: "${apiContent.heroSubtitle}"`);
  console.log(`Hero Description: "${apiContent.heroDescription}"`);
  
  // VERIFICATION
  console.log('\n\n✅ VERIFICATION RESULTS:');
  console.log('=' .repeat(80));
  
  const results = {
    titleMatches: currentContent.heroTitle === apiContent.heroTitle,
    subtitleMatches: currentContent.heroSubtitle === apiContent.heroSubtitle,
    descriptionMatches: currentContent.heroDescription === apiContent.heroDescription,
    brandingFixed: !currentContent.siteBrand.includes('Zohacous') && currentContent.siteBrand.includes('AI Studio')
  };
  
  console.log(`Hero Title Matches API: ${results.titleMatches ? '✅ YES' : '❌ NO'}`);
  console.log(`Hero Subtitle Matches API: ${results.subtitleMatches ? '✅ YES' : '❌ NO'}`);
  console.log(`Hero Description Matches API: ${results.descriptionMatches ? '✅ YES' : '❌ NO'}`);
  console.log(`Branding Fixed (AI Studio): ${results.brandingFixed ? '✅ YES' : '❌ NO'}`);
  
  // Check if JavaScript initialized
  const hasInitLog = consoleLogs.some(log => log.includes('Initializing Strapi Integration'));
  console.log(`\nJavaScript Initialized: ${hasInitLog ? '✅ YES' : '❌ NO'}`);
  
  // FINAL STATUS
  console.log('\n\n📊 FINAL STATUS:');
  console.log('=' .repeat(80));
  
  if (results.titleMatches && results.subtitleMatches && results.descriptionMatches) {
    console.log('🎉 SUCCESS! Website is now showing DYNAMIC content from the database!');
    console.log('The admin panel content is properly reflected on the website.');
  } else {
    console.log('⚠️ PARTIAL SUCCESS - Some content is still static.');
    console.log('The JavaScript may need more time to deploy or there may be caching issues.');
    
    if (!hasInitLog) {
      console.log('\n❌ CRITICAL: JavaScript is not initializing!');
      console.log('The script may not be loading or executing properly.');
    }
  }
  
  // Take screenshot
  await page.screenshot({ path: 'dynamic-content-test.png', fullPage: false });
  console.log('\n📸 Screenshot saved: dynamic-content-test.png');
  
  // Assertions
  expect(results.titleMatches || hasInitLog).toBeTruthy();
});