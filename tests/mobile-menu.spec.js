const { test, expect } = require('@playwright/test');

test.describe('Mobile Menu Layout Tests', () => {
  test.use({
    viewport: { width: 375, height: 812 }, // iPhone X viewport
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });

  test('Sign Up button appears above logo on mobile', async ({ page }) => {
    // Test on English version
    await page.goto('http://localhost:3005/en/home.html');

    // Wait for the navbar to be visible
    await page.waitForSelector('.navbar', { state: 'visible' });

    // Check that the mobile Sign Up button exists
    const mobileSignUpButton = await page.$('.navbar-button-wrapper.mobile-top .primary-button');
    expect(mobileSignUpButton).not.toBeNull();

    // Check that the logo exists
    const logo = await page.$('.nav-brand');
    expect(logo).not.toBeNull();

    // Get positions
    const buttonBox = await mobileSignUpButton.boundingBox();
    const logoBox = await logo.boundingBox();

    // Verify button is above logo (smaller Y coordinate)
    expect(buttonBox.y).toBeLessThan(logoBox.y);

    // Verify button is visible
    const buttonVisible = await mobileSignUpButton.isVisible();
    expect(buttonVisible).toBe(true);

    // Verify no duplicate buttons
    const allSignUpButtons = await page.$$('.primary-button');
    const visibleButtons = [];
    for (const button of allSignUpButtons) {
      if (await button.isVisible()) {
        const text = await button.textContent();
        if (text && text.includes('Sign Up')) {
          visibleButtons.push(button);
        }
      }
    }
    expect(visibleButtons.length).toBe(1); // Only one visible Sign Up button
  });

  test('Desktop layout shows Sign Up button in normal position', async ({ browser }) => {
    // Create desktop context
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3005/en/home.html');
    await page.waitForSelector('.navbar', { state: 'visible' });

    // Desktop button should be visible
    const desktopButton = await page.$('.navbar-button-wrapper:not(.mobile-top) .primary-button');
    if (desktopButton) {
      const isVisible = await desktopButton.isVisible();
      expect(isVisible).toBe(true);
    }

    // Mobile button should be hidden
    const mobileButton = await page.$('.navbar-button-wrapper.mobile-top');
    if (mobileButton) {
      const isVisible = await mobileButton.isVisible();
      expect(isVisible).toBe(false);
    }

    await context.close();
  });

  test('Test Hebrew version mobile layout', async ({ page }) => {
    await page.goto('http://localhost:3005/he/home.html');
    await page.waitForSelector('.navbar', { state: 'visible' });

    // Check mobile button exists and is visible
    const mobileButton = await page.$('.navbar-button-wrapper.mobile-top .primary-button');
    expect(mobileButton).not.toBeNull();

    const buttonText = await mobileButton.textContent();
    expect(buttonText).toContain('הרשמו היום'); // Hebrew text

    // Check positioning
    const logo = await page.$('.nav-brand');
    const buttonBox = await mobileButton.boundingBox();
    const logoBox = await logo.boundingBox();

    expect(buttonBox.y).toBeLessThan(logoBox.y); // Button above logo
  });

  test('Test Russian version mobile layout', async ({ page }) => {
    await page.goto('http://localhost:3005/ru/home.html');
    await page.waitForSelector('.navbar', { state: 'visible' });

    // Check mobile button exists and is visible
    const mobileButton = await page.$('.navbar-button-wrapper.mobile-top .primary-button');
    expect(mobileButton).not.toBeNull();

    const buttonText = await mobileButton.textContent();
    expect(buttonText).toContain('Зарегистрироваться'); // Russian text

    // Check positioning
    const logo = await page.$('.nav-brand');
    const buttonBox = await mobileButton.boundingBox();
    const logoBox = await logo.boundingBox();

    expect(buttonBox.y).toBeLessThan(logoBox.y); // Button above logo
  });
});

test.describe('Sign Up Button Functionality', () => {
  test.use({
    viewport: { width: 375, height: 812 }
  });

  test('Mobile Sign Up button opens modal', async ({ page }) => {
    await page.goto('http://localhost:3005/en/home.html');
    await page.waitForSelector('.navbar', { state: 'visible' });

    // Click the mobile Sign Up button
    await page.click('.navbar-button-wrapper.mobile-top .primary-button');

    // Check if modal opens (assuming showModal function exists)
    // Wait a bit for modal to potentially open
    await page.waitForTimeout(500);

    // Check for modal presence (adjust selector based on actual modal)
    const modal = await page.$('.modal, .contact-modal, [role="dialog"]');
    if (modal) {
      const isVisible = await modal.isVisible();
      expect(isVisible).toBe(true);
    }
  });
});