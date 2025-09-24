const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 COMPREHENSIVE PRICING PAGE QA TEST\n');
  console.log('=' .repeat(50));

  const tests = {
    navigation: { passed: 0, failed: 0, details: [] },
    buttons: { passed: 0, failed: 0, details: [] },
    languages: { passed: 0, failed: 0, details: [] },
    translations: { passed: 0, failed: 0, details: [] },
    responsive: { passed: 0, failed: 0, details: [] }
  };

  // Test 1: Navigation Structure
  console.log('\n📋 TEST 1: Navigation Structure');
  await page.goto('http://localhost:3005/pricing.html');
  await page.waitForLoadState('domcontentloaded');

  // Check navbar exists
  const navbar = await page.$('.navbar');
  if (navbar) {
    tests.navigation.passed++;
    tests.navigation.details.push('✅ Navbar exists');
  } else {
    tests.navigation.failed++;
    tests.navigation.details.push('❌ Navbar missing');
  }

  // Check nav links
  const navLinks = await page.$$eval('.nav-link', links =>
    links.map(link => ({ text: link.textContent.trim(), href: link.href }))
  );

  const expectedLinks = ['Home', 'Courses', 'Pricing', 'Blog', 'Teachers'];
  for (const expected of expectedLinks) {
    const found = navLinks.some(link => link.text === expected);
    if (found) {
      tests.navigation.passed++;
      tests.navigation.details.push(`✅ ${expected} link found`);
    } else {
      tests.navigation.failed++;
      tests.navigation.details.push(`❌ ${expected} link missing`);
    }
  }

  // Check About Us dropdown
  const aboutDropdown = await page.$('.menu-dropdown-wrapper');
  if (aboutDropdown) {
    tests.navigation.passed++;
    tests.navigation.details.push('✅ About Us dropdown exists');
  } else {
    tests.navigation.failed++;
    tests.navigation.details.push('❌ About Us dropdown missing');
  }

  // Test 2: Button Functionality
  console.log('\n🔘 TEST 2: Button Functionality');

  // Check desktop yellow button
  const desktopButton = await page.$('.primary-button-wrapper.desktop .primary-button');
  if (desktopButton) {
    tests.buttons.passed++;
    tests.buttons.details.push('✅ Desktop yellow button exists');

    // Check button text
    const buttonText = await desktopButton.textContent();
    if (buttonText.includes('Sign Up Today')) {
      tests.buttons.passed++;
      tests.buttons.details.push('✅ Button text correct');
    } else {
      tests.buttons.failed++;
      tests.buttons.details.push(`❌ Button text wrong: ${buttonText}`);
    }

    // Check button color
    const buttonColor = await desktopButton.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    if (buttonColor === 'rgb(255, 214, 89)') {
      tests.buttons.passed++;
      tests.buttons.details.push('✅ Button color is yellow (#ffd659)');
    } else {
      tests.buttons.failed++;
      tests.buttons.details.push(`❌ Button color wrong: ${buttonColor}`);
    }

    // Check no duplicate text
    const textBlocks = await page.$$eval('.primary-button-text-block', blocks =>
      blocks.map(b => ({
        text: b.textContent,
        display: window.getComputedStyle(b).display,
        hasAbsolute: b.classList.contains('is-text-absolute')
      }))
    );

    const visibleTexts = textBlocks.filter(b => !b.hasAbsolute || b.display !== 'none');
    const duplicateCount = visibleTexts.filter(b => b.text === 'Sign Up Today').length;

    if (duplicateCount <= 1) {
      tests.buttons.passed++;
      tests.buttons.details.push('✅ No duplicate button text visible');
    } else {
      tests.buttons.failed++;
      tests.buttons.details.push(`❌ Duplicate text visible: ${duplicateCount} instances`);
    }
  } else {
    tests.buttons.failed++;
    tests.buttons.details.push('❌ Desktop yellow button missing');
  }

  // Test 3: Language Switching
  console.log('\n🌐 TEST 3: Language Switching');

  // Check language pills
  const langPills = await page.$$('.lang-pill');
  if (langPills.length === 3) {
    tests.languages.passed++;
    tests.languages.details.push('✅ All 3 language pills found');
  } else {
    tests.languages.failed++;
    tests.languages.details.push(`❌ Wrong number of language pills: ${langPills.length}`);
  }

  // Test language switching to Russian
  const ruPill = await page.$('.lang-pill[data-locale="ru"]');
  if (ruPill) {
    await ruPill.click();
    await page.waitForTimeout(2000); // Wait for translation

    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    if (htmlLang === 'ru') {
      tests.languages.passed++;
      tests.languages.details.push('✅ Language switched to Russian');
    } else {
      tests.languages.failed++;
      tests.languages.details.push(`❌ Language not switched: ${htmlLang}`);
    }

    // Check if some text changed
    const heroTitle = await page.$eval('h1', el => el.textContent).catch(() => '');
    if (heroTitle && heroTitle !== 'Pricing Plan') {
      tests.translations.passed++;
      tests.translations.details.push('✅ Hero title translated');
    } else {
      tests.translations.failed++;
      tests.translations.details.push('❌ Hero title not translated');
    }
  }

  // Test Hebrew (RTL)
  const hePill = await page.$('.lang-pill[data-locale="he"]');
  if (hePill) {
    await hePill.click();
    await page.waitForTimeout(2000);

    const htmlDir = await page.evaluate(() => document.documentElement.dir);
    if (htmlDir === 'rtl') {
      tests.languages.passed++;
      tests.languages.details.push('✅ RTL direction set for Hebrew');
    } else {
      tests.languages.failed++;
      tests.languages.details.push('❌ RTL not set for Hebrew');
    }
  }

  // Switch back to English
  const enPill = await page.$('.lang-pill[data-locale="en"]');
  if (enPill) {
    await enPill.click();
    await page.waitForTimeout(1000);
  }

  // Test 4: Responsive Design
  console.log('\n📱 TEST 4: Responsive Design');

  // Test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);

  // Check mobile menu button
  const mobileMenuBtn = await page.$('.menu-button');
  const mobileMenuVisible = await mobileMenuBtn?.isVisible();
  if (mobileMenuVisible) {
    tests.responsive.passed++;
    tests.responsive.details.push('✅ Mobile menu button visible');
  } else {
    tests.responsive.failed++;
    tests.responsive.details.push('❌ Mobile menu button not visible');
  }

  // Check desktop button hidden
  const desktopBtnHidden = await page.$eval('.primary-button-wrapper.desktop',
    el => window.getComputedStyle(el).display === 'none'
  ).catch(() => false);

  if (desktopBtnHidden) {
    tests.responsive.passed++;
    tests.responsive.details.push('✅ Desktop button hidden on mobile');
  } else {
    tests.responsive.failed++;
    tests.responsive.details.push('❌ Desktop button still visible on mobile');
  }

  // Check mobile button visible
  const mobileBtnVisible = await page.$eval('.primary-button-wrapper.mobile',
    el => window.getComputedStyle(el).display !== 'none'
  ).catch(() => false);

  if (mobileBtnVisible) {
    tests.responsive.passed++;
    tests.responsive.details.push('✅ Mobile button visible');
  } else {
    tests.responsive.failed++;
    tests.responsive.details.push('❌ Mobile button not visible');
  }

  // Reset viewport
  await page.setViewportSize({ width: 1280, height: 720 });

  // Print Results
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST RESULTS SUMMARY\n');

  for (const [category, results] of Object.entries(tests)) {
    console.log(`\n${category.toUpperCase()}:`);
    console.log(`  Passed: ${results.passed} ✅`);
    console.log(`  Failed: ${results.failed} ❌`);

    if (results.details.length > 0) {
      console.log('  Details:');
      results.details.forEach(detail => console.log(`    ${detail}`));
    }
  }

  // Overall Score
  const totalPassed = Object.values(tests).reduce((sum, t) => sum + t.passed, 0);
  const totalFailed = Object.values(tests).reduce((sum, t) => sum + t.failed, 0);
  const totalTests = totalPassed + totalFailed;
  const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;

  console.log('\n' + '=' .repeat(50));
  console.log(`🏆 OVERALL SCORE: ${totalPassed}/${totalTests} (${passRate}%) ${totalFailed === 0 ? '🎉' : '⚠️'}`);

  await browser.close();
})();