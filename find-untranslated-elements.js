const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });

  console.log('🔍 Finding untranslated elements on home.html...\n');

  await page.goto('http://localhost:3005/home.html');
  await page.waitForTimeout(3000); // Wait for integration scripts

  // Switch to Russian to identify untranslated elements
  await page.click('.lang-pill:has-text("RU")');
  await page.waitForTimeout(2000);

  // Find all text elements that should be translated but aren't
  const untranslatedElements = await page.evaluate(() => {
    const allTextElements = Array.from(document.querySelectorAll('a, h1, h2, h3, h4, p, span, div, button, label'))
      .filter(el => {
        const text = el.textContent.trim();
        // Filter for meaningful text elements
        return text &&
               text.length > 2 &&
               !el.querySelector('*') && // No child elements
               !/^[0-9]+$/.test(text) && // Not just numbers
               !/^[.,;:!?]+$/.test(text) && // Not just punctuation
               !text.match(/^\d+[\.,]\d+$/) && // Not decimal numbers
               !text.match(/^[\d\s\-\(\)]+$/) && // Not phone numbers
               !text.includes('@') && // Not email
               !text.match(/^https?:/) // Not URLs
      });

    const withoutI18n = allTextElements.filter(el => !el.hasAttribute('data-i18n'));
    const englishPattern = /^[a-zA-Z0-9\s\.,;:!?\-'"()&%$#@]+$/; // Only Latin characters
    const russianPattern = /[а-яё]/i;

    const untranslated = withoutI18n.filter(el => {
      const text = el.textContent.trim();
      return englishPattern.test(text) && !russianPattern.test(text);
    });

    return untranslated.map(el => ({
      text: el.textContent.trim().substring(0, 100),
      tagName: el.tagName.toLowerCase(),
      className: el.className,
      hasDataI18n: el.hasAttribute('data-i18n'),
      isVisible: el.offsetHeight > 0 && el.offsetWidth > 0,
      selector: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : ''),
      parentInfo: el.parentElement ? el.parentElement.tagName.toLowerCase() + '.' + el.parentElement.className.split(' ').join('.') : 'none'
    }));
  });

  console.log(`📋 Found ${untranslatedElements.length} untranslated elements:\n`);

  // Group by type for easier analysis
  const byType = {};
  untranslatedElements.forEach(el => {
    const type = el.tagName;
    if (!byType[type]) byType[type] = [];
    byType[type].push(el);
  });

  Object.keys(byType).forEach(type => {
    console.log(`\n🏷️  ${type.toUpperCase()} elements (${byType[type].length}):`);
    byType[type].forEach((el, i) => {
      console.log(`  ${i+1}. "${el.text}"`);
      console.log(`     Class: ${el.className || 'none'}`);
      console.log(`     Parent: ${el.parentInfo}`);
      console.log(`     Visible: ${el.isVisible}`);
      console.log('');
    });
  });

  // Take a screenshot for reference
  await page.screenshot({
    path: 'untranslated-elements-analysis.png',
    fullPage: true
  });

  await browser.close();
  console.log('✅ Analysis complete - screenshot saved as untranslated-elements-analysis.png');
})();