const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Navigation Consistency\n');
console.log('Expected menu structure:');
console.log('  ✓ Home');
console.log('  ✓ Courses');
console.log('  ✓ Teachers');
console.log('  ✓ Career Services (dropdown)');
console.log('    - Career Orientation');
console.log('    - Career Center');
console.log('  ✓ Pricing');
console.log('\n' + '='.repeat(50) + '\n');

const filesToCheck = [
  'en/home.html',
  'en/courses.html',
  'en/teachers.html',
  'en/pricing.html',
  'en/career-orientation.html',
  'en/career-center.html'
];

let allConsistent = true;

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for required menu items
    const hasHome = content.includes('href="home.html"') && content.includes('>Home</a>');
    const hasCourses = content.includes('href="courses.html"') && content.includes('>Courses</a>');
    const hasTeachers = content.includes('href="teachers.html"') && content.includes('>Teachers</a>');
    const hasPricing = content.includes('href="pricing.html"') && content.includes('>Pricing</a>');
    const hasCareerServices = content.includes('Career Services');
    const hasCareerOrientation = content.includes('href="career-orientation.html"');
    const hasCareerCenter = content.includes('href="career-center.html"');
    
    // Check for unwanted items
    const hasPages = content.includes('>Pages<');
    const hasBlogInNav = content.includes('class="nav-link') && content.includes('>Blog</a>');
    
    console.log(`📄 ${file}:`);
    console.log(`  ✓ Home: ${hasHome ? '✅' : '❌'}`);
    console.log(`  ✓ Courses: ${hasCourses ? '✅' : '❌'}`);
    console.log(`  ✓ Teachers: ${hasTeachers ? '✅' : '❌'}`);
    console.log(`  ✓ Career Services: ${hasCareerServices ? '✅' : '❌'}`);
    console.log(`    - Career Orientation: ${hasCareerOrientation ? '✅' : '❌'}`);
    console.log(`    - Career Center: ${hasCareerCenter ? '✅' : '❌'}`);
    console.log(`  ✓ Pricing: ${hasPricing ? '✅' : '❌'}`);
    console.log(`  ✗ No "Pages" dropdown: ${!hasPages ? '✅' : '❌ FOUND!'}`);
    
    if (!hasHome || !hasCourses || !hasTeachers || !hasPricing || 
        !hasCareerServices || !hasCareerOrientation || !hasCareerCenter || hasPages) {
      allConsistent = false;
    }
    
    console.log('');
  }
});

console.log('='.repeat(50));
if (allConsistent) {
  console.log('✅ SUCCESS: All checked pages have consistent navigation!');
} else {
  console.log('❌ ISSUE: Some pages have inconsistent navigation.');
}
console.log('='.repeat(50));