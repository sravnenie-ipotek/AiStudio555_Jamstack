const { test, expect } = require('@playwright/test');

test('Verify hero description text on website', async ({ page }) => {
  console.log('🔍 Checking hero description on website...');
  
  // Navigate to the English version
  await page.goto('https://www.aistudio555.com/dist/en/index.html');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Look for the hero description text
  const heroDescriptionText = "Join thousands of students learning cutting-edge technology from industry experts22";
  
  // Check multiple possible selectors where hero description might be
  const selectors = [
    '.banner-description',
    '.hero-description', 
    '.banner-subtitle',
    '.hero-subtitle',
    'p',
    '.text-block'
  ];
  
  let found = false;
  for (const selector of selectors) {
    const elements = await page.locator(selector).all();
    for (const element of elements) {
      const text = await element.textContent().catch(() => '');
      if (text && text.includes(heroDescriptionText)) {
        found = true;
        console.log(`✅ Found text in element with selector: ${selector}`);
        console.log(`   Full text: "${text}"`);
        break;
      }
    }
    if (found) break;
  }
  
  if (!found) {
    // Try to find any text containing parts of it
    const pageContent = await page.content();
    if (pageContent.includes("Join thousands of students")) {
      console.log('⚠️ Found partial text "Join thousands of students" but not the exact admin panel text');
    }
    if (pageContent.includes("experts22")) {
      console.log('⚠️ Found "experts22" in the page');
    }
    
    // Log what we actually see in hero area
    const heroTitle = await page.locator('h1').first().textContent().catch(() => 'No h1 found');
    const heroSubtitle = await page.locator('.banner-subtitle').textContent().catch(() => 'No subtitle found');
    
    console.log('\n📋 Current hero content on website:');
    console.log(`   Title: ${heroTitle}`);
    console.log(`   Subtitle: ${heroSubtitle}`);
    
    console.log('\n❌ The exact text from admin panel was NOT found on the website');
    console.log(`   Looking for: "${heroDescriptionText}"`);
  } else {
    console.log('✅ Hero description from admin panel IS displayed on website!');
  }
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'hero-section-check.png', fullPage: false });
  console.log('📸 Screenshot saved as hero-section-check.png');
});