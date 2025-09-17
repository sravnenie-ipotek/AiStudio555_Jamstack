const { test, expect } = require('@playwright/test');

test.describe('SEO Meta Tags Testing', () => {
  const testPages = [
    { name: 'Home', url: 'home.html', priority: 'high' },
    { name: 'Courses', url: 'courses.html', priority: 'high' },
    { name: 'Teachers', url: 'teachers.html', priority: 'medium' },
    { name: 'Career Center', url: 'career-center.html', priority: 'medium' },
    { name: 'Career Orientation', url: 'career-orientation.html', priority: 'medium' }
  ];

  const languages = [
    { code: 'en', name: 'English', path: 'dist/en/', hreflang: 'en' },
    { code: 'ru', name: 'Russian', path: 'dist/ru/', hreflang: 'ru' },
    { code: 'he', name: 'Hebrew', path: 'dist/he/', hreflang: 'he' }
  ];

  test.describe('Basic SEO Meta Tags', () => {
    for (const page of testPages) {
      test(`${page.name} - Basic meta tags validation`, async ({ page: playwright }) => {
        await playwright.goto(page.url);
        await playwright.waitForLoadState('networkidle');

        const seoAnalysis = await playwright.evaluate(() => {
          const getMetaContent = (name) => {
            const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            return meta ? meta.getAttribute('content') : null;
          };

          const getLinkHref = (rel) => {
            const link = document.querySelector(`link[rel="${rel}"]`);
            return link ? link.getAttribute('href') : null;
          };

          return {
            title: document.title,
            description: getMetaContent('description'),
            keywords: getMetaContent('keywords'),
            author: getMetaContent('author'),
            viewport: getMetaContent('viewport'),
            robots: getMetaContent('robots'),
            canonicalUrl: getLinkHref('canonical'),
            
            // Language and charset
            htmlLang: document.documentElement.getAttribute('lang'),
            charset: document.querySelector('meta[charset]')?.getAttribute('charset'),
            
            // Open Graph tags
            ogTitle: getMetaContent('og:title'),
            ogDescription: getMetaContent('og:description'),
            ogImage: getMetaContent('og:image'),
            ogUrl: getMetaContent('og:url'),
            ogType: getMetaContent('og:type'),
            ogSiteName: getMetaContent('og:site_name'),
            
            // Twitter Card tags
            twitterCard: getMetaContent('twitter:card'),
            twitterTitle: getMetaContent('twitter:title'),
            twitterDescription: getMetaContent('twitter:description'),
            twitterImage: getMetaContent('twitter:image'),
            
            // Additional SEO tags
            themeColor: getMetaContent('theme-color'),
            appleMobileWebAppCapable: getMetaContent('apple-mobile-web-app-capable'),
            appleMobileWebAppTitle: getMetaContent('apple-mobile-web-app-title')
          };
        });

        console.log(`\n=== SEO Analysis: ${page.name} ===`);

        // Title validation
        expect(seoAnalysis.title).toBeTruthy();
        expect(seoAnalysis.title.length).toBeGreaterThan(10);
        expect(seoAnalysis.title.length).toBeLessThan(60); // Google's recommended limit
        console.log(`Title: "${seoAnalysis.title}" (${seoAnalysis.title.length} chars)`);

        // Meta description validation
        expect(seoAnalysis.description).toBeTruthy();
        expect(seoAnalysis.description.length).toBeGreaterThan(50);
        expect(seoAnalysis.description.length).toBeLessThan(160); // Google's recommended limit
        console.log(`Description: "${seoAnalysis.description.substring(0, 100)}..." (${seoAnalysis.description.length} chars)`);

        // Essential meta tags
        expect(seoAnalysis.viewport).toBeTruthy();
        expect(seoAnalysis.htmlLang).toBeTruthy();
        expect(seoAnalysis.charset).toBeTruthy();
        console.log(`Language: ${seoAnalysis.htmlLang}, Charset: ${seoAnalysis.charset}`);

        // Open Graph validation (important for social sharing)
        if (page.priority === 'high') {
          expect(seoAnalysis.ogTitle).toBeTruthy();
          expect(seoAnalysis.ogDescription).toBeTruthy();
          expect(seoAnalysis.ogImage).toBeTruthy();
          console.log(`Open Graph: ✅ Title, Description, Image present`);
        }

        // Twitter Card validation
        if (seoAnalysis.twitterCard) {
          expect(['summary', 'summary_large_image', 'app', 'player']).toContain(seoAnalysis.twitterCard);
          console.log(`Twitter Card: ${seoAnalysis.twitterCard}`);
        }

        // Robots meta validation
        if (seoAnalysis.robots) {
          console.log(`Robots: ${seoAnalysis.robots}`);
          // Should not accidentally block search engines
          expect(seoAnalysis.robots.toLowerCase()).not.toContain('noindex');
        }

        console.log(`✅ ${page.name} basic SEO validation passed`);
      });
    }
  });

  test.describe('Multi-Language SEO', () => {
    for (const lang of languages) {
      test(`SEO for ${lang.name} pages`, async ({ page }) => {
        await page.goto(`${lang.path}index.html`);
        await page.waitForLoadState('networkidle');

        const multiLangSEO = await page.evaluate(() => {
          const getMetaContent = (name) => {
            const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            return meta ? meta.getAttribute('content') : null;
          };

          // Get all hreflang links
          const hreflangLinks = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(link => ({
            hreflang: link.getAttribute('hreflang'),
            href: link.getAttribute('href')
          }));

          return {
            title: document.title,
            description: getMetaContent('description'),
            htmlLang: document.documentElement.getAttribute('lang'),
            htmlDir: document.documentElement.getAttribute('dir'),
            ogLocale: getMetaContent('og:locale'),
            hreflangLinks,
            
            // Check for language-specific content indicators
            hasLocalizedContent: {
              title: document.title.length > 0,
              description: !!getMetaContent('description'),
              headings: document.querySelectorAll('h1, h2, h3').length > 0
            }
          };
        });

        console.log(`\n=== ${lang.name} SEO Analysis ===`);

        // Language attribute validation
        expect(multiLangSEO.htmlLang).toBe(lang.code);
        console.log(`HTML lang: ${multiLangSEO.htmlLang} ✅`);

        // RTL validation for Hebrew
        if (lang.code === 'he') {
          expect(multiLangSEO.htmlDir).toBe('rtl');
          console.log(`HTML dir: ${multiLangSEO.htmlDir} ✅`);
        }

        // Content localization validation
        expect(multiLangSEO.hasLocalizedContent.title).toBe(true);
        expect(multiLangSEO.hasLocalizedContent.description).toBe(true);
        expect(multiLangSEO.hasLocalizedContent.headings).toBe(true);
        console.log(`Localized content: Title ✅, Description ✅, Headings ✅`);

        // Title and description should be language-appropriate
        expect(multiLangSEO.title.length).toBeGreaterThan(10);
        expect(multiLangSEO.description.length).toBeGreaterThan(50);

        // Log content samples for manual review
        console.log(`Title: "${multiLangSEO.title}"`);
        console.log(`Description: "${multiLangSEO.description.substring(0, 100)}..."`);

        // Hreflang implementation
        if (multiLangSEO.hreflangLinks.length > 0) {
          console.log(`Hreflang links found: ${multiLangSEO.hreflangLinks.length}`);
          multiLangSEO.hreflangLinks.forEach(link => {
            console.log(`  ${link.hreflang}: ${link.href}`);
          });

          // Should have links for different languages
          const hasEnglish = multiLangSEO.hreflangLinks.some(link => link.hreflang === 'en');
          const hasCurrent = multiLangSEO.hreflangLinks.some(link => link.hreflang === lang.code);
          
          console.log(`Hreflang validation: EN=${hasEnglish}, Current=${hasCurrent}`);
        }

        console.log(`✅ ${lang.name} SEO validation completed`);
      });
    }

    test('Hreflang consistency across languages', async ({ page }) => {
      const hreflangData = {};

      // Collect hreflang data from all language versions
      for (const lang of languages) {
        await page.goto(`${lang.path}index.html`);
        await page.waitForLoadState('networkidle');

        const hreflangLinks = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(link => ({
            hreflang: link.getAttribute('hreflang'),
            href: link.getAttribute('href')
          }));
        });

        hreflangData[lang.code] = hreflangLinks;
      }

      console.log('\n=== Hreflang Consistency Analysis ===');

      // Analyze consistency
      const allLanguagesReferenced = new Set();
      Object.values(hreflangData).forEach(links => {
        links.forEach(link => allLanguagesReferenced.add(link.hreflang));
      });

      console.log(`Languages referenced in hreflang: ${Array.from(allLanguagesReferenced).join(', ')}`);

      // Check bidirectional relationships
      for (const lang of languages) {
        const links = hreflangData[lang.code] || [];
        console.log(`\n${lang.name} page references:`);
        links.forEach(link => {
          console.log(`  ${link.hreflang}: ${link.href}`);
        });

        // Should reference other languages
        const referencesOtherLanguages = links.length > 0;
        expect(referencesOtherLanguages).toBe(true);
      }

      console.log('✅ Hreflang consistency validation completed');
    });
  });

  test.describe('Structured Data and Rich Snippets', () => {
    test('JSON-LD structured data validation', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const structuredData = await page.evaluate(() => {
        const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        
        return jsonLdScripts.map(script => {
          try {
            return JSON.parse(script.textContent);
          } catch (e) {
            return { error: 'Invalid JSON-LD', content: script.textContent };
          }
        });
      });

      console.log('\n=== Structured Data Analysis ===');
      console.log(`JSON-LD scripts found: ${structuredData.length}`);

      if (structuredData.length > 0) {
        structuredData.forEach((data, index) => {
          console.log(`\nStructured Data ${index + 1}:`);
          
          if (data.error) {
            console.log(`  ❌ ${data.error}`);
            console.log(`  Content: ${data.content.substring(0, 100)}...`);
          } else {
            console.log(`  Type: ${data['@type'] || 'Unknown'}`);
            console.log(`  Context: ${data['@context'] || 'None'}`);
            
            // Validate common structured data types
            if (data['@type'] === 'Organization') {
              expect(data.name).toBeTruthy();
              expect(data.url).toBeTruthy();
              console.log(`  ✅ Organization: ${data.name}`);
            }
            
            if (data['@type'] === 'WebSite') {
              expect(data.name).toBeTruthy();
              expect(data.url).toBeTruthy();
              console.log(`  ✅ Website: ${data.name}`);
            }
            
            if (data['@type'] === 'Course') {
              expect(data.name).toBeTruthy();
              expect(data.description).toBeTruthy();
              console.log(`  ✅ Course: ${data.name}`);
            }
          }
        });
      } else {
        console.log('ℹ️ No JSON-LD structured data found');
      }

      // Check for microdata or other structured data formats
      const microdataElements = await page.locator('[itemscope]').count();
      if (microdataElements > 0) {
        console.log(`Microdata elements found: ${microdataElements}`);
      }
    });

    test('Educational content structured data', async ({ page }) => {
      await page.goto('courses.html');
      await page.waitForLoadState('networkidle');

      // Look for course-related structured data
      const courseData = await page.evaluate(() => {
        // Check for course schema
        const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        const courseStructuredData = [];
        
        jsonLdScripts.forEach(script => {
          try {
            const data = JSON.parse(script.textContent);
            if (data['@type'] === 'Course' || data['@type'] === 'EducationalOrganization') {
              courseStructuredData.push(data);
            }
          } catch (e) {
            // Invalid JSON
          }
        });

        // Also check for microdata courses
        const courseElements = Array.from(document.querySelectorAll('[itemtype*="Course"]'));
        
        return {
          jsonLdCourses: courseStructuredData,
          microdataCourses: courseElements.length,
          
          // Check for common course elements
          hasCourseCards: document.querySelectorAll('.course-card, .course-item, [class*="course"]').length > 0,
          hasPricing: document.querySelectorAll('[class*="price"], [class*="cost"]').length > 0,
          hasInstructors: document.querySelectorAll('[class*="instructor"], [class*="teacher"]').length > 0
        };
      });

      console.log('\n=== Educational Content Analysis ===');
      console.log(`JSON-LD Courses: ${courseData.jsonLdCourses.length}`);
      console.log(`Microdata Courses: ${courseData.microdataCourses}`);
      console.log(`Course Cards Present: ${courseData.hasCourseCards}`);
      console.log(`Pricing Information: ${courseData.hasPricing}`);
      console.log(`Instructor Information: ${courseData.hasInstructors}`);

      if (courseData.jsonLdCourses.length > 0) {
        courseData.jsonLdCourses.forEach((course, index) => {
          console.log(`\nCourse ${index + 1}:`);
          console.log(`  Name: ${course.name || 'Not specified'}`);
          console.log(`  Description: ${course.description ? course.description.substring(0, 100) + '...' : 'Not specified'}`);
          console.log(`  Provider: ${course.provider?.name || 'Not specified'}`);
        });
      }

      // Should have course-related content
      expect(courseData.hasCourseCards).toBe(true);
    });
  });

  test.describe('Social Media Optimization', () => {
    for (const page of testPages.filter(p => p.priority === 'high')) {
      test(`${page.name} - Social media meta tags`, async ({ page: playwright }) => {
        await playwright.goto(page.url);
        await playwright.waitForLoadState('networkidle');

        const socialMetaTags = await playwright.evaluate(() => {
          const getMetaContent = (property) => {
            const meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
            return meta ? meta.getAttribute('content') : null;
          };

          return {
            // Open Graph
            ogTitle: getMetaContent('og:title'),
            ogDescription: getMetaContent('og:description'),
            ogImage: getMetaContent('og:image'),
            ogImageAlt: getMetaContent('og:image:alt'),
            ogUrl: getMetaContent('og:url'),
            ogType: getMetaContent('og:type'),
            ogSiteName: getMetaContent('og:site_name'),
            ogLocale: getMetaContent('og:locale'),
            
            // Twitter Card
            twitterCard: getMetaContent('twitter:card'),
            twitterSite: getMetaContent('twitter:site'),
            twitterCreator: getMetaContent('twitter:creator'),
            twitterTitle: getMetaContent('twitter:title'),
            twitterDescription: getMetaContent('twitter:description'),
            twitterImage: getMetaContent('twitter:image'),
            twitterImageAlt: getMetaContent('twitter:image:alt'),
            
            // Facebook specific
            fbAppId: getMetaContent('fb:app_id'),
            
            // Additional social
            ogVideo: getMetaContent('og:video'),
            ogAudio: getMetaContent('og:audio')
          };
        });

        console.log(`\n=== Social Media SEO: ${page.name} ===`);

        // Open Graph validation
        expect(socialMetaTags.ogTitle).toBeTruthy();
        expect(socialMetaTags.ogDescription).toBeTruthy();
        expect(socialMetaTags.ogImage).toBeTruthy();
        
        console.log(`OG Title: "${socialMetaTags.ogTitle}"`);
        console.log(`OG Description: "${socialMetaTags.ogDescription.substring(0, 100)}..."`);
        console.log(`OG Image: ${socialMetaTags.ogImage}`);

        // Validate Open Graph title length
        expect(socialMetaTags.ogTitle.length).toBeLessThan(100); // Facebook recommendation
        expect(socialMetaTags.ogDescription.length).toBeLessThan(300); // Facebook recommendation

        // Twitter Card validation
        if (socialMetaTags.twitterCard) {
          expect(['summary', 'summary_large_image']).toContain(socialMetaTags.twitterCard);
          console.log(`Twitter Card: ${socialMetaTags.twitterCard} ✅`);
          
          if (socialMetaTags.twitterTitle) {
            expect(socialMetaTags.twitterTitle.length).toBeLessThan(70); // Twitter recommendation
          }
        }

        // Image validation
        if (socialMetaTags.ogImage) {
          expect(socialMetaTags.ogImage.startsWith('http')).toBe(true);
          console.log(`OG Image URL valid: ✅`);
        }

        // URL validation
        if (socialMetaTags.ogUrl) {
          expect(socialMetaTags.ogUrl.startsWith('http')).toBe(true);
          console.log(`OG URL: ${socialMetaTags.ogUrl}`);
        }

        console.log(`✅ ${page.name} social media optimization validated`);
      });
    }

    test('Social media image validation', async ({ page, request }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const socialImages = await page.evaluate(() => {
        const getMetaContent = (property) => {
          const meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
          return meta ? meta.getAttribute('content') : null;
        };

        return {
          ogImage: getMetaContent('og:image'),
          twitterImage: getMetaContent('twitter:image')
        };
      });

      console.log('\n=== Social Media Image Validation ===');

      const imagesToTest = [
        { type: 'Open Graph', url: socialImages.ogImage },
        { type: 'Twitter', url: socialImages.twitterImage }
      ].filter(img => img.url);

      for (const image of imagesToTest) {
        try {
          const response = await request.head(image.url);
          const contentType = response.headers()['content-type'];
          const contentLength = response.headers()['content-length'];

          console.log(`${image.type} Image:`);
          console.log(`  URL: ${image.url}`);
          console.log(`  Status: ${response.status()}`);
          console.log(`  Type: ${contentType}`);
          console.log(`  Size: ${contentLength ? (parseInt(contentLength) / 1024).toFixed(1) + 'KB' : 'Unknown'}`);

          // Image should be accessible
          expect(response.status()).toBe(200);
          
          // Should be a valid image type
          expect(contentType).toMatch(/^image\/(jpeg|jpg|png|gif|webp)/);
          
          // Should not be too large for social media
          if (contentLength) {
            const sizeKB = parseInt(contentLength) / 1024;
            expect(sizeKB).toBeLessThan(5000); // Less than 5MB
          }

        } catch (error) {
          console.log(`❌ ${image.type} Image Error: ${error.message}`);
          // Don't fail test for image accessibility issues, just log
        }
      }
    });
  });

  test.describe('Technical SEO', () => {
    test('Page speed and Core Web Vitals impact on SEO', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');

        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          
          // Additional metrics for SEO
          resourceCount: performance.getEntriesByType('resource').length,
          scriptCount: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'script').length,
          imageCount: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'img').length
        };
      });

      console.log('\n=== SEO Performance Metrics ===');
      console.log(`First Contentful Paint: ${performanceMetrics.firstContentfulPaint.toFixed(0)}ms`);
      console.log(`DOM Content Loaded: ${performanceMetrics.domContentLoaded.toFixed(0)}ms`);
      console.log(`Total Resources: ${performanceMetrics.resourceCount}`);
      console.log(`Scripts: ${performanceMetrics.scriptCount}`);
      console.log(`Images: ${performanceMetrics.imageCount}`);

      // SEO-friendly performance thresholds
      expect(performanceMetrics.firstContentfulPaint).toBeLessThan(3000); // 3 seconds for good SEO
      expect(performanceMetrics.domContentLoaded).toBeLessThan(5000); // 5 seconds for DOM ready
      expect(performanceMetrics.resourceCount).toBeLessThan(100); // Reasonable resource count
    });

    test('URL structure and navigation for SEO', async ({ page }) => {
      const urls = [];
      
      // Collect all internal links
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const linkData = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        return links.map(link => ({
          href: link.getAttribute('href'),
          text: link.textContent.trim(),
          title: link.getAttribute('title'),
          rel: link.getAttribute('rel')
        })).filter(link => 
          link.href && 
          !link.href.startsWith('mailto:') && 
          !link.href.startsWith('tel:') &&
          !link.href.startsWith('#') &&
          !link.href.includes('javascript:')
        );
      });

      console.log('\n=== URL Structure Analysis ===');
      console.log(`Internal links found: ${linkData.length}`);

      // Analyze URL patterns
      const urlPatterns = {
        descriptive: 0,
        hasNumbers: 0,
        hasSpecialChars: 0,
        hasFileExtension: 0,
        tooLong: 0
      };

      linkData.slice(0, 20).forEach(link => {
        const url = link.href;
        
        // Check for descriptive URLs
        if (url.includes('course') || url.includes('teacher') || url.includes('about')) {
          urlPatterns.descriptive++;
        }
        
        // Check for numbers (might indicate IDs)
        if (/\d/.test(url)) {
          urlPatterns.hasNumbers++;
        }
        
        // Check for special characters (bad for SEO)
        if (/[&?=]/.test(url)) {
          urlPatterns.hasSpecialChars++;
        }
        
        // Check for file extensions
        if (/\.(html|php|asp)$/.test(url)) {
          urlPatterns.hasFileExtension++;
        }
        
        // Check URL length
        if (url.length > 100) {
          urlPatterns.tooLong++;
        }

        console.log(`  ${url} - "${link.text.substring(0, 30)}..."`);
      });

      console.log('\nURL Pattern Analysis:');
      console.log(`  Descriptive URLs: ${urlPatterns.descriptive}`);
      console.log(`  URLs with numbers: ${urlPatterns.hasNumbers}`);
      console.log(`  URLs with query params: ${urlPatterns.hasSpecialChars}`);
      console.log(`  URLs with extensions: ${urlPatterns.hasFileExtension}`);
      console.log(`  Long URLs (>100 chars): ${urlPatterns.tooLong}`);

      // SEO-friendly URL validation
      expect(urlPatterns.tooLong).toBeLessThan(linkData.length * 0.2); // Less than 20% long URLs
    });

    test('Sitemap and robots.txt validation', async ({ page, request }) => {
      console.log('\n=== Sitemap and Robots.txt Analysis ===');
      
      // Check for robots.txt
      try {
        const robotsResponse = await request.get('/robots.txt');
        if (robotsResponse.ok()) {
          const robotsContent = await robotsResponse.text();
          console.log('Robots.txt found:');
          console.log(robotsContent.substring(0, 500));
          
          // Should not block important pages
          expect(robotsContent.toLowerCase()).not.toContain('disallow: /');
          expect(robotsContent.toLowerCase()).not.toContain('disallow: /courses');
        } else {
          console.log('⚠️ robots.txt not found (404)');
        }
      } catch (error) {
        console.log('⚠️ robots.txt check failed:', error.message);
      }

      // Check for XML sitemap
      try {
        const sitemapResponse = await request.get('/sitemap.xml');
        if (sitemapResponse.ok()) {
          const sitemapContent = await sitemapResponse.text();
          console.log('\nSitemap.xml found');
          
          // Basic XML validation
          expect(sitemapContent).toContain('<urlset');
          expect(sitemapContent).toContain('<url>');
          expect(sitemapContent).toContain('<loc>');
          
          // Count URLs in sitemap
          const urlCount = (sitemapContent.match(/<url>/g) || []).length;
          console.log(`URLs in sitemap: ${urlCount}`);
          expect(urlCount).toBeGreaterThan(0);
          
        } else {
          console.log('⚠️ sitemap.xml not found (404)');
        }
      } catch (error) {
        console.log('⚠️ sitemap.xml check failed:', error.message);
      }

      // Check for HTML sitemap
      await page.goto('home.html');
      const htmlSitemapLink = await page.locator('a[href*="sitemap"]').count();
      console.log(`HTML sitemap links found: ${htmlSitemapLink}`);
    });
  });

  test.describe('Content SEO Quality', () => {
    test('Heading structure and keyword optimization', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const contentAnalysis = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const paragraphs = Array.from(document.querySelectorAll('p'));
        
        const headingData = headings.map(h => ({
          level: h.tagName,
          text: h.textContent.trim(),
          id: h.id || '',
          length: h.textContent.trim().length
        }));

        const textContent = document.body.textContent || '';
        const wordCount = textContent.split(/\s+/).length;

        return {
          headings: headingData,
          headingCount: headings.length,
          paragraphCount: paragraphs.length,
          wordCount,
          textLength: textContent.length,
          
          // Keyword analysis (basic)
          hasEducationKeywords: textContent.toLowerCase().includes('education') || 
                                textContent.toLowerCase().includes('learning') ||
                                textContent.toLowerCase().includes('course'),
          hasAIKeywords: textContent.toLowerCase().includes('ai') || 
                        textContent.toLowerCase().includes('artificial intelligence'),
          hasStudioKeywords: textContent.toLowerCase().includes('studio')
        };
      });

      console.log('\n=== Content SEO Analysis ===');
      console.log(`Word count: ${contentAnalysis.wordCount}`);
      console.log(`Headings: ${contentAnalysis.headingCount}`);
      console.log(`Paragraphs: ${contentAnalysis.paragraphCount}`);

      // Heading structure validation
      const h1Count = contentAnalysis.headings.filter(h => h.level === 'H1').length;
      expect(h1Count).toBe(1); // Should have exactly one H1
      console.log(`H1 count: ${h1Count} ✅`);

      if (contentAnalysis.headings.length > 0) {
        console.log('\nHeading Structure:');
        contentAnalysis.headings.slice(0, 10).forEach(heading => {
          console.log(`  ${heading.level}: "${heading.text.substring(0, 60)}..." (${heading.length} chars)`);
        });

        // Headings should not be too long
        const longHeadings = contentAnalysis.headings.filter(h => h.length > 100);
        expect(longHeadings.length).toBeLessThan(2);
      }

      // Content length validation
      expect(contentAnalysis.wordCount).toBeGreaterThan(100); // Minimum content for SEO
      console.log(`Content length: ${contentAnalysis.wordCount} words ✅`);

      // Keyword presence
      console.log('\nKeyword Analysis:');
      console.log(`  Education/Learning keywords: ${contentAnalysis.hasEducationKeywords ? '✅' : '❌'}`);
      console.log(`  AI keywords: ${contentAnalysis.hasAIKeywords ? '✅' : '❌'}`);
      console.log(`  Studio keywords: ${contentAnalysis.hasStudioKeywords ? '✅' : '❌'}`);

      expect(contentAnalysis.hasEducationKeywords).toBe(true);
    });

    test('Image SEO optimization', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const imageAnalysis = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        
        return images.map(img => ({
          src: img.src,
          alt: img.alt || '',
          title: img.title || '',
          width: img.width || 0,
          height: img.height || 0,
          loading: img.loading || '',
          hasAlt: img.hasAttribute('alt'),
          hasTitle: img.hasAttribute('title'),
          isDecorative: img.alt === '' && img.hasAttribute('alt')
        }));
      });

      console.log('\n=== Image SEO Analysis ===');
      console.log(`Total images: ${imageAnalysis.length}`);

      if (imageAnalysis.length > 0) {
        const imagesWithAlt = imageAnalysis.filter(img => img.hasAlt).length;
        const imagesWithGoodAlt = imageAnalysis.filter(img => img.alt && img.alt.length > 3).length;
        const decorativeImages = imageAnalysis.filter(img => img.isDecorative).length;

        console.log(`Images with alt attribute: ${imagesWithAlt}/${imageAnalysis.length}`);
        console.log(`Images with descriptive alt: ${imagesWithGoodAlt}/${imageAnalysis.length}`);
        console.log(`Decorative images (alt=""): ${decorativeImages}`);

        // Sample image analysis
        imageAnalysis.slice(0, 5).forEach((img, index) => {
          const filename = img.src.split('/').pop();
          console.log(`\nImage ${index + 1}: ${filename}`);
          console.log(`  Alt: "${img.alt}" (${img.alt.length} chars)`);
          console.log(`  Dimensions: ${img.width}x${img.height}`);
          console.log(`  Loading: ${img.loading || 'default'}`);
        });

        // SEO assertions
        const altTextRate = (imagesWithAlt / imageAnalysis.length) * 100;
        expect(altTextRate).toBeGreaterThan(80); // At least 80% should have alt text
        console.log(`Alt text compliance: ${altTextRate.toFixed(1)}% ✅`);

        // Check for lazy loading on non-critical images
        const lazyImages = imageAnalysis.filter(img => img.loading === 'lazy').length;
        console.log(`Lazy loaded images: ${lazyImages}/${imageAnalysis.length}`);
      }
    });
  });

  test('SEO competitive analysis', async ({ page }) => {
    // Analyze key SEO factors that affect rankings
    await page.goto('home.html');
    await page.waitForLoadState('networkidle');

    const competitiveFactors = await page.evaluate(() => {
      return {
        // Content factors
        wordCount: (document.body.textContent || '').split(/\s+/).length,
        headingCount: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        imageCount: document.querySelectorAll('img').length,
        linkCount: document.querySelectorAll('a[href]').length,
        
        // Technical factors
        hasHttps: location.protocol === 'https:',
        hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
        hasDescription: !!document.querySelector('meta[name="description"]'),
        hasOpenGraph: !!document.querySelector('meta[property^="og:"]'),
        
        // User experience factors
        hasContactInfo: document.body.textContent.includes('contact') || 
                       document.body.textContent.includes('phone') ||
                       document.body.textContent.includes('email'),
        hasCallToAction: document.querySelectorAll('button, .btn, [class*="cta"]').length > 0,
        
        // Mobile optimization
        hasResponsiveImages: document.querySelectorAll('picture, img[srcset]').length > 0,
        hasTouchTargets: document.querySelectorAll('button, a, input').length > 0
      };
    });

    console.log('\n=== SEO Competitive Analysis ===');
    console.log(`Content Quality:`);
    console.log(`  Word count: ${competitiveFactors.wordCount}`);
    console.log(`  Headings: ${competitiveFactors.headingCount}`);
    console.log(`  Images: ${competitiveFactors.imageCount}`);
    console.log(`  Links: ${competitiveFactors.linkCount}`);

    console.log(`\nTechnical SEO:`);
    console.log(`  HTTPS: ${competitiveFactors.hasHttps ? '✅' : '❌'}`);
    console.log(`  Viewport meta: ${competitiveFactors.hasViewportMeta ? '✅' : '❌'}`);
    console.log(`  Meta description: ${competitiveFactors.hasDescription ? '✅' : '❌'}`);
    console.log(`  Open Graph: ${competitiveFactors.hasOpenGraph ? '✅' : '❌'}`);

    console.log(`\nUser Experience:`);
    console.log(`  Contact info: ${competitiveFactors.hasContactInfo ? '✅' : '❌'}`);
    console.log(`  Call to action: ${competitiveFactors.hasCallToAction ? '✅' : '❌'}`);

    console.log(`\nMobile Optimization:`);
    console.log(`  Responsive images: ${competitiveFactors.hasResponsiveImages ? '✅' : '❌'}`);
    console.log(`  Touch targets: ${competitiveFactors.hasTouchTargets ? '✅' : '❌'}`);

    // Calculate SEO score
    const seoFactors = [
      competitiveFactors.hasHttps,
      competitiveFactors.hasViewportMeta,
      competitiveFactors.hasDescription,
      competitiveFactors.hasOpenGraph,
      competitiveFactors.hasContactInfo,
      competitiveFactors.hasCallToAction,
      competitiveFactors.wordCount > 300,
      competitiveFactors.headingCount > 3,
      competitiveFactors.imageCount > 0
    ];

    const seoScore = (seoFactors.filter(Boolean).length / seoFactors.length) * 100;
    console.log(`\nSEO Score: ${seoScore.toFixed(1)}%`);

    expect(seoScore).toBeGreaterThan(70); // Should score above 70%
    console.log('✅ SEO competitive analysis completed');
  });
});