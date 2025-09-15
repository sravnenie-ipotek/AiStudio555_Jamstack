const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function analyzeRussianMenuLayout() {
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow'
  });
  
  const page = await context.newPage();
  
  console.log('🔍 Starting comprehensive Russian navigation menu analysis...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    russianMenu: {},
    hebrewMenu: {},
    englishMenu: {},
    comparison: {},
    issues: [],
    recommendations: []
  };

  try {
    // 1. Load Russian version and analyze
    console.log('📍 Loading Russian version...');
    await page.goto('http://localhost:3005/dist/ru/index.html', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    // Take full screenshot of Russian page
    await page.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/russian-menu-full-analysis.png',
      fullPage: true
    });
    
    // Focus on navigation area only
    const navElement = await page.locator('.navbar, nav, .navigation, .menu, .nav').first();
    if (await navElement.count() > 0) {
      await navElement.screenshot({ 
        path: '/Users/michaelmishayev/Desktop/newCode/russian-menu-nav-only.png'
      });
    }
    
    // Analyze Russian menu structure
    results.russianMenu = await analyzeMenuStructure(page, 'Russian');
    
    // 2. Load Hebrew version for comparison
    console.log('📍 Loading Hebrew version for comparison...');
    await page.goto('http://localhost:3005/dist/he/index.html', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    // Take Hebrew navigation screenshot
    const hebrewNavElement = await page.locator('.navbar, nav, .navigation, .menu, .nav').first();
    if (await hebrewNavElement.count() > 0) {
      await hebrewNavElement.screenshot({ 
        path: '/Users/michaelmishayev/Desktop/newCode/hebrew-menu-comparison.png'
      });
    }
    
    results.hebrewMenu = await analyzeMenuStructure(page, 'Hebrew');
    
    // 3. Load English version for comparison
    console.log('📍 Loading English version for comparison...');
    await page.goto('http://localhost:3005/dist/en/index.html', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    results.englishMenu = await analyzeMenuStructure(page, 'English');
    
    // 4. Perform detailed comparison
    results.comparison = performMenuComparison(results.russianMenu, results.hebrewMenu, results.englishMenu);
    
    // 5. Generate specific issues and recommendations
    results.issues = identifyIssues(results.comparison);
    results.recommendations = generateRecommendations(results.issues);
    
    // 6. Take mobile comparison screenshots
    await context.setViewportSize({ width: 375, height: 667 });
    
    console.log('📱 Taking mobile screenshots for comparison...');
    
    // Russian mobile
    await page.goto('http://localhost:3005/dist/ru/index.html', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/russian-menu-mobile.png',
      fullPage: false
    });
    
    // Hebrew mobile
    await page.goto('http://localhost:3005/dist/he/index.html', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/hebrew-menu-mobile.png',
      fullPage: false
    });
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
    results.error = error.message;
  }
  
  await browser.close();
  
  // Save detailed results
  fs.writeFileSync(
    '/Users/michaelmishayev/Desktop/newCode/russian-menu-analysis-results.json', 
    JSON.stringify(results, null, 2)
  );
  
  // Generate comprehensive report
  generateDetailedReport(results);
  
  return results;
}

