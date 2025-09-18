const { test, expect } = require('@playwright/test');

test('Test Menu Interactions', async ({ page }) => {
  await page.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html');
  await page.waitForLoadState('networkidle');

  console.log('🧭 Testing menu interactions...');

  // Test navigation links
  const navLinks = await page.$$('.nav-link');
  console.log(`Found ${navLinks.length} navigation links`);

  for (let i = 0; i < navLinks.length; i++) {
    const link = navLinks[i];
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    console.log(`Nav link ${i + 1}: "${text}" -> ${href}`);
  }

  // Test hover on "About Us" dropdown
  console.log('\n📋 Testing About Us dropdown...');
  const aboutUsDropdown = await page.$('[data-w-id="9a224b60-f557-150b-8062-e4bbef078cfb"]');
  if (aboutUsDropdown) {
    await aboutUsDropdown.hover();
    await page.waitForTimeout(500);

    const dropdownOpen = await aboutUsDropdown.evaluate(el => el.classList.contains('w--open'));
    console.log('About Us dropdown opened on hover:', dropdownOpen);

    // Check dropdown content
    const careerOrientation = await page.$('a[href="career-orientation.html"]');
    const careerCenter = await page.$('a[href="career-center.html"]');
    console.log('Career Orientation link exists:', !!careerOrientation);
    console.log('Career Center link exists:', !!careerCenter);
  }

  // Test hover on "Pages" dropdown
  console.log('\n📄 Testing Pages dropdown...');
  const pagesDropdown = await page.$('[data-w-id="9a224b60-f557-150b-8062-e4bbef078cfa"]');
  if (pagesDropdown) {
    await pagesDropdown.hover();
    await page.waitForTimeout(500);

    const dropdownOpen = await pagesDropdown.evaluate(el => el.classList.contains('w--open'));
    console.log('Pages dropdown opened on hover:', dropdownOpen);

    // Check for dropdown grid
    const dropdownGrid = await page.$('.dropdown-grid');
    console.log('Dropdown grid exists:', !!dropdownGrid);

    if (dropdownGrid) {
      const columns = await dropdownGrid.$$('.dropdown-singel-wrapper');
      console.log(`Dropdown has ${columns.length} columns`);
    }
  }

  // Test Sign Up button
  console.log('\n🔵 Testing Sign Up button...');
  const signUpButtons = await page.$$('.primary-button');
  console.log(`Found ${signUpButtons.length} sign up buttons`);

  if (signUpButtons.length > 0) {
    // Test desktop sign up button
    const desktopButton = signUpButtons[signUpButtons.length - 1]; // Last one should be desktop
    await desktopButton.click();
    await page.waitForTimeout(1000);

    // Check if popup opened
    const popup = await page.$('#contactPopup');
    const popupVisible = popup ? await popup.evaluate(el => el.classList.contains('active')) : false;
    console.log('Contact popup opened:', popupVisible);

    if (popupVisible) {
      // Close popup
      const closeButton = await page.$('.popup-close');
      if (closeButton) {
        await closeButton.click();
        await page.waitForTimeout(500);
      }
    }
  }

  // Test cart icon
  console.log('\n🛒 Testing cart functionality...');
  const cartButton = await page.$('.navbar-cart-button');
  const cartQuantity = await page.$('.cart-quantity');

  if (cartQuantity) {
    const initialQuantity = await cartQuantity.textContent();
    console.log('Initial cart quantity:', initialQuantity);

    // Test updating cart quantity
    await page.evaluate(() => {
      if (window.SharedMenu) {
        window.SharedMenu.updateCartQuantity(3);
      }
    });

    await page.waitForTimeout(500);
    const newQuantity = await cartQuantity.textContent();
    console.log('Updated cart quantity:', newQuantity);
  }

  // Test menu highlighting
  console.log('\n🎯 Testing menu highlighting...');
  await page.evaluate(() => {
    if (window.SharedMenu) {
      window.SharedMenu.highlightNavItem('courses');
    }
  });

  await page.waitForTimeout(500);
  const coursesLink = await page.$('a[href="courses.html"]');
  if (coursesLink) {
    const isActive = await coursesLink.evaluate(el => el.classList.contains('w--current'));
    console.log('Courses link highlighted:', isActive);
  }

  // Take screenshot of interactions
  await page.screenshot({ path: 'menu-interactions.png', fullPage: true });
  console.log('📸 Interaction screenshot saved');

  console.log('\n✅ Menu interaction tests completed!');
});

test('Test Mobile Menu', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html');
  await page.waitForLoadState('networkidle');

  console.log('\n📱 Testing mobile menu...');

  // Check if hamburger menu button is visible
  const menuButton = await page.$('.menu-button');
  console.log('Menu button exists:', !!menuButton);

  if (menuButton) {
    const menuButtonVisible = await menuButton.isVisible();
    console.log('Menu button visible on mobile:', menuButtonVisible);

    // Test opening mobile menu
    await menuButton.click();
    await page.waitForTimeout(500);

    const navMenu = await page.$('.nav-menu');
    if (navMenu) {
      const menuOpen = await navMenu.evaluate(el => el.classList.contains('w--open'));
      console.log('Mobile menu opened:', menuOpen);
    }

    // Take mobile screenshot
    await page.screenshot({ path: 'menu-mobile.png', fullPage: true });
    console.log('📸 Mobile menu screenshot saved');
  }
});