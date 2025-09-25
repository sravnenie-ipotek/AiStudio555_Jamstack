const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 ULTRATHINK: Investigating Teacher Card Visibility Issues...\n');

  await page.goto('http://localhost:3005/teachers.html');
  await page.waitForTimeout(3000);

  // Check if cards exist
  const cards = await page.$$('.shared-teacher-card');
  console.log(`📊 Found ${cards.length} teacher cards in DOM`);

  if (cards.length > 0) {
    const firstCard = cards[0];
    
    // Check visibility properties
    const isVisible = await firstCard.isVisible();
    console.log(`👀 First card isVisible: ${isVisible}`);
    
    const isEnabled = await firstCard.isEnabled();
    console.log(`⚡ First card isEnabled: ${isEnabled}`);
    
    // Check computed styles
    const styles = await firstCard.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        zIndex: computed.zIndex,
        position: computed.position,
        width: computed.width,
        height: computed.height,
        overflow: computed.overflow,
        pointerEvents: computed.pointerEvents
      };
    });
    
    console.log('\n🎨 First card computed styles:');
    Object.entries(styles).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Check bounding box
    const boundingBox = await firstCard.boundingBox();
    console.log('\n📏 First card bounding box:', boundingBox);

    // Check if card has click handler
    const hasClickHandler = await firstCard.evaluate(el => {
      return el.onclick !== null || el.addEventListener !== undefined;
    });
    console.log(`🖱️ Has click handler: ${hasClickHandler}`);

    // Check parent containers
    const parentStyle = await page.evaluate(() => {
      const container = document.querySelector('.teacher-grid-container, .teachers-container, .teacher-cards-container');
      if (container) {
        const computed = window.getComputedStyle(container);
        return {
          element: container.className,
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          overflow: computed.overflow
        };
      }
      return null;
    });
    console.log('\n📦 Parent container styles:', parentStyle);

    // Check for overlays
    const overlays = await page.$$eval('*', elements => {
      return elements
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.position === 'fixed' || style.position === 'absolute';
        })
        .map(el => ({
          tag: el.tagName,
          class: el.className,
          zIndex: window.getComputedStyle(el).zIndex
        }))
        .slice(0, 10); // First 10 overlays
    });
    console.log('\n🔍 Fixed/Absolute positioned elements (potential overlays):');
    overlays.forEach(overlay => console.log(`   ${overlay.tag}.${overlay.class} (z: ${overlay.zIndex})`));

    // Try to scroll to card
    await firstCard.scrollIntoViewIfNeeded();
    console.log('\n📍 Scrolled to first card');

    // Check visibility after scroll
    const visibleAfterScroll = await firstCard.isVisible();
    console.log(`👀 First card visible after scroll: ${visibleAfterScroll}`);

    // Test click with force
    try {
      await firstCard.click({ force: true, timeout: 2000 });
      console.log('✅ Force click succeeded');
      
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      console.log(`🔗 Current URL after click: ${currentUrl}`);
      
    } catch (e) {
      console.log(`❌ Force click failed: ${e.message}`);
    }
  }

  await page.waitForTimeout(2000);
  await browser.close();
  console.log('\n🎉 Investigation complete');
})();
