const { test, expect } = require('@playwright/test');

test('Compare Sign Up Buttons', async ({ page }) => {
  console.log('🔍 Comparing Sign Up buttons between pages...');

  // First, check the teachers.html page button
  await page.goto('http://localhost:3005/backups/newDesign/teachers.html');
  await page.waitForLoadState('networkidle');

  const teachersButton = await page.$('.primary-button-wrapper.desktop .primary-button');
  let teachersButtonStyles = null;

  if (teachersButton) {
    teachersButtonStyles = await teachersButton.evaluate(el => {
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
        height: styles.height,
        width: styles.width,
        display: styles.display,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems
      };
    });

    // Get the button text content
    const teachersButtonText = await teachersButton.textContent();
    console.log('Teachers page button text:', teachersButtonText);

    // Check the text animation structure
    const textWrap = await teachersButton.$('.primary-button-text-wrap');
    const textBlocks = await teachersButton.$$('.primary-button-text-block');

    console.log('Teachers button has text wrap:', !!textWrap);
    console.log('Teachers button text blocks count:', textBlocks.length);

    if (textBlocks.length > 0) {
      for (let i = 0; i < textBlocks.length; i++) {
        const blockText = await textBlocks[i].textContent();
        const blockClasses = await textBlocks[i].getAttribute('class');
        console.log(`Text block ${i + 1}: "${blockText}" - classes: ${blockClasses}`);
      }
    }
  }

  console.log('Teachers page button styles:', teachersButtonStyles);

  // Take screenshot of teachers page
  await page.screenshot({ path: 'teachers-button.png', clip: { x: 0, y: 0, width: 1280, height: 100 } });

  // Now check the demo page button
  await page.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html');
  await page.waitForLoadState('networkidle');

  const demoButton = await page.$('.primary-button-wrapper.desktop .primary-button');
  let demoButtonStyles = null;

  if (demoButton) {
    demoButtonStyles = await demoButton.evaluate(el => {
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
        height: styles.height,
        width: styles.width,
        display: styles.display,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems
      };
    });

    // Get the button text content
    const demoButtonText = await demoButton.textContent();
    console.log('Demo page button text:', demoButtonText);

    // Check the text animation structure
    const textWrap = await demoButton.$('.primary-button-text-wrap');
    const textBlocks = await demoButton.$$('.primary-button-text-block');

    console.log('Demo button has text wrap:', !!textWrap);
    console.log('Demo button text blocks count:', textBlocks.length);

    if (textBlocks.length > 0) {
      for (let i = 0; i < textBlocks.length; i++) {
        const blockText = await textBlocks[i].textContent();
        const blockClasses = await textBlocks[i].getAttribute('class');
        console.log(`Text block ${i + 1}: "${blockText}" - classes: ${blockClasses}`);
      }
    }
  }

  console.log('Demo page button styles:', demoButtonStyles);

  // Take screenshot of demo page
  await page.screenshot({ path: 'demo-button.png', clip: { x: 0, y: 0, width: 1280, height: 100 } });

  // Compare the styles
  if (teachersButtonStyles && demoButtonStyles) {
    console.log('\n🔄 Style Comparison:');
    const keys = Object.keys(teachersButtonStyles);

    for (const key of keys) {
      const teachersValue = teachersButtonStyles[key];
      const demoValue = demoButtonStyles[key];
      const match = teachersValue === demoValue;

      console.log(`${key}: ${match ? '✅' : '❌'}`);
      if (!match) {
        console.log(`  Teachers: ${teachersValue}`);
        console.log(`  Demo: ${demoValue}`);
      }
    }
  }

  // Check original teachers.html HTML structure
  await page.goto('http://localhost:3005/backups/newDesign/teachers.html');
  await page.waitForLoadState('networkidle');

  const teachersButtonHTML = await page.$eval('.primary-button-wrapper.desktop', el => el.outerHTML);
  console.log('\n📝 Teachers page button HTML:');
  console.log(teachersButtonHTML);
});

test('Extract Teachers Button Styling', async ({ page }) => {
  await page.goto('http://localhost:3005/backups/newDesign/teachers.html');
  await page.waitForLoadState('networkidle');

  // Get all CSS rules that apply to the button
  const buttonCssRules = await page.evaluate(() => {
    const button = document.querySelector('.primary-button-wrapper.desktop .primary-button');
    if (!button) return null;

    const rules = [];
    const sheets = Array.from(document.styleSheets);

    sheets.forEach(sheet => {
      try {
        const cssRules = Array.from(sheet.cssRules || sheet.rules);
        cssRules.forEach(rule => {
          if (rule.type === CSSRule.STYLE_RULE) {
            try {
              if (button.matches(rule.selectorText)) {
                rules.push({
                  selector: rule.selectorText,
                  cssText: rule.style.cssText
                });
              }
            } catch (e) {
              // Invalid selector, skip
            }
          }
        });
      } catch (e) {
        // CORS or other access issue, skip
      }
    });

    return rules;
  });

  console.log('\n📋 CSS Rules applying to teachers button:');
  if (buttonCssRules) {
    buttonCssRules.forEach(rule => {
      console.log(`Selector: ${rule.selector}`);
      console.log(`Styles: ${rule.cssText}`);
      console.log('---');
    });
  }
});