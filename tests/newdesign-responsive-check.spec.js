const { test, expect } = require('@playwright/test');

// NewDesign pages configuration
const baseUrl = 'http://localhost:3005/backups/newDesign';

// All pages accessible from navigation
const newDesignPages = [
  { name: 'Home', path: 'home.html' },
  { name: 'Courses', path: 'courses.html' },
  { name: 'Pricing', path: 'pricing.html' },
  { name: 'Blog', path: 'blog.html' },
  { name: 'Teachers', path: 'teachers.html' },
  { name: 'Career Orientation', path: 'career-orientation.html' },
  { name: 'Career Center', path: 'career-center.html' },
  { name: 'About Us', path: 'about-us.html' },
  { name: 'Contact Us', path: 'contact-us.html' }
];

// Critical viewport sizes
const viewports = {
  'Mobile-iPhone12': { width: 390, height: 844 },
  'Mobile-iPhoneSE': { width: 375, height: 667 },
  'Tablet-iPad': { width: 768, height: 1024 },
  'Tablet-iPadLandscape': { width: 1024, height: 768 },
  'Desktop-HD': { width: 1366, height: 768 },
  'Desktop-FHD': { width: 1920, height: 1080 },
  'Desktop-MacBook': { width: 1440, height: 900 }
};

// Check for responsive issues
async function checkResponsiveIssues(page, viewport, pageName) {
  const issues = [];

  // Check for horizontal scrolling
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });

  if (hasHorizontalScroll) {
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    issues.push({
      type: 'horizontal-scroll',
      severity: 'high',
      message: `Horizontal scrolling detected: ${overflow}px overflow`,
      viewport: viewport
    });
  }

  // Check for overlapping elements
  const overlappingElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const overlaps = [];

    for (let i = 0; i < elements.length; i++) {
      const rect1 = elements[i].getBoundingClientRect();
      if (rect1.width === 0 || rect1.height === 0) continue;

      for (let j = i + 1; j < elements.length; j++) {
        const rect2 = elements[j].getBoundingClientRect();
        if (rect2.width === 0 || rect2.height === 0) continue;

        // Skip if elements are parent-child
        if (elements[i].contains(elements[j]) || elements[j].contains(elements[i])) continue;

        // Check for overlap
        if (!(rect1.right < rect2.left ||
              rect1.left > rect2.right ||
              rect1.bottom < rect2.top ||
              rect1.top > rect2.bottom)) {

          // Only report significant overlaps
          const overlapWidth = Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left);
          const overlapHeight = Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top);

          if (overlapWidth > 10 && overlapHeight > 10) {
            overlaps.push({
              element1: elements[i].tagName + (elements[i].className ? '.' + elements[i].className : ''),
              element2: elements[j].tagName + (elements[j].className ? '.' + elements[j].className : ''),
              overlap: `${overlapWidth}x${overlapHeight}px`
            });
          }
        }
      }
    }

    return overlaps.slice(0, 5); // Return max 5 overlaps
  });

  if (overlappingElements.length > 0) {
    issues.push({
      type: 'element-overlap',
      severity: 'medium',
      message: `${overlappingElements.length} overlapping elements detected`,
      details: overlappingElements,
      viewport: viewport
    });
  }

  // Check for text truncation
  const truncatedText = await page.evaluate(() => {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');
    const truncated = [];

    elements.forEach(el => {
      if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
        truncated.push({
          element: el.tagName + (el.className ? '.' + el.className : ''),
          text: el.textContent.substring(0, 50) + '...',
          overflow: `${el.scrollWidth - el.clientWidth}px width, ${el.scrollHeight - el.clientHeight}px height`
        });
      }
    });

    return truncated.slice(0, 5); // Return max 5 truncations
  });

  if (truncatedText.length > 0) {
    issues.push({
      type: 'text-truncation',
      severity: 'low',
      message: `${truncatedText.length} text elements are truncated`,
      details: truncatedText,
      viewport: viewport
    });
  }

  // Check mobile menu functionality
  if (viewport.width <= 768) {
    const hamburgerExists = await page.locator('.w-nav-button, .hamburger, .menu-toggle').first().isVisible().catch(() => false);

    if (!hamburgerExists) {
      issues.push({
        type: 'missing-mobile-menu',
        severity: 'critical',
        message: 'No mobile menu button found on mobile viewport',
        viewport: viewport
      });
    } else {
      // Test if menu opens
      const hamburger = page.locator('.w-nav-button, .hamburger, .menu-toggle').first();
      await hamburger.click();
      await page.waitForTimeout(500);

      const menuVisible = await page.locator('.w-nav-overlay, .mobile-menu, .nav-menu').first().isVisible().catch(() => false);

      if (!menuVisible) {
        issues.push({
          type: 'mobile-menu-not-opening',
          severity: 'high',
          message: 'Mobile menu does not open when hamburger is clicked',
          viewport: viewport
        });
      }

      // Close menu if it opened
      if (menuVisible) {
        await hamburger.click();
        await page.waitForTimeout(500);
      }
    }
  }

  // Check for images without proper sizing
  const imageSizeIssues = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    const issues = [];

    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      // Check if image is stretched
      if (naturalWidth > 0 && naturalHeight > 0) {
        const displayRatio = rect.width / rect.height;
        const naturalRatio = naturalWidth / naturalHeight;

        if (Math.abs(displayRatio - naturalRatio) > 0.1) {
          issues.push({
            src: img.src.split('/').pop(),
            issue: 'Image aspect ratio distorted',
            natural: `${naturalWidth}x${naturalHeight}`,
            displayed: `${Math.round(rect.width)}x${Math.round(rect.height)}`
          });
        }
      }

      // Check if image overflows container
      if (rect.right > document.documentElement.clientWidth) {
        issues.push({
          src: img.src.split('/').pop(),
          issue: 'Image overflows viewport',
          overflow: `${rect.right - document.documentElement.clientWidth}px`
        });
      }
    });

    return issues.slice(0, 5);
  });

  if (imageSizeIssues.length > 0) {
    issues.push({
      type: 'image-sizing',
      severity: 'medium',
      message: `${imageSizeIssues.length} images have sizing issues`,
      details: imageSizeIssues,
      viewport: viewport
    });
  }

  // Check form input accessibility on mobile
  if (viewport.width <= 768) {
    const formInputs = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea, select');
      const issues = [];

      inputs.forEach(input => {
        const rect = input.getBoundingClientRect();

        // Check if input is too small for touch
        if (rect.height < 44) {
          issues.push({
            element: input.tagName + (input.id ? '#' + input.id : ''),
            issue: 'Input height less than 44px (iOS touch target)',
            height: `${Math.round(rect.height)}px`
          });
        }

        // Check if input is off screen
        if (rect.right > document.documentElement.clientWidth || rect.left < 0) {
          issues.push({
            element: input.tagName + (input.id ? '#' + input.id : ''),
            issue: 'Input partially off screen',
            position: `left: ${Math.round(rect.left)}px, right: ${Math.round(rect.right)}px`
          });
        }
      });

      return issues;
    });

    if (formInputs.length > 0) {
      issues.push({
        type: 'form-accessibility',
        severity: 'medium',
        message: `${formInputs.length} form inputs have accessibility issues`,
        details: formInputs,
        viewport: viewport
      });
    }
  }

  return issues;
}

