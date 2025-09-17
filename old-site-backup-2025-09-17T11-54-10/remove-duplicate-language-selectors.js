// Remove duplicate language selectors from all universal-menu-fix.js files
const fs = require('fs');

const filesToFix = [
  './js/universal-menu-fix.js',
  './dist/js/universal-menu-fix.js',
  './dist/en/js/universal-menu-fix.js',
  './dist/ru/js/universal-menu-fix.js',
  './dist/he/js/universal-menu-fix.js'
];

console.log('🔧 REMOVING DUPLICATE LANGUAGE SELECTORS');
console.log('=========================================\n');

const searchPattern = /\/\/ Create language switcher HTML[\s\S]*?navMenu\.insertAdjacentHTML\('beforeend', switcherHTML\);\s*\n\s*\}\s*\n\s*\}/;

const replacement = `// Language switcher removed - now using navbar language switcher
        // Define the switch language function globally (keep this for compatibility)
        window.switchLanguage = function(lang) {
            const currentPath = window.location.pathname;
            const currentFile = currentPath.split('/').pop() || 'home.html';

            // Build the new path
            let newPath = '';
            const pathParts = currentPath.split('/');
            const isInLangDir = pathParts.some(part => ['en', 'ru', 'he'].includes(part));

            if (isInLangDir) {
                // Replace language in path
                newPath = currentPath.replace(/\\/(en|ru|he)\\//, \`/\${lang}/\`);
            } else {
                // Add language to path
                newPath = \`/\${lang}/\${currentFile}\`;
            }

            // Navigate to new language version
            window.location.href = newPath;
        };`;

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`📝 Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Check if the file contains the duplicate language selector
    if (content.includes('Create language switcher HTML') && content.includes('languageSelect')) {
      content = content.replace(searchPattern, replacement);

      if (originalContent !== content) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✅ Removed duplicate language selector`);
      } else {
        console.log(`  ⚠️ Pattern not matched for replacement`);
      }
    } else {
      console.log(`  ⚪ No duplicate language selector found`);
    }
  } else {
    console.log(`  ❌ File not found: ${filePath}`);
  }
});

console.log('\n🎉 All files processed!');
console.log('🔄 The duplicate #languageSelect should now be removed from all pages.');