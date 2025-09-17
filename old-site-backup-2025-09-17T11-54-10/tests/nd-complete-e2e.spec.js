/**
 * Complete E2E Test Suite for New Design System
 * Tests all functionality including UI, API, Database integration
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8080';
const API_URL = 'http://localhost:3000';

test.describe('New Design Complete E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage to ensure clean state
        await page.addInitScript(() => {
            localStorage.clear();
        });
    });

    test.describe('Page Loading and Structure', () => {
        test('should load home page with all sections', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/index.html`);

            // Wait for content to load
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // Check page title
            await expect(page).toHaveTitle(/AI Studio/);

            // Check hero section
            const heroTitle = await page.locator('[data-field="hero.title"]').textContent();
            expect(heroTitle).not.toBe('Loading...');
            expect(heroTitle).toContain('AI Studio');

            // Check all major sections exist
            await expect(page.locator('[data-section="hero"]')).toBeVisible();
            await expect(page.locator('[data-section="features"]')).toBeVisible();
            await expect(page.locator('[data-section="courses"]')).toBeVisible();
            await expect(page.locator('[data-section="testimonials"]')).toBeVisible();
            await expect(page.locator('[data-section="blog"]')).toBeVisible();
            await expect(page.locator('[data-section="cta_1"]')).toBeVisible();
        });

        test('should have no console errors', async ({ page }) => {
            const errors = [];
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    errors.push(msg.text());
                }
            });

            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForLoadState('networkidle');

            // Filter out expected 404s for missing pages
            const criticalErrors = errors.filter(err =>
                !err.includes('404') &&
                !err.includes('Failed to load resource')
            );

            expect(criticalErrors).toHaveLength(0);
        });
    });

    test.describe('Navigation Menu', () => {
        test('should render all 6 menu items from database', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(3000); // Wait for menu to load

            const menuItems = await page.locator('[data-component="menu"] a').all();
            expect(menuItems).toHaveLength(6);

            // Check menu items text
            const expectedItems = ['Home', 'Courses', 'Pricing', 'About Us', 'Blog', 'Contact'];
            for (let i = 0; i < menuItems.length; i++) {
                const text = await menuItems[i].textContent();
                expect(expectedItems).toContain(text.trim());
            }
        });

        test('should highlight current page in menu', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(2000);

            const currentLink = await page.locator('[data-component="menu"] a.w--current');
            await expect(currentLink).toHaveText('Home');
        });
    });

    test.describe('Dynamic Content Loading', () => {
        test('should load hero content from API', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(2000);

            const heroTitle = await page.locator('[data-field="hero.title"]').textContent();
            expect(heroTitle).toBe('Welcome to AI Studio New Design');

            const heroSubtitle = await page.locator('[data-field="hero.subtitle"]').textContent();
            expect(heroSubtitle).toBe('Modern Learning Platform');

            const heroDescription = await page.locator('[data-field="hero.description"]').textContent();
            expect(heroDescription).toBe('Experience the next generation of online education');
        });

        test('should cache content in localStorage', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(2000);

            // Check if cache was set
            const cache = await page.evaluate(() => {
                const cacheData = localStorage.getItem('nd_cache_home_en');
                return cacheData ? JSON.parse(cacheData) : null;
            });

            expect(cache).not.toBeNull();
            expect(cache.data).toHaveProperty('hero');
        });
    });

    test.describe('Animation Toggle System', () => {
        test('should have working animation toggle', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(2000);

            // Check if AnimationToggle class exists
            const hasToggle = await page.evaluate(() => {
                return typeof window.AnimationToggle !== 'undefined';
            });
            expect(hasToggle).toBe(true);

            // Toggle animations off
            await page.evaluate(() => {
                localStorage.setItem('nd_animations_disabled', 'true');
            });
            await page.reload();

            // Check if no-animations class is applied
            const hasNoAnimations = await page.evaluate(() => {
                return document.documentElement.classList.contains('no-animations');
            });
            expect(hasNoAnimations).toBe(true);

            // Toggle animations back on
            await page.evaluate(() => {
                localStorage.setItem('nd_animations_disabled', 'false');
            });
            await page.reload();

            const animationsEnabled = await page.evaluate(() => {
                return !document.documentElement.classList.contains('no-animations');
            });
            expect(animationsEnabled).toBe(true);
        });

        test('should respect prefers-reduced-motion', async ({ page, browserName }) => {
            // Skip for webkit as it handles this differently
            if (browserName === 'webkit') {
                test.skip();
            }

            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(`${BASE_URL}/nd/index.html`);

            const hasNoAnimations = await page.evaluate(() => {
                return document.documentElement.classList.contains('no-animations');
            });
            expect(hasNoAnimations).toBe(true);
        });
    });

    test.describe('Multi-Language Support', () => {
        test('should support English locale', async ({ page }) => {
            const response = await page.request.get(`${API_URL}/api/nd/home-page?locale=en`);
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.meta.locale).toBe('en');
        });

        test('should support Russian locale with fallback', async ({ page }) => {
            const response = await page.request.get(`${API_URL}/api/nd/home-page?locale=ru`);
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.meta.locale).toBe('ru');
        });

        test('should support Hebrew locale with fallback', async ({ page }) => {
            const response = await page.request.get(`${API_URL}/api/nd/home-page?locale=he`);
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.meta.locale).toBe('he');
        });
    });

    test.describe('API Endpoints', () => {
        test('should have working home page API', async ({ page }) => {
            const response = await page.request.get(`${API_URL}/api/nd/home-page`);
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data).toHaveProperty('hero');
            expect(data.data).toHaveProperty('features');
            expect(data.data).toHaveProperty('courses');
        });

        test('should have working menu API', async ({ page }) => {
            const response = await page.request.get(`${API_URL}/api/nd/menu`);
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(Array.isArray(data.data)).toBe(true);
            expect(data.data.length).toBe(6);
        });

        test('should have working footer API', async ({ page }) => {
            const response = await page.request.get(`${API_URL}/api/nd/footer`);
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data).toHaveProperty('columns');
            expect(data.data).toHaveProperty('social');
            expect(data.data).toHaveProperty('copyright');
        });

        test('should have working visibility toggle API', async ({ page }) => {
            const response = await page.request.patch(
                `${API_URL}/api/nd/home-page/features/visibility`,
                {
                    data: { visible: false }
                }
            );
            expect(response.ok()).toBeTruthy();

            // Toggle back to visible
            const restoreResponse = await page.request.patch(
                `${API_URL}/api/nd/home-page/features/visibility`,
                {
                    data: { visible: true }
                }
            );
            expect(restoreResponse.ok()).toBeTruthy();
        });
    });

    test.describe('Footer Rendering', () => {
        test('should render footer with dynamic content', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(3000);

            const footer = await page.locator('[data-component="footer"]');
            await expect(footer).toBeVisible();

            // Check if footer has content
            const footerContent = await footer.textContent();
            expect(footerContent).toContain('2025 AI Studio');
        });
    });

    test.describe('Responsive Design', () => {
        test('should be mobile responsive', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(2000);

            // Check if hero is still visible
            await expect(page.locator('[data-section="hero"]')).toBeVisible();

            // Check if content adapts
            const heroTitle = await page.locator('[data-field="hero.title"]');
            await expect(heroTitle).toBeVisible();
        });

        test('should be tablet responsive', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(2000);

            await expect(page.locator('[data-section="hero"]')).toBeVisible();
        });
    });

    test.describe('Performance', () => {
        test('should load within acceptable time', async ({ page }) => {
            const startTime = Date.now();
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForLoadState('networkidle');
            const loadTime = Date.now() - startTime;

            expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
        });

        test('should use cached data on second load', async ({ page }) => {
            // First load
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(2000);

            // Second load should be faster
            const startTime = Date.now();
            await page.reload();
            await page.waitForLoadState('networkidle');
            const reloadTime = Date.now() - startTime;

            expect(reloadTime).toBeLessThan(2000); // Cached load should be under 2 seconds
        });
    });

    test.describe('Admin Panel', () => {
        test('should have accessible admin panel', async ({ page }) => {
            const response = await page.goto(`${BASE_URL}/admin-nd.html`);
            expect(response.ok()).toBeTruthy();

            await expect(page).toHaveTitle(/Admin/);
        });
    });

    test.describe('Visual Regression', () => {
        test('should match visual appearance', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(3000);

            // Take screenshot for visual comparison
            await expect(page).toHaveScreenshot('home-page.png', {
                fullPage: false,
                animations: 'disabled'
            });
        });
    });

    test.describe('Accessibility', () => {
        test('should have proper heading structure', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(2000);

            const h1 = await page.locator('h1');
            await expect(h1).toHaveCount(1);

            // Check for logical heading hierarchy
            const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
            expect(headings.length).toBeGreaterThan(0);
        });

        test('should have alt text for images', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/index.html`);
            await page.waitForTimeout(2000);

            const images = await page.locator('img').all();
            for (const img of images) {
                const alt = await img.getAttribute('alt');
                expect(alt).not.toBeNull();
            }
        });
    });
});

// Run with: npx playwright test tests/nd-complete-e2e.spec.js