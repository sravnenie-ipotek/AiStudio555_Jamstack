const { chromium } = require('playwright');

async function testHebrewFooter() {
  console.log('Starting Hebrew footer test...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to Hebrew homepage
    console.log('Navigating to Hebrew homepage...');
    await page.goto('http://localhost:3005/he/index.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for potential footer loading
    console.log('Waiting for footer to load...');
    await page.waitForTimeout(3000);

    // Check if footer section exists
    const footerExists = await page.locator('footer').count() > 0;
    console.log(`Footer section exists: ${footerExists}`);

    if (!footerExists) {
      console.log('Checking for alternative footer selectors...');
      const footerAlt = await page.locator('.footer, #footer, [class*="footer"]').count();
      console.log(`Alternative footer elements found: ${footerAlt}`);
    }

    // Check for loading text
    const loadingText = await page.locator('text=Loading footer...').count();
    console.log(`"Loading footer..." text found: ${loadingText > 0}`);

    // Check for Hebrew navigation items
    const hebrewNavItems = {
      'בית': await page.locator('text=בית').count(),
      'קורסים': await page.locator('text=קורסים').count(),
      'מורים': await page.locator('text=מורים').count(),
      'תמחור': await page.locator('text=תמחור').count()
    };

    console.log('Hebrew navigation items found:');
    Object.entries(hebrewNavItems).forEach(([item, count]) => {
      console.log(`  ${item}: ${count > 0 ? '✓' : '✗'} (${count} instances)`);
    });

    // Check for career services menu
    const careerItems = {
      'כיוון קריירה': await page.locator('text=כיוון קריירה').count(),
      'מרכז קריירה': await page.locator('text=מרכז קריירה').count()
    };

    console.log('Career services items found:');
    Object.entries(careerItems).forEach(([item, count]) => {
      console.log(`  ${item}: ${count > 0 ? '✓' : '✗'} (${count} instances)`);
    });

    // Get footer content
    const footerContent = await page.locator('footer').textContent().catch(() => 'Footer not found');
    console.log(`\nFooter content preview: ${footerContent.substring(0, 200)}...`);

    // Scroll to footer and take screenshot
    console.log('Taking screenshot of footer area...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const screenshotPath = '/Users/michaelmishayev/Desktop/newCode/hebrew-footer-test.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    // Also take a focused screenshot of just the footer
    const footerElement = await page.locator('footer').first();
    if (await footerElement.count() > 0) {
      const footerScreenshotPath = '/Users/michaelmishayev/Desktop/newCode/hebrew-footer-focused.png';
      await footerElement.screenshot({ path: footerScreenshotPath });
      console.log(`Focused footer screenshot saved to: ${footerScreenshotPath}`);
    }

    // Summary
    console.log('\n=== TEST SUMMARY ===');
    const hasHebrewNav = Object.values(hebrewNavItems).some(count => count > 0);
    const hasCareerMenu = Object.values(careerItems).some(count => count > 0);
    const noLoadingText = loadingText === 0;

    console.log(`Footer section visible: ${footerExists ? '✓' : '✗'}`);
    console.log(`Hebrew navigation menu: ${hasHebrewNav ? '✓' : '✗'}`);
    console.log(`Career services menu: ${hasCareerMenu ? '✓' : '✗'}`);
    console.log(`No "Loading footer..." text: ${noLoadingText ? '✓' : '✗'}`);

    const allTestsPassed = footerExists && hasHebrewNav && hasCareerMenu && noLoadingText;
    console.log(`\nOverall result: ${allTestsPassed ? '✅ PASS' : '❌ FAIL'}`);

  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    await browser.close();
  }
}

testHebrewFooter().catch(console.error);