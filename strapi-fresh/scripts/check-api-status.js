/**
 * Check API Status for All Content Types
 * Run this after Strapi restarts
 */

const endpoints = [
  'http://localhost:1337/api/courses',
  'http://localhost:1337/api/blog-posts',
  'http://localhost:1337/api/teachers',
  'http://localhost:1337/api/pricing-plans',
  'http://localhost:1337/api/job-postings',
  'http://localhost:1337/api/career-resources',
  'http://localhost:1337/api/about-page',
  'http://localhost:1337/api/contact-page',
  'http://localhost:1337/api/home-page'
];

console.log('🔍 Checking API Endpoints Status:\n');
console.log('Make sure Strapi is running: npm run develop\n');

async function checkEndpoints() {
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (response.ok) {
        const count = data.data ? (Array.isArray(data.data) ? data.data.length : 1) : 0;
        console.log(`✅ ${endpoint.split('/').pop()}: ${count} items`);
      } else {
        console.log(`❌ ${endpoint.split('/').pop()}: ${data.error?.message || 'Not accessible'}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.split('/').pop()}: Connection failed`);
    }
  }
  
  console.log('\n📝 If you see errors above:');
  console.log('1. Go to Settings → Roles → Public');
  console.log('2. For each content type, enable "find" and "findOne"');
  console.log('3. Click Save');
  console.log('4. Run this script again');
}

checkEndpoints();