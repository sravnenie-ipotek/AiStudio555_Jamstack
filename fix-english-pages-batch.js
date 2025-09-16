#!/usr/bin/env node

/**
 * Batch fix for English pages:
 * 1. Remove duplicate createLanguageSwitcher function
 * 2. Fix logo file path case
 * 3. Add menu-critical-fixes.css
 */

const fs = require('fs');
const path = require('path');

const englishPages = [
  '/Users/michaelmishayev/Desktop/newCode/en/career-orientation.html',
  '/Users/michaelmishayev/Desktop/newCode/en/career-center.html',
  '/Users/michaelmishayev/Desktop/newCode/en/teachers.html',
  '/Users/michaelmishayev/Desktop/newCode/en/blog.html',
  '/Users/michaelmishayev/Desktop/newCode/courses.html',
  '/Users/michaelmishayev/Desktop/newCode/teachers.html',
  '/Users/michaelmishayev/Desktop/newCode/career-center.html',
  '/Users/michaelmishayev/Desktop/newCode/career-orientation.html',
  '/Users/michaelmishayev/Desktop/newCode/pricing.html',
  '/Users/michaelmishayev/Desktop/newCode/about-us.html',
  '/Users/michaelmishayev/Desktop/newCode/contact-us.html',
  '/Users/michaelmishayev/Desktop/newCode/blog.html'
];

function fixPage(filePath) {
  console.log(`Fixing: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix logo file path case (Logo.svg -> logo.svg)
  if (content.includes('src="images/Logo.svg"')) {
    content = content.replace(/src="images\/Logo\.svg"/g, 'src="images/logo.svg"');
    changed = true;
    console.log('  ✅ Fixed logo file path case');
  }

  // For English subdirectory pages, fix relative path
  if (content.includes('src="../images/Logo.svg"')) {
    content = content.replace(/src="\.\.\/images\/Logo\.svg"/g, 'src="../images/logo.svg"');
    changed = true;
    console.log('  ✅ Fixed relative logo file path case');
  }

  // 2. Remove createLanguageSwitcher function
  const functionStart = content.indexOf('function createLanguageSwitcher()');
  if (functionStart !== -1) {
    // Find the matching closing brace
    let braceCount = 0;
    let functionEnd = functionStart;
    let inFunction = false;

    for (let i = functionStart; i < content.length; i++) {
      if (content[i] === '{') {
        braceCount++;
        inFunction = true;
      } else if (content[i] === '}') {
        braceCount--;
        if (inFunction && braceCount === 0) {
          functionEnd = i + 1;
          break;
        }
      }
    }

    const functionText = content.substring(functionStart, functionEnd);
    content = content.replace(functionText, '// REMOVED: createLanguageSwitcher function - using integrated nav selector instead');
    changed = true;
    console.log('  ✅ Removed createLanguageSwitcher function');
  }

  // 3. Remove function calls
  if (content.includes('createLanguageSwitcher')) {
    content = content.replace(/document\.addEventListener\('DOMContentLoaded', createLanguageSwitcher\);/g,
                              '// REMOVED: createLanguageSwitcher call');
    content = content.replace(/createLanguageSwitcher\(\);/g,
                              '// REMOVED: createLanguageSwitcher call');
    changed = true;
    console.log('  ✅ Removed createLanguageSwitcher calls');
  }

  // 4. Add CSS link if not present
  if (!content.includes('menu-critical-fixes.css')) {
    // For root level pages
    if (!filePath.includes('/en/')) {
      const cssInsertPoint = content.lastIndexOf('<link href="css/');
      if (cssInsertPoint !== -1) {
        const lineEnd = content.indexOf('\n', cssInsertPoint);
        content = content.substring(0, lineEnd) +
                 '\n  <link href="css/menu-critical-fixes.css" rel="stylesheet" type="text/css">' +
                 content.substring(lineEnd);
        changed = true;
        console.log('  ✅ Added menu-critical-fixes.css');
      }
    } else {
      // For /en/ subdirectory pages
      const cssInsertPoint = content.lastIndexOf('<link href="../css/');
      if (cssInsertPoint !== -1) {
        const lineEnd = content.indexOf('\n', cssInsertPoint);
        content = content.substring(0, lineEnd) +
                 '\n  <link href="../css/menu-critical-fixes.css" rel="stylesheet" type="text/css">' +
                 content.substring(lineEnd);
        changed = true;
        console.log('  ✅ Added ../css/menu-critical-fixes.css');
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Saved changes to ${filePath}`);
  } else {
    console.log('  ✨ No changes needed');
  }
}

console.log('🔧 Starting batch fix for English pages...\n');

for (const filePath of englishPages) {
  fixPage(filePath);
  console.log('');
}

console.log('✅ Batch fix completed!');