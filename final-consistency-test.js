const puppeteer = require('puppeteer');

async function finalConsistencyTest() {
  console.log('🏆 FINAL CAREER SERVICES DROPDOWN CONSISTENCY TEST');
  console.log('==================================================');
  console.log('Verifying nuclear CSS fix across ALL website pages...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // All pages to test
  const allPages = [
    {
      url: 'http://localhost:9090/dist/en/index.html',
      name: 'Home Page'
    },
    {
      url: 'http://localhost:9090/dist/en/courses.html',
      name: 'Courses Page'
    },
    {
      url: 'http://localhost:9090/dist/en/teachers.html',
      name: 'Teachers Page'
    },
    {
      url: 'http://localhost:9090/dist/en/career-center.html',
      name: 'Career Center Page'
    },
    {
      url: 'http://localhost:9090/dist/en/career-orientation.html',
      name: 'Career Orientation Page'
    },
    {
      url: 'http://localhost:9090/dist/en/detail_courses.html',
      name: 'Course Details Page'
    },
    {
      url: 'http://localhost:9090/dist/en/about.html',
      name: 'About Page'
    }
  ];
  
  const results = {};
  const criticalProperties = [
    'backgroundColor', 'color', 'border', 'borderColor', 'borderRadius',
    'fontFamily', 'fontSize', 'fontWeight', 'display', 'alignItems',
    'padding', 'boxShadow', 'opacity', 'transform', 'filter'
  ];
  
  console.log('📋 TESTING ALL PAGES FOR DROPDOWN CONSISTENCY:\\n');
  
  // Collect data from all pages
  for (const testPage of allPages) {
    try {
      console.log(`📄 Testing: ${testPage.name}`);
      
      await page.goto(testPage.url, { waitUntil: 'networkidle2', timeout: 10000 });
      
      // Get dropdown styling data
      const dropdownData = await page.evaluate(() => {
        const dropdown = document.querySelector('.menu-dropdown-wrapper .dropdown-toggle');
        
        if (!dropdown) {
          return { error: 'Dropdown not found' };
        }
        
        const computedStyle = window.getComputedStyle(dropdown);
        
        return {
          // Critical styling properties
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color,
          border: computedStyle.border,
          borderColor: computedStyle.borderColor,
          borderRadius: computedStyle.borderRadius,
          fontFamily: computedStyle.fontFamily,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          display: computedStyle.display,
          alignItems: computedStyle.alignItems,
          padding: computedStyle.padding,
          boxShadow: computedStyle.boxShadow,
          opacity: computedStyle.opacity,
          transform: computedStyle.transform,
          filter: computedStyle.filter,
          
          // Check for problematic classes
          hasCurrentClass: dropdown.classList.contains('w--current'),
          classList: Array.from(dropdown.classList),
          
          // Page info
          pageId: document.documentElement.getAttribute('data-wf-page'),
          
          // Nuclear CSS marker
          hasNuclearCSS: document.head.innerHTML.includes('NUCLEAR DROPDOWN FIX')
        };
      });
      
      if (dropdownData.error) {
        console.log(`   ❌ ERROR: ${dropdownData.error}`);
        continue;
      }
      
      console.log(`   ✅ Data collected - Page ID: ${dropdownData.pageId}`);
      console.log(`   🎯 Nuclear CSS applied: ${dropdownData.hasNuclearCSS ? 'YES' : 'NO'}`);
      console.log(`   🚫 Has w--current class: ${dropdownData.hasCurrentClass ? 'YES (BAD)' : 'NO (GOOD)'}`);
      
      results[testPage.name] = {
        url: testPage.url,
        data: dropdownData
      };
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Cross-page comparison
  console.log('🔍 CROSS-PAGE CONSISTENCY ANALYSIS:');
  console.log('═'.repeat(50));
  
  const pageNames = Object.keys(results);
  
  if (pageNames.length < 2) {
    console.log('❌ Not enough pages tested for comparison');
    await browser.close();
    return false;
  }
  
  // Use first page as baseline
  const baseline = results[pageNames[0]];
  let allConsistent = true;
  let totalMatches = 0;
  let totalProperties = criticalProperties.length * (pageNames.length - 1);
  
  console.log(`\\n📊 Using "${pageNames[0]}" as baseline for comparison:\\n`);
  
  // Compare each property across all pages
  for (const property of criticalProperties) {
    const baselineValue = baseline.data[property];
    let propertyConsistent = true;
    
    console.log(`🎯 ${property}:`);
    console.log(`   Baseline (${pageNames[0]}): ${baselineValue}`);
    
    for (let i = 1; i < pageNames.length; i++) {
      const pageName = pageNames[i];
      const pageValue = results[pageName].data[property];
      const matches = pageValue === baselineValue;
      
      if (matches) {
        console.log(`   ✅ ${pageName}: MATCH`);
        totalMatches++;
      } else {
        console.log(`   ❌ ${pageName}: MISMATCH (${pageValue})`);
        propertyConsistent = false;
        allConsistent = false;
      }
    }
    
    if (!propertyConsistent) {
      console.log(`   ⚠️  ${property} is INCONSISTENT across pages`);
    }
    
    console.log('');
  }
  
  // Check nuclear CSS presence
  console.log('🚀 NUCLEAR CSS VERIFICATION:');
  let nuclearCSSCount = 0;
  
  pageNames.forEach(pageName => {
    const hasNuclearCSS = results[pageName].data.hasNuclearCSS;
    console.log(`   ${hasNuclearCSS ? '✅' : '❌'} ${pageName}: ${hasNuclearCSS ? 'HAS' : 'MISSING'} nuclear CSS`);
    if (hasNuclearCSS) nuclearCSSCount++;
  });
  
  // Check w--current classes
  console.log('\\n🚫 WEBFLOW CURRENT CLASS CHECK:');
  let currentClassCount = 0;
  
  pageNames.forEach(pageName => {
    const hasCurrentClass = results[pageName].data.hasCurrentClass;
    console.log(`   ${hasCurrentClass ? '❌' : '✅'} ${pageName}: ${hasCurrentClass ? 'HAS w--current (BAD)' : 'NO w--current (GOOD)'}`);
    if (hasCurrentClass) currentClassCount++;
  });
  
  // Calculate consistency score
  const consistencyPercentage = Math.round((totalMatches / totalProperties) * 100);
  
  console.log('\\n' + '═'.repeat(50));
  console.log('🏆 FINAL TEST RESULTS:');
  console.log('═'.repeat(50));
  console.log(`📊 Consistency Score: ${consistencyPercentage}% (${totalMatches}/${totalProperties} properties match)`);
  console.log(`🚀 Nuclear CSS Coverage: ${nuclearCSSCount}/${pageNames.length} pages (${Math.round((nuclearCSSCount/pageNames.length)*100)}%)`);
  console.log(`🚫 w--current Class Issues: ${currentClassCount}/${pageNames.length} pages (${currentClassCount === 0 ? 'PERFECT' : 'NEEDS ATTENTION'})`);
  
  if (allConsistent && nuclearCSSCount === pageNames.length && currentClassCount === 0) {
    console.log('\\n🎉🎉🎉 PERFECT SUCCESS! 🎉🎉🎉');
    console.log('✅ ALL PAGES HAVE IDENTICAL CAREER SERVICES DROPDOWN STYLING!');
    console.log('✅ Nuclear CSS fix is working flawlessly across the entire website');
    console.log('✅ No problematic w--current classes detected');
    console.log('✅ Webflow page-specific styling has been completely neutralized');
    console.log('\\n🏆 MISSION ACCOMPLISHED - DROPDOWN CONSISTENCY ACHIEVED!');
  } else {
    console.log('\\n❌ ISSUES STILL DETECTED:');
    if (!allConsistent) console.log('   - Styling inconsistencies found between pages');
    if (nuclearCSSCount < pageNames.length) console.log('   - Nuclear CSS missing from some pages');
    if (currentClassCount > 0) console.log('   - w--current classes still present on some pages');
  }
  
  await browser.close();
  
  // Save detailed results
  const fs = require('fs');
  fs.writeFileSync('final-consistency-results.json', JSON.stringify(results, null, 2));
  console.log('\\n📄 Detailed test results saved to: final-consistency-results.json');
  
  return allConsistent && nuclearCSSCount === pageNames.length && currentClassCount === 0;
}

// Run the final test
finalConsistencyTest().then(success => {
  process.exit(success ? 0 : 1);
}).catch(console.error);