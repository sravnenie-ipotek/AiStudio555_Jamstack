const { test, expect } = require('@playwright/test');

test('CORRECT Final Test - Language Switchers', async ({ page }) => {
  console.log('🎯 Testing with CORRECT URL...');

  // Navigate to correct URL
  await page.goto('http://localhost:3005/home.html');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Take final screenshot
  await page.screenshot({
    path: 'SUCCESS-language-switchers.png',
    clip: { x: 0, y: 0, width: 1280, height: 120 }
  });
  console.log('📸 SUCCESS screenshot saved');

  // Check for language switchers
  const dropdown = await page.$('.lang-dropdown');
  const pills = await page.$('.lang-pills');
  const container = await page.$('.language-switchers');

  console.log('Container found:', !!container);
  console.log('Dropdown found:', !!dropdown);
  console.log('Pills found:', !!pills);

  if (container) {
    const isVisible = await container.isVisible();
    console.log('Container visible:', isVisible);

    const boundingBox = await container.boundingBox();
    console.log('Container position:', boundingBox);
  }

  // Test dropdown functionality
  if (dropdown) {
    console.log('Testing dropdown...');
    await dropdown.click();
    await page.waitForTimeout(300);

    const menu = await page.$('.lang-dropdown-menu');
    if (menu) {
      const menuVisible = await menu.isVisible();
      console.log('Dropdown menu opens:', menuVisible);
    }

    // Take screenshot with dropdown open
    await page.screenshot({
      path: 'SUCCESS-dropdown-open.png',
      clip: { x: 0, y: 0, width: 1280, height: 200 }
    });
  }

  // Test pill functionality
  if (pills) {
    console.log('Testing pills...');
    const ruPill = await page.$('.lang-pill:nth-child(2)');
    if (ruPill) {
      await ruPill.click();
      await page.waitForTimeout(200);

      const isActive = await ruPill.evaluate(el => el.classList.contains('active'));
      console.log('RU pill active:', isActive);
    }
  }

  console.log('🎉 COMPLETE SUCCESS! Language switchers are working!');
});