// Main test suite
test.describe('NewDesign Responsive Check', () => {
  test.setTimeout(180000); // 3 minutes timeout for all tests

  for (const [viewportName, viewportSize] of Object.entries(viewports)) {
    test(`${viewportName} - Check all pages`, async ({ page }) => {
      const allIssues = {};

      await page.setViewportSize(viewportSize);

      for (const pageInfo of newDesignPages) {
        console.log(`\nTesting ${pageInfo.name} at ${viewportName}...`);

        try {
          await page.goto(`${baseUrl}/${pageInfo.path}`, { waitUntil: 'networkidle' });
          await page.waitForTimeout(1000); // Wait for animations

          const issues = await checkResponsiveIssues(page, viewportName, pageInfo.name);

          if (issues.length > 0) {
            allIssues[pageInfo.name] = issues;

            // Take screenshot if issues found
            await page.screenshot({
              path: `test-results/screenshots/newdesign-${viewportName}-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}-issues.png`,
              fullPage: true
            });
          }

        } catch (error) {
          console.error(`Error testing ${pageInfo.name}: ${error.message}`);
          allIssues[pageInfo.name] = [{
            type: 'page-error',
            severity: 'critical',
            message: error.message,
            viewport: viewportName
          }];
        }
      }

      // Log summary
      console.log(`\n${'='.repeat(60)}`);
      console.log(`SUMMARY FOR ${viewportName}`);
      console.log('='.repeat(60));

      if (Object.keys(allIssues).length === 0) {
        console.log('✅ No responsive issues found!');
      } else {
        console.log(`⚠️ Issues found on ${Object.keys(allIssues).length} pages:\n`);

        for (const [pageName, issues] of Object.entries(allIssues)) {
          console.log(`\n📄 ${pageName}:`);
          issues.forEach(issue => {
            const icon = issue.severity === 'critical' ? '🔴' :
                        issue.severity === 'high' ? '🟠' :
                        issue.severity === 'medium' ? '🟡' : '🟢';
            console.log(`  ${icon} [${issue.severity}] ${issue.type}: ${issue.message}`);
            if (issue.details && issue.details.length > 0) {
              console.log(`     Details: ${JSON.stringify(issue.details[0])}`);
            }
          });
        }
      }

      // Fail test if critical issues found
      const criticalIssues = Object.values(allIssues).flat().filter(i => i.severity === 'critical');
      if (criticalIssues.length > 0) {
        throw new Error(`Found ${criticalIssues.length} critical responsive issues`);
      }
    });
  }
});

// Quick test for development
test.describe('NewDesign Quick Responsive Check', () => {
  test('Mobile and Desktop quick check', async ({ page }) => {
    const quickViewports = {
      'Mobile': { width: 390, height: 844 },
      'Desktop': { width: 1920, height: 1080 }
    };

    const quickPages = [
      { name: 'Home', path: 'home.html' },
      { name: 'Courses', path: 'courses.html' },
      { name: 'Career Orientation', path: 'career-orientation.html' }
    ];

    for (const [viewportName, viewportSize] of Object.entries(quickViewports)) {
      await page.setViewportSize(viewportSize);

      for (const pageInfo of quickPages) {
        console.log(`\nQuick test: ${pageInfo.name} at ${viewportName}`);

        await page.goto(`${baseUrl}/${pageInfo.path}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);

        // Quick horizontal scroll check
        const hasScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        if (hasScroll) {
          const overflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth - document.documentElement.clientWidth;
          });
          console.log(`  ⚠️ Horizontal scroll detected: ${overflow}px overflow`);
        } else {
          console.log(`  ✅ No horizontal scroll`);
        }
      }
    }
  });
});