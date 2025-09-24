const { chromium } = require('playwright');

(async () => {
  console.log('🔵 BLUE AGENT - Hebrew Pricing Translation Test');
  console.log('==============================================');
  
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
    } else if (text.includes('Translation') || text.includes('API')) {
      console.log('📋 CONSOLE LOG: ' + text);
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
      try {
        const body = await response.text();
        console.log('📦 API Data Preview: ' + body.substring(0, 200) + '...');
      } catch (e) {
        console.log('Could not read response body');
      }
    }
  });
  
  console.log('\n🚀 Step 1: Loading pricing page...');
  await page.goto('http://localhost:3005/pricing.html', { waitUntil: 'networkidle' });
  
  console.log('⏳ Step 2: Waiting for initial load...');
  await page.waitForTimeout(3000);
  
  // Check initial state
  console.log('\n📊 Initial State Check:');
  const initialTitle = await page.locator('[data-i18n="hero.title"]').textContent().catch(() => 'Not found');
  console.log('Hero Title (initial): "' + initialTitle + '"');
  
  console.log('\n🇮🇱 Step 3: Clicking Hebrew language button...');
  
  // Try to find and click Hebrew button
  const hebrewSelectors = [
    'text=HE',
    'text=עברית', 
    '[data-language="he"]',
    '.language-btn[data-lang="he"]',
    'a[href*="he"]'
  ];
  
  let heButton = null;
  for (const selector of hebrewSelectors) {
    try {
      heButton = page.locator(selector).first();
      if (await heButton.isVisible()) {
        console.log('Found Hebrew button with selector: ' + selector);
        break;
      }
    } catch (e) {
      // Continue searching
    }
  }
  
  if (heButton) {
    await heButton.click();
    console.log('✅ Hebrew button clicked');
  } else {
    console.log('❌ Hebrew button not found');
  }
  
  console.log('\n⏳ Step 4: Waiting for Hebrew translation...');
  await page.waitForTimeout(5000);
  
  console.log('\n🔍 Step 5: Checking translated elements...');
  
  // Test specific elements
  const elements = {
    'Hero Title': '[data-i18n="hero.title"]',
    'Hero Subtitle': '[data-i18n="hero.subtitle"]', 
    'Hero Description': '[data-i18n="hero.description"]',
    'Monthly Tab': '[data-i18n="plans.plans.monthly.name"]',
    'Yearly Tab': '[data-i18n="plans.plans.annual.name"]',
    'Monthly Period': '[data-i18n="plans.plans.monthly.period"]',
    'Yearly Period': '[data-i18n="plans.plans.annual.period"]'
  };
  
  for (const [name, selector] of Object.entries(elements)) {
    try {
      const text = await page.locator(selector).textContent();
      const hasDataI18n = await page.locator(selector).getAttribute('data-i18n');
      console.log(name + ': "' + text + '" (data-i18n: ' + (hasDataI18n ? 'present' : 'removed') + ')');
    } catch (e) {
      console.log(name + ': Not found or error');
    }
  }
  
  // Check RTL
  console.log('\n🔄 RTL Direction Check:');
  const bodyDir = await page.evaluate(() => document.body.dir);
  const htmlDir = await page.evaluate(() => document.documentElement.dir);
  console.log('Body dir: ' + bodyDir + ', HTML dir: ' + htmlDir);
  
  console.log('\n📸 Taking screenshot...');
  await page.screenshot({ path: 'hebrew-pricing-test.png', fullPage: true });
  
  console.log('\n✅ Test completed! Check hebrew-pricing-test.png for visual results.');
  
  await page.waitForTimeout(3000);
  await browser.close();
})();
