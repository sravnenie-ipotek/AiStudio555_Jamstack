const fs = require('fs');
const path = require('path');

// Pages to fix in each language directory
const pagesToFix = [
  'home.html',
  'courses.html',
  'teachers.html',
  'pricing.html',
  'career-center.html',
  'career-orientation.html',
  'blog.html'
];

const languages = ['ru', 'he'];

let fixedCount = 0;
let errors = [];

languages.forEach(lang => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 Processing ${lang.toUpperCase()} pages...`);
  console.log(`${'='.repeat(60)}`);

  pagesToFix.forEach(page => {
    const filePath = path.join(__dirname, lang, page);

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  ${lang}/${page} - File doesn't exist, skipping`);
        return;
      }

      console.log(`\n📝 Processing ${lang}/${page}...`);

      // Read the file
      let content = fs.readFileSync(filePath, 'utf8');

      // Check if universal-mobile-navigation-fix.js is already present
      if (content.includes('universal-mobile-navigation-fix.js')) {
        console.log(`   ✅ Already has universal-mobile-navigation-fix.js`);
        return;
      }

      let modified = false;

      // Try to find mobile-menu-toggle-fix.js and replace it
      if (content.includes('<script src="../js/mobile-menu-toggle-fix.js"></script>')) {
        content = content.replace(
          '<script src="../js/mobile-menu-toggle-fix.js"></script>',
          '<script src="../js/universal-mobile-navigation-fix.js"></script>'
        );
        console.log(`   ✅ Replaced mobile-menu-toggle-fix.js with universal-mobile-navigation-fix.js`);
        modified = true;
      }
      // Try to find navigation-responsive-fix.js and add after it
      else if (content.includes('<script src="../js/navigation-responsive-fix.js"></script>')) {
        content = content.replace(
          '<script src="../js/navigation-responsive-fix.js"></script>',
          '<script src="../js/navigation-responsive-fix.js"></script>\n  <script src="../js/universal-mobile-navigation-fix.js"></script>'
        );
        console.log(`   ✅ Added universal-mobile-navigation-fix.js after navigation-responsive-fix.js`);
        modified = true;
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
          modified = true;
        }
      }
      // Try to find webflow.js and add after it
      else if (content.includes('<script src="../js/webflow.js"')) {
        content = content.replace(
          /<script src="..\/js\/webflow\.js"[^>]*><\/script>/,
          '$&\n  <script src="../js/universal-mobile-navigation-fix.js"></script>'
        );
        console.log(`   ✅ Added universal-mobile-navigation-fix.js after webflow.js`);
        modified = true;
      }
      // As a fallback, add before </body>
      else if (content.includes('</body>')) {
        content = content.replace(
          '</body>',
          '  <script src="../js/universal-mobile-navigation-fix.js"></script>\n</body>'
        );
        console.log(`   ✅ Added universal-mobile-navigation-fix.js before </body>`);
        modified = true;
      }

      if (modified) {
        // Write the file back
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
        console.log(`   ✅ File saved successfully`);
      } else {
        throw new Error('Could not find appropriate location to add script');
      }

    } catch (error) {
      console.error(`   ❌ Error processing ${lang}/${page}:`, error.message);
      errors.push({ page: `${lang}/${page}`, error: error.message });
    }
  });
});

console.log('\n' + '='.repeat(60));
console.log(`📊 SUMMARY: Fixed ${fixedCount} pages`);

if (errors.length > 0) {
  console.log('\n❌ Errors encountered:');
  errors.forEach(e => {
    console.log(`   - ${e.page}: ${e.error}`);
  });
}

console.log('='.repeat(60));
console.log('\n✅ Done! Run tests to verify the fixes.');