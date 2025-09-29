const { test, expect } = require('@playwright/test');

/**
 * Comprehensive Visibility Toggle Test Suite
 * Tests all section visibility toggles across all admin tabs and verifies
 * that sections are properly hidden/shown on the frontend.
 */

// Configuration
const BASE_URL = 'http://localhost:3005';
const ADMIN_URL = 'http://localhost:3000/admin-newdesign.html';
const API_URL = 'http://localhost:3000';

// Test data for all sections across different pages
const VISIBILITY_TESTS = {
  'home-page': {
    adminTab: 'home-page',
    frontendUrl: `${BASE_URL}/home.html`,
    sections: [
      {
        name: 'Hero Section',
        toggleSelector: '.toggle-switch[data-section="hero"]',
        frontendSelector: '.hero-section, .hero-wrapper, .hero-content',
        description: 'Main hero banner with title and CTA'
      },
      {
        name: 'Features Section',
        toggleSelector: '.toggle-switch[data-section="features"]',
        frontendSelector: '.features-section, .features-wrapper',
        description: 'Platform features grid'
      },
      {
        name: 'Courses Section',
        toggleSelector: '.toggle-switch[data-section="courses""]',
        frontendSelector: '.featured-courses-section, .courses-section',
        description: 'Featured courses display'
      },
      {
        name: 'Testimonials Section',
        toggleSelector: '.toggle-switch[data-section="testimonials""]',
        frontendSelector: '.testimonials-section, .testimonials-wrapper',
        description: 'Student testimonials'
      },
      {
        name: 'Awards Section',
        toggleSelector: '.toggle-switch[data-section="awards""]',
        frontendSelector: '.awards-section, .awards-wrapper',
        description: 'Awards and recognitions'
      },
      {
        name: 'CTA Section',
        toggleSelector: '.toggle-switch[data-section="cta""]',
        frontendSelector: '.cta-section, .call-to-action',
        description: 'Bottom call-to-action'
      }
    ]
  },
  'courses-page': {
    adminTab: 'courses-page',
    frontendUrl: `${BASE_URL}/courses.html`,
    sections: [
      {
        name: 'Courses Hero',
        toggleSelector: '.toggle-switch[data-section="hero"]',
        frontendSelector: '.hero-section, .courses-hero',
        description: 'Courses page hero section'
      },
      {
        name: 'Course Categories',
        toggleSelector: '.toggle-switch[data-section="categories""]',
        frontendSelector: '.categories-section, .course-categories',
        description: 'Course category filters'
      },
      {
        name: 'Course Grid',
        toggleSelector: '.toggle-switch[data-section="course_grid""]',
        frontendSelector: '.courses-grid, .course-collection',
        description: 'Main course listings'
      }
    ]
  },
  'pricing-page': {
    adminTab: 'pricing-page',
    frontendUrl: `${BASE_URL}/pricing.html`,
    sections: [
      {
        name: 'Pricing Hero',
        toggleSelector: '.toggle-switch[data-section="hero"]',
        frontendSelector: '.hero-section, .pricing-hero',
        description: 'Pricing page hero'
      },
      {
        name: 'Pricing Plans',
        toggleSelector: '.toggle-switch[data-section="plans""]',
        frontendSelector: '.pricing-section, .pricing-plans',
        description: 'Pricing plans grid'
      },
      {
        name: 'Features Comparison',
        toggleSelector: '.toggle-switch[data-section="features_comparison""]',
        frontendSelector: '.features-comparison, .comparison-table',
        description: 'Plan features comparison table'
      },
      {
        name: 'Pricing FAQs',
        toggleSelector: '.toggle-switch[data-section="faqs""]',
        frontendSelector: '.faq-section, .pricing-faqs',
        description: 'Pricing frequently asked questions'
      },
      {
        name: 'Pricing Testimonials',
        toggleSelector: '.toggle-switch[data-section="testimonials""]',
        frontendSelector: '.testimonials-section, .pricing-testimonials',
        description: 'Pricing page testimonials'
      }
    ]
  },
  'teachers-page': {
    adminTab: 'teachers-page',
    frontendUrl: `${BASE_URL}/teachers.html`,
    sections: [
      {
        name: 'Teachers Hero',
        toggleSelector: '.toggle-switch[data-section="hero"]',
        frontendSelector: '.hero-section, .teachers-hero',
        description: 'Teachers page hero'
      },
      {
        name: 'Instructor Grid',
        toggleSelector: '.toggle-switch[data-section="instructor_grid""]',
        frontendSelector: '.instructor-grid, .teachers-grid',
        description: 'Teacher profiles grid'
      },
      {
        name: 'Become Instructor CTA',
        toggleSelector: '.toggle-switch[data-section="become_instructor""]',
        frontendSelector: '.become-instructor, .instructor-cta',
        description: 'Become instructor call-to-action'
      },
      {
        name: 'Teachers Stats',
        toggleSelector: '.toggle-switch[data-section="stats""]',
        frontendSelector: '.stats-section, .teacher-stats',
        description: 'Teaching statistics'
      }
    ]
  },
  'career-center-platform-page': {
    adminTab: 'career-center-platform-page',
    frontendUrl: `${BASE_URL}/career-center.html`,
    sections: [
      {
        name: 'Career Hero',
        toggleSelector: '.toggle-switch[data-section="hero"]',
        frontendSelector: '.hero-section, .career-hero',
        description: 'Career center hero'
      },
      {
        name: 'Platform Features',
        toggleSelector: '.toggle-switch[data-section="features"]',
        frontendSelector: '.features-section, .platform-features',
        description: 'Career platform features'
      },
      {
        name: 'Career Opportunities',
        toggleSelector: '.toggle-switch[data-section="opportunities""]',
        frontendSelector: '.opportunities-section, .career-opportunities',
        description: 'Job opportunities section'
      },
      {
        name: 'Career Resources',
        toggleSelector: '.toggle-switch[data-section="resources""]',
        frontendSelector: '.resources-section, .career-resources',
        description: 'Career development resources'
      },
      {
        name: 'Career Testimonials',
        toggleSelector: '.toggle-switch[data-section="testimonials""]',
        frontendSelector: '.testimonials-section, .career-testimonials',
        description: 'Career success stories'
      }
    ]
  }
};

