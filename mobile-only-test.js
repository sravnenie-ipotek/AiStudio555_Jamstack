/**
 * Mobile-Only Test for Language Selector
 */

const puppeteer = require('puppeteer');

async function mobileOnlyTest() {
  console.log('📱 Mobile-Only Test...');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3005/en/home.html', { waitUntil: 'networkidle2' });

    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(2000);

    console.log('Taking mobile screenshot...');
    await page.screenshot({
      path: '/Users/michaelmishayev/Desktop/newCode/mobile-test-final.png',
      fullPage: false
    });

    // Check hamburger and menu
    const hamburger = await page.$('.w-nav-button');
    if (hamburger) {
      console.log('Clicking hamburger...');
      await page.click('.w-nav-button');
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/newCode/mobile-menu-open-final.png',
        fullPage: false
      });

      console.log('Mobile screenshots saved!');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

mobileOnlyTest();