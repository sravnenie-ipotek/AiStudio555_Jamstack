const { chromium } = require('playwright');
const fs = require('fs');

async function comprehensiveNavigationTest() {
  const browser = await chromium.launch({ headless: false }); // Run with UI for verification
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  const results = {
    pages: {},
    navigation: {},
    styling: {},
    errors: []
  };

  try {
    console.log('🚀 COMPREHENSIVE NAVIGATION TEST STARTING...\n');
    
    // Define all pages to test
    const testPages = [
      { 
        url: 'http://localhost:9090/dist/en/index.html', 
        name: 'Home',
        expectedTitle: /Home|Zohacous/i,
        hasContent: '.banner-content'
      },
      { 
        url: 'http://localhost:9090/dist/en/courses.html', 
        name: 'Courses',
        expectedTitle: /Course|Catalog/i,
        hasContent: '.courses-main, .featured-courses'
      },
      { 
        url: 'http://localhost:9090/dist/en/teachers.html', 
        name: 'Teachers',
        expectedTitle: /Teacher|Instructor/i,
        hasContent: '.teachers-section, .hero-enhanced'
      },
      { 
        url: 'http://localhost:9090/dist/en/career-orientation.html', 
        name: 'Career Orientation',
        expectedTitle: /Career.*Orientation/i,
        hasContent: '.career-content, .hero-section'
      },
      { 
        url: 'http://localhost:9090/dist/en/career-center.html', 
        name: 'Career Center',
        expectedTitle: /Career.*Center/i,
        hasContent: '.career-content, .hero-section'
      },
      { 
        url: 'http://localhost:9090/pricing.html', 
        name: 'Pricing',
        expectedTitle: /Pricing/i,
        hasContent: '.pricing-section, .section'
      }
    ];

    // Test each page comprehensively
    for (let i = 0; i < testPages.length; i++) {
      const testPage = testPages[i];
      console.log(`\n📄 [${ i + 1 }/${ testPages.length }] TESTING: ${testPage.name.toUpperCase()}`);
      console.log(`🔗 URL: ${testPage.url}`);
      
      try {
        // Navigate to page
        console.log('   ⏳ Navigating...');
        await page.goto(testPage.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000); // Allow page to fully render
        
        const pageResult = {
          loaded: true,
          title: await page.title(),
          navigation: {},
          styling: {},
          dropdown: {},
          content: {},
          errors: []
        };

        console.log(`   ✅ Loaded: ${pageResult.title}`);

        // 1. CHECK NAVIGATION MENU STRUCTURE
        console.log('   🔍 Checking navigation structure...');
        
        const navMenu = await page.$('.nav-menu');
        if (navMenu) {
          pageResult.navigation.hasMenu = true;
          
          // Check menu centering
          const navStyles = await navMenu.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              display: styles.display,
              justifyContent: styles.justifyContent,
              alignItems: styles.alignItems,
              gap: styles.gap
            };
          });
          
          pageResult.styling.menuCentered = navStyles.justifyContent === 'center';
          pageResult.styling.menuFlex = navStyles.display === 'flex';
          pageResult.styling.menuGap = navStyles.gap;
          
          console.log(`      ✅ Menu centered: ${pageResult.styling.menuCentered}`);
          console.log(`      ✅ Menu flex: ${pageResult.styling.menuFlex}`);
          console.log(`      ✅ Menu gap: ${pageResult.styling.menuGap}`);
          
          // Check all menu links
          const menuLinks = await page.$$('.nav-link');
          pageResult.navigation.linkCount = menuLinks.length;
          
          const linkTexts = [];
          for (const link of menuLinks) {
            const text = await link.textContent();
            linkTexts.push(text.trim());
          }
          pageResult.navigation.links = linkTexts;
          console.log(`      ✅ Menu links: ${linkTexts.join(' | ')}`);

        } else {
          pageResult.navigation.hasMenu = false;
          pageResult.errors.push('Navigation menu not found');
          console.log(`      ❌ Navigation menu missing!`);
        }

        // 2. CHECK CAREER SERVICES DROPDOWN
        console.log('   🔍 Testing Career Services dropdown...');
        
        const dropdown = await page.$('.menu-dropdown-wrapper');
        if (dropdown) {
          pageResult.dropdown.hasDropdown = true;
          
          // Check dropdown toggle text
          const dropdownText = await page.$eval('.dropdown-toggle-text-block', el => el.textContent);
          pageResult.dropdown.text = dropdownText;
          console.log(`      ✅ Dropdown text: "${dropdownText}"`);
          
          // Hover to show dropdown
          await dropdown.hover();
          await page.waitForTimeout(500);
          
          // Check if dropdown becomes visible
          const dropdownList = await page.$('.dropdown-list');
          if (dropdownList) {
            const isVisible = await dropdownList.isVisible();
            pageResult.dropdown.showsOnHover = isVisible;
            
            if (isVisible) {
              // Check dropdown styling
              const dropdownStyles = await dropdownList.evaluate(el => {
                const styles = window.getComputedStyle(el);
                return {
                  background: styles.backgroundColor,
                  borderRadius: styles.borderRadius,
                  boxShadow: styles.boxShadow,
                  zIndex: styles.zIndex
                };
              });
              
              pageResult.dropdown.styling = dropdownStyles;
              console.log(`      ✅ Dropdown visible on hover`);
              console.log(`      ✅ Background: ${dropdownStyles.background}`);
              console.log(`      ✅ Border radius: ${dropdownStyles.borderRadius}`);
              
              // Check dropdown links
              const dropdownLinks = await page.$$('.dropdown-menu-text-link-block');
              const dropdownLinkTexts = [];
              for (const link of dropdownLinks) {
                const text = await link.textContent();
                dropdownLinkTexts.push(text.trim());
              }
              pageResult.dropdown.links = dropdownLinkTexts;
              console.log(`      ✅ Dropdown links: ${dropdownLinkTexts.join(' | ')}`);
              
            } else {
              pageResult.dropdown.showsOnHover = false;
              pageResult.errors.push('Dropdown does not show on hover');
              console.log(`      ❌ Dropdown not visible on hover`);
            }
          }
          
        } else {
          pageResult.dropdown.hasDropdown = false;
          pageResult.errors.push('Career Services dropdown not found');
          console.log(`      ❌ Career Services dropdown missing!`);
        }

        // 3. CHECK SIGN UP BUTTON STYLING
        console.log('   🔍 Checking Sign Up button...');
        
        const signUpBtn = await page.$('.primary-button');
        if (signUpBtn) {
          const buttonStyles = await signUpBtn.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              borderRadius: styles.borderRadius,
              padding: styles.padding,
              display: styles.display
            };
          });
          
          pageResult.styling.signUpButton = buttonStyles;
          console.log(`      ✅ Sign Up button found`);
          console.log(`      ✅ Background: ${buttonStyles.backgroundColor}`);
          console.log(`      ✅ Border radius: ${buttonStyles.borderRadius}`);
          
          // Check if it's blue-ish (rgb values)
          const isBlue = buttonStyles.backgroundColor.includes('123, 255') || 
                        buttonStyles.backgroundColor.includes('0, 123, 255') ||
                        buttonStyles.backgroundColor === 'rgb(0, 123, 255)';
          pageResult.styling.signUpIsBlue = isBlue;
          
        } else {
          pageResult.styling.hasSignUpButton = false;
          pageResult.errors.push('Sign Up button not found');
          console.log(`      ❌ Sign Up button missing!`);
        }

        // 4. CHECK PAGE CONTENT VISIBILITY
        console.log('   🔍 Checking content visibility...');
        
        if (testPage.hasContent) {
          const contentEl = await page.$(testPage.hasContent);
          if (contentEl) {
            const isContentVisible = await contentEl.isVisible();
            pageResult.content.visible = isContentVisible;
            console.log(`      ✅ Main content visible: ${isContentVisible}`);
          } else {
            pageResult.content.visible = false;
            console.log(`      ⚠️  Main content selector not found: ${testPage.hasContent}`);
          }
        }

        // 5. TAKE SCREENSHOT
        console.log('   📸 Taking screenshot...');
        await page.screenshot({ 
          path: `/Users/michaelmishayev/Desktop/newCode/screenshot-${testPage.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          fullPage: false
        });

        results.pages[testPage.name] = pageResult;
        console.log(`   ✅ ${testPage.name} testing complete\n`);

      } catch (error) {
        results.pages[testPage.name] = {
          loaded: false,
          error: error.message,
          errors: [error.message]
        };
        console.log(`   ❌ Failed to test ${testPage.name}: ${error.message}\n`);
        results.errors.push(`${testPage.name}: ${error.message}`);
      }
    }

    // 6. TEST DROPDOWN NAVIGATION BETWEEN PAGES
    console.log('🔗 TESTING DROPDOWN NAVIGATION...\n');
    
    try {
      await page.goto('http://localhost:9090/dist/en/index.html');
      await page.waitForTimeout(1000);
      
      // Test Career Orientation navigation
      console.log('   🎯 Testing Career Orientation navigation...');
      const dropdown = await page.$('.menu-dropdown-wrapper');
      if (dropdown) {
        await dropdown.hover();
        await page.waitForTimeout(500);
        
        const careerOrientationLink = await page.$('a[href="career-orientation.html"]');
        if (careerOrientationLink) {
          await careerOrientationLink.click();
          await page.waitForTimeout(2000);
          
          const currentUrl = page.url();
          const navigationSuccess = currentUrl.includes('career-orientation.html');
          results.navigation.careerOrientationWorks = navigationSuccess;
          console.log(`      ✅ Career Orientation navigation: ${navigationSuccess}`);
          
          if (navigationSuccess) {
            // Check that menu is still there and identical
            const hasMenuAfterNav = await page.$('.nav-menu');
            const hasDropdownAfterNav = await page.$('.menu-dropdown-wrapper');
            results.navigation.menuPersistsAfterNav = !!hasMenuAfterNav;
            results.navigation.dropdownPersistsAfterNav = !!hasDropdownAfterNav;
            console.log(`      ✅ Menu persists after navigation: ${!!hasMenuAfterNav}`);
            console.log(`      ✅ Dropdown persists after navigation: ${!!hasDropdownAfterNav}`);
          }
        }
      }
      
      // Test Career Center navigation
      console.log('   🎯 Testing Career Center navigation...');
      await page.goto('http://localhost:9090/dist/en/index.html');
      await page.waitForTimeout(1000);
      
      const dropdown2 = await page.$('.menu-dropdown-wrapper');
      if (dropdown2) {
        await dropdown2.hover();
        await page.waitForTimeout(500);
        
        const careerCenterLink = await page.$('a[href="career-center.html"]');
        if (careerCenterLink) {
          await careerCenterLink.click();
          await page.waitForTimeout(2000);
          
          const currentUrl = page.url();
          const navigationSuccess = currentUrl.includes('career-center.html');
          results.navigation.careerCenterWorks = navigationSuccess;
          console.log(`      ✅ Career Center navigation: ${navigationSuccess}`);
        }
      }
      
    } catch (error) {
      results.navigation.error = error.message;
      console.log(`   ❌ Navigation testing failed: ${error.message}`);
    }

    // 7. GENERATE COMPREHENSIVE REPORT
    console.log('\n📊 GENERATING COMPREHENSIVE REPORT...\n');
    
    let totalPages = Object.keys(results.pages).length;
    let successfulPages = Object.values(results.pages).filter(p => p.loaded && p.errors.length === 0).length;
    let pagesWithMenu = Object.values(results.pages).filter(p => p.navigation?.hasMenu).length;
    let pagesWithDropdown = Object.values(results.pages).filter(p => p.dropdown?.hasDropdown).length;
    let pagesWithCenteredMenu = Object.values(results.pages).filter(p => p.styling?.menuCentered).length;
    
    console.log('🎯 SUMMARY STATISTICS:');
    console.log(`   📄 Total pages tested: ${totalPages}`);
    console.log(`   ✅ Successfully loaded: ${successfulPages}/${totalPages}`);
    console.log(`   🧭 Pages with navigation menu: ${pagesWithMenu}/${totalPages}`);
    console.log(`   📋 Pages with dropdown menu: ${pagesWithDropdown}/${totalPages}`);
    console.log(`   🎨 Pages with centered menu: ${pagesWithCenteredMenu}/${totalPages}`);
    console.log(`   🔗 Career Orientation nav works: ${results.navigation.careerOrientationWorks}`);
    console.log(`   🔗 Career Center nav works: ${results.navigation.careerCenterWorks}`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ ERRORS FOUND:');
      results.errors.forEach(error => console.log(`   ⚠️  ${error}`));
    }

    console.log('\n📄 DETAILED PAGE RESULTS:');
    Object.entries(results.pages).forEach(([pageName, pageData]) => {
      console.log(`\n   📄 ${pageName.toUpperCase()}:`);
      console.log(`      Loading: ${pageData.loaded ? '✅' : '❌'}`);
      if (pageData.navigation) {
        console.log(`      Navigation Menu: ${pageData.navigation.hasMenu ? '✅' : '❌'}`);
        console.log(`      Menu Links: ${pageData.navigation.links?.join(' | ') || 'N/A'}`);
      }
      if (pageData.dropdown) {
        console.log(`      Dropdown: ${pageData.dropdown.hasDropdown ? '✅' : '❌'}`);
        console.log(`      Dropdown Shows: ${pageData.dropdown.showsOnHover ? '✅' : '❌'}`);
      }
      if (pageData.styling) {
        console.log(`      Menu Centered: ${pageData.styling.menuCentered ? '✅' : '❌'}`);
        console.log(`      Sign Up Button: ${pageData.styling.hasSignUpButton !== false ? '✅' : '❌'}`);
      }
      if (pageData.errors.length > 0) {
        console.log(`      Errors: ${pageData.errors.join(', ')}`);
      }
    });

    // Save detailed results to file
    fs.writeFileSync('/Users/michaelmishayev/Desktop/newCode/navigation-test-results.json', 
      JSON.stringify(results, null, 2));

    console.log('\n🎉 COMPREHENSIVE TESTING COMPLETE!');
    console.log('📄 Detailed results saved to: navigation-test-results.json');
    console.log('📸 Screenshots saved for each page');
    
    const overallSuccess = successfulPages === totalPages && 
                          pagesWithMenu === totalPages && 
                          pagesWithDropdown === totalPages &&
                          results.navigation.careerOrientationWorks &&
                          results.navigation.careerCenterWorks;
                          
    console.log(`\n🏆 OVERALL RESULT: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ ISSUES FOUND'}`);

  } catch (error) {
    console.error('❌ COMPREHENSIVE TEST FAILED:', error);
  } finally {
    await browser.close();
  }
}

comprehensiveNavigationTest();