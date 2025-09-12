const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3005';
const API_URL = 'https://aistudio555jamstack-production.up.railway.app';

// Performance thresholds (relaxed for development)
const PERFORMANCE_THRESHOLDS = {
  FCP: 3000,        // First Contentful Paint (ms)
  LCP: 4000,        // Largest Contentful Paint (ms)
  FID: 100,         // First Input Delay (ms)
  CLS: 0.25,        // Cumulative Layout Shift
  TTFB: 2000,       // Time to First Byte (ms)
  DOMContentLoaded: 5000,  // DOM ready (ms)
  LoadComplete: 8000,      // Full page load (ms)
  MemoryUsage: 100 * 1024 * 1024, // 100MB
};

// Pages to test
const PAGES = [
  'home.html',
  'courses.html',
  'teachers.html',
  'pricing.html',
  'career-center.html'
];

test.describe('⚡ Performance Tests', () => {
  test.describe('Core Web Vitals', () => {
    for (const page of PAGES) {
      test(`${page} - Core Web Vitals`, async ({ page: browserPage }) => {
        // Start performance monitoring
        await browserPage.goto(`${BASE_URL}/${page}`, { waitUntil: 'domcontentloaded' });
        
        const vitals = await browserPage.evaluate(() => {
          return new Promise((resolve) => {
            const vitals = {
              FCP: 0,
              LCP: 0,
              FID: 0,
              CLS: 0,
              TTFB: 0,
              measurements: []
            };
            
            let measurements = 0;
            const maxWait = 5000; // 5 seconds max
            
            // First Contentful Paint
            const fcpObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                  vitals.FCP = entry.startTime;
                  measurements++;
                }
              }
            });
            fcpObserver.observe({ entryTypes: ['paint'] });
            
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              vitals.LCP = lastEntry.startTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  vitals.CLS += entry.value;
                }
              }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            
            // First Input Delay (if available)
            const fidObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                vitals.FID = entry.processingStart - entry.startTime;
                measurements++;
              }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Navigation timing
            const perfTiming = performance.timing;
            if (perfTiming) {
              vitals.TTFB = perfTiming.responseStart - perfTiming.navigationStart;
              vitals.measurements.push({
                type: 'navigation',
                domContentLoaded: perfTiming.domContentLoadedEventEnd - perfTiming.navigationStart,
                loadComplete: perfTiming.loadEventEnd - perfTiming.navigationStart,
              });
            }
            
            // Resolve after timeout or when measurements complete
            setTimeout(() => {
              resolve(vitals);
            }, maxWait);
          });
        });
        
        console.log(`\n⚡ Core Web Vitals for ${page}:`);
        console.log(`   FCP: ${Math.round(vitals.FCP)}ms (target: <${PERFORMANCE_THRESHOLDS.FCP}ms)`);
        console.log(`   LCP: ${Math.round(vitals.LCP)}ms (target: <${PERFORMANCE_THRESHOLDS.LCP}ms)`);
        console.log(`   CLS: ${vitals.CLS.toFixed(3)} (target: <${PERFORMANCE_THRESHOLDS.CLS})`);
        console.log(`   TTFB: ${Math.round(vitals.TTFB)}ms (target: <${PERFORMANCE_THRESHOLDS.TTFB}ms)`);
        
        if (vitals.FID > 0) {
          console.log(`   FID: ${Math.round(vitals.FID)}ms (target: <${PERFORMANCE_THRESHOLDS.FID}ms)`);
        }
        
        if (vitals.measurements.length > 0) {
          const nav = vitals.measurements[0];
          console.log(`   DOM Ready: ${Math.round(nav.domContentLoaded)}ms`);
          console.log(`   Load Complete: ${Math.round(nav.loadComplete)}ms`);
        }
        
        // Scoring
        const scores = {
          FCP: vitals.FCP < PERFORMANCE_THRESHOLDS.FCP ? 'PASS' : 'FAIL',
          LCP: vitals.LCP < PERFORMANCE_THRESHOLDS.LCP ? 'PASS' : 'FAIL',
          CLS: vitals.CLS < PERFORMANCE_THRESHOLDS.CLS ? 'PASS' : 'FAIL',
          TTFB: vitals.TTFB < PERFORMANCE_THRESHOLDS.TTFB ? 'PASS' : 'FAIL',
        };
        
        const passCount = Object.values(scores).filter(s => s === 'PASS').length;
        console.log(`   Overall Score: ${passCount}/4 metrics passed`);
        
        // Assertions (relaxed)
        expect(vitals.FCP).toBeLessThan(PERFORMANCE_THRESHOLDS.FCP * 1.5); // 50% tolerance
        expect(vitals.LCP).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP * 1.5);
        expect(vitals.CLS).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS * 2);
      });
    }
  });

  test.describe('Memory Usage', () => {
    test('Memory consumption monitoring', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
      
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        if (window.performance && window.performance.memory) {
          return {
            used: window.performance.memory.usedJSHeapSize,
            total: window.performance.memory.totalJSHeapSize,
            limit: window.performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      if (initialMemory) {
        console.log('\n💾 Memory Usage:');
        console.log(`   Used JS Heap: ${(initialMemory.used / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Total JS Heap: ${(initialMemory.total / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Heap Size Limit: ${(initialMemory.limit / 1024 / 1024).toFixed(2)} MB`);
        
        // Memory efficiency check
        const efficiency = (initialMemory.used / initialMemory.total) * 100;
        console.log(`   Memory Efficiency: ${efficiency.toFixed(1)}%`);
        
        // Check for memory leaks by navigating and coming back
        await page.goto(`${BASE_URL}/courses.html`, { waitUntil: 'networkidle' });
        await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
        
        const finalMemory = await page.evaluate(() => {
          if (window.performance && window.performance.memory) {
            return {
              used: window.performance.memory.usedJSHeapSize,
              total: window.performance.memory.totalJSHeapSize,
            };
          }
          return null;
        });
        
        if (finalMemory) {
          const memoryIncrease = finalMemory.used - initialMemory.used;
          const increasePercent = (memoryIncrease / initialMemory.used) * 100;
          
          console.log(`   Memory after navigation: ${(finalMemory.used / 1024 / 1024).toFixed(2)} MB`);
          console.log(`   Memory increase: ${increasePercent.toFixed(1)}%`);
          
          if (increasePercent > 50) {
            console.warn(`   ⚠️  Significant memory increase detected`);
          }
        }
        
        expect(initialMemory.used).toBeLessThan(PERFORMANCE_THRESHOLDS.MemoryUsage);
      } else {
        console.log('\n💾 Memory Usage: Performance.memory API not available');
      }
    });
  });

  test.describe('Resource Loading', () => {
    test('Resource loading performance', async ({ page }) => {
      const resourceTimings = [];
      
      page.on('response', response => {
        resourceTimings.push({
          url: response.url(),
          status: response.status(),
          timing: response.timing(),
          size: response.headers()['content-length'] || 0,
          type: getResourceType(response.url()),
        });
      });
      
      await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
      
      // Analyze resource loading
      const analysis = analyzeResourceTimings(resourceTimings);
      
      console.log('\n📦 Resource Loading Analysis:');
      console.log(`   Total resources: ${resourceTimings.length}`);
      console.log(`   Images: ${analysis.images.count} (${(analysis.images.totalSize / 1024).toFixed(1)} KB)`);
      console.log(`   Scripts: ${analysis.scripts.count} (avg: ${analysis.scripts.avgTime.toFixed(0)}ms)`);
      console.log(`   Stylesheets: ${analysis.styles.count} (avg: ${analysis.styles.avgTime.toFixed(0)}ms)`);
      console.log(`   API calls: ${analysis.api.count} (avg: ${analysis.api.avgTime.toFixed(0)}ms)`);
      console.log(`   Failed resources: ${analysis.failed.length}`);
      
      if (analysis.failed.length > 0) {
        console.log('   Failed resources:');
        analysis.failed.slice(0, 3).forEach(resource => {
          console.log(`     - ${resource.status} ${resource.url.split('/').pop()}`);
        });
      }
      
      // Performance checks
      if (analysis.scripts.avgTime > 2000) {
        console.warn(`   ⚠️  Slow script loading: ${analysis.scripts.avgTime.toFixed(0)}ms average`);
      }
      
      if (analysis.api.avgTime > 3000) {
        console.warn(`   ⚠️  Slow API responses: ${analysis.api.avgTime.toFixed(0)}ms average`);
      }
      
      expect(analysis.failed.length).toBeLessThanOrEqual(2); // Allow some tolerance
    });

    test('Image optimization check', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
      
      const imageAnalysis = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const analysis = {
          total: images.length,
          withoutAlt: 0,
          oversized: [],
          formats: {},
        };
        
        images.forEach(img => {
          // Check alt text
          if (!img.alt) analysis.withoutAlt++;
          
          // Check dimensions vs natural size
          const displayWidth = img.width || img.offsetWidth;
          const displayHeight = img.height || img.offsetHeight;
          const naturalWidth = img.naturalWidth;
          const naturalHeight = img.naturalHeight;
          
          if (naturalWidth > displayWidth * 2 || naturalHeight > displayHeight * 2) {
            analysis.oversized.push({
              src: img.src.split('/').pop(),
              display: `${displayWidth}x${displayHeight}`,
              natural: `${naturalWidth}x${naturalHeight}`,
            });
          }
          
          // Check format
          const extension = img.src.split('.').pop().toLowerCase();
          analysis.formats[extension] = (analysis.formats[extension] || 0) + 1;
        });
        
        return analysis;
      });
      
      console.log('\n🖼️  Image Optimization:');
      console.log(`   Total images: ${imageAnalysis.total}`);
      console.log(`   Without alt text: ${imageAnalysis.withoutAlt}`);
      console.log(`   Oversized images: ${imageAnalysis.oversized.length}`);
      console.log(`   Image formats:`, imageAnalysis.formats);
      
      if (imageAnalysis.oversized.length > 0) {
        console.log('   Oversized images (>2x display size):');
        imageAnalysis.oversized.slice(0, 3).forEach(img => {
          console.log(`     - ${img.src}: ${img.natural} → ${img.display}`);
        });
      }
      
      // Check for modern formats
      const hasWebP = imageAnalysis.formats.webp > 0;
      const hasAVIF = imageAnalysis.formats.avif > 0;
      console.log(`   Modern formats: WebP=${hasWebP ? '✅' : '❌'}, AVIF=${hasAVIF ? '✅' : '❌'}`);
      
      expect(imageAnalysis.oversized.length).toBeLessThanOrEqual(5);
    });
  });

  test.describe('API Performance', () => {
    test('API response times', async ({ request }) => {
      const endpoints = [
        '/api/courses',
        '/api/teachers',
        '/api/home-page',
        '/api/career-center-page',
        '/api/blog-posts'
      ];
      
      const results = [];
      
      for (const endpoint of endpoints) {
        const startTime = Date.now();
        
        try {
          const response = await request.get(`${API_URL}${endpoint}`, {
            timeout: 10000
          });
          
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          const data = await response.json();
          
          results.push({
            endpoint,
            status: response.status(),
            responseTime,
            dataSize: JSON.stringify(data).length,
            hasData: !!data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0),
          });
          
        } catch (error) {
          results.push({
            endpoint,
            status: 'ERROR',
            responseTime: 'TIMEOUT',
            error: error.message,
          });
        }
      }
      
      console.log('\n🔌 API Performance:');
      results.forEach(result => {
        const status = result.status === 200 ? '✅' : '❌';
        const time = typeof result.responseTime === 'number' ? `${result.responseTime}ms` : result.responseTime;
        const size = result.dataSize ? `(${(result.dataSize / 1024).toFixed(1)}KB)` : '';
        
        console.log(`   ${result.endpoint}: ${status} ${time} ${size}`);
        
        if (result.error) {
          console.log(`     Error: ${result.error}`);
        }
      });
      
      // Calculate averages
      const successfulRequests = results.filter(r => r.status === 200 && typeof r.responseTime === 'number');
      if (successfulRequests.length > 0) {
        const avgResponseTime = successfulRequests.reduce((sum, r) => sum + r.responseTime, 0) / successfulRequests.length;
        const maxResponseTime = Math.max(...successfulRequests.map(r => r.responseTime));
        
        console.log(`\n   Average response time: ${avgResponseTime.toFixed(0)}ms`);
        console.log(`   Max response time: ${maxResponseTime}ms`);
        console.log(`   Success rate: ${(successfulRequests.length / results.length * 100).toFixed(1)}%`);
        
        // Performance assertions
        expect(avgResponseTime).toBeLessThan(3000);
        expect(maxResponseTime).toBeLessThan(5000);
        expect(successfulRequests.length).toBeGreaterThanOrEqual(Math.floor(results.length * 0.8)); // 80% success rate
      }
    });
  });

  test.describe('Network Efficiency', () => {
    test('Bundle size and compression', async ({ page }) => {
      const resourceSizes = [];
      
      page.on('response', async (response) => {
        const url = response.url();
        const contentLength = response.headers()['content-length'];
        const contentEncoding = response.headers()['content-encoding'];
        
        if (contentLength) {
          resourceSizes.push({
            url: url.split('/').pop(),
            size: parseInt(contentLength),
            compressed: !!contentEncoding,
            type: getResourceType(url),
          });
        }
      });
      
      await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
      
      // Analyze bundle sizes
      const analysis = {
        totalSize: 0,
        compressedSize: 0,
        uncompressedCount: 0,
        largeResources: [],
      };
      
      resourceSizes.forEach(resource => {
        analysis.totalSize += resource.size;
        
        if (resource.compressed) {
          analysis.compressedSize += resource.size;
        } else {
          analysis.uncompressedCount++;
        }
        
        if (resource.size > 100000) { // >100KB
          analysis.largeResources.push(resource);
        }
      });
      
      console.log('\n📊 Bundle Analysis:');
      console.log(`   Total page size: ${(analysis.totalSize / 1024).toFixed(1)} KB`);
      console.log(`   Compressed resources: ${resourceSizes.length - analysis.uncompressedCount}/${resourceSizes.length}`);
      console.log(`   Uncompressed resources: ${analysis.uncompressedCount}`);
      console.log(`   Large resources (>100KB): ${analysis.largeResources.length}`);
      
      if (analysis.largeResources.length > 0) {
        console.log('   Large resources:');
        analysis.largeResources.slice(0, 3).forEach(resource => {
          console.log(`     - ${resource.url}: ${(resource.size / 1024).toFixed(1)}KB (${resource.compressed ? 'compressed' : 'uncompressed'})`);
        });
      }
      
      const compressionRate = resourceSizes.length === 0 ? 100 : 
        ((resourceSizes.length - analysis.uncompressedCount) / resourceSizes.length) * 100;
      
      console.log(`   Compression rate: ${compressionRate.toFixed(1)}%`);
      
      // Recommendations
      if (analysis.totalSize > 2 * 1024 * 1024) { // >2MB
        console.warn(`   ⚠️  Large total page size: ${(analysis.totalSize / 1024 / 1024).toFixed(1)}MB`);
      }
      
      if (compressionRate < 70) {
        console.warn(`   ⚠️  Low compression rate: ${compressionRate.toFixed(1)}%`);
      }
      
      expect(analysis.totalSize).toBeLessThan(5 * 1024 * 1024); // Max 5MB per page
    });
  });
});

