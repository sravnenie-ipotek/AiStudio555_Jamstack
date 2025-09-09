const puppeteer = require('puppeteer');

async function testNuclearDropdownFix() {
  console.log('🚀 NUCLEAR DROPDOWN FIX VERIFICATION TEST');
  console.log('=========================================');
  console.log('Testing ultra-high specificity CSS overrides...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Test pages with Career Services dropdowns
  const testPages = [
    {
      url: 'http://localhost:9090/dist/en/career-center.html',
      name: 'Career Center',
      pageId: 'career-center-page'
    },
    {
      url: 'http://localhost:9090/dist/en/career-orientation.html', 
      name: 'Career Orientation',
      pageId: 'career-orientation-page'
    }
  ];
  
  const results = {};
  let allConsistent = true;
  
  console.log('🔬 ANALYZING DROPDOWN STYLING ON EACH PAGE:\n');
  
  for (const testPage of testPages) {
    try {
      console.log(`📄 TESTING: ${testPage.name}`);
      console.log(`🔗 URL: ${testPage.url}`);
      console.log(`🆔 Page ID: data-wf-page="${testPage.pageId}"\n`);
      
      await page.goto(testPage.url, { waitUntil: 'networkidle2', timeout: 10000 });
      
      // Comprehensive dropdown styling analysis
      const dropdownAnalysis = await page.evaluate(() => {
        const dropdown = document.querySelector('.menu-dropdown-wrapper .dropdown-toggle');
        
        if (!dropdown) {
          return { error: 'Dropdown toggle not found' };
        }
        
        const computedStyle = window.getComputedStyle(dropdown);
        const pseudoBeforeStyle = window.getComputedStyle(dropdown, '::before');
        const pseudoAfterStyle = window.getComputedStyle(dropdown, '::after');
        
        // Check for w--current class and its effects
        const hasCurrentClass = dropdown.classList.contains('w--current');
        
        // Get all relevant CSS properties
        const analysis = {
          // Basic properties
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color,
          border: computedStyle.border,
          borderColor: computedStyle.borderColor,
          borderRadius: computedStyle.borderRadius,
          padding: computedStyle.padding,
          margin: computedStyle.margin,
          
          // Box model
          boxShadow: computedStyle.boxShadow,
          opacity: computedStyle.opacity,
          transform: computedStyle.transform,
          filter: computedStyle.filter,
          
          // Typography
          fontFamily: computedStyle.fontFamily,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          lineHeight: computedStyle.lineHeight,
          
          // Layout
          display: computedStyle.display,
          alignItems: computedStyle.alignItems,
          gap: computedStyle.gap,
          position: computedStyle.position,
          
          // State
          hasCurrentClass: hasCurrentClass,
          classList: Array.from(dropdown.classList),
          
          // Pseudo-elements
          pseudoBefore: {
            display: pseudoBeforeStyle.display,
            content: pseudoBeforeStyle.content,
            background: pseudoBeforeStyle.background,
            border: pseudoBeforeStyle.border,
            boxShadow: pseudoBeforeStyle.boxShadow
          },
          
          pseudoAfter: {
            display: pseudoAfterStyle.display,
            content: pseudoAfterStyle.content,
            background: pseudoAfterStyle.background,
            border: pseudoAfterStyle.border,
            boxShadow: pseudoAfterStyle.boxShadow
          }
        };
        
        return analysis;
      });
      
      // Check CSS files loaded
      const cssFiles = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        return links.map(link => {
          const href = link.getAttribute('href');
          return href ? href.split('/').pop() : 'unknown';
        });
      });
      
      // Check page data attributes
      const pageAttributes = await page.evaluate(() => {
        const html = document.documentElement;
        return {
          'data-wf-page': html.getAttribute('data-wf-page'),
          'data-wf-site': html.getAttribute('data-wf-site')
        };
      });
      
      console.log(`   📊 STYLING ANALYSIS:`);
      console.log(`      Background: ${dropdownAnalysis.backgroundColor}`);
      console.log(`      Color: ${dropdownAnalysis.color}`);
      console.log(`      Border: ${dropdownAnalysis.border}`);
      console.log(`      Font: ${dropdownAnalysis.fontFamily}, ${dropdownAnalysis.fontSize}, ${dropdownAnalysis.fontWeight}`);
      console.log(`      Display: ${dropdownAnalysis.display}, align-items: ${dropdownAnalysis.alignItems}`);
      console.log(`      Has w--current class: ${dropdownAnalysis.hasCurrentClass}`);
      console.log(`      Classes: ${dropdownAnalysis.classList.join(', ')}`);
      console.log(`      Pseudo ::before display: ${dropdownAnalysis.pseudoBefore.display}`);
      console.log(`      Pseudo ::after display: ${dropdownAnalysis.pseudoAfter.display}`);
      
      console.log(`\n   🗂️  CSS FILES LOADED:`);
      cssFiles.forEach(file => console.log(`      - ${file}`));
      
      console.log(`\n   🏷️  PAGE ATTRIBUTES:`);
      console.log(`      data-wf-page: ${pageAttributes['data-wf-page']}`);
      console.log(`      data-wf-site: ${pageAttributes['data-wf-site']}`);
      
      // Store results for comparison
      results[testPage.name] = {
        url: testPage.url,
        pageId: testPage.pageId,
        styling: dropdownAnalysis,
        cssFiles: cssFiles,
        pageAttributes: pageAttributes
      };
      
      console.log('\n' + '─'.repeat(60) + '\n');
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}\n`);
      allConsistent = false;
    }
  }
  
  // Cross-page comparison
  console.log('🔍 CROSS-PAGE DROPDOWN CONSISTENCY ANALYSIS:');
  console.log('═'.repeat(50));
  
  const pageNames = Object.keys(results);
  if (pageNames.length >= 2) {
    const page1 = results[pageNames[0]];
    const page2 = results[pageNames[1]];
    
    // Compare critical styling properties
    const criticalProperties = [
      'backgroundColor', 'color', 'border', 'borderColor', 'borderRadius',
      'fontFamily', 'fontSize', 'fontWeight', 'display', 'alignItems',
      'padding', 'boxShadow', 'opacity', 'transform', 'filter'
    ];
    
    console.log('\n🎯 CRITICAL PROPERTY COMPARISON:');
    let identicalCount = 0;
    let totalProperties = criticalProperties.length;
    
    criticalProperties.forEach(prop => {
      const val1 = page1.styling[prop];
      const val2 = page2.styling[prop];
      const isIdentical = val1 === val2;
      
      if (isIdentical) {
        console.log(`   ✅ ${prop}: IDENTICAL (${val1})`);
        identicalCount++;
      } else {
        console.log(`   ❌ ${prop}: DIFFERENT`);
        console.log(`      ${pageNames[0]}: ${val1}`);
        console.log(`      ${pageNames[1]}: ${val2}`);
        allConsistent = false;
      }
    });
    
    // Check pseudo-elements
    console.log('\n🔍 PSEUDO-ELEMENT COMPARISON:');
    const pseudoElements = ['pseudoBefore', 'pseudoAfter'];
    
    pseudoElements.forEach(pseudo => {
      const elem1 = page1.styling[pseudo];
      const elem2 = page2.styling[pseudo];
      
      const displayMatch = elem1.display === elem2.display;
      const contentMatch = elem1.content === elem2.content;
      const backgroundMatch = elem1.background === elem2.background;
      
      console.log(`   ${pseudo}:`);
      console.log(`      Display: ${displayMatch ? '✅' : '❌'} (${elem1.display} vs ${elem2.display})`);
      console.log(`      Content: ${contentMatch ? '✅' : '❌'} (${elem1.content} vs ${elem2.content})`);
      console.log(`      Background: ${backgroundMatch ? '✅' : '❌'}`);
      
      if (!displayMatch || !contentMatch || !backgroundMatch) {
        allConsistent = false;
      }
    });
    
    // Check w--current class handling
    console.log('\n🎯 WEBFLOW CURRENT CLASS ANALYSIS:');
    const currentClass1 = page1.styling.hasCurrentClass;
    const currentClass2 = page2.styling.hasCurrentClass;
    
    console.log(`   ${pageNames[0]} has w--current: ${currentClass1 ? '❌ YES (should be NO)' : '✅ NO'}`);
    console.log(`   ${pageNames[1]} has w--current: ${currentClass2 ? '❌ YES (should be NO)' : '✅ NO'}`);
    
    if (currentClass1 || currentClass2) {
      console.log('   ⚠️  WARNING: w--current class detected - CSS override may need strengthening');
      allConsistent = false;
    }
    
    // Final consistency score
    const consistencyPercentage = Math.round((identicalCount / totalProperties) * 100);
    console.log(`\n📊 CONSISTENCY SCORE: ${consistencyPercentage}% (${identicalCount}/${totalProperties} properties identical)`);
  }
  
  // Final verdict
  console.log('\n' + '═'.repeat(50));
  console.log('🏆 NUCLEAR CSS FIX TEST RESULTS:');
  
  if (allConsistent) {
    console.log('✅ SUCCESS! CAREER SERVICES DROPDOWN IS NOW IDENTICAL ACROSS ALL PAGES!');
    console.log('✅ Nuclear CSS overrides are working perfectly');
    console.log('✅ All Webflow page-specific rules have been neutralized');
    console.log('✅ Dropdown styling is now STATIC and consistent');
  } else {
    console.log('❌ INCONSISTENCIES STILL DETECTED:');
    console.log('   - Some Webflow page-specific rules may still be active');
    console.log('   - CSS specificity may need to be increased further');
    console.log('   - Additional page identifiers may need targeting');
  }
  
  await browser.close();
  
  // Save detailed results
  const fs = require('fs');
  fs.writeFileSync('nuclear-dropdown-test-results.json', JSON.stringify(results, null, 2));
  console.log('\\n📄 Detailed test results saved to: nuclear-dropdown-test-results.json');
  
  return allConsistent;
}

// Run the test
testNuclearDropdownFix().then(success => {
  process.exit(success ? 0 : 1);
}).catch(console.error);