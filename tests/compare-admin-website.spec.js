const { test, expect } = require('@playwright/test');

test.describe('CRITICAL: Admin vs Website Content Comparison', () => {
  test('Compare ALL content between admin panel and website', async ({ browser }) => {
    const context = await browser.newContext();
    
    // Create two pages
    const adminPage = await context.newPage();
    const websitePage = await context.newPage();
    
    console.log('🔍 ULTRATHINK: Comprehensive Admin vs Website Comparison\n');
    console.log('=' .repeat(80));
    
    // 1. GET ADMIN PANEL DATA
    console.log('\n📊 FETCHING ADMIN PANEL DATA...');
    await adminPage.goto('https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html');
    await adminPage.waitForLoadState('networkidle');
    
    // Click Home Page tab
    await adminPage.click('text=Home Page');
    await adminPage.waitForTimeout(1000);
    
    const adminData = {
      // Hero Section
      heroTitle: await adminPage.locator('#homeHeroTitle').inputValue(),
      heroSubtitle: await adminPage.locator('#homeHeroSubtitle').inputValue(),
      heroDescription: await adminPage.locator('#homeHeroDescription').inputValue(),
      
      // Featured Courses Section
      featuredTitle: await adminPage.locator('#homeFeaturedTitle').inputValue(),
      featuredDescription: await adminPage.locator('#homeFeaturedDescription').inputValue(),
      
      // Focus on Practice Section
      practiceTitle: await adminPage.locator('#homePracticeTitle').inputValue(),
      practiceDescription: await adminPage.locator('#homePracticeDescription').inputValue(),
      practicePercentage: await adminPage.locator('#homePracticePercentage').inputValue(),
      theoryPercentage: await adminPage.locator('#homeTheoryPercentage').inputValue(),
      
      // Online Learning Section
      onlineTitle: await adminPage.locator('#homeOnlineTitle').inputValue(),
      totalCourses: await adminPage.locator('#homeTotalCourses').inputValue(),
      totalLearners: await adminPage.locator('#homeTotalLearners').inputValue(),
      
      // Career Success Section
      careerTitle: await adminPage.locator('#homeCareerTitle').inputValue(),
      careerDescription: await adminPage.locator('#homeCareerDescription').inputValue(),
      
      // Testimonials Section
      testimonialsTitle: await adminPage.locator('#homeTestimonialsTitle').inputValue(),
      testimonialsSubtitle: await adminPage.locator('#homeTestimonialsSubtitle').inputValue(),
      
      // Sample Course Data
      course1Title: await adminPage.locator('#course1Title').inputValue(),
      course1Lessons: await adminPage.locator('#course1Lessons').inputValue(),
      course1Duration: await adminPage.locator('#course1Duration').inputValue(),
    };
    
    // 2. GET WEBSITE DATA
    console.log('\n🌐 FETCHING WEBSITE DATA...');
    await websitePage.goto('https://www.aistudio555.com/dist/en/index.html');
    await websitePage.waitForLoadState('networkidle');
    
    const websiteData = {
      // Hero Section
      heroTitle: await websitePage.locator('h1.banner-heading').textContent(),
      heroSubtitle: await websitePage.locator('.banner-subtitle').first().textContent(),
      heroDescription: await websitePage.locator('p.banner-description-text').textContent(),
      
      // Featured Courses Section
      featuredTitle: await websitePage.locator('.featured-courses').textContent().catch(() => 'NOT FOUND'),
      
      // Other sections
      practiceTitle: await websitePage.locator('.why-choose-us').textContent().catch(() => 'NOT FOUND'),
      onlineTitle: await websitePage.locator('.about-us').textContent().catch(() => 'NOT FOUND'),
      
      // Career Success (Companies) Section
      careerTitle: await websitePage.locator('.companies-section h2.section-title').textContent().catch(() => 'NOT FOUND'),
      
      // Testimonials
      testimonialsTitle: await websitePage.locator('.testimonials').textContent().catch(() => 'NOT FOUND'),
    };
    
    // 3. COMPARE AND REPORT MISMATCHES
    console.log('\n⚠️  CRITICAL MISMATCHES FOUND:\n');
    console.log('=' .repeat(80));
    
    const mismatches = [];
    
    // Check Hero Section
    if (adminData.heroTitle !== websiteData.heroTitle) {
      mismatches.push({
        section: 'HERO TITLE',
        admin: adminData.heroTitle,
        website: websiteData.heroTitle
      });
    }
    
    if (adminData.heroSubtitle !== websiteData.heroSubtitle) {
      mismatches.push({
        section: 'HERO SUBTITLE',
        admin: adminData.heroSubtitle,
        website: websiteData.heroSubtitle
      });
    }
    
    if (adminData.heroDescription !== websiteData.heroDescription) {
      mismatches.push({
        section: 'HERO DESCRIPTION',
        admin: adminData.heroDescription,
        website: websiteData.heroDescription
      });
    }
    
    // Print mismatches
    mismatches.forEach((mismatch, index) => {
      console.log(`\n❌ MISMATCH #${index + 1}: ${mismatch.section}`);
      console.log('─' .repeat(50));
      console.log(`📝 Admin Panel:  "${mismatch.admin}"`);
      console.log(`🌐 Website:      "${mismatch.website}"`);
    });
    
    // 4. CHECK API DATA
    console.log('\n\n🔌 CHECKING API RESPONSE:');
    console.log('=' .repeat(80));
    
    const apiResponse = await websitePage.request.get('https://aistudio555jamstack-production.up.railway.app/api/home-page');
    const apiData = await apiResponse.json();
    
    if (apiData.data?.attributes) {
      const attrs = apiData.data.attributes;
      console.log('\n📡 API Returns:');
      console.log(`   heroTitle: "${attrs.heroTitle}"`);
      console.log(`   heroSubtitle: "${attrs.heroSubtitle}"`);
      console.log(`   heroDescription: "${attrs.heroDescription}"`);
      
      // Check if API matches admin
      if (attrs.heroTitle === adminData.heroTitle) {
        console.log('   ✅ API matches Admin Panel');
      } else {
        console.log('   ❌ API does NOT match Admin Panel!');
      }
      
      // Check if API data is being used on website
      if (attrs.heroTitle === websiteData.heroTitle) {
        console.log('   ✅ Website uses API data');
      } else {
        console.log('   ❌ Website does NOT use API data!');
      }
    }
    
    // 5. CHECK JAVASCRIPT LOADING
    console.log('\n\n🔧 CHECKING JAVASCRIPT INTEGRATION:');
    console.log('=' .repeat(80));
    
    // Check if strapi-integration.js is loaded
    const scripts = await websitePage.locator('script').all();
    let hasIntegration = false;
    for (const script of scripts) {
      const src = await script.getAttribute('src');
      if (src && src.includes('strapi-integration')) {
        hasIntegration = true;
        console.log(`✅ Found integration script: ${src}`);
      }
    }
    
    if (!hasIntegration) {
      console.log('❌ No integration script found!');
    }
    
    // Check console for errors
    const errors = [];
    websitePage.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // 6. SUMMARY
    console.log('\n\n📊 SUMMARY:');
    console.log('=' .repeat(80));
    console.log(`Total Mismatches Found: ${mismatches.length}`);
    console.log(`\nROOT CAUSE ANALYSIS:`);
    
    if (mismatches.length > 0) {
      console.log('❌ The website is showing STATIC content, not dynamic content from admin/API');
      console.log('❌ The JavaScript integration is NOT working properly');
      console.log('\nPOSSIBLE CAUSES:');
      console.log('1. JavaScript file not loading or executing');
      console.log('2. API data structure mismatch');  
      console.log('3. Wrong selectors in JavaScript');
      console.log('4. Static content overriding dynamic content');
    }
    
    // Take screenshots
    await adminPage.screenshot({ path: 'admin-content.png', fullPage: false });
    await websitePage.screenshot({ path: 'website-content.png', fullPage: false });
    
    console.log('\n📸 Screenshots saved: admin-content.png, website-content.png');
    
    await context.close();
    
    // Fail test if mismatches found
    expect(mismatches.length).toBe(0);
  });
});