async function analyzeMenuStructure(page, language) {
  console.log(`🔍 Analyzing ${language} menu structure...`);
  
  const structure = {
    language: language,
    menuItems: [],
    languageSwitcher: {},
    spacing: {},
    positioning: {},
    css: {},
    errors: []
  };
  
  try {
    // Get all menu items
    const menuSelectors = [
      '.nav-link, .navbar-nav a, .menu-item, .nav-item a',
      '.dropdown-toggle, .dropdown-item',
      '.language-switcher, .lang-switch',
      '.navbar-brand, .logo'
    ];
    
    for (const selector of menuSelectors) {
      try {
        const elements = await page.locator(selector).all();
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const text = await element.textContent();
          const boundingBox = await element.boundingBox();
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              fontSize: computed.fontSize,
              fontFamily: computed.fontFamily,
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              padding: computed.padding,
              margin: computed.margin,
              position: computed.position,
              display: computed.display,
              textAlign: computed.textAlign,
              direction: computed.direction
            };
          });
          
          structure.menuItems.push({
            selector: selector,
            text: text ? text.trim() : '',
            boundingBox: boundingBox,
            styles: styles,
            isVisible: await element.isVisible()
          });
        }
      } catch (error) {
        structure.errors.push('Error with selector ' + selector + ': ' + error.message);
      }
    }
    
    // Analyze language switcher specifically
    try {
      const langSwitcher = await page.locator('.language-switcher, .lang-switch, [data-language]').first();
      if (await langSwitcher.count() > 0) {
        structure.languageSwitcher = {
          exists: true,
          text: await langSwitcher.textContent(),
          boundingBox: await langSwitcher.boundingBox(),
          styles: await langSwitcher.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              position: computed.position,
              right: computed.right,
              left: computed.left,
              top: computed.top,
              zIndex: computed.zIndex,
              transform: computed.transform
            };
          })
        };
      }
    } catch (error) {
      structure.languageSwitcher.error = error.message;
    }
    
    // Check for RTL/LTR direction
    const bodyDirection = await page.evaluate(() => {
      return window.getComputedStyle(document.body).direction;
    });
    structure.direction = bodyDirection;
    
    // Check for text overflow or clipping
    const overflowElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('.nav-link, .navbar-nav a, .menu-item');
      const overflowing = [];
      elements.forEach((el, index) => {
        if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
          overflowing.push({
            index: index,
            text: el.textContent ? el.textContent.trim() : '',
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight
          });
        }
      });
      return overflowing;
    });
    structure.overflowingElements = overflowElements;
    
  } catch (error) {
    structure.errors.push('General analysis error: ' + error.message);
  }
  
  return structure;
}

function performMenuComparison(russian, hebrew, english) {
  console.log('📊 Performing detailed menu comparison...');
  
  const comparison = {
    itemCounts: {
      russian: russian.menuItems.length,
      hebrew: hebrew.menuItems.length,
      english: english.menuItems.length
    },
    textComparison: {},
    spacingDifferences: {},
    positioningIssues: [],
    directionality: {
      russian: russian.direction,
      hebrew: hebrew.direction,
      english: english.direction
    }
  };
  
  // Compare menu item texts
  const russianTexts = russian.menuItems.map(item => item.text).filter(text => text && text.length > 0);
  const hebrewTexts = hebrew.menuItems.map(item => item.text).filter(text => text && text.length > 0);
  const englishTexts = english.menuItems.map(item => item.text).filter(text => text && text.length > 0);
  
  comparison.textComparison = {
    russian: russianTexts,
    hebrew: hebrewTexts,
    english: englishTexts,
    missingInRussian: hebrewTexts.filter(text => !russianTexts.includes(text)),
    uniqueToRussian: russianTexts.filter(text => !hebrewTexts.includes(text) && !englishTexts.includes(text))
  };
  
  // Compare spacing (look for significant differences in bounding boxes)
  const russianPositions = russian.menuItems.filter(item => item.boundingBox).map(item => item.boundingBox);
  const hebrewPositions = hebrew.menuItems.filter(item => item.boundingBox).map(item => item.boundingBox);
  
  if (russianPositions.length > 0 && hebrewPositions.length > 0) {
    comparison.spacingDifferences = {
      averageRussianSpacing: calculateAverageSpacing(russianPositions),
      averageHebrewSpacing: calculateAverageSpacing(hebrewPositions),
      significantDifferences: Math.abs(calculateAverageSpacing(russianPositions) - calculateAverageSpacing(hebrewPositions)) > 10
    };
  }
  
  return comparison;
}

function calculateAverageSpacing(positions) {
  if (positions.length < 2) return 0;
  
  const spacings = [];
  for (let i = 1; i < positions.length; i++) {
    const spacing = Math.abs(positions[i].x - (positions[i-1].x + positions[i-1].width));
    spacings.push(spacing);
  }
  
  return spacings.reduce((sum, spacing) => sum + spacing, 0) / spacings.length;
}

