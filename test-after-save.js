// Test script to run after saving content types
const testEndpoints = async () => {
  const endpoints = ['courses', 'blog-posts', 'teachers', 'pricing-plans'];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:1337/api/${endpoint}`);
      const data = await response.json();
      console.log(`${endpoint}: ${response.ok ? '✅ Working' : '❌ ' + data.error?.message}`);
    } catch (error) {
      console.log(`${endpoint}: ❌ ${error.message}`);
    }
  }
};

testEndpoints();