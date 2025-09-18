const { test, expect } = require('@playwright/test');

test('Test Menu Fixes', async ({ page }) => {
  await page.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html');
  await page.waitForLoadState('networkidle');

  console.log('🔧 Testing menu fixes...');

  // Check for 404 errors on images
  const failedRequests = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      failedRequests.push({
        url: response.url(),
        status: response.status()
      });
    }
  });

  // Wait for all resources to load
  await page.waitForTimeout(2000);

  // Test logo image
  const logo = await page.$('.zohacous-logo-image');
  if (logo) {
    const logoSrc = await logo.getAttribute('src');
    console.log('Logo src:', logoSrc);

    const logoLoaded = await logo.evaluate(img => {
      return img.complete && img.naturalHeight !== 0;
    });
    console.log('Logo loaded successfully:', logoLoaded);
  }

  // Test cart icon
  const cartIcon = await page.$('.navbar-cart-icon');
  if (cartIcon) {
    const cartSrc = await cartIcon.getAttribute('src');
    console.log('Cart icon src:', cartSrc);

    const cartLoaded = await cartIcon.evaluate(img => {
      return img.complete && img.naturalHeight !== 0;
    });
    console.log('Cart icon loaded successfully:', cartLoaded);
  }

  // Test Sign Up button styling
  const signUpButton = await page.$('.primary-button');
  if (signUpButton) {
    const buttonStyles = await signUpButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        padding: styles.padding,
        borderRadius: styles.borderRadius,
        display: styles.display
      };
    });
    console.log('Sign Up button styles:', buttonStyles);

    const buttonVisible = await signUpButton.isVisible();
    console.log('Sign Up button visible:', buttonVisible);
  }

  // Check for failed requests
  console.log('Failed requests:', failedRequests);

  // Take screenshot of fixed menu
  await page.screenshot({ path: 'menu-fixed.png', fullPage: true });
  console.log('📸 Fixed menu screenshot saved');

  // Test button interaction
  if (signUpButton) {
    await signUpButton.click();
    await page.waitForTimeout(1000);

    const popup = await page.$('#contactPopup');
    const popupVisible = popup ? await popup.evaluate(el => el.classList.contains('active')) : false;
    console.log('Contact popup opens on button click:', popupVisible);

    if (popupVisible) {
      const closeButton = await page.$('.popup-close');
      if (closeButton) {
        await closeButton.click();
        await page.waitForTimeout(500);
      }
    }
  }

  console.log('\n✅ Menu fixes test completed!');
});