"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('API Endpoints', () => {
    (0, test_1.test)('should respond to health check', async ({ request }) => {
        const response = await request.get('http://localhost:1337/_health');
        (0, test_1.expect)(response.ok()).toBeTruthy();
        const data = await response.json();
        (0, test_1.expect)(data).toHaveProperty('status');
    });
    (0, test_1.test)('should serve API at /api', async ({ request }) => {
        const response = await request.get('http://localhost:1337/api');
        (0, test_1.expect)([200, 401, 403, 404]).toContain(response.status());
    });
    (0, test_1.test)('should handle page-sections endpoint', async ({ request }) => {
        const response = await request.get('http://localhost:1337/api/page-sections');
        (0, test_1.expect)([200, 401, 403]).toContain(response.status());
        if (response.status() === 200) {
            const data = await response.json();
            (0, test_1.expect)(data).toHaveProperty('data');
        }
    });
    (0, test_1.test)('should support content-type headers', async ({ request }) => {
        const response = await request.get('http://localhost:1337/api', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const contentType = response.headers()['content-type'];
        (0, test_1.expect)(contentType).toContain('application/json');
    });
    (0, test_1.test)('should handle POST requests to API', async ({ request }) => {
        const response = await request.post('http://localhost:1337/api/page-sections', {
            data: {
                data: {
                    pageName: 'test',
                    sectionId: 'test-section',
                    sectionName: 'Test Section'
                }
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        (0, test_1.expect)([200, 201, 400, 401, 403]).toContain(response.status());
    });
});
