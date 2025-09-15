const { chromium } = require('playwright');
const fs = require('fs');

async function visualComparisonAnalysis() {
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  console.log('🔍 Visual comparison analysis of Russian vs Hebrew menus...\n');
  
  const comparison = {
    timestamp: new Date().toISOString(),
    russianMenu: {},
    hebrewMenu: {},
    issues: [],
    visualDifferences: []
  };

  try {
    // 1. Capture Russian menu
    console.log('📍 Loading Russian version...');
    await page.goto('http://localhost:3005/dist/ru/index.html', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    // Take focused navigation screenshot
    await page.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/russian-navigation-focused.png',
      clip: { x: 0, y: 0, width: 1920, height: 120 }
    });
    
    // Get Russian menu details
    const russianDetails = await page.evaluate(() => {
      const navMenu = document.querySelector('.nav-menu');
      const navLinks = document.querySelectorAll('.nav-link');
      
      return {
        menuExists: !!navMenu,
        menuStyles: navMenu ? {
          display: window.getComputedStyle(navMenu).display,
          flexDirection: window.getComputedStyle(navMenu).flexDirection,
          alignItems: window.getComputedStyle(navMenu).alignItems,
          gap: window.getComputedStyle(navMenu).gap,
          width: window.getComputedStyle(navMenu).width,
          height: window.getComputedStyle(navMenu).height
        } : null,
        links: Array.from(navLinks).map(link => ({
          text: link.textContent.trim(),
          href: link.href,
          boundingRect: link.getBoundingClientRect(),
          computedStyle: {
            display: window.getComputedStyle(link).display,
            visibility: window.getComputedStyle(link).visibility,
            opacity: window.getComputedStyle(link).opacity,
            fontSize: window.getComputedStyle(link).fontSize,
            color: window.getComputedStyle(link).color,
            padding: window.getComputedStyle(link).padding,
            margin: window.getComputedStyle(link).margin
          }
        }))
      };
    });
    
    comparison.russianMenu = russianDetails;
    console.log(`📊 Russian menu: ${russianDetails.links.length} links found`);
    
    // 2. Capture Hebrew menu
    console.log('📍 Loading Hebrew version...');
    await page.goto('http://localhost:3005/dist/he/index.html', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    // Take focused navigation screenshot
    await page.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/hebrew-navigation-focused.png',
      clip: { x: 0, y: 0, width: 1920, height: 120 }
    });
    
    // Get Hebrew menu details
    const hebrewDetails = await page.evaluate(() => {
      const navMenu = document.querySelector('.nav-menu');
      const navLinks = document.querySelectorAll('.nav-link');
      
      return {
        menuExists: !!navMenu,
        menuStyles: navMenu ? {
          display: window.getComputedStyle(navMenu).display,
          flexDirection: window.getComputedStyle(navMenu).flexDirection,
          alignItems: window.getComputedStyle(navMenu).alignItems,
          gap: window.getComputedStyle(navMenu).gap,
          width: window.getComputedStyle(navMenu).width,
          height: window.getComputedStyle(navMenu).height
        } : null,
        links: Array.from(navLinks).map(link => ({
          text: link.textContent.trim(),
          href: link.href,
          boundingRect: link.getBoundingClientRect(),
          computedStyle: {
            display: window.getComputedStyle(link).display,
            visibility: window.getComputedStyle(link).visibility,
            opacity: window.getComputedStyle(link).opacity,
            fontSize: window.getComputedStyle(link).fontSize,
            color: window.getComputedStyle(link).color,
            padding: window.getComputedStyle(link).padding,
            margin: window.getComputedStyle(link).margin
          }
        }))
      };
    });
    
    comparison.hebrewMenu = hebrewDetails;
    console.log(`📊 Hebrew menu: ${hebrewDetails.links.length} links found`);
    
    // 3. Analyze differences
    console.log('🔍 Analyzing differences...');
    
    // Compare link counts
    if (russianDetails.links.length !== hebrewDetails.links.length) {
      comparison.issues.push({
        type: 'Link Count Mismatch',
        description: `Russian has ${russianDetails.links.length} links, Hebrew has ${hebrewDetails.links.length} links`,
        severity: 'HIGH'
      });
    }
    
    // Compare visible links
    const russianVisibleLinks = russianDetails.links.filter(link => 
      link.boundingRect.width > 0 && link.boundingRect.height > 0
    );
    const hebrewVisibleLinks = hebrewDetails.links.filter(link => 
      link.boundingRect.width > 0 && link.boundingRect.height > 0
    );
    
    console.log(`📊 Visible links - Russian: ${russianVisibleLinks.length}, Hebrew: ${hebrewVisibleLinks.length}`);
    
    if (russianVisibleLinks.length !== hebrewVisibleLinks.length) {
      comparison.issues.push({
        type: 'Visible Links Mismatch',
        description: `Russian has ${russianVisibleLinks.length} visible links, Hebrew has ${hebrewVisibleLinks.length} visible links`,
        severity: 'CRITICAL',
        details: {
          russianVisible: russianVisibleLinks.map(l => l.text),
          hebrewVisible: hebrewVisibleLinks.map(l => l.text),
          russianInvisible: russianDetails.links.filter(link => 
            link.boundingRect.width === 0 || link.boundingRect.height === 0
          ).map(l => ({ text: l.text, reason: `width: ${l.boundingRect.width}, height: ${l.boundingRect.height}` }))
        }
      });
    }
    
    // Compare menu container styles
    if (russianDetails.menuStyles && hebrewDetails.menuStyles) {
      const styleComparison = {};
      Object.keys(russianDetails.menuStyles).forEach(key => {
        if (russianDetails.menuStyles[key] !== hebrewDetails.menuStyles[key]) {
          styleComparison[key] = {
            russian: russianDetails.menuStyles[key],
            hebrew: hebrewDetails.menuStyles[key]
          };
        }
      });
      
      if (Object.keys(styleComparison).length > 0) {
        comparison.visualDifferences.push({
          type: 'Menu Container Style Differences',
          differences: styleComparison
        });
      }
    }
    
    // 4. Create side-by-side comparison
    console.log('📷 Creating side-by-side comparison...');
    
    // Create a new page for side-by-side
    const comparisonPage = await context.newPage();
    await comparisonPage.setViewportSize({ width: 3840, height: 1080 });
    
    await comparisonPage.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; font-family: Arial, sans-serif; }
          .comparison-container { 
            display: flex; 
            width: 100%; 
            height: 100vh; 
          }
          .side { 
            width: 50%; 
            position: relative;
            border-right: 2px solid #red;
          }
          .iframe { 
            width: 100%; 
            height: 100%; 
            border: none; 
            transform: scale(0.5);
            transform-origin: 0 0;
            width: 200%;
            height: 200%;
          }
          .label {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            z-index: 1000;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="comparison-container">
          <div class="side">
            <div class="label">RUSSIAN VERSION</div>
            <iframe class="iframe" src="http://localhost:3005/dist/ru/index.html"></iframe>
          </div>
          <div class="side">
            <div class="label">HEBREW VERSION</div>
            <iframe class="iframe" src="http://localhost:3005/dist/he/index.html"></iframe>
          </div>
        </div>
      </body>
      </html>
    `);
    
    await comparisonPage.waitForTimeout(5000);
    
    await comparisonPage.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/russian-hebrew-side-by-side-comparison.png',
      fullPage: false
    });
    
    await comparisonPage.close();
    
  } catch (error) {
    console.error('❌ Error during visual comparison:', error);
    comparison.error = error.message;
  }
  
  await browser.close();
  
  // Save results
  fs.writeFileSync(
    '/Users/michaelmishayev/Desktop/newCode/russian-menu-visual-comparison.json',
    JSON.stringify(comparison, null, 2)
  );
  
  // Generate summary report
  generateVisualReport(comparison);
  
  return comparison;
}

function generateVisualReport(comparison) {
  let report = '# Russian Menu Visual Analysis Report\n\n';
  report += `Generated: ${comparison.timestamp}\n\n`;
  
  report += '## Critical Findings\n\n';
  
  if (comparison.issues.length === 0) {
    report += 'No critical issues found.\n\n';
  } else {
    comparison.issues.forEach(issue => {
      report += `### ${issue.type} (${issue.severity})\n`;
      report += `${issue.description}\n\n`;
      
      if (issue.details) {
        if (issue.details.russianVisible) {
          report += `**Russian Visible Links**: ${issue.details.russianVisible.join(', ')}\n`;
        }
        if (issue.details.hebrewVisible) {
          report += `**Hebrew Visible Links**: ${issue.details.hebrewVisible.join(', ')}\n`;
        }
        if (issue.details.russianInvisible) {
          report += `**Russian Invisible Links**:\n`;
          issue.details.russianInvisible.forEach(link => {
            report += `- ${link.text}: ${link.reason}\n`;
          });
        }
        report += '\n';
      }
    });
  }
  
  report += '## Menu Structure Comparison\n\n';
  
  if (comparison.russianMenu && comparison.hebrewMenu) {
    report += `- **Russian Menu Links**: ${comparison.russianMenu.links.length}\n`;
    report += `- **Hebrew Menu Links**: ${comparison.hebrewMenu.links.length}\n\n`;
    
    report += '### Russian Menu Texts\n';
    comparison.russianMenu.links.forEach(link => {
      const visible = link.boundingRect.width > 0 && link.boundingRect.height > 0 ? '✅' : '❌';
      report += `- ${visible} ${link.text}\n`;
    });
    
    report += '\n### Hebrew Menu Texts\n';
    comparison.hebrewMenu.links.forEach(link => {
      const visible = link.boundingRect.width > 0 && link.boundingRect.height > 0 ? '✅' : '❌';
      report += `- ${visible} ${link.text}\n`;
    });
  }
  
  if (comparison.visualDifferences.length > 0) {
    report += '\n## Visual Differences\n\n';
    comparison.visualDifferences.forEach(diff => {
      report += `### ${diff.type}\n`;
      Object.keys(diff.differences).forEach(key => {
        report += `- **${key}**: Russian: \`${diff.differences[key].russian}\`, Hebrew: \`${diff.differences[key].hebrew}\`\n`;
      });
      report += '\n';
    });
  }
  
  report += '## Specific Recommendations\n\n';
  
  if (comparison.issues.some(issue => issue.type === 'Visible Links Mismatch')) {
    report += '### Fix Invisible Menu Links\n';
    report += '**Problem**: Menu links have zero width/height despite proper CSS\n';
    report += '**Solution**: Check for CSS conflicts or missing flex properties\n';
    report += '**CSS Fix**:\n';
    report += '```css\n';
    report += '.nav-menu {\n';
    report += '  display: flex !important;\n';
    report += '  flex-direction: row !important;\n';
    report += '  align-items: center !important;\n';
    report += '  gap: 20px !important;\n';
    report += '}\n\n';
    report += '.nav-link {\n';
    report += '  display: inline-block !important;\n';
    report += '  min-width: max-content !important;\n';
    report += '  padding: 10px 20px !important;\n';
    report += '}\n';
    report += '```\n\n';
  }
  
  report += '## Screenshots Generated\n';
  report += '- russian-navigation-focused.png\n';
  report += '- hebrew-navigation-focused.png\n';
  report += '- russian-hebrew-side-by-side-comparison.png\n\n';
  
  report += '## Files to Check\n';
  report += '- `/dist/ru/index.html` - Russian navigation structure\n';
  report += '- `/dist/he/index.html` - Hebrew navigation structure\n';
  report += '- CSS files affecting navigation layout\n';
  
  fs.writeFileSync(
    '/Users/michaelmishayev/Desktop/newCode/russian-menu-visual-report.md',
    report
  );
  
  console.log('\n✅ Visual analysis complete!');
  console.log('📄 Generated: russian-menu-visual-report.md');
  console.log('📊 Generated: russian-menu-visual-comparison.json');
  console.log('🖼️  Generated: 3 visual comparison screenshots');
}

// Run the visual comparison
visualComparisonAnalysis().then(results => {
  console.log('\n🎯 Visual Analysis Summary:');
  console.log(`   Issues Found: ${results.issues.length}`);
  console.log(`   Visual Differences: ${results.visualDifferences.length}`);
  
  if (results.issues.length > 0) {
    console.log('\n🚨 Critical Issues:');
    results.issues.forEach(issue => {
      console.log(`   - ${issue.type}: ${issue.description}`);
    });
  }
  
  if (results.russianMenu && results.hebrewMenu) {
    const russianVisible = results.russianMenu.links.filter(link => 
      link.boundingRect.width > 0 && link.boundingRect.height > 0
    ).length;
    const hebrewVisible = results.hebrewMenu.links.filter(link => 
      link.boundingRect.width > 0 && link.boundingRect.height > 0
    ).length;
    
    console.log(`\n📊 Visibility Comparison:`);
    console.log(`   Russian visible: ${russianVisible}/${results.russianMenu.links.length}`);
    console.log(`   Hebrew visible: ${hebrewVisible}/${results.hebrewMenu.links.length}`);
  }
  
}).catch(error => {
  console.error('❌ Visual analysis failed:', error);
});
