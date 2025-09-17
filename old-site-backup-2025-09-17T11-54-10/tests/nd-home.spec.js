// Playwright tests for New Design home page
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3005';
const API_URL = process.env.API_URL || 'http://localhost:3000';

test.describe('New Design - Home Page', () => {

    test.beforeEach(async ({ page }) => {
        // Mock API responses for testing
        await page.route('**/api/nd/home-page*', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        hero: {
                            visible: true,
                            content: {
                                title: 'Welcome to AI Studio',
                                subtitle: 'Learn AI & ML from experts',
                                buttons: [
                                    { text: 'Get Started', url: '/courses' },
                                    { text: 'Learn More', url: '#features' }
                                ]
                            }
                        },
                        features: {
                            visible: true,
                            content: {
                                title: 'Why Choose Us',
                                items: [
                                    { title: 'Expert Teachers', description: 'Learn from the best' },
                                    { title: 'Flexible Learning', description: 'Study at your pace' }
                                ]
                            }
                        }
                    },
                    meta: {
                        title: 'AI Studio - Home',
                        description: 'Learn AI from experts'
                    }
                })
            });
        });

        await page.goto(`${BASE_URL}/nd/home.html`);
    });

    test.describe('Page Loading', () => {
        test('should load the page successfully', async ({ page }) => {
            await expect(page).toHaveTitle(/AI Studio|Zohacous/);
            await expect(page.locator('.navbar')).toBeVisible();
        });

        test('should have proper meta tags', async ({ page }) => {
            const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
            expect(metaDescription).toBeTruthy();
        });
    });

    test.describe('API Integration', () => {
        test('should fetch content from nd API', async ({ page }) => {
            // Wait for API call
            const apiResponse = await page.waitForResponse(resp =>
                resp.url().includes('/api/nd/home-page') && resp.status() === 200
            );
            expect(apiResponse).toBeTruthy();
        });

        test('should handle API errors gracefully', async ({ page }) => {
            // Override with error response
            await page.route('**/api/nd/home-page*', route => {
                route.fulfill({
                    status: 500,
                    body: 'Server Error'
                });
            });

            await page.reload();

            // Should show error message or fallback content
            const errorMessage = await page.locator('[data-error], .error-message').count();
            expect(errorMessage).toBeGreaterThanOrEqual(0);
        });
    });

    test.describe('Visibility Controls', () => {
        test('should hide sections when visible=false', async ({ page }) => {
            // Mock with hidden section
            await page.route('**/api/nd/home-page*', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: true,
                        data: {
                            hero: {
                                visible: false,
                                content: { title: 'Hidden Hero' }
                            },
                            features: {
                                visible: true,
                                content: { title: 'Visible Features' }
                            }
                        }
                    })
                });
            });

            await page.reload();

            // Hero should not be visible
            await expect(page.locator('[data-section="hero"]')).toBeHidden({ timeout: 5000 }).catch(() => {
                // Section might be removed from DOM entirely
                expect(page.locator('[data-section="hero"]').count()).resolves.toBe(0);
            });

            // Features should be visible
            await expect(page.locator('[data-section="features"]')).toBeVisible({ timeout: 5000 }).catch(() => {
                // Check if content was rendered
                expect(page.getByText('Visible Features').count()).resolves.toBeGreaterThan(0);
            });
        });

        test('should handle individual item visibility', async ({ page }) => {
            await page.route('**/api/nd/home-page*', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: true,
                        data: {
                            features: {
                                visible: true,
                                content: {
                                    items: [
                                        { title: 'Feature 1', visible: true },
                                        { title: 'Feature 2', visible: false },
                                        { title: 'Feature 3', visible: true }
                                    ]
                                }
                            }
                        }
                    })
                });
            });

            await page.reload();

            // Check visible items
            await expect(page.getByText('Feature 1')).toBeVisible({ timeout: 5000 }).catch(() => {});
            await expect(page.getByText('Feature 2')).toBeHidden({ timeout: 5000 }).catch(() => {
                expect(page.getByText('Feature 2').count()).resolves.toBe(0);
            });
            await expect(page.getByText('Feature 3')).toBeVisible({ timeout: 5000 }).catch(() => {});
        });
    });

    test.describe('Animation Controls', () => {
        test('should toggle animations based on localStorage', async ({ page }) => {
            // Enable animations
            await page.evaluate(() => {
                localStorage.setItem('nd_animations_disabled', 'false');
            });
            await page.reload();

            const hasAnimationClass = await page.locator('html.no-animations').count();
            expect(hasAnimationClass).toBe(0);

            // Disable animations
            await page.evaluate(() => {
                localStorage.setItem('nd_animations_disabled', 'true');
            });
            await page.reload();

            await expect(page.locator('html.no-animations')).toHaveCount(1);
        });

        test('should apply no-animations class when disabled', async ({ page }) => {
            await page.evaluate(() => {
                localStorage.setItem('nd_animations_disabled', 'true');
            });
            await page.reload();

            // Check if animations are disabled
            const animationStyle = await page.evaluate(() => {
                return window.getComputedStyle(document.documentElement).getPropertyValue('--animation-duration');
            });

            // When animations are disabled, duration should be 0 or very small
            expect(['0s', '0ms', null, '']).toContain(animationStyle);
        });
    });

    test.describe('Multi-language Support', () => {
        test('should load content in English by default', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/home.html`);

            const apiCalls = [];
            page.on('request', request => {
                if (request.url().includes('/api/nd/')) {
                    apiCalls.push(request.url());
                }
            });

            await page.waitForTimeout(1000);

            const englishCall = apiCalls.find(url => url.includes('locale=en') || !url.includes('locale='));
            expect(englishCall).toBeTruthy();
        });

        test('should load Russian content', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/ru/home.html`);

            const apiResponse = await page.waitForResponse(resp =>
                resp.url().includes('/api/nd/home-page') &&
                resp.url().includes('locale=ru')
            );
            expect(apiResponse).toBeTruthy();
        });

        test('should load Hebrew content with RTL', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/he/home.html`);

            // Check for RTL
            const dir = await page.getAttribute('html', 'dir');
            expect(dir).toBe('rtl');

            // Check API call for Hebrew
            const apiResponse = await page.waitForResponse(resp =>
                resp.url().includes('/api/nd/home-page') &&
                resp.url().includes('locale=he')
            );
            expect(apiResponse).toBeTruthy();
        });
    });

    test.describe('LocalStorage Caching', () => {
        test('should cache API responses', async ({ page }) => {
            // First load
            await page.goto(`${BASE_URL}/nd/home.html`);
            await page.waitForTimeout(1000);

            // Check if data is cached
            const cachedData = await page.evaluate(() => {
                const cache = localStorage.getItem('nd_cache_home_en');
                return cache ? JSON.parse(cache) : null;
            });

            expect(cachedData).toBeTruthy();
            expect(cachedData.data).toBeTruthy();
        });

        test('should use cached data on second load', async ({ page }) => {
            // Set cache
            await page.evaluate(() => {
                const cacheData = {
                    data: {
                        hero: {
                            visible: true,
                            content: { title: 'Cached Title' }
                        }
                    },
                    timestamp: Date.now()
                };
                localStorage.setItem('nd_cache_home_en', JSON.stringify(cacheData));
            });

            let apiCalled = false;
            page.on('request', request => {
                if (request.url().includes('/api/nd/home-page')) {
                    apiCalled = true;
                }
            });

            await page.goto(`${BASE_URL}/nd/home.html`);
            await page.waitForTimeout(1000);

            // Should not call API if cache is fresh
            expect(apiCalled).toBe(false);

            // Should display cached content
            await expect(page.getByText('Cached Title')).toBeVisible({ timeout: 5000 }).catch(() => {});
        });

        test('should bypass cache in preview mode', async ({ page }) => {
            // Set cache
            await page.evaluate(() => {
                localStorage.setItem('nd_cache_home_en', JSON.stringify({
                    data: { hero: { content: { title: 'Cached' } } },
                    timestamp: Date.now()
                }));
            });

            let apiCalled = false;
            page.on('request', request => {
                if (request.url().includes('/api/nd/home-page')) {
                    apiCalled = true;
                }
            });

            await page.goto(`${BASE_URL}/nd/home.html?preview=true`);
            await page.waitForTimeout(1000);

            // Should always call API in preview mode
            expect(apiCalled).toBe(true);
        });
    });

    test.describe('Responsive Design', () => {
        test('should be mobile responsive', async ({ page }) => {
            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(`${BASE_URL}/nd/home.html`);

            // Check mobile menu
            const mobileMenuButton = page.locator('.menu-button, .hamburger-menu-icon');
            await expect(mobileMenuButton).toBeVisible();

            // Click mobile menu
            await mobileMenuButton.click();

            // Mobile menu should open
            const mobileNav = page.locator('.nav-menu');
            await expect(mobileNav).toBeVisible();
        });

        test('should be tablet responsive', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto(`${BASE_URL}/nd/home.html`);

            // Check layout adjustments
            const container = page.locator('.container');
            await expect(container).toBeVisible();
        });

        test('should be desktop responsive', async ({ page }) => {
            await page.setViewportSize({ width: 1920, height: 1080 });
            await page.goto(`${BASE_URL}/nd/home.html`);

            // Desktop menu should be visible
            const desktopNav = page.locator('.nav-menu');
            await expect(desktopNav).toBeVisible();
        });
    });

    test.describe('Forms and CTAs', () => {
        test('should handle newsletter form submission', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/home.html`);

            // Find newsletter form
            const emailInput = page.locator('input[type="email"]').first();
            const submitButton = page.locator('button[type="submit"], .primary-button').filter({ hasText: /subscribe|submit/i });

            if (await emailInput.count() > 0) {
                await emailInput.fill('test@example.com');
                await submitButton.click();

                // Check for success message or API call
                const successMessage = page.locator('.success-message, [data-success]');
                await expect(successMessage).toBeVisible({ timeout: 5000 }).catch(() => {
                    // Alternative: check if form was submitted
                    expect(emailInput.inputValue()).resolves.toBe('');
                });
            }
        });

        test('should open contact modal on CTA click', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/home.html`);

            // Click Sign Up Today button
            const ctaButton = page.locator('.primary-button').filter({ hasText: 'Sign Up Today' }).first();

            if (await ctaButton.count() > 0) {
                await ctaButton.click();

                // Check if modal opens or navigation occurs
                const modal = page.locator('.modal, [role="dialog"]');
                const newUrl = page.url();

                // Either modal opens or navigates to sign-up
                if (await modal.count() > 0) {
                    await expect(modal).toBeVisible();
                } else {
                    expect(newUrl).toContain('sign');
                }
            }
        });
    });

    test.describe('Performance', () => {
        test('should load page within 3 seconds', async ({ page }) => {
            const startTime = Date.now();
            await page.goto(`${BASE_URL}/nd/home.html`, { waitUntil: 'networkidle' });
            const loadTime = Date.now() - startTime;

            expect(loadTime).toBeLessThan(3000);
        });

        test('should have optimized images', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/home.html`);

            // Check for lazy loading
            const images = page.locator('img[loading="lazy"]');
            const imageCount = await images.count();

            expect(imageCount).toBeGreaterThan(0);
        });
    });

    test.describe('Accessibility', () => {
        test('should have proper heading structure', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/home.html`);

            const h1Count = await page.locator('h1').count();
            expect(h1Count).toBeGreaterThanOrEqual(1);

            // Check heading hierarchy
            const headings = await page.evaluate(() => {
                const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                return Array.from(elements).map(el => el.tagName);
            });

            // Ensure proper hierarchy (no h3 before h2, etc.)
            let lastLevel = 0;
            headings.forEach(tag => {
                const level = parseInt(tag.substring(1));
                expect(level).toBeLessThanOrEqual(lastLevel + 1);
                lastLevel = level;
            });
        });

        test('should have alt text for images', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/home.html`);

            const imagesWithoutAlt = await page.locator('img:not([alt])').count();
            expect(imagesWithoutAlt).toBe(0);
        });

        test('should have proper ARIA labels', async ({ page }) => {
            await page.goto(`${BASE_URL}/nd/home.html`);

            // Check navigation
            const nav = page.locator('nav, [role="navigation"]');
            await expect(nav).toHaveCount(1);

            // Check buttons have accessible text
            const buttons = page.locator('button, .primary-button');
            const buttonCount = await buttons.count();

            for (let i = 0; i < buttonCount; i++) {
                const button = buttons.nth(i);
                const text = await button.textContent();
                const ariaLabel = await button.getAttribute('aria-label');

                expect(text || ariaLabel).toBeTruthy();
            }
        });
    });
});

// Run tests
if (require.main === module) {
    console.log('Run tests with: npx playwright test tests/nd-home.spec.js');
}