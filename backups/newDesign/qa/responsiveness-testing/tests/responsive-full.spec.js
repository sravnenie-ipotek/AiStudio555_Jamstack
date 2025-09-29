// @ts-check
const { test, expect } = require('@playwright/test');
const testPages = require('../config/test-pages.json');
const fs = require('fs-extra');
const path = require('path');

/**
 * Comprehensive Responsiveness Testing Suite
 * Tests all pages across all defined viewports
 */

// Helper function to check element visibility and position
async function checkElementResponsiveness(page, selector, viewport) {
  try {
    const element = await page.locator(selector).first();

    if (await element.count() === 0) {
      return {
        selector,
        viewport,
        status: 'not-found',
        message: `Element ${selector} not found`
      };
    }

    const isVisible = await element.isVisible({ timeout: 5000 }).catch(() => false);

    if (!isVisible) {
      return {
        selector,
        viewport,
        status: 'hidden',
        message: `Element ${selector} is hidden`
      };
    }

    const box = await element.boundingBox();

    if (!box) {
      return {
        selector,
        viewport,
        status: 'no-bounds',
        message: `Element ${selector} has no bounding box`
      };
    }

    // Check if element is within viewport
    const viewportWidth = viewport.width;
    const viewportHeight = viewport.height;

    const issues = [];

    // Check horizontal overflow
    if (box.x < 0) {
      issues.push(`Element extends ${Math.abs(box.x)}px past left edge`);
    }
    if (box.x + box.width > viewportWidth) {
      issues.push(`Element extends ${(box.x + box.width) - viewportWidth}px past right edge`);
    }

    // Check if element is too small (potential readability issue)
    if (box.width < 44 && box.height < 44) {
      const isInteractive = await element.evaluate(el => {
        return el.tagName === 'BUTTON' ||
               el.tagName === 'A' ||
               el.tagName === 'INPUT' ||
               el.onclick !== null ||
               el.getAttribute('role') === 'button';
      });

      if (isInteractive) {
        issues.push(`Interactive element is too small (${Math.round(box.width)}x${Math.round(box.height)}px) - minimum recommended is 44x44px`);
      }
    }

    // Check text readability
    const fontSize = await element.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });

    if (fontSize) {
      const fontSizeNum = parseFloat(fontSize);
      if (fontSizeNum < 12 && viewport.width <= 480) {
        issues.push(`Font size too small for mobile (${fontSize})`);
      }
    }

    // Check z-index issues
    const zIndex = await element.evaluate(el => {
      return window.getComputedStyle(el).zIndex;
    });

    if (zIndex === '-1' || zIndex === '-999') {
      issues.push(`Element has negative z-index (${zIndex})`);
    }

    return {
      selector,
      viewport,
      status: issues.length > 0 ? 'issues' : 'ok',
      issues,
      bounds: box,
      fontSize,
      zIndex
    };

  } catch (error) {
    return {
      selector,
      viewport,
      status: 'error',
      message: error.message
    };
  }
}

// Helper to check for horizontal scroll
async function checkHorizontalScroll(page) {
  return await page.evaluate(() => {
    const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    const bodyOverflow = window.getComputedStyle(document.body).overflowX;

    return {
      hasScroll: hasHorizontalScroll,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      difference: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bodyOverflow
    };
  });
}

// Helper to check images
async function checkImages(page) {
  return await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => {
      const rect = img.getBoundingClientRect();
      const styles = window.getComputedStyle(img);

      return {
        src: img.src,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: rect.width,
        displayHeight: rect.height,
        isVisible: rect.width > 0 && rect.height > 0,
        isLoaded: img.complete && img.naturalWidth > 0,
        hasAlt: img.alt && img.alt.length > 0,
        objectFit: styles.objectFit,
        isResponsive: img.srcset || styles.maxWidth === '100%' || rect.width <= window.innerWidth
      };
    });
  });
}

// Helper to check text overflow
async function checkTextOverflow(page) {
  return await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a'));
    const overflowing = [];

    elements.forEach(el => {
      if (el.scrollWidth > el.clientWidth) {
        const styles = window.getComputedStyle(el);
        overflowing.push({
          tag: el.tagName.toLowerCase(),
          class: el.className,
          text: el.textContent.substring(0, 50),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          overflow: styles.overflow,
          textOverflow: styles.textOverflow,
          whiteSpace: styles.whiteSpace
        });
      }
    });

    return overflowing;
  });
}

