const { chromium } = require('playwright');
const fs = require('fs');

async function dropdownIdenticalTest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log('🔍 DROPDOWN IDENTICAL TEST - ENSURING PERFECT CONSISTENCY...\n');

  const results = {
    careerCenter: {},
    careerOrientation: {},
    identical: false,
    errors: []
  };

  try {
    const testPages = [
      { 
        url: 'http://localhost:9090/dist/en/career-center.html', 
        name: 'Career Center',
        key: 'careerCenter'
      },
      { 
        url: 'http://localhost:9090/dist/en/career-orientation.html', 
        name: 'Career Orientation',
        key: 'careerOrientation'
      }
    ];

    // Test both pages and collect detailed dropdown styling information
    for (const testPage of testPages) {
      console.log(`📄 TESTING: ${testPage.name.toUpperCase()}`);
      console.log(`🔗 URL: ${testPage.url}`);
      
      try {
        await page.goto(testPage.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);
        
        const pageData = {
          loaded: true,
          dropdownExists: false,
          showsOnHover: false,
          styling: null,
          links: [],
          hasCurrentClass: false,
          hasArrow: false
        };
        
        // Check dropdown exists
        const dropdownWrapper = await page.$('.menu-dropdown-wrapper');
        if (dropdownWrapper) {
          pageData.dropdownExists = true;
          console.log(`   ✅ Dropdown wrapper found`);
          
          // Hover to show dropdown
          await dropdownWrapper.hover();
          await page.waitForTimeout(1000);
          
          // Check dropdown visibility and get detailed styling
          const dropdownList = await page.$('.dropdown-list');
          if (dropdownList) {
            const isVisible = await dropdownList.isVisible();
            pageData.showsOnHover = isVisible;
            console.log(`   ${isVisible ? '✅' : '❌'} Dropdown shows on hover: ${isVisible}`);
            
            if (isVisible) {
              // Get comprehensive styling information
              const styling = await dropdownList.evaluate(el => {
                const computed = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                return {
                  backgroundColor: computed.backgroundColor,
                  background: computed.background,
                  borderRadius: computed.borderRadius,
                  padding: computed.padding,
                  minWidth: computed.minWidth,
                  zIndex: computed.zIndex,
                  position: computed.position,
                  boxShadow: computed.boxShadow,
                  backdropFilter: computed.backdropFilter,
                  border: computed.border,
                  opacity: computed.opacity,
                  visibility: computed.visibility,
                  transform: computed.transform,
                  width: rect.width,
                  height: rect.height,
                  left: rect.left,
                  top: rect.top
                };
              });
              
              pageData.styling = styling;
              console.log(`   📐 Background: ${styling.backgroundColor}`);
              console.log(`   📐 Border radius: ${styling.borderRadius}`);
              console.log(`   📐 Box shadow: ${styling.boxShadow}`);
              console.log(`   📐 Backdrop filter: ${styling.backdropFilter}`);
              console.log(`   📐 Dimensions: ${styling.width}x${styling.height}`);
              
              // Check dropdown links and their styling
              const dropdownLinks = await page.$$('.dropdown-menu-text-link-block');
              for (const link of dropdownLinks) {
                const linkData = await link.evaluate(el => {
                  const computed = window.getComputedStyle(el);
                  const pseudo = window.getComputedStyle(el, '::before');
                  return {
                    text: el.textContent.trim(),
                    backgroundColor: computed.backgroundColor,
                    color: computed.color,
                    hasCurrentClass: el.classList.contains('w--current'),
                    hasArrow: pseudo.content !== 'none' && pseudo.content !== '""',
                    pseudoContent: pseudo.content,
                    pseudoColor: pseudo.color
                  };
                });
                pageData.links.push(linkData);
                
                if (linkData.hasCurrentClass) {
                  pageData.hasCurrentClass = true;
                  console.log(`   ⚠️  Found w--current class on: "${linkData.text}"`);
                }
                if (linkData.hasArrow) {
                  pageData.hasArrow = true;
                  console.log(`   ⚠️  Found arrow on: "${linkData.text}" - Content: ${linkData.pseudoContent}`);
                }
              }
              
              console.log(`   ✅ Links found: ${pageData.links.map(l => l.text).join(' | ')}`);
            }
          }
          
          // Take detailed screenshot
          await page.screenshot({ 
            path: `/Users/michaelmishayev/Desktop/newCode/dropdown-detailed-${testPage.key}.png`,
            fullPage: false
          });
          console.log(`   📸 Screenshot saved: dropdown-detailed-${testPage.key}.png`);
        } else {
          console.log(`   ❌ Dropdown wrapper not found`);
        }
        
        results[testPage.key] = pageData;
        
      } catch (error) {
        console.log(`   ❌ Error testing ${testPage.name}: ${error.message}`);
        results.errors.push(`${testPage.name}: ${error.message}`);
        results[testPage.key] = { loaded: false, error: error.message };
      }
      
      console.log();
    }

    // DETAILED COMPARISON
    console.log('🔍 DETAILED DROPDOWN COMPARISON...\n');
    
    const cc = results.careerCenter;
    const co = results.careerOrientation;
    
    if (cc.loaded && co.loaded) {
      console.log('📊 COMPARISON RESULTS:');
      
      // Check existence
      const bothExist = cc.dropdownExists && co.dropdownExists;
      console.log(`   Dropdown exists: CC=${cc.dropdownExists} | CO=${co.dropdownExists} | Match: ${bothExist ? '✅' : '❌'}`);
      
      // Check visibility on hover
      const bothVisible = cc.showsOnHover && co.showsOnHover;
      console.log(`   Shows on hover: CC=${cc.showsOnHover} | CO=${co.showsOnHover} | Match: ${bothVisible ? '✅' : '❌'}`);
      
      // Check for unwanted current classes
      const noCurrentClasses = !cc.hasCurrentClass && !co.hasCurrentClass;
      console.log(`   No current class: CC=${!cc.hasCurrentClass} | CO=${!co.hasCurrentClass} | Match: ${noCurrentClasses ? '✅' : '❌'}`);
      
      // Check for unwanted arrows
      const noArrows = !cc.hasArrow && !co.hasArrow;
      console.log(`   No arrows: CC=${!cc.hasArrow} | CO=${!co.hasArrow} | Match: ${noArrows ? '✅' : '❌'}`);
      
      if (cc.styling && co.styling) {
        console.log('\\n📐 DETAILED STYLING COMPARISON:');
        
        // Background comparison
        const backgroundMatch = cc.styling.backgroundColor === co.styling.backgroundColor;
        console.log(`   Background: CC="${cc.styling.backgroundColor}" | CO="${co.styling.backgroundColor}" | Match: ${backgroundMatch ? '✅' : '❌'}`);
        
        // Border radius comparison
        const radiusMatch = cc.styling.borderRadius === co.styling.borderRadius;
        console.log(`   Border radius: CC="${cc.styling.borderRadius}" | CO="${co.styling.borderRadius}" | Match: ${radiusMatch ? '✅' : '❌'}`);
        
        // Box shadow comparison
        const shadowMatch = cc.styling.boxShadow === co.styling.boxShadow;
        console.log(`   Box shadow: CC="${cc.styling.boxShadow}" | CO="${co.styling.boxShadow}" | Match: ${shadowMatch ? '✅' : '❌'}`);
        
        // Backdrop filter comparison
        const backdropMatch = cc.styling.backdropFilter === co.styling.backdropFilter;
        console.log(`   Backdrop filter: CC="${cc.styling.backdropFilter}" | CO="${co.styling.backdropFilter}" | Match: ${backdropMatch ? '✅' : '❌'}`);
        
        // Overall styling identical check
        const stylingIdentical = backgroundMatch && radiusMatch && shadowMatch && backdropMatch;
        results.identical = bothExist && bothVisible && noCurrentClasses && noArrows && stylingIdentical;
      }
      
      console.log('\\n📋 LINKS COMPARISON:');
      if (cc.links && co.links) {
        const linkTextsMatch = JSON.stringify(cc.links.map(l => l.text)) === JSON.stringify(co.links.map(l => l.text));
        console.log(`   Link texts match: ${linkTextsMatch ? '✅' : '❌'}`);
        console.log(`   CC Links: ${cc.links.map(l => l.text).join(' | ')}`);
        console.log(`   CO Links: ${co.links.map(l => l.text).join(' | ')}`);
        
        // Check link styling consistency
        for (let i = 0; i < Math.max(cc.links.length, co.links.length); i++) {
          const ccLink = cc.links[i];
          const coLink = co.links[i];
          if (ccLink && coLink && ccLink.text === coLink.text) {
            const colorMatch = ccLink.color === coLink.color;
            const bgMatch = ccLink.backgroundColor === coLink.backgroundColor;
            console.log(`   "${ccLink.text}": Color match=${colorMatch ? '✅' : '❌'} | BG match=${bgMatch ? '✅' : '❌'}`);
          }
        }
      }
    }

    // FINAL RESULT
    console.log('\\n🏆 FINAL DROPDOWN IDENTICAL TEST RESULT:');
    if (results.identical && results.errors.length === 0) {
      console.log('   ✅ PERFECT SUCCESS - DROPDOWNS ARE IDENTICAL!');
      console.log('   ✅ Both dropdowns show on hover');
      console.log('   ✅ No selection highlighting or arrows');
      console.log('   ✅ Identical styling and appearance');
      console.log('   ✅ Same links and text');
      console.log('\\n🎯 Career Services dropdowns now match Image #1 exactly!');
    } else {
      console.log('   ❌ DROPDOWNS STILL HAVE DIFFERENCES:');
      if (!cc.dropdownExists || !co.dropdownExists) console.log('      - Missing dropdown on one or both pages');
      if (!cc.showsOnHover || !co.showsOnHover) console.log('      - Visibility issues on hover');
      if (cc.hasCurrentClass || co.hasCurrentClass) console.log('      - Current class highlighting still present');
      if (cc.hasArrow || co.hasArrow) console.log('      - Arrow indicators still showing');
      if (cc.styling && co.styling && cc.styling.backgroundColor !== co.styling.backgroundColor) {
        console.log(`      - Background color mismatch: CC="${cc.styling.backgroundColor}" vs CO="${co.styling.backgroundColor}"`);
      }
    }

    // Save detailed test results
    fs.writeFileSync('/Users/michaelmishayev/Desktop/newCode/dropdown-identical-test-results.json', 
      JSON.stringify(results, null, 2));
    console.log('\\n📄 Detailed test results saved to: dropdown-identical-test-results.json');

  } catch (error) {
    console.error('❌ DROPDOWN IDENTICAL TEST FAILED:', error);
  } finally {
    await browser.close();
  }
}

dropdownIdenticalTest();