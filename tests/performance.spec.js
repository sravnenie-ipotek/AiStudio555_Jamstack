const { test, expect } = require('@playwright/test');

test.describe('Performance Testing', () => {
  const testPages = [
    { name: 'Home', url: 'home.html', critical: true },
    { name: 'Courses', url: 'courses.html', critical: true },
    { name: 'Teachers', url: 'teachers.html', critical: false },
    { name: 'Career Center', url: 'career-center.html', critical: false },
    { name: 'English Home', url: 'dist/en/index.html', critical: true },
    { name: 'Russian Home', url: 'dist/ru/index.html', critical: false },
    { name: 'Hebrew Home', url: 'dist/he/index.html', critical: false }
  ];

  const devices = [
    { name: 'Desktop', width: 1920, height: 1080, type: 'desktop' },
    { name: 'Tablet', width: 768, height: 1024, type: 'tablet' },
    { name: 'Mobile', width: 375, height: 667, type: 'mobile' }
  ];

  test.describe('Core Web Vitals', () => {
    for (const page of testPages) {
      test(`Core Web Vitals - ${page.name}`, async ({ page: playwright }) => {
        // Enable performance metrics
        await playwright.context().addInitScript(() => {
          window.performanceMetrics = {
            navigationStart: Date.now(),
            marks: [],
            measures: []
          };
        });

        const startTime = Date.now();
        
        // Navigate with performance tracking
        await playwright.goto(page.url);
        
        // Wait for key events
        await playwright.waitForLoadState('domcontentloaded');
        const domContentLoadedTime = Date.now();
        
        await playwright.waitForLoadState('networkidle');
        const networkIdleTime = Date.now();

        // Get Web Vitals and other performance metrics
        const metrics = await playwright.evaluate(() => {
          return new Promise((resolve) => {
            // Wait a bit for paint metrics to be available
            setTimeout(() => {
              const navigation = performance.getEntriesByType('navigation')[0];
              const paint = performance.getEntriesByType('paint');
              
              const result = {
                // Navigation timing
                navigation: {
                  domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                  loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                  domInteractive: navigation.domInteractive - navigation.navigationStart,
                  domComplete: navigation.domComplete - navigation.navigationStart
                },
                
                // Paint timing
                paint: {
                  firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
                  firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
                },
                
                // Resource timing summary
                resources: {
                  total: performance.getEntriesByType('resource').length,
                  images: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'img').length,
                  scripts: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'script').length,
                  stylesheets: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'link').length,
                  fonts: performance.getEntriesByType('resource').filter(r => r.name.match(/\.(woff2?|ttf|otf)$/)).length
                },

                // Memory usage (if available)
                memory: performance.memory ? {
                  usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
                  totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
                  jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) // MB
                } : null
              };

              // Try to get Layout Shift Score (approximate)
              if ('PerformanceObserver' in window) {
                try {
                  let clsScore = 0;
                  new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                      }
                    }
                  }).observe({ type: 'layout-shift', buffered: true });
                  result.layoutShift = clsScore;
                } catch (e) {
                  result.layoutShift = 'unavailable';
                }
              }

              resolve(result);
            }, 1000);
          });
        });

        // Calculate additional timing metrics
        const timingMetrics = {
          timeToNavigation: domContentLoadedTime - startTime,
          timeToNetworkIdle: networkIdleTime - startTime,
          totalLoadTime: Date.now() - startTime
        };

        // Generate comprehensive performance report
        console.log(`\n=== Performance Report: ${page.name} ===`);
        
        console.log('\nCore Web Vitals:');
        console.log(`  First Paint: ${metrics.paint.firstPaint.toFixed(0)}ms`);
        console.log(`  First Contentful Paint: ${metrics.paint.firstContentfulPaint.toFixed(0)}ms`);
        console.log(`  DOM Interactive: ${metrics.navigation.domInteractive.toFixed(0)}ms`);
        console.log(`  Layout Shift Score: ${typeof metrics.layoutShift === 'number' ? metrics.layoutShift.toFixed(3) : metrics.layoutShift}`);

        console.log('\nLoad Timing:');
        console.log(`  DOM Content Loaded: ${timingMetrics.timeToNavigation}ms`);
        console.log(`  Network Idle: ${timingMetrics.timeToNetworkIdle}ms`);
        console.log(`  Total Load Time: ${timingMetrics.totalLoadTime}ms`);

        console.log('\nResource Summary:');
        console.log(`  Total Resources: ${metrics.resources.total}`);
        console.log(`  Images: ${metrics.resources.images}`);
        console.log(`  Scripts: ${metrics.resources.scripts}`);
        console.log(`  Stylesheets: ${metrics.resources.stylesheets}`);
        console.log(`  Fonts: ${metrics.resources.fonts}`);

        if (metrics.memory) {
          console.log('\nMemory Usage:');
          console.log(`  Used JS Heap: ${metrics.memory.usedJSHeapSize}MB`);
          console.log(`  Total JS Heap: ${metrics.memory.totalJSHeapSize}MB`);
          console.log(`  Heap Size Limit: ${metrics.memory.jsHeapSizeLimit}MB`);
        }

        // Performance assertions based on page criticality
        const thresholds = page.critical ? {
          firstContentfulPaint: 2500, // 2.5s for critical pages
          domInteractive: 3000,
          totalLoadTime: 5000,
          layoutShift: 0.1
        } : {
          firstContentfulPaint: 4000, // 4s for non-critical pages
          domInteractive: 5000,
          totalLoadTime: 8000,
          layoutShift: 0.25
        };

        // Core Web Vitals assertions
        expect(metrics.paint.firstContentfulPaint).toBeLessThan(thresholds.firstContentfulPaint);
        expect(metrics.navigation.domInteractive).toBeLessThan(thresholds.domInteractive);
        expect(timingMetrics.totalLoadTime).toBeLessThan(thresholds.totalLoadTime);
        
        if (typeof metrics.layoutShift === 'number') {
          expect(metrics.layoutShift).toBeLessThan(thresholds.layoutShift);
        }

        // Resource efficiency assertions
        expect(metrics.resources.total).toBeLessThan(50); // Reasonable resource count
        
        if (metrics.memory) {
          expect(metrics.memory.usedJSHeapSize).toBeLessThan(50); // Less than 50MB JS heap
        }

        console.log(`✅ ${page.name} performance tests passed`);
      });
    }
  });

  test.describe('Network Performance', () => {
    test('Resource loading optimization', async ({ page }) => {
      const resourceMetrics = [];
      
      // Track all network requests
      page.on('request', request => {
        resourceMetrics.push({
          url: request.url(),
          method: request.method(),
          resourceType: request.resourceType(),
          timestamp: Date.now()
        });
      });

      const responseMetrics = [];
      page.on('response', response => {
        responseMetrics.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
          timestamp: Date.now()
        });
      });

      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Analyze resource loading
      const resourceAnalysis = {
        byType: {},
        slowResources: [],
        largeResources: [],
        failedResources: []
      };

      // Categorize resources by type
      resourceMetrics.forEach(resource => {
        const type = resource.resourceType;
        if (!resourceAnalysis.byType[type]) {
          resourceAnalysis.byType[type] = 0;
        }
        resourceAnalysis.byType[type]++;
      });

      // Find failed resources
      responseMetrics.forEach(response => {
        if (response.status >= 400) {
          resourceAnalysis.failedResources.push({
            url: response.url,
            status: response.status,
            statusText: response.statusText
          });
        }

        // Check for missing compression
        const contentLength = response.headers['content-length'];
        const contentEncoding = response.headers['content-encoding'];
        
        if (contentLength && parseInt(contentLength) > 1024 && !contentEncoding) {
          resourceAnalysis.largeResources.push({
            url: response.url,
            size: Math.round(parseInt(contentLength) / 1024) + 'KB',
            compressed: !!contentEncoding
          });
        }
      });

      console.log('\n=== Network Performance Analysis ===');
      
      console.log('\nResources by type:');
      Object.entries(resourceAnalysis.byType).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });

      console.log(`\nTotal requests: ${resourceMetrics.length}`);
      console.log(`Failed requests: ${resourceAnalysis.failedResources.length}`);

      if (resourceAnalysis.failedResources.length > 0) {
        console.log('\nFailed resources:');
        resourceAnalysis.failedResources.slice(0, 5).forEach(resource => {
          console.log(`  ❌ ${resource.status} ${resource.url}`);
        });
      }

      if (resourceAnalysis.largeResources.length > 0) {
        console.log('\nLarge uncompressed resources:');
        resourceAnalysis.largeResources.slice(0, 5).forEach(resource => {
          console.log(`  📦 ${resource.size} ${resource.url}`);
        });
      }

      // Assertions
      expect(resourceMetrics.length).toBeLessThan(100); // Reasonable request count
      expect(resourceAnalysis.failedResources.length).toBeLessThanOrEqual(3); // Allow some 404s for fonts/favicons
      
      // Critical resources shouldn't fail
      const criticalFailed = resourceAnalysis.failedResources.filter(r => 
        r.url.includes('.css') || r.url.includes('.js') || r.url.includes('api/')
      );
      expect(criticalFailed.length).toBe(0);
    });

    test('API response times', async ({ page }) => {
      const apiRequests = [];
      
      page.on('request', request => {
        if (request.url().includes('/api/')) {
          apiRequests.push({
            url: request.url(),
            method: request.method(),
            startTime: Date.now()
          });
        }
      });

      const apiResponses = [];
      page.on('response', response => {
        if (response.url().includes('/api/')) {
          const request = apiRequests.find(req => req.url === response.url());
          apiResponses.push({
            url: response.url(),
            status: response.status(),
            responseTime: request ? Date.now() - request.startTime : 0,
            headers: response.headers()
          });
        }
      });

      await page.goto('home.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000); // Wait for dynamic content

      console.log('\n=== API Performance Analysis ===');
      
      if (apiResponses.length > 0) {
        console.log(`API requests made: ${apiResponses.length}`);
        
        apiResponses.forEach(response => {
          const cacheHeader = response.headers['cache-control'] || response.headers['etag'] || 'none';
          console.log(`  ${response.status} ${response.responseTime}ms - ${response.url}`);
          console.log(`    Cache: ${cacheHeader}`);
        });

        // Performance assertions
        const slowRequests = apiResponses.filter(r => r.responseTime > 2000);
        console.log(`\nSlow API requests (>2s): ${slowRequests.length}`);
        
        expect(slowRequests.length).toBeLessThanOrEqual(1); // Allow one slow request
        
        // All API requests should succeed
        const failedApi = apiResponses.filter(r => r.status >= 400);
        expect(failedApi.length).toBe(0);
        
        // Average response time should be reasonable
        const avgResponseTime = apiResponses.reduce((sum, r) => sum + r.responseTime, 0) / apiResponses.length;
        console.log(`Average API response time: ${avgResponseTime.toFixed(0)}ms`);
        expect(avgResponseTime).toBeLessThan(1500);
      } else {
        console.log('No API requests detected');
      }
    });
  });

  test.describe('Rendering Performance', () => {
    for (const device of devices) {
      test(`Rendering performance on ${device.name}`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        
        // Enable CPU throttling for mobile testing
        if (device.type === 'mobile') {
          const client = await page.context().newCDPSession(page);
          await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        }

        const startTime = Date.now();
        await page.goto('home.html');

        // Measure rendering milestones
        const renderingMetrics = await page.evaluate(() => {
          return new Promise((resolve) => {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const paintEntries = entries.filter(entry => entry.entryType === 'paint');
              
              if (paintEntries.length >= 2) { // Both first-paint and first-contentful-paint
                observer.disconnect();
                
                const metrics = {
                  firstPaint: paintEntries.find(e => e.name === 'first-paint')?.startTime || 0,
                  firstContentfulPaint: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime || 0,
                  domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd || 0
                };
                
                resolve(metrics);
              }
            });
            
            observer.observe({ entryTypes: ['paint', 'navigation'] });
            
            // Fallback timeout
            setTimeout(() => {
              observer.disconnect();
              resolve({
                firstPaint: 0,
                firstContentfulPaint: 0,
                domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd || 0
              });
            }, 5000);
          });
        });

        await page.waitForLoadState('networkidle');
        const totalTime = Date.now() - startTime;

        // Test scroll performance
        const scrollMetrics = await page.evaluate(() => {
          return new Promise((resolve) => {
            let frameCount = 0;
            let startTime = performance.now();
            
            function countFrame() {
              frameCount++;
              if (frameCount < 60) { // Test for ~1 second
                requestAnimationFrame(countFrame);
              } else {
                const endTime = performance.now();
                const fps = Math.round(1000 / ((endTime - startTime) / frameCount));
                resolve({ fps, frameCount, duration: endTime - startTime });
              }
            }
            
            // Start scroll test
            window.scrollTo(0, 100);
            requestAnimationFrame(countFrame);
          });
        });

        console.log(`\n=== Rendering Performance: ${device.name} ===`);
        console.log(`Device: ${device.width}x${device.height} (${device.type})`);
        console.log(`First Paint: ${renderingMetrics.firstPaint.toFixed(0)}ms`);
        console.log(`First Contentful Paint: ${renderingMetrics.firstContentfulPaint.toFixed(0)}ms`);
        console.log(`DOM Content Loaded: ${renderingMetrics.domContentLoaded.toFixed(0)}ms`);
        console.log(`Total Load Time: ${totalTime}ms`);
        console.log(`Scroll Performance: ${scrollMetrics.fps} FPS`);

        // Device-specific performance thresholds
        const thresholds = {
          desktop: { fcp: 1500, fps: 55 },
          tablet: { fcp: 2500, fps: 50 },
          mobile: { fcp: 3500, fps: 45 }
        };

        const threshold = thresholds[device.type];
        
        // Assertions
        if (renderingMetrics.firstContentfulPaint > 0) {
          expect(renderingMetrics.firstContentfulPaint).toBeLessThan(threshold.fcp);
        }
        expect(scrollMetrics.fps).toBeGreaterThan(threshold.fps);
        
        console.log(`✅ ${device.name} rendering performance acceptable`);
      });
    }

    test('Image loading performance', async ({ page }) => {
      const imageMetrics = [];
      
      page.on('response', response => {
        if (response.request().resourceType() === 'image') {
          imageMetrics.push({
            url: response.url(),
            status: response.status(),
            size: response.headers()['content-length'] || 0,
            contentType: response.headers()['content-type'] || ''
          });
        }
      });

      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Check for lazy loading implementation
      const lazyImages = await page.locator('img[loading="lazy"], img[data-src]').count();
      const totalImages = await page.locator('img').count();

      console.log('\n=== Image Performance Analysis ===');
      console.log(`Total images: ${totalImages}`);
      console.log(`Lazy loaded images: ${lazyImages}`);
      console.log(`Images requested: ${imageMetrics.length}`);

      if (imageMetrics.length > 0) {
        const avgSize = imageMetrics.reduce((sum, img) => sum + parseInt(img.size || 0), 0) / imageMetrics.length;
        const largeImages = imageMetrics.filter(img => parseInt(img.size || 0) > 500000); // >500KB
        
        console.log(`Average image size: ${(avgSize / 1024).toFixed(0)}KB`);
        console.log(`Large images (>500KB): ${largeImages.length}`);

        if (largeImages.length > 0) {
          console.log('Large images:');
          largeImages.slice(0, 3).forEach(img => {
            console.log(`  📷 ${(parseInt(img.size) / 1024).toFixed(0)}KB - ${img.url.split('/').pop()}`);
          });
        }

        // Assertions
        expect(largeImages.length).toBeLessThanOrEqual(3); // Allow some hero images to be large
        if (totalImages > 5) {
          expect(lazyImages).toBeGreaterThan(0); // Should have some lazy loading
        }
      }

      // Test image formats optimization
      const webpImages = imageMetrics.filter(img => img.contentType.includes('webp')).length;
      const nextGenRatio = totalImages > 0 ? (webpImages / totalImages) * 100 : 0;
      
      console.log(`Modern format usage (WebP): ${nextGenRatio.toFixed(1)}%`);
      // Note: Not enforcing WebP as it depends on server setup
    });
  });

  test.describe('Memory and Resource Usage', () => {
    test('Memory leak detection', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Initial memory measurement
      const initialMemory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });

      if (!initialMemory) {
        console.log('Memory API not available, skipping memory leak test');
        return;
      }

      // Simulate user interactions that could cause memory leaks
      const interactions = [
        async () => {
          // Click on navigation items
          const navLinks = await page.locator('.nav-link, .menu-item').all();
          for (let i = 0; i < Math.min(navLinks.length, 3); i++) {
            if (await navLinks[i].isVisible()) {
              await navLinks[i].hover();
              await page.waitForTimeout(100);
            }
          }
        },
        async () => {
          // Try to open/close modal
          const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
          if (await signUpBtn.isVisible()) {
            await signUpBtn.click();
            await page.waitForTimeout(500);
            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);
          }
        },
        async () => {
          // Scroll up and down
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
          });
          await page.waitForTimeout(100);
          await page.evaluate(() => {
            window.scrollTo(0, 0);
          });
          await page.waitForTimeout(100);
        }
      ];

      // Perform interactions multiple times
      for (let round = 0; round < 3; round++) {
        for (const interaction of interactions) {
          await interaction();
        }
        
        // Force garbage collection if possible
        await page.evaluate(() => {
          if (window.gc) {
            window.gc();
          }
        });
        
        await page.waitForTimeout(1000);
      }

      // Final memory measurement
      const finalMemory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });

      console.log('\n=== Memory Usage Analysis ===');
      console.log(`Initial memory: ${(initialMemory.used / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Final memory: ${(finalMemory.used / 1024 / 1024).toFixed(2)}MB`);
      
      const memoryIncrease = finalMemory.used - initialMemory.used;
      const memoryIncreasePercent = (memoryIncrease / initialMemory.used) * 100;
      
      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB (${memoryIncreasePercent.toFixed(1)}%)`);

      // Memory increase should be reasonable
      expect(memoryIncreasePercent).toBeLessThan(100); // Less than 100% increase
      expect(finalMemory.used / 1024 / 1024).toBeLessThan(100); // Less than 100MB total
    });

    test('Event listener cleanup', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Check for proper event listener management
      const eventListenerAnalysis = await page.evaluate(() => {
        let listenerCount = 0;
        
        // Count event listeners on common elements
        const elements = [
          document,
          window,
          ...document.querySelectorAll('button, a, input, form')
        ];

        elements.forEach(el => {
          if (el.getEventListeners) {
            const listeners = el.getEventListeners();
            Object.keys(listeners).forEach(event => {
              listenerCount += listeners[event].length;
            });
          }
        });

        // Check for potential memory leaks in global scope
        const globalVariables = Object.keys(window).filter(key => 
          typeof window[key] === 'object' && 
          window[key] !== null &&
          !key.startsWith('webkit') &&
          !key.startsWith('chrome') &&
          !['navigator', 'document', 'location', 'history'].includes(key)
        );

        return {
          estimatedListeners: listenerCount,
          globalObjects: globalVariables.length,
          sampleGlobals: globalVariables.slice(0, 10)
        };
      });

      console.log('\n=== Event Listener Analysis ===');
      console.log(`Estimated event listeners: ${eventListenerAnalysis.estimatedListeners}`);
      console.log(`Global objects: ${eventListenerAnalysis.globalObjects}`);
      console.log(`Sample globals: ${eventListenerAnalysis.sampleGlobals.join(', ')}`);

      // Reasonable limits for event listeners and global objects
      expect(eventListenerAnalysis.globalObjects).toBeLessThan(50);
    });
  });

  test('Bundle size and optimization', async ({ page }) => {
    const resourceSizes = [];
    
    page.on('response', async response => {
      if (response.request().resourceType() === 'script' || 
          response.request().resourceType() === 'stylesheet') {
        
        const contentLength = response.headers()['content-length'];
        const contentEncoding = response.headers()['content-encoding'];
        
        if (contentLength) {
          resourceSizes.push({
            url: response.url(),
            type: response.request().resourceType(),
            size: parseInt(contentLength),
            compressed: !!contentEncoding,
            encoding: contentEncoding || 'none'
          });
        }
      }
    });

    await page.goto('home.html');
    await page.waitForLoadState('networkidle');

    console.log('\n=== Bundle Size Analysis ===');
    
    if (resourceSizes.length > 0) {
      const totalSize = resourceSizes.reduce((sum, resource) => sum + resource.size, 0);
      const compressedResources = resourceSizes.filter(r => r.compressed);
      
      console.log(`Total JS/CSS size: ${(totalSize / 1024).toFixed(0)}KB`);
      console.log(`Compressed resources: ${compressedResources.length}/${resourceSizes.length}`);
      
      console.log('\nResource breakdown:');
      resourceSizes.forEach(resource => {
        const sizeKB = (resource.size / 1024).toFixed(0);
        const compression = resource.compressed ? `(${resource.encoding})` : '(uncompressed)';
        console.log(`  ${resource.type}: ${sizeKB}KB ${compression} - ${resource.url.split('/').pop()}`);
      });

      // Bundle size assertions
      expect(totalSize / 1024).toBeLessThan(1000); // Less than 1MB total
      
      // Large files should be compressed
      const largeUncompressed = resourceSizes.filter(r => r.size > 50000 && !r.compressed);
      expect(largeUncompressed.length).toBeLessThanOrEqual(1);
      
    } else {
      console.log('No JS/CSS resources detected');
    }
  });
});