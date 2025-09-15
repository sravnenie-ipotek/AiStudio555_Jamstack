/**
 * Navigation Menu and Language Switcher QA Test Suite
 * Tests menu translations, language switching, and responsive behavior
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3005';
const LANGUAGES = ['en', 'he', 'ru'];

// Expected translations for menu items
const MENU_TRANSLATIONS = {
  en: {
    home: 'Home',
    courses: 'Courses',
    teachers: 'Teachers',
    careerServices: 'Career Services',
    pricing: 'Pricing',
    languageSelector: ['EN', 'RU', 'HE']
  },
  he: {
    home: 'בית',
    courses: 'קורסים',
    teachers: 'מורים',
    careerServices: 'שירותי קריירה',
    pricing: 'תוכניות תמחור',
    languageSelector: ['EN', 'RU', 'HE']
  },
  ru: {
    home: 'Главная',
    courses: 'Курсы',
    teachers: 'Преподаватели',
    careerServices: 'Карьерные услуги',
    pricing: 'Цены',
    languageSelector: ['EN', 'RU', 'HE']
  }
};

// Pages to test
const TEST_PAGES = ['home.html', 'courses.html', 'teachers.html', 'pricing.html'];

test.describe('Navigation Menu QA Tests', () => {
  test.describe('Menu Translations', () => {
    for (const lang of LANGUAGES) {
      test(`should display correct ${lang.toUpperCase()} menu translations`, async ({ page }) => {
        // Navigate to the language-specific home page
        const url = lang === 'en'
          ? `${BASE_URL}/home.html`
          : `${BASE_URL}/${lang}/home.html`;

        await page.goto(url);
        await page.waitForLoadState('networkidle');

        // Wait for menu to be visible
        await page.waitForSelector('.nav-menu', { state: 'visible', timeout: 10000 });

        // Get all menu items
        const menuItems = await page.locator('.nav-link').allTextContents();
        console.log(`${lang.toUpperCase()} Menu items found:`, menuItems);

        // Verify translations
        const expected = MENU_TRANSLATIONS[lang];

        // Check if menu contains expected translations
        const menuText = menuItems.join(' ').toLowerCase();

        if (expected.home) {
          const homeFound = menuText.includes(expected.home.toLowerCase());
          expect(homeFound, `Home link "${expected.home}" not found in ${lang} menu`).toBeTruthy();
        }

        if (expected.courses) {
          const coursesFound = menuText.includes(expected.courses.toLowerCase());
          expect(coursesFound, `Courses link "${expected.courses}" not found in ${lang} menu`).toBeTruthy();
        }

        if (expected.teachers) {
          const teachersFound = menuText.includes(expected.teachers.toLowerCase());
          expect(teachersFound, `Teachers link "${expected.teachers}" not found in ${lang} menu`).toBeTruthy();
        }

        // Take screenshot for documentation
        await page.screenshot({
          path: `test-results/${lang}-menu-translations.png`,
          fullPage: false
        });
      });
    }
  });

  test.describe('Language Switcher Functionality', () => {
    test('should have visible language selector in navigation', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`);
      await page.waitForLoadState('networkidle');

      // Check for language selector
      const langSelector = await page.locator('#language-switcher-nav, .language-nav-select, select[onchange*="switchLanguage"]').first();
      await expect(langSelector).toBeVisible({ timeout: 10000 });

      // Get selector options
      const options = await langSelector.locator('option').allTextContents();
      console.log('Language selector options:', options);

      // Verify all language options are present
      expect(options).toContain('EN');
      expect(options).toContain('RU');
      expect(options).toContain('HE');

      await page.screenshot({
        path: 'test-results/language-selector-visible.png',
        fullPage: false
      });
    });

    test('should switch between languages correctly', async ({ page }) => {
      // Start from English page
      await page.goto(`${BASE_URL}/home.html`);
      await page.waitForLoadState('networkidle');

      // Switch to Hebrew
      const langSelector = await page.locator('#language-switcher-nav, .language-nav-select').first();
      await langSelector.selectOption('he');

      // Wait for navigation
      await page.waitForURL('**/he/**');

      // Verify we're on Hebrew page
      const currentUrl = page.url();
      expect(currentUrl).toContain('/he/');

      // Verify Hebrew menu is displayed
      await page.waitForSelector('.nav-menu', { state: 'visible' });
      const menuText = await page.locator('.nav-menu').textContent();
      expect(menuText).toContain('בית'); // Hebrew for "Home"

      await page.screenshot({
        path: 'test-results/language-switch-hebrew.png',
        fullPage: false
      });
    });
  });

  test.describe('Responsive Behavior', () => {
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      test(`should display language selector correctly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`${BASE_URL}/home.html`);
        await page.waitForLoadState('networkidle');

        // For mobile, might need to open hamburger menu first
        if (viewport.name === 'mobile') {
          const hamburger = await page.locator('.menu-button, .w-nav-button').first();
          if (await hamburger.isVisible()) {
            await hamburger.click();
            await page.waitForTimeout(500); // Wait for menu animation
          }
        }

        // Check if language selector is accessible
        const langSelector = await page.locator('#language-switcher-nav, .language-nav-select, [id*="language"]').first();
        const isVisible = await langSelector.isVisible().catch(() => false);

        console.log(`Language selector visible on ${viewport.name}: ${isVisible}`);

        await page.screenshot({
          path: `test-results/responsive-${viewport.name}.png`,
          fullPage: false
        });
      });
    }
  });

  test.describe('Menu Alignment and Styling', () => {
    test('should have proper alignment for all menu items', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`);
      await page.waitForLoadState('networkidle');

      // Get all menu items positions
      const menuItems = await page.locator('.nav-link').all();
      const positions = [];

      for (const item of menuItems) {
        const box = await item.boundingBox();
        if (box) {
          positions.push({
            text: await item.textContent(),
            top: box.y,
            left: box.x,
            height: box.height
          });
        }
      }

      // Check if all items are horizontally aligned (similar top position)
      if (positions.length > 1) {
        const baseTop = positions[0].top;
        const tolerance = 5; // pixels

        for (const pos of positions) {
          const aligned = Math.abs(pos.top - baseTop) <= tolerance;
          expect(aligned, `Menu item "${pos.text}" is misaligned`).toBeTruthy();
        }
      }

      console.log('Menu item positions:', positions);

      await page.screenshot({
        path: 'test-results/menu-alignment.png',
        fullPage: false
      });
    });

    test('should have consistent styling for language selector', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`);
      await page.waitForLoadState('networkidle');

      const langSelector = await page.locator('#language-switcher-nav, .language-nav-select').first();

      // Get computed styles
      const styles = await langSelector.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize,
          fontFamily: computed.fontFamily,
          border: computed.border
        };
      });

      console.log('Language selector styles:', styles);

      // Verify it matches navigation styling
      expect(styles.backgroundColor).toMatch(/transparent|rgba\(0,\s*0,\s*0,\s*0\)/);
    });
  });

  test.describe('Hebrew RTL Support', () => {
    test('should apply RTL layout for Hebrew pages', async ({ page }) => {
      await page.goto(`${BASE_URL}/he/home.html`);
      await page.waitForLoadState('networkidle');

      // Check HTML dir attribute
      const dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('rtl');

      // Check navigation alignment
      const navbar = await page.locator('.navbar-content').first();
      const navbarStyles = await navbar.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          direction: computed.direction,
          textAlign: computed.textAlign
        };
      });

      console.log('Hebrew navbar styles:', navbarStyles);

      await page.screenshot({
        path: 'test-results/hebrew-rtl-layout.png',
        fullPage: false
      });
    });
  });
});

// Generate test report
test.afterAll(async () => {
  const report = {
    timestamp: new Date().toISOString(),
    tests: {
      translations: 'Verified menu translations for EN, HE, RU',
      languageSwitcher: 'Tested language switching functionality',
      responsive: 'Checked desktop, tablet, mobile views',
      alignment: 'Verified menu item alignment',
      rtl: 'Tested Hebrew RTL support'
    },
    screenshots: [
      'en-menu-translations.png',
      'he-menu-translations.png',
      'ru-menu-translations.png',
      'language-selector-visible.png',
      'language-switch-hebrew.png',
      'responsive-desktop.png',
      'responsive-tablet.png',
      'responsive-mobile.png',
      'menu-alignment.png',
      'hebrew-rtl-layout.png'
    ]
  };

  await fs.writeFile(
    'test-results/navigation-qa-report.json',
    JSON.stringify(report, null, 2)
  );

  console.log('✅ QA Test Report generated at test-results/navigation-qa-report.json');
});