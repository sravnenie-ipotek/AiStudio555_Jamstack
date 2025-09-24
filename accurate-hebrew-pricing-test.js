const { chromium } = require('playwright');

(async () => {
  console.log('🔵 BLUE AGENT - Accurate Hebrew Pricing Translation Test');
  console.log('=====================================================');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log('❌ CONSOLE ERROR: ' + text);
    } else if (text.includes('Translation') || text.includes('API') || text.includes('pricing')) {
      console.log('📋 CONSOLE: ' + text);
    }
  });
  
  // Network monitoring
  page.on('request', request => {
    if (request.url().includes('api/nd/pricing-page')) {
      console.log('🌐 API REQUEST: ' + request.url());
    }
  });
  
  page.on('response', async response => {
    if (response.url().includes('api/nd/pricing-page')) {
      console.log('✅ API RESPONSE: ' + response.url() + ' - Status: ' + response.status());
    }
  });
  
  console.log('\n🚀 Step 1: Loading pricing page...');
  await page.goto('http://localhost:3005/pricing.html', { waitUntil: 'networkidle' });
  
  console.log('⏳ Step 2: Waiting for initial load...');
  await page.waitForTimeout(3000);
  
  // Check initial state using correct selectors
  console.log('\n📊 Initial State Check:');
  const initialTitle = await page.locator('[data-i18n="pricing.content.hero.title"]').textContent().catch(() => 'Not found');
  const initialMonthly = await page.locator('[data-i18n="pricing.content.plans.monthly.name"]').textContent().catch(() => 'Not found');
  const initialYearly = await page.locator('[data-i18n="pricing.content.plans.annual.name"]').textContent().catch(() => 'Not found');
  
  console.log('Hero Title (initial): "' + initialTitle + '"');
  console.log('Monthly Tab (initial): "' + initialMonthly + '"');
  console.log('Yearly Tab (initial): "' + initialYearly + '"');
  
  console.log('\n🇮🇱 Step 3: Clicking Hebrew language button...');
  
  // Find Hebrew button
  const heButton = page.locator('text=HE').first();
  if (await heButton.isVisible()) {
    await heButton.click();
    console.log('✅ Hebrew button clicked');
  } else {
    console.log('❌ Hebrew button not found');
  }
  
  console.log('\n⏳ Step 4: Waiting for Hebrew translation...');
  await page.waitForTimeout(8000); // Longer wait to ensure translation completes
  
  console.log('\n🔍 Step 5: Checking translated elements with correct selectors...');
  
  // Test specific elements with correct paths
  const elements = {
    'Hero Title': '[data-i18n="pricing.content.hero.title"]',
    'Monthly Tab': '[data-i18n="pricing.content.plans.monthly.name"]',
    'Yearly Tab': '[data-i18n="pricing.content.plans.annual.name"]',
    'Monthly Period': '[data-i18n="pricing.content.plans.monthly.period"]',
    'Yearly Period': '[data-i18n="pricing.content.plans.annual.period"]',
    'Explore Plans Button': '[data-i18n="misc.content.explore_plans"]'
  };
  
  const expectedHebrew = {
    'Hero Title': 'בחר את מסלול הלמידה שלך',
    'Monthly Tab': 'חודשי',
    'Yearly Tab': 'שנתי',
    'Monthly Period': 'לחודש',
    'Yearly Period': 'לשנה',
    'Explore Plans Button': 'גלה את תכונות החבילות'
  };
  
  for (const [name, selector] of Object.entries(elements)) {
    try {
      const text = await page.locator(selector).first().textContent();
      const hasDataI18n = await page.locator(selector).first().getAttribute('data-i18n');
      const expected = expectedHebrew[name] || 'N/A';
      const isTranslated = text === expected;
      
      console.log(name + ': "' + text + '" (expected: "' + expected + '") - ' + (isTranslated ? '✅ CORRECT' : '❌ NOT TRANSLATED'));
      console.log('  data-i18n: ' + (hasDataI18n ? 'present' : 'removed'));
    } catch (e) {
      console.log(name + ': ❌ Not found or error - ' + e.message);
    }
  }
  
  // Check RTL direction
  console.log('\n🔄 RTL Direction Check:');
  const bodyDir = await page.evaluate(() => document.body.dir);
  const htmlDir = await page.evaluate(() => document.documentElement.dir);
  console.log('Body dir: ' + bodyDir + ', HTML dir: ' + htmlDir);
  console.log('RTL Applied: ' + (htmlDir === 'rtl' ? '✅ YES' : '❌ NO'));
  
  // Count total translation success
  console.log('\n📈 Translation Summary:');
  let translated = 0;
  let total = Object.keys(elements).length;
  
  for (const [name, selector] of Object.entries(elements)) {
    try {
      const text = await page.locator(selector).first().textContent();
      const expected = expectedHebrew[name];
      if (expected && text === expected) {
        translated++;
      }
    } catch (e) {
      // Element not found
    }
  }
  
  console.log('Translation Success Rate: ' + translated + '/' + total + ' (' + Math.round(translated/total*100) + '%)');
  
  console.log('\n📸 Taking final screenshot...');
  await page.screenshot({ path: 'hebrew-pricing-final.png', fullPage: true });
  
  console.log('\n✅ Test completed! Check hebrew-pricing-final.png for visual verification.');
  
  await page.waitForTimeout(2000);
  await browser.close();
})();
