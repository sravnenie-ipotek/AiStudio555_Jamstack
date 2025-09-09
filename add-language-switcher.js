const fs = require('fs');
const path = require('path');

// Language switcher script to inject
const LANGUAGE_SWITCHER_SCRIPT = `
  <!-- Language Switcher -->
  <script>
    // Inline Language Switcher for AI Studio
    (function() {
      'use strict';
      
      const LANGUAGES = {
        en: { name: 'English', flag: '🇬🇧', dir: 'ltr', label: 'EN' },
        ru: { name: 'Русский', flag: '🇷🇺', dir: 'ltr', label: 'RU' },
        he: { name: 'עברית', flag: '🇮🇱', dir: 'rtl', label: 'HE' }
      };
      
      const STORAGE_KEY = 'aistudio_language';
      
      function detectCurrentLanguage() {
        const pathParts = window.location.pathname.split('/');
        const urlLang = pathParts.find(part => LANGUAGES[part]);
        if (urlLang) return urlLang;
        
        const storedLang = localStorage.getItem(STORAGE_KEY);
        if (storedLang && LANGUAGES[storedLang]) return storedLang;
        
        return 'en';
      }
      
      function createLanguageSwitcher() {
        if (document.getElementById('language-switcher')) return;
        
        const currentLang = detectCurrentLanguage();
        const switcher = document.createElement('div');
        switcher.id = 'language-switcher';
        switcher.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;';
        
        switcher.innerHTML = \`
          <style>
            #language-switcher select {
              padding: 10px 16px;
              background: rgba(5, 5, 26, 0.95);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              color: white;
              font-family: "Plus Jakarta Sans", sans-serif;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              backdrop-filter: blur(10px);
              outline: none;
              transition: all 0.3s ease;
            }
            #language-switcher select:hover {
              background: rgba(0, 128, 255, 0.1);
              border-color: rgba(0, 128, 255, 0.3);
              transform: translateY(-2px);
            }
            #language-switcher select option {
              background: #05051a;
              color: white;
              padding: 8px;
            }
            html[dir="rtl"] #language-switcher {
              right: auto;
              left: 20px;
            }
            @media (max-width: 768px) {
              #language-switcher {
                top: 10px;
                right: 10px;
              }
              #language-switcher select {
                padding: 8px 12px;
                font-size: 13px;
              }
            }
          </style>
          <select onchange="switchLanguage(this.value)" id="languageSelect">
            \${Object.entries(LANGUAGES).map(([code, lang]) => 
              \`<option value="\${code}" \${code === currentLang ? 'selected' : ''}>\${lang.flag} \${lang.name}</option>\`
            ).join('')}
          </select>
        \`;
        
        document.body.appendChild(switcher);
        
        // Apply language settings
        document.documentElement.lang = currentLang;
        document.documentElement.dir = LANGUAGES[currentLang].dir;
        localStorage.setItem(STORAGE_KEY, currentLang);
      }
      
      window.switchLanguage = function(newLang) {
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
      };
      
      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createLanguageSwitcher);
      } else {
        createLanguageSwitcher();
      }
    })();
  </script>`;

const MARKER = 'Language Switcher';

async function addLanguageSwitcherToAllPages() {
  console.log('🌐 ADDING LANGUAGE SWITCHER TO ALL PAGES');
  console.log('='.repeat(50));
  
  // Process all language directories
  const languages = ['en', 'ru', 'he'];
  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  for (const lang of languages) {
    const distDir = path.join(__dirname, 'dist', lang);
    
    if (!fs.existsSync(distDir)) {
      console.log(`⚠️  Directory dist/${lang} not found, skipping...`);
      continue;
    }
    
    console.log(`\n📁 Processing dist/${lang} directory:`);
    
    const files = fs.readdirSync(distDir)
      .filter(file => file.endsWith('.html'))
      .filter(file => !file.startsWith('test-'));
    
    for (const file of files) {
      const filePath = path.join(distDir, file);
      console.log(`  📄 ${file}:`);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if already has language switcher
        if (content.includes(MARKER)) {
          console.log(`     ⏭️  Skipped - Language switcher already present`);
          totalSkipped++;
          continue;
        }
        
        let updatedContent = content;
        
        // Find </body> tag and insert script before it
        const bodyEndIndex = content.lastIndexOf('</body>');
        
        if (bodyEndIndex !== -1) {
          updatedContent = content.slice(0, bodyEndIndex) + 
                          LANGUAGE_SWITCHER_SCRIPT + '\n' +
                          content.slice(bodyEndIndex);
          
          fs.writeFileSync(filePath, updatedContent, 'utf8');
          console.log(`     ✅ Added language switcher`);
          totalProcessed++;
        } else {
          console.log(`     ⚠️  No </body> tag found`);
          totalErrors++;
        }
        
      } catch (error) {
        console.log(`     ❌ Error: ${error.message}`);
        totalErrors++;
      }
    }
  }
  
  // Also process root HTML files if they exist
  const rootDir = __dirname;
  console.log(`\n📁 Processing root directory:`);
  
  const rootFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.html'))
    .filter(file => !file.startsWith('test-') && !file.includes('admin'));
  
  for (const file of rootFiles) {
    const filePath = path.join(rootDir, file);
    console.log(`  📄 ${file}:`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes(MARKER)) {
        console.log(`     ⏭️  Skipped - Language switcher already present`);
        totalSkipped++;
        continue;
      }
      
      let updatedContent = content;
      const bodyEndIndex = content.lastIndexOf('</body>');
      
      if (bodyEndIndex !== -1) {
        updatedContent = content.slice(0, bodyEndIndex) + 
                        LANGUAGE_SWITCHER_SCRIPT + '\n' +
                        content.slice(bodyEndIndex);
        
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`     ✅ Added language switcher`);
        totalProcessed++;
      } else {
        console.log(`     ⚠️  No </body> tag found`);
        totalErrors++;
      }
      
    } catch (error) {
      console.log(`     ❌ Error: ${error.message}`);
      totalErrors++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 LANGUAGE SWITCHER DEPLOYMENT SUMMARY:');
  console.log(`✅ Successfully processed: ${totalProcessed} files`);
  console.log(`⏭️  Already had switcher: ${totalSkipped} files`);
  console.log(`❌ Errors: ${totalErrors} files`);
  
  console.log('\n🎯 FEATURES ADDED:');
  console.log('   ✅ Language selector dropdown (EN/RU/HE)');
  console.log('   ✅ Persistent language preference');
  console.log('   ✅ Automatic RTL support for Hebrew');
  console.log('   ✅ Smooth language switching');
  console.log('   ✅ Mobile responsive design');
  
  return totalErrors === 0;
}

// Run the deployment
addLanguageSwitcherToAllPages().then(success => {
  process.exit(success ? 0 : 1);
}).catch(console.error);