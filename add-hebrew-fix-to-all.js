#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Script to add to all Hebrew pages
const scriptsToAdd = `
  <!-- Hebrew Translations Fix - Must load before API integration -->
  <script src="../js/hebrew-translations-fix.js"></script>
  <!-- API Integration Scripts -->
  <script src="../js/webflow-strapi-integration.js"></script>
  <script src="../js/strapi-integration.js"></script>
  <script src="../js/ui-translator.js"></script>`;

const hebrewFiles = [
  '/Users/michaelmishayev/Desktop/newCode/he/courses.html',
  '/Users/michaelmishayev/Desktop/newCode/he/teachers.html',
  '/Users/michaelmishayev/Desktop/newCode/he/pricing.html',
  '/Users/michaelmishayev/Desktop/newCode/he/career-center.html',
  '/Users/michaelmishayev/Desktop/newCode/he/career-orientation.html',
  '/Users/michaelmishayev/Desktop/newCode/he/blog.html'
];

hebrewFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Check if scripts are already added
    if (content.includes('hebrew-translations-fix.js')) {
      console.log(`✓ ${path.basename(file)} already has the fix`);
      return;
    }

    // Find a good place to insert - before </body> tag
    if (content.includes('</body>')) {
      content = content.replace('</body>', scriptsToAdd + '\n</body>');
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Added Hebrew fix to ${path.basename(file)}`);
    } else {
      console.log(`⚠️ Could not find </body> tag in ${path.basename(file)}`);
    }
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
});

console.log('\n✅ Hebrew translation fix scripts added to all pages!');