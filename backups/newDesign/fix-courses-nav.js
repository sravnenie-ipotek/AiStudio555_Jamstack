const fs = require('fs');

// Read the working home.html
const homeContent = fs.readFileSync('/Users/michaelmishayev/Desktop/newCode/backups/newDesign/home.html', 'utf8');

// Read the broken courses.html
const coursesContent = fs.readFileSync('/Users/michaelmishayev/Desktop/newCode/backups/newDesign/courses.html', 'utf8');

// Extract the working navigation from home.html
const navStart = '<nav role="navigation" class="nav-menu w-nav-menu">';
const navEnd = '</nav>';

const homeNavStartIndex = homeContent.indexOf(navStart);
const homeNavEndIndex = homeContent.indexOf(navEnd, homeNavStartIndex) + navEnd.length;
const workingNav = homeContent.substring(homeNavStartIndex, homeNavEndIndex);

// Modify the nav for courses.html (make courses active)
const coursesNav = workingNav
  .replace('class="nav-link w-nav-link">Courses</a>', 'aria-current="page" class="nav-link w-nav-link w--current">Courses</a>')
  .replace('class="nav-link w-nav-link">Home</a>', 'class="nav-link w-nav-link">Home</a>');

// Find the navigation section in courses.html
const coursesNavStartIndex = coursesContent.indexOf(navStart);
const coursesNavEndIndex = coursesContent.indexOf(navEnd, coursesNavStartIndex);

if (coursesNavStartIndex === -1 || coursesNavEndIndex === -1) {
  console.log('❌ Could not find navigation section in courses.html');
  process.exit(1);
}

// Find the next nav end (in case there are multiple broken ones)
let realNavEndIndex = coursesNavEndIndex;
let searchIndex = coursesNavEndIndex + navEnd.length;

// Keep looking for more nav ends to capture all broken structure
while (true) {
  const nextNavIndex = coursesContent.indexOf('<nav', searchIndex);
  const nextDivNavbarIndex = coursesContent.indexOf('<div class="navbar-button-wrapper">', searchIndex);

  if (nextNavIndex !== -1 && (nextDivNavbarIndex === -1 || nextNavIndex < nextDivNavbarIndex)) {
    // Found another nav, look for its end
    const nextNavEndIndex = coursesContent.indexOf(navEnd, nextNavIndex);
    if (nextNavEndIndex !== -1) {
      realNavEndIndex = nextNavEndIndex;
      searchIndex = nextNavEndIndex + navEnd.length;
    } else {
      break;
    }
  } else {
    break;
  }
}

// Replace the broken navigation with the working one
const beforeNav = coursesContent.substring(0, coursesNavStartIndex);
const afterNav = coursesContent.substring(realNavEndIndex + navEnd.length);

const fixedCoursesContent = beforeNav + coursesNav + afterNav;

// Write the fixed file
fs.writeFileSync('/Users/michaelmishayev/Desktop/newCode/backups/newDesign/courses.html', fixedCoursesContent);

console.log('✅ Fixed courses.html navigation structure');
console.log(`📊 Removed ${coursesContent.length - fixedCoursesContent.length} characters of broken HTML`);
console.log('📍 Navigation now matches home.html with courses page active');