#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// CSS link to add
const cssLink = '  <link href="../css/language-selector-mobile-fix.css" rel="stylesheet" type="text/css">';
const cssLinkRoot = '  <link href="css/language-selector-mobile-fix.css" rel="stylesheet" type="text/css">';

// Files to update
const files = [
  // Hebrew pages
  { path: '/Users/michaelmishayev/Desktop/newCode/he/home.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/index.html', link: cssLinkRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/courses.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/teachers.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/pricing.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/career-center.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/career-orientation.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/he/blog.html', link: cssLink },

  // Russian pages
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/home.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/index.html', link: cssLinkRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/courses.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/teachers.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/pricing.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/career-center.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/career-orientation.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/blog.html', link: cssLink },

  // English pages
  { path: '/Users/michaelmishayev/Desktop/newCode/en/home.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/index.html', link: cssLinkRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/courses.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/teachers.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/pricing.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/career-center.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/career-orientation.html', link: cssLink },
  { path: '/Users/michaelmishayev/Desktop/newCode/en/blog.html', link: cssLink },

  // Root pages
  { path: '/Users/michaelmishayev/Desktop/newCode/home.html', link: cssLinkRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/index.html', link: cssLinkRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/courses.html', link: cssLinkRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/teachers.html', link: cssLinkRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/pricing.html', link: cssLinkRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/career-center.html', link: cssLinkRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/career-orientation.html', link: cssLinkRoot },
  { path: '/Users/michaelmishayev/Desktop/newCode/blog.html', link: cssLinkRoot }
];

files.forEach(file => {
  if (fs.existsSync(file.path)) {
    let content = fs.readFileSync(file.path, 'utf8');

    // Check if already added
    if (content.includes('language-selector-mobile-fix.css')) {
      console.log(`✓ ${path.basename(file.path)} already has the fix`);
      return;
    }

    // Add after unified-navigation.css or before </head>
    if (content.includes('unified-navigation.css')) {
      content = content.replace(
        /<link[^>]*unified-navigation\.css[^>]*>/,
        `$&\n${file.link}`
      );
    } else if (content.includes('</head>')) {
      content = content.replace('</head>', `${file.link}\n</head>`);
    }

    fs.writeFileSync(file.path, content, 'utf8');
    console.log(`✅ Added language selector fix to ${path.basename(file.path)}`);
  } else {
    console.log(`⚠️ File not found: ${file.path}`);
  }
});

console.log('\n✅ Language selector mobile fix added to all pages!');