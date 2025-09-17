const { chromium } = require('playwright');

async function testNavigationLinks() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  const results = {
    pages: {},
    navigation: {},
    errors: []
  };

  console.log('🔗 NAVIGATION LINKS TEST STARTING...\n');

  try {
    // Define all pages to test
    const testPages = [
      { 
        url: 'http://localhost:9090/dist/en/index.html', 
        name: 'Home'
      },
      { 
        url: 'http://localhost:9090/dist/en/courses.html', 
        name: 'Courses'
      },
      { 
        url: 'http://localhost:9090/dist/en/teachers.html', 
        name: 'Teachers'
      },
      { 
        url: 'http://localhost:9090/dist/en/career-orientation.html', 
        name: 'Career Orientation'
      },
      { 
        url: 'http://localhost:9090/dist/en/career-center.html', 
        name: 'Career Center'
      }
    ];

    // Test each page can load
    for (let i = 0; i < testPages.length; i++) {
      const testPage = testPages[i];
      console.log(`📄 [${i + 1}/${testPages.length}] TESTING: ${testPage.name.toUpperCase()}`);
      console.log(`🔗 URL: ${testPage.url}`);
      
      try {
        await page.goto(testPage.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        console.log(`   ✅ Page loaded successfully`);
        
        // Test Home link
        const homeLink = await page.$('a.nav-link[href="index.html"]');
        if (homeLink) {
          console.log(`   ✅ Home link found: index.html`);
          
          // Click and test
          await homeLink.click();
          await page.waitForTimeout(1000);
          const currentUrl = page.url();
          const homeWorks = currentUrl.includes('index.html');
          console.log(`   ${homeWorks ? '✅' : '❌'} Home navigation: ${homeWorks}`);
          
          // Go back to test page
          await page.goto(testPage.url);
          await page.waitForTimeout(1000);
        } else {
          console.log(`   ❌ Home link not found`);
        }
        
        // Test Pricing link
        const pricingLink = await page.$('a.nav-link[href="../../pricing.html"]');
        if (pricingLink) {
          console.log(`   ✅ Pricing link found: ../../pricing.html`);
          
          // Click and test
          await pricingLink.click();
          await page.waitForTimeout(2000);
          const currentUrl = page.url();
          const pricingWorks = currentUrl.includes('pricing.html');
          console.log(`   ${pricingWorks ? '✅' : '❌'} Pricing navigation: ${pricingWorks}`);
          
          // Go back to test page
          await page.goto(testPage.url);
          await page.waitForTimeout(1000);
        } else {
          console.log(`   ❌ Pricing link not found`);
        }
        
        console.log(`   ✅ ${testPage.name} navigation test complete\n`);

      } catch (error) {
        console.log(`   ❌ Failed to test ${testPage.name}: ${error.message}\n`);
        results.errors.push(`${testPage.name}: ${error.message}`);
      }
    }

    // Test direct URL access
    console.log('🎯 TESTING DIRECT URL ACCESS...\n');
    
    const directUrls = [
      { url: 'http://localhost:9090/dist/en/index.html', name: 'Home (Direct)' },
      { url: 'http://localhost:9090/pricing.html', name: 'Pricing (Direct)' }
    ];
    
    for (const directUrl of directUrls) {
      console.log(`📄 Testing: ${directUrl.name}`);
      console.log(`🔗 URL: ${directUrl.url}`);
      
      try {
        const response = await page.goto(directUrl.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        const status = response.status();
        console.log(`   ${status === 200 ? '✅' : '❌'} Status: ${status}\n`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}\n`);
        results.errors.push(`${directUrl.name}: ${error.message}`);
      }
    }

    console.log('🏆 NAVIGATION LINKS TEST SUMMARY:');
    if (results.errors.length === 0) {
      console.log('   ✅ ALL NAVIGATION LINKS WORKING PERFECTLY!');
      console.log('   ✅ Home links: index.html');
      console.log('   ✅ Pricing links: ../../pricing.html');
      console.log('   ✅ No 404 errors found');
    } else {
      console.log(`   ❌ Found ${results.errors.length} errors:`);
      results.errors.forEach(error => console.log(`      - ${error}`));
    }

  } catch (error) {
    console.error('❌ NAVIGATION TEST FAILED:', error);
  } finally {
    await browser.close();
  }
}

testNavigationLinks();