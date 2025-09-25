/**
 * Hebrew Course Details Button Fix Test
 * Tests the double text issue fix for Hebrew locale
 */

const { test, expect } = require('@playwright/test');

test.describe('Hebrew Course Details Button Fix', () => {
  test('should not display double text in Hebrew buttons on course details page', async ({ page }) => {
    // Start the dev server in background if not running
    console.log('Testing Hebrew course details page for double text issue...');

    // Navigate to Hebrew course details page
    await page.goto('http://localhost:3005/detail_courses.html?id=3&locale=he');

    // Wait for page to load and language to be applied
    await page.waitForTimeout(3000);

    // Check navigation buttons don't have double text
    const signUpButtons = page.locator('[data-i18n*="sign_up_today"], .primary-button-text-block');
    const buttonCount = await signUpButtons.count();

    console.log(`Found ${buttonCount} buttons to check`);

    // Check each button for duplicate text patterns
    for (let i = 0; i < buttonCount; i++) {
      const button = signUpButtons.nth(i);
      const text = await button.textContent();

      if (text && text.trim()) {
        console.log(`Button ${i + 1} text: "${text}"`);

        // Check for double text patterns (same text repeated)
        const words = text.trim().split(/\s+/);
        const uniqueWords = [...new Set(words)];

        // If we have significantly fewer unique words than total words, likely duplicate text
        if (words.length > uniqueWords.length * 1.5) {
          console.warn(`Potential duplicate text detected in button ${i + 1}: "${text}"`);
        }

        // Check for specific Hebrew duplicates
        if (text.includes('הירשם היום') && text.split('הירשם היום').length > 2) {
          console.error(`Hebrew duplicate text found in button ${i + 1}: "${text}"`);
          throw new Error(`Button contains duplicate Hebrew text: ${text}`);
        }

        // Check for mixed Hebrew/English (shouldn't happen in Hebrew locale)
        if (text.match(/[\u0590-\u05FF]/) && text.match(/[A-Za-z]/)) {
          console.warn(`Mixed Hebrew/English text in button ${i + 1}: "${text}"`);
        }
      }
    }

    // Test specific course page buttons
    const enrollButton = page.locator('.courses-single-enroll-button .primary-button-text-block').first();
    if (await enrollButton.isVisible()) {
      const enrollText = await enrollButton.textContent();
      console.log(`Enroll button text: "${enrollText}"`);

      // Should not contain duplicate text
      expect(enrollText).not.toMatch(/(.+)\1/); // No repeated patterns

      // Should be in Hebrew for Hebrew locale
      if (enrollText && enrollText.trim()) {
        expect(enrollText).toMatch(/[\u0590-\u05FF]/); // Contains Hebrew characters
      }
    }

    // Test CTA buttons
    const ctaButtons = page.locator('.cta-button-wrapper .primary-button-text-block');
    const ctaCount = await ctaButtons.count();

    for (let i = 0; i < ctaCount; i++) {
      const button = ctaButtons.nth(i);
      const text = await button.textContent();

      if (text && text.trim()) {
        console.log(`CTA button ${i + 1} text: "${text}"`);

        // Should not contain duplicate patterns
        expect(text).not.toMatch(/(.+)\1/);

        // Check Hebrew content is proper
        if (text.match(/[\u0590-\u05FF]/)) {
          // Hebrew text should not be mixed with English
          expect(text).not.toMatch(/[A-Za-z]/);
        }
      }
    }

    // Verify RTL is applied for Hebrew
    const htmlDir = await page.getAttribute('html', 'dir');
    expect(htmlDir).toBe('rtl');

    // Take a screenshot for visual verification
    await page.screenshot({
      path: 'tests/screenshots/hebrew-course-details-fixed.png',
      fullPage: true
    });

    console.log('✅ Hebrew button double text test completed successfully');
  });

  test('should properly sync absolute text elements without duplication', async ({ page }) => {
    // Navigate to Hebrew course details page
    await page.goto('http://localhost:3005/detail_courses.html?id=3&locale=he');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Check that absolute text elements match their normal counterparts
    const buttons = page.locator('.primary-button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);

      const normalText = button.locator('.primary-button-text-block:not(.is-text-absolute)');
      const absoluteText = button.locator('.primary-button-text-block.is-text-absolute');

      if (await normalText.isVisible() && await absoluteText.isVisible()) {
        const normalContent = await normalText.textContent();
        const absoluteContent = await absoluteText.textContent();

        console.log(`Button ${i + 1} - Normal: "${normalContent}", Absolute: "${absoluteContent}"`);

        // Both should have the same content
        expect(normalContent?.trim()).toBe(absoluteContent?.trim());

        // Both should be Hebrew (not English)
        if (normalContent && normalContent.trim()) {
          expect(normalContent).toMatch(/[\u0590-\u05FF]/);
          expect(absoluteContent).toMatch(/[\u0590-\u05FF]/);
        }
      }
    }

    console.log('✅ Absolute text sync test completed successfully');
  });

  test('should handle language switching without creating double text', async ({ page }) => {
    // Start with English
    await page.goto('http://localhost:3005/detail_courses.html?id=3&locale=en');
    await page.waitForTimeout(1500);

    // Switch to Hebrew
    const hebrewButton = page.locator('.lang-pill[data-locale="he"], .mobile-lang-pill').first();
    if (await hebrewButton.isVisible()) {
      await hebrewButton.click();
      await page.waitForTimeout(2000);

      // Check that buttons now show Hebrew without duplication
      const buttons = page.locator('.primary-button-text-block');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();

        if (text && text.trim()) {
          console.log(`Post-switch button ${i + 1}: "${text}"`);

          // Should not have duplicate patterns
          expect(text).not.toMatch(/(.+)\1/);

          // Should not have mixed languages
          if (text.match(/[\u0590-\u05FF]/)) {
            expect(text).not.toMatch(/[A-Za-z]/);
          }
        }
      }
    }

    console.log('✅ Language switching test completed successfully');
  });
});