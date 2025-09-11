const fs = require('fs');
const path = require('path');

// The correct navigation structure that should be on ALL pages
const correctNavStructure = `            <a href="home.html" class="nav-link w-nav-link">Home</a>
            <a href="courses.html" class="nav-link w-nav-link">Courses</a>
            <a href="teachers.html" class="nav-link w-nav-link">Teachers</a>
            <div data-delay="0" data-hover="true" class="menu-dropdown-wrapper w-dropdown">
              <div class="dropdown-toggle w-dropdown-toggle">
                <div class="dropdown-toggle-text-block">Career Services</div>
                <div class="dropdown-toggle-arrow-2">▼</div>
              </div>
              <nav class="dropdown-list w-dropdown-list">
                <a href="career-orientation.html" class="dropdown-menu-text-link-block w-inline-block">
                  <div>Career Orientation</div>
                </a>
                <a href="career-center.html" class="dropdown-menu-text-link-block w-inline-block">
                  <div>Career Center</div>
                </a>
              </nav>
            </div>
            <a href="pricing.html" class="nav-link w-nav-link">Pricing</a>`;

// Function to fix navigation in a file
function fixNavigation(filePath, fileName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the nav menu section
    const navMenuStart = content.indexOf('<nav role="navigation" class="nav-menu w-nav-menu">');
    if (navMenuStart === -1) {
      console.log(`⚠️ No nav menu found in ${fileName}`);
      return false;
    }
    
    // Find where the nav menu content starts (after the opening tag)
    const contentStart = navMenuStart + '<nav role="navigation" class="nav-menu w-nav-menu">'.length;
    
    // Find the mobile button wrapper which comes after the navigation items
    const mobileButtonStart = content.indexOf('<div class="primary-button-wrapper mobile">', contentStart);
    if (mobileButtonStart === -1) {
      console.log(`⚠️ No mobile button wrapper found in ${fileName}`);
      return false;
    }
    
    // Create the new nav structure with proper current page highlighting
    let newNavStructure = correctNavStructure;
    
    // Adjust the current page indicator based on filename
    if (fileName.includes('home.html')) {
      newNavStructure = newNavStructure.replace(
        '<a href="home.html" class="nav-link w-nav-link">Home</a>',
        '<a href="home.html" aria-current="page" class="nav-link w-nav-link w--current">Home</a>'
      );
    } else if (fileName.includes('courses.html')) {
      newNavStructure = newNavStructure.replace(
        '<a href="courses.html" class="nav-link w-nav-link">Courses</a>',
        '<a href="courses.html" aria-current="page" class="nav-link w-nav-link w--current">Courses</a>'
      );
    } else if (fileName.includes('teachers.html')) {
      newNavStructure = newNavStructure.replace(
        '<a href="teachers.html" class="nav-link w-nav-link">Teachers</a>',
        '<a href="teachers.html" aria-current="page" class="nav-link w-nav-link w--current">Teachers</a>'
      );
    } else if (fileName.includes('pricing.html')) {
      newNavStructure = newNavStructure.replace(
        '<a href="pricing.html" class="nav-link w-nav-link">Pricing</a>',
        '<a href="pricing.html" aria-current="page" class="nav-link w-nav-link w--current">Pricing</a>'
      );
    } else if (fileName.includes('career-orientation.html')) {
      newNavStructure = newNavStructure.replace(
        '<a href="career-orientation.html" class="dropdown-menu-text-link-block w-inline-block">',
        '<a href="career-orientation.html" aria-current="page" class="dropdown-menu-text-link-block w-inline-block w--current">'
      );
    } else if (fileName.includes('career-center.html')) {
      newNavStructure = newNavStructure.replace(
        '<a href="career-center.html" class="dropdown-menu-text-link-block w-inline-block">',
        '<a href="career-center.html" aria-current="page" class="dropdown-menu-text-link-block w-inline-block w--current">'
      );
    }
    
    // Replace the navigation content
    const newContent = 
      content.substring(0, contentStart) + 
      '\n' + newNavStructure + '\n            ' +
      content.substring(mobileButtonStart);
    
    // Write the fixed content back
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Fixed navigation in: ${fileName}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
    return false;
  }
}

// List of all navigation files to fix
const filesToFix = [
  // English directory
  'en/home.html',
  'en/courses.html',
  'en/teachers.html',
  'en/pricing.html',
  'en/career-orientation.html',
  'en/career-center.html',
  'en/blog.html',
  // Russian directory
  'ru/home.html',
  'ru/courses.html',
  'ru/teachers.html',
  'ru/pricing.html',
  'ru/career-orientation.html',
  'ru/career-center.html',
  'ru/blog.html',
  // Hebrew directory
  'he/home.html',
  'he/courses.html',
  'he/teachers.html',
  'he/pricing.html',
  'he/career-orientation.html',
  'he/career-center.html',
  'he/blog.html',
  // Root directory
  'home.html',
  'courses.html',
  'teachers.html',
  'pricing.html',
  'career-orientation.html',
  'career-center.html',
  'blog.html'
];

let successCount = 0;
let totalCount = 0;

console.log('🔧 Fixing navigation consistency across all pages...\n');

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    totalCount++;
    if (fixNavigation(filePath, file)) {
      successCount++;
    }
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Total files processed: ${totalCount}`);
console.log(`   Successfully fixed: ${successCount}`);
console.log(`   Navigation is now consistent across all pages!`);