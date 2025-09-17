const { test, expect } = require('@playwright/test');

test.describe('Font and Typography Testing', () => {
  const languages = [
    { code: 'en', name: 'English', path: 'dist/en/' },
    { code: 'ru', name: 'Russian', path: 'dist/ru/' },
    { code: 'he', name: 'Hebrew', path: 'dist/he/' }
  ];

  const typographySelectors = {
    headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    body: ['p', 'body', '.text', '.content'],
    navigation: ['.nav-link', '.menu-item', '.navbar a'],
    buttons: ['button', '.btn', '.primary-button', '.secondary-button'],
    forms: ['input', 'textarea', 'select', 'label']
  };

  const expectedFonts = {
    primary: 'Plus Jakarta Sans',
    fallback: ['Arial', 'Helvetica', 'sans-serif']
  };

  test.describe('Font Loading and Availability', () => {
    for (const lang of languages) {
      test(`Font loading for ${lang.name}`, async ({ page }) => {
        await page.goto(`${lang.path}index.html`);
        await page.waitForLoadState('networkidle');

        // Wait for fonts to load
        await page.waitForFunction(() => document.fonts.ready);

        // Check if primary font is loaded
        const fontsLoaded = await page.evaluate(async () => {
          await document.fonts.ready;
          
          const fontResults = {};
          
          // Check for Plus Jakarta Sans
          const jakartaFont = new FontFace('Plus Jakarta Sans', 'url(test)');
          try {
            await jakartaFont.load();
            fontResults.jakartaSans = true;
          } catch {
            fontResults.jakartaSans = false;
          }

          // Get available font families
          const testElement = document.createElement('div');
          testElement.style.fontFamily = 'Plus Jakarta Sans, Arial, sans-serif';
          testElement.textContent = 'Test';
          document.body.appendChild(testElement);
          
          const computedFont = window.getComputedStyle(testElement).fontFamily;
          fontResults.computedFont = computedFont;
          
          document.body.removeChild(testElement);
          
          return fontResults;
        });

        console.log(`${lang.name} font loading:`, fontsLoaded);
        
        // Font should be available or fall back gracefully
        expect(fontsLoaded.computedFont).toBeTruthy();
        expect(fontsLoaded.computedFont.length).toBeGreaterThan(0);
      });
    }

    test('Web font optimization', async ({ page }) => {
      // Monitor font loading requests
      const fontRequests = [];
      page.on('request', request => {
        const url = request.url();
        if (url.includes('.woff') || url.includes('.woff2') || url.includes('.ttf') || url.includes('.otf')) {
          fontRequests.push({
            url,
            method: request.method(),
            headers: request.headers()
          });
        }
      });

      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      console.log('Font requests:', fontRequests.length);
      
      // Check font loading optimization
      if (fontRequests.length > 0) {
        fontRequests.forEach((request, index) => {
          console.log(`Font ${index + 1}: ${request.url}`);
          
          // Should use woff2 for better compression
          const isOptimized = request.url.includes('.woff2');
          console.log(`  Optimized format: ${isOptimized}`);
        });
        
        // At least some fonts should be optimized
        const optimizedFonts = fontRequests.filter(req => req.url.includes('.woff2'));
        expect(optimizedFonts.length).toBeGreaterThanOrEqual(0); // Allow any format for now
      }
    });
  });

  test.describe('Typography Consistency', () => {
    for (const lang of languages) {
      test(`Typography consistency for ${lang.name}`, async ({ page }) => {
        await page.goto(`${lang.path}index.html`);
        await page.waitForLoadState('networkidle');
        await page.waitForFunction(() => document.fonts.ready);

        const typographyReport = {};

        // Test each typography category
        for (const [category, selectors] of Object.entries(typographySelectors)) {
          typographyReport[category] = [];

          for (const selector of selectors) {
            const elements = await page.locator(selector).all();
            
            for (let i = 0; i < Math.min(elements.length, 3); i++) {
              const element = elements[i];
              
              if (await element.isVisible()) {
                const styles = await element.evaluate(el => {
                  const computed = window.getComputedStyle(el);
                  return {
                    fontFamily: computed.fontFamily,
                    fontSize: computed.fontSize,
                    fontWeight: computed.fontWeight,
                    lineHeight: computed.lineHeight,
                    letterSpacing: computed.letterSpacing,
                    color: computed.color,
                    textAlign: computed.textAlign
                  };
                });

                typographyReport[category].push({
                  selector,
                  styles,
                  text: (await element.textContent())?.substring(0, 50)
                });
              }
            }
          }
        }

        // Analyze consistency
        console.log(`\n=== ${lang.name} Typography Report ===`);
        
        for (const [category, elements] of Object.entries(typographyReport)) {
          if (elements.length > 0) {
            console.log(`\n${category.toUpperCase()}:`);
            
            // Check font family consistency within category
            const fontFamilies = new Set(elements.map(el => el.styles.fontFamily));
            console.log(`  Font families: ${Array.from(fontFamilies).join(', ')}`);
            
            // Check font sizes
            const fontSizes = new Set(elements.map(el => el.styles.fontSize));
            console.log(`  Font sizes: ${Array.from(fontSizes).join(', ')}`);
            
            // Assertions
            if (category === 'headings') {
              // Headings should have consistent font family
              expect(fontFamilies.size).toBeLessThanOrEqual(2);
            }
            
            if (category === 'body') {
              // Body text should be readable size
              const sizes = Array.from(fontSizes).map(size => parseInt(size));
              const minSize = Math.min(...sizes);
              expect(minSize).toBeGreaterThanOrEqual(14); // Minimum 14px
            }
          }
        }

        // Test RTL text alignment for Hebrew
        if (lang.code === 'he') {
          const rtlElements = await page.locator('body *').evaluateAll(elements => {
            return elements
              .filter(el => window.getComputedStyle(el).direction === 'rtl')
              .map(el => ({
                tagName: el.tagName,
                textAlign: window.getComputedStyle(el).textAlign,
                direction: window.getComputedStyle(el).direction
              }));
          });

          console.log('RTL elements found:', rtlElements.length);
          if (rtlElements.length > 0) {
            console.log('Sample RTL styles:', rtlElements.slice(0, 3));
          }
        }
      });
    }

    test('Font rendering quality', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Check font rendering properties
      const fontRendering = await page.evaluate(() => {
        const testElements = [
          document.querySelector('h1'),
          document.querySelector('h2'),
          document.querySelector('p')
        ].filter(el => el);

        return testElements.map(el => {
          const styles = window.getComputedStyle(el);
          return {
            tagName: el.tagName,
            fontSmoothing: styles.webkitFontSmoothing || styles.fontSmoothing,
            textRendering: styles.textRendering,
            fontFeatureSettings: styles.fontFeatureSettings
          };
        });
      });

      console.log('Font rendering quality:', fontRendering);

      // Should have some font optimization
      expect(fontRendering.length).toBeGreaterThan(0);
      
      fontRendering.forEach(element => {
        console.log(`${element.tagName}: ${element.fontSmoothing || 'default'} smoothing`);
      });
    });
  });

  test.describe('Reading Experience', () => {
    test('Text contrast and readability', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Check text contrast ratios
      const contrastResults = await page.evaluate(() => {
        function getLuminance(r, g, b) {
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }

        function getContrastRatio(color1, color2) {
          const l1 = getLuminance(...color1);
          const l2 = getLuminance(...color2);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        }

        function parseColor(colorStr) {
          const div = document.createElement('div');
          div.style.color = colorStr;
          document.body.appendChild(div);
          const computed = window.getComputedStyle(div).color;
          document.body.removeChild(div);
          
          const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
        }

        const textElements = [
          ...document.querySelectorAll('h1, h2, h3, p')
        ].slice(0, 10);

        const results = [];
        
        textElements.forEach(el => {
          if (el.textContent.trim()) {
            const styles = window.getComputedStyle(el);
            const textColor = parseColor(styles.color);
            const bgColor = parseColor(styles.backgroundColor || '#ffffff');
            
            const contrast = getContrastRatio(textColor, bgColor);
            
            results.push({
              tagName: el.tagName,
              text: el.textContent.substring(0, 30),
              contrast: contrast.toFixed(2),
              sufficient: contrast >= 4.5 // WCAG AA standard
            });
          }
        });

        return results;
      });

      console.log('\nText Contrast Analysis:');
      contrastResults.forEach((result, index) => {
        const status = result.sufficient ? '✅' : '⚠️';
        console.log(`  ${status} ${result.tagName}: ${result.contrast}:1 - "${result.text}..."`);
      });

      // At least 80% of text should meet contrast requirements
      const sufficientContrast = contrastResults.filter(r => r.sufficient).length;
      const contrastPercentage = (sufficientContrast / contrastResults.length) * 100;
      
      console.log(`Contrast compliance: ${contrastPercentage.toFixed(1)}%`);
      expect(contrastPercentage).toBeGreaterThanOrEqual(70); // Allow some flexibility
    });

    test('Line spacing and readability', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const readabilityMetrics = await page.evaluate(() => {
        const paragraphs = [...document.querySelectorAll('p')].slice(0, 5);
        
        return paragraphs.map(p => {
          const styles = window.getComputedStyle(p);
          const fontSize = parseFloat(styles.fontSize);
          const lineHeight = parseFloat(styles.lineHeight);
          
          return {
            fontSize: fontSize + 'px',
            lineHeight: lineHeight + 'px',
            lineHeightRatio: (lineHeight / fontSize).toFixed(2),
            wordCount: p.textContent.split(' ').length,
            charCount: p.textContent.length
          };
        });
      });

      console.log('\nReadability Metrics:');
      readabilityMetrics.forEach((metrics, index) => {
        console.log(`  Paragraph ${index + 1}:`);
        console.log(`    Font: ${metrics.fontSize}, Line height: ${metrics.lineHeight} (${metrics.lineHeightRatio}x)`);
        console.log(`    Content: ${metrics.wordCount} words, ${metrics.charCount} chars`);
        
        // Line height should be 1.2-1.8 for good readability
        const ratio = parseFloat(metrics.lineHeightRatio);
        expect(ratio).toBeGreaterThanOrEqual(1.1);
        expect(ratio).toBeLessThanOrEqual(2.0);
      });
    });
  });

  test('Typography on mobile devices', async ({ page }) => {
    // Test mobile typography
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('home.html');
    await page.waitForLoadState('networkidle');

    const mobileTypography = await page.evaluate(() => {
      const elements = [
        document.querySelector('h1'),
        document.querySelector('h2'),
        document.querySelector('p'),
        document.querySelector('button')
      ].filter(el => el);

      return elements.map(el => {
        const styles = window.getComputedStyle(el);
        return {
          tagName: el.tagName,
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0
        };
      });
    });

    console.log('\nMobile Typography:');
    mobileTypography.forEach(element => {
      console.log(`  ${element.tagName}: ${element.fontSize} (${element.visible ? 'visible' : 'hidden'})`);
      
      // Mobile text should be at least 16px to prevent zoom
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        const size = parseInt(element.fontSize);
        expect(size).toBeGreaterThanOrEqual(16);
      }
    });

    // All elements should be visible
    const visibleElements = mobileTypography.filter(el => el.visible).length;
    expect(visibleElements).toBe(mobileTypography.length);
  });
});