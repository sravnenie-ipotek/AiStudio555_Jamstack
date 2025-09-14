#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to add
const cssLink = '  <link href="../css/mobile-menu-fix.css" rel="stylesheet" type="text/css">';
const cssLinkRoot = '  <link href="css/mobile-menu-fix.css" rel="stylesheet" type="text/css">';
const jsScript = '  <script src="../js/mobile-menu-initial-state.js"></script>';
const jsScriptRoot = '  <script src="js/mobile-menu-initial-state.js"></script>';

// All HTML files to update
const files = [
  // Hebrew pages
  { path: '/Users/michaelmishayev/Desktop/newCode/he/home.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/index.html', css: cssLinkRoot, js: jsScriptRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/courses.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/teachers.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/pricing.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/career-center.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/career-orientation.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/blog.html', css: cssLink, js: jsScript },

  // Russian pages
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/home.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/index.html', css: cssLinkRoot, js: jsScriptRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/courses.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/teachers.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/pricing.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/career-center.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/career-orientation.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/blog.html', css: cssLink, js: jsScript },

  // English pages
  { path: '/Users/michaelmishayev/Desktop/newCode/en/home.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/index.html', css: cssLinkRoot, js: jsScriptRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/courses.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/teachers.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/pricing.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/career-center.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/career-orientation.html', css: cssLink, js: jsScript },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/blog.html', css: cssLink, js: jsScript },

  // Root pages
  { path: '/Users/michaelmishayev/Desktop/newCode/home.html', css: cssLinkRoot, js: jsScriptRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/index.html', css: cssLinkRoot, js: jsScriptRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/courses.html', css: cssLinkRoot, js: jsScriptRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/teachers.html', css: cssLinkRoot, js: jsScriptRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/pricing.html', css: cssLinkRoot, js: jsScriptRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/career-center.html', css: cssLinkRoot, js: jsScriptRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/career-orientation.html', css: cssLinkRoot, js: jsScriptRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/blog.html', css: cssLinkRoot, js: jsScriptRoot }
];

let cssAdded = 0;
let jsAdded = 0;

files.forEach(file => {
  if (fs.existsSync(file.path)) {
    let content = fs.readFileSync(file.path, 'utf8');
    let modified = false;

    // Add CSS if not already present
    if (!content.includes('mobile-menu-fix.css')) {
      // Add after language-selector-mobile-fix.css or before </head>
      if (content.includes('language-selector-mobile-fix.css')) {
        content = content.replace(
          /<link[^>]*language-selector-mobile-fix\.css[^>]*>/,
          `$&\n${file.css}`
        );
      } else if (content.includes('</head>')) {
        content = content.replace('</head>', `${file.css}\n</head>`);
      }
      cssAdded++;
      modified = true;
    }

    // Add JavaScript just before </body>
    if (!content.includes('mobile-menu-initial-state.js')) {
      content = content.replace('</body>', `${file.js}\n</body>`);
      jsAdded++;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file.path, content, 'utf8');
      console.log(`✅ Updated ${path.basename(file.path)}`);
    } else {
      console.log(`✓ ${path.basename(file.path)} already has fixes`);
    }
  } else {
    console.log(`⚠️ File not found: ${file.path}`);
  }
});

console.log(`\n✅ Mobile menu fixes applied!`);
console.log(`   - CSS added to ${cssAdded} files`);
console.log(`   - JS added to ${jsAdded} files`);