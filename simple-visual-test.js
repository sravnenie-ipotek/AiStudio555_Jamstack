/**
 * Simple Visual Test for Language Selector
 * Takes screenshots and reports basic findings
 */

const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:3005/en/home.html';

async function simpleVisualTest() {
  console.log('🧪 Starting Simple Visual Test...\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security'
      ]
    });

    const page = await browser.newPage();

    // Monitor console and network
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });

    console.log('🌐 Loading page...');
    await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);

    // Desktop Test
    console.log('\n=== DESKTOP TEST (1200px) ===');
    await page.setViewport({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);

    const desktopExists = await page.$('#language-switcher') !== null;
    console.log(`Desktop selector exists: ${desktopExists ? '✅' : '❌'}`);

    if (desktopExists) {
      const selectorInfo = await page.evaluate(() => {
        const selector = document.getElementById('language-switcher');
        const rect = selector.getBoundingClientRect();
        const style = window.getComputedStyle(selector);
        return {
          visible: rect.width > 0 && rect.height > 0 && style.display !== 'none',
          position: { x: Math.round(rect.x), y: Math.round(rect.y) },
          size: { width: Math.round(rect.width), height: Math.round(rect.height) }
        };
      });

      console.log(`Desktop selector visible: ${selectorInfo.visible ? '✅' : '❌'}`);
      console.log(`Desktop selector position: x=${selectorInfo.position.x}, y=${selectorInfo.position.y}`);
      console.log(`Desktop selector size: ${selectorInfo.size.width}x${selectorInfo.size.height}`);
    }

    await page.screenshot({
      path: '/Users/michaelmishayev/Desktop/newCode/desktop-test-final.png',
      fullPage: false
    });
    console.log('📸 Desktop screenshot saved: desktop-test-final.png');

    // Mobile Test
    console.log('\n=== MOBILE TEST (375px) ===');
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const mobileDesktopHidden = await page.evaluate(() => {
      const selector = document.getElementById('language-switcher');
      if (!selector) return 'not found';
      const style = window.getComputedStyle(selector);
      const rect = selector.getBoundingClientRect();
      return style.display === 'none' || rect.width === 0;
    });

    console.log(`Desktop selector hidden on mobile: ${mobileDesktopHidden === true ? '✅' : mobileDesktopHidden === 'not found' ? '❓ not found' : '❌'}`);

    const hamburgerExists = await page.$('.w-nav-button') !== null;
    console.log(`Hamburger button exists: ${hamburgerExists ? '✅' : '❌'}`);

    if (hamburgerExists) {
      console.log('Testing hamburger click...');
      await page.click('.w-nav-button');
      await page.waitForTimeout(500);

      const menuOpen = await page.evaluate(() => {
        return document.body.classList.contains('w--nav-menu-open');
      });

      console.log(`Menu opens when hamburger clicked: ${menuOpen ? '✅' : '❌'}`);

      if (menuOpen) {
        const mobileLangExists = await page.evaluate(() => {
          return document.querySelector('.mobile-language-selector, #mobile-language-select') !== null;
        });
        console.log(`Mobile language selector in menu: ${mobileLangExists ? '✅' : '❌'}`);
      }
    }

    await page.screenshot({
      path: '/Users/michaelmishayev/Desktop/newCode/mobile-test-final.png',
      fullPage: false
    });
    console.log('📸 Mobile screenshot saved: mobile-test-final.png');

    // Error Report
    console.log('\n=== ERROR SUMMARY ===');
    console.log(`Total errors found: ${errors.length}`);
    if (errors.length > 0) {
      errors.forEach(error => console.log(`❌ ${error}`));
    } else {
      console.log('✅ No errors detected');
    }

    console.log('\n🎉 Test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

simpleVisualTest().catch(console.error);