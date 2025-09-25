const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 CTA DEBUG - Finding Source of Placeholder Text\n');

  await page.goto('http://localhost:3005/pricing.html');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000); // Wait for all scripts

  console.log('📋 STEP 1: Check HTML source content');

  // Check the raw HTML content of CTA elements
  const ctaElements = await page.evaluate(() => {
    const title = document.querySelector('[data-i18n="cta.content.title"]');
    const description = document.querySelector('[data-i18n="cta.content.description"]');

    return {
      titleHTML: title ? title.innerHTML : 'NOT_FOUND',
      titleText: title ? title.textContent.trim() : 'NOT_FOUND',
      titleDataI18n: title ? title.getAttribute('data-i18n') : 'NOT_FOUND',
      descHTML: description ? description.innerHTML : 'NOT_FOUND',
      descText: description ? description.textContent.trim() : 'NOT_FOUND',
      descDataI18n: description ? description.getAttribute('data-i18n') : 'NOT_FOUND'
    };
  });

  console.log('CTA Title:');
  console.log(`  HTML: ${ctaElements.titleHTML}`);
  console.log(`  Text: ${ctaElements.titleText}`);
  console.log(`  data-i18n: ${ctaElements.titleDataI18n}`);
  console.log('');
  console.log('CTA Description:');
  console.log(`  HTML: ${ctaElements.descHTML.substring(0, 100)}...`);
  console.log(`  Text: ${ctaElements.descText.substring(0, 100)}...`);
  console.log(`  data-i18n: ${ctaElements.descDataI18n}`);

  console.log('\n📋 STEP 2: Check for API calls');

  // Monitor network requests
  const apiCalls = [];
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      apiCalls.push({
        url: response.url(),
        status: response.status(),
        method: response.request().method()
      });
    }
  });

  // Reload to capture all API calls
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000); // Wait for all API calls

  console.log('API calls detected:');
  apiCalls.forEach(call => {
    console.log(`  ${call.method} ${call.url} - ${call.status}`);
  });

  console.log('\n📋 STEP 3: Check script loading');

  // Check which scripts loaded
  const scripts = await page.evaluate(() => {
    const scriptTags = Array.from(document.querySelectorAll('script[src]'));
    return scriptTags.map(script => ({
      src: script.src,
      loaded: script.readyState === 'complete' || script.readyState === 'loaded'
    }));
  });

  console.log('Scripts loaded:');
  scripts.forEach(script => {
    const status = script.loaded ? '✅' : '❌';
    console.log(`  ${status} ${script.src}`);
  });

  console.log('\n📋 STEP 4: Check unified-language-manager presence');

  const languageManagerPresent = await page.evaluate(() => {
    return typeof window.getLocalizedText === 'function';
  });

  console.log(`Language Manager loaded: ${languageManagerPresent ? '✅' : '❌'}`);

  if (languageManagerPresent) {
    // Try to manually call translation
    const manualTranslation = await page.evaluate(() => {
      try {
        return {
          title: window.getLocalizedText('cta.content.title'),
          description: window.getLocalizedText('cta.content.description')
        };
      } catch (e) {
        return { error: e.message };
      }
    });

    console.log('Manual translation test:');
    console.log(`  Title: ${manualTranslation.title || manualTranslation.error}`);
    console.log(`  Description: ${manualTranslation.description?.substring(0, 50) || manualTranslation.error}...`);
  }

  console.log('\n📋 FINAL DIAGNOSIS:');
  if (ctaElements.titleText === 'Call to Action Title') {
    console.log('🚨 ISSUE: CTA title still shows placeholder text');
    console.log('🔍 This suggests either:');
    console.log('   1. Database content is overriding with placeholder text');
    console.log('   2. Another script is setting this content');
    console.log('   3. Translation system is not working');
  } else {
    console.log('✅ CTA content appears to be correct');
  }

  await browser.close();
})();