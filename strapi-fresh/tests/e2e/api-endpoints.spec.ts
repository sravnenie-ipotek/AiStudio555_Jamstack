import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('should respond to health check', async ({ request }) => {
    const response = await request.get('http://localhost:1337/_health');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('status');
  });

  test('should serve API at /api', async ({ request }) => {
    const response = await request.get('http://localhost:1337/api');
    expect([200, 401, 403, 404]).toContain(response.status());
  });

  test('should handle page-sections endpoint', async ({ request }) => {
    const response = await request.get('http://localhost:1337/api/page-sections');
    expect([200, 401, 403]).toContain(response.status());
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('data');
    }
  });

  test('should support content-type headers', async ({ request }) => {
    const response = await request.get('http://localhost:1337/api', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  test('should handle POST requests to API', async ({ request }) => {
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
    
    expect([200, 201, 400, 401, 403]).toContain(response.status());
  });
});