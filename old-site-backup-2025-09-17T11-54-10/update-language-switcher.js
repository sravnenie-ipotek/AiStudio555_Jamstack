const fs = require('fs');
const path = require('path');

// Updated language switcher with home.html fix
const UPDATED_SWITCHER = `window.switchLanguage = function(newLang) {
        if (!LANGUAGES[newLang]) return;
        
        localStorage.setItem(STORAGE_KEY, newLang);
        
        // Determine new path
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(part => part);
        
        // Handle different URL structures
        if (pathParts[0] === 'dist' && LANGUAGES[pathParts[1]]) {
          // Fix home.html to index.html issue
          if (pathParts[pathParts.length - 1] === 'home.html') {
            pathParts[pathParts.length - 1] = 'index.html';
          }
          pathParts[1] = newLang;
        } else if (pathParts[0] === 'dist') {
          pathParts.splice(1, 0, newLang);
        } else if (LANGUAGES[pathParts[0]]) {
          pathParts[0] = newLang;
        } else {
          // For production, construct language-specific path
          let fileName = currentPath.split('/').pop() || 'index.html';
          // FIX: Normalize home.html to index.html
          if (fileName === 'home.html' || fileName === '') {
            fileName = 'index.html';
          }
          window.location.href = '/dist/' + newLang + '/' + fileName;
          return;
        }
        
        window.location.href = '/' + pathParts.join('/');
      };`;

async function updateLanguageSwitcher() {
  console.log('🔧 UPDATING LANGUAGE SWITCHER IN ALL FILES');
  console.log('='.repeat(50));
  
  const languages = ['en', 'ru', 'he'];
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  // Process all language directories
  for (const lang of languages) {
    const distDir = path.join(__dirname, 'dist', lang);
    
    if (!fs.existsSync(distDir)) {
      console.log(`⚠️  Directory dist/${lang} not found, skipping...`);
      continue;
    }
    
    console.log(`\n📁 Processing dist/${lang} directory:`);
    
    const files = fs.readdirSync(distDir)
      .filter(file => file.endsWith('.html'));
    
    for (const file of files) {
      const filePath = path.join(distDir, file);
      console.log(`  📄 ${file}:`);
      
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if has language switcher
        if (!content.includes('window.switchLanguage')) {
          console.log(`     ⏭️  Skipped - No language switcher found`);
          totalSkipped++;
          continue;
        }
        
        // Check if already has the fix
        if (content.includes('// FIX: Normalize home.html to index.html')) {
          console.log(`     ✔️  Already updated`);
          totalSkipped++;
          continue;
        }
        
        // Replace the old switchLanguage function with the new one
        const startPattern = 'window.switchLanguage = function(newLang) {';
        const endPattern = '};';
        
        const startIndex = content.indexOf(startPattern);
        if (startIndex === -1) {
          console.log(`     ⚠️  Could not find switchLanguage function`);
          totalErrors++;
          continue;
        }
        
        // Find the matching closing brace
        let braceCount = 0;
        let endIndex = -1;
        let inFunction = false;
        
        for (let i = startIndex; i < content.length; i++) {
          if (content[i] === '{') {
            braceCount++;
            inFunction = true;
          } else if (content[i] === '}' && inFunction) {
            braceCount--;
            if (braceCount === 0) {
              endIndex = i + 1;
              break;
            }
          }
        }
        
        if (endIndex === -1) {
          console.log(`     ❌ Could not find end of function`);
          totalErrors++;
          continue;
        }
        
        // Replace the function
        const before = content.slice(0, startIndex);
        const after = content.slice(endIndex);
        content = before + UPDATED_SWITCHER + after;
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`     ✅ Updated language switcher`);
        totalUpdated++;
        
      } catch (error) {
        console.log(`     ❌ Error: ${error.message}`);
        totalErrors++;
      }
    }
  }
  
  // Also process root HTML files
  const rootDir = __dirname;
  console.log(`\n📁 Processing root directory:`);
  
  const rootFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.html'))
    .filter(file => !file.startsWith('test-') && !file.includes('admin'));
  
  for (const file of rootFiles) {
    const filePath = path.join(rootDir, file);
    console.log(`  📄 ${file}:`);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (!content.includes('window.switchLanguage')) {
        console.log(`     ⏭️  Skipped - No language switcher found`);
        totalSkipped++;
        continue;
      }
      
      if (content.includes('// FIX: Normalize home.html to index.html')) {
        console.log(`     ✔️  Already updated`);
        totalSkipped++;
        continue;
      }
      
      const startPattern = 'window.switchLanguage = function(newLang) {';
      const startIndex = content.indexOf(startPattern);
      if (startIndex === -1) {
        console.log(`     ⚠️  Could not find switchLanguage function`);
        totalErrors++;
        continue;
      }
      
      // Find the matching closing brace
      let braceCount = 0;
      let endIndex = -1;
      let inFunction = false;
      
      for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') {
          braceCount++;
          inFunction = true;
        } else if (content[i] === '}' && inFunction) {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
      
      if (endIndex === -1) {
        console.log(`     ❌ Could not find end of function`);
        totalErrors++;
        continue;
      }
      
      const before = content.slice(0, startIndex);
      const after = content.slice(endIndex);
      content = before + UPDATED_SWITCHER + after;
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`     ✅ Updated language switcher`);
      totalUpdated++;
      
    } catch (error) {
      console.log(`     ❌ Error: ${error.message}`);
      totalErrors++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 UPDATE SUMMARY:');
  console.log(`✅ Successfully updated: ${totalUpdated} files`);
  console.log(`⏭️  Skipped/Already updated: ${totalSkipped} files`);
  console.log(`❌ Errors: ${totalErrors} files`);
  
  console.log('\n🎯 FIX APPLIED:');
  console.log('   ✅ home.html → index.html normalization');
  console.log('   ✅ Empty filename → index.html default');
  console.log('   ✅ Prevents 404 errors when switching languages');
  
  return totalErrors === 0;
}

// Run the update
updateLanguageSwitcher().then(success => {
  process.exit(success ? 0 : 1);
}).catch(console.error);