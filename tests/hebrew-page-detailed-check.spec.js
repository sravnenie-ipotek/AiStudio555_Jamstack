const { test, expect } = require('@playwright/test');

test.describe('Hebrew Page Detailed Analysis', () => {

  test('Hebrew page comprehensive translation check', async ({ page }) => {
    console.log('🕵️ Starting detailed Hebrew page analysis...');

    // Navigate to Hebrew page
    await page.goto('https://www.aistudio555.com/he/', { waitUntil: 'networkidle' });

    // Wait for page to fully load
    await page.waitForTimeout(3000);

    // Check HTML attributes
    const htmlLang = await page.getAttribute('html', 'lang');
    const htmlDir = await page.getAttribute('html', 'dir');
    console.log(`📝 HTML lang: ${htmlLang}, dir: ${htmlDir}`);

    // Take a full page screenshot
    await page.screenshot({
      path: 'test-results/screenshots/hebrew-page-full.png',
      fullPage: true
    });
    console.log('📸 Full page screenshot saved');

    // Check for Hebrew text in key sections
    const heroTitle = await page.textContent('h1').catch(() => 'NOT FOUND');
    console.log(`🔤 Hero title: "${heroTitle.substring(0, 100)}..."`);

    // Check mentor section specifically
    const mentorElements = await page.locator('[data-i18n*="mentor"], .mentor, [class*="mentor"]').all();
    console.log(`👨‍🏫 Found ${mentorElements.length} mentor elements`);

    for (let i = 0; i < mentorElements.length; i++) {
      const mentorText = await mentorElements[i].textContent().catch(() => '');
      if (mentorText.trim()) {
        console.log(`👨‍🏫 Mentor element ${i + 1}: "${mentorText.substring(0, 50)}..."`);
      }
    }

    // Check navigation menu
    const navItems = await page.locator('nav a, .nav a, .navigation a').all();
    console.log(`🧭 Found ${navItems.length} navigation items`);

    for (let i = 0; i < Math.min(navItems.length, 5); i++) {
      const navText = await navItems[i].textContent().catch(() => '');
      if (navText.trim()) {
        console.log(`🧭 Nav ${i + 1}: "${navText.trim()}"`);
      }
    }

    // Check for English text that shouldn't be there
    const pageContent = await page.textContent('body');
    const englishWords = ['Learn', 'Course', 'Training', 'Expert', 'Machine Learning'];
    const foundEnglish = englishWords.filter(word => pageContent.includes(word));

    if (foundEnglish.length > 0) {
      console.log(`⚠️ Found English words: ${foundEnglish.join(', ')}`);
    } else {
      console.log('✅ No obvious English words found');
    }

    // Check for Hebrew characters
    const hasHebrewChars = /[\u0590-\u05FF]/.test(pageContent);
    console.log(`🔤 Contains Hebrew characters: ${hasHebrewChars}`);

    // Check page title
    const pageTitle = await page.title();
    console.log(`📄 Page title: "${pageTitle}"`);

    console.log('🏁 Hebrew page analysis complete');
  });

});