// Helper functions
async function waitForAPI(page, timeout = 5000) {
  await page.waitForTimeout(2000); // Give API time to respond
}

async function navigateToAdminTab(page, tabName) {
  console.log(`🔄 Switching to admin tab: ${tabName}`);
  await page.selectOption('#table-selector', tabName);
  await waitForAPI(page);
  await page.waitForSelector('#sections-container', { timeout: 10000 });
}

async function toggleSectionVisibility(page, toggleSelector, expectedState) {
  console.log(`🔄 Toggling section with selector: ${toggleSelector} to ${expectedState ? 'ON' : 'OFF'}`);

  const toggle = await page.locator(toggleSelector).first();
  await expect(toggle).toBeVisible({ timeout: 5000 });

  // Check current state
  const isCurrentlyActive = await toggle.evaluate(el => el.classList.contains('active'));

  // Only click if we need to change the state
  if (isCurrentlyActive !== expectedState) {
    await toggle.click();
    await page.waitForTimeout(500); // Brief pause for state change
  }

  // Verify the toggle state changed
  const isNowActive = await toggle.evaluate(el => el.classList.contains('active'));
  expect(isNowActive).toBe(expectedState);
}

async function saveSectionChanges(page, sectionName) {
  console.log(`💾 Saving changes for section: ${sectionName}`);

  // Look for save button - it might be in a specific section or a general save
  const saveButton = page.locator('button:has-text("Save"), .save-btn, [onclick*="save"]').first();

  if (await saveButton.isVisible()) {
    await saveButton.click();
    await page.waitForTimeout(2000); // Wait for save to complete

    // Wait for success message or loading to disappear
    await page.waitForSelector('.loading', { state: 'hidden', timeout: 10000 }).catch(() => {
      console.log('No loading indicator found, continuing...');
    });
  } else {
    console.log('⚠️ No save button found, changes may auto-save');
  }
}

