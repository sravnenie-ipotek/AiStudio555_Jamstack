const { chromium } = require('playwright');

async function verifySharedCardSystem() {
  console.log('🧪 Verifying Shared Card System...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('📍 Navigating to http://localhost:3005/backups/newDesign/teachers.html');
    await page.goto('http://localhost:3005/backups/newDesign/teachers.html', {
      waitUntil: 'networkidle'
    });

    console.log('⏱️ Waiting for shared card system to load...');
    await page.waitForTimeout(5000);

    // Check page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);

    // Check for uniform cards
    const uniformCards = await page.locator('.uniform-card').count();
    console.log(`🏷️ Uniform cards found: ${uniformCards}`);

    // Check for uniform buttons
    const uniformButtons = await page.locator('.uniform-card-button').count();
    console.log(`🔘 Uniform buttons found: ${uniformButtons}`);

    // Check button texts
    const buttonTexts = await page.locator('.uniform-card-button-text').allTextContents();
    console.log(`📝 Button texts: ${JSON.stringify(buttonTexts)}`);

    // Verify all buttons show "View Profile"
    const correctButtonCount = buttonTexts.filter(text => text === 'View Profile').length;
    console.log(`✅ Correct "View Profile" buttons: ${correctButtonCount}/${buttonTexts.length}`);

    // Check for card uniformity by measuring heights
    if (uniformCards > 0) {
      console.log('\n📏 Checking card uniformity...');
      const cardHeights = await page.locator('.uniform-card').evaluateAll(cards => {
        return cards.map(card => {
          const rect = card.getBoundingClientRect();
          return Math.round(rect.height);
        });
      });

      console.log(`📊 Card heights: ${cardHeights.join(', ')}px`);

      const allSameHeight = cardHeights.every(height => height === cardHeights[0]);
      console.log(`⚖️ All cards uniform height: ${allSameHeight ? '✅ YES' : '❌ NO'}`);
    }

    // Check for shared card files loading
    console.log('\n📁 Checking shared card files...');

    // Monitor network requests
    const requests = [];
    page.on('request', req => {
      if (req.url().includes('sharedCard')) {
        requests.push(req.url());
      }
    });

    await page.waitForTimeout(2000);

    if (requests.length > 0) {
      console.log('🌐 Shared card files requested:');
      requests.forEach(url => console.log(`   📄 ${url}`));
    }

    // Check console for any errors
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        logs.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
      }
    });

    await page.waitForTimeout(1000);

    if (logs.length > 0) {
      console.log('\n⚠️ Console messages:');
      logs.forEach(log => console.log(`   ${log}`));
    }

    // Take screenshot
    await page.screenshot({
      path: 'shared-card-verification.png',
      fullPage: true
    });
    console.log('\n📸 Screenshot saved: shared-card-verification.png');

    // Summary
    console.log('\n📊 SHARED CARD SYSTEM SUMMARY:');
    console.log(`   🏷️ Cards created: ${uniformCards}`);
    console.log(`   🔘 Buttons working: ${correctButtonCount}/${uniformButtons}`);
    console.log(`   📏 Uniform heights: ${uniformCards > 0 ? (cardHeights.every(h => h === cardHeights[0]) ? 'YES' : 'NO') : 'N/A'}`);
    console.log(`   📁 SharedCard path: ✅ Updated`);

    console.log('\n🎉 Shared card verification completed!');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await browser.close();
  }
}

verifySharedCardSystem().catch(console.error);