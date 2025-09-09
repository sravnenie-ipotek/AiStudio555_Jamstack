const { chromium } = require('playwright');

async function testNavigation() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🚀 Testing Navigation Menu...');
    
    // Test main pages
    const pages = [
      { url: 'http://localhost:9090/dist/en/index.html', name: 'Home' },
      { url: 'http://localhost:9090/dist/en/courses.html', name: 'Courses' }, 
      { url: 'http://localhost:9090/dist/en/teachers.html', name: 'Teachers' },
      { url: 'http://localhost:9090/dist/en/career-orientation.html', name: 'Career Orientation' },
      { url: 'http://localhost:9090/dist/en/career-center.html', name: 'Career Center' },
      { url: 'http://localhost:9090/pricing.html', name: 'Pricing' }
    ];
    
    for (const testPage of pages) {
      console.log(`\n📄 Testing ${testPage.name}...`);
      
      try {
        await page.goto(testPage.url, { waitUntil: 'networkidle' });
        console.log(`   ✅ ${testPage.name} loaded successfully`);
        
        // Check if navigation menu exists
        const navMenu = await page.$('.nav-menu');
        if (navMenu) {
          console.log(`   ✅ Navigation menu found on ${testPage.name}`);
          
          // Check for Career Services dropdown
          const dropdown = await page.$('.menu-dropdown-wrapper');
          if (dropdown) {
            console.log(`   ✅ Career Services dropdown found on ${testPage.name}`);
            
            // Hover over Career Services to test dropdown
            await dropdown.hover();
            await page.waitForTimeout(500);
            
            const dropdownList = await page.$('.dropdown-list');
            if (dropdownList) {
              const isVisible = await dropdownList.isVisible();
              console.log(`   ${isVisible ? '✅' : '❌'} Dropdown ${isVisible ? 'shows' : 'hidden'} on hover`);
            }
            
            // Test dropdown links
            const careerOrientation = await page.$('a[href="career-orientation.html"]');
            const careerCenter = await page.$('a[href="career-center.html"]');
            
            if (careerOrientation) console.log(`   ✅ Career Orientation link found`);
            if (careerCenter) console.log(`   ✅ Career Center link found`);
          } else {
            console.log(`   ❌ Career Services dropdown missing on ${testPage.name}`);
          }
          
          // Check Sign Up button
          const signUpBtn = await page.$('.primary-button');
          if (signUpBtn) {
            const bgColor = await signUpBtn.evaluate(el => getComputedStyle(el).backgroundColor);
            console.log(`   ✅ Sign Up button found - Color: ${bgColor}`);
          }
          
        } else {
          console.log(`   ❌ Navigation menu missing on ${testPage.name}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Failed to load ${testPage.name}: ${error.message}`);
      }
    }
    
    // Test dropdown navigation
    console.log(`\n🔗 Testing Dropdown Navigation...`);
    await page.goto('http://localhost:9090/dist/en/index.html');
    
    // Hover and click Career Services dropdown
    const dropdown = await page.$('.menu-dropdown-wrapper');
    if (dropdown) {
      await dropdown.hover();
      await page.waitForTimeout(500);
      
      // Try clicking Career Orientation
      const careerOrientationLink = await page.$('a[href="career-orientation.html"]');
      if (careerOrientationLink) {
        await careerOrientationLink.click();
        await page.waitForTimeout(1000);
        
        const currentUrl = page.url();
        if (currentUrl.includes('career-orientation.html')) {
          console.log(`   ✅ Successfully navigated to Career Orientation`);
        } else {
          console.log(`   ❌ Failed to navigate to Career Orientation`);
        }
      }
    }
    
    console.log(`\n🎉 Navigation testing complete!`);
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testNavigation();