// Helper functions
function getResourceType(url) {
  if (url.includes('/api/')) return 'api';
  if (/\.(js|mjs)(\?|$)/.test(url)) return 'script';
  if (/\.css(\?|$)/.test(url)) return 'style';
  if (/\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/.test(url)) return 'image';
  if (/\.(woff|woff2|ttf|otf)(\?|$)/.test(url)) return 'font';
  return 'other';
}

function analyzeResourceTimings(timings) {
  const analysis = {
    images: { count: 0, totalSize: 0 },
    scripts: { count: 0, totalTime: 0, avgTime: 0 },
    styles: { count: 0, totalTime: 0, avgTime: 0 },
    api: { count: 0, totalTime: 0, avgTime: 0 },
    failed: [],
  };
  
  timings.forEach(resource => {
    if (resource.status >= 400) {
      analysis.failed.push(resource);
      return;
    }
    
    const responseTime = resource.timing ? 
      (resource.timing.responseEnd - resource.timing.requestStart) : 0;
    
    switch (resource.type) {
      case 'image':
        analysis.images.count++;
        analysis.images.totalSize += parseInt(resource.size || 0);
        break;
      case 'script':
        analysis.scripts.count++;
        analysis.scripts.totalTime += responseTime;
        break;
      case 'style':
        analysis.styles.count++;
        analysis.styles.totalTime += responseTime;
        break;
      case 'api':
        analysis.api.count++;
        analysis.api.totalTime += responseTime;
        break;
    }
  });
  
  // Calculate averages
  analysis.scripts.avgTime = analysis.scripts.count > 0 ? 
    analysis.scripts.totalTime / analysis.scripts.count : 0;
  analysis.styles.avgTime = analysis.styles.count > 0 ? 
    analysis.styles.totalTime / analysis.styles.count : 0;
  analysis.api.avgTime = analysis.api.count > 0 ? 
    analysis.api.totalTime / analysis.api.count : 0;
  
  return analysis;
}

// Summary
test.afterAll(async () => {
  console.log('\n' + '='.repeat(60));
  console.log('⚡ PERFORMANCE TESTING COMPLETE');
  console.log('='.repeat(60));
  console.log('✅ Core Web Vitals measured');
  console.log('✅ Memory usage monitored');
  console.log('✅ Resource loading analyzed');
  console.log('✅ API performance tested');
  console.log('✅ Network efficiency evaluated');
  console.log('='.repeat(60));
});