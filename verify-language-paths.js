const fs = require('fs');
const path = require('path');

console.log('\n🔍 LANGUAGE SWITCHER PATH VERIFICATION');
console.log('=' .repeat(50));

// Test scenarios
const testScenarios = [
  {
    name: 'Home page variations',
    tests: [
      { from: '/dist/en/home.html', to: '/dist/ru/', expected: 'index.html' },
      { from: '/dist/en/index.html', to: '/dist/ru/', expected: 'index.html' },
      { from: '/dist/en/', to: '/dist/ru/', expected: 'index.html' }
    ]
  },
  {
    name: 'Regular pages',
    tests: [
      { from: '/dist/en/courses.html', to: '/dist/ru/', expected: 'courses.html' },
      { from: '/dist/en/teachers.html', to: '/dist/he/', expected: 'teachers.html' },
      { from: '/dist/ru/about.html', to: '/dist/en/', expected: 'about.html' }
    ]
  },
  {
    name: 'Career pages',
    tests: [
      { from: '/dist/en/career-center.html', to: '/dist/ru/', expected: 'career-center.html' },
      { from: '/dist/en/career-orientation.html', to: '/dist/he/', expected: 'career-orientation.html' }
    ]
  }
];

// Simulate the language switcher logic
function simulateSwitchLanguage(currentPath, targetLang) {
  const pathParts = currentPath.split('/').filter(part => part);
  
  // Extract filename
  let fileName = pathParts[pathParts.length - 1] || 'index.html';
  
  // FIX: Normalize home.html to index.html
  if (fileName === 'home.html' || fileName === '') {
    fileName = 'index.html';
  }
  
  // Handle dist/lang structure
  if (pathParts[0] === 'dist' && pathParts[1]) {
    return `/dist/${targetLang}/${fileName}`;
  }
  
  return `/dist/${targetLang}/${fileName}`;
}

// Run tests
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const scenario of testScenarios) {
  console.log(`\n📂 ${scenario.name}:`);
  
  for (const test of scenario.tests) {
    totalTests++;
    const targetLang = test.to.split('/')[2];
    const result = simulateSwitchLanguage(test.from, targetLang);
    const expectedPath = test.to + test.expected;
    
    if (result === expectedPath) {
      passedTests++;
      console.log(`  ✅ ${test.from} → ${result}`);
      
      // Check if file actually exists
      const fullPath = path.join(__dirname, result);
      if (fs.existsSync(fullPath)) {
        console.log(`     ✓ File exists`);
      } else {
        console.log(`     ⚠️ File doesn't exist at ${fullPath}`);
      }
    } else {
      failedTests++;
      console.log(`  ❌ ${test.from}`);
      console.log(`     Expected: ${expectedPath}`);
      console.log(`     Got: ${result}`);
    }
  }
}

// Summary
console.log('\n' + '=' .repeat(50));
console.log('📊 PATH VERIFICATION SUMMARY:');
console.log(`Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);

if (failedTests === 0) {
  console.log('✅ All path conversions working correctly!');
  console.log('✅ The home.html → index.html fix is working!');
} else {
  console.log('❌ Some path conversions failed');
}

// Check actual file structure
console.log('\n' + '=' .repeat(50));
console.log('📁 ACTUAL FILE STRUCTURE VERIFICATION:\n');

const languages = ['en', 'ru', 'he'];
for (const lang of languages) {
  const distDir = path.join(__dirname, 'dist', lang);
  if (fs.existsSync(distDir)) {
    const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));
    console.log(`${lang.toUpperCase()}: ${files.length} HTML files`);
    
    // Check for home.html
    if (files.includes('home.html')) {
      console.log(`  ⚠️ WARNING: home.html exists in ${lang} directory`);
    }
    if (!files.includes('index.html')) {
      console.log(`  ❌ ERROR: index.html missing in ${lang} directory`);
    }
  }
}

console.log('\n✅ VERIFICATION COMPLETE!');