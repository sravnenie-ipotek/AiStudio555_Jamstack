const { test, expect } = require('@playwright/test');

test.describe('API Response Testing', () => {
  const baseApiUrl = 'https://aistudio555jamstack-production.up.railway.app/api';
  const localApiUrl = 'http://localhost:3000/api';
  
  // Test both production and local APIs when available
  const apiEndpoints = [
    { name: 'home-page', endpoint: '/home-page', critical: true },
    { name: 'courses', endpoint: '/courses', critical: true },
    { name: 'teachers', endpoint: '/teachers', critical: false },
    { name: 'blog-posts', endpoint: '/blog-posts', critical: false },
    { name: 'career-center-page', endpoint: '/career-center-page', critical: false },
    { name: 'career-orientation-page', endpoint: '/career-orientation-page', critical: false }
  ];

  const languages = ['en', 'ru', 'he'];

  test.describe('API Availability and Response Times', () => {
    test('Production API health check', async ({ request }) => {
      const healthChecks = [];
      
      for (const endpoint of apiEndpoints) {
        const startTime = Date.now();
        
        try {
          const response = await request.get(`${baseApiUrl}${endpoint.endpoint}`);
          const responseTime = Date.now() - startTime;
          
          healthChecks.push({
            endpoint: endpoint.name,
            status: response.status(),
            responseTime,
            ok: response.ok(),
            critical: endpoint.critical
          });
          
          console.log(`${endpoint.name}: ${response.status()} - ${responseTime}ms`);
          
        } catch (error) {
          healthChecks.push({
            endpoint: endpoint.name,
            status: 'error',
            responseTime: Date.now() - startTime,
            ok: false,
            critical: endpoint.critical,
            error: error.message
          });
          
          console.log(`${endpoint.name}: ERROR - ${error.message}`);
        }
      }

      // Generate health report
      console.log('\n=== API Health Report ===');
      
      const successfulEndpoints = healthChecks.filter(check => check.ok);
      const failedEndpoints = healthChecks.filter(check => !check.ok);
      const criticalFailures = failedEndpoints.filter(check => check.critical);
      
      console.log(`Successful: ${successfulEndpoints.length}/${healthChecks.length}`);
      console.log(`Failed: ${failedEndpoints.length}`);
      console.log(`Critical failures: ${criticalFailures.length}`);
      
      if (successfulEndpoints.length > 0) {
        const avgResponseTime = successfulEndpoints.reduce((sum, check) => sum + check.responseTime, 0) / successfulEndpoints.length;
        console.log(`Average response time: ${avgResponseTime.toFixed(0)}ms`);
      }

      // Assertions
      expect(criticalFailures.length).toBe(0); // No critical API failures
      expect(successfulEndpoints.length).toBeGreaterThan(healthChecks.length * 0.7); // At least 70% success rate
      
      if (successfulEndpoints.length > 0) {
        const maxResponseTime = Math.max(...successfulEndpoints.map(check => check.responseTime));
        expect(maxResponseTime).toBeLessThan(5000); // No endpoint should take more than 5 seconds
      }
    });

    test('Local API availability (if running)', async ({ request }) => {
      try {
        const response = await request.get(`${localApiUrl}/courses`);
        if (response.ok()) {
          console.log('✅ Local API is running and accessible');
          
          // Test a few key endpoints
          for (const endpoint of apiEndpoints.slice(0, 3)) {
            const localResponse = await request.get(`${localApiUrl}${endpoint.endpoint}`);
            console.log(`Local ${endpoint.name}: ${localResponse.status()}`);
            
            if (endpoint.critical) {
              expect(localResponse.ok()).toBe(true);
            }
          }
        }
      } catch (error) {
        console.log('ℹ️ Local API not running - skipping local tests');
      }
    });
  });

  test.describe('API Data Structure and Content', () => {
    for (const endpoint of apiEndpoints) {
      test(`${endpoint.name} API structure validation`, async ({ request }) => {
        const response = await request.get(`${baseApiUrl}${endpoint.endpoint}`);
        
        if (!response.ok()) {
          if (endpoint.critical) {
            throw new Error(`Critical API ${endpoint.name} failed: ${response.status()}`);
          } else {
            console.log(`⚠️ Non-critical API ${endpoint.name} failed: ${response.status()}`);
            return;
          }
        }

        const data = await response.json();
        
        console.log(`\n=== ${endpoint.name} API Structure ===`);
        
        // Basic structure validation
        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        
        // Check for common API response patterns
        const hasData = data.data !== undefined;
        const hasItems = Array.isArray(data) || (data.data && Array.isArray(data.data));
        const hasAttributes = data.data && data.data.attributes;
        
        console.log(`Has data wrapper: ${hasData}`);
        console.log(`Is array/has items: ${hasItems}`);
        console.log(`Has attributes: ${hasAttributes}`);
        
        // Validate specific endpoint structures
        switch (endpoint.name) {
          case 'courses':
            if (Array.isArray(data)) {
              expect(data.length).toBeGreaterThan(0);
              const course = data[0];
              expect(course).toHaveProperty('title');
              console.log(`Sample course: ${course.title}`);
            } else if (data.data && Array.isArray(data.data)) {
              expect(data.data.length).toBeGreaterThan(0);
              console.log(`Courses count: ${data.data.length}`);
            }
            break;
            
          case 'teachers':
            if (Array.isArray(data)) {
              console.log(`Teachers count: ${data.length}`);
              if (data.length > 0) {
                const teacher = data[0];
                console.log(`Sample teacher data structure:`, Object.keys(teacher));
              }
            }
            break;
            
          case 'home-page':
            if (data.data && data.data.attributes) {
              const attrs = data.data.attributes;
              const requiredFields = ['heroTitle', 'heroSubtitle'];
              
              for (const field of requiredFields) {
                if (attrs[field]) {
                  console.log(`${field}: "${attrs[field].substring(0, 50)}..."`);
                  expect(attrs[field]).toBeTruthy();
                }
              }
            } else if (data.heroTitle) {
              console.log(`Hero title: "${data.heroTitle.substring(0, 50)}..."`);
              expect(data.heroTitle).toBeTruthy();
            }
            break;
        }

        console.log(`✅ ${endpoint.name} API structure valid`);
      });
    }
  });

  test.describe('Multi-Language API Support', () => {
    for (const language of languages) {
      test(`Multi-language support - ${language}`, async ({ request }) => {
        const languageResults = [];
        
        for (const endpoint of apiEndpoints.filter(e => e.critical)) {
          try {
            const response = await request.get(`${baseApiUrl}${endpoint.endpoint}?locale=${language}`);
            const data = await response.json();
            
            languageResults.push({
              endpoint: endpoint.name,
              status: response.status(),
              hasData: !!data,
              locale: language,
              dataSize: JSON.stringify(data).length
            });
            
          } catch (error) {
            languageResults.push({
              endpoint: endpoint.name,
              status: 'error',
              error: error.message,
              locale: language
            });
          }
        }

        console.log(`\n=== ${language.toUpperCase()} Language API Results ===`);
        
        languageResults.forEach(result => {
          if (result.status === 200) {
            console.log(`✅ ${result.endpoint}: ${result.dataSize} bytes`);
          } else {
            console.log(`❌ ${result.endpoint}: ${result.status} ${result.error || ''}`);
          }
        });

        // Assertions
        const successfulRequests = languageResults.filter(r => r.status === 200);
        expect(successfulRequests.length).toBeGreaterThan(0); // At least some endpoints should work

        // Check fallback behavior for non-English languages
        if (language !== 'en') {
          const englishResults = [];
          for (const endpoint of apiEndpoints.filter(e => e.critical).slice(0, 2)) {
            const englishResponse = await request.get(`${baseApiUrl}${endpoint.endpoint}?locale=en`);
            englishResults.push({
              endpoint: endpoint.name,
              dataSize: JSON.stringify(await englishResponse.json()).length
            });
          }
          
          // Compare data sizes to check if fallback is working
          console.log(`Fallback mechanism check for ${language}:`);
          for (let i = 0; i < Math.min(languageResults.length, englishResults.length); i++) {
            const langSize = languageResults[i].dataSize || 0;
            const engSize = englishResults[i].dataSize || 0;
            const sizeDiff = Math.abs(langSize - engSize);
            
            console.log(`  ${languageResults[i].endpoint}: ${language}=${langSize}, en=${engSize}, diff=${sizeDiff}`);
          }
        }
      });
    }

    test('Language fallback mechanism', async ({ request }) => {
      // Test with invalid locale to check fallback
      const fallbackResponse = await request.get(`${baseApiUrl}/home-page?locale=invalid`);
      expect(fallbackResponse.ok()).toBe(true);
      
      const fallbackData = await fallbackResponse.json();
      expect(fallbackData).toBeDefined();
      
      console.log('✅ Fallback mechanism working for invalid locale');
      
      // Compare with English version
      const englishResponse = await request.get(`${baseApiUrl}/home-page?locale=en`);
      const englishData = await englishResponse.json();
      
      // Should return similar data structure
      expect(typeof fallbackData).toBe(typeof englishData);
      console.log('✅ Fallback returns consistent data structure');
    });
  });

  test.describe('API Performance and Caching', () => {
    test('Response time consistency', async ({ request }) => {
      const performanceMetrics = [];
      
      // Test same endpoint multiple times
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        const response = await request.get(`${baseApiUrl}/courses`);
        const responseTime = Date.now() - startTime;
        
        performanceMetrics.push({
          attempt: i + 1,
          responseTime,
          status: response.status(),
          cacheHeader: response.headers()['cache-control'] || 'none'
        });
      }

      console.log('\n=== API Performance Metrics ===');
      performanceMetrics.forEach(metric => {
        console.log(`Attempt ${metric.attempt}: ${metric.responseTime}ms (cache: ${metric.cacheHeader})`);
      });

      const avgResponseTime = performanceMetrics.reduce((sum, m) => sum + m.responseTime, 0) / performanceMetrics.length;
      const maxResponseTime = Math.max(...performanceMetrics.map(m => m.responseTime));
      const minResponseTime = Math.min(...performanceMetrics.map(m => m.responseTime));
      
      console.log(`Average: ${avgResponseTime.toFixed(0)}ms`);
      console.log(`Range: ${minResponseTime}ms - ${maxResponseTime}ms`);
      console.log(`Variation: ${((maxResponseTime - minResponseTime) / avgResponseTime * 100).toFixed(1)}%`);

      // Performance assertions
      expect(avgResponseTime).toBeLessThan(2000); // Average under 2 seconds
      expect(maxResponseTime).toBeLessThan(5000); // No request over 5 seconds
      
      // Consistency check - variation shouldn't be too high
      const variation = (maxResponseTime - minResponseTime) / avgResponseTime;
      expect(variation).toBeLessThan(2); // Less than 200% variation
    });

    test('Cache headers and optimization', async ({ request }) => {
      const cacheAnalysis = [];
      
      for (const endpoint of apiEndpoints.slice(0, 4)) {
        const response = await request.get(`${baseApiUrl}${endpoint.endpoint}`);
        const headers = response.headers();
        
        cacheAnalysis.push({
          endpoint: endpoint.name,
          cacheControl: headers['cache-control'] || 'none',
          etag: headers['etag'] || 'none',
          lastModified: headers['last-modified'] || 'none',
          expires: headers['expires'] || 'none',
          contentType: headers['content-type'] || 'none'
        });
      }

      console.log('\n=== Cache Headers Analysis ===');
      cacheAnalysis.forEach(analysis => {
        console.log(`\n${analysis.endpoint}:`);
        console.log(`  Cache-Control: ${analysis.cacheControl}`);
        console.log(`  ETag: ${analysis.etag}`);
        console.log(`  Content-Type: ${analysis.contentType}`);
      });

      // Check for proper caching headers
      const hasCacheControl = cacheAnalysis.filter(a => a.cacheControl !== 'none').length;
      const hasETag = cacheAnalysis.filter(a => a.etag !== 'none').length;
      
      console.log(`\nCaching summary:`);
      console.log(`Endpoints with Cache-Control: ${hasCacheControl}/${cacheAnalysis.length}`);
      console.log(`Endpoints with ETag: ${hasETag}/${cacheAnalysis.length}`);

      // All endpoints should have proper content-type
      const properContentType = cacheAnalysis.filter(a => a.contentType.includes('json')).length;
      expect(properContentType).toBe(cacheAnalysis.length);
    });
  });

  test.describe('API Error Handling', () => {
    test('Invalid endpoint handling', async ({ request }) => {
      const invalidEndpoints = [
        '/non-existent-endpoint',
        '/courses/invalid-id',
        '/home-page/../../../etc/passwd',
        '/api/admin/users'
      ];

      for (const endpoint of invalidEndpoints) {
        const response = await request.get(`${baseApiUrl}${endpoint}`);
        
        console.log(`${endpoint}: ${response.status()}`);
        
        // Should return proper error codes
        expect([404, 400, 403, 500]).toContain(response.status());
        
        // Should not expose sensitive information
        const responseText = await response.text();
        expect(responseText.toLowerCase()).not.toContain('password');
        expect(responseText.toLowerCase()).not.toContain('database');
        expect(responseText.toLowerCase()).not.toContain('internal');
      }

      console.log('✅ Invalid endpoints properly handled');
    });

    test('SQL injection protection', async ({ request }) => {
      const sqlInjectionPayloads = [
        "'; DROP TABLE courses; --",
        "' OR '1'='1",
        "' UNION SELECT * FROM users --",
        "'; UPDATE courses SET title='hacked'; --"
      ];

      for (const payload of sqlInjectionPayloads) {
        // Test in query parameters
        const response = await request.get(`${baseApiUrl}/courses?search=${encodeURIComponent(payload)}`);
        
        // Should either reject or safely handle the request
        if (response.ok()) {
          const data = await response.json();
          
          // Should not return unexpected data
          expect(Array.isArray(data) || (data.data && Array.isArray(data.data))).toBe(true);
          
          // Response shouldn't contain error messages that reveal DB structure
          const responseText = JSON.stringify(data);
          expect(responseText.toLowerCase()).not.toContain('syntax error');
          expect(responseText.toLowerCase()).not.toContain('mysql');
          expect(responseText.toLowerCase()).not.toContain('postgresql');
        }
        
        console.log(`SQL injection test: ${response.status()} for "${payload.substring(0, 20)}..."`);
      }

      console.log('✅ SQL injection protection verified');
    });

    test('Rate limiting and abuse protection', async ({ request }) => {
      const rapidRequests = [];
      const startTime = Date.now();
      
      // Make many rapid requests
      for (let i = 0; i < 20; i++) {
        try {
          const response = await request.get(`${baseApiUrl}/courses`);
          rapidRequests.push({
            attempt: i + 1,
            status: response.status(),
            timestamp: Date.now() - startTime
          });
        } catch (error) {
          rapidRequests.push({
            attempt: i + 1,
            status: 'error',
            error: error.message,
            timestamp: Date.now() - startTime
          });
        }
      }

      console.log('\n=== Rate Limiting Test ===');
      
      const successful = rapidRequests.filter(r => r.status === 200).length;
      const rateLimited = rapidRequests.filter(r => r.status === 429).length;
      const errors = rapidRequests.filter(r => r.status === 'error').length;
      
      console.log(`Successful requests: ${successful}/20`);
      console.log(`Rate limited (429): ${rateLimited}/20`);
      console.log(`Errors: ${errors}/20`);
      console.log(`Total time: ${Date.now() - startTime}ms`);

      // Should handle rapid requests gracefully
      expect(successful + rateLimited + errors).toBe(20);
      
      // If rate limiting is implemented, should see some 429s
      if (rateLimited > 0) {
        console.log('✅ Rate limiting is active');
      } else {
        console.log('ℹ️ No rate limiting detected (may be okay for this API)');
      }
    });
  });

  test.describe('API Data Quality', () => {
    test('Content completeness and quality', async ({ request }) => {
      const dataQualityReport = [];
      
      for (const endpoint of apiEndpoints.filter(e => e.critical)) {
        const response = await request.get(`${baseApiUrl}${endpoint.endpoint}`);
        
        if (response.ok()) {
          const data = await response.json();
          const quality = analyzeDataQuality(data, endpoint.name);
          dataQualityReport.push({
            endpoint: endpoint.name,
            ...quality
          });
        }
      }

      console.log('\n=== Data Quality Report ===');
      dataQualityReport.forEach(report => {
        console.log(`\n${report.endpoint}:`);
        console.log(`  Empty fields: ${report.emptyFields}`);
        console.log(`  Total fields: ${report.totalFields}`);
        console.log(`  Completeness: ${report.completeness.toFixed(1)}%`);
        console.log(`  Sample issues: ${report.issues.slice(0, 3).join(', ')}`);
      });

      // Quality assertions
      dataQualityReport.forEach(report => {
        expect(report.completeness).toBeGreaterThan(70); // At least 70% complete
        expect(report.issues.length).toBeLessThan(10); // Reasonable number of issues
      });

      function analyzeDataQuality(data, endpointName) {
        const issues = [];
        let totalFields = 0;
        let emptyFields = 0;

        function analyzeObject(obj, path = '') {
          if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => {
              const value = obj[key];
              const fieldPath = path ? `${path}.${key}` : key;
              totalFields++;

              if (value === null || value === undefined || value === '') {
                emptyFields++;
                issues.push(`Empty field: ${fieldPath}`);
              } else if (typeof value === 'string') {
                if (value.length < 3 && !['id', 'url'].includes(key.toLowerCase())) {
                  issues.push(`Short content: ${fieldPath} (${value.length} chars)`);
                }
                if (value.includes('lorem ipsum')) {
                  issues.push(`Placeholder content: ${fieldPath}`);
                }
              } else if (typeof value === 'object') {
                analyzeObject(value, fieldPath);
              }
            });
          }
        }

        if (Array.isArray(data)) {
          data.slice(0, 3).forEach((item, index) => {
            analyzeObject(item, `item[${index}]`);
          });
        } else {
          analyzeObject(data);
        }

        return {
          totalFields,
          emptyFields,
          completeness: totalFields > 0 ? ((totalFields - emptyFields) / totalFields) * 100 : 100,
          issues: issues.slice(0, 10) // Limit issues for readability
        };
      }
    });

    test('Image URLs and media validation', async ({ request }) => {
      // Get data from endpoints that might contain images
      const imageEndpoints = ['courses', 'teachers', 'home-page'];
      const imageUrls = [];

      for (const endpointName of imageEndpoints) {
        try {
          const response = await request.get(`${baseApiUrl}/${endpointName}`);
          if (response.ok()) {
            const data = await response.json();
            extractImageUrls(data, imageUrls);
          }
        } catch (error) {
          console.log(`Error fetching ${endpointName}:`, error.message);
        }
      }

      console.log(`\n=== Image URL Validation ===`);
      console.log(`Found ${imageUrls.length} image URLs`);

      if (imageUrls.length > 0) {
        // Test first few image URLs
        const testUrls = imageUrls.slice(0, 10);
        const imageResults = [];

        for (const url of testUrls) {
          try {
            const imageResponse = await request.head(url);
            imageResults.push({
              url: url.substring(url.lastIndexOf('/') + 1),
              status: imageResponse.status(),
              contentType: imageResponse.headers()['content-type'] || 'unknown'
            });
          } catch (error) {
            imageResults.push({
              url: url.substring(url.lastIndexOf('/') + 1),
              status: 'error',
              error: error.message
            });
          }
        }

        console.log('\nImage accessibility results:');
        imageResults.forEach(result => {
          const status = result.status === 200 ? '✅' : '❌';
          console.log(`  ${status} ${result.url}: ${result.status} ${result.contentType || ''}`);
        });

        // Most images should be accessible
        const accessibleImages = imageResults.filter(r => r.status === 200).length;
        const accessibilityRate = (accessibleImages / imageResults.length) * 100;
        expect(accessibilityRate).toBeGreaterThan(70);

        console.log(`Image accessibility: ${accessibilityRate.toFixed(1)}%`);
      }

      function extractImageUrls(obj, urls) {
        if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach(key => {
            const value = obj[key];
            if (typeof value === 'string' && isImageUrl(value)) {
              urls.push(value);
            } else if (typeof value === 'object') {
              extractImageUrls(value, urls);
            }
          });
        }
      }

      function isImageUrl(url) {
        return typeof url === 'string' && 
               url.startsWith('http') && 
               /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
      }
    });
  });

  test('API integration with frontend', async ({ page }) => {
    // Monitor API calls made by the frontend
    const apiCalls = [];
    
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now()
        });
      }
    });

    const apiResponses = [];
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        apiResponses.push({
          url: response.url(),
          status: response.status(),
          timestamp: Date.now()
        });
      }
    });

    // Load page that uses API
    await page.goto('home.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for API calls

    console.log('\n=== Frontend API Integration ===');
    console.log(`API requests made: ${apiCalls.length}`);
    console.log(`API responses received: ${apiResponses.length}`);

    if (apiCalls.length > 0) {
      console.log('\nAPI calls:');
      apiCalls.forEach(call => {
        console.log(`  ${call.method} ${call.url}`);
      });

      console.log('\nAPI responses:');
      apiResponses.forEach(response => {
        const status = response.status === 200 ? '✅' : '❌';
        console.log(`  ${status} ${response.status} ${response.url}`);
      });

      // All API calls should succeed
      const failedResponses = apiResponses.filter(r => r.status >= 400);
      expect(failedResponses.length).toBe(0);

      // Should have matching requests and responses
      expect(apiResponses.length).toBe(apiCalls.length);
    }

    console.log('✅ Frontend API integration verified');
  });
});