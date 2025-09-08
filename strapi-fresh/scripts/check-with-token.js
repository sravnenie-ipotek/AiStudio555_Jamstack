/**
 * Check API with Authentication Token
 * This uses the API token to bypass permissions
 */

const API_TOKEN = '6ba76f584778637fd308f48aac27461c1cf3a00b48c1e1b3bd017e87c019ea72e38e2e5c7c4bf01c1c69b039025e5a6797bb8e72ba956f86c0c5577bb59f4ab5f37d1c17a99a073e67e95ba1bc1e50c99bc02e14fde2ccfe88cad10c0b2ee091e982ad3ff4c39f696dc0e2c4d091cbd4c0037aa07f68e43097e37c90e6e96e4b';

const endpoints = [
  '/api/courses',
  '/api/blog-posts', 
  '/api/teachers',
  '/api/pricing-plans',
  '/api/job-postings',
  '/api/career-resources',
  '/api/about-page',
  '/api/contact-page',
  '/api/home-page'
];

console.log('🔑 Checking API with Authentication Token:\n');

async function checkWithAuth() {
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:1337${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const count = data.data ? (Array.isArray(data.data) ? data.data.length : 1) : 0;
        console.log(`✅ ${endpoint}: ${count} items found`);
      } else {
        console.log(`❌ ${endpoint}: ${data.error?.message || response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
  
  console.log('\n📊 Database Check:');
  
  // Also check database directly
  const { execSync } = require('child_process');
  
  try {
    const tables = execSync('sqlite3 .tmp/data.db ".tables" 2>/dev/null', { encoding: 'utf8' });
    console.log('📁 Tables found:', tables.split(/\s+/).filter(t => t.includes('courses') || t.includes('blog') || t.includes('teacher') || t.includes('pricing')).join(', '));
    
    const courseCount = execSync('sqlite3 .tmp/data.db "SELECT COUNT(*) FROM courses;" 2>/dev/null', { encoding: 'utf8' }).trim();
    console.log(`📚 Courses in DB: ${courseCount}`);
    
    const blogCount = execSync('sqlite3 .tmp/data.db "SELECT COUNT(*) FROM blog_posts;" 2>/dev/null', { encoding: 'utf8' }).trim();
    console.log(`📝 Blog posts in DB: ${blogCount}`);
    
    const teacherCount = execSync('sqlite3 .tmp/data.db "SELECT COUNT(*) FROM teachers;" 2>/dev/null', { encoding: 'utf8' }).trim();
    console.log(`👨‍🏫 Teachers in DB: ${teacherCount}`);
  } catch (error) {
    console.log('❌ Database check failed:', error.message);
  }
  
  console.log('\n🔍 Checking Strapi file structure:');
  try {
    const apiDirs = execSync('ls -d src/api/*/ 2>/dev/null | head -10', { encoding: 'utf8' });
    console.log('📂 API directories found:\n' + apiDirs);
  } catch (error) {
    console.log('❌ Could not list API directories');
  }
}

checkWithAuth();