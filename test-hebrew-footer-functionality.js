const { chromium } = require('playwright');

async function testHebrewFooterFunctionality() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const results = {
    pageLoad: false,
    footerVisible: false,
    footerContent: [],
    navigationLinks: [],
    clickableLinks: [],
    consoleErrors: [],
    screenshot: null
  };

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.consoleErrors.push(msg.text());
    }
  });

  try {
    console.log('🔍 Testing Hebrew Teachers Page Footer Functionality...');

    // 1. Navigate to Hebrew teachers page
    console.log('1. Navigating to Hebrew teachers page...');
    const response = await page.goto('http://localhost:3005/he/teachers.html', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    if (response && response.ok()) {
      results.pageLoad = true;
      console.log('✅ Page loaded successfully');
    } else {
      console.log('❌ Page failed to load');
      throw new Error('Page load failed');
    }

    // Wait for dynamic content
    await page.waitForTimeout(3000);

    // 2. Check if footer section is visible
    console.log('2. Checking footer visibility...');
    const footerSelectors = [
      'footer',
      '.footer', 
      '#footer',
      '[class*="footer"]',
      '.section_footer'
    ];

    let footerElement = null;
    for (const selector of footerSelectors) {
      const element = await page.$(selector);
      if (element) {
        const isVisible = await element.isVisible();
        if (isVisible) {
          footerElement = element;
          results.footerVisible = true;
          console.log('✅ Footer found with selector:', selector);
          
          const box = await element.boundingBox();
          if (box) {
            console.log('📐 Footer position:', box);
          }
          break;
        }
      }
    }

    if (!footerElement) {
      console.log('❌ No visible footer found');
      
      // Check for hidden footers in DOM
      const hiddenFooters = await page.evaluate(() => {
        const footers = document.querySelectorAll('[class*="footer"], footer');
        return Array.from(footers).map(el => ({
          tag: el.tagName,
          className: el.className,
          visible: el.offsetParent !== null,
          hasContent: el.innerHTML.length > 50
        }));
      });
      
      console.log('Hidden footer elements:', hiddenFooters);
    }

    // 3. Look for footer navigation links
    console.log('3. Checking footer navigation links...');
    const linkSelectors = [
      'footer a',
      '.footer a', 
      '[class*="footer"] a'
    ];

    for (const selector of linkSelectors) {
      const links = await page.$$(selector);
      for (const link of links) {
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        const isVisible = await link.isVisible();
        
        if (text && text.trim()) {
          results.navigationLinks.push({
            text: text.trim(),
            href: href,
            visible: isVisible
          });
        }
      }
    }

    console.log('Found', results.navigationLinks.length, 'footer links');
    results.navigationLinks.forEach(link => {
      console.log('  -', link.text, '->', link.href, '(visible:', link.visible + ')');
    });

    // 4. Test clickable functionality
    console.log('4. Testing link functionality...');
    for (const link of results.navigationLinks.slice(0, 3)) {
      try {
        const linkEl = await page.$('a[href="' + link.href + '"]');
        if (linkEl && link.visible) {
          const isClickable = await linkEl.isEnabled();
          results.clickableLinks.push({
            text: link.text,
            href: link.href,
            clickable: isClickable
          });
          console.log('  Link "' + link.text + '" clickable:', isClickable);
        }
      } catch (error) {
        console.log('  Error testing link:', error.message);
      }
    }

    // 5. Take screenshots
    console.log('5. Taking screenshots...');
    if (footerElement) {
      await footerElement.screenshot({ 
        path: '/Users/michaelmishayev/Desktop/newCode/hebrew-footer-test.png' 
      });
      results.screenshot = '/Users/michaelmishayev/Desktop/newCode/hebrew-footer-test.png';
      console.log('📸 Footer screenshot saved');
    } else {
      await page.screenshot({ 
        path: '/Users/michaelmishayev/Desktop/newCode/hebrew-page-full.png',
        fullPage: true 
      });
      results.screenshot = '/Users/michaelmishayev/Desktop/newCode/hebrew-page-full.png';
      console.log('📸 Full page screenshot saved');
    }

    // 6. Check for footer scripts
    console.log('6. Checking footer-related scripts...');
    const footerScripts = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts
        .map(script => script.src)
        .filter(src => src.includes('footer') || src.includes('master-footer'));
    });

    console.log('Footer scripts found:', footerScripts);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    results.error = error.message;
  }

  // Report console errors
  if (results.consoleErrors.length > 0) {
    console.log('🚨 Console Errors:');
    results.consoleErrors.forEach(error => console.log('  -', error));
  }

  // Final summary
  console.log('
' + '='.repeat(50));
  console.log('📊 HEBREW FOOTER TEST RESULTS');
  console.log('='.repeat(50));
  console.log('Page Load:', results.pageLoad ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Footer Visible:', results.footerVisible ? '✅ YES' : '❌ NO');
  console.log('Navigation Links:', results.navigationLinks.length, 'found');
  console.log('Console Errors:', results.consoleErrors.length);
  console.log('Screenshot:', results.screenshot || 'None');

  if (!results.footerVisible) {
    console.log('
🔍 DIAGNOSIS: Footer missing or hidden');
    console.log('Check for:');
    console.log('- Missing footer HTML structure');
    console.log('- CSS display/visibility issues');
    console.log('- JavaScript loading errors');
    console.log('- master-footer-loader.js not working');
  }

  await browser.close();
  return results;
}

testHebrewFooterFunctionality()
  .then(() => console.log('
🎯 Test completed'))
  .catch(error => console.error('Test failed:', error));
