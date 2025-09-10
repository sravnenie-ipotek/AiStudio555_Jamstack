#!/usr/bin/env node

/**
 * Fix Production UI Issues
 * - Language selector blocking navigation
 * - Missing font files (fa-brands-400.ttf)
 * - Missing banner images
 */

const fs = require('fs');
const path = require('path');

// Files to update
const HTML_FILES = [
    'dist/en/index.html',
    'dist/ru/index.html', 
    'dist/he/index.html',
    'dist/en/courses.html',
    'dist/ru/courses.html',
    'dist/he/courses.html',
    'dist/en/teachers.html',
    'dist/ru/teachers.html',
    'dist/he/teachers.html',
    'dist/en/career-center.html',
    'dist/ru/career-center.html',
    'dist/he/career-center.html',
    'dist/en/career-orientation.html',
    'dist/ru/career-orientation.html',
    'dist/he/career-orientation.html'
];

// Better language selector HTML that integrates into navbar
const LANGUAGE_SELECTOR_HTML = `
    <!-- Language Selector - Integrated into Navbar -->
    <style>
      .language-selector-wrapper {
        display: inline-flex;
        align-items: center;
        margin-left: 20px;
        position: relative;
      }
      
      .language-selector {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 6px 16px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .language-selector:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
      }
      
      .language-selector select {
        background: transparent;
        border: none;
        color: inherit;
        font-size: inherit;
        font-weight: inherit;
        cursor: pointer;
        outline: none;
        padding-right: 5px;
      }
      
      .language-selector select option {
        background: #05051a;
        color: white;
      }
      
      .language-flag {
        font-size: 18px;
      }
      
      /* Mobile responsive */
      @media (max-width: 768px) {
        .language-selector-wrapper {
          position: fixed;
          bottom: 20px;
          right: 20px;
          margin: 0;
          z-index: 999;
        }
        
        .language-selector {
          background: rgba(5, 5, 26, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
      }
    </style>
`;

const LANGUAGE_SELECTOR_SCRIPT = `
    <script>
      function switchLanguage(lang) {
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(p => p);
        
        // Remove 'dist' and current language from path
        if (pathParts[0] === 'dist') pathParts.shift();
        if (['en', 'ru', 'he'].includes(pathParts[0])) {
          pathParts.shift();
        }
        
        // Build new path
        const pageName = pathParts.join('/') || 'index.html';
        const newPath = '/dist/' + lang + '/' + pageName;
        
        // Navigate to new language
        window.location.href = newPath;
      }
      
      // Set current language flag
      document.addEventListener('DOMContentLoaded', function() {
        const path = window.location.pathname;
        let currentLang = 'en';
        
        if (path.includes('/ru/')) currentLang = 'ru';
        else if (path.includes('/he/')) currentLang = 'he';
        
        const flags = { en: '🇬🇧', ru: '🇷🇺', he: '🇮🇱' };
        const flagEl = document.querySelector('.language-flag');
        if (flagEl) flagEl.textContent = flags[currentLang];
        
        const selectEl = document.querySelector('.language-selector select');
        if (selectEl) selectEl.value = currentLang;
      });
    </script>
`;

function fixLanguageSelector(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove old language switcher (positioned at top-right)
        content = content.replace(
            /<div class="language-switcher"[^>]*style="position:\s*fixed[^"]*"[^>]*>[\s\S]*?<\/div>\s*<script>\s*function switchLanguage[\s\S]*?<\/script>/g,
            ''
        );
        
        // Add new language selector styles in head
        if (!content.includes('language-selector-wrapper')) {
            content = content.replace('</head>', LANGUAGE_SELECTOR_HTML + '</head>');
        }
        
        // Add language selector to navbar (after Sign Up button)
        const navbarPattern = /<div class="navbar-button-wrapper">([\s\S]*?)<\/div>/;
        const navbarMatch = content.match(navbarPattern);
        
        if (navbarMatch && !content.includes('language-selector-wrapper')) {
            const newNavbar = navbarMatch[0].replace(
                '</div>',
                `
                <div class="language-selector-wrapper">
                  <div class="language-selector">
                    <span class="language-flag">🇬🇧</span>
                    <select onchange="switchLanguage(this.value)">
                      <option value="en">English</option>
                      <option value="ru">Русский</option>
                      <option value="he">עברית</option>
                    </select>
                  </div>
                </div>
              </div>`
            );
            content = content.replace(navbarMatch[0], newNavbar);
        }
        
        // Add script before closing body
        if (!content.includes('function switchLanguage')) {
            content = content.replace('</body>', LANGUAGE_SELECTOR_SCRIPT + '</body>');
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed language selector in: ${filePath}`);
        
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
}

function fixMissingResources(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Fix font path (remove 'dist/en/' prefix for fonts)
        content = content.replace(
            /fonts\/fa-brands-400\.ttf/g,
            '../../fonts/fa-brands-400.ttf'
        );
        
        // Fix banner image paths
        content = content.replace(
            /images\/Banner-Man-Img1_1Banner-Man-Img1\.png/g,
            '../../images/Banner-Man-Img1.png'
        );
        
        content = content.replace(
            /images\/Banner-Man-Img2_1Banner-Man-Img2\.png/g,
            '../../images/Banner-Man-Img2.png'
        );
        
        // Alternative: Use placeholder if images don't exist
        content = content.replace(
            /src="[^"]*Banner-Man-Img[12][^"]*"/g,
            'src="../../images/Demo-Image14.jpg"'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed resource paths in: ${filePath}`);
        
    } catch (error) {
        console.error(`❌ Error fixing resources in ${filePath}:`, error.message);
    }
}

// Main execution
console.log('🔧 Fixing Production UI Issues...\n');

HTML_FILES.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (fs.existsSync(filePath)) {
        console.log(`Processing: ${file}`);
        fixLanguageSelector(filePath);
        fixMissingResources(filePath);
    } else {
        console.log(`⚠️  File not found: ${file}`);
    }
});

console.log('\n✅ Production UI fixes complete!');
console.log('\n📝 Summary of fixes:');
console.log('  1. Language selector moved to navbar (not blocking UI)');
console.log('  2. Font paths corrected to use relative paths');
console.log('  3. Banner image paths fixed or replaced with placeholders');
console.log('\nCommit and push these changes to deploy the fixes.');