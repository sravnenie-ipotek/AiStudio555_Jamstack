const { chromium } = require('playwright');
const fs = require('fs');

async function detailedRussianMenuIssueAnalysis() {
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  console.log('🔍 Detailed Russian menu issue analysis...\n');
  
  const analysis = {
    timestamp: new Date().toISOString(),
    issues: [],
    findings: {},
    recommendations: []
  };

  try {
    // 1. Load Russian version and take detailed screenshots
    console.log('📍 Loading Russian version (http://localhost:3005/dist/ru/index.html)...');
    await page.goto('http://localhost:3005/dist/ru/index.html', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/russian-detailed-full-page.png',
      fullPage: true
    });
    
    // Focus specifically on navigation header
    try {
      const headerNav = await page.locator('header, .header, .navbar, .navigation').first();
      if (await headerNav.count() > 0) {
        await headerNav.screenshot({ 
          path: '/Users/michaelmishayev/Desktop/newCode/russian-header-navigation.png'
        });
        
        console.log('📋 Analyzing Russian header navigation structure...');
        
        // Get detailed navigation structure
        const navStructure = await page.evaluate(() => {
          const header = document.querySelector('header, .header, .navbar, .navigation');
          if (!header) return null;
          
          return {
            outerHTML: header.outerHTML.substring(0, 2000), // First 2000 chars
            classList: Array.from(header.classList),
            boundingRect: header.getBoundingClientRect(),
            computedStyle: {
              display: window.getComputedStyle(header).display,
              position: window.getComputedStyle(header).position,
              zIndex: window.getComputedStyle(header).zIndex,
              background: window.getComputedStyle(header).background,
              width: window.getComputedStyle(header).width,
              height: window.getComputedStyle(header).height
            }
          };
        });
        
        analysis.findings.russianNavStructure = navStructure;
      }
    } catch (error) {
      analysis.issues.push('Failed to capture Russian navigation: ' + error.message);
    }
    
    // Analyze menu items visibility and positioning
    console.log('🔍 Analyzing Russian menu items...');
    const russianMenuItems = await page.evaluate(() => {
      const menuItems = [];
      const selectors = [
        '.nav-link', 
        '.navbar-nav a', 
        '.menu-item', 
        '.nav-item',
        '.navigation a',
        'nav a'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          
          menuItems.push({
            selector: selector,
            index: index,
            text: el.textContent?.trim() || '',
            href: el.href || '',
            visible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none',
            position: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
            },
            styles: {
              fontSize: style.fontSize,
              color: style.color,
              backgroundColor: style.backgroundColor,
              display: style.display,
              visibility: style.visibility,
              opacity: style.opacity,
              transform: style.transform,
              position: style.position,
              zIndex: style.zIndex
            }
          });
        });
      });
      
      return menuItems;
    });
    
    analysis.findings.russianMenuItems = russianMenuItems;
    
    // Check for language switcher issues
    console.log('🌐 Checking Russian language switcher...');
    const languageSwitcher = await page.evaluate(() => {
      const langSelectors = [
        '.language-switcher',
        '.lang-switch', 
        '[data-language]',
        '.dropdown-toggle:contains("RU")',
        '.language-selector'
      ];
      
      for (const selector of langSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          
          return {
            found: true,
            selector: selector,
            text: element.textContent?.trim() || '',
            position: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
            },
            styles: {
              position: style.position,
              right: style.right,
              left: style.left,
              top: style.top,
              transform: style.transform,
              display: style.display,
              visibility: style.visibility
            }
          };
        }
      }
      
      return { found: false };
    });
    
    analysis.findings.russianLanguageSwitcher = languageSwitcher;
    
    // 2. Load Hebrew version for direct comparison
    console.log('📍 Loading Hebrew version for comparison...');
    await page.goto('http://localhost:3005/dist/he/index.html', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Take Hebrew header screenshot
    try {
      const hebrewHeaderNav = await page.locator('header, .header, .navbar, .navigation').first();
      if (await hebrewHeaderNav.count() > 0) {
        await hebrewHeaderNav.screenshot({ 
          path: '/Users/michaelmishayev/Desktop/newCode/hebrew-header-navigation.png'
        });
      }
    } catch (error) {
      analysis.issues.push('Failed to capture Hebrew navigation: ' + error.message);
    }
    
    // Get Hebrew menu structure for comparison
    const hebrewMenuItems = await page.evaluate(() => {
      const menuItems = [];
      const selectors = [
        '.nav-link', 
        '.navbar-nav a', 
        '.menu-item', 
        '.nav-item',
        '.navigation a',
        'nav a'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          
          menuItems.push({
            selector: selector,
            index: index,
            text: el.textContent?.trim() || '',
            href: el.href || '',
            visible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none',
            position: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
            }
          });
        });
      });
      
      return menuItems;
    });
    
    analysis.findings.hebrewMenuItems = hebrewMenuItems;
    
    // 3. Perform detailed comparison
    console.log('📊 Performing detailed comparison...');
    
    const russianVisible = russianMenuItems.filter(item => item.visible && item.text.length > 0);
    const hebrewVisible = hebrewMenuItems.filter(item => item.visible && item.text.length > 0);
    
    analysis.findings.comparison = {
      russianVisibleCount: russianVisible.length,
      hebrewVisibleCount: hebrewVisible.length,
      russianTexts: russianVisible.map(item => item.text),
      hebrewTexts: hebrewVisible.map(item => item.text),
      positioningDifferences: comparePositioning(russianVisible, hebrewVisible)
    };
    
    // 4. Identify specific issues
    if (russianVisible.length !== hebrewVisible.length) {
      analysis.issues.push({
        type: 'Menu Item Count Mismatch',
        description: `Russian has ${russianVisible.length} visible items vs Hebrew with ${hebrewVisible.length}`,
        severity: 'HIGH'
      });
    }
    
    // Check for overlapping elements
    const overlappingRussian = findOverlappingElements(russianVisible);
    if (overlappingRussian.length > 0) {
      analysis.issues.push({
        type: 'Overlapping Menu Items',
        description: `Found ${overlappingRussian.length} overlapping elements in Russian menu`,
        details: overlappingRussian,
        severity: 'HIGH'
      });
    }
    
    // Check for hidden elements that should be visible
    const hiddenButShouldBeVisible = russianMenuItems.filter(item => 
      !item.visible && item.text.length > 0 && 
      hebrewVisible.some(hItem => hItem.text.includes(item.text) || item.text.includes(hItem.text))
    );
    
    if (hiddenButShouldBeVisible.length > 0) {
      analysis.issues.push({
        type: 'Hidden Menu Items',
        description: `Found ${hiddenButShouldBeVisible.length} menu items that should be visible but are hidden`,
        details: hiddenButShouldBeVisible.map(item => ({ text: item.text, reason: `opacity: ${item.styles.opacity}, display: ${item.styles.display}` })),
        severity: 'HIGH'
      });
    }
    
    // Generate specific recommendations
    analysis.recommendations = generateSpecificRecommendations(analysis.issues, analysis.findings);
    
  } catch (error) {
    console.error('❌ Analysis error:', error);
    analysis.error = error.message;
  }
  
  await browser.close();
  
  // Save results
  fs.writeFileSync(
    '/Users/michaelmishayev/Desktop/newCode/russian-menu-detailed-analysis.json',
    JSON.stringify(analysis, null, 2)
  );
  
  // Generate focused report
  generateFocusedReport(analysis);
  
  return analysis;
}

