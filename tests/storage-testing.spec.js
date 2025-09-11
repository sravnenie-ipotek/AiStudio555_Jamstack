const { test, expect } = require('@playwright/test');

test.describe('Cookie and Local Storage Testing', () => {
  test.describe('Cookie Management', () => {
    test('Cookie consent and compliance', async ({ page, context }) => {
      // Clear all cookies before test
      await context.clearCookies();
      
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Check for cookie consent banner/modal
      const cookieBanner = await page.locator('.cookie-banner, .cookie-consent, .gdpr-banner, [id*="cookie"], [class*="cookie"]').first();
      const cookieModalExists = await cookieBanner.isVisible();

      console.log('\n=== Cookie Consent Analysis ===');
      console.log(`Cookie consent banner visible: ${cookieModalExists}`);

      if (cookieModalExists) {
        console.log('Cookie consent banner found');
        
        // Check for required elements
        const acceptButton = page.locator('button:has-text("Accept"), button:has-text("OK"), .cookie-accept');
        const rejectButton = page.locator('button:has-text("Reject"), button:has-text("Decline"), .cookie-reject');
        const settingsButton = page.locator('button:has-text("Settings"), button:has-text("Preferences"), .cookie-settings');
        
        const hasAccept = await acceptButton.isVisible();
        const hasReject = await rejectButton.isVisible();
        const hasSettings = await settingsButton.isVisible();
        
        console.log(`Accept button: ${hasAccept ? '✅' : '❌'}`);
        console.log(`Reject button: ${hasReject ? '✅' : '❌'}`);
        console.log(`Settings button: ${hasSettings ? '✅' : '❌'}`);

        // GDPR compliance check - should have reject option
        if (hasReject) {
          console.log('✅ GDPR compliant (has reject option)');
        } else {
          console.log('⚠️ May not be GDPR compliant (no reject option)');
        }

      } else {
        console.log('ℹ️ No cookie consent banner found');
      }

      // Check initial cookies (before consent)
      const initialCookies = await context.cookies();
      console.log(`Initial cookies: ${initialCookies.length}`);
      
      initialCookies.forEach(cookie => {
        console.log(`  ${cookie.name}: ${cookie.value.substring(0, 50)}... (domain: ${cookie.domain})`);
      });

      // Essential cookies should be minimal
      const essentialCookies = initialCookies.filter(cookie => 
        !cookie.name.includes('analytics') && 
        !cookie.name.includes('marketing') &&
        !cookie.name.includes('google') &&
        !cookie.name.includes('facebook')
      );

      expect(essentialCookies.length).toBeLessThanOrEqual(5); // Should have minimal essential cookies
    });

    test('Cookie acceptance workflow', async ({ page, context }) => {
      await context.clearCookies();
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Look for cookie consent banner
      const cookieBanner = page.locator('.cookie-banner, .cookie-consent, .gdpr-banner, [id*="cookie"], [class*="cookie"]').first();
      
      if (await cookieBanner.isVisible()) {
        // Get initial cookie count
        const initialCookies = await context.cookies();
        const initialCount = initialCookies.length;

        // Accept cookies
        const acceptButton = page.locator('button:has-text("Accept"), button:has-text("OK"), .cookie-accept').first();
        if (await acceptButton.isVisible()) {
          await acceptButton.click();
          await page.waitForTimeout(1000);

          // Check if banner disappeared
          const bannerStillVisible = await cookieBanner.isVisible();
          expect(bannerStillVisible).toBe(false);
          console.log('✅ Cookie banner dismissed after acceptance');

          // Check for new cookies after acceptance
          const finalCookies = await context.cookies();
          console.log(`Cookies after acceptance: ${finalCookies.length} (was ${initialCount})`);

          finalCookies.forEach(cookie => {
            console.log(`  ${cookie.name}: expires=${cookie.expires || 'session'}, secure=${cookie.secure}, httpOnly=${cookie.httpOnly}`);
          });

          // Should have consent cookie
          const consentCookie = finalCookies.find(cookie => 
            cookie.name.toLowerCase().includes('consent') || 
            cookie.name.toLowerCase().includes('accept') ||
            cookie.name.toLowerCase().includes('cookie')
          );
          
          if (consentCookie) {
            console.log(`✅ Consent cookie found: ${consentCookie.name}`);
          }
        }
      } else {
        console.log('ℹ️ No cookie consent banner to test');
      }
    });

    test('Cookie rejection workflow', async ({ page, context }) => {
      await context.clearCookies();
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const cookieBanner = page.locator('.cookie-banner, .cookie-consent, .gdpr-banner, [id*="cookie"], [class*="cookie"]').first();
      
      if (await cookieBanner.isVisible()) {
        const rejectButton = page.locator('button:has-text("Reject"), button:has-text("Decline"), .cookie-reject').first();
        
        if (await rejectButton.isVisible()) {
          const initialCookies = await context.cookies();
          
          await rejectButton.click();
          await page.waitForTimeout(1000);

          const finalCookies = await context.cookies();
          console.log(`Cookies after rejection: ${finalCookies.length} (was ${initialCookies.length})`);

          // Should only have essential cookies
          const nonEssentialCookies = finalCookies.filter(cookie => 
            cookie.name.includes('analytics') || 
            cookie.name.includes('marketing') ||
            cookie.name.includes('google') ||
            cookie.name.includes('facebook')
          );

          expect(nonEssentialCookies.length).toBe(0);
          console.log('✅ No non-essential cookies after rejection');

          // Test that functionality still works without non-essential cookies
          await page.reload();
          await page.waitForLoadState('networkidle');
          
          const pageTitle = await page.title();
          expect(pageTitle.length).toBeGreaterThan(0);
          console.log('✅ Page functionality preserved after cookie rejection');
        }
      }
    });

    test('Cookie categories and preferences', async ({ page, context }) => {
      await context.clearCookies();
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Look for cookie settings/preferences
      const settingsButton = page.locator('button:has-text("Settings"), button:has-text("Preferences"), .cookie-settings, .cookie-preferences').first();
      
      if (await settingsButton.isVisible()) {
        await settingsButton.click();
        await page.waitForTimeout(1000);

        // Look for cookie categories
        const categories = await page.locator('.cookie-category, .consent-category, [class*="category"]').all();
        
        console.log(`\n=== Cookie Categories ===`);
        console.log(`Categories found: ${categories.length}`);

        for (let i = 0; i < Math.min(categories.length, 5); i++) {
          const category = categories[i];
          const categoryText = await category.textContent();
          const hasToggle = await category.locator('input[type="checkbox"], .toggle, .switch').count() > 0;
          
          console.log(`Category ${i + 1}: "${categoryText?.substring(0, 50)}..." - Toggle: ${hasToggle ? '✅' : '❌'}`);
        }

        // Common cookie categories to look for
        const expectedCategories = ['necessary', 'analytics', 'marketing', 'functional', 'performance'];
        
        for (const expectedCategory of expectedCategories) {
          const categoryExists = await page.locator(`:text("${expectedCategory}")`).first().isVisible();
          console.log(`${expectedCategory.charAt(0).toUpperCase() + expectedCategory.slice(1)} category: ${categoryExists ? '✅' : '❌'}`);
        }

        // Test saving preferences
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Confirm"), .save-preferences').first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(1000);
          console.log('✅ Cookie preferences saved');
        }
      }
    });

    test('Cookie security and attributes', async ({ page, context }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const cookies = await context.cookies();
      
      console.log('\n=== Cookie Security Analysis ===');
      
      if (cookies.length > 0) {
        const securityAnalysis = {
          total: cookies.length,
          secure: 0,
          httpOnly: 0,
          sameSiteStrict: 0,
          sameSiteLax: 0,
          sessionCookies: 0,
          longTermCookies: 0
        };

        cookies.forEach(cookie => {
          if (cookie.secure) securityAnalysis.secure++;
          if (cookie.httpOnly) securityAnalysis.httpOnly++;
          if (cookie.sameSite === 'Strict') securityAnalysis.sameSiteStrict++;
          if (cookie.sameSite === 'Lax') securityAnalysis.sameSiteLax++;
          if (cookie.expires === -1) securityAnalysis.sessionCookies++;
          if (cookie.expires > Date.now() + (365 * 24 * 60 * 60 * 1000)) securityAnalysis.longTermCookies++;

          console.log(`${cookie.name}:`);
          console.log(`  Domain: ${cookie.domain}`);
          console.log(`  Secure: ${cookie.secure}`);
          console.log(`  HttpOnly: ${cookie.httpOnly}`);
          console.log(`  SameSite: ${cookie.sameSite || 'None'}`);
          console.log(`  Expires: ${cookie.expires === -1 ? 'Session' : new Date(cookie.expires * 1000).toISOString()}`);
        });

        console.log('\nSecurity Summary:');
        console.log(`Total cookies: ${securityAnalysis.total}`);
        console.log(`Secure cookies: ${securityAnalysis.secure}/${securityAnalysis.total}`);
        console.log(`HttpOnly cookies: ${securityAnalysis.httpOnly}/${securityAnalysis.total}`);
        console.log(`SameSite=Strict: ${securityAnalysis.sameSiteStrict}`);
        console.log(`SameSite=Lax: ${securityAnalysis.sameSiteLax}`);
        console.log(`Session cookies: ${securityAnalysis.sessionCookies}`);
        console.log(`Long-term cookies (>1 year): ${securityAnalysis.longTermCookies}`);

        // Security validations
        if (page.url().startsWith('https://')) {
          // On HTTPS, sensitive cookies should be secure
          const sensitiveNonSecure = cookies.filter(cookie => 
            !cookie.secure && 
            (cookie.name.toLowerCase().includes('session') || 
             cookie.name.toLowerCase().includes('auth') ||
             cookie.name.toLowerCase().includes('token'))
          );
          expect(sensitiveNonSecure.length).toBe(0);
        }

        // Should not have excessive long-term cookies
        expect(securityAnalysis.longTermCookies).toBeLessThan(5);
        
      } else {
        console.log('No cookies found to analyze');
      }
    });
  });

  test.describe('Local Storage Management', () => {
    test('Local storage usage and data persistence', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Check initial local storage
      const initialStorage = await page.evaluate(() => {
        const storage = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          storage[key] = localStorage.getItem(key);
        }
        return storage;
      });

      console.log('\n=== Local Storage Analysis ===');
      console.log(`Initial storage items: ${Object.keys(initialStorage).length}`);

      Object.keys(initialStorage).forEach(key => {
        const value = initialStorage[key];
        console.log(`  ${key}: ${value.length > 100 ? value.substring(0, 100) + '...' : value}`);
      });

      // Test localStorage functionality by interacting with the page
      // Try to trigger actions that might use localStorage
      
      // Open contact modal if available
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      if (await signUpBtn.isVisible()) {
        await signUpBtn.click();
        await page.waitForTimeout(1000);
        
        // Fill form partially to test if data is stored
        await page.fill('#fullName', 'Test User for LocalStorage');
        await page.keyboard.press('Escape'); // Close modal
        await page.waitForTimeout(500);
      }

      // Check for language preference storage
      const languageButtons = await page.locator('.lang-btn, [class*="language"], [class*="lang"]').all();
      if (languageButtons.length > 0) {
        console.log(`Language buttons found: ${languageButtons.length}`);
        // Click first language button if available
        await languageButtons[0].click();
        await page.waitForTimeout(500);
      }

      // Check localStorage after interactions
      const finalStorage = await page.evaluate(() => {
        const storage = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          storage[key] = localStorage.getItem(key);
        }
        return storage;
      });

      console.log(`Final storage items: ${Object.keys(finalStorage).length}`);

      // Analyze storage usage patterns
      const storageAnalysis = {
        userPreferences: 0,
        formData: 0,
        analytics: 0,
        cache: 0,
        other: 0
      };

      Object.keys(finalStorage).forEach(key => {
        const keyLower = key.toLowerCase();
        if (keyLower.includes('preference') || keyLower.includes('setting') || keyLower.includes('lang')) {
          storageAnalysis.userPreferences++;
        } else if (keyLower.includes('form') || keyLower.includes('input')) {
          storageAnalysis.formData++;
        } else if (keyLower.includes('analytics') || keyLower.includes('track') || keyLower.includes('ga')) {
          storageAnalysis.analytics++;
        } else if (keyLower.includes('cache') || keyLower.includes('temp')) {
          storageAnalysis.cache++;
        } else {
          storageAnalysis.other++;
        }
      });

      console.log('\nStorage categorization:');
      console.log(`User preferences: ${storageAnalysis.userPreferences}`);
      console.log(`Form data: ${storageAnalysis.formData}`);
      console.log(`Analytics: ${storageAnalysis.analytics}`);
      console.log(`Cache: ${storageAnalysis.cache}`);
      console.log(`Other: ${storageAnalysis.other}`);

      // Calculate total storage size
      const totalSize = Object.values(finalStorage).reduce((size, value) => size + value.length, 0);
      console.log(`Total storage size: ${(totalSize / 1024).toFixed(2)} KB`);

      // Storage should not be excessive
      expect(totalSize).toBeLessThan(1024 * 1024); // Less than 1MB
      expect(Object.keys(finalStorage).length).toBeLessThan(50); // Reasonable number of items
    });

    test('Session storage usage', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const sessionStorage = await page.evaluate(() => {
        const storage = {};
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          storage[key] = sessionStorage.getItem(key);
        }
        return storage;
      });

      console.log('\n=== Session Storage Analysis ===');
      console.log(`Session storage items: ${Object.keys(sessionStorage).length}`);

      Object.keys(sessionStorage).forEach(key => {
        const value = sessionStorage[key];
        console.log(`  ${key}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
      });

      // Test session storage persistence within session
      await page.evaluate(() => {
        sessionStorage.setItem('test-session-key', 'test-session-value');
      });

      // Navigate to another page and back
      await page.goto('courses.html');
      await page.waitForLoadState('networkidle');
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const persistedValue = await page.evaluate(() => {
        return sessionStorage.getItem('test-session-key');
      });

      expect(persistedValue).toBe('test-session-value');
      console.log('✅ Session storage persists across page navigation');

      // Clean up test data
      await page.evaluate(() => {
        sessionStorage.removeItem('test-session-key');
      });
    });

    test('IndexedDB usage (if applicable)', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const indexedDBInfo = await page.evaluate(async () => {
        if (!window.indexedDB) {
          return { supported: false };
        }

        try {
          // Check for existing databases
          const databases = await indexedDB.databases ? await indexedDB.databases() : [];
          
          return {
            supported: true,
            databases: databases.map(db => ({
              name: db.name,
              version: db.version
            }))
          };
        } catch (error) {
          return {
            supported: true,
            error: error.message,
            databases: []
          };
        }
      });

      console.log('\n=== IndexedDB Analysis ===');
      console.log(`IndexedDB supported: ${indexedDBInfo.supported}`);

      if (indexedDBInfo.supported) {
        console.log(`Databases found: ${indexedDBInfo.databases?.length || 0}`);
        
        if (indexedDBInfo.databases?.length > 0) {
          indexedDBInfo.databases.forEach(db => {
            console.log(`  Database: ${db.name} (version: ${db.version})`);
          });
        }

        if (indexedDBInfo.error) {
          console.log(`Error accessing IndexedDB: ${indexedDBInfo.error}`);
        }
      }
    });

    test('Storage quota and limits', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const quotaInfo = await page.evaluate(async () => {
        const info = {
          localStorageSupported: typeof localStorage !== 'undefined',
          sessionStorageSupported: typeof sessionStorage !== 'undefined'
        };

        // Test localStorage limits
        if (info.localStorageSupported) {
          try {
            const testKey = 'quota-test';
            const testData = 'x'.repeat(1024); // 1KB test data
            let size = 0;
            
            // Test how much we can store
            for (let i = 0; i < 10; i++) {
              localStorage.setItem(`${testKey}-${i}`, testData);
              size += testData.length;
            }
            
            // Clean up test data
            for (let i = 0; i < 10; i++) {
              localStorage.removeItem(`${testKey}-${i}`);
            }
            
            info.localStorageTestSize = size;
          } catch (error) {
            info.localStorageError = error.message;
          }
        }

        // Check storage quota API if available
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          try {
            const estimate = await navigator.storage.estimate();
            info.storageQuota = {
              quota: estimate.quota,
              usage: estimate.usage,
              usagePercentage: ((estimate.usage / estimate.quota) * 100).toFixed(2)
            };
          } catch (error) {
            info.storageQuotaError = error.message;
          }
        }

        return info;
      });

      console.log('\n=== Storage Quota Analysis ===');
      console.log(`localStorage supported: ${quotaInfo.localStorageSupported}`);
      console.log(`sessionStorage supported: ${quotaInfo.sessionStorageSupported}`);

      if (quotaInfo.localStorageTestSize) {
        console.log(`localStorage test size: ${(quotaInfo.localStorageTestSize / 1024).toFixed(2)} KB`);
      }

      if (quotaInfo.storageQuota) {
        const quota = quotaInfo.storageQuota;
        console.log(`Storage quota: ${(quota.quota / (1024 * 1024 * 1024)).toFixed(2)} GB`);
        console.log(`Storage usage: ${(quota.usage / (1024 * 1024)).toFixed(2)} MB`);
        console.log(`Usage percentage: ${quota.usagePercentage}%`);

        // Should not be using excessive storage
        expect(parseFloat(quota.usagePercentage)).toBeLessThan(50); // Less than 50% of quota
      }

      if (quotaInfo.localStorageError) {
        console.log(`localStorage error: ${quotaInfo.localStorageError}`);
      }

      if (quotaInfo.storageQuotaError) {
        console.log(`Storage quota error: ${quotaInfo.storageQuotaError}`);
      }
    });
  });

  test.describe('Data Privacy and Compliance', () => {
    test('Personal data storage compliance', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Test contact form data handling
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      if (await signUpBtn.isVisible()) {
        await signUpBtn.click();
        await page.waitForTimeout(1000);

        // Fill form with test personal data
        const testData = {
          name: 'John Privacy Test',
          phone: '+1-555-123-4567',
          email: 'privacy.test@example.com'
        };

        await page.fill('#fullName', testData.name);
        if (await page.locator('#phoneNumber').isVisible()) {
          await page.fill('#phoneNumber', testData.phone);
        }
        if (await page.locator('#email').isVisible()) {
          await page.fill('#email', testData.email);
        }

        // Check if data is stored locally without consent
        const localStorageAfterForm = await page.evaluate(() => {
          const storage = {};
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            storage[key] = localStorage.getItem(key);
          }
          return storage;
        });

        console.log('\n=== Personal Data Storage Analysis ===');
        
        // Check if personal data is inadvertently stored
        const containsPersonalData = Object.values(localStorageAfterForm).some(value => 
          value.includes(testData.name) || 
          value.includes(testData.phone) || 
          value.includes(testData.email)
        );

        if (containsPersonalData) {
          console.log('⚠️ Personal data found in localStorage');
          Object.keys(localStorageAfterForm).forEach(key => {
            const value = localStorageAfterForm[key];
            if (value.includes(testData.name) || value.includes(testData.phone)) {
              console.log(`  ${key}: contains personal data`);
            }
          });
        } else {
          console.log('✅ No personal data stored in localStorage');
        }

        // Personal data should not be stored without explicit consent
        expect(containsPersonalData).toBe(false);

        // Close modal
        await page.keyboard.press('Escape');
      }
    });

    test('Data retention and cleanup', async ({ page, context }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Add some test data to storage
      await page.evaluate(() => {
        localStorage.setItem('test-retention-key', 'test-data-' + Date.now());
        sessionStorage.setItem('test-session-retention', 'session-data-' + Date.now());
      });

      const initialData = await page.evaluate(() => ({
        localStorage: localStorage.getItem('test-retention-key'),
        sessionStorage: sessionStorage.getItem('test-session-retention')
      }));

      console.log('\n=== Data Retention Testing ===');
      console.log(`Initial localStorage: ${initialData.localStorage}`);
      console.log(`Initial sessionStorage: ${initialData.sessionStorage}`);

      // Test if there's a way to clear data (privacy compliance)
      const clearDataButton = page.locator('button:has-text("Clear"), button:has-text("Reset"), .clear-data, .reset-data').first();
      
      if (await clearDataButton.isVisible()) {
        await clearDataButton.click();
        await page.waitForTimeout(1000);

        const clearedData = await page.evaluate(() => ({
          localStorage: localStorage.getItem('test-retention-key'),
          sessionStorage: sessionStorage.getItem('test-session-retention')
        }));

        console.log('Data after clear button:');
        console.log(`  localStorage: ${clearedData.localStorage || 'null'}`);
        console.log(`  sessionStorage: ${clearedData.sessionStorage || 'null'}`);
      } else {
        console.log('ℹ️ No clear data button found');
      }

      // Test session storage cleanup on new session
      await context.clearCookies();
      await page.reload();
      await page.waitForLoadState('networkidle');

      const afterReload = await page.evaluate(() => ({
        localStorage: localStorage.getItem('test-retention-key'),
        sessionStorage: sessionStorage.getItem('test-session-retention')
      }));

      console.log('Data after page reload:');
      console.log(`  localStorage: ${afterReload.localStorage || 'null'}`);
      console.log(`  sessionStorage: ${afterReload.sessionStorage || 'null'}`);

      // Session storage should be cleared on reload
      expect(afterReload.sessionStorage).toBeNull();

      // Clean up test data
      await page.evaluate(() => {
        localStorage.removeItem('test-retention-key');
      });
    });

    test('Third-party tracking and analytics compliance', async ({ page, context }) => {
      // Clear all data before test
      await context.clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      await page.goto('home.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000); // Wait for analytics to load

      // Check for third-party tracking
      const trackingAnalysis = await page.evaluate(() => {
        const analysis = {
          googleAnalytics: {
            gtag: typeof gtag !== 'undefined',
            ga: typeof ga !== 'undefined',
            googleAnalyticsObject: typeof GoogleAnalyticsObject !== 'undefined'
          },
          facebookPixel: {
            fbq: typeof fbq !== 'undefined',
            _fbp: document.cookie.includes('_fbp')
          },
          otherTracking: {
            hotjar: typeof hj !== 'undefined',
            mixpanel: typeof mixpanel !== 'undefined',
            amplitude: typeof amplitude !== 'undefined'
          }
        };

        // Check localStorage for tracking data
        const trackingInStorage = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.includes('ga') || key.includes('gtm') || key.includes('fb') || key.includes('track')) {
            trackingInStorage.push(key);
          }
        }
        analysis.trackingInStorage = trackingInStorage;

        return analysis;
      });

      console.log('\n=== Third-Party Tracking Analysis ===');
      
      console.log('Google Analytics:');
      console.log(`  gtag: ${trackingAnalysis.googleAnalytics.gtag}`);
      console.log(`  ga: ${trackingAnalysis.googleAnalytics.ga}`);

      console.log('Facebook Pixel:');
      console.log(`  fbq: ${trackingAnalysis.facebookPixel.fbq}`);
      console.log(`  _fbp cookie: ${trackingAnalysis.facebookPixel._fbp}`);

      console.log('Other Tracking:');
      Object.keys(trackingAnalysis.otherTracking).forEach(tracker => {
        console.log(`  ${tracker}: ${trackingAnalysis.otherTracking[tracker]}`);
      });

      if (trackingAnalysis.trackingInStorage.length > 0) {
        console.log('Tracking data in localStorage:');
        trackingAnalysis.trackingInStorage.forEach(key => {
          console.log(`  ${key}`);
        });
      }

      // Check cookies for tracking
      const cookies = await context.cookies();
      const trackingCookies = cookies.filter(cookie => 
        cookie.name.includes('_ga') || 
        cookie.name.includes('_gid') || 
        cookie.name.includes('_fbp') || 
        cookie.name.includes('_gat')
      );

      console.log(`Tracking cookies: ${trackingCookies.length}`);
      trackingCookies.forEach(cookie => {
        console.log(`  ${cookie.name}: ${cookie.domain}`);
      });

      // If tracking is present, should have proper consent mechanism
      const hasTracking = trackingAnalysis.googleAnalytics.gtag || 
                         trackingAnalysis.facebookPixel.fbq || 
                         trackingCookies.length > 0;

      if (hasTracking) {
        console.log('⚠️ Tracking detected - should have consent mechanism');
        
        // Look for consent banner
        const consentBanner = await page.locator('.cookie-banner, .cookie-consent, .gdpr-banner').first().isVisible();
        console.log(`Consent banner present: ${consentBanner ? '✅' : '❌'}`);
        
        if (!consentBanner) {
          console.log('⚠️ Warning: Tracking without visible consent mechanism');
        }
      } else {
        console.log('✅ No third-party tracking detected');
      }
    });

    test('Cross-site tracking prevention', async ({ page, context }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Check for third-party domains in requests
      const thirdPartyRequests = [];
      
      page.on('request', request => {
        const url = new URL(request.url());
        const pageUrl = new URL(page.url());
        
        if (url.hostname !== pageUrl.hostname && url.hostname !== 'localhost') {
          thirdPartyRequests.push({
            domain: url.hostname,
            url: request.url(),
            resourceType: request.resourceType()
          });
        }
      });

      // Wait for all requests to complete
      await page.waitForTimeout(5000);

      console.log('\n=== Cross-Site Tracking Analysis ===');
      console.log(`Third-party requests: ${thirdPartyRequests.length}`);

      // Group by domain
      const domainGroups = {};
      thirdPartyRequests.forEach(request => {
        if (!domainGroups[request.domain]) {
          domainGroups[request.domain] = [];
        }
        domainGroups[request.domain].push(request);
      });

      Object.keys(domainGroups).forEach(domain => {
        const requests = domainGroups[domain];
        console.log(`\n${domain}: ${requests.length} requests`);
        
        // Check for known tracking domains
        const isTrackingDomain = domain.includes('google-analytics') || 
                                domain.includes('googletagmanager') ||
                                domain.includes('facebook') ||
                                domain.includes('doubleclick') ||
                                domain.includes('amazon-adsystem');
        
        if (isTrackingDomain) {
          console.log(`  ⚠️ Potential tracking domain: ${domain}`);
        }

        // Show sample requests
        requests.slice(0, 3).forEach(request => {
          console.log(`    ${request.resourceType}: ${request.url.substring(0, 80)}...`);
        });
      });

      // Check for tracking prevention headers
      const response = await page.goto(page.url());
      const headers = response.headers();
      
      console.log('\nTracking prevention headers:');
      console.log(`  Referrer-Policy: ${headers['referrer-policy'] || 'not set'}`);
      console.log(`  X-Frame-Options: ${headers['x-frame-options'] || 'not set'}`);
      console.log(`  Content-Security-Policy: ${headers['content-security-policy'] ? 'set' : 'not set'}`);
    });
  });

  test('Storage cleanup and performance impact', async ({ page }) => {
    await page.goto('home.html');
    await page.waitForLoadState('networkidle');

    // Measure storage access performance
    const performanceTest = await page.evaluate(() => {
      const results = {};
      
      // Test localStorage performance
      const localStorageStart = performance.now();
      for (let i = 0; i < 100; i++) {
        localStorage.setItem(`perf-test-${i}`, `test-data-${i}-${Date.now()}`);
      }
      const localStorageWrite = performance.now() - localStorageStart;
      
      const localStorageReadStart = performance.now();
      for (let i = 0; i < 100; i++) {
        localStorage.getItem(`perf-test-${i}`);
      }
      const localStorageRead = performance.now() - localStorageReadStart;
      
      // Cleanup
      for (let i = 0; i < 100; i++) {
        localStorage.removeItem(`perf-test-${i}`);
      }
      
      results.localStorage = {
        write: localStorageWrite.toFixed(2),
        read: localStorageRead.toFixed(2)
      };
      
      // Test sessionStorage performance
      const sessionStorageStart = performance.now();
      for (let i = 0; i < 100; i++) {
        sessionStorage.setItem(`perf-test-${i}`, `test-data-${i}-${Date.now()}`);
      }
      const sessionStorageWrite = performance.now() - sessionStorageStart;
      
      const sessionStorageReadStart = performance.now();
      for (let i = 0; i < 100; i++) {
        sessionStorage.getItem(`perf-test-${i}`);
      }
      const sessionStorageRead = performance.now() - sessionStorageReadStart;
      
      // Cleanup
      for (let i = 0; i < 100; i++) {
        sessionStorage.removeItem(`perf-test-${i}`);
      }
      
      results.sessionStorage = {
        write: sessionStorageWrite.toFixed(2),
        read: sessionStorageRead.toFixed(2)
      };
      
      return results;
    });

    console.log('\n=== Storage Performance Analysis ===');
    console.log(`localStorage write (100 items): ${performanceTest.localStorage.write}ms`);
    console.log(`localStorage read (100 items): ${performanceTest.localStorage.read}ms`);
    console.log(`sessionStorage write (100 items): ${performanceTest.sessionStorage.write}ms`);
    console.log(`sessionStorage read (100 items): ${performanceTest.sessionStorage.read}ms`);

    // Performance should be reasonable
    expect(parseFloat(performanceTest.localStorage.write)).toBeLessThan(100); // Less than 100ms
    expect(parseFloat(performanceTest.localStorage.read)).toBeLessThan(50); // Less than 50ms
    expect(parseFloat(performanceTest.sessionStorage.write)).toBeLessThan(100);
    expect(parseFloat(performanceTest.sessionStorage.read)).toBeLessThan(50);

    console.log('✅ Storage performance within acceptable limits');
  });
});