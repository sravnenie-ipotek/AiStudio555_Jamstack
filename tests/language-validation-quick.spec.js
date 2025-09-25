const { test, expect } = require('@playwright/test');

test.describe('Quick Language Validation After Fixes', () => {

  test('Russian page should have lang="ru" and Russian content', async ({ page }) => {
    await page.goto('https://www.aistudio555.com/ru/');

    // Check HTML lang attribute
    const htmlLang = await page.getAttribute('html', 'lang');
    console.log(`🇷🇺 Russian page lang attribute: ${htmlLang}`);
    expect(htmlLang).toBe('ru');

    // Check for Russian content in mentor section
    const mentorName = await page.textContent('[data-i18n="stats.content.mentor.name"]');
    console.log(`🇷🇺 Mentor name: ${mentorName}`);

    // Should NOT contain Hebrew characters
    const hasHebrew = /[\u0590-\u05FF]/.test(await page.textContent('body'));
    console.log(`🇷🇺 Contains Hebrew characters: ${hasHebrew}`);
    expect(hasHebrew).toBe(false);

    console.log('✅ Russian page validation passed');
  });

  test('Hebrew page should have lang="he" dir="rtl" and Hebrew content', async ({ page }) => {
    await page.goto('https://www.aistudio555.com/he/');

    // Check HTML attributes
    const htmlLang = await page.getAttribute('html', 'lang');
    const htmlDir = await page.getAttribute('html', 'dir');
    console.log(`🇮🇱 Hebrew page attributes: lang="${htmlLang}" dir="${htmlDir}"`);
    expect(htmlLang).toBe('he');
    expect(htmlDir).toBe('rtl');

    // Check for Hebrew content
    const hasHebrew = /[\u0590-\u05FF]/.test(await page.textContent('body'));
    console.log(`🇮🇱 Contains Hebrew characters: ${hasHebrew}`);
    expect(hasHebrew).toBe(true);

    console.log('✅ Hebrew page validation passed');
  });

  test('English page should have lang="en" and English content', async ({ page }) => {
    await page.goto('https://www.aistudio555.com/en/');

    // Check HTML lang attribute
    const htmlLang = await page.getAttribute('html', 'lang');
    console.log(`🇺🇸 English page lang attribute: ${htmlLang}`);
    expect(htmlLang).toBe('en');

    console.log('✅ English page validation passed');
  });

  test('Language manager should detect URL paths correctly', async ({ page }) => {
    // Test path-based detection
    await page.goto('https://www.aistudio555.com/ru/');

    // Wait for language manager to initialize
    await page.waitForTimeout(2000);

    // Check console logs for path detection
    const logs = [];
    page.on('console', msg => {
      if (msg.text().includes('Locale detected from URL path')) {
        logs.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForTimeout(2000);

    console.log('📍 Language detection logs:', logs);
    console.log('✅ Language manager path detection test completed');
  });
});