function comparePositioning(russianItems, hebrewItems) {
  const differences = [];
  
  // Compare relative positioning patterns
  if (russianItems.length > 1) {
    const russianSpacings = [];
    for (let i = 1; i < russianItems.length; i++) {
      russianSpacings.push(russianItems[i].position.x - russianItems[i-1].position.x);
    }
    
    if (hebrewItems.length > 1) {
      const hebrewSpacings = [];
      for (let i = 1; i < hebrewItems.length; i++) {
        hebrewSpacings.push(hebrewItems[i].position.x - hebrewItems[i-1].position.x);
      }
      
      const avgRussianSpacing = russianSpacings.reduce((a, b) => a + b, 0) / russianSpacings.length;
      const avgHebrewSpacing = hebrewSpacings.reduce((a, b) => a + b, 0) / hebrewSpacings.length;
      
      if (Math.abs(avgRussianSpacing - avgHebrewSpacing) > 20) {
        differences.push({
          type: 'Spacing Difference',
          russianAvg: avgRussianSpacing,
          hebrewAvg: avgHebrewSpacing,
          difference: Math.abs(avgRussianSpacing - avgHebrewSpacing)
        });
      }
    }
  }
  
  return differences;
}

function findOverlappingElements(items) {
  const overlapping = [];
  
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const item1 = items[i];
      const item2 = items[j];
      
      // Check for overlap
      const overlap = !(
        item1.position.x + item1.position.width < item2.position.x ||
        item2.position.x + item2.position.width < item1.position.x ||
        item1.position.y + item1.position.height < item2.position.y ||
        item2.position.y + item2.position.height < item1.position.y
      );
      
      if (overlap) {
        overlapping.push({
          item1: { text: item1.text, position: item1.position },
          item2: { text: item2.text, position: item2.position }
        });
      }
    }
  }
  
  return overlapping;
}

