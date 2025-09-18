const { test, expect } = require('@playwright/test');

test('Debug Desktop Menu Dropdowns', async ({ page }) => {
  await page.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html');
  await page.waitForLoadState('networkidle');

  console.log('🖥️ Testing desktop menu dropdowns...');

  // Check dropdown elements
  const aboutUsDropdown = await page.$('.menu-dropdown-wrapper:nth-of-type(1)');
  const pagesDropdown = await page.$('.menu-dropdown-wrapper:nth-of-type(2)');

  console.log('About Us dropdown exists:', !!aboutUsDropdown);
  console.log('Pages dropdown exists:', !!pagesDropdown);

  if (aboutUsDropdown) {
    // Check if dropdown has proper structure
    const toggle = await aboutUsDropdown.$('.dropdown-toggle');
    const list = await aboutUsDropdown.$('.dropdown-column-wrapper-3');

    console.log('About Us toggle exists:', !!toggle);
    console.log('About Us dropdown list exists:', !!list);

    if (toggle && list) {
      // Test hover manually
      console.log('Testing About Us hover...');
      await toggle.hover();
      await page.waitForTimeout(500);

      // Check if w--open class is added
      const isOpen = await aboutUsDropdown.evaluate(el => el.classList.contains('w--open'));
      console.log('About Us dropdown has w--open class:', isOpen);

      // Check visibility of dropdown content
      const listVisible = await list.isVisible();
      console.log('About Us dropdown list visible:', listVisible);

      // Take screenshot with dropdown
      await page.screenshot({ path: 'dropdown-aboutus.png' });
      console.log('📸 About Us dropdown screenshot saved');
    }
  }

  if (pagesDropdown) {
    console.log('Testing Pages hover...');
    const toggle = await pagesDropdown.$('.dropdown-toggle');
    const list = await pagesDropdown.$('.dropdown-column-wrapper-3');

    console.log('Pages toggle exists:', !!toggle);
    console.log('Pages dropdown list exists:', !!list);

    if (toggle && list) {
      await toggle.hover();
      await page.waitForTimeout(500);

      const isOpen = await pagesDropdown.evaluate(el => el.classList.contains('w--open'));
      console.log('Pages dropdown has w--open class:', isOpen);

      const listVisible = await list.isVisible();
      console.log('Pages dropdown list visible:', listVisible);

      // Take screenshot with dropdown
      await page.screenshot({ path: 'dropdown-pages.png' });
      console.log('📸 Pages dropdown screenshot saved');
    }
  }

  // Check if hover event listeners are attached
  const hoverListeners = await page.evaluate(() => {
    const dropdowns = document.querySelectorAll('.menu-dropdown-wrapper');
    const results = [];

    dropdowns.forEach((dropdown, index) => {
      const events = getEventListeners ? getEventListeners(dropdown) : 'getEventListeners not available';
      results.push({
        index,
        hasMouseEnterListener: dropdown.onmouseenter !== null,
        hasMouseLeaveListener: dropdown.onmouseleave !== null,
        className: dropdown.className
      });
    });

    return results;
  });

  console.log('Dropdown event listeners:', hoverListeners);

  // Test manual class addition
  console.log('Testing manual class addition...');
  if (aboutUsDropdown) {
    await aboutUsDropdown.evaluate(el => el.classList.add('w--open'));
    await page.waitForTimeout(500);

    const list = await aboutUsDropdown.$('.dropdown-column-wrapper-3');
    if (list) {
      const visible = await list.isVisible();
      console.log('About Us dropdown visible after manual class add:', visible);
    }

    await page.screenshot({ path: 'dropdown-manual.png' });
    console.log('📸 Manual dropdown screenshot saved');
  }

  // Check CSS styles
  const dropdownStyles = await page.evaluate(() => {
    const dropdown = document.querySelector('.dropdown-column-wrapper-3');
    if (dropdown) {
      const styles = window.getComputedStyle(dropdown);
      return {
        display: styles.display,
        opacity: styles.opacity,
        visibility: styles.visibility,
        transform: styles.transform,
        position: styles.position
      };
    }
    return null;
  });

  console.log('Dropdown computed styles:', dropdownStyles);
});