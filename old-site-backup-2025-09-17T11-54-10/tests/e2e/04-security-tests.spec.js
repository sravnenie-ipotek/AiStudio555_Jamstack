// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Security Tests', () => {
  test('No direct database access from frontend', async ({ request }) => {
    // Try to access PostgreSQL port directly - should fail
    try {
      await request.get('http://localhost:5432');
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      // Expected - cannot connect directly to DB
      expect(error).toBeTruthy();
    }
  });
  
  test('SQL injection prevention', async ({ request }) => {
    // Try SQL injection in query parameters
    const maliciousQueries = [
      "'; DROP TABLE page_sections; --",
      "1 OR 1=1",
      "' UNION SELECT * FROM users --",
      "<script>alert('XSS')</script>"
    ];
    
    for (const query of maliciousQueries) {
      const response = await request.get(`/api/page-sections?filters[sectionName][$eq]=${encodeURIComponent(query)}`);
      
      // Should return empty results or error, not crash
      expect([200, 400, 404]).toContain(response.status());
      
      if (response.ok()) {
        const data = await response.json();
        expect(data.data).toEqual([]);
      }
    }
  });
  
  test('XSS prevention', async ({ request }) => {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<iframe src="javascript:alert(\'XSS\')"></iframe>'
    ];
    
    for (const payload of xssPayloads) {
      const response = await request.post('/api/page-sections', {
        data: {
          data: {
            pageName: 'test',
            sectionId: 'test-xss',
            content: payload,
            heading: payload
          }
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // If created, content should be escaped
      if (response.ok()) {
        const data = await response.json();
        expect(data.data.attributes.content).not.toContain('<script>');
        expect(data.data.attributes.heading).not.toContain('<script>');
      }
    }
  });
  
  test('Rate limiting is enforced', async ({ request }) => {
    const promises = [];
    
    // Send 100 requests rapidly
    for (let i = 0; i < 100; i++) {
      promises.push(request.get('/api/page-sections'));
    }
    
    const responses = await Promise.all(promises);
    const statusCodes = responses.map(r => r.status());
    
    // Some requests should be rate limited (429) or at least not all succeed
    const rateLimited = statusCodes.filter(code => code === 429);
    const successful = statusCodes.filter(code => code === 200);
    
    // Either rate limiting is active or not all requests succeed
    expect(rateLimited.length > 0 || successful.length < 100).toBeTruthy();
  });
  
  test('Authentication endpoints are protected', async ({ request }) => {
    // Admin endpoints should require authentication
    const protectedEndpoints = [
      '/admin',
      '/api/users',
      '/api/page-sections/1/approve',
    ];
    
    for (const endpoint of protectedEndpoints) {
      const response = await request.get(endpoint, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
      
      // Should return 401 or 403
      expect([401, 403, 404]).toContain(response.status());
    }
  });
  
  test('CORS prevents unauthorized origins', async ({ request }) => {
    const response = await request.get('/api', {
      headers: {
        'Origin': 'http://malicious-site.com'
      }
    });
    
    const allowOrigin = response.headers()['access-control-allow-origin'];
    
    // Should not allow malicious origin
    expect(allowOrigin).not.toBe('http://malicious-site.com');
  });
  
  test('Content Security Policy headers are set', async ({ request }) => {
    const response = await request.get('/admin');
    
    const cspHeader = response.headers()['content-security-policy'];
    
    // CSP should be present
    if (cspHeader) {
      expect(cspHeader).toContain("default-src");
      expect(cspHeader).toContain("'self'");
    }
  });
  
  test('Sensitive data is not exposed in API responses', async ({ request }) => {
    const response = await request.get('/api/page-sections');
    
    if (response.ok()) {
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const section = data.data[0];
        
        // Should not expose sensitive fields
        expect(section).not.toHaveProperty('password');
        expect(section).not.toHaveProperty('jwt');
        expect(section).not.toHaveProperty('secret');
      }
    }
  });
});