function identifyIssues(comparison) {
  console.log('🚨 Identifying specific issues...');
  
  const issues = [];
  
  // Check for missing menu items
  if (comparison.textComparison.missingInRussian.length > 0) {
    issues.push({
      type: 'Missing Menu Items',
      severity: 'HIGH',
      description: 'Russian menu is missing ' + comparison.textComparison.missingInRussian.length + ' items found in Hebrew version',
      details: comparison.textComparison.missingInRussian
    });
  }
  
  // Check for spacing issues
  if (comparison.spacingDifferences && comparison.spacingDifferences.significantDifferences) {
    issues.push({
      type: 'Spacing Inconsistency',
      severity: 'MEDIUM',
      description: 'Significant spacing differences between Russian and Hebrew menus',
      details: {
        russianSpacing: comparison.spacingDifferences.averageRussianSpacing,
        hebrewSpacing: comparison.spacingDifferences.averageHebrewSpacing
      }
    });
  }
  
  // Check for item count discrepancies
  if (comparison.itemCounts.russian !== comparison.itemCounts.hebrew) {
    issues.push({
      type: 'Item Count Mismatch',
      severity: 'HIGH',
      description: 'Russian menu has ' + comparison.itemCounts.russian + ' items vs Hebrew menu with ' + comparison.itemCounts.hebrew + ' items',
      details: comparison.itemCounts
    });
  }
  
  // Check for unique items in Russian
  if (comparison.textComparison.uniqueToRussian.length > 0) {
    issues.push({
      type: 'Extra Items in Russian',
      severity: 'MEDIUM',
      description: 'Russian menu contains items not found in other language versions',
      details: comparison.textComparison.uniqueToRussian
    });
  }
  
  return issues;
}

function generateRecommendations(issues) {
  console.log('💡 Generating specific recommendations...');
  
  const recommendations = [];
  
  issues.forEach(issue => {
    switch (issue.type) {
      case 'Missing Menu Items':
        recommendations.push({
          issue: issue.type,
          priority: 'HIGH',
          action: 'Add missing menu items to Russian navigation',
          implementation: 'Add the following items to /dist/ru/index.html navigation: ' + issue.details.join(', '),
          cssChanges: 'Ensure consistent .nav-item styling across all language versions'
        });
        break;
        
      case 'Spacing Inconsistency':
        recommendations.push({
          issue: issue.type,
          priority: 'MEDIUM',
          action: 'Standardize menu item spacing',
          implementation: 'Apply consistent padding and margin values to .nav-link elements',
          cssChanges: '.nav-link { padding: 0.5rem 1rem; margin: 0 0.25rem; }'
        });
        break;
        
      case 'Item Count Mismatch':
        recommendations.push({
          issue: issue.type,
          priority: 'HIGH',
          action: 'Sync menu items across all language versions',
          implementation: 'Review navigation structure and ensure all language versions have identical menu items',
          cssChanges: 'No CSS changes needed - HTML structure issue'
        });
        break;
        
      case 'Extra Items in Russian':
        recommendations.push({
          issue: issue.type,
          priority: 'MEDIUM',
          action: 'Remove extra items or add them to other language versions',
          implementation: 'Review these Russian-only items: ' + issue.details.join(', '),
          cssChanges: 'Ensure consistent styling if keeping extra items'
        });
        break;
    }
  });
  
  // Always add general recommendations
  recommendations.push({
    issue: 'General Improvement',
    priority: 'LOW',
    action: 'Implement universal navigation CSS',
    implementation: 'Create shared navigation styles that work consistently across all languages',
    cssChanges: '/* Universal Navigation Styles */ .navbar { direction: ltr; } .navbar-nav { display: flex; align-items: center; gap: 1rem; }'
  });
  
  return recommendations;
}

