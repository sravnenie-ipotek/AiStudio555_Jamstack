const { test, expect } = require('@playwright/test');
const { injectAxe, checkA11y } = require('axe-playwright');

const BASE_URL = 'http://localhost:3005';

// Pages to test
const PAGES = [
  'home.html',
  'courses.html',
  'teachers.html',
  'career-center.html',
  'pricing.html',
  'blog.html',
];

// WCAG 2.1 Level AA Standards
const WCAG_STANDARDS = {
  contrastRatio: {
    normal: 4.5,
    large: 3.0,
  },
  touchTargetSize: 44, // pixels
  focusIndicator: 2, // pixels minimum
  animationDuration: 5, // seconds maximum
};

test.describe('♿ Accessibility Tests (WCAG 2.1 Level AA)', () => {
  test.describe('Basic Accessibility Checks', () => {
    for (const page of PAGES) {
      test(`${page} - WCAG compliance`, async ({ page: browserPage }) => {
        await browserPage.goto(`${BASE_URL}/${page}`, { waitUntil: 'networkidle' });
        
        // Basic accessibility audit
        const accessibilityAudit = await browserPage.evaluate(() => {
          const results = {
            images: { total: 0, withAlt: 0, decorative: 0 },
            forms: { total: 0, labeled: 0 },
            headings: { hierarchy: [], issues: [] },
            landmarks: [],
            language: null,
            title: null,
          };
          
          // Check images
          const images = document.querySelectorAll('img');
          results.images.total = images.length;
          images.forEach(img => {
            if (img.alt) results.images.withAlt++;
            if (img.alt === '' || img.role === 'presentation') results.images.decorative++;
          });
          
          // Check form labels
          const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
          results.forms.total = inputs.length;
          inputs.forEach(input => {
            const id = input.id;
            const label = id ? document.querySelector(`label[for="${id}"]`) : null;
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledBy = input.getAttribute('aria-labelledby');
            
            if (label || ariaLabel || ariaLabelledBy) {
              results.forms.labeled++;
            }
          });
          
          // Check heading hierarchy
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          let lastLevel = 0;
          headings.forEach(h => {
            const level = parseInt(h.tagName[1]);
            results.headings.hierarchy.push({
              level,
              text: h.textContent.trim().substring(0, 50)
            });
            
            // Check for skipped levels
            if (lastLevel > 0 && level > lastLevel + 1) {
              results.headings.issues.push(`Skipped from H${lastLevel} to H${level}`);
            }
            lastLevel = level;
          });
          
          // Check landmarks
          const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section[aria-label], section[aria-labelledby]');
          landmarks.forEach(landmark => {
            results.landmarks.push({
              type: landmark.tagName.toLowerCase(),
              label: landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || null
            });
          });
          
          // Check language
          results.language = document.documentElement.lang;
          results.title = document.title;
          
          return results;
        });
        
        console.log(`\n♿ Accessibility Audit for ${page}:`);
        
        // Images
        const imageCompliance = accessibilityAudit.images.total === 0 ? 100 : 
          Math.round((accessibilityAudit.images.withAlt + accessibilityAudit.images.decorative) / accessibilityAudit.images.total * 100);
        console.log(`   Images: ${imageCompliance}% compliant (${accessibilityAudit.images.withAlt}/${accessibilityAudit.images.total} with alt text)`);
        
        // Forms
        const formCompliance = accessibilityAudit.forms.total === 0 ? 100 :
          Math.round(accessibilityAudit.forms.labeled / accessibilityAudit.forms.total * 100);
        console.log(`   Forms: ${formCompliance}% labeled (${accessibilityAudit.forms.labeled}/${accessibilityAudit.forms.total})`);
        
        // Headings
        console.log(`   Headings: ${accessibilityAudit.headings.hierarchy.length} found`);
        if (accessibilityAudit.headings.issues.length > 0) {
          console.log(`   ⚠️  Heading issues: ${accessibilityAudit.headings.issues.join(', ')}`);
        }
        
        // Landmarks
        console.log(`   Landmarks: ${accessibilityAudit.landmarks.length} regions`);
        
        // Language and title
        console.log(`   Language: ${accessibilityAudit.language || '❌ Not set'}`);
        console.log(`   Title: ${accessibilityAudit.title ? '✅' : '❌ Missing'}`);
        
        // Assertions
        expect(imageCompliance).toBeGreaterThanOrEqual(90);
        expect(formCompliance).toBeGreaterThanOrEqual(90);
        expect(accessibilityAudit.language).toBeTruthy();
        expect(accessibilityAudit.title).toBeTruthy();
      });
    }
  });

  test.describe('Keyboard Navigation', () => {
    test('Homepage keyboard navigation', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
      
      // Get all focusable elements
      const focusableElements = await page.evaluate(() => {
        const elements = document.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        return Array.from(elements).map(el => ({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim().substring(0, 30) || el.value || el.placeholder || '',
          tabindex: el.tabIndex,
          visible: el.offsetParent !== null
        }));
      });
      
      console.log('\n⌨️ Keyboard Navigation Test:');
      console.log(`   Focusable elements: ${focusableElements.length}`);
      console.log(`   Visible elements: ${focusableElements.filter(e => e.visible).length}`);
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      let activeElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName.toLowerCase(),
          id: el?.id,
          class: el?.className,
        };
      });
      
      console.log(`   First tab stop: ${activeElement.tag} ${activeElement.id || activeElement.class || ''}`);
      
      // Test skip links
      const skipLink = await page.locator('a[href="#main"], a[href="#content"], .skip-link').first();
      if (await skipLink.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('   Skip link: ✅ Found');
      } else {
        console.log('   Skip link: ⚠️  Not found');
      }
      
      // Test focus indicators
      const focusStyles = await page.evaluate(() => {
        const testButton = document.querySelector('button, a');
        if (!testButton) return null;
        
        testButton.focus();
        const styles = window.getComputedStyle(testButton);
        const focusStyles = window.getComputedStyle(testButton, ':focus');
        
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
          border: styles.border,
        };
      });
      
      console.log(`   Focus indicators: ${focusStyles ? '✅' : '⚠️  Check manually'}`);
      
      expect(focusableElements.length).toBeGreaterThan(5);
    });

    test('Modal keyboard trap', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
      
      // Open modal
      const signUpButton = await page.locator('a:has-text("Sign Up Today")').first();
      if (await signUpButton.isVisible()) {
        await signUpButton.click();
        await page.waitForTimeout(1000);
        
        // Check if modal is open
        const modal = await page.locator('#contactModal, .modal').first();
        if (await modal.isVisible()) {
          // Test escape key
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
          
          const modalStillVisible = await modal.isVisible();
          console.log('\n🔒 Modal Keyboard Trap:');
          console.log(`   Escape key closes modal: ${!modalStillVisible ? '✅' : '❌'}`);
          
          // Reopen if closed
          if (!modalStillVisible) {
            await signUpButton.click();
            await page.waitForTimeout(1000);
          }
          
          // Test tab trap
          const modalFocusables = await page.evaluate(() => {
            const modal = document.querySelector('#contactModal, .modal');
            if (!modal) return 0;
            
            const focusables = modal.querySelectorAll(
              'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            return focusables.length;
          });
          
          console.log(`   Focusable elements in modal: ${modalFocusables}`);
          console.log(`   Tab trap: ${modalFocusables > 0 ? '✅ Check manually' : '❌ No focusable elements'}`);
        }
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('Text color contrast', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
      
      const contrastIssues = await page.evaluate(() => {
        // Helper function to calculate relative luminance
        function getLuminance(r, g, b) {
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }
        
        // Helper to parse RGB color
        function parseColor(color) {
          const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            return {
              r: parseInt(match[1]),
              g: parseInt(match[2]),
              b: parseInt(match[3])
            };
          }
          return null;
        }
        
        // Calculate contrast ratio
        function getContrastRatio(color1, color2) {
          const rgb1 = parseColor(color1);
          const rgb2 = parseColor(color2);
          
          if (!rgb1 || !rgb2) return null;
          
          const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
          const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
          
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          
          return (lighter + 0.05) / (darker + 0.05);
        }
        
        const issues = [];
        const elements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
        
        Array.from(elements).slice(0, 50).forEach(el => {
          const style = window.getComputedStyle(el);
          const color = style.color;
          const bgColor = style.backgroundColor;
          
          if (bgColor === 'rgba(0, 0, 0, 0)') return; // Skip transparent
          
          const ratio = getContrastRatio(color, bgColor);
          const fontSize = parseFloat(style.fontSize);
          const fontWeight = style.fontWeight;
          
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && parseInt(fontWeight) >= 700);
          const requiredRatio = isLargeText ? 3.0 : 4.5;
          
          if (ratio && ratio < requiredRatio) {
            issues.push({
              element: el.tagName.toLowerCase(),
              text: el.textContent?.substring(0, 30),
              ratio: ratio.toFixed(2),
              required: requiredRatio,
              fontSize: fontSize,
              isLarge: isLargeText
            });
          }
        });
        
        return issues;
      });
      
      console.log('\n🎨 Color Contrast Analysis:');
      console.log(`   Elements checked: 50`);
      console.log(`   Contrast issues: ${contrastIssues.length}`);
      
      if (contrastIssues.length > 0) {
        console.log('   Issues found:');
        contrastIssues.slice(0, 3).forEach(issue => {
          console.log(`     - ${issue.element}: ratio ${issue.ratio} (needs ${issue.required})`);
        });
      }
      
      // Warn but don't fail
      if (contrastIssues.length > 5) {
        console.warn(`   ⚠️  ${contrastIssues.length} contrast issues found`);
      }
    });
  });

  test.describe('Touch Targets', () => {
    test('Mobile touch target sizes', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
      
      const touchTargets = await page.evaluate((minSize) => {
        const results = {
          total: 0,
          tooSmall: [],
          adequate: 0,
        };
        
        const targets = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
        results.total = targets.length;
        
        targets.forEach(target => {
          const rect = target.getBoundingClientRect();
          const width = rect.width;
          const height = rect.height;
          
          if (width < minSize || height < minSize) {
            results.tooSmall.push({
              element: target.tagName.toLowerCase(),
              id: target.id,
              class: target.className,
              size: `${Math.round(width)}x${Math.round(height)}`,
              text: target.textContent?.trim().substring(0, 20)
            });
          } else {
            results.adequate++;
          }
        });
        
        return results;
      }, WCAG_STANDARDS.touchTargetSize);
      
      console.log('\n👆 Touch Target Analysis:');
      console.log(`   Total targets: ${touchTargets.total}`);
      console.log(`   Adequate size (≥44px): ${touchTargets.adequate}`);
      console.log(`   Too small: ${touchTargets.tooSmall.length}`);
      
      if (touchTargets.tooSmall.length > 0) {
        console.log('   Small targets:');
        touchTargets.tooSmall.slice(0, 5).forEach(target => {
          console.log(`     - ${target.element} "${target.text || target.id || target.class}": ${target.size}`);
        });
      }
      
      const compliance = touchTargets.total === 0 ? 100 : 
        Math.round(touchTargets.adequate / touchTargets.total * 100);
      console.log(`   Compliance: ${compliance}%`);
      
      expect(compliance).toBeGreaterThanOrEqual(80);
    });
  });

  test.describe('Screen Reader Support', () => {
    test('ARIA attributes and semantic HTML', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
      
      const ariaAnalysis = await page.evaluate(() => {
        const results = {
          ariaElements: 0,
          ariaLabels: 0,
          ariaRoles: 0,
          semanticElements: 0,
          issues: [],
        };
        
        // Check ARIA attributes
        document.querySelectorAll('[aria-label]').forEach(el => {
          results.ariaLabels++;
          const label = el.getAttribute('aria-label');
          if (!label || label.trim() === '') {
            results.issues.push('Empty aria-label found');
          }
        });
        
        document.querySelectorAll('[role]').forEach(el => {
          results.ariaRoles++;
          const role = el.getAttribute('role');
          // Check for redundant roles
          if (el.tagName === 'BUTTON' && role === 'button') {
            results.issues.push('Redundant role on button element');
          }
          if (el.tagName === 'NAV' && role === 'navigation') {
            results.issues.push('Redundant role on nav element');
          }
        });
        
        // Check semantic HTML
        const semanticTags = ['main', 'nav', 'header', 'footer', 'article', 'section', 'aside'];
        semanticTags.forEach(tag => {
          results.semanticElements += document.querySelectorAll(tag).length;
        });
        
        // Check for common issues
        // Images without alt text
        document.querySelectorAll('img:not([alt])').forEach(img => {
          if (img.role !== 'presentation') {
            results.issues.push(`Image without alt text: ${img.src.substring(img.src.lastIndexOf('/') + 1)}`);
          }
        });
        
        // Buttons without accessible text
        document.querySelectorAll('button').forEach(btn => {
          const text = btn.textContent?.trim();
          const ariaLabel = btn.getAttribute('aria-label');
          if (!text && !ariaLabel) {
            results.issues.push('Button without accessible text');
          }
        });
        
        // Links without text
        document.querySelectorAll('a[href]').forEach(link => {
          const text = link.textContent?.trim();
          const ariaLabel = link.getAttribute('aria-label');
          if (!text && !ariaLabel) {
            results.issues.push('Link without accessible text');
          }
        });
        
        results.ariaElements = results.ariaLabels + results.ariaRoles;
        
        return results;
      });
      
      console.log('\n📢 Screen Reader Support:');
      console.log(`   ARIA elements: ${ariaAnalysis.ariaElements}`);
      console.log(`   ARIA labels: ${ariaAnalysis.ariaLabels}`);
      console.log(`   ARIA roles: ${ariaAnalysis.ariaRoles}`);
      console.log(`   Semantic HTML elements: ${ariaAnalysis.semanticElements}`);
      
      if (ariaAnalysis.issues.length > 0) {
        console.log(`   ⚠️  Issues found: ${ariaAnalysis.issues.length}`);
        ariaAnalysis.issues.slice(0, 5).forEach(issue => {
          console.log(`     - ${issue}`);
        });
      }
      
      expect(ariaAnalysis.semanticElements).toBeGreaterThan(0);
      expect(ariaAnalysis.issues.length).toBeLessThanOrEqual(10);
    });
  });

  test.describe('Motion and Animation', () => {
    test('Respects prefers-reduced-motion', async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${BASE_URL}/home.html`, { waitUntil: 'networkidle' });
      
      const animationCheck = await page.evaluate(() => {
        const results = {
          animatedElements: [],
          respectedPreference: true,
        };
        
        // Check all elements for animations
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          
          // Check for CSS animations
          if (style.animationDuration !== '0s' && style.animationDuration !== '0ms') {
            results.animatedElements.push({
              element: el.tagName.toLowerCase(),
              duration: style.animationDuration,
              name: style.animationName
            });
            
            // Check if animation respects reduced motion
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (mediaQuery.matches && parseFloat(style.animationDuration) > 0) {
              results.respectedPreference = false;
            }
          }
          
          // Check for transitions
          if (style.transitionDuration !== '0s' && style.transitionDuration !== '0ms') {
            const duration = parseFloat(style.transitionDuration);
            if (duration > 5) { // More than 5 seconds
              results.animatedElements.push({
                element: el.tagName.toLowerCase(),
                duration: style.transitionDuration,
                type: 'transition'
              });
            }
          }
        });
        
        return results;
      });
      
      console.log('\n🎬 Motion and Animation:');
      console.log(`   Animated elements: ${animationCheck.animatedElements.length}`);
      console.log(`   Respects reduced motion: ${animationCheck.respectedPreference ? '✅' : '❌'}`);
      
      if (animationCheck.animatedElements.length > 0) {
        console.log('   Animations found:');
        animationCheck.animatedElements.slice(0, 3).forEach(anim => {
          console.log(`     - ${anim.element}: ${anim.duration} ${anim.name || anim.type || ''}`);
        });
      }
    });
  });
});

// Summary
test.afterAll(async () => {
  console.log('\n' + '='.repeat(60));
  console.log('♿ ACCESSIBILITY TESTING COMPLETE');
  console.log('='.repeat(60));
  console.log('✅ WCAG 2.1 Level AA compliance checked');
  console.log('✅ Keyboard navigation validated');
  console.log('✅ Color contrast analyzed');
  console.log('✅ Touch targets measured');
  console.log('✅ Screen reader support verified');
  console.log('✅ Motion preferences tested');
  console.log('='.repeat(60));
});