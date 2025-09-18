const { test, expect } = require('@playwright/test');

test('Debug Shared Menu Component', async ({ page }) => {
  // Navigate to the demo page
  await page.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  console.log('🎯 Starting menu debug test...');

  // Check if the page loads
  const title = await page.title();
  console.log('Page title:', title);

  // Check for JavaScript errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('❌ Console error:', msg.text());
    } else if (msg.type() === 'log') {
      console.log('📝 Console log:', msg.text());
    } else if (msg.type() === 'warn') {
      console.log('⚠️ Console warn:', msg.text());
    }
  });

  // Take initial screenshot
  await page.screenshot({ path: 'menu-debug-initial.png', fullPage: true });
  console.log('📸 Initial screenshot taken');

  // Check if menu elements exist
  const navbar = await page.$('.navbar');
  console.log('Navbar exists:', !!navbar);

  if (navbar) {
    const navbarVisible = await navbar.isVisible();
    console.log('Navbar visible:', navbarVisible);

    // Check menu content
    const logo = await page.$('.zohacous-logo-image');
    console.log('Logo exists:', !!logo);

    const navLinks = await page.$$('.nav-link');
    console.log('Navigation links count:', navLinks.length);

    const dropdowns = await page.$$('.menu-dropdown-wrapper');
    console.log('Dropdown menus count:', dropdowns.length);

    const signUpButtons = await page.$$('.primary-button');
    console.log('Sign up buttons count:', signUpButtons.length);
  }

  // Check if scripts loaded
  const sharedMenuLoaded = await page.evaluate(() => {
    return typeof window.SharedMenu !== 'undefined';
  });
  console.log('SharedMenu loaded:', sharedMenuLoaded);

  const emailServiceLoaded = await page.evaluate(() => {
    return typeof window.emailService !== 'undefined';
  });
  console.log('EmailService loaded:', emailServiceLoaded);

  const contactPopupLoaded = await page.evaluate(() => {
    return typeof window.ContactPopup !== 'undefined';
  });
  console.log('ContactPopup loaded:', contactPopupLoaded);

  // Check for missing files (404 errors)
  const failedRequests = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      failedRequests.push({
        url: response.url(),
        status: response.status()
      });
      console.log(`❌ Failed request: ${response.status()} - ${response.url()}`);
    }
  });

  // Wait a bit more to catch all requests
  await page.waitForTimeout(3000);

  // Try to test menu functionality if it exists
  if (sharedMenuLoaded) {
    const menuStatus = await page.evaluate(() => {
      if (window.SharedMenu) {
        return {
          isInitialized: window.SharedMenu.isInitialized,
          currentPage: window.SharedMenu.getCurrentPage()
        };
      }
      return null;
    });
    console.log('Menu status:', menuStatus);
  }

  // Check CSS loading
  const stylesheets = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    return links.map(link => ({
      href: link.href,
      loaded: link.sheet !== null
    }));
  });

  console.log('Stylesheets:', stylesheets);

  // Check if demo container exists
  const demoContainer = await page.$('.demo-container');
  console.log('Demo container exists:', !!demoContainer);

  if (demoContainer) {
    const demoVisible = await demoContainer.isVisible();
    console.log('Demo container visible:', demoVisible);
  }

  // Take final screenshot
  await page.screenshot({ path: 'menu-debug-final.png', fullPage: true });
  console.log('📸 Final screenshot taken');

  // Report summary
  console.log('\n📊 Debug Summary:');
  console.log('- JavaScript errors:', errors.length);
  console.log('- Failed requests:', failedRequests.length);
  console.log('- Menu component loaded:', sharedMenuLoaded);
  console.log('- Navbar in DOM:', !!navbar);

  if (errors.length > 0) {
    console.log('\n❌ Errors found:');
    errors.forEach(error => console.log('  -', error));
  }

  if (failedRequests.length > 0) {
    console.log('\n🚫 Failed requests:');
    failedRequests.forEach(req => console.log(`  - ${req.status}: ${req.url}`));
  }
});

test('Test Menu Paths', async ({ page }) => {
  console.log('\n🔍 Testing file paths...');

  const baseUrl = 'http://localhost:3005/backups/newDesign/';
  const filesToTest = [
    'shared/components/sharedMenu/menu.css',
    'shared/components/sharedMenu/menu.js',
    'shared/services/emailService/emailService.js',
    'shared/components/sharedPopUp/popup.css',
    'shared/components/sharedPopUp/popup.js',
    'images/Logo.svg',
    'images/Navbar-Cart-Icon.svg'
  ];

  for (const file of filesToTest) {
    const url = baseUrl + file;
    try {
      const response = await page.goto(url);
      console.log(`✅ ${file}: ${response.status()}`);
    } catch (error) {
      console.log(`❌ ${file}: Error - ${error.message}`);
    }
  }
});