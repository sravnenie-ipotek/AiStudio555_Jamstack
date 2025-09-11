#!/usr/bin/env node

/**
 * Fix Language Switcher Visibility
 * This script updates all HTML files to ensure the language switcher is visible
 */

const fs = require('fs');
const path = require('path');

// Enhanced language switcher code with debugging
const LANGUAGE_SWITCHER_CODE = `
  <!-- Language Switcher Fixed -->
  <script>
    // Enhanced Language Switcher for AI Studio
    (function() {
      'use strict';
      
      console.log('🌍 Language Switcher: Initializing...');
      
      const LANGUAGES = {
        en: { name: 'English', flag: '🇬🇧', dir: 'ltr', label: 'EN' },
        ru: { name: 'Русский', flag: '🇷🇺', dir: 'ltr', label: 'RU' },
        he: { name: 'עברית', flag: '🇮🇱', dir: 'rtl', label: 'HE' }
      };
      
      const STORAGE_KEY = 'aistudio_language';
      
      function detectCurrentLanguage() {
        const pathParts = window.location.pathname.split('/');
        const urlLang = pathParts.find(part => LANGUAGES[part]);
        console.log('🔍 Detected language from URL:', urlLang || 'none');
        if (urlLang) return urlLang;
        
        const storedLang = localStorage.getItem(STORAGE_KEY);
        if (storedLang && LANGUAGES[storedLang]) {
          console.log('📦 Using stored language:', storedLang);
          return storedLang;
        }
        
        console.log('🔤 Defaulting to English');
        return 'en';
      }
      
      function createLanguageSwitcher() {
        console.log('🔨 Creating language switcher...');
        
        // Remove any existing switcher
        const existing = document.getElementById('language-switcher-container');
        if (existing) {
          console.log('♻️ Removing existing switcher');
          existing.remove();
        }
        
        const currentLang = detectCurrentLanguage();
        const container = document.createElement('div');
        container.id = 'language-switcher-container';
        container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;';
        
        // Create the select element
        const select = document.createElement('select');
        select.id = 'language-select';
        select.style.cssText = \`
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
        \`;
        
        // Add hover effect
        select.addEventListener('mouseenter', function() {
          this.style.background = 'rgba(0, 128, 255, 0.2)';
          this.style.borderColor = 'rgba(0, 128, 255, 0.5)';
          this.style.transform = 'translateY(-2px)';
        });
        
        select.addEventListener('mouseleave', function() {
          this.style.background = 'rgba(5, 5, 26, 0.95)';
          this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          this.style.transform = 'translateY(0)';
        });
        
        // Add options
        Object.entries(LANGUAGES).forEach(([code, lang]) => {
          const option = document.createElement('option');
          option.value = code;
          option.textContent = \`\${lang.flag} \${lang.name}\`;
          option.style.background = '#05051a';
          option.style.color = 'white';
          if (code === currentLang) {
            option.selected = true;
          }
          select.appendChild(option);
        });
        
        // Add change handler
        select.addEventListener('change', function(e) {
          switchLanguage(e.target.value);
        });
        
        container.appendChild(select);
        document.body.appendChild(container);
        
        console.log('✅ Language switcher created successfully');
        
        // Apply language settings
        const lang = LANGUAGES[currentLang];
        document.documentElement.lang = currentLang;
        document.documentElement.dir = lang.dir;
        
        // Adjust position for RTL
        if (lang.dir === 'rtl') {
          container.style.right = 'auto';
          container.style.left = '20px';
        }
      }
      
      window.switchLanguage = function(newLang) {
        console.log('🔄 Switching to language:', newLang);
        
        if (!LANGUAGES[newLang]) {
          console.error('❌ Invalid language:', newLang);
          return;
        }
        
        localStorage.setItem(STORAGE_KEY, newLang);
        
        // Determine new path
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(p => p);
        
        // Remove 'dist' and current language
        if (pathParts[0] === 'dist') pathParts.shift();
        if (LANGUAGES[pathParts[0]]) pathParts.shift();
        
        // Build new path
        const pageName = pathParts.join('/') || 'index.html';
        const newPath = '/dist/' + newLang + '/' + pageName;
        
        console.log('🚀 Navigating to:', newPath);
        window.location.href = newPath;
      };
      
      // Initialize when DOM is ready
      function init() {
        console.log('📄 DOM ready, initializing language switcher');
        createLanguageSwitcher();
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        // DOM is already loaded
        setTimeout(init, 100); // Small delay to ensure everything is loaded
      }
      
      // Also try after window load as backup
      window.addEventListener('load', function() {
        setTimeout(function() {
          if (!document.getElementById('language-switcher-container')) {
            console.log('⚠️ Language switcher not found after load, creating...');
            createLanguageSwitcher();
          }
        }, 500);
      });
      
    })();
  </script>
`;

function updateHTMLFile(filePath) {
    console.log(`📝 Updating ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove existing language switcher scripts (between the comments)
    content = content.replace(/<!-- Language Switcher -->[\s\S]*?<\/script>\s*(?=<)/g, '');
    
    // Add the new language switcher before closing body tag
    content = content.replace('</body>', LANGUAGE_SWITCHER_CODE + '\n</body>');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
}

// Update all index.html files
const files = [
    'dist/en/index.html',
    'dist/ru/index.html', 
    'dist/he/index.html'
];

console.log('🔧 Fixing language switcher visibility...\n');

files.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        updateHTMLFile(fullPath);
    } else {
        console.log(`⚠️ File not found: ${file}`);
    }
});

console.log('\n✅ Language switcher fix complete!');
console.log('📌 The language dropdown should now be visible in the top-right corner.');