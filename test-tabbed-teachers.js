const { chromium } = require('playwright');

async function testTabbedTeachers() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🧪 Testing new tabbed teachers page...');

  try {
    console.log('\n🌐 Loading teachers page...');
    await page.goto('http://localhost:3005/en/teachers.html');

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Check for tabbed interface
    const tabs = await page.locator('.tab-btn, .category-tab, [data-tab]').count();
    const teacherCards = await page.locator('.teacher-card-minimal, .teacher-card').count();
    const contactButtons = await page.locator('.contact-teacher-btn, button[class*="contact"]').count();

    console.log(`\n📊 Interface Elements:`);
    console.log(`   Tab buttons found: ${tabs}`);
    console.log(`   Teacher cards: ${teacherCards}`);
    console.log(`   Contact buttons: ${contactButtons}`);

    // Test tab functionality if tabs exist
    if (tabs > 0) {
      const firstTab = page.locator('.tab-btn, .category-tab, [data-tab]').first();
      if (await firstTab.isVisible()) {
        console.log('\n🔄 Testing tab interaction...');
        await firstTab.click();
        await page.waitForTimeout(1000);
        console.log('✅ Tab click successful');
      }
    }

    // Check if new CSS is loaded
    const customCSS = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.some(link => link.href.includes('teachers-tabbed-minimal'));
    });

    console.log(`\n🎨 Custom CSS loaded: ${customCSS}`);

    // Check console for any errors
    const jsErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);
    console.log(`\n🔍 JavaScript errors: ${jsErrors.length}`);
    if (jsErrors.length > 0) {
      console.log('   Errors:', jsErrors);
    }

    // Take screenshot
    await page.screenshot({ path: 'tabbed-teachers-test.png', fullPage: true });
    console.log('\n📸 Screenshot saved as tabbed-teachers-test.png');

    // Check page content
    const pageText = await page.textContent('body');
    const hasTeachersContent = pageText.includes('Teacher') || pageText.includes('Contact');
    console.log(`\n📄 Has teachers content: ${hasTeachersContent}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  await browser.close();
}

testTabbedTeachers();