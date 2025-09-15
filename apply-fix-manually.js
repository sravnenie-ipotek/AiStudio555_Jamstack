const fs = require('fs');
const path = require('path');

// Files to update
const files = [
  'courses.html',
  'home.html',
  'teachers.html',
  'pricing.html',
  'career-center.html',
  'career-orientation.html',
  'en/courses.html',
  'en/home.html',
  'en/teachers.html',
  'he/courses.html',
  'he/home.html',
  'he/teachers.html',
  'ru/courses.html',
  'ru/home.html',
  'ru/teachers.html'
];

function updateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️ Skipping ${filePath} - file not found`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // 1. Update CSS reference
    if (content.includes('mobile-menu-proper-fix.css')) {
      content = content.replace(/mobile-menu-proper-fix\.css/g, 'mobile-navigation-complete-fix.css');
      hasChanges = true;
      console.log(`✅ ${filePath}: Updated CSS reference`);
    }

    // 2. Disable old mobile script
    if (content.includes('mobile-menu-toggle-fix.js')) {
      content = content.replace(/\s*<script src="[^"]*mobile-menu-toggle-fix\.js"><\/script>/g,
        '  <!-- mobile-menu-toggle-fix.js disabled - replaced by universal-mobile-navigation-fix.js -->');
      hasChanges = true;
      console.log(`✅ ${filePath}: Disabled old mobile script`);
    }

    // 3. Add new universal script (if not already there)
    if (!content.includes('universal-mobile-navigation-fix.js')) {
      // Determine correct path
      const isSubdir = filePath.includes('/');
      const jsPath = isSubdir ? '../js/universal-mobile-navigation-fix.js' : 'js/universal-mobile-navigation-fix.js';

      // Add before closing body tag
      if (content.includes('</body>')) {
        content = content.replace('</body>', `  <script src="${jsPath}"></script>\n</body>`);
        hasChanges = true;
        console.log(`✅ ${filePath}: Added universal mobile script`);
      }
    }

    // 4. Remove duplicate hamburger buttons
    const hamburgerPattern = /<div[^>]*class="[^"]*(?:menu-button|hamburger-menu-icon)[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
    const withoutHamburgers = content.replace(hamburgerPattern, '<!-- Hamburger button will be created by universal-mobile-navigation-fix.js -->');
    if (withoutHamburgers !== content) {
      content = withoutHamburgers;
      hasChanges = true;
      console.log(`✅ ${filePath}: Removed duplicate hamburger buttons`);
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`🎯 ${filePath}: Updated successfully\n`);
    } else {
      console.log(`⏭️ ${filePath}: No changes needed\n`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log('🔧 Applying mobile navigation fixes manually...\n');

files.forEach(updateFile);

console.log('🎉 Manual fix application complete!');
console.log('\n📋 Next steps:');
console.log('1. Test mobile navigation on different pages');
console.log('2. Commit changes');
console.log('3. Verify all pages work correctly');