// Main test suite
testPages.pages.forEach(pageConfig => {
  test.describe(`Responsive Tests: ${pageConfig.name}`, () => {
    test.describe.configure({ mode: 'parallel' });

    testPages.testViewports.forEach(viewport => {
      test(`${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        const results = {
          page: pageConfig.name,
          url: pageConfig.path,
          viewport: viewport,
          timestamp: new Date().toISOString(),
          issues: [],
          warnings: [],
          passed: []
        };

        // Set viewport
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Navigate to page
        await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

        // Wait for any animations to complete
        await page.waitForTimeout(1000);

        // Take initial screenshot
        const screenshotDir = path.join('screenshots', pageConfig.name.toLowerCase().replace(/\s+/g, '-'));
        await fs.ensureDir(screenshotDir);

        const screenshotPath = path.join(
          screenshotDir,
          `${viewport.name.toLowerCase()}-${viewport.width}x${viewport.height}.png`
        );

        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });

        // Check for horizontal scroll
        const horizontalScroll = await checkHorizontalScroll(page);
        if (horizontalScroll.hasScroll) {
          results.issues.push({
            type: 'horizontal-scroll',
            message: `Page has horizontal scroll (${horizontalScroll.difference}px overflow)`,
            details: horizontalScroll
          });
        } else {
          results.passed.push('No horizontal scroll detected');
        }

        // Check all defined elements
        for (const selector of pageConfig.elements) {
          const elementCheck = await checkElementResponsiveness(page, selector, viewport);

          if (elementCheck.status === 'ok') {
            results.passed.push(`${selector} renders correctly`);
          } else if (elementCheck.status === 'issues') {
            results.warnings.push({
              selector,
              issues: elementCheck.issues
            });
          } else if (elementCheck.status === 'error' || elementCheck.status === 'not-found') {
            // Only add to issues if it's supposed to be visible at this viewport
            if (viewport.width > 768 || !selector.includes('desktop')) {
              results.issues.push({
                selector,
                message: elementCheck.message
              });
            }
          }
        }

        // Check images
        const images = await checkImages(page);
        const imageIssues = images.filter(img => !img.isLoaded || !img.isResponsive || !img.hasAlt);

        if (imageIssues.length > 0) {
          results.warnings.push({
            type: 'images',
            count: imageIssues.length,
            details: imageIssues.slice(0, 5) // Limit to first 5 issues
          });
        }

        // Check text overflow
        const overflowingText = await checkTextOverflow(page);
        if (overflowingText.length > 0) {
          results.warnings.push({
            type: 'text-overflow',
            count: overflowingText.length,
            details: overflowingText.slice(0, 5) // Limit to first 5 issues
          });
        }

        // Check mobile menu functionality (mobile only)
        if (viewport.width <= 991) {
          const menuButton = await page.locator('.menu-button, .w-nav-button').first();
          if (await menuButton.count() > 0) {
            const isVisible = await menuButton.isVisible();
            if (isVisible) {
              // Test menu toggle
              await menuButton.click();
              await page.waitForTimeout(500);

              const navMenu = await page.locator('.nav-menu, .w-nav-menu').first();
              const menuVisible = await navMenu.isVisible().catch(() => false);

              if (menuVisible) {
                results.passed.push('Mobile menu toggle works');
              } else {
                results.issues.push({
                  type: 'mobile-menu',
                  message: 'Mobile menu does not open when clicked'
                });
              }

              // Close menu
              await menuButton.click();
              await page.waitForTimeout(500);
            }
          }
        }

        // Check touch targets (mobile only)
        if (viewport.width <= 480) {
          const interactiveElements = await page.locator('button, a, input, select, textarea, [role="button"]').all();
          const smallTargets = [];

          for (const element of interactiveElements.slice(0, 20)) { // Check first 20 elements
            const box = await element.boundingBox();
            if (box && (box.width < 44 || box.height < 44)) {
              const text = await element.textContent().catch(() => '');
              smallTargets.push({
                text: text.substring(0, 30),
                size: `${Math.round(box.width)}x${Math.round(box.height)}px`
              });
            }
          }

          if (smallTargets.length > 0) {
            results.warnings.push({
              type: 'touch-targets',
              message: `${smallTargets.length} interactive elements below minimum touch target size`,
              details: smallTargets.slice(0, 5)
            });
          }
        }

        // Save results to JSON
        const reportDir = path.join('reports', 'json');
        await fs.ensureDir(reportDir);

        const reportPath = path.join(
          reportDir,
          `${pageConfig.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.name.toLowerCase()}.json`
        );

        await fs.writeJson(reportPath, results, { spaces: 2 });

        // Assertions
        expect(results.issues.length,
          `Page ${pageConfig.name} has ${results.issues.length} critical issues at ${viewport.name}`
        ).toBeLessThanOrEqual(0);

        // Log summary
        console.log(`✓ ${pageConfig.name} - ${viewport.name}: ${results.passed.length} passed, ${results.warnings.length} warnings, ${results.issues.length} issues`);
      });
    });
  });
});

// Global teardown
test.afterAll(async () => {
  // Generate summary report
  const reportDir = path.join('reports', 'json');
  const reports = await fs.readdir(reportDir).catch(() => []);

  const summary = {
    timestamp: new Date().toISOString(),
    totalTests: reports.length,
    results: []
  };

  for (const report of reports) {
    if (report.endsWith('.json')) {
      const data = await fs.readJson(path.join(reportDir, report)).catch(() => null);
      if (data) {
        summary.results.push({
          page: data.page,
          viewport: data.viewport.name,
          passed: data.passed.length,
          warnings: data.warnings.length,
          issues: data.issues.length
        });
      }
    }
  }

  await fs.writeJson(path.join('reports', 'summary.json'), summary, { spaces: 2 });
  console.log('\n📊 Test summary saved to reports/summary.json');
});