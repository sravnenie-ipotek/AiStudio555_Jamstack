/**
 * Playwright Regression Test for Language Fixes
 * Can be run with: npx playwright test regression-test-language-fixes.spec.js
 */

const { test, expect } = require('@playwright/test');

test.describe('Language Fixes Regression Tests', () => {
  
  test('Production default route serves home.html', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Should serve home.html content, not index.html
    await expect(page.locator('.featured-courses')).toBeVisible();
    
    const title = await page.title();
    expect(title).toContain('AI Studio');
  });

  test('Hebrew language switcher is positioned correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/dist/he/index.html');
    
    // Language switcher should be visible
    const languageSwitcher = page.locator('#language-switcher');
    await expect(languageSwitcher).toBeVisible();
    
    // Should have all three language options
    const options = page.locator('#language-switcher select option');
    await expect(options).toHaveCount(3);
    
    // Hebrew should be selected
    const selectedValue = await page.locator('#language-switcher select').inputValue();
    expect(selectedValue).toBe('he');
    
    // Should have inline positioning (not fixed far right)
    const style = await languageSwitcher.getAttribute('style');
    expect(style).toContain('margin');
  });

  test('Russian navigation menu is complete', async ({ page }) => {
    await page.goto('http://localhost:3000/dist/ru/index.html');
    
    // Should have multiple navigation items
    const navLinks = page.locator('.nav-link');
    await expect(navLinks).toHaveCount(7);
    
    // Language switcher should be visible
    const languageSwitcher = page.locator('#language-switcher');
    await expect(languageSwitcher).toBeVisible();
    
    // Russian should be selected
    const selectedValue = await page.locator('#language-switcher select').inputValue();
    expect(selectedValue).toBe('ru');
  });

  test('No duplicate language switchers', async ({ page }) => {
    // Test Hebrew version
    await page.goto('http://localhost:3000/dist/he/index.html');
    const hebrewSwitchers = page.locator('#language-switcher, .language-switcher');
    await expect(hebrewSwitchers).toHaveCount(1);
    
    // Test Russian version
    await page.goto('http://localhost:3000/dist/ru/index.html');
    const russianSwitchers = page.locator('#language-switcher, .language-switcher');
    await expect(russianSwitchers).toHaveCount(1);
  });

  test('Language switcher functionality works', async ({ page }) => {
    await page.goto('http://localhost:3000/dist/he/index.html');
    
    // switchLanguage function should exist
    const hasSwitchFunction = await page.evaluate(() => {
      return typeof switchLanguage === 'function';
    });
    expect(hasSwitchFunction).toBe(true);
    
    // Language select should be functional
    const selectElement = page.locator('#language-switcher select');
    await expect(selectElement).toBeVisible();
    await expect(selectElement).toBeEnabled();
  });

});
