// Fix Russian text preservation in ALL integration files
const fs = require('fs');
const path = require('path');

const filesToFix = [
  './js/ui-translator.js',
  './js/strapi-integration.js',
  './js/webflow-strapi-integration.js',
  './dist/js/ui-translator.js',
  './dist/js/strapi-integration.js',
  './dist/js/webflow-strapi-integration.js'
];

// The fix patterns
const fixes = [
  {
    // Pattern 1: Hebrew only check
    search: /const isHebrewText = \/\[\\u0590-\\u05FF\]\/\.test\(currentText\);\s*\n\s*\/\/ Only update if.*?AND current text isn't already Hebrew/,
    replace: `const isHebrewText = /[\\u0590-\\u05FF]/.test(currentText);
        const isRussianText = /[\\u0400-\\u04FF]/.test(currentText);

        // Only update if we have valid translations AND current text isn't already Hebrew or Russian`
  },
  {
    // Pattern 2: Hebrew condition in if statement
    search: /!isHebrewText\)/g,
    replace: '!isHebrewText && !isRussianText)'
  },
  {
    // Pattern 3: Hebrew preservation message
    search: /} else if \(isHebrewText\) {\s*\n\s*console\.log\(`✅ Preserving.*?Hebrew.*?"\);\s*\n\s*}/g,
    replace: `} else if (isHebrewText) {
          console.log(\`✅ Preserving Hebrew text: "\${currentText}"\`);
        } else if (isRussianText) {
          console.log(\`✅ Preserving Russian text: "\${currentText}"\`);
        }`
  }
];

console.log('🔧 FIXING RUSSIAN TEXT PRESERVATION IN ALL FILES');
console.log('=================================================\n');

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`📝 Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changesApplied = 0;

    // Apply regex patterns
    if (content.includes('isHebrewText') && !content.includes('isRussianText')) {
      // Add Russian text detection
      content = content.replace(
        /const isHebrewText = \/\[\\u0590-\\u05FF\]\/\.test\(currentText\);/g,
        `const isHebrewText = /[\\u0590-\\u05FF]/.test(currentText);
        const isRussianText = /[\\u0400-\\u04FF]/.test(currentText);`
      );

      // Update conditions to include Russian check
      content = content.replace(
        /!isHebrewText\)/g,
        '!isHebrewText && !isRussianText)'
      );

      // Add Russian preservation messages
      content = content.replace(
        /} else if \(isHebrewText\) {\s*\n\s*console\.log\(`✅.*?Hebrew.*?currentText.*?\);\s*\n\s*}/g,
        `} else if (isHebrewText) {
          console.log(\`✅ Preserving Hebrew text: "\${currentText}"\`);
        } else if (isRussianText) {
          console.log(\`✅ Preserving Russian text: "\${currentText}"\`);
        }`
      );

      changesApplied = (originalContent !== content) ? 1 : 0;
    }

    if (changesApplied > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ Applied Russian text preservation fix`);
    } else {
      console.log(`  ⚪ No changes needed (already fixed or no Hebrew logic found)`);
    }
  } else {
    console.log(`  ❌ File not found: ${filePath}`);
  }
});

console.log('\n🎉 All files processed!');
console.log('🔄 Now test with: node test-russian-preservation.js');