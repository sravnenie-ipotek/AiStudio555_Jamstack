#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// CSS to add
const cssLink = '<link href="css/mobile-fix.css" rel="stylesheet" type="text/css">';
const cssLinkAlt = '<link href="../css/mobile-fix.css" rel="stylesheet" type="text/css">';

// JS to add
const jsScript = '<script src="js/mobile-menu-fix.js"></script>';
const jsScriptAlt = '<script src="../js/mobile-menu-fix.js"></script>';

// Function to add mobile fixes to HTML file
function addMobileFixes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Determine if we need relative paths
    const isInSubdir = filePath.includes('/dist/') || filePath.includes('/en/') || 
                       filePath.includes('/ru/') || filePath.includes('/he/');
    
    const cssToAdd = isInSubdir ? cssLinkAlt : cssLink;
    const jsToAdd = isInSubdir ? jsScriptAlt : jsScript;
    
    // Add CSS if not already present
    if (!content.includes('mobile-fix.css')) {
      // Add after the last CSS link in head
      const headMatch = content.match(/<\/head>/i);
      if (headMatch) {
        content = content.replace(/<\/head>/i, `  ${cssToAdd}\n</head>`);
        modified = true;
        console.log(`✅ Added mobile-fix.css to ${filePath}`);
      }
    }
    
    // Add JS if not already present
    if (!content.includes('mobile-menu-fix.js')) {
      // Add before closing body tag
      const bodyMatch = content.match(/<\/body>/i);
      if (bodyMatch) {
        content = content.replace(/<\/body>/i, `  ${jsToAdd}\n</body>`);
        modified = true;
        console.log(`✅ Added mobile-menu-fix.js to ${filePath}`);
      }
    }
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all HTML files
function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other unnecessary directories
      if (!['node_modules', '.git', 'images', 'css', 'js', 'fonts'].includes(item)) {
        findHtmlFiles(fullPath, files);
      }
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
console.log('🔧 Adding mobile fixes to all HTML files...\n');

const htmlFiles = findHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML files\n`);

let modifiedCount = 0;

for (const file of htmlFiles) {
  if (addMobileFixes(file)) {
    modifiedCount++;
  }
}

console.log(`\n✨ Complete! Modified ${modifiedCount} files.`);

// List of critical pages to verify
const criticalPages = [
  'home.html',
  'index.html',
  'courses.html',
  'teachers.html',
  'career-center.html',
  'career-orientation.html',
  'about-us.html',
  'contact-us.html',
  'blog.html',
  'pricing.html'
];

console.log('\n📋 Verifying critical pages:');
for (const page of criticalPages) {
  const mainPage = `./${page}`;
  const enPage = `./en/${page}`;
  const ruPage = `./ru/${page}`;
  const hePage = `./he/${page}`;
  const distEnPage = `./dist/en/${page}`;
  const distRuPage = `./dist/ru/${page}`;
  const distHePage = `./dist/he/${page}`;
  
  const pages = [mainPage, enPage, ruPage, hePage, distEnPage, distRuPage, distHePage];
  
  for (const p of pages) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      if (content.includes('mobile-fix.css') && content.includes('mobile-menu-fix.js')) {
        console.log(`✅ ${p}`);
      } else {
        console.log(`⚠️  ${p} - Missing mobile fixes`);
      }
    }
  }
}