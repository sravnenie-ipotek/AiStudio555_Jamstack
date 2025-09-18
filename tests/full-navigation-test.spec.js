const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const baseUrl = 'http://localhost:3005';
const startPage = '/home.html';
const resultsFile = 'navigation-test-results.json';

test.describe('Comprehensive Navigation and Button Testing', () => {
  test('Test all navigation links, dropdowns, and buttons', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes timeout

    const results = {
      timestamp: new Date().toISOString(),
      baseUrl: baseUrl,
      totalLinksChecked: 0,
      totalButtonsChecked: 0,
      brokenLinks: [],
      workingLinks: [],
      buttonErrors: [],
      dropdownItems: [],
      visitedPages: new Set(),
      errors: []
    };

    // Helper function to check if URL is external
    const isExternalUrl = (url) => {
      if (!url) return false;
      return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
    };

    // Helper function to normalize URL
    const normalizeUrl = (url) => {
      if (!url || url === '#' || url === 'javascript:void(0)') return null;
      if (isExternalUrl(url)) return url;
      if (url.startsWith('/')) return baseUrl + url;
      return url;
    };

    // Helper function to test a link
    async function testLink(linkElement, linkText, linkHref, source) {
      try {
        const normalizedUrl = normalizeUrl(linkHref);

        if (!normalizedUrl) {
          console.log(`  ⏭️  Skipping anchor/void link: "${linkText}"`);
          return;
        }

        if (isExternalUrl(normalizedUrl)) {
          console.log(`  🌐 External link: "${linkText}" -> ${normalizedUrl}`);
          results.workingLinks.push({
            text: linkText,
            href: normalizedUrl,
            source: source,
            type: 'external'
          });
          return;
        }

        // For internal links, try to navigate
        console.log(`  🔗 Testing link: "${linkText}" -> ${linkHref}`);

        const response = await page.goto(normalizedUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 10000
        });

        if (response && response.status() >= 400) {
          console.log(`    ❌ Broken link (${response.status()}): ${normalizedUrl}`);
          results.brokenLinks.push({
            text: linkText,
            href: linkHref,
            status: response.status(),
            source: source
          });
        } else {
          console.log(`    ✅ Link works: ${normalizedUrl}`);
          results.workingLinks.push({
            text: linkText,
            href: linkHref,
            source: source,
            type: 'internal'
          });
          results.visitedPages.add(normalizedUrl);
        }

        results.totalLinksChecked++;

        // Go back to the source page
        await page.goBack({ waitUntil: 'domcontentloaded' });

      } catch (error) {
        console.log(`    ❌ Error testing link "${linkText}": ${error.message}`);
        results.brokenLinks.push({
          text: linkText,
          href: linkHref,
          error: error.message,
          source: source
        });

        // Try to recover by going back to the source page
        try {
          await page.goto(source, { waitUntil: 'domcontentloaded' });
        } catch (recoveryError) {
          console.log(`    ⚠️  Could not recover to source page`);
        }
      }
    }

    // Helper function to test all buttons on a page
    async function testButtonsOnPage(pageUrl) {
      console.log(`\n📍 Testing buttons on: ${pageUrl}`);

      try {
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000); // Wait for any dynamic content

        // Find all buttons and clickable elements
        const buttons = await page.evaluate(() => {
          const clickableElements = [];

          // Get all buttons
          document.querySelectorAll('button, .button, .btn, [role="button"], input[type="button"], input[type="submit"]').forEach(el => {
            if (el.offsetParent !== null) { // Check if visible
              clickableElements.push({
                text: el.textContent?.trim() || el.value || 'No text',
                type: el.tagName,
                classes: el.className,
                id: el.id,
                onclick: el.onclick ? 'has onclick' : null
              });
            }
          });

          return clickableElements;
        });

        console.log(`  Found ${buttons.length} buttons`);

        for (const button of buttons) {
          console.log(`  🔘 Button: "${button.text}" (${button.type})`);
          results.totalButtonsChecked++;

          // Try to click each button and see what happens
          try {
            const selector = button.id ? `#${button.id}` :
                           button.classes ? `.${button.classes.split(' ')[0]}` :
                           button.type.toLowerCase();

            const element = await page.$(selector);
            if (element) {
              // Check if button triggers navigation or modal
              const navigationPromise = page.waitForNavigation({ timeout: 2000 }).catch(() => null);
              await element.click();
              const navigation = await navigationPromise;

              if (navigation) {
                console.log(`    → Navigated to: ${page.url()}`);
                await page.goBack();
              } else {
                // Check for modals or popups
                await page.waitForTimeout(500);
                const hasModal = await page.evaluate(() => {
                  return document.querySelector('.modal.show, .modal-backdrop, [role="dialog"]:not([hidden])') !== null;
                });

                if (hasModal) {
                  console.log(`    → Opened modal/popup`);
                  // Try to close modal
                  await page.keyboard.press('Escape');
                  await page.waitForTimeout(500);
                }
              }
            }
          } catch (error) {
            console.log(`    ⚠️  Could not test button: ${error.message}`);
            results.buttonErrors.push({
              text: button.text,
              page: pageUrl,
              error: error.message
            });
          }
        }

      } catch (error) {
        console.log(`  ❌ Error testing buttons on page: ${error.message}`);
        results.errors.push({
          page: pageUrl,
          error: error.message,
          type: 'button-test'
        });
      }
    }

    // Main test execution
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log('Starting Comprehensive Navigation Test');
      console.log(`Base URL: ${baseUrl}`);
      console.log(`Start Page: ${startPage}`);
      console.log('='.repeat(60));

      // Navigate to home page
      await page.goto(baseUrl + startPage, { waitUntil: 'networkidle' });
      console.log('\n✅ Loaded home page successfully');

      // Test main navigation links
      console.log('\n' + '='.repeat(60));
      console.log('TESTING MAIN NAVIGATION');
      console.log('='.repeat(60));

      const mainNavLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('.navbar a, .nav-link, nav a').forEach(link => {
          if (link.offsetParent !== null) { // Check if visible
            links.push({
              text: link.textContent.trim(),
              href: link.getAttribute('href')
            });
          }
        });
        return links;
      });

      console.log(`Found ${mainNavLinks.length} main navigation links`);

      for (const link of mainNavLinks) {
        await testLink(null, link.text, link.href, baseUrl + startPage);
      }

      // Test dropdown menus
      console.log('\n' + '='.repeat(60));
      console.log('TESTING DROPDOWN MENUS');
      console.log('='.repeat(60));

      // Find and open all dropdowns
      const dropdowns = await page.$$('.dropdown, .w-dropdown, [data-toggle="dropdown"]');
      console.log(`Found ${dropdowns.length} dropdown menus`);

      for (let i = 0; i < dropdowns.length; i++) {
        const dropdown = dropdowns[i];

        try {
          // Get dropdown toggle text
          const toggleText = await dropdown.$eval('.dropdown-toggle, .w-dropdown-toggle', el => el.textContent.trim()).catch(() => 'Dropdown ' + (i + 1));
          console.log(`\n📂 Opening dropdown: "${toggleText}"`);

          // Hover or click to open dropdown
          const toggle = await dropdown.$('.dropdown-toggle, .w-dropdown-toggle');
          if (toggle) {
            await toggle.hover();
            await page.waitForTimeout(500);

            // Get dropdown items
            const dropdownLinks = await dropdown.$$eval('.dropdown-menu a, .w-dropdown-list a, .dropdown-item', links => {
              return links.map(link => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href')
              }));
            });

            console.log(`  Found ${dropdownLinks.length} items in dropdown`);

            for (const link of dropdownLinks) {
              results.dropdownItems.push({
                dropdown: toggleText,
                text: link.text,
                href: link.href
              });

              await testLink(null, link.text, link.href, baseUrl + startPage);
            }
          }
        } catch (error) {
          console.log(`  ⚠️  Error testing dropdown: ${error.message}`);
          results.errors.push({
            type: 'dropdown',
            error: error.message
          });
        }
      }

      // Test mobile navigation
      console.log('\n' + '='.repeat(60));
      console.log('TESTING MOBILE NAVIGATION');
      console.log('='.repeat(60));

      // Set mobile viewport
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(baseUrl + startPage, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      // Find and click hamburger menu
      const hamburger = await page.$('.hamburger, .menu-toggle, .w-nav-button, [aria-label*="menu"]');

      if (hamburger) {
        console.log('📱 Testing mobile menu...');
        await hamburger.click();
        await page.waitForTimeout(1000);

        // Get mobile menu links
        const mobileLinks = await page.evaluate(() => {
          const links = [];
          document.querySelectorAll('.mobile-menu a, .w-nav-overlay a, .nav-menu a').forEach(link => {
            if (link.offsetParent !== null) {
              links.push({
                text: link.textContent.trim(),
                href: link.getAttribute('href')
              });
            }
          });
          return links;
        });

        console.log(`  Found ${mobileLinks.length} links in mobile menu`);

        for (const link of mobileLinks) {
          console.log(`  📱 Mobile link: "${link.text}"`);
        }

        // Close mobile menu
        await hamburger.click();
        await page.waitForTimeout(500);
      } else {
        console.log('  ⚠️  No mobile menu found');
      }

      // Reset to desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Test buttons on main pages
      console.log('\n' + '='.repeat(60));
      console.log('TESTING BUTTONS ON KEY PAGES');
      console.log('='.repeat(60));

      const pagesToTest = [
        '/home.html',
        '/courses.html',
        '/pricing.html',
        '/blog.html',
        '/teachers.html',
        '/career-orientation.html',
        '/career-center.html'
      ];

      for (const pageUrl of pagesToTest) {
        await testButtonsOnPage(baseUrl + pageUrl);
      }

      // Generate summary
      console.log('\n' + '='.repeat(60));
      console.log('TEST SUMMARY');
      console.log('='.repeat(60));

      console.log(`\n📊 Statistics:`);
      console.log(`  Total links checked: ${results.totalLinksChecked}`);
      console.log(`  Total buttons checked: ${results.totalButtonsChecked}`);
      console.log(`  Working links: ${results.workingLinks.length}`);
      console.log(`  Broken links: ${results.brokenLinks.length}`);
      console.log(`  Button errors: ${results.buttonErrors.length}`);
      console.log(`  Dropdown items found: ${results.dropdownItems.length}`);
      console.log(`  Pages visited: ${results.visitedPages.size}`);

      if (results.brokenLinks.length > 0) {
        console.log('\n❌ Broken Links:');
        results.brokenLinks.forEach(link => {
          console.log(`  - "${link.text}" -> ${link.href}`);
          if (link.error) console.log(`    Error: ${link.error}`);
        });
      }

      if (results.buttonErrors.length > 0) {
        console.log('\n⚠️  Button Errors:');
        results.buttonErrors.forEach(error => {
          console.log(`  - "${error.text}" on ${error.page}`);
          console.log(`    Error: ${error.error}`);
        });
      }

      // Save results to file
      results.visitedPages = Array.from(results.visitedPages);
      await fs.writeFile(
        path.join(process.cwd(), resultsFile),
        JSON.stringify(results, null, 2)
      );
      console.log(`\n💾 Results saved to ${resultsFile}`);

      // Assert no broken links
      expect(results.brokenLinks.length, `Found ${results.brokenLinks.length} broken links`).toBe(0);

    } catch (error) {
      console.error('\n❌ Test failed with error:', error);
      throw error;
    }
  });

  test('Test NewDesign navigation and buttons', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes timeout

    const newDesignBaseUrl = 'http://localhost:3005/backups/newDesign';
    const results = {
      timestamp: new Date().toISOString(),
      baseUrl: newDesignBaseUrl,
      totalLinksChecked: 0,
      totalButtonsChecked: 0,
      brokenLinks: [],
      workingLinks: [],
      errors: []
    };

    console.log(`\n${'='.repeat(60)}`);
    console.log('Testing NewDesign Navigation');
    console.log('='.repeat(60));

    // Navigate to NewDesign home
    await page.goto(newDesignBaseUrl + '/home.html', { waitUntil: 'networkidle' });

    // Test all navigation links
    const navLinks = await page.$$eval('nav a, .nav-link, .navbar a', links => {
      return links.map(link => ({
        text: link.textContent.trim(),
        href: link.getAttribute('href')
      }));
    });

    console.log(`\nFound ${navLinks.length} navigation links in NewDesign`);

    for (const link of navLinks) {
      if (link.href && link.href !== '#') {
        try {
          const url = link.href.startsWith('http') ? link.href : newDesignBaseUrl + '/' + link.href;
          console.log(`  Testing: "${link.text}" -> ${link.href}`);

          const response = await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 10000
          });

          if (response && response.status() >= 400) {
            console.log(`    ❌ Status ${response.status()}`);
            results.brokenLinks.push(link);
          } else {
            console.log(`    ✅ Works`);
            results.workingLinks.push(link);
          }

          results.totalLinksChecked++;
          await page.goBack();

        } catch (error) {
          console.log(`    ❌ Error: ${error.message}`);
          results.errors.push({
            link: link,
            error: error.message
          });
        }
      }
    }

    // Test buttons
    const buttons = await page.$$eval('button, .button, .btn, [role="button"]', btns => {
      return btns.filter(btn => btn.offsetParent !== null).map(btn => ({
        text: btn.textContent?.trim() || 'No text',
        type: btn.tagName
      }));
    });

    console.log(`\nFound ${buttons.length} buttons in NewDesign`);
    results.totalButtonsChecked = buttons.length;

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('NewDesign Test Summary:');
    console.log(`  Total links: ${results.totalLinksChecked}`);
    console.log(`  Working: ${results.workingLinks.length}`);
    console.log(`  Broken: ${results.brokenLinks.length}`);
    console.log(`  Buttons found: ${results.totalButtonsChecked}`);

    // Save NewDesign results
    await fs.writeFile(
      path.join(process.cwd(), 'newdesign-navigation-results.json'),
      JSON.stringify(results, null, 2)
    );

    expect(results.brokenLinks.length).toBe(0);
  });
});