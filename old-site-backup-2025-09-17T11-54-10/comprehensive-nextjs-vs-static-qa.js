const { chromium } = require('playwright');
const fs = require('fs');

async function runQATest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {
    timestamp: new Date().toISOString(),
    static_version: {},
    nextjs_version: {},
    comparison: {},
    console_errors: {
      static: [],
      nextjs: []
    }
  };

  // Test URLs
  const tests = [
    {
      name: 'home',
      static: 'http://localhost:3005/home.html',
      nextjs: 'http://localhost:3001/en'
    },
    {
      name: 'courses',
      static: 'http://localhost:3005/courses.html',
      nextjs: 'http://localhost:3001/en/courses'
    },
    {
      name: 'hebrew_home',
      static: 'http://localhost:3005/he/home.html',
      nextjs: 'http://localhost:3001/he'
    },
    {
      name: 'hebrew_courses',
      static: 'http://localhost:3005/he/courses.html',
      nextjs: 'http://localhost:3001/he/courses'
    }
  ];

  console.log('🔵 QA TEST: Starting comprehensive comparison...\n');

  for (const test of tests) {
    console.log(`\n📋 Testing: ${test.name.toUpperCase()}`);
    
    // Test Static Version
    try {
      console.log(`  🌐 Testing static: ${test.static}`);
      
      // Listen for console errors
      const staticErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          staticErrors.push(msg.text());
        }
      });
      
      const staticResponse = await page.goto(test.static, { waitUntil: 'networkidle' });
      
      if (staticResponse && staticResponse.ok()) {
        // Wait for content to load
        await page.waitForTimeout(3000);
        
        // Check for key elements
        const elements = await page.evaluate(() => {
          const sections = Array.from(document.querySelectorAll('section, .section, [class*="section"]')).length;
          const courses = Array.from(document.querySelectorAll('[class*="course"], .course-card, .course-item')).length;
          const buttons = Array.from(document.querySelectorAll('button, .btn, [class*="button"]')).length;
          const navbar = document.querySelector('nav, .navbar, [class*="nav"]') ? 1 : 0;
          const footer = document.querySelector('footer, .footer') ? 1 : 0;
          const hero = document.querySelector('.hero, [class*="hero"]') ? 1 : 0;
          const teachers = Array.from(document.querySelectorAll('[class*="teacher"], .instructor, [class*="instructor"]')).length;
          
          return {
            sections,
            courses,
            buttons,
            navbar,
            footer,
            hero,
            teachers,
            title: document.title,
            bodyClasses: document.body.className,
            hasContent: document.body.innerText.length > 100
          };
        });
        
        await page.screenshot({ 
          path: `static-${test.name}-screenshot.png`,
          fullPage: true
        });
        
        results.static_version[test.name] = {
          status: 'SUCCESS',
          elements,
          errors: staticErrors,
          url: test.static
        };
        
        console.log(`    ✅ Static loaded: ${elements.sections} sections, ${elements.courses} courses, ${elements.buttons} buttons`);
        
      } else {
        results.static_version[test.name] = {
          status: 'FAILED',
          error: `HTTP ${staticResponse ? staticResponse.status() : 'No response'}`,
          url: test.static
        };
        console.log(`    ❌ Static failed: ${staticResponse ? staticResponse.status() : 'No response'}`);
      }
      
      results.console_errors.static.push(...staticErrors);
      
    } catch (error) {
      results.static_version[test.name] = {
        status: 'ERROR',
        error: error.message,
        url: test.static
      };
      console.log(`    ❌ Static error: ${error.message}`);
    }

    // Test Next.js Version
    try {
      console.log(`  ⚛️  Testing Next.js: ${test.nextjs}`);
      
      const nextjsErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          nextjsErrors.push(msg.text());
        }
      });
      
      const nextjsResponse = await page.goto(test.nextjs, { waitUntil: 'networkidle' });
      
      if (nextjsResponse && nextjsResponse.ok()) {
        // Wait for React hydration
        await page.waitForTimeout(5000);
        
        const elements = await page.evaluate(() => {
          const sections = Array.from(document.querySelectorAll('section, .section, [class*="section"]')).length;
          const courses = Array.from(document.querySelectorAll('[class*="course"], .course-card, .course-item')).length;
          const buttons = Array.from(document.querySelectorAll('button, .btn, [class*="button"]')).length;
          const navbar = document.querySelector('nav, .navbar, [class*="nav"]') ? 1 : 0;
          const footer = document.querySelector('footer, .footer') ? 1 : 0;
          const hero = document.querySelector('.hero, [class*="hero"]') ? 1 : 0;
          const teachers = Array.from(document.querySelectorAll('[class*="teacher"], .instructor, [class*="instructor"]')).length;
          
          return {
            sections,
            courses,
            buttons,
            navbar,
            footer,
            hero,
            teachers,
            title: document.title,
            bodyClasses: document.body.className,
            hasContent: document.body.innerText.length > 100
          };
        });
        
        await page.screenshot({ 
          path: `nextjs-${test.name}-screenshot.png`,
          fullPage: true
        });
        
        results.nextjs_version[test.name] = {
          status: 'SUCCESS',
          elements,
          errors: nextjsErrors,
          url: test.nextjs
        };
        
        console.log(`    ✅ Next.js loaded: ${elements.sections} sections, ${elements.courses} courses, ${elements.buttons} buttons`);
        
      } else {
        results.nextjs_version[test.name] = {
          status: 'FAILED',
          error: `HTTP ${nextjsResponse ? nextjsResponse.status() : 'No response'}`,
          url: test.nextjs
        };
        console.log(`    ❌ Next.js failed: ${nextjsResponse ? nextjsResponse.status() : 'No response'}`);
      }
      
      results.console_errors.nextjs.push(...nextjsErrors);
      
    } catch (error) {
      results.nextjs_version[test.name] = {
        status: 'ERROR',
        error: error.message,
        url: test.nextjs
      };
      console.log(`    ❌ Next.js error: ${error.message}`);
    }
  }

  // Generate comparison
  console.log('\n📊 COMPARISON ANALYSIS');
  
  for (const test of tests) {
    const staticResult = results.static_version[test.name];
    const nextjsResult = results.nextjs_version[test.name];
    
    if (staticResult?.status === 'SUCCESS' && nextjsResult?.status === 'SUCCESS') {
      const staticElements = staticResult.elements;
      const nextjsElements = nextjsResult.elements;
      
      results.comparison[test.name] = {
        sections_diff: staticElements.sections - nextjsElements.sections,
        courses_diff: staticElements.courses - nextjsElements.courses,
        buttons_diff: staticElements.buttons - nextjsElements.buttons,
        navbar_diff: staticElements.navbar - nextjsElements.navbar,
        footer_diff: staticElements.footer - nextjsElements.footer,
        hero_diff: staticElements.hero - nextjsElements.hero,
        teachers_diff: staticElements.teachers - nextjsElements.teachers,
        content_diff: staticElements.hasContent !== nextjsElements.hasContent
      };
      
      console.log(`  ${test.name}:`);
      console.log(`    Sections: ${staticElements.sections} vs ${nextjsElements.sections} (diff: ${results.comparison[test.name].sections_diff})`);
      console.log(`    Courses: ${staticElements.courses} vs ${nextjsElements.courses} (diff: ${results.comparison[test.name].courses_diff})`);
      console.log(`    Buttons: ${staticElements.buttons} vs ${nextjsElements.buttons} (diff: ${results.comparison[test.name].buttons_diff})`);
    } else {
      results.comparison[test.name] = {
        error: `Static: ${staticResult?.status || 'Unknown'}, Next.js: ${nextjsResult?.status || 'Unknown'}`
      };
      console.log(`  ${test.name}: FAILED - ${results.comparison[test.name].error}`);
    }
  }

  // Save results
  fs.writeFileSync('qa-nextjs-vs-static-results.json', JSON.stringify(results, null, 2));
  
  console.log('\n🎯 QA SUMMARY:');
  console.log('📁 Results saved to: qa-nextjs-vs-static-results.json');
  console.log('📸 Screenshots saved as: static-*-screenshot.png and nextjs-*-screenshot.png');
  
  // Count successes
  const staticSuccesses = Object.values(results.static_version).filter(r => r.status === 'SUCCESS').length;
  const nextjsSuccesses = Object.values(results.nextjs_version).filter(r => r.status === 'SUCCESS').length;
  
  console.log(`✅ Static version: ${staticSuccesses}/${tests.length} pages working`);
  console.log(`⚛️  Next.js version: ${nextjsSuccesses}/${tests.length} pages working`);
  
  if (results.console_errors.static.length > 0) {
    console.log(`\n🚨 Static console errors: ${results.console_errors.static.length}`);
  }
  
  if (results.console_errors.nextjs.length > 0) {
    console.log(`🚨 Next.js console errors: ${results.console_errors.nextjs.length}`);
  }

  await browser.close();
  return results;
}

if (require.main === module) {
  runQATest().catch(console.error);
}

module.exports = { runQATest };
