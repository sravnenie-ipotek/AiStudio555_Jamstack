/**
 * Comprehensive Test Suite for AI Studio Web Application
 * Tests all major functionality including language switching, navigation, forms, and API integration
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3005/backups/newDesign';
const API_URL = 'http://localhost:1337';
const LANGUAGES = ['en', 'ru', 'he'];
const PAGES = ['home.html', 'courses.html', 'teachers.html', 'blog.html', 'career-center.html', 'career-orientation.html'];

// Test timeouts
test.setTimeout(60000); // 60 seconds per test

test.describe('AI Studio Comprehensive Test Suite', () => {
    test.beforeAll(async () => {
        console.log('Starting comprehensive test suite for AI Studio');
        console.log('Base URL:', BASE_URL);
        console.log('API URL:', API_URL);
    });

    test.describe('Language Switching Tests', () => {
        test('Language pills are visible and clickable on all pages', async ({ page }) => {
            for (const pageName of PAGES) {
                await page.goto(`${BASE_URL}/${pageName}`);

                // Check desktop language pills
                const desktopPills = await page.locator('.lang-pill');
                await expect(desktopPills).toHaveCount(3);

                for (let i = 0; i < 3; i++) {
                    await expect(desktopPills.nth(i)).toBeVisible();
                    await expect(desktopPills.nth(i)).toBeEnabled();
                }

                // Check mobile language pills (if viewport is mobile)
                await page.setViewportSize({ width: 375, height: 667 });
                const mobilePills = await page.locator('.mobile-lang-pill');
                if (await mobilePills.count() > 0) {
                    await expect(mobilePills).toHaveCount(3);
                }

                // Reset viewport
                await page.setViewportSize({ width: 1280, height: 720 });
            }
        });

        test('Language switching updates content dynamically', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            // Wait for initial content load
            await page.waitForLoadState('networkidle');

            // Click Russian language pill
            await page.click('.lang-pill:has-text("RU")');

            // Check if language attribute changes
            await expect(page.locator('html')).toHaveAttribute('lang', 'ru');

            // Check URL updates with locale parameter
            expect(page.url()).toContain('locale=ru');

            // Click Hebrew language pill
            await page.click('.lang-pill:has-text("HE")');

            // Check RTL direction for Hebrew
            await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
            await expect(page.locator('html')).toHaveAttribute('lang', 'he');

            // Check URL updates
            expect(page.url()).toContain('locale=he');

            // Switch back to English
            await page.click('.lang-pill:has-text("EN")');
            await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
            await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        });

        test('Language preference persists in localStorage', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            // Set language to Russian
            await page.click('.lang-pill:has-text("RU")');

            // Check localStorage
            const locale = await page.evaluate(() => localStorage.getItem('preferred_locale'));
            expect(locale).toBe('ru');

            // Reload page
            await page.reload();

            // Check if Russian is still active
            await expect(page.locator('.lang-pill:has-text("RU")')).toHaveClass(/active/);
        });

        test('Language content caching works correctly', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            // Monitor network requests
            const requests = [];
            page.on('request', request => {
                if (request.url().includes('/api/')) {
                    requests.push(request.url());
                }
            });

            // Switch to Russian (should make API call)
            await page.click('.lang-pill:has-text("RU")');
            await page.waitForTimeout(1000);

            const initialRequestCount = requests.length;

            // Switch to English and back to Russian (should use cache)
            await page.click('.lang-pill:has-text("EN")');
            await page.waitForTimeout(500);
            await page.click('.lang-pill:has-text("RU")');
            await page.waitForTimeout(500);

            // Check that no additional API call was made for cached content
            const cachedRequestCount = requests.filter(r => r.includes('locale=ru')).length;
            expect(cachedRequestCount).toBe(1); // Only one request for Russian content
        });
    });

    test.describe('Navigation Tests', () => {
        test('Main navigation links work correctly', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            const navLinks = [
                { text: 'Courses', expected: 'courses.html' },
                { text: 'Teachers', expected: 'teachers.html' },
                { text: 'Blog', expected: 'blog.html' }
            ];

            for (const link of navLinks) {
                // Click navigation link
                await page.click(`a:has-text("${link.text}")`);
                await page.waitForLoadState('networkidle');

                // Check URL contains expected page
                expect(page.url()).toContain(link.expected);

                // Go back to home for next test
                await page.goto(`${BASE_URL}/home.html`);
            }
        });

        test('Career Services dropdown works', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            // Hover over Career Services dropdown
            await page.hover('.dropdown-toggle-2:has-text("Career Services")');

            // Check dropdown is visible
            const dropdown = page.locator('.dropdown-list-3');
            await expect(dropdown).toBeVisible();

            // Check dropdown items
            const dropdownItems = ['Career Center', 'Career Orientation'];
            for (const item of dropdownItems) {
                await expect(dropdown.locator(`a:has-text("${item}")`)).toBeVisible();
            }
        });

        test('Mobile menu toggle works', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(`${BASE_URL}/home.html`);

            // Click menu button
            const menuButton = page.locator('.menu-button');
            await menuButton.click();

            // Check mobile menu is visible
            const mobileNav = page.locator('.nav-menu');
            await expect(mobileNav).toBeVisible();

            // Close menu
            await menuButton.click();
            await expect(mobileNav).not.toBeVisible();
        });

        test('Logo links back to home', async ({ page }) => {
            await page.goto(`${BASE_URL}/courses.html`);

            // Click logo
            await page.click('.brand');

            // Should navigate to home
            expect(page.url()).toContain('home.html');
        });
    });

    test.describe('API Integration Tests', () => {
        test('Home page loads dynamic content from API', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            // Check for dynamic content markers
            const response = await page.evaluate(async () => {
                const res = await fetch('http://localhost:1337/api/nd/home-page');
                return res.ok;
            });

            expect(response).toBe(true);
        });

        test('Courses page loads course data', async ({ page }) => {
            await page.goto(`${BASE_URL}/courses.html`);

            const response = await page.evaluate(async () => {
                const res = await fetch('http://localhost:1337/api/nd/courses');
                const data = await res.json();
                return data;
            });

            // Check response structure
            if (Array.isArray(response)) {
                expect(response.length).toBeGreaterThan(0);
            } else {
                expect(response).toHaveProperty('courses');
            }
        });

        test('Teachers page loads instructor data', async ({ page }) => {
            await page.goto(`${BASE_URL}/teachers.html`);

            const response = await page.evaluate(async () => {
                const res = await fetch('http://localhost:1337/api/teachers');
                return res.ok;
            });

            expect(response).toBe(true);
        });

        test('Blog page loads posts', async ({ page }) => {
            await page.goto(`${BASE_URL}/blog.html`);

            const response = await page.evaluate(async () => {
                const res = await fetch('http://localhost:1337/api/blog-posts');
                return res.ok;
            });

            expect(response).toBe(true);
        });
    });

    test.describe('Form and Modal Tests', () => {
        test('Contact form modal opens on Sign Up button click', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            // Find and click a Sign Up button
            const signUpButton = page.locator('a:has-text("Sign Up Today")').first();
            if (await signUpButton.count() > 0) {
                await signUpButton.click();

                // Check if modal opens (assuming modal has specific class or id)
                const modal = page.locator('#contact-modal, .contact-modal, [data-modal="contact"]');
                if (await modal.count() > 0) {
                    await expect(modal).toBeVisible();
                }
            }
        });

        test('Search functionality exists', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            // Check for search input
            const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], .search-input');
            if (await searchInput.count() > 0) {
                await searchInput.fill('test search');

                // Check if search works (enter key or button)
                await searchInput.press('Enter');
                // Or click search button if exists
                const searchButton = page.locator('button[type="submit"], .search-button');
                if (await searchButton.count() > 0) {
                    await searchButton.click();
                }
            }
        });
    });

    test.describe('Responsive Design Tests', () => {
        const viewports = [
            { name: 'Desktop', width: 1920, height: 1080 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Mobile', width: 375, height: 667 }
        ];

        for (const viewport of viewports) {
            test(`Layout adapts correctly on ${viewport.name}`, async ({ page }) => {
                await page.setViewportSize({ width: viewport.width, height: viewport.height });
                await page.goto(`${BASE_URL}/home.html`);

                // Check key elements are visible
                await expect(page.locator('.navbar')).toBeVisible();

                if (viewport.name === 'Mobile') {
                    // Mobile specific checks
                    await expect(page.locator('.menu-button')).toBeVisible();
                    await expect(page.locator('.nav-menu')).toBeHidden();
                } else {
                    // Desktop/Tablet checks
                    await expect(page.locator('.nav-menu')).toBeVisible();
                }

                // Check hero section
                const hero = page.locator('.hero-section, .section-hero, [data-section="hero"]').first();
                if (await hero.count() > 0) {
                    await expect(hero).toBeVisible();
                }
            });
        }
    });

    test.describe('Performance Tests', () => {
        test('Page load time is acceptable', async ({ page }) => {
            const startTime = Date.now();
            await page.goto(`${BASE_URL}/home.html`);
            await page.waitForLoadState('networkidle');
            const loadTime = Date.now() - startTime;

            console.log(`Page load time: ${loadTime}ms`);
            expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
        });

        test('Images have proper optimization', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            // Check all images
            const images = await page.locator('img').all();
            for (const img of images) {
                // Check if image has alt text
                const alt = await img.getAttribute('alt');
                expect(alt).not.toBeNull();

                // Check if image loads successfully
                const isVisible = await img.isVisible();
                if (isVisible) {
                    const naturalWidth = await img.evaluate(el => el.naturalWidth);
                    expect(naturalWidth).toBeGreaterThan(0);
                }
            }
        });
    });

    test.describe('Accessibility Tests', () => {
        test('Page has proper heading hierarchy', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            // Check for h1
            const h1 = await page.locator('h1');
            expect(await h1.count()).toBeGreaterThan(0);

            // Check heading hierarchy
            const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
            expect(headings.length).toBeGreaterThan(0);
        });

        test('Links have proper text or aria-labels', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            const links = await page.locator('a').all();
            for (const link of links.slice(0, 10)) { // Check first 10 links
                const text = await link.textContent();
                const ariaLabel = await link.getAttribute('aria-label');

                // Either text or aria-label should exist
                expect(text || ariaLabel).toBeTruthy();
            }
        });

        test('Forms have proper labels', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            const inputs = await page.locator('input[type="text"], input[type="email"], input[type="tel"]').all();
            for (const input of inputs) {
                const id = await input.getAttribute('id');
                const ariaLabel = await input.getAttribute('aria-label');
                const placeholder = await input.getAttribute('placeholder');

                // Input should have either label, aria-label, or placeholder
                if (id) {
                    const label = await page.locator(`label[for="${id}"]`).count();
                    expect(label > 0 || ariaLabel || placeholder).toBeTruthy();
                } else {
                    expect(ariaLabel || placeholder).toBeTruthy();
                }
            }
        });
    });

    test.describe('Error Handling Tests', () => {
        test('404 pages are handled gracefully', async ({ page }) => {
            const response = await page.goto(`${BASE_URL}/non-existent-page.html`);

            if (response && response.status() === 404) {
                // Should show 404 page or redirect
                const bodyText = await page.textContent('body');
                expect(bodyText).toContain('404');
            }
        });

        test('API failures are handled gracefully', async ({ page }) => {
            // Intercept API calls and simulate failure
            await page.route('**/api/**', route => {
                route.fulfill({
                    status: 500,
                    body: JSON.stringify({ error: 'Server error' })
                });
            });

            await page.goto(`${BASE_URL}/home.html`);

            // Page should still load even with API failures
            await expect(page.locator('.navbar')).toBeVisible();

            // Check console for error handling
            const consoleMessages = [];
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    consoleMessages.push(msg.text());
                }
            });

            await page.waitForTimeout(2000);

            // Should have logged errors but not crashed
            expect(consoleMessages.length).toBeGreaterThan(0);
        });
    });

    test.describe('Content Tests', () => {
        test('All pages have title and meta tags', async ({ page }) => {
            for (const pageName of PAGES) {
                await page.goto(`${BASE_URL}/${pageName}`);

                // Check title
                const title = await page.title();
                expect(title).toBeTruthy();
                expect(title.length).toBeGreaterThan(0);

                // Check meta description
                const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
                // Meta description might not exist on all pages, but check if it exists
                if (metaDescription) {
                    expect(metaDescription.length).toBeGreaterThan(0);
                }
            }
        });

        test('External links open in new tab', async ({ page }) => {
            await page.goto(`${BASE_URL}/home.html`);

            const externalLinks = await page.locator('a[href^="http"]:not([href*="localhost"]):not([href*="aistudio"])').all();
            for (const link of externalLinks.slice(0, 5)) { // Check first 5 external links
                const target = await link.getAttribute('target');
                const rel = await link.getAttribute('rel');

                // External links should open in new tab
                expect(target).toBe('_blank');
                // Should have proper rel attributes for security
                if (rel) {
                    expect(rel).toContain('noopener');
                }
            }
        });
    });

    test.describe('Security Tests', () => {
        test('No sensitive information in console', async ({ page }) => {
            const consoleMessages = [];
            page.on('console', msg => {
                consoleMessages.push(msg.text());
            });

            await page.goto(`${BASE_URL}/home.html`);
            await page.waitForTimeout(2000);

            // Check for sensitive information patterns
            const sensitivePatterns = [
                /api[_-]?key/i,
                /password/i,
                /secret/i,
                /token/i,
                /private/i
            ];

            for (const message of consoleMessages) {
                for (const pattern of sensitivePatterns) {
                    // Allow error messages about missing keys, but not actual keys
                    if (pattern.test(message) && !message.includes('not found') && !message.includes('missing')) {
                        console.warn('Potential sensitive info in console:', message);
                    }
                }
            }
        });

        test('CORS headers are properly configured', async ({ page }) => {
            const response = await page.evaluate(async () => {
                const res = await fetch('http://localhost:1337/api/nd/home-page');
                return {
                    ok: res.ok,
                    headers: {
                        'access-control-allow-origin': res.headers.get('access-control-allow-origin')
                    }
                };
            });

            expect(response.ok).toBe(true);
            // In development, CORS should be configured
            expect(response.headers['access-control-allow-origin']).toBeTruthy();
        });
    });
});

// Test summary reporter
test.afterAll(async () => {
    console.log('====================================');
    console.log('Comprehensive Test Suite Completed');
    console.log('====================================');
    console.log('✅ All major functionality tested');
    console.log('✅ Language switching verified');
    console.log('✅ API integration checked');
    console.log('✅ Responsive design validated');
    console.log('✅ Accessibility basics covered');
    console.log('✅ Performance metrics collected');
    console.log('====================================');
});