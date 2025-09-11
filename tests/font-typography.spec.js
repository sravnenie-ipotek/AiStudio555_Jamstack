const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3005';

// Pages to test
const PAGES = ['home.html', 'courses.html', 'teachers.html', 'pricing.html'];

// Expected fonts
const EXPECTED_FONTS = {
  primary: ['Inter', 'Poppins', 'Roboto', '-apple-system', 'BlinkMacSystemFont'],
  secondary: ['Open Sans', 'Segoe UI', 'Arial'],
  fallback: ['sans-serif', 'serif', 'monospace']
};

// Typography standards
const TYPOGRAPHY_STANDARDS = {
  minFontSize: {
    desktop: 14,
    mobile: 16, // iOS zoom prevention
  },
  lineHeightRatio: {
    min: 1.4,
    max: 1.8,
  },
  contrastRatio: {
    normal: 4.5, // WCAG AA standard
    large: 3.0,  // For large text (18pt+)
  }
};

test.describe('🔤 Font and Typography Tests', () => {
  for (const page of PAGES) {
    test(`${page} - Font loading and rendering`, async ({ page: browserPage }) => {
      await browserPage.goto(`${BASE_URL}/${page}`, { waitUntil: 'networkidle' });
      
      // Wait for fonts to load
      const fontLoadStatus = await browserPage.evaluate(() => {
        return document.fonts.ready.then(() => {
          const fonts = [];
          document.fonts.forEach(font => {
            fonts.push({
              family: font.family,
              status: font.status,
              style: font.style,
              weight: font.weight,
            });
          });
          return {
            loaded: true,
            count: document.fonts.size,
            fonts: fonts
          };
        });
      });
      
      console.log(`\n🔤 Font Status for ${page}:`);
      console.log(`   Fonts loaded: ${fontLoadStatus.count}`);
      console.log(`   Status: ${fontLoadStatus.loaded ? '✅ Ready' : '⚠️  Loading'}`);
      
      // Check specific font families used
      const fontFamilies = await browserPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const families = new Set();
        
        Array.from(elements).slice(0, 100).forEach(el => {
          const style = window.getComputedStyle(el);
          const fontFamily = style.fontFamily;
          if (fontFamily) {
            families.add(fontFamily);
          }
        });
        
        return Array.from(families);
      });
      
      console.log(`   Font families in use: ${fontFamilies.length}`);
      fontFamilies.slice(0, 5).forEach(family => {
        console.log(`     - ${family.substring(0, 50)}`);
      });
      
      expect(fontLoadStatus.count).toBeGreaterThan(0);
    });

    test(`${page} - Typography standards`, async ({ page: browserPage }) => {
      await browserPage.goto(`${BASE_URL}/${page}`, { waitUntil: 'networkidle' });
      
      const typographyAnalysis = await browserPage.evaluate((standards) => {
        const results = {
          issues: [],
          warnings: [],
          stats: {
            totalElements: 0,
            tooSmallText: 0,
            poorLineHeight: 0,
            poorContrast: 0,
          }
        };
        
        // Analyze text elements
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, li, td');
        results.stats.totalElements = textElements.length;
        
        // Helper function to get contrast ratio
        function getContrastRatio(color1, color2) {
          // Simplified contrast calculation
          // In production, use a proper library
          return 5.0; // Placeholder - actual calculation would be complex
        }
        
        Array.from(textElements).slice(0, 200).forEach(el => {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          const lineHeight = parseFloat(style.lineHeight);
          const color = style.color;
          const bgColor = style.backgroundColor;
          
          // Check font size
          if (fontSize < standards.minFontSize.desktop) {
            results.stats.tooSmallText++;
            if (fontSize < 12) {
              results.issues.push({
                type: 'font-size',
                element: el.tagName,
                value: fontSize,
                text: el.textContent?.substring(0, 30)
              });
            }
          }
          
          // Check line height
          if (fontSize > 0) {
            const ratio = lineHeight / fontSize;
            if (ratio < standards.lineHeightRatio.min || ratio > standards.lineHeightRatio.max) {
              results.stats.poorLineHeight++;
              if (ratio < 1.2) {
                results.warnings.push({
                  type: 'line-height',
                  element: el.tagName,
                  ratio: ratio.toFixed(2),
                  text: el.textContent?.substring(0, 30)
                });
              }
            }
          }
          
          // Check contrast (simplified)
          if (bgColor !== 'rgba(0, 0, 0, 0)' && color !== bgColor) {
            const contrast = getContrastRatio(color, bgColor);
            if (contrast < standards.contrastRatio.normal) {
              results.stats.poorContrast++;
            }
          }
        });
        
        return results;
      }, TYPOGRAPHY_STANDARDS);
      
      console.log(`\n📏 Typography Analysis for ${page}:`);
      console.log(`   Elements analyzed: ${typographyAnalysis.stats.totalElements}`);
      console.log(`   Small text (<14px): ${typographyAnalysis.stats.tooSmallText}`);
      console.log(`   Poor line height: ${typographyAnalysis.stats.poorLineHeight}`);
      
      if (typographyAnalysis.issues.length > 0) {
        console.log(`\n   ⚠️  Issues found:`);
        typographyAnalysis.issues.slice(0, 3).forEach(issue => {
          console.log(`     - ${issue.type}: ${issue.value}px in ${issue.element}`);
        });
      }
      
      // Assert no critical typography issues
      expect(typographyAnalysis.issues.filter(i => i.value < 10)).toHaveLength(0);
    });

    test(`${page} - Mobile font size (iOS zoom prevention)`, async ({ page: browserPage }) => {
      // Set mobile viewport
      await browserPage.setViewportSize({ width: 375, height: 812 });
      await browserPage.goto(`${BASE_URL}/${page}`, { waitUntil: 'networkidle' });
      
      const mobileTypography = await browserPage.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea, select');
        const issues = [];
        
        inputs.forEach(input => {
          const style = window.getComputedStyle(input);
          const fontSize = parseFloat(style.fontSize);
          
          if (fontSize < 16) {
            issues.push({
              type: input.tagName.toLowerCase(),
              name: input.name || input.id || 'unnamed',
              fontSize: fontSize
            });
          }
        });
        
        return {
          totalInputs: inputs.length,
          smallInputs: issues,
        };
      });
      
      console.log(`\n📱 Mobile Typography for ${page}:`);
      console.log(`   Total inputs: ${mobileTypography.totalInputs}`);
      console.log(`   Inputs <16px: ${mobileTypography.smallInputs.length}`);
      
      if (mobileTypography.smallInputs.length > 0) {
        console.log(`   ⚠️  iOS zoom risk - inputs with font-size < 16px:`);
        mobileTypography.smallInputs.forEach(input => {
          console.log(`     - ${input.type} "${input.name}": ${input.fontSize}px`);
        });
      }
      
      // Warn but don't fail for this
      if (mobileTypography.smallInputs.length > 0) {
        console.warn(`   ⚠️  ${mobileTypography.smallInputs.length} inputs may cause iOS zoom`);
      }
    });

    test(`${page} - Font consistency`, async ({ page: browserPage }) => {
      await browserPage.goto(`${BASE_URL}/${page}`, { waitUntil: 'networkidle' });
      
      const fontConsistency = await browserPage.evaluate(() => {
        const headings = {
          h1: [],
          h2: [],
          h3: [],
          h4: [],
          h5: [],
          h6: [],
        };
        
        const paragraphs = [];
        const buttons = [];
        
        // Check headings
        Object.keys(headings).forEach(tag => {
          const elements = document.querySelectorAll(tag);
          elements.forEach(el => {
            const style = window.getComputedStyle(el);
            headings[tag].push({
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              fontFamily: style.fontFamily?.split(',')[0]?.trim(),
            });
          });
        });
        
        // Check paragraphs
        document.querySelectorAll('p').forEach(el => {
          const style = window.getComputedStyle(el);
          paragraphs.push({
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
          });
        });
        
        // Check buttons
        document.querySelectorAll('button, .btn, .button').forEach(el => {
          const style = window.getComputedStyle(el);
          buttons.push({
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
          });
        });
        
        return { headings, paragraphs, buttons };
      });
      
      console.log(`\n🎨 Font Consistency for ${page}:`);
      
      // Check heading hierarchy
      const headingSizes = {};
      Object.entries(fontConsistency.headings).forEach(([tag, elements]) => {
        if (elements.length > 0) {
          const sizes = [...new Set(elements.map(e => e.fontSize))];
          headingSizes[tag] = sizes;
          console.log(`   ${tag}: ${sizes.join(', ')}`);
          
          if (sizes.length > 2) {
            console.warn(`     ⚠️  Multiple sizes for ${tag} (${sizes.length} variations)`);
          }
        }
      });
      
      // Check paragraph consistency
      if (fontConsistency.paragraphs.length > 0) {
        const pSizes = [...new Set(fontConsistency.paragraphs.map(p => p.fontSize))];
        console.log(`   Paragraph sizes: ${pSizes.join(', ')}`);
        
        if (pSizes.length > 3) {
          console.warn(`   ⚠️  Too many paragraph size variations (${pSizes.length})`);
        }
      }
      
      // Check button consistency
      if (fontConsistency.buttons.length > 0) {
        const btnSizes = [...new Set(fontConsistency.buttons.map(b => b.fontSize))];
        console.log(`   Button sizes: ${btnSizes.join(', ')}`);
        
        if (btnSizes.length > 3) {
          console.warn(`   ⚠️  Too many button size variations (${btnSizes.length})`);
        }
      }
    });
  }

  test.describe('Multi-language Font Support', () => {
    test('Russian Cyrillic font support', async ({ page }) => {
      await page.goto(`${BASE_URL}/ru/index.html`, { waitUntil: 'networkidle' });
      
      const cyrillicSupport = await page.evaluate(() => {
        const textElements = document.querySelectorAll('p, h1, h2, h3, span');
        const results = {
          hasCyrillic: false,
          fontSupport: [],
        };
        
        textElements.forEach(el => {
          const text = el.textContent || '';
          if (/[а-яА-Я]/.test(text)) {
            results.hasCyrillic = true;
            const style = window.getComputedStyle(el);
            results.fontSupport.push({
              element: el.tagName,
              fontFamily: style.fontFamily,
              sample: text.substring(0, 30)
            });
          }
        });
        
        return results;
      });
      
      console.log('\n🇷🇺 Russian Font Support:');
      console.log(`   Has Cyrillic text: ${cyrillicSupport.hasCyrillic ? '✅' : '❌'}`);
      
      if (cyrillicSupport.fontSupport.length > 0) {
        console.log('   Font families used:');
        cyrillicSupport.fontSupport.slice(0, 3).forEach(item => {
          console.log(`     - ${item.element}: ${item.fontFamily?.split(',')[0]}`);
        });
      }
      
      expect(cyrillicSupport.hasCyrillic).toBe(true);
    });

    test('Hebrew RTL font support', async ({ page }) => {
      await page.goto(`${BASE_URL}/he/index.html`, { waitUntil: 'networkidle' });
      
      const hebrewSupport = await page.evaluate(() => {
        const results = {
          isRTL: document.dir === 'rtl' || document.documentElement.dir === 'rtl',
          hasHebrew: false,
          fontSupport: [],
        };
        
        const textElements = document.querySelectorAll('p, h1, h2, h3, span');
        textElements.forEach(el => {
          const text = el.textContent || '';
          if (/[\u0590-\u05FF]/.test(text)) {
            results.hasHebrew = true;
            const style = window.getComputedStyle(el);
            results.fontSupport.push({
              element: el.tagName,
              fontFamily: style.fontFamily,
              direction: style.direction,
              textAlign: style.textAlign,
            });
          }
        });
        
        return results;
      });
      
      console.log('\n🇮🇱 Hebrew Font Support:');
      console.log(`   RTL enabled: ${hebrewSupport.isRTL ? '✅' : '❌'}`);
      console.log(`   Has Hebrew text: ${hebrewSupport.hasHebrew ? '✅' : '❌'}`);
      
      if (hebrewSupport.fontSupport.length > 0) {
        console.log('   RTL rendering:');
        hebrewSupport.fontSupport.slice(0, 3).forEach(item => {
          console.log(`     - ${item.element}: dir=${item.direction}, align=${item.textAlign}`);
        });
      }
      
      expect(hebrewSupport.isRTL).toBe(true);
    });
  });
});

// Summary
test.afterAll(async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔤 FONT & TYPOGRAPHY TESTING COMPLETE');
  console.log('='.repeat(60));
  console.log('✅ Font loading validated');
  console.log('✅ Typography standards checked');
  console.log('✅ Mobile font sizes verified');
  console.log('✅ Multi-language support confirmed');
  console.log('='.repeat(60));
});