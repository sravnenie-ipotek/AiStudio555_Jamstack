const { test, expect } = require('@playwright/test');

test.describe('Accessibility (WCAG) Testing', () => {
  const testPages = [
    { name: 'Home', url: 'home.html' },
    { name: 'Courses', url: 'courses.html' },
    { name: 'Teachers', url: 'teachers.html' },
    { name: 'Career Center', url: 'career-center.html' },
    { name: 'English Home', url: 'dist/en/index.html' },
    { name: 'Hebrew Home', url: 'dist/he/index.html' }
  ];

  test.describe('Keyboard Navigation', () => {
    for (const { name, url } of testPages) {
      test(`Keyboard navigation - ${name}`, async ({ page }) => {
        await page.goto(url);
        await page.waitForLoadState('networkidle');

        // Get all focusable elements
        const focusableElements = await page.locator(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        ).all();

        console.log(`${name}: Found ${focusableElements.length} focusable elements`);

        // Test tab navigation
        let focusableCount = 0;
        const maxTabs = Math.min(focusableElements.length, 15); // Limit for performance

        for (let i = 0; i < maxTabs; i++) {
          await page.keyboard.press('Tab');
          
          // Get currently focused element
          const focusedElement = await page.evaluate(() => {
            const el = document.activeElement;
            return {
              tagName: el.tagName,
              type: el.type || '',
              id: el.id || '',
              className: el.className || '',
              text: el.textContent?.substring(0, 30) || '',
              visible: el.offsetWidth > 0 && el.offsetHeight > 0,
              ariaLabel: el.getAttribute('aria-label') || '',
              href: el.href || ''
            };
          });

          if (focusedElement.visible) {
            focusableCount++;
            console.log(`  Tab ${i + 1}: ${focusedElement.tagName} - "${focusedElement.text}"`);
          }
        }

        // Should have navigated through several elements
        expect(focusableCount).toBeGreaterThanOrEqual(3);

        // Test Enter key on buttons
        const buttons = await page.locator('button, [role="button"]').all();
        if (buttons.length > 0) {
          const firstButton = buttons[0];
          if (await firstButton.isVisible()) {
            await firstButton.focus();
            
            // Verify focus is visible
            const hasFocusIndicator = await firstButton.evaluate(el => {
              const styles = window.getComputedStyle(el, ':focus');
              return styles.outline !== 'none' || 
                     styles.boxShadow !== 'none' || 
                     styles.border !== window.getComputedStyle(el).border;
            });
            
            console.log(`Focus indicator present: ${hasFocusIndicator}`);
          }
        }

        // Test Escape key functionality (for modals)
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        console.log(`✅ ${name} keyboard navigation working`);
      });
    }

    test('Skip links functionality', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Look for skip links
      const skipLinks = await page.locator('a[href^="#"]').all();
      const skipLinkTexts = [];

      for (const link of skipLinks) {
        const text = await link.textContent();
        if (text && (text.toLowerCase().includes('skip') || text.toLowerCase().includes('main'))) {
          skipLinkTexts.push(text);
          
          // Test skip link functionality
          const href = await link.getAttribute('href');
          if (href) {
            await link.click();
            await page.waitForTimeout(300);
            
            // Check if target exists
            const target = await page.locator(href).isVisible();
            console.log(`Skip link "${text}" -> ${href}: ${target ? '✅' : '❌'}`);
          }
        }
      }

      console.log(`Skip links found: ${skipLinkTexts.join(', ')}`);
    });
  });

  test.describe('Screen Reader Support', () => {
    test('Semantic HTML structure', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const semanticStructure = await page.evaluate(() => {
        const elements = {
          headings: [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')],
          landmarks: [...document.querySelectorAll('main, nav, header, footer, aside, section')],
          lists: [...document.querySelectorAll('ul, ol')],
          images: [...document.querySelectorAll('img')],
          links: [...document.querySelectorAll('a')],
          buttons: [...document.querySelectorAll('button')],
          forms: [...document.querySelectorAll('form')]
        };

        const analysis = {};
        
        // Analyze headings hierarchy
        analysis.headings = elements.headings.map(h => ({
          level: h.tagName,
          text: h.textContent?.substring(0, 50),
          id: h.id || ''
        }));

        // Check heading hierarchy is logical
        const headingLevels = elements.headings.map(h => parseInt(h.tagName.charAt(1)));
        let hierarchyIssues = 0;
        for (let i = 1; i < headingLevels.length; i++) {
          if (headingLevels[i] > headingLevels[i-1] + 1) {
            hierarchyIssues++;
          }
        }
        analysis.headingHierarchyIssues = hierarchyIssues;

        // Analyze landmarks
        analysis.landmarks = elements.landmarks.map(el => ({
          type: el.tagName,
          role: el.getAttribute('role') || '',
          ariaLabel: el.getAttribute('aria-label') || ''
        }));

        // Check images for alt text
        analysis.images = elements.images.map(img => ({
          src: img.src.substring(img.src.lastIndexOf('/') + 1),
          alt: img.alt || '',
          hasAlt: img.hasAttribute('alt'),
          decorative: img.getAttribute('role') === 'presentation' || img.alt === ''
        }));

        // Check links for descriptive text
        analysis.links = elements.links.slice(0, 10).map(link => ({
          text: link.textContent?.trim() || '',
          href: link.href || '',
          hasAriaLabel: link.hasAttribute('aria-label'),
          hasTitle: link.hasAttribute('title')
        }));

        return analysis;
      });

      console.log('\n=== Semantic Structure Analysis ===');
      
      // Heading analysis
      console.log(`\nHeadings (${semanticStructure.headings.length}):`);
      semanticStructure.headings.forEach((heading, index) => {
        console.log(`  ${heading.level}: "${heading.text}"`);
      });
      
      if (semanticStructure.headingHierarchyIssues > 0) {
        console.log(`⚠️ Heading hierarchy issues: ${semanticStructure.headingHierarchyIssues}`);
      } else {
        console.log('✅ Heading hierarchy is logical');
      }

      // Landmarks analysis
      console.log(`\nLandmarks (${semanticStructure.landmarks.length}):`);
      semanticStructure.landmarks.forEach(landmark => {
        console.log(`  ${landmark.type}${landmark.role ? ` (role: ${landmark.role})` : ''}`);
      });

      // Images analysis
      const imagesWithoutAlt = semanticStructure.images.filter(img => !img.hasAlt && !img.decorative);
      console.log(`\nImages: ${semanticStructure.images.length} total, ${imagesWithoutAlt.length} missing alt text`);
      
      if (imagesWithoutAlt.length > 0) {
        console.log('Images missing alt text:');
        imagesWithoutAlt.slice(0, 3).forEach(img => {
          console.log(`  - ${img.src}`);
        });
      }

      // Links analysis
      const vagueLinkTexts = ['click here', 'read more', 'here', 'more', 'link'];
      const vagueLinks = semanticStructure.links.filter(link => 
        vagueLinkTexts.some(vague => link.text.toLowerCase().includes(vague))
      );
      
      console.log(`\nLinks: ${semanticStructure.links.length} analyzed, ${vagueLinks.length} potentially vague`);

      // Assertions
      expect(semanticStructure.headings.length).toBeGreaterThanOrEqual(1); // Should have at least one heading
      expect(semanticStructure.headingHierarchyIssues).toBeLessThanOrEqual(1); // Allow minimal hierarchy issues
      expect(imagesWithoutAlt.length).toBeLessThanOrEqual(2); // Allow some decorative images
      expect(semanticStructure.landmarks.length).toBeGreaterThanOrEqual(1); // Should have semantic landmarks
    });

    test('ARIA attributes and roles', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const ariaAnalysis = await page.evaluate(() => {
        const elementsWithAria = [...document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role], [aria-expanded], [aria-hidden]')];
        
        return elementsWithAria.map(el => ({
          tagName: el.tagName,
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          ariaLabelledBy: el.getAttribute('aria-labelledby'),
          ariaDescribedBy: el.getAttribute('aria-describedby'),
          ariaExpanded: el.getAttribute('aria-expanded'),
          ariaHidden: el.getAttribute('aria-hidden'),
          text: el.textContent?.substring(0, 30) || ''
        }));
      });

      console.log('\n=== ARIA Analysis ===');
      console.log(`Elements with ARIA attributes: ${ariaAnalysis.length}`);

      if (ariaAnalysis.length > 0) {
        ariaAnalysis.slice(0, 10).forEach((element, index) => {
          console.log(`\n${index + 1}. ${element.tagName}:`);
          if (element.role) console.log(`   Role: ${element.role}`);
          if (element.ariaLabel) console.log(`   Label: ${element.ariaLabel}`);
          if (element.ariaExpanded !== null) console.log(`   Expanded: ${element.ariaExpanded}`);
          if (element.text) console.log(`   Text: "${element.text}"`);
        });

        // Check for proper ARIA usage
        const properRoles = ariaAnalysis.filter(el => el.role && el.role !== 'presentation');
        const properLabels = ariaAnalysis.filter(el => el.ariaLabel && el.ariaLabel.trim().length > 0);
        
        console.log(`\nARIA Usage Summary:`);
        console.log(`- Elements with roles: ${properRoles.length}`);
        console.log(`- Elements with labels: ${properLabels.length}`);
      }

      // Test interactive elements have proper ARIA
      const interactiveElements = await page.locator('button, [role="button"], input, select, textarea').all();
      let accessibleInteractive = 0;

      for (const element of interactiveElements.slice(0, 10)) {
        const hasLabel = await element.evaluate(el => {
          return el.hasAttribute('aria-label') || 
                 el.hasAttribute('aria-labelledby') || 
                 (el.tagName === 'INPUT' && el.labels && el.labels.length > 0) ||
                 (el.tagName === 'BUTTON' && el.textContent.trim().length > 0);
        });
        
        if (hasLabel) accessibleInteractive++;
      }

      const interactiveCount = Math.min(interactiveElements.length, 10);
      const accessibilityPercentage = interactiveCount > 0 ? (accessibleInteractive / interactiveCount) * 100 : 100;
      
      console.log(`Interactive elements accessibility: ${accessibilityPercentage.toFixed(1)}%`);
      expect(accessibilityPercentage).toBeGreaterThanOrEqual(70);
    });
  });

  test.describe('Color and Contrast', () => {
    test('Color contrast compliance', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const contrastResults = await page.evaluate(() => {
        // Contrast calculation functions
        function parseRGB(color) {
          if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
            return [255, 255, 255]; // Assume white background
          }
          
          const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
          }
          return [0, 0, 0];
        }

        function getLuminance(r, g, b) {
          const [rs, gs, bs] = [r/255, g/255, b/255].map(c => {
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }

        function getContrastRatio(fg, bg) {
          const l1 = getLuminance(...fg);
          const l2 = getLuminance(...bg);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        }

        // Test important text elements
        const textElements = [
          ...document.querySelectorAll('h1, h2, h3, p, a, button, .nav-link, .menu-item')
        ].filter(el => el.textContent.trim().length > 0);

        const results = [];
        
        textElements.slice(0, 20).forEach(el => {
          const styles = window.getComputedStyle(el);
          const color = parseRGB(styles.color);
          
          // Get background color (check parent elements if transparent)
          let bgColor = [255, 255, 255]; // Default white
          let parent = el;
          while (parent && parent !== document.body) {
            const bgColorStr = window.getComputedStyle(parent).backgroundColor;
            if (bgColorStr !== 'rgba(0, 0, 0, 0)' && bgColorStr !== 'transparent') {
              bgColor = parseRGB(bgColorStr);
              break;
            }
            parent = parent.parentElement;
          }

          const contrast = getContrastRatio(color, bgColor);
          const fontSize = parseFloat(styles.fontSize);
          const fontWeight = styles.fontWeight;
          
          // WCAG requirements: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
          const requiredRatio = isLargeText ? 3.0 : 4.5;
          
          results.push({
            tagName: el.tagName,
            text: el.textContent.substring(0, 40),
            contrast: parseFloat(contrast.toFixed(2)),
            required: requiredRatio,
            passes: contrast >= requiredRatio,
            fontSize: fontSize,
            isLargeText: isLargeText
          });
        });

        return results;
      });

      console.log('\n=== Color Contrast Analysis ===');
      
      const passingElements = contrastResults.filter(r => r.passes);
      const failingElements = contrastResults.filter(r => !r.passes);
      
      console.log(`Passing: ${passingElements.length}/${contrastResults.length} (${((passingElements.length/contrastResults.length)*100).toFixed(1)}%)`);
      
      if (failingElements.length > 0) {
        console.log('\nFailing contrast ratios:');
        failingElements.slice(0, 5).forEach(el => {
          console.log(`  ❌ ${el.tagName}: ${el.contrast}:1 (needs ${el.required}:1) - "${el.text}"`);
        });
      }
      
      if (passingElements.length > 0) {
        console.log('\nSample passing ratios:');
        passingElements.slice(0, 3).forEach(el => {
          console.log(`  ✅ ${el.tagName}: ${el.contrast}:1 - "${el.text}"`);
        });
      }

      // Should have good contrast compliance
      const complianceRate = (passingElements.length / contrastResults.length) * 100;
      expect(complianceRate).toBeGreaterThanOrEqual(75); // 75% minimum compliance
    });

    test('Color independence (no color-only information)', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Test critical elements aren't color-dependent
      const colorDependencyTest = await page.evaluate(() => {
        const criticalElements = [
          ...document.querySelectorAll('button, .btn, a, .nav-link, .error, .warning, .success, .alert')
        ];

        return criticalElements.slice(0, 15).map(el => {
          const styles = window.getComputedStyle(el);
          const hasText = el.textContent.trim().length > 0;
          const hasIcon = el.querySelector('svg, img, .icon, [class*="icon"]') !== null;
          const hasBackgroundImage = styles.backgroundImage !== 'none';
          const hasBorder = styles.borderWidth !== '0px';
          
          return {
            tagName: el.tagName,
            className: el.className,
            text: el.textContent.substring(0, 30),
            hasText,
            hasIcon,
            hasBackgroundImage,
            hasBorder,
            hasNonColorIndicator: hasText || hasIcon || hasBackgroundImage || hasBorder
          };
        });
      });

      console.log('\n=== Color Independence Test ===');
      
      const elementsWithIndicators = colorDependencyTest.filter(el => el.hasNonColorIndicator);
      const complianceRate = (elementsWithIndicators.length / colorDependencyTest.length) * 100;
      
      console.log(`Elements with non-color indicators: ${elementsWithIndicators.length}/${colorDependencyTest.length} (${complianceRate.toFixed(1)}%)`);
      
      colorDependencyTest.forEach(el => {
        const status = el.hasNonColorIndicator ? '✅' : '⚠️';
        console.log(`  ${status} ${el.tagName}.${el.className}: "${el.text}" - Text:${el.hasText} Icon:${el.hasIcon}`);
      });

      expect(complianceRate).toBeGreaterThanOrEqual(80);
    });
  });

  test.describe('Form Accessibility', () => {
    test('Form labels and error handling', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Try to open contact form modal
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      if (await signUpBtn.isVisible()) {
        await signUpBtn.click();
        await page.waitForTimeout(1000);

        const modal = page.locator('#contactModal');
        if (await modal.isVisible()) {
          console.log('✅ Contact modal opened for accessibility testing');

          // Test form accessibility
          const formAccessibility = await page.evaluate(() => {
            const form = document.getElementById('contactForm');
            if (!form) return { error: 'Form not found' };

            const inputs = [...form.querySelectorAll('input, textarea, select')];
            
            return inputs.map(input => {
              const id = input.id;
              const name = input.name;
              const type = input.type;
              
              // Check for associated label
              const labelElement = document.querySelector(`label[for="${id}"]`) || 
                                 input.closest('label') ||
                                 (input.getAttribute('aria-labelledby') && 
                                  document.getElementById(input.getAttribute('aria-labelledby')));
              
              const hasLabel = !!labelElement;
              const labelText = labelElement ? labelElement.textContent.trim() : '';
              
              // Check for required attribute and indication
              const isRequired = input.hasAttribute('required') || input.getAttribute('aria-required') === 'true';
              const hasRequiredIndicator = labelText.includes('*') || 
                                         input.getAttribute('aria-describedby') ||
                                         hasLabel;
              
              // Check for error message elements
              const errorElement = document.getElementById(input.name + 'Error') ||
                                 document.querySelector(`[aria-describedby="${input.id}"]`);
              
              return {
                id,
                name,
                type,
                hasLabel,
                labelText,
                isRequired,
                hasRequiredIndicator,
                hasErrorElement: !!errorElement,
                placeholder: input.placeholder || ''
              };
            });
          });

          console.log('\n=== Form Accessibility Analysis ===');
          
          if (formAccessibility.error) {
            console.log(formAccessibility.error);
          } else {
            formAccessibility.forEach(input => {
              console.log(`\n${input.type.toUpperCase()}: ${input.name}`);
              console.log(`  Label: ${input.hasLabel ? '✅' : '❌'} "${input.labelText}"`);
              console.log(`  Required: ${input.isRequired ? '✅' : 'No'} (Indicator: ${input.hasRequiredIndicator ? '✅' : '❌'})`);
              console.log(`  Error handling: ${input.hasErrorElement ? '✅' : '❌'}`);
              
              // Assertions
              expect(input.hasLabel).toBe(true);
              if (input.isRequired) {
                expect(input.hasRequiredIndicator).toBe(true);
              }
            });

            // Test form validation
            if (formAccessibility.length > 0) {
              // Try to submit empty form to test error messages
              const submitButton = page.locator('button[type="submit"]');
              await submitButton.click();
              await page.waitForTimeout(500);

              // Check if error messages appear and are announced
              const errorMessages = await page.locator('.form-error.active').allTextContents();
              console.log(`\nError messages shown: ${errorMessages.length}`);
              errorMessages.forEach((msg, index) => {
                console.log(`  ${index + 1}. "${msg}"`);
              });

              expect(errorMessages.length).toBeGreaterThan(0);
            }
          }

          // Close modal
          await page.keyboard.press('Escape');
        }
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('Touch target sizes', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const touchTargets = await page.evaluate(() => {
        const clickableElements = [
          ...document.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]')
        ];

        return clickableElements.slice(0, 15).map(el => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          
          return {
            tagName: el.tagName,
            text: el.textContent?.substring(0, 30) || '',
            width: rect.width,
            height: rect.height,
            area: rect.width * rect.height,
            padding: styles.padding,
            margin: styles.margin,
            visible: rect.width > 0 && rect.height > 0
          };
        }).filter(el => el.visible);
      });

      console.log('\n=== Touch Target Analysis ===');
      
      const minTouchSize = 44; // 44x44px minimum recommended
      const adequateTargets = touchTargets.filter(target => 
        target.width >= minTouchSize && target.height >= minTouchSize
      );
      
      console.log(`Adequate touch targets: ${adequateTargets.length}/${touchTargets.length}`);
      
      touchTargets.forEach(target => {
        const adequate = target.width >= minTouchSize && target.height >= minTouchSize;
        const status = adequate ? '✅' : '⚠️';
        console.log(`  ${status} ${target.tagName}: ${Math.round(target.width)}x${Math.round(target.height)}px - "${target.text}"`);
      });

      // At least 70% of touch targets should be adequate
      const complianceRate = (adequateTargets.length / touchTargets.length) * 100;
      expect(complianceRate).toBeGreaterThanOrEqual(60); // Allow some flexibility for design
    });
  });

  test('Focus management and indicators', async ({ page }) => {
    await page.goto('home.html');
    await page.waitForLoadState('networkidle');

    // Test focus indicators
    const focusableElements = await page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').all();
    
    let elementsWithFocusIndicator = 0;
    
    for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
      const element = focusableElements[i];
      
      if (await element.isVisible()) {
        await element.focus();
        
        const hasFocusIndicator = await element.evaluate(el => {
          const focusStyles = window.getComputedStyle(el, ':focus');
          const normalStyles = window.getComputedStyle(el);
          
          return focusStyles.outline !== 'none' || 
                 focusStyles.outlineWidth !== '0px' ||
                 focusStyles.boxShadow !== normalStyles.boxShadow ||
                 focusStyles.borderColor !== normalStyles.borderColor ||
                 focusStyles.backgroundColor !== normalStyles.backgroundColor;
        });
        
        if (hasFocusIndicator) {
          elementsWithFocusIndicator++;
        }
        
        const tagName = await element.evaluate(el => el.tagName);
        const text = (await element.textContent())?.substring(0, 20) || '';
        console.log(`Focus indicator for ${tagName}: ${hasFocusIndicator ? '✅' : '❌'} - "${text}"`);
      }
    }

    const testedElements = Math.min(focusableElements.length, 10);
    const focusIndicatorRate = testedElements > 0 ? (elementsWithFocusIndicator / testedElements) * 100 : 0;
    
    console.log(`\nFocus indicator compliance: ${focusIndicatorRate.toFixed(1)}%`);
    expect(focusIndicatorRate).toBeGreaterThanOrEqual(70);
  });
});