function generateSpecificRecommendations(issues, findings) {
  const recommendations = [];
  
  issues.forEach(issue => {
    switch (issue.type) {
      case 'Menu Item Count Mismatch':
        recommendations.push({
          issue: issue.type,
          priority: 'CRITICAL',
          action: 'Sync menu structure between Russian and Hebrew versions',
          implementation: 'Check /dist/ru/index.html navigation HTML structure and ensure it matches /dist/he/index.html',
          specificFix: 'Review the navbar-nav elements and ensure both versions have identical menu items'
        });
        break;
        
      case 'Overlapping Menu Items':
        recommendations.push({
          issue: issue.type,
          priority: 'HIGH',
          action: 'Fix overlapping menu elements',
          implementation: 'Add proper spacing and positioning CSS',
          specificFix: `
            .navbar-nav .nav-item {
              margin-right: 1rem;
            }
            .nav-link {
              padding: 0.5rem 1rem;
              white-space: nowrap;
            }
          `
        });
        break;
        
      case 'Hidden Menu Items':
        recommendations.push({
          issue: issue.type,
          priority: 'HIGH',
          action: 'Make hidden menu items visible',
          implementation: 'Check CSS that might be hiding menu items',
          specificFix: `
            .nav-item, .nav-link {
              opacity: 1 !important;
              display: block !important;
              visibility: visible !important;
            }
          `
        });
        break;
    }
  });
  
  return recommendations;
}

function generateFocusedReport(analysis) {
  let report = '# Detailed Russian Menu Issue Analysis\n\n';
  report += `Generated: ${analysis.timestamp}\n\n`;
  
  report += '## Critical Issues Found\n\n';
  
  if (analysis.issues.length === 0) {
    report += 'No critical issues detected.\n\n';
  } else {
    analysis.issues.forEach(issue => {
      report += `### ${issue.type} (${issue.severity})\n`;
      report += `${issue.description}\n\n`;
      if (issue.details) {
        report += '**Details:**\n';
        report += JSON.stringify(issue.details, null, 2) + '\n\n';
      }
    });
  }
  
  report += '## Menu Structure Analysis\n\n';
  
  if (analysis.findings.comparison) {
    const comp = analysis.findings.comparison;
    report += `- Russian visible menu items: ${comp.russianVisibleCount}\n`;
    report += `- Hebrew visible menu items: ${comp.hebrewVisibleCount}\n`;
    report += `- Russian menu texts: ${comp.russianTexts.join(', ')}\n`;
    report += `- Hebrew menu texts: ${comp.hebrewTexts.join(', ')}\n\n`;
  }
  
  report += '## Specific Recommendations\n\n';
  
  analysis.recommendations.forEach(rec => {
    report += `### ${rec.issue} - ${rec.priority}\n`;
    report += `**Action:** ${rec.action}\n`;
    report += `**Implementation:** ${rec.implementation}\n`;
    if (rec.specificFix) {
      report += `**Specific Fix:**\n\`\`\`css\n${rec.specificFix}\n\`\`\`\n\n`;
    }
  });
  
  report += '## Screenshots Generated\n';
  report += '- russian-detailed-full-page.png\n';
  report += '- russian-header-navigation.png\n';
  report += '- hebrew-header-navigation.png\n\n';
  
  report += '## Files to Check\n';
  report += '- `/dist/ru/index.html` - Russian navigation structure\n';
  report += '- `/dist/he/index.html` - Hebrew navigation structure (reference)\n';
  report += '- CSS files affecting `.navbar`, `.nav-item`, `.nav-link` classes\n';
  
  fs.writeFileSync(
    '/Users/michaelmishayev/Desktop/newCode/russian-menu-focused-report.md',
    report
  );
  
  console.log('\n✅ Detailed analysis complete!');
  console.log('📄 Generated: russian-menu-focused-report.md');
  console.log('📊 Generated: russian-menu-detailed-analysis.json');
  console.log('🖼️  Generated: 3 detailed screenshots');
}

// Run the detailed analysis
detailedRussianMenuIssueAnalysis().then(results => {
  console.log('\n🎯 Detailed Analysis Summary:');
  console.log(`   Critical Issues: ${results.issues.length}`);
  console.log(`   Recommendations: ${results.recommendations.length}`);
  
  if (results.issues.length > 0) {
    console.log('\n🚨 Issues Found:');
    results.issues.forEach(issue => {
      console.log(`   - ${issue.type}: ${issue.description}`);
    });
  }
  
  if (results.findings.comparison) {
    console.log(`\n📊 Menu Comparison:`);
    console.log(`   Russian: ${results.findings.comparison.russianVisibleCount} visible items`);
    console.log(`   Hebrew: ${results.findings.comparison.hebrewVisibleCount} visible items`);
  }
  
}).catch(error => {
  console.error('❌ Detailed analysis failed:', error);
});
