const { test, expect } = require('@playwright/test');

test.describe('Course Navigation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to courses page
    await page.goto('http://localhost:3005/courses.html');
  });

  test('should navigate from courses list to course details', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.featured-courses-single', { timeout: 10000 });

    // Get the first course card
    const firstCourseCard = await page.locator('.featured-courses-single').first();

    // Find the course details link
    const courseDetailsLink = firstCourseCard.locator('a.primary-button').first();

    // Get the href attribute to check it's correct
    const href = await courseDetailsLink.getAttribute('href');
    expect(href).toMatch(/detail_courses\.html\?id=\d+/);
    expect(href).not.toContain('/backups/newDesign/');

    // Click on the course details button
    await courseDetailsLink.click();

    // Wait for navigation
    await page.waitForURL(/.*detail_courses\.html\?id=\d+/);

    // Verify we're on the course details page
    const currentURL = page.url();
    expect(currentURL).toContain('detail_courses.html');
    expect(currentURL).toContain('id=');

    // Check that course details page has loaded properly
    await expect(page.locator('h1, .course-title, .hero-title')).toBeVisible({ timeout: 10000 });
  });

  test('should have correct course card links', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.featured-courses-single', { timeout: 10000 });

    // Get all course cards
    const courseCards = await page.locator('.featured-courses-single').all();

    expect(courseCards.length).toBeGreaterThan(0);

    // Check each course card has proper links
    for (let i = 0; i < Math.min(courseCards.length, 3); i++) {
      const card = courseCards[i];

      // Check image link
      const imageLink = await card.locator('a.featured-courses-image-link').getAttribute('href');
      if (imageLink) {
        expect(imageLink).toMatch(/detail_courses\.html\?id=\d+/);
        expect(imageLink).not.toContain('/backups/newDesign/');
      }

      // Check title link
      const titleLink = await card.locator('a.featured-courses-name').getAttribute('href');
      if (titleLink) {
        expect(titleLink).toMatch(/detail_courses\.html\?id=\d+/);
        expect(titleLink).not.toContain('/backups/newDesign/');
      }

      // Check button link
      const buttonLink = await card.locator('a.primary-button').getAttribute('href');
      if (buttonLink) {
        expect(buttonLink).toMatch(/detail_courses\.html\?id=\d+/);
        expect(buttonLink).not.toContain('/backups/newDesign/');
      }
    }
  });

  test('should load course details page with valid ID', async ({ page }) => {
    // Navigate directly to a course details page
    await page.goto('http://localhost:3005/detail_courses.html?id=1');

    // Check the page loaded correctly
    await expect(page).toHaveURL(/.*detail_courses\.html\?id=1/);

    // Wait for content to load
    await page.waitForSelector('body', { state: 'visible' });

    // Check for common course detail elements
    const hasContent = await page.locator('h1, h2, .course-title, .hero-title').count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test('admin preview links should work', async ({ page }) => {
    // Go to admin page
    await page.goto('http://localhost:3005/admin-nd.html');

    // Wait for admin page to load
    await page.waitForSelector('.course-card, .course-row, [class*="course"]', { timeout: 10000 });

    // Check if preview buttons have correct URLs
    const previewButtons = await page.locator('button.preview-btn').all();

    for (let i = 0; i < Math.min(previewButtons.length, 2); i++) {
      const button = previewButtons[i];
      const onclickAttr = await button.getAttribute('onclick');

      if (onclickAttr) {
        // Check the onclick doesn't contain the old path
        expect(onclickAttr).not.toContain('/backups/newDesign/');
        expect(onclickAttr).toContain('detail_courses.html?id=');
      }
    }
  });
});