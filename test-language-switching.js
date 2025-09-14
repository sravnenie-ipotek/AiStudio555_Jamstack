/**
 * Test Language Switching Functionality
 */

const puppeteer = require('puppeteer');

async function testLanguageSwitching() {
  console.log('🔄 Testing Language Switching...\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    // Test desktop language switching
    console.log('=== DESKTOP LANGUAGE SWITCHING ===');
    await page.goto('http://localhost:3005/en/home.html', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1200, height: 800 });
    await page.waitForTimeout(1500);

    console.log('Original URL:', page.url());

    try {
      const select = await page.$('#language-switcher select');
      if (select) {
        console.log('🇷🇺 Switching to Russian...');
        await page.select('#language-switcher select', 'ru');
        await page.waitForTimeout(2000);

        const newUrl = page.url();
        console.log('New URL:', newUrl);

        const switchedToRussian = newUrl.includes('/ru/');
        console.log(`Desktop switch to Russian: ${switchedToRussian ? 'Success ✅' : 'Failed ❌'}`);

        if (switchedToRussian) {
          console.log('🇮🇱 Switching to Hebrew...');
          await page.select('#language-switcher select', 'he');
          await page.waitForTimeout(2000);

          const hebrewUrl = page.url();
          console.log('Hebrew URL:', hebrewUrl);

          const switchedToHebrew = hebrewUrl.includes('/he/');
          console.log(`Desktop switch to Hebrew: ${switchedToHebrew ? 'Success ✅' : 'Failed ❌'}`);
        }
      } else {
        console.log('❌ Desktop language selector not found');
      }
    } catch (error) {
      console.log('⚠️ Desktop switching error:', error.message);
    }

    // Test mobile language switching
    console.log('\n=== MOBILE LANGUAGE SWITCHING ===');
    await page.goto('http://localhost:3005/en/home.html', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(1500);

    try {
      // Open mobile menu
      await page.click('.w-nav-button');
      await page.waitForTimeout(1000);

      const mobileSelect = await page.$('#mobile-language-select');
      if (mobileSelect) {
        console.log('📱 Found mobile language selector');
        console.log('🇷🇺 Switching to Russian on mobile...');

        await page.select('#mobile-language-select', 'ru');
        await page.waitForTimeout(2000);

        const mobileNewUrl = page.url();
        console.log('Mobile new URL:', mobileNewUrl);

        const mobileSwitchedToRussian = mobileNewUrl.includes('/ru/');
        console.log(`Mobile switch to Russian: ${mobileSwitchedToRussian ? 'Success ✅' : 'Failed ❌'}`);

      } else {
        console.log('❌ Mobile language selector not found');
      }
    } catch (error) {
      console.log('⚠️ Mobile switching error:', error.message);
    }

    console.log('\n🎉 Language switching test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

testLanguageSwitching();