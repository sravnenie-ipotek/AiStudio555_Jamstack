// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Performance Tests', () => {
  test('API response time is acceptable', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/api/page-sections?pagination[limit]=10');
    const duration = Date.now() - start;
    
    expect(response.ok()).toBeTruthy();
    // Response should be under 2 seconds
    expect(duration).toBeLessThan(2000);
    
    // Ideally under 500ms for basic queries
    if (duration < 500) {
      console.log('✅ Excellent performance:', duration, 'ms');
    } else if (duration < 1000) {
      console.log('⚠️ Acceptable performance:', duration, 'ms');
    } else {
      console.log('❌ Slow performance:', duration, 'ms');
    }
  });
  
  test('Pagination works correctly', async ({ request }) => {
    // Test different page sizes
    const pageSizes = [1, 10, 25, 50];
    
    for (const size of pageSizes) {
      const response = await request.get(`/api/page-sections?pagination[limit]=${size}`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.data.length).toBeLessThanOrEqual(size);
      expect(data.meta.pagination).toHaveProperty('pageSize');
      expect(data.meta.pagination.pageSize).toBe(size);
    }
  });
  
  test('Large content handling', async ({ request }) => {
    // Create large content
    const largeText = 'Lorem ipsum '.repeat(1000); // ~12KB of text
    
    const response = await request.post('/api/page-sections', {
      data: {
        data: {
          pageName: 'test',
          sectionId: 'large-content-test',
          content: largeText,
          sectionName: 'Large Content Test'
        }
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Should handle large content without timing out
    expect([200, 201, 401, 403]).toContain(response.status());
  });
  
  test('Concurrent request handling', async ({ request }) => {
    const concurrentRequests = 10;
    const promises = [];
    
    // Send concurrent requests
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(request.get(`/api/page-sections?filters[pageName][$eq]=home&pagination[page]=${i + 1}`));
    }
    
    const start = Date.now();
    const responses = await Promise.all(promises);
    const duration = Date.now() - start;
    
    // All should complete
    expect(responses.every(r => r.ok() || r.status() === 404)).toBeTruthy();
    
    // Should handle concurrent requests efficiently
    expect(duration).toBeLessThan(5000);
  });
  
  test('Translation performance', async ({ request }) => {
    const start = Date.now();
    
    const response = await request.post('http://localhost:5000/translate', {
      data: {
        q: 'This is a test sentence for translation performance testing.',
        source: 'en',
        target: 'ru',
        format: 'text'
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const duration = Date.now() - start;
    
    expect(response.ok()).toBeTruthy();
    // Translation should be under 3 seconds
    expect(duration).toBeLessThan(3000);
  });
  
  test('Database connection pooling', async ({ request }) => {
    const requests = [];
    
    // Simulate multiple users accessing data simultaneously
    for (let i = 0; i < 20; i++) {
      requests.push(request.get('/api/page-sections?pagination[limit]=1'));
    }
    
    const start = Date.now();
    const responses = await Promise.all(requests);
    const duration = Date.now() - start;
    
    // All requests should succeed
    expect(responses.every(r => r.ok())).toBeTruthy();
    
    // Should complete within reasonable time (connection pooling working)
    expect(duration).toBeLessThan(10000);
  });
  
  test('Static asset caching headers', async ({ request }) => {
    const response = await request.get('/uploads/.gitkeep');
    
    // Check for caching headers
    const cacheControl = response.headers()['cache-control'];
    const etag = response.headers()['etag'];
    
    if (response.ok()) {
      // Should have caching headers
      expect(cacheControl || etag).toBeTruthy();
    }
  });
  
  test('Memory usage remains stable', async ({ request }) => {
    // Note: This is a basic test - real memory testing requires monitoring tools
    const iterations = 50;
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      await request.get('/api/page-sections');
      times.push(Date.now() - start);
    }
    
    // Calculate average response time
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const lastTenAvg = times.slice(-10).reduce((a, b) => a + b, 0) / 10;
    
    // Response time shouldn't degrade significantly (memory leak indicator)
    expect(lastTenAvg).toBeLessThan(avgTime * 2);
  });
});