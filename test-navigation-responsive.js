/**
 * Navigation Responsive Test
 * Tests desktop menu visibility, mobile hamburger, and language selector
 */

const { chromium } = require('playwright');

async function testNavigation() {
  console.log('🧪 Starting Navigation Responsive Test...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
  });
  
  const results = {
    desktop: {},
    tablet: {},
    mobile: {}
  };

  try {
    // Test Desktop (1920x1080)
    console.log('💻 Testing Desktop View...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const desktopPage = await desktopContext.newPage();
    
    await desktopPage.goto('http://localhost:8000/en/home.html');
    await desktopPage.waitForTimeout(2000);
    
    // Check desktop menu visibility
    const desktopMenu = await desktopPage.locator('.nav-menu, .w-nav-menu').first();
    results.desktop.menuVisible = await desktopMenu.isVisible();
    results.desktop.menuDisplay = await desktopMenu.evaluate(el => window.getComputedStyle(el).display);
    
    // Check hamburger is hidden on desktop
    const desktopHamburger = await desktopPage.locator('.menu-button, .w-nav-button').first();
    results.desktop.hamburgerHidden = !(await desktopHamburger.isVisible());
    
    // Check language selector
    const desktopLangBtn = await desktopPage.locator('.lang-btn, .language-toggle-wrapper button').first();
    if (await desktopLangBtn.count() > 0) {
      results.desktop.languageSelector = await desktopLangBtn.evaluate(el => ({
        visible: window.getComputedStyle(el).visibility !== 'hidden',
        color: window.getComputedStyle(el).color,
        background: window.getComputedStyle(el).background
      }));
    }
    
    console.log('Desktop Results:', results.desktop);
    await desktopPage.screenshot({ path: 'test-desktop-nav.png' });
    await desktopContext.close();
    
    // Test Tablet (768x1024)
    console.log('\n📱 Testing Tablet View...');
    const tabletContext = await browser.newContext({
      viewport: { width: 768, height: 1024 }
    });
    const tabletPage = await tabletContext.newPage();
    
    await tabletPage.goto('http://localhost:8000/en/home.html');
    await tabletPage.waitForTimeout(2000);
    
    const tabletHamburger = await tabletPage.locator('.menu-button, .w-nav-button').first();
    results.tablet.hamburgerVisible = await tabletHamburger.isVisible();
    
    const tabletMenu = await tabletPage.locator('.nav-menu, .w-nav-menu').first();
    results.tablet.menuInitiallyHidden = !(await tabletMenu.isVisible());
    
    console.log('Tablet Results:', results.tablet);
    await tabletPage.screenshot({ path: 'test-tablet-nav.png' });
    await tabletContext.close();
    
    // Test Mobile (375x812 - iPhone X)
    console.log('\n📱 Testing Mobile View...');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      isMobile: true
    });
    const mobilePage = await mobileContext.newPage();
    
    await mobilePage.goto('http://localhost:8000/en/home.html');
    await mobilePage.waitForTimeout(2000);
    
    // Check hamburger visibility
    const mobileHamburger = await mobilePage.locator('.menu-button, .w-nav-button').first();
    results.mobile.hamburgerVisible = await mobileHamburger.isVisible();
    results.mobile.hamburgerSize = await mobileHamburger.evaluate(el => ({
      width: el.offsetWidth,
      height: el.offsetHeight
    }));
    
    // Check menu is initially hidden
    const mobileMenu = await mobilePage.locator('.nav-menu, .w-nav-menu').first();
    results.mobile.menuInitiallyHidden = !(await mobileMenu.isVisible());
    
    // Test hamburger click
    if (results.mobile.hamburgerVisible) {
      await mobileHamburger.click();
      await mobilePage.waitForTimeout(500);
      results.mobile.menuAfterClick = await mobileMenu.isVisible();
      
      // Click again to close
      await mobileHamburger.click();
      await mobilePage.waitForTimeout(500);
      results.mobile.menuAfterSecondClick = !(await mobileMenu.isVisible());
    }
    
    // Check language selector visibility
    const mobileLangBtn = await mobilePage.locator('.lang-btn, .language-toggle-wrapper button').first();
    if (await mobileLangBtn.count() > 0) {
      results.mobile.languageSelector = await mobileLangBtn.evaluate(el => ({
        visible: window.getComputedStyle(el).visibility !== 'hidden',
        color: window.getComputedStyle(el).color,
        background: window.getComputedStyle(el).background
      }));
    }
    
    console.log('Mobile Results:', results.mobile);
    await mobilePage.screenshot({ path: 'test-mobile-nav.png' });
    await mobileContext.close();
    
  } catch (error) {
    console.error('❌ Test Error:', error);
    results.error = error.message;
  } finally {
    await browser.close();
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  const desktopPass = results.desktop.menuVisible && results.desktop.hamburgerHidden;
  console.log(`✅ Desktop: Menu visible=${results.desktop.menuVisible}, Hamburger hidden=${results.desktop.hamburgerHidden} - ${desktopPass ? 'PASS' : 'FAIL'}`);
  
  const tabletPass = results.tablet.hamburgerVisible && results.tablet.menuInitiallyHidden;
  console.log(`✅ Tablet: Hamburger visible=${results.tablet.hamburgerVisible}, Menu hidden=${results.tablet.menuInitiallyHidden} - ${tabletPass ? 'PASS' : 'FAIL'}`);
  
  const mobilePass = results.mobile.hamburgerVisible && 
                     results.mobile.menuInitiallyHidden && 
                     results.mobile.menuAfterClick &&
                     results.mobile.menuAfterSecondClick;
  console.log(`✅ Mobile: Hamburger visible=${results.mobile.hamburgerVisible}, Toggle works=${results.mobile.menuAfterClick && results.mobile.menuAfterSecondClick} - ${mobilePass ? 'PASS' : 'FAIL'}`);
  
  const langSelectorPass = results.mobile.languageSelector?.color !== 'rgb(255, 255, 255)' || 
                           results.mobile.languageSelector?.background !== 'rgba(0, 0, 0, 0)';
  console.log(`✅ Language Selector: Visible with contrast - ${langSelectorPass ? 'PASS' : 'FAIL'}`);
  
  const allPass = desktopPass && tabletPass && mobilePass;
  console.log(`\n${allPass ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return results;
}

// Run if called directly
if (require.main === module) {
  testNavigation()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { testNavigation };