function generateDetailedReport(results) {
  console.log('📄 Generating comprehensive report...');
  
  let reportContent = '# Russian Navigation Menu Analysis Report\n';
  reportContent += 'Generated: ' + results.timestamp + '\n\n';
  reportContent += '## Executive Summary\n';
  reportContent += 'Analysis of Russian navigation menu layout compared to Hebrew and English versions.\n\n';
  reportContent += '### Issues Found: ' + results.issues.length + '\n';
  
  results.issues.forEach(issue => {
    reportContent += '- **' + issue.type + '** (' + issue.severity + '): ' + issue.description + '\n';
  });
  
  reportContent += '\n## Detailed Findings\n\n';
  reportContent += '### Menu Structure Comparison\n';
  reportContent += '- **Russian Menu Items**: ' + results.russianMenu.menuItems.length + '\n';
  reportContent += '- **Hebrew Menu Items**: ' + results.hebrewMenu.menuItems.length + '\n';
  reportContent += '- **English Menu Items**: ' + results.englishMenu.menuItems.length + '\n\n';
  
  if (results.comparison.textComparison) {
    reportContent += '### Text Content Analysis\n';
    reportContent += '**Russian Menu Texts**: ' + results.comparison.textComparison.russian.join(', ') + '\n';
    reportContent += '**Hebrew Menu Texts**: ' + results.comparison.textComparison.hebrew.join(', ') + '\n';
    reportContent += '**Missing in Russian**: ' + results.comparison.textComparison.missingInRussian.join(', ') + '\n';
    reportContent += '**Unique to Russian**: ' + results.comparison.textComparison.uniqueToRussian.join(', ') + '\n\n';
  }
  
  if (results.comparison.spacingDifferences) {
    reportContent += '### Spacing Analysis\n';
    reportContent += '- **Russian Average Spacing**: ' + results.comparison.spacingDifferences.averageRussianSpacing + 'px\n';
    reportContent += '- **Hebrew Average Spacing**: ' + results.comparison.spacingDifferences.averageHebrewSpacing + 'px\n';
    reportContent += '- **Significant Differences**: ' + (results.comparison.spacingDifferences.significantDifferences ? 'YES' : 'NO') + '\n\n';
  }
  
  reportContent += '## Recommendations\n\n';
  
  results.recommendations.forEach(rec => {
    reportContent += '### ' + rec.issue + ' - Priority: ' + rec.priority + '\n';
    reportContent += '**Action**: ' + rec.action + '\n';
    reportContent += '**Implementation**: ' + rec.implementation + '\n';
    reportContent += '**CSS Changes**: ' + rec.cssChanges + '\n\n';
  });
  
  reportContent += '## Screenshots Generated\n';
  reportContent += '- russian-menu-full-analysis.png - Full Russian page\n';
  reportContent += '- russian-menu-nav-only.png - Russian navigation area only\n';
  reportContent += '- hebrew-menu-comparison.png - Hebrew navigation for comparison\n';
  reportContent += '- russian-menu-mobile.png - Russian mobile view\n';
  reportContent += '- hebrew-menu-mobile.png - Hebrew mobile view\n\n';
  
  reportContent += '## Next Steps\n';
  reportContent += '1. Review identified issues in order of priority\n';
  reportContent += '2. Implement recommended CSS changes\n';
  reportContent += '3. Test fixes across all language versions\n';
  reportContent += '4. Verify consistency on both desktop and mobile viewports\n\n';
  reportContent += '---\n';
  reportContent += '*Analysis completed using Playwright browser automation*\n';

  fs.writeFileSync(
    '/Users/michaelmishayev/Desktop/newCode/russian-menu-analysis-report.md', 
    reportContent
  );
  
  console.log('\n✅ Analysis complete! Files generated:');
  console.log('   📄 russian-menu-analysis-report.md');
  console.log('   📊 russian-menu-analysis-results.json');
  console.log('   🖼️  Multiple screenshot files');
}

// Run the analysis
analyzeRussianMenuLayout().then(results => {
  console.log('\n🎯 Analysis Summary:');
  console.log('   Issues Found: ' + results.issues.length);
  console.log('   Recommendations: ' + results.recommendations.length);
  console.log('   Screenshots: 5');
  
  if (results.issues.length > 0) {
    console.log('\n🚨 Top Issues:');
    results.issues.slice(0, 3).forEach(issue => {
      console.log('   - ' + issue.type + ': ' + issue.description);
    });
  }
  
  console.log('\n✅ Detailed analysis complete! Check the generated report and screenshots.');
}).catch(error => {
  console.error('❌ Analysis failed:', error);
});