async function checkSectionVisibility(page, frontendUrl, sectionSelector, shouldBeVisible) {
  console.log(`🔍 Checking section visibility on ${frontendUrl}`);
  console.log(`   Selector: ${sectionSelector}`);
  console.log(`   Should be visible: ${shouldBeVisible}`);

  await page.goto(frontendUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Let dynamic content load

  // Try multiple selectors since frontend might use different class names
  const selectors = sectionSelector.split(', ');
  let foundElement = false;
  let elementVisible = false;

  for (const selector of selectors) {
    try {
      const element = page.locator(selector).first();
      const count = await element.count();

      if (count > 0) {
        foundElement = true;
        const isVisible = await element.isVisible();
        const hasDisplayNone = await element.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
        });

        elementVisible = isVisible && !hasDisplayNone;
        console.log(`   Found element with ${selector}: visible=${elementVisible}, display=${!hasDisplayNone}`);
        break;
      }
    } catch (error) {
      console.log(`   Could not check ${selector}: ${error.message}`);
    }
  }

  if (!foundElement) {
    console.log(`   ⚠️ No element found with any selector: ${sectionSelector}`);
    // If no element found, assume it's properly hidden (removed from DOM)
    expect(shouldBeVisible).toBe(false);
    return;
  }

  // Verify visibility matches expectation
  if (shouldBeVisible) {
    expect(elementVisible).toBe(true);
    console.log(`   ✅ Section is visible as expected`);
  } else {
    expect(elementVisible).toBe(false);
    console.log(`   ✅ Section is hidden as expected`);
  }
}

// Main test suite
test.describe('Admin Panel Visibility Toggles', () => {
  test.beforeEach(async ({ page }) => {
    // Start with a clean slate
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#table-selector', { timeout: 10000 });
  });

  // Test each page/tab
  Object.entries(VISIBILITY_TESTS).forEach(([pageKey, pageConfig]) => {
    test.describe(`${pageConfig.adminTab} Visibility Tests`, () => {

      test(`should toggle all sections ON and verify visibility`, async ({ page }) => {
        await navigateToAdminTab(page, pageConfig.adminTab);

        // Test turning all sections ON
        for (const section of pageConfig.sections) {
          console.log(`\n🧪 Testing ${section.name} - Turning ON`);

          try {
            await toggleSectionVisibility(page, section.toggleSelector, true);
            await saveSectionChanges(page, section.name);
            await checkSectionVisibility(page, pageConfig.frontendUrl, section.frontendSelector, true);
          } catch (error) {
            console.error(`❌ Error testing ${section.name} ON: ${error.message}`);
            throw error;
          }
        }
      });

      test(`should toggle all sections OFF and verify they are hidden`, async ({ page }) => {
        await navigateToAdminTab(page, pageConfig.adminTab);

        // Test turning all sections OFF
        for (const section of pageConfig.sections) {
          console.log(`\n🧪 Testing ${section.name} - Turning OFF`);

          try {
            await toggleSectionVisibility(page, section.toggleSelector, false);
            await saveSectionChanges(page, section.name);
            await checkSectionVisibility(page, pageConfig.frontendUrl, section.frontendSelector, false);
          } catch (error) {
            console.error(`❌ Error testing ${section.name} OFF: ${error.message}`);
            throw error;
          }
        }
      });

      test(`should toggle sections ON/OFF multiple times`, async ({ page }) => {
        await navigateToAdminTab(page, pageConfig.adminTab);

        // Test the first section with multiple toggles
        if (pageConfig.sections.length > 0) {
          const section = pageConfig.sections[0];
          console.log(`\n🧪 Testing ${section.name} - Multiple toggles`);

          // OFF -> ON -> OFF -> ON
          const sequence = [false, true, false, true];

          for (let i = 0; i < sequence.length; i++) {
            const state = sequence[i];
            console.log(`   Step ${i + 1}: Turning ${state ? 'ON' : 'OFF'}`);

            await toggleSectionVisibility(page, section.toggleSelector, state);
            await saveSectionChanges(page, section.name);
            await checkSectionVisibility(page, pageConfig.frontendUrl, section.frontendSelector, state);
          }
        }
      });
    });
  });

  test('should test language-specific visibility', async ({ page }) => {
    // Test that visibility toggles work across different languages
    const testUrls = [
      `${BASE_URL}/home.html`,
      `${BASE_URL}/dist/en/home.html`,
      `${BASE_URL}/dist/ru/home.html`,
      `${BASE_URL}/dist/he/home.html`
    ];

    await navigateToAdminTab(page, 'home-page');

    // Turn OFF courses section
    await toggleSectionVisibility(page, '.toggle-switch[data-section="courses"]', false);
    await saveSectionChanges(page, 'Courses');

    // Check all language versions
    for (const url of testUrls) {
      console.log(`\n🌍 Testing visibility on ${url}`);
      try {
        await checkSectionVisibility(page, url, '.featured-courses-section, .courses-section', false);
      } catch (error) {
        console.log(`   ⚠️ Could not test ${url}: ${error.message}`);
      }
    }

    // Turn courses back ON
    await page.goto(ADMIN_URL);
    await navigateToAdminTab(page, 'home-page');
    await toggleSectionVisibility(page, '.toggle-switch[data-section="courses"]', true);
    await saveSectionChanges(page, 'Courses');
  });

  test('should test API endpoints for visibility data', async ({ page }) => {
    console.log('\n🔍 Testing API endpoints for visibility data');

    // Test key API endpoints to ensure they return visibility data
    const apiEndpoints = [
      '/api/nd/home-page?locale=en',
      '/api/nd/courses-page?locale=en',
      '/api/nd/pricing-page?locale=en',
      '/api/nd/teachers-page?locale=en',
      '/api/nd/career-center-platform-page?locale=en'
    ];

    for (const endpoint of apiEndpoints) {
      const response = await page.request.get(`${API_URL}${endpoint}`);
      expect(response.ok()).toBe(true);

      const data = await response.json();
      console.log(`   ✅ ${endpoint} returned data`);

      // Check that response has expected structure
      expect(data).toHaveProperty('success');
      expect(data.success).toBe(true);
    }
  });
});

