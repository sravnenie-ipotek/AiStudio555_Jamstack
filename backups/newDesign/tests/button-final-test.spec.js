const { test, expect } = require('@playwright/test');

test('Test Updated Button Design', async ({ page }) => {
  console.log('🎨 Testing updated Sign Up button design...');

  // Check the updated demo page button
  await page.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html');
  await page.waitForLoadState('networkidle');

  const demoButton = await page.$('.primary-button-wrapper.desktop .primary-button');

  if (demoButton) {
    const updatedStyles = await demoButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        padding: styles.padding,
        borderRadius: styles.borderRadius,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        border: styles.border,
        textTransform: styles.textTransform,
        lineHeight: styles.lineHeight,
        display: styles.display,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems
      };
    });

    console.log('Updated demo button styles:', updatedStyles);

    // Check if button is visible and has correct dimensions
    const buttonVisible = await demoButton.isVisible();
    const buttonBoundingBox = await demoButton.boundingBox();

    console.log('Button visible:', buttonVisible);
    console.log('Button dimensions:', buttonBoundingBox);

    // Take screenshot of updated button
    await page.screenshot({ path: 'demo-button-updated.png', clip: { x: 0, y: 0, width: 1280, height: 100 } });
    console.log('📸 Updated demo button screenshot saved');

    // Test button interaction
    if (buttonVisible) {
      try {
        await demoButton.click();
        await page.waitForTimeout(1000);

        const popup = await page.$('#contactPopup');
        const popupVisible = popup ? await popup.evaluate(el => el.classList.contains('active')) : false;
        console.log('Contact popup opens on button click:', popupVisible);

        if (popupVisible) {
          console.log('✅ Button click functionality working');
          const closeButton = await page.$('.popup-close');
          if (closeButton) {
            await closeButton.click();
            await page.waitForTimeout(500);
          }
        }
      } catch (error) {
        console.log('❌ Button click failed:', error.message);
      }
    }
  }

  // Compare with teachers page again to confirm match
  await page.goto('http://localhost:3005/backups/newDesign/teachers.html');
  await page.waitForLoadState('networkidle');

  const teachersButton = await page.$('.primary-button-wrapper.desktop .primary-button');

  if (teachersButton) {
    const teachersStyles = await teachersButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        padding: styles.padding,
        borderRadius: styles.borderRadius,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        border: styles.border,
        textTransform: styles.textTransform,
        lineHeight: styles.lineHeight,
        display: styles.display,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems
      };
    });

    console.log('Teachers button styles for comparison:', teachersStyles);

    // Now compare the key properties
    if (demoButton && updatedStyles && teachersStyles) {
      console.log('\n🔄 Final Style Comparison:');
      const criticalProperties = ['backgroundColor', 'padding', 'borderRadius', 'border', 'display'];

      let allMatch = true;
      for (const prop of criticalProperties) {
        const match = updatedStyles[prop] === teachersStyles[prop];
        console.log(`${prop}: ${match ? '✅' : '❌'}`);
        if (!match) {
          console.log(`  Demo: ${updatedStyles[prop]}`);
          console.log(`  Teachers: ${teachersStyles[prop]}`);
          allMatch = false;
        }
      }

      console.log(`\n${allMatch ? '🎉 All critical styles match!' : '⚠️ Some styles still differ'}`);
    }
  }
});