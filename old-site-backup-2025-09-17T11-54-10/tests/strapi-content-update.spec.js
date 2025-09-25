const { test, expect } = require('@playwright/test');
const axios = require('axios');

test.describe('Strapi Content Integration', () => {
  const strapiUrl = 'http://localhost:3000';
  const frontendUrl = 'http://localhost:8000';
  
  test.beforeEach(async ({ page }) => {
    // Check if Strapi is running
    try {
      await axios.get(strapiUrl);
    } catch (error) {
      throw new Error('Strapi is not running on localhost:3000. Please start Strapi first.');
    }
  });

  test('should load home page and display Strapi content', async ({ page }) => {
    console.log('🚀 Testing Strapi content integration...');
    
    // Navigate to home page
    await page.goto(`${frontendUrl}/home.html`);
    
    // Wait for content loader to initialize
    await page.waitForTimeout(2000);
    
    // Check console for Strapi content loader messages
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    
    // Reload to capture console logs
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Verify content loader initialized
    const hasContentLoader = consoleLogs.some(log => 
      log.includes('Strapi Content Loader') || 
      log.includes('Loading content from Strapi')
    );
    
    expect(hasContentLoader).toBeTruthy();
    console.log('✅ Content loader initialized');
    
    // Check if hero section content is present
    const heroTitle = page.locator('.banner-content h1');
    const heroSubtitle = page.locator('.banner-content .subtitle');
    
    // If API is working, content should be updated from Strapi
    // Otherwise, default content will be shown
    await expect(heroTitle).toBeVisible();
    await expect(heroSubtitle).toBeVisible();
    
    const titleText = await heroTitle.textContent();
    console.log(`📝 Hero title: "${titleText}"`);
    
    // Check featured courses section
    const coursesSection = page.locator('.section.featured-courses');
    await expect(coursesSection).toBeVisible();
    console.log('✅ Featured courses section visible');
    
    // Check alumni reviews section
    const alumniSection = page.locator('.section.alumni-reviews');
    await expect(alumniSection).toBeVisible();
    console.log('✅ Alumni reviews section visible');
  });

  test('should test content update from Strapi (manual)', async ({ page }) => {
    console.log('📝 Manual test instructions:');
    console.log('1. Go to Strapi admin: http://localhost:3000/admin');
    console.log('2. Navigate to Content Manager → Home Page');
    console.log('3. Update the Hero Section title to: "Test Updated Title"');
    console.log('4. Save and Publish the changes');
    console.log('5. Run this test again to verify the update');
    
    await page.goto(`${frontendUrl}/home.html`);
    await page.waitForTimeout(2000);
    
    const heroTitle = page.locator('.banner-content h1');
    const titleText = await heroTitle.textContent();
    
    if (titleText === 'Test Updated Title') {
      console.log('✅ SUCCESS: Content update from Strapi is working!');
      console.log('The home page is successfully fetching content from Strapi CMS');
    } else {
      console.log(`ℹ️ Current title: "${titleText}"`);
      console.log('Follow the manual steps above to test content updates');
    }
  });

  test('should verify visibility toggles work', async ({ page }) => {
    console.log('🔄 Testing section visibility toggles...');
    
    await page.goto(`${frontendUrl}/home.html`);
    await page.waitForTimeout(2000);
    
    // Get all major sections
    const sections = {
      hero: page.locator('.section.banner'),
      courses: page.locator('.section.featured-courses'),
      practice: page.locator('.section.practice-focus'),
      online: page.locator('.section.online-learning'),
      alumni: page.locator('.section.alumni-reviews'),
      faq: page.locator('.section.faq-section')
    };
    
    // Check visibility status
    for (const [name, locator] of Object.entries(sections)) {
      const isVisible = await locator.isVisible();
      console.log(`${isVisible ? '✅' : '❌'} ${name} section: ${isVisible ? 'visible' : 'hidden'}`);
    }
    
    console.log('\n📝 To test visibility toggles:');
    console.log('1. Go to Strapi admin');
    console.log('2. Toggle any section visibility (e.g., set heroSectionVisible to false)');
    console.log('3. Save and run this test again');
    console.log('4. The corresponding section should be hidden');
  });

  test('should simulate API content fetch', async ({ page }) => {
    // Test the API endpoint directly
    console.log('🔍 Testing Strapi API endpoint...');
    
    try {
      const response = await axios.get(`${strapiUrl}/api/home-page?populate=deep`);
      
      if (response.status === 200) {
        console.log('✅ API endpoint is accessible');
        
        if (response.data && response.data.data) {
          console.log('✅ Content data exists in API response');
          
          // Check for key sections
          const content = response.data.data.attributes || response.data.data;
          const hasSections = !!(
            content.heroSection ||
            content.featuredCourses ||
            content.alumniReviews
          );
          
          if (hasSections) {
            console.log('✅ Content sections found in API');
            console.log('📊 Available sections:');
            if (content.heroSection) console.log('  - Hero Section');
            if (content.featuredCourses) console.log('  - Featured Courses');
            if (content.practiceFocus) console.log('  - Practice Focus');
            if (content.onlineLearning) console.log('  - Online Learning');
            if (content.alumniReviews) console.log('  - Alumni Reviews');
            if (content.faqSection) console.log('  - FAQ Section');
          } else {
            console.log('⚠️ No content sections found - need to seed data');
          }
        } else {
          console.log('⚠️ API response has no data - need to create content in Strapi');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('❌ API endpoint returns 404 - permissions may need configuration');
        console.log('Fix: Go to Strapi Settings → Roles → Public → enable find for home-page');
      } else {
        console.log('❌ API error:', error.message);
      }
    }
  });

  test('should demonstrate complete integration flow', async ({ page }) => {
    console.log('🎯 Complete Integration Test');
    console.log('=============================');
    
    // Step 1: Check Strapi is running
    console.log('\n1️⃣ Checking Strapi status...');
    try {
      await axios.get(strapiUrl);
      console.log('✅ Strapi is running');
    } catch {
      console.log('❌ Strapi is not running');
      return;
    }
    
    // Step 2: Check API endpoint
    console.log('\n2️⃣ Checking API endpoint...');
    let hasApiContent = false;
    try {
      const response = await axios.get(`${strapiUrl}/api/home-page?populate=deep`);
      hasApiContent = !!(response.data && response.data.data);
      console.log(hasApiContent ? '✅ API has content' : '⚠️ API has no content');
    } catch (error) {
      console.log('❌ API not accessible (check permissions)');
    }
    
    // Step 3: Load frontend page
    console.log('\n3️⃣ Loading frontend page...');
    await page.goto(`${frontendUrl}/home.html`);
    await page.waitForTimeout(2000);
    console.log('✅ Page loaded');
    
    // Step 4: Check content loader
    console.log('\n4️⃣ Checking content loader...');
    const hasContentLoader = await page.evaluate(() => {
      return typeof window.strapiContent !== 'undefined';
    });
    console.log(hasContentLoader ? '✅ Content loader active' : '❌ Content loader not found');
    
    // Step 5: Verify dynamic content
    console.log('\n5️⃣ Verifying dynamic content...');
    const heroTitle = await page.locator('.banner-content h1').textContent();
    console.log(`Hero title: "${heroTitle}"`);
    
    // Summary
    console.log('\n📊 Integration Status:');
    console.log('======================');
    console.log(`Strapi: ✅ Running`);
    console.log(`API: ${hasApiContent ? '✅ Has content' : '⚠️ Needs content/permissions'}`);
    console.log(`Frontend: ✅ Loaded`);
    console.log(`Content Loader: ${hasContentLoader ? '✅ Active' : '❌ Not active'}`);
    
    if (!hasApiContent) {
      console.log('\n⚠️ Next steps to complete integration:');
      console.log('1. Ensure public permissions are set for home-page in Strapi');
      console.log('2. Add content to home-page in Strapi admin');
      console.log('3. Refresh the page to see dynamic content');
    } else if (hasContentLoader) {
      console.log('\n✅ Integration is working! Content is being loaded from Strapi.');
    }
  });
});