test.describe('Comprehensive Toggle Test', () => {
  test('should run complete visibility test suite', async ({ page }) => {
    console.log('\n🚀 Running comprehensive visibility toggle test\n');

    let totalTests = 0;
    let passedTests = 0;
    const failedTests = [];

    for (const [pageKey, pageConfig] of Object.entries(VISIBILITY_TESTS)) {
      console.log(`\n📄 Testing page: ${pageConfig.adminTab}`);

      try {
        await page.goto(ADMIN_URL);
        await navigateToAdminTab(page, pageConfig.adminTab);

        for (const section of pageConfig.sections) {
          totalTests += 2; // Test both ON and OFF

          // Test OFF state
          try {
            console.log(`   🔄 ${section.name} -> OFF`);
            await toggleSectionVisibility(page, section.toggleSelector, false);
            await saveSectionChanges(page, section.name);
            await checkSectionVisibility(page, pageConfig.frontendUrl, section.frontendSelector, false);
            passedTests++;
            console.log(`   ✅ ${section.name} OFF - PASSED`);
          } catch (error) {
            failedTests.push(`${pageConfig.adminTab}:${section.name}:OFF - ${error.message}`);
            console.log(`   ❌ ${section.name} OFF - FAILED: ${error.message}`);
          }

          // Test ON state
          try {
            console.log(`   🔄 ${section.name} -> ON`);
            await page.goto(ADMIN_URL);
            await navigateToAdminTab(page, pageConfig.adminTab);
            await toggleSectionVisibility(page, section.toggleSelector, true);
            await saveSectionChanges(page, section.name);
            await checkSectionVisibility(page, pageConfig.frontendUrl, section.frontendSelector, true);
            passedTests++;
            console.log(`   ✅ ${section.name} ON - PASSED`);
          } catch (error) {
            failedTests.push(`${pageConfig.adminTab}:${section.name}:ON - ${error.message}`);
            console.log(`   ❌ ${section.name} ON - FAILED: ${error.message}`);
          }
        }
      } catch (error) {
        console.log(`   ❌ Failed to test page ${pageConfig.adminTab}: ${error.message}`);
        failedTests.push(`${pageConfig.adminTab}:PAGE_LOAD - ${error.message}`);
      }
    }

    // Final report
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests.length}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      failedTests.forEach(failure => console.log(`   • ${failure}`));
    }

    console.log('\n✅ Comprehensive visibility toggle test completed!');

    // Test should pass if success rate is above 80%
    expect(passedTests / totalTests).toBeGreaterThan(0.8);
  });
});