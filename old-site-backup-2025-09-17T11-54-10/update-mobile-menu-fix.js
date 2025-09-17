#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to update HTML file
function updateHTMLFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace old mobile-menu-fix.css with mobile-menu-proper-fix.css
  if (content.includes('mobile-menu-fix.css')) {
    content = content.replace(/mobile-menu-fix\.css/g, 'mobile-menu-proper-fix.css');
    modified = true;
  } else if (!content.includes('mobile-menu-proper-fix.css')) {
    // Add new CSS if neither old nor new exists
    const cssLink = filePath.includes('/he/') || filePath.includes('/ru/') || filePath.includes('/en/')
      ? '<link href="../css/mobile-menu-proper-fix.css" rel="stylesheet" type="text/css">'
      : '<link href="css/mobile-menu-proper-fix.css" rel="stylesheet" type="text/css">';

    if (content.includes('</head>')) {
      content = content.replace('</head>', `  ${cssLink}\n</head>`);
      modified = true;
    }
  }

  // Replace old mobile-menu-initial-state.js with mobile-menu-toggle-fix.js
  if (content.includes('mobile-menu-initial-state.js')) {
    content = content.replace(/mobile-menu-initial-state\.js/g, 'mobile-menu-toggle-fix.js');
    modified = true;
  } else if (!content.includes('mobile-menu-toggle-fix.js')) {
    // Add new JS if neither old nor new exists
    const jsScript = filePath.includes('/he/') || filePath.includes('/ru/') || filePath.includes('/en/')
      ? '<script src="../js/mobile-menu-toggle-fix.js"></script>'
      : '<script src="js/mobile-menu-toggle-fix.js"></script>';

    if (content.includes('</body>')) {
      content = content.replace('</body>', `  ${jsScript}\n</body>`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${path.basename(filePath)}`);
  } else {
    console.log(`✓ ${path.basename(filePath)} already up to date`);
  }
}

// List of all HTML files to update
const htmlFiles = [
  // Hebrew pages
  '/Users/michaelmishayev/Desktop/newCode/he/home.html',
  '/Users/michaelmishayev/Desktop/newCode/he/index.html',
  '/Users/michaelmishayev/Desktop/newCode/he/courses.html',
  '/Users/michaelmishayev/Desktop/newCode/he/teachers.html',
  '/Users/michaelmishayev/Desktop/newCode/he/pricing.html',
  '/Users/michaelmishayev/Desktop/newCode/he/career-center.html',
  '/Users/michaelmishayev/Desktop/newCode/he/career-orientation.html',
  '/Users/michaelmishayev/Desktop/newCode/he/blog.html',

  // Russian pages
  '/Users/michaelmishayev/Desktop/newCode/ru/home.html',
  '/Users/michaelmishayev/Desktop/newCode/ru/index.html',
  '/Users/michaelmishayev/Desktop/newCode/ru/courses.html',
  '/Users/michaelmishayev/Desktop/newCode/ru/teachers.html',
  '/Users/michaelmishayev/Desktop/newCode/ru/pricing.html',
  '/Users/michaelmishayev/Desktop/newCode/ru/career-center.html',
  '/Users/michaelmishayev/Desktop/newCode/ru/career-orientation.html',
  '/Users/michaelmishayev/Desktop/newCode/ru/blog.html',

  // English pages
  '/Users/michaelmishayev/Desktop/newCode/en/home.html',
  '/Users/michaelmishayev/Desktop/newCode/en/index.html',
  '/Users/michaelmishayev/Desktop/newCode/en/courses.html',
  '/Users/michaelmishayev/Desktop/newCode/en/teachers.html',
  '/Users/michaelmishayev/Desktop/newCode/en/pricing.html',
  '/Users/michaelmishayev/Desktop/newCode/en/career-center.html',
  '/Users/michaelmishayev/Desktop/newCode/en/career-orientation.html',
  '/Users/michaelmishayev/Desktop/newCode/en/blog.html',

  // Root pages
  '/Users/michaelmishayev/Desktop/newCode/home.html',
  '/Users/michaelmishayev/Desktop/newCode/index.html',
  '/Users/michaelmishayev/Desktop/newCode/courses.html',
  '/Users/michaelmishayev/Desktop/newCode/teachers.html',
  '/Users/michaelmishayev/Desktop/newCode/pricing.html',
  '/Users/michaelmishayev/Desktop/newCode/career-center.html',
  '/Users/michaelmishayev/Desktop/newCode/career-orientation.html',
  '/Users/michaelmishayev/Desktop/newCode/blog.html'
];

// Update all files
console.log('🔧 Updating mobile menu fix in all HTML files...\n');
htmlFiles.forEach(updateHTMLFile);
console.log('\n✅ All files updated!');