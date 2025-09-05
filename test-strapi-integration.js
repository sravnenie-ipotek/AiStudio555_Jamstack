#!/usr/bin/env node

const http = require('http');

console.log('🎯 Testing Strapi Content Integration');
console.log('=====================================\n');

// Check if Strapi is running
function checkStrapi() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: '/api/home-page?populate=deep',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log('✅ Strapi API is accessible');
            
            if (json.data) {
              console.log('✅ Content exists in Strapi');
              const content = json.data.attributes || json.data;
              
              // Check for content sections
              const sections = [];
              if (content.heroSection) sections.push('Hero Section');
              if (content.featuredCourses) sections.push('Featured Courses');
              if (content.practiceFocus) sections.push('Practice Focus');
              if (content.onlineLearning) sections.push('Online Learning');
              if (content.alumniReviews) sections.push('Alumni Reviews');
              if (content.faqSection) sections.push('FAQ Section');
              
              if (sections.length > 0) {
                console.log('📊 Available sections:');
                sections.forEach(s => console.log(`   - ${s}`));
                
                // Check visibility toggles
                console.log('\n🔄 Visibility Settings:');
                console.log(`   - Hero: ${content.heroSectionVisible !== false ? 'visible' : 'hidden'}`);
                console.log(`   - Courses: ${content.featuredCoursesVisible !== false ? 'visible' : 'hidden'}`);
                console.log(`   - Practice: ${content.practiceFocusVisible !== false ? 'visible' : 'hidden'}`);
                console.log(`   - Online: ${content.onlineLearningVisible !== false ? 'visible' : 'hidden'}`);
                console.log(`   - Alumni: ${content.alumniReviewsVisible !== false ? 'visible' : 'hidden'}`);
                console.log(`   - FAQ: ${content.faqSectionVisible !== false ? 'visible' : 'hidden'}`);
              } else {
                console.log('⚠️ No content sections found - need to add content in Strapi');
              }
            } else {
              console.log('⚠️ No data in API response - check if content is created');
            }
            resolve(true);
          } else if (res.statusCode === 404) {
            console.log('❌ API returns 404 - permissions need configuration');
            console.log('Fix: Go to Strapi Settings → Roles → Public → enable find for home-page');
            resolve(false);
          } else {
            console.log(`❌ API returned status ${res.statusCode}`);
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Failed to parse API response');
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log('❌ Strapi is not running on localhost:1337');
      console.log('Run: cd strapi-fresh && npm run develop');
      resolve(false);
    });

    req.end();
  });
}

// Check if frontend is serving
function checkFrontend() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/home.html',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend server is running on port 8000');
        resolve(true);
      } else {
        console.log(`❌ Frontend returned status ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', () => {
      console.log('❌ Frontend server is not running on port 8000');
      console.log('Run: python3 -m http.server 8000');
      resolve(false);
    });

    req.end();
  });
}

// Main test
async function runTests() {
  console.log('1️⃣ Checking Strapi status...');
  const strapiOk = await checkStrapi();
  
  console.log('\n2️⃣ Checking frontend server...');
  const frontendOk = await checkFrontend();
  
  console.log('\n📊 Integration Status Summary');
  console.log('==============================');
  console.log(`Strapi CMS: ${strapiOk ? '✅ Running' : '❌ Not accessible'}`);
  console.log(`Frontend: ${frontendOk ? '✅ Running' : '❌ Not running'}`);
  
  if (strapiOk && frontendOk) {
    console.log('\n✅ Both services are running!');
    console.log('\n📝 Next steps to complete integration:');
    console.log('1. Open http://localhost:8000/home.html in your browser');
    console.log('2. Check browser console for content loader messages');
    console.log('3. If API returns 404, configure public permissions in Strapi');
    console.log('4. Add content to home-page in Strapi admin if needed');
    console.log('5. Update text in Strapi and refresh page to see changes');
  } else {
    console.log('\n⚠️ Please start the missing services before testing integration');
  }
  
  console.log('\n🎯 Manual Testing Instructions:');
  console.log('================================');
  console.log('1. Go to Strapi admin: http://localhost:1337/admin');
  console.log('2. Navigate to Content Manager → Home Page');
  console.log('3. Update any text (e.g., Hero title)');
  console.log('4. Save and Publish');
  console.log('5. Refresh http://localhost:8000/home.html');
  console.log('6. The updated text should appear on the page');
}

// Run the tests
runTests();