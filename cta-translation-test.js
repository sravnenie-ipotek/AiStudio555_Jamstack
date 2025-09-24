const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 CTA TRANSLATION TEST ACROSS ALL LANGUAGES\n');
  console.log('=' .repeat(60));

  const testResults = {
    en: { status: 'pending', title: '', description: '' },
    ru: { status: 'pending', title: '', description: '' },
    he: { status: 'pending', title: '', description: '' }
  };

  // Test each language
  for (const lang of ['en', 'ru', 'he']) {
    console.log(`\n🌐 Testing ${lang.toUpperCase()} translations...`);

    await page.goto('http://localhost:3005/pricing.html');
    await page.waitForLoadState('domcontentloaded');

    // Switch to language
    const langPill = await page.$(`[data-locale="${lang}"]`);
    if (langPill) {
      await langPill.click();
      await page.waitForTimeout(3000); // Wait for translation
    }

    // Check CTA title
    const ctaTitle = await page.$eval('[data-i18n="cta.content.title"]', el => el.textContent.trim()).catch(() => 'NOT_FOUND');
    const ctaDescription = await page.$eval('[data-i18n="cta.content.description"]', el => el.textContent.trim()).catch(() => 'NOT_FOUND');

    testResults[lang].title = ctaTitle;
    testResults[lang].description = ctaDescription;

    // Check if it's still showing placeholder text
    const isPlaceholder = ctaTitle === 'Call to Action Title' ||
                         ctaTitle === 'Discover A World Of Learning Opportunities.' ||
                         ctaDescription.includes('transform career and unlock');

    if (isPlaceholder) {
      testResults[lang].status = '❌ STILL_PLACEHOLDER';
      console.log(`❌ ${lang.toUpperCase()}: Still showing placeholder text`);
    } else if (ctaTitle === 'NOT_FOUND') {
      testResults[lang].status = '❌ ELEMENT_NOT_FOUND';
      console.log(`❌ ${lang.toUpperCase()}: CTA elements not found`);
    } else {
      testResults[lang].status = '✅ TRANSLATED';
      console.log(`✅ ${lang.toUpperCase()}: Proper translation detected`);
    }

    console.log(`   Title: "${ctaTitle}"`);
    console.log(`   Description: "${ctaDescription.substring(0, 50)}..."`);
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 CTA TRANSLATION TEST RESULTS\n');

  for (const [lang, result] of Object.entries(testResults)) {
    console.log(`${lang.toUpperCase()}:`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Title: "${result.title}"`);
    console.log(`  Description: "${result.description.substring(0, 80)}..."`);
    console.log('');
  }

  // Check if fix worked
  const successCount = Object.values(testResults).filter(r => r.status === '✅ TRANSLATED').length;
  const placeholderCount = Object.values(testResults).filter(r => r.status.includes('PLACEHOLDER')).length;

  console.log('=' .repeat(60));
  if (placeholderCount === 0 && successCount === 3) {
    console.log('🎉 SUCCESS: All CTA translations are working!');
  } else if (placeholderCount > 0) {
    console.log(`⚠️  ISSUE: ${placeholderCount} language(s) still showing placeholder text`);
  } else {
    console.log(`⚠️  MIXED: ${successCount}/3 languages working properly`);
  }

  await browser.close();
})();