const { test, expect } = require('@playwright/test');

test('Test Language Switchers in Home Page', async ({ page }) => {
  console.log('🌐 Testing language switchers in home.html...');

  // Navigate to home page
  await page.goto('http://localhost:3005/backups/newDesign/home.html');
  await page.waitForLoadState('networkidle');

  // Take screenshot of navbar with language switchers
  await page.screenshot({
    path: 'home-with-language-switchers.png',
    clip: { x: 0, y: 0, width: 1280, height: 120 }
  });
  console.log('📸 Screenshot saved: home-with-language-switchers.png');

  // Test Variation 1: Minimal Dropdown
  console.log('Testing Minimal Dropdown...');
  const dropdown = await page.$('.lang-dropdown');

  if (dropdown) {
    // Check if dropdown is visible
    const isVisible = await dropdown.isVisible();
    console.log('Dropdown visible:', isVisible);

    // Test dropdown click
    await dropdown.click();
    await page.waitForTimeout(500);

    // Check if dropdown menu appears
    const dropdownMenu = await page.$('.lang-dropdown-menu');
    const menuVisible = dropdownMenu ? await dropdownMenu.isVisible() : false;
    console.log('Dropdown menu opens:', menuVisible);

    // Test language option click
    const russianOption = await page.$('.lang-option:nth-child(2)');
    if (russianOption) {
      await russianOption.click();
      console.log('✅ Russian option clicked');
    }

    // Close dropdown by clicking outside
    await page.click('body');
    await page.waitForTimeout(300);
  }

  // Test Variation 2: Pill Toggle
  console.log('Testing Pill Toggle...');
  const pillToggle = await page.$('.lang-pills');

  if (pillToggle) {
    const isVisible = await pillToggle.isVisible();
    console.log('Pill toggle visible:', isVisible);

    // Test clicking different pills
    const ruPill = await page.$('.lang-pill:nth-child(2)');
    if (ruPill) {
      await ruPill.click();
      await page.waitForTimeout(300);

      // Check if active class applied
      const hasActive = await ruPill.evaluate(el => el.classList.contains('active'));
      console.log('RU pill active state:', hasActive);
    }

    const hePill = await page.$('.lang-pill:nth-child(3)');
    if (hePill) {
      await hePill.click();
      await page.waitForTimeout(300);

      const hasActive = await hePill.evaluate(el => el.classList.contains('active'));
      console.log('HE pill active state:', hasActive);
    }
  }

  // Check positioning relative to cart
  const cart = await page.$('.navbar-cart');
  const langSwitchers = await page.$('.language-switchers');

  if (cart && langSwitchers) {
    const cartBox = await cart.boundingBox();
    const switcherBox = await langSwitchers.boundingBox();

    console.log('Cart position:', cartBox);
    console.log('Language switchers position:', switcherBox);

    // Verify language switchers are to the left of cart
    const isCorrectOrder = switcherBox.x < cartBox.x;
    console.log('Language switchers before cart:', isCorrectOrder);
  }

  // Test styling consistency
  const dropdownTrigger = await page.$('.lang-dropdown-trigger');
  if (dropdownTrigger) {
    const styles = await dropdownTrigger.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
        color: computed.color,
        borderRadius: computed.borderRadius
      };
    });

    console.log('Dropdown trigger styles:', styles);
  }

  console.log('✅ Language switcher tests completed!');
});