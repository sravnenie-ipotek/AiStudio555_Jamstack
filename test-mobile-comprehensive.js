const { chromium } = require('playwright');

const PAGES = [
  'home.html',
  'courses.html',
  'teachers.html',
  'career-center.html',
  'career-orientation.html',
  'pricing.html',
  'blog.html',
  'about-us.html',
  'contact-us.html'
];

const MOBILE_VIEWPORT = { width: 375, height: 812 }; // iPhone X
const BASE_URL = 'http://localhost:3005';

async function testMobilePage(page, pageName) {
  console.log(`\n📱 Testing: ${pageName}`);
  console.log('─'.repeat(50));
  
  const issues = [];
  
  try {
    // Navigate to page
    await page.goto(`${BASE_URL}/${pageName}`, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for initial render
    await page.waitForTimeout(1000);
    
    // 1. Check if mobile menu is closed by default
    console.log('  ✓ Checking mobile menu default state...');
    const mobileMenu = await page.locator('.w-nav-overlay, .nav-menu, .mobile-menu').first();
    const menuVisible = await mobileMenu.isVisible().catch(() => false);
    if (menuVisible) {
      issues.push(`❌ Mobile menu is OPEN by default (should be closed)`);
    } else {
      console.log('    ✅ Menu is closed by default');
    }
    
    // 2. Test hamburger button
    console.log('  ✓ Testing hamburger button...');
    const hamburger = await page.locator('.w-nav-button, .menu-button, .hamburger').first();
    const hamburgerVisible = await hamburger.isVisible().catch(() => false);
    if (!hamburgerVisible) {
      issues.push(`❌ Hamburger button not visible on mobile`);
    } else {
      console.log('    ✅ Hamburger button visible');
      
      // Try to click hamburger
      try {
        await hamburger.click({ timeout: 3000 });
        await page.waitForTimeout(500);
        
        const menuAfterClick = await mobileMenu.isVisible().catch(() => false);
        if (!menuAfterClick) {
          issues.push(`⚠️ Menu doesn't open when hamburger clicked`);
        } else {
          console.log('    ✅ Menu opens on hamburger click');
          
          // Close menu
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
        }
      } catch (e) {
        issues.push(`❌ Hamburger click failed: ${e.message}`);
      }
    }
    
    // 3. Test "Sign Up Today" buttons
    console.log('  ✓ Testing Sign Up buttons...');
    const signUpButtons = await page.locator('text="Sign Up Today", text="Записаться сегодня", text="הירשמו היום"').all();
    
    if (signUpButtons.length === 0) {
      console.log('    ℹ️ No Sign Up buttons found on this page');
    } else {
      console.log(`    Found ${signUpButtons.length} Sign Up button(s)`);
      
      // Test first sign up button
      const firstButton = signUpButtons[0];
      const buttonVisible = await firstButton.isVisible().catch(() => false);
      
      if (buttonVisible) {
        // Check if button stays clickable
        await page.waitForTimeout(1500); // Wait 1.5 seconds as user mentioned
        
        try {
          const stillClickable = await firstButton.isVisible({ timeout: 1000 });
          if (!stillClickable) {
            issues.push(`❌ Sign Up button becomes unavailable after 1 second`);
          } else {
            // Try to click it
            await firstButton.click({ timeout: 3000 });
            console.log('    ✅ Sign Up button clickable after 1.5s');
            
            // Check if modal opened
            const modal = await page.locator('.modal, .popup, [role="dialog"]').first();
            const modalVisible = await modal.isVisible().catch(() => false);
            if (modalVisible) {
              console.log('    ✅ Modal opened successfully');
              // Close modal
              await page.keyboard.press('Escape');
              await page.waitForTimeout(500);
            }
          }
        } catch (e) {
          issues.push(`❌ Sign Up button error: ${e.message}`);
        }
      }
    }
    
    // 4. Test all other buttons
    console.log('  ✓ Testing all buttons...');
    const allButtons = await page.locator('button, a.button, .btn, [role="button"]').all();
    console.log(`    Found ${allButtons.length} buttons`);
    
    let testedButtons = 0;
    for (const button of allButtons.slice(0, 10)) { // Test first 10 buttons
      const text = await button.textContent().catch(() => '');
      const visible = await button.isVisible().catch(() => false);
      
      if (visible && text.trim()) {
        testedButtons++;
        const clickable = await button.isEnabled().catch(() => false);
        if (!clickable) {
          issues.push(`⚠️ Button "${text.trim().substring(0, 30)}" is not clickable`);
        }
      }
    }
    console.log(`    Tested ${testedButtons} visible buttons`);
    
    // 5. Check for horizontal scrolling
    console.log('  ✓ Checking for horizontal scroll...');
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > document.body.clientWidth;
    });
    
    if (hasHorizontalScroll) {
      issues.push(`❌ Page has horizontal scrolling on mobile`);
    } else {
      console.log('    ✅ No horizontal scrolling');
    }
    
    // 6. Check viewport meta tag
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content').catch(() => null);
    if (!viewportMeta || !viewportMeta.includes('width=device-width')) {
      issues.push(`⚠️ Missing or incorrect viewport meta tag`);
    }
    
    // 7. Test touch targets
    console.log('  ✓ Checking touch target sizes...');
    const touchTargets = await page.evaluate(() => {
      const elements = document.querySelectorAll('a, button, input, select, textarea');
      const small = [];
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
          small.push({
            tag: el.tagName,
            text: el.textContent?.substring(0, 20),
            width: rect.width,
            height: rect.height
          });
        }
      });
      return small;
    });
    
    if (touchTargets.length > 0) {
      console.log(`    ⚠️ ${touchTargets.length} elements below 44px touch target size`);
    }
    
  } catch (error) {
    issues.push(`❌ Page load error: ${error.message}`);
  }
  
  return issues;
}

async function runMobileTests() {
  console.log('════════════════════════════════════════════════════════════');
  console.log('     📱 COMPREHENSIVE MOBILE RESPONSIVENESS TEST');
  console.log('════════════════════════════════════════════════════════════');
  console.log(`🌐 Testing URL: ${BASE_URL}`);
  console.log(`📏 Viewport: ${MOBILE_VIEWPORT.width}x${MOBILE_VIEWPORT.height}`);
  console.log('════════════════════════════════════════════════════════════');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100 
  });
  
  const context = await browser.newContext({
    viewport: MOBILE_VIEWPORT,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();
  
  const allIssues = {};
  
  for (const pageName of PAGES) {
    const issues = await testMobilePage(page, pageName);
    if (issues.length > 0) {
      allIssues[pageName] = issues;
    }
  }
  
  await browser.close();
  
  // Print summary
  console.log('\n');
  console.log('════════════════════════════════════════════════════════════');
  console.log('                    📊 TEST SUMMARY');
  console.log('════════════════════════════════════════════════════════════');
  
  const totalIssues = Object.values(allIssues).flat().length;
  
  if (totalIssues === 0) {
    console.log('✅ ALL TESTS PASSED! No mobile issues found.');
  } else {
    console.log(`❌ Found ${totalIssues} issues across ${Object.keys(allIssues).length} pages:\n`);
    
    for (const [page, issues] of Object.entries(allIssues)) {
      console.log(`📄 ${page}:`);
      issues.forEach(issue => {
        console.log(`   ${issue}`);
      });
      console.log('');
    }
  }
  
  console.log('════════════════════════════════════════════════════════════');
  
  return allIssues;
}

// Run the tests
runMobileTests().catch(console.error);