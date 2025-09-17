const fs = require('fs');
const path = require('path');

const pagesToFix = [
  '/en/teachers.html',
  '/en/pricing.html',
  '/en/career-center.html',
  '/en/about-us.html',
  '/en/blog.html',
  '/en/contact-us.html'
];

let fixedCount = 0;
let errors = [];

pagesToFix.forEach(pagePath => {
  const filePath = path.join(__dirname, pagePath);

  try {
    console.log(`\n📝 Processing ${pagePath}...`);

    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if universal-mobile-navigation-fix.js is already present
    if (content.includes('universal-mobile-navigation-fix.js')) {
      console.log(`   ✅ Already has universal-mobile-navigation-fix.js`);
      return;
    }

    // Look for where to add the script
    // Try to find mobile-menu-toggle-fix.js and replace it
    if (content.includes('<script src="../js/mobile-menu-toggle-fix.js"></script>')) {
      content = content.replace(
        '<script src="../js/mobile-menu-toggle-fix.js"></script>',
        '<script src="../js/universal-mobile-navigation-fix.js"></script>'
      );
      console.log(`   ✅ Replaced mobile-menu-toggle-fix.js with universal-mobile-navigation-fix.js`);
    }
    // Try to find navigation-responsive-fix.js and add after it
    else if (content.includes('<script src="../js/navigation-responsive-fix.js"></script>')) {
      content = content.replace(
        '<script src="../js/navigation-responsive-fix.js"></script>',
        '<script src="../js/navigation-responsive-fix.js"></script>\n  <script src="../js/universal-mobile-navigation-fix.js"></script>'
      );
      console.log(`   ✅ Added universal-mobile-navigation-fix.js after navigation-responsive-fix.js`);
    }
    // Try to find shared-menu-component.js and add before it
    else if (content.includes('<script src="../js/shared-menu-component.js')) {
      const sharedMenuRegex = /<script src="..\/js\/shared-menu-component\.js[^>]*><\/script>/;
      const sharedMenuMatch = content.match(sharedMenuRegex);
      if (sharedMenuMatch) {
        content = content.replace(
          sharedMenuMatch[0],
          `  <script src="../js/universal-mobile-navigation-fix.js"></script>\n    ${sharedMenuMatch[0]}`
        );
        console.log(`   ✅ Added universal-mobile-navigation-fix.js before shared-menu-component.js`);
      }
    }
    // As a fallback, add before </body>
    else if (content.includes('</body>')) {
      content = content.replace(
        '</body>',
        '  <script src="../js/universal-mobile-navigation-fix.js"></script>\n</body>'
      );
      console.log(`   ✅ Added universal-mobile-navigation-fix.js before </body>`);
    } else {
      throw new Error('Could not find appropriate location to add script');
    }

    // Write the file back
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
    console.log(`   ✅ File saved successfully`);

  } catch (error) {
    console.error(`   ❌ Error processing ${pagePath}:`, error.message);
    errors.push({ page: pagePath, error: error.message });
  }
});

console.log('\n' + '='.repeat(60));
console.log(`📊 SUMMARY: Fixed ${fixedCount}/${pagesToFix.length} pages`);

if (errors.length > 0) {
  console.log('\n❌ Errors encountered:');
  errors.forEach(e => {
    console.log(`   - ${e.page}: ${e.error}`);
  });
}

console.log('='.repeat(60));
console.log('\n✅ Done! Run test-all-en-pages.js to verify the fixes.');