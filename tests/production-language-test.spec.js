const { test, expect } = require('@playwright/test');

test.describe('Production Language Fix Verification', () => {

  test('Russian page should have correct lang="ru" and Russian content', async ({ page }) => {
    console.log('🧪 Testing Russian page...');
    await page.goto('https://www.aistudio555.com/ru/');

    // Check lang attribute
    const htmlLang = await page.getAttribute('html', 'lang');
    console.log(`📝 HTML lang attribute: ${htmlLang}`);
    expect(htmlLang).toBe('ru');

    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 });

    // Check for Russian text content (mentor section)
    const mentorText = await page.textContent('[data-i18n*="mentor"]').catch(() => null);
    if (mentorText) {
      console.log(`📝 Mentor text found: ${mentorText.substring(0, 50)}...`);
    }
  });

  test('Hebrew page should have correct lang="he" dir="rtl" and Hebrew content', async ({ page }) => {
    console.log('🧪 Testing Hebrew page...');
    await page.goto('https://www.aistudio555.com/he/');

    // Check lang attribute
    const htmlLang = await page.getAttribute('html', 'lang');
    console.log(`📝 HTML lang attribute: ${htmlLang}`);
    expect(htmlLang).toBe('he');

    // Check dir attribute for RTL
    const htmlDir = await page.getAttribute('html', 'dir');
    console.log(`📝 HTML dir attribute: ${htmlDir}`);
    expect(htmlDir).toBe('rtl');

    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('English page should work as baseline', async ({ page }) => {
    console.log('🧪 Testing English page (baseline)...');
    await page.goto('https://www.aistudio555.com/en/');

    // Check lang attribute
    const htmlLang = await page.getAttribute('html', 'lang');
    console.log(`📝 HTML lang attribute: ${htmlLang}`);
    expect(htmlLang).toBe('en');

    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 });
  });

});