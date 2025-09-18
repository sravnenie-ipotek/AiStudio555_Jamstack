const { test, expect } = require('@playwright/test');

test('Check current button state', async ({ page }) => {
  console.log('📸 Taking current screenshot of button...');

  await page.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html');
  await page.waitForLoadState('networkidle');

  // Take screenshot of navbar area
  await page.screenshot({
    path: 'current-button-state.png',
    clip: { x: 0, y: 0, width: 1280, height: 100 }
  });
  console.log('📸 Current button screenshot saved as current-button-state.png');

  // Check button computed styles
  const button = await page.$('.primary-button-wrapper.desktop .primary-button');
  if (button) {
    const styles = await button.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        border: computed.border,
        borderColor: computed.borderColor,
        color: computed.color,
        padding: computed.padding
      };
    });

    console.log('Current button styles:', styles);

    // Check if button is yellow
    const isYellow = styles.backgroundColor === 'rgb(255, 214, 89)';
    console.log('Button is yellow:', isYellow);

    if (!isYellow) {
      console.log('❌ Button is NOT yellow! Current color:', styles.backgroundColor);
    } else {
      console.log('✅ Button IS yellow!');
    }
  }
});