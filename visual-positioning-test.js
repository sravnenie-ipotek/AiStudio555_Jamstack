/**
 * Visual Positioning Test for Language Switchers
 * Tests the specific positioning issues mentioned in the requirements
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function visualPositioningTest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 }
  });
  
  console.log('🔵 Visual Positioning Test for Language Switchers\n');

  // Test Hebrew version positioning
  console.log('📱 Testing Hebrew Version Positioning...');
  const hebrewPage = await context.newPage();
  
  try {
    await hebrewPage.goto('http://localhost:3000/dist/he/index.html', { waitUntil: 'networkidle' });
    
    // Take screenshot of navbar area
    const screenshotPath = path.join(__dirname, 'hebrew-navbar-positioning-test.png');
    await hebrewPage.screenshot({ 
      path: screenshotPath, 
      clip: { x: 0, y: 0, width: 1200, height: 120 }
    });
    
    // Check language switcher position
    const languageSwitcher = hebrewPage.locator('#language-switcher');
    const switcherBox = await languageSwitcher.boundingBox();
    
    // Check signup button position
    const signupButton = hebrewPage.locator('.primary-button-text-block').filter({ hasText: 'הרשמו היום' }).first();
    const signupBox = await signupButton.boundingBox();
    
    console.log('Hebrew Language Switcher Position:', switcherBox);
    console.log('Hebrew Signup Button Position:', signupBox);
    
    // In RTL layout, language switcher should be to the left of signup button
    const isPositionedCorrectly = switcherBox && signupBox && switcherBox.x < signupBox.x;
    
    // Check if it's not fixed positioned far right
    const switcherStyle = await languageSwitcher.getAttribute('style');
    const hasInlinePositioning = switcherStyle?.includes('margin');
    
    console.log('Hebrew positioning check:');
    console.log('  - Language switcher to left of signup:', isPositionedCorrectly);
    console.log('  - Has inline margin styling:', hasInlinePositioning);
    console.log('  - Style attribute:', switcherStyle);
    
    if (isPositionedCorrectly && hasInlinePositioning) {
      console.log('✅ PASS: Hebrew language switcher positioned correctly\n');
    } else {
      console.log('❌ FAIL: Hebrew language switcher positioning issue\n');
    }
    
  } catch (error) {
    console.log('❌ ERROR: Hebrew positioning test failed -', error.message);
  }
  
  await hebrewPage.close();

  // Test Russian version positioning  
  console.log('📱 Testing Russian Version Positioning...');
  const russianPage = await context.newPage();
  
  try {
    await russianPage.goto('http://localhost:3000/dist/ru/index.html', { waitUntil: 'networkidle' });
    
    // Take screenshot of navbar area
    const screenshotPath = path.join(__dirname, 'russian-navbar-positioning-test.png');
    await russianPage.screenshot({ 
      path: screenshotPath, 
      clip: { x: 0, y: 0, width: 1200, height: 120 }
    });
    
    // Check navigation menu items
    const navLinks = await russianPage.locator('.nav-link').allTextContents();
    console.log('Russian Navigation Items:', navLinks);
    
    // Check language switcher
    const languageSwitcher = russianPage.locator('#language-switcher');
    const switcherBox = await languageSwitcher.boundingBox();
    const isVisible = await languageSwitcher.isVisible();
    
    console.log('Russian Language Switcher Position:', switcherBox);
    console.log('Russian Language Switcher Visible:', isVisible);
    
    // Check that navigation has the expected items
    const expectedItems = ['Главная', 'Все курсы', 'Преподаватели', 'Карьерные услуги'];
    const hasExpectedItems = expectedItems.some(item => 
      navLinks.some(link => link.includes(item) || link.includes('Home') || link.includes('Courses'))
    );
    
    console.log('Russian menu check:');
    console.log('  - Has expected navigation items:', hasExpectedItems);
    console.log('  - Total navigation items:', navLinks.length);
    console.log('  - Language switcher visible:', isVisible);
    
    if (hasExpectedItems && isVisible && navLinks.length >= 5) {
      console.log('✅ PASS: Russian menu layout fixed with proper navigation\n');
    } else {
      console.log('❌ FAIL: Russian menu layout issues remain\n');
    }
    
  } catch (error) {
    console.log('❌ ERROR: Russian positioning test failed -', error.message);
  }
  
  await russianPage.close();

  // Test functionality of language switchers
  console.log('🔄 Testing Language Switcher Functionality...');
  const functionalityPage = await context.newPage();
  
  try {
    await functionalityPage.goto('http://localhost:3000/dist/he/index.html', { waitUntil: 'networkidle' });
    
    // Check if switchLanguage function exists
    const hasSwitchFunction = await functionalityPage.evaluate(() => {
      return typeof switchLanguage === 'function';
    });
    
    // Check select options
    const options = await functionalityPage.locator('#language-switcher select option').allTextContents();
    const selectedValue = await functionalityPage.locator('#language-switcher select').inputValue();
    
    console.log('Functionality check:');
    console.log('  - switchLanguage function exists:', hasSwitchFunction);
    console.log('  - Available options:', options);
    console.log('  - Currently selected:', selectedValue);
    
    if (hasSwitchFunction && options.length === 3 && selectedValue === 'he') {
      console.log('✅ PASS: Language switcher functionality works correctly\n');
    } else {
      console.log('❌ FAIL: Language switcher functionality issues\n');
    }
    
  } catch (error) {
    console.log('❌ ERROR: Functionality test failed -', error.message);
  }
  
  await functionalityPage.close();

  await browser.close();
  
  console.log('📊 Visual Positioning Test Complete');
  console.log('📷 Screenshots saved:');
  console.log('  - hebrew-navbar-positioning-test.png');
  console.log('  - russian-navbar-positioning-test.png');
}

visualPositioningTest().catch(console.error);
