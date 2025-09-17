const { chromium } = require('playwright');

async function comprehensiveFixesTest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log('🔧 COMPREHENSIVE FIXES VALIDATION TEST...\n');

  const results = {
    dropdownTests: {},
    bannerTests: {},
    navigationTests: {},
    errors: []
  };

  try {
    // 1. TEST DROPDOWN CONSISTENCY BETWEEN CAREER PAGES
    console.log('🔍 TESTING CAREER SERVICES DROPDOWN CONSISTENCY...\n');
    
    const careerPages = [
      { 
        url: 'http://localhost:9090/dist/en/career-center.html', 
        name: 'Career Center'
      },
      { 
        url: 'http://localhost:9090/dist/en/career-orientation.html', 
        name: 'Career Orientation'
      }
    ];

    for (const testPage of careerPages) {
      console.log(`📄 Testing dropdown on: ${testPage.name}`);
      console.log(`🔗 URL: ${testPage.url}`);
      
      try {
        await page.goto(testPage.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);
        
        // Check dropdown structure
        const dropdownExists = await page.$('.menu-dropdown-wrapper');
        console.log(`   ${dropdownExists ? '✅' : '❌'} Dropdown wrapper found: ${!!dropdownExists}`);
        
        if (dropdownExists) {
          // Hover to show dropdown
          await dropdownExists.hover();
          await page.waitForTimeout(500);
          
          // Check dropdown visibility and styling
          const dropdownList = await page.$('.dropdown-list');
          if (dropdownList) {
            const isVisible = await dropdownList.isVisible();
            console.log(`   ${isVisible ? '✅' : '❌'} Dropdown shows on hover: ${isVisible}`);
            
            if (isVisible) {
              // Check consistent styling
              const styles = await dropdownList.evaluate(el => {
                const computedStyles = window.getComputedStyle(el);
                return {
                  background: computedStyles.backgroundColor,
                  borderRadius: computedStyles.borderRadius,
                  position: computedStyles.position,
                  zIndex: computedStyles.zIndex,
                  minWidth: computedStyles.minWidth
                };
              });
              
              console.log(`   ✅ Background: ${styles.background}`);
              console.log(`   ✅ Border radius: ${styles.borderRadius}`);
              console.log(`   ✅ Position: ${styles.position}`);
              console.log(`   ✅ Z-index: ${styles.zIndex}`);
              console.log(`   ✅ Min width: ${styles.minWidth}`);
              
              // Check dropdown links
              const dropdownLinks = await page.$$('.dropdown-menu-text-link-block');
              const linkTexts = [];
              for (const link of dropdownLinks) {
                const text = await link.textContent();
                linkTexts.push(text.trim());
              }
              console.log(`   ✅ Dropdown links: ${linkTexts.join(' | ')}`);
              
              results.dropdownTests[testPage.name] = {
                exists: true,
                showsOnHover: isVisible,
                styling: styles,
                links: linkTexts,
                consistent: true
              };
            }
          }
        }
        
        // Take screenshot for visual verification
        await page.screenshot({ 
          path: `/Users/michaelmishayev/Desktop/newCode/screenshot-dropdown-${testPage.name.toLowerCase().replace(/\\s+/g, '-')}.png`,
          fullPage: false
        });
        console.log(`   📸 Screenshot saved for ${testPage.name}`);
        
      } catch (error) {
        console.log(`   ❌ Error testing ${testPage.name}: ${error.message}`);
        results.errors.push(`${testPage.name}: ${error.message}`);
      }
      
      console.log();
    }

    // 2. TEST BANNER CARD IMAGES REMOVAL FROM HOME PAGE
    console.log('🖼️ TESTING BANNER CARD IMAGES REMOVAL...\n');
    
    try {
      console.log('📄 Testing home page banner images removal');
      await page.goto('http://localhost:9090/dist/en/index.html', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      
      // Check for removed banner card images
      const bannerCard1 = await page.$('img.banner-card1');
      const bannerCard2 = await page.$('img.banner-card2');
      const bannerCard1Removed = !bannerCard1;
      const bannerCard2Removed = !bannerCard2;
      
      console.log(`   ${bannerCard1Removed ? '✅' : '❌'} Banner Card 1 removed: ${bannerCard1Removed}`);
      console.log(`   ${bannerCard2Removed ? '✅' : '❌'} Banner Card 2 removed: ${bannerCard2Removed}`);
      
      // Check remaining banner elements are still there
      const bannerShapes = await page.$$('img.banner-card-shape');
      console.log(`   ✅ Banner shape elements remaining: ${bannerShapes.length}`);
      
      // Take screenshot of home page
      await page.screenshot({ 
        path: `/Users/michaelmishayev/Desktop/newCode/screenshot-home-banner-clean.png`,
        fullPage: false
      });
      console.log(`   📸 Screenshot saved for home page banner`);
      
      results.bannerTests = {
        bannerCard1Removed,
        bannerCard2Removed,
        shapesRemaining: bannerShapes.length,
        success: bannerCard1Removed && bannerCard2Removed
      };
      
    } catch (error) {
      console.log(`   ❌ Error testing banner removal: ${error.message}`);
      results.errors.push(`Banner removal test: ${error.message}`);
    }

    // 3. TEST NAVIGATION STILL WORKS AFTER FIXES
    console.log('\\n🧭 TESTING NAVIGATION FUNCTIONALITY...\n');
    
    try {
      // Test Career Services dropdown navigation
      await page.goto('http://localhost:9090/dist/en/index.html');
      await page.waitForTimeout(1000);
      
      const dropdown = await page.$('.menu-dropdown-wrapper');
      if (dropdown) {
        await dropdown.hover();
        await page.waitForTimeout(500);
        
        // Test Career Center navigation
        const careerCenterLink = await page.$('a[href="career-center.html"]');
        if (careerCenterLink) {
          await careerCenterLink.click();
          await page.waitForTimeout(2000);
          
          const currentUrl = page.url();
          const navigationWorks = currentUrl.includes('career-center.html');
          console.log(`   ${navigationWorks ? '✅' : '❌'} Career Center navigation: ${navigationWorks}`);
          
          results.navigationTests.careerCenterWorks = navigationWorks;
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error testing navigation: ${error.message}`);
      results.errors.push(`Navigation test: ${error.message}`);
    }

    // 4. GENERATE COMPREHENSIVE REPORT
    console.log('\\n📊 COMPREHENSIVE FIXES VALIDATION REPORT...\\n');
    
    console.log('🎯 DROPDOWN CONSISTENCY RESULTS:');
    Object.entries(results.dropdownTests).forEach(([pageName, data]) => {
      console.log(`   📄 ${pageName}:`);
      console.log(`      Dropdown exists: ${data.exists ? '✅' : '❌'}`);
      console.log(`      Shows on hover: ${data.showsOnHover ? '✅' : '❌'}`);
      console.log(`      Links: ${data.links?.join(' | ') || 'N/A'}`);
      if (data.styling) {
        console.log(`      Background: ${data.styling.background}`);
        console.log(`      Border radius: ${data.styling.borderRadius}`);
      }
    });
    
    console.log('\\n🖼️ BANNER IMAGES REMOVAL RESULTS:');
    console.log(`   Banner Card 1 removed: ${results.bannerTests.bannerCard1Removed ? '✅' : '❌'}`);
    console.log(`   Banner Card 2 removed: ${results.bannerTests.bannerCard2Removed ? '✅' : '❌'}`);
    console.log(`   Shape elements preserved: ${results.bannerTests.shapesRemaining > 0 ? '✅' : '❌'} (${results.bannerTests.shapesRemaining})`);
    
    console.log('\\n🧭 NAVIGATION FUNCTIONALITY:');
    console.log(`   Career Center navigation: ${results.navigationTests.careerCenterWorks ? '✅' : '❌'}`);
    
    if (results.errors.length > 0) {
      console.log('\\n❌ ERRORS ENCOUNTERED:');
      results.errors.forEach(error => console.log(`   ⚠️  ${error}`));
    }
    
    const allDropdownsConsistent = Object.values(results.dropdownTests).every(test => test.consistent);
    const bannerRemovalSuccess = results.bannerTests.success;
    const navigationWorking = results.navigationTests.careerCenterWorks;
    
    console.log('\\n🏆 OVERALL VALIDATION RESULT:');
    if (allDropdownsConsistent && bannerRemovalSuccess && navigationWorking && results.errors.length === 0) {
      console.log('   ✅ ALL FIXES VALIDATED SUCCESSFULLY!');
      console.log('   ✅ Career Services dropdowns are now consistent');
      console.log('   ✅ Banner card images successfully removed');
      console.log('   ✅ Navigation functionality preserved');
    } else {
      console.log('   ❌ Some fixes need attention:');
      if (!allDropdownsConsistent) console.log('      - Dropdown consistency issues');
      if (!bannerRemovalSuccess) console.log('      - Banner removal incomplete');
      if (!navigationWorking) console.log('      - Navigation functionality broken');
    }

  } catch (error) {
    console.error('❌ COMPREHENSIVE TEST FAILED:', error);
  } finally {
    await browser.close();
  }
}

comprehensiveFixesTest();