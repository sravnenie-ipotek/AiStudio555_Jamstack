// Playwright test for New Design API
const { test, expect } = require('@playwright/test');

const API_URL = process.env.API_URL || 'http://localhost:3001';

test.describe('New Design API Tests', () => {

    test('API should return home page content', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/nd/home-page`);
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.hero).toBeDefined();
        expect(data.data.hero.visible).toBe(true);
        expect(data.meta.locale).toBe('en');
    });

    test('API should support locale parameter', async ({ request }) => {
        // Test Russian locale
        const ruResponse = await request.get(`${API_URL}/api/nd/home-page?locale=ru`);
        const ruData = await ruResponse.json();
        expect(ruData.success).toBe(true);
        expect(ruData.meta.locale).toBe('ru');

        // Test Hebrew locale
        const heResponse = await request.get(`${API_URL}/api/nd/home-page?locale=he`);
        const heData = await heResponse.json();
        expect(heData.success).toBe(true);
        expect(heData.meta.locale).toBe('he');
    });

    test('API should support preview mode', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/nd/home-page?preview=true`);
        const data = await response.json();

        expect(data.success).toBe(true);
        // In preview mode, all sections should be included
        expect(data.data).toBeDefined();
    });

    test('Visibility update should work', async ({ request }) => {
        // Test updating visibility
        const response = await request.patch(`${API_URL}/api/nd/home-page/hero/visibility`, {
            data: { visible: false }
        });

        expect(response.ok()).toBeTruthy();

        const result = await response.json();
        expect(result.success).toBe(true);
        expect(result.message).toContain('hero');

        // Reset visibility
        await request.patch(`${API_URL}/api/nd/home-page/hero/visibility`, {
            data: { visible: true }
        });
    });

    test('Content update should work', async ({ request }) => {
        const testContent = {
            content_en: {
                title: 'Test Title',
                subtitle: 'Test Subtitle'
            }
        };

        const response = await request.put(`${API_URL}/api/nd/home-page/hero`, {
            data: testContent
        });

        expect(response.ok()).toBeTruthy();

        const result = await response.json();
        expect(result.success).toBe(true);
        expect(result.message).toContain('hero');
    });

    test('Animation settings should work', async ({ request }) => {
        const response = await request.patch(`${API_URL}/api/nd/settings/animations`, {
            data: {
                page: 'home',
                enabled: false
            }
        });

        expect(response.ok()).toBeTruthy();

        const result = await response.json();
        expect(result.success).toBe(true);
        expect(result.message).toContain('disabled');

        // Reset animations
        await request.patch(`${API_URL}/api/nd/settings/animations`, {
            data: {
                page: 'home',
                enabled: true
            }
        });
    });

    test('Menu API should return data', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/nd/menu`);
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(Array.isArray(data.data)).toBe(true);
    });

    test('Footer API should return data', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/nd/footer`);
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.copyright).toBeDefined();
    });

    test('API should handle errors gracefully', async ({ request }) => {
        // Test with invalid section key
        const response = await request.get(`${API_URL}/api/nd/invalid-page`);
        expect(response.status()).toBe(404);
    });

    test('Content structure should be valid', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/nd/home-page`);
        const data = await response.json();

        // Check hero section structure
        const hero = data.data.hero;
        expect(hero).toBeDefined();
        expect(hero.content).toBeDefined();
        expect(hero.content.title).toBeDefined();
        expect(hero.content.subtitle).toBeDefined();
        expect(hero.content.buttons).toBeDefined();
        expect(Array.isArray(hero.content.buttons)).toBe(true);

        // Check features section
        const features = data.data.features;
        expect(features).toBeDefined();
        expect(features.content).toBeDefined();

        // Check courses section
        const courses = data.data.courses;
        expect(courses).toBeDefined();
        expect(courses.content).toBeDefined();
    });

    test('Cache headers should be set correctly', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/nd/home-page`);

        // Check if appropriate cache headers are set
        const headers = response.headers();

        // API should allow caching unless in preview mode
        const cacheControl = headers['cache-control'];
        if (cacheControl) {
            expect(cacheControl).not.toContain('no-cache');
        }
    });
});

// Performance tests
test.describe('Performance Tests', () => {
    test('API response time should be under 500ms', async ({ request }) => {
        const startTime = Date.now();
        const response = await request.get(`${API_URL}/api/nd/home-page`);
        const endTime = Date.now();

        expect(response.ok()).toBeTruthy();
        expect(endTime - startTime).toBeLessThan(500);
    });

    test('Concurrent requests should be handled', async ({ request }) => {
        const requests = [
            request.get(`${API_URL}/api/nd/home-page`),
            request.get(`${API_URL}/api/nd/home-page?locale=ru`),
            request.get(`${API_URL}/api/nd/home-page?locale=he`),
            request.get(`${API_URL}/api/nd/menu`),
            request.get(`${API_URL}/api/nd/footer`)
        ];

        const responses = await Promise.all(requests);

        responses.forEach(response => {
            expect(response.ok()).toBeTruthy();
        });
    });
});

// Data validation tests
test.describe('Data Validation Tests', () => {
    test('All required fields should be present', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/nd/home-page`);
        const data = await response.json();

        // Check meta fields
        expect(data.meta).toBeDefined();
        expect(data.meta.locale).toBeDefined();
        expect(data.meta.cache_key).toBeDefined();
        expect(data.meta.timestamp).toBeDefined();

        // Check each section has required fields
        Object.keys(data.data).forEach(sectionKey => {
            const section = data.data[sectionKey];
            expect(section.visible).toBeDefined();
            expect(section.type).toBeDefined();
            expect(section.content).toBeDefined();
            expect(section.animations_enabled).toBeDefined();
        });
    });

    test('Boolean fields should have correct types', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/nd/home-page`);
        const data = await response.json();

        Object.keys(data.data).forEach(sectionKey => {
            const section = data.data[sectionKey];
            expect(typeof section.visible).toBe('boolean');
            expect(typeof section.animations_enabled).toBe('boolean');
        });
    });
});

// Run tests
console.log('Run tests with: npx playwright test tests/nd-api.spec.js');