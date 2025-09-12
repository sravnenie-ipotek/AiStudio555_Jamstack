#!/usr/bin/env node

/**
 * MULTILINGUAL FOOTER FIX
 * 
 * Fixes the critical issue where footer content doesn't translate 
 * when users switch languages via the language switcher.
 * 
 * ULTRATHINK ANALYSIS:
 * - Footer API supports all locales (en, ru, he) ✅
 * - SecureFooterLoader exists but only loads once ❌
 * - Language switcher changes URL but footer doesn't reload ❌
 * - Need dynamic footer reloading on language change ❌
 */

const fs = require('fs');
const path = require('path');

console.log('🌐 MULTILINGUAL FOOTER FIX - ULTRATHINK ANALYSIS');
console.log('================================================');

// ============================================================================
// FIX 1: ENHANCED SECURE FOOTER LOADER WITH LANGUAGE CHANGE DETECTION
// ============================================================================

const enhancedFooterLoader = `
// Enhanced language change detection for SecureFooterLoader
class EnhancedSecureFooterLoader extends SecureFooterLoader {
  constructor(options = {}) {
    super(options);
    this.currentLocale = this.detectCurrentLocale();
    this.setupLanguageChangeListener();
    
    console.log('🌐 Enhanced multilingual footer loader initialized');
    console.log('🔄 Language change detection active');
  }
  
  detectCurrentLocale() {
    // Multiple detection methods for robustness
    const pathname = window.location.pathname;
    
    // Method 1: URL path detection
    if (pathname.includes('/ru/') || pathname.includes('/dist/ru/')) return 'ru';
    if (pathname.includes('/he/') || pathname.includes('/dist/he/')) return 'he';
    if (pathname.includes('/en/') || pathname.includes('/dist/en/')) return 'en';
    
    // Method 2: Check localStorage for language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['en', 'ru', 'he'].includes(savedLang)) {
      return savedLang;
    }
    
    // Method 3: Check HTML lang attribute
    const htmlLang = document.documentElement.lang;
    if (htmlLang && ['en', 'ru', 'he'].includes(htmlLang)) {
      return htmlLang;
    }
    
    // Method 4: Check document title or other indicators
    const title = document.title.toLowerCase();
    if (title.includes('русский') || title.includes('russian')) return 'ru';
    if (title.includes('עברית') || title.includes('hebrew')) return 'he';
    
    // Default fallback
    return 'en';
  }
  
  setupLanguageChangeListener() {
    // Method 1: Listen for custom language change events
    document.addEventListener('languageChanged', (event) => {
      const newLocale = event.detail.locale;
      this.handleLanguageChange(newLocale);
    });
    
    // Method 2: Monitor URL changes (for SPAs and hash changes)
    window.addEventListener('popstate', () => {
      const newLocale = this.detectCurrentLocale();
      if (newLocale !== this.currentLocale) {
        this.handleLanguageChange(newLocale);
      }
    });
    
    // Method 3: Periodic check for language changes (fallback)
    setInterval(() => {
      const detectedLocale = this.detectCurrentLocale();
      if (detectedLocale !== this.currentLocale) {
        console.log('🔄 Language change detected via periodic check');
        this.handleLanguageChange(detectedLocale);
      }
    }, 2000);
    
    // Method 4: Listen for localStorage changes (cross-tab sync)
    window.addEventListener('storage', (event) => {
      if (event.key === 'preferredLanguage' && event.newValue !== this.currentLocale) {
        this.handleLanguageChange(event.newValue);
      }
    });
    
    console.log('👂 Language change listeners activated');
  }
  
  async handleLanguageChange(newLocale) {
    if (!newLocale || newLocale === this.currentLocale) return;
    
    console.log(\`🌐 Language change: \${this.currentLocale} → \${newLocale}\`);
    
    // Update current locale
    const oldLocale = this.currentLocale;
    this.currentLocale = newLocale;
    
    // Save preference
    localStorage.setItem('preferredLanguage', newLocale);
    
    // Show loading indicator
    this.showLanguageChangeLoading();
    
    try {
      // Clear cache for old locale to force fresh load
      await this.storage.removeItem(\`content-\${oldLocale}\`);
      
      // Load new locale content
      await this.loadFooter(newLocale, { forceReload: true });
      
      // Update document language attributes
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === 'he' ? 'rtl' : 'ltr';
      
      console.log(\`✅ Footer updated to \${newLocale} successfully\`);
      
      // Dispatch completion event
      document.dispatchEvent(new CustomEvent('footerLanguageChanged', {
        detail: { locale: newLocale, previousLocale: oldLocale }
      }));
      
    } catch (error) {
      console.error(\`❌ Failed to change footer language to \${newLocale}:\`, error);
      
      // Rollback on error
      this.currentLocale = oldLocale;
      localStorage.setItem('preferredLanguage', oldLocale);
      
    } finally {
      this.hideLanguageChangeLoading();
    }
  }
  
  showLanguageChangeLoading() {
    // Add visual feedback for language change
    const footerContainer = document.getElementById('secure-footer-container') || 
                           document.querySelector('.footer') ||
                           document.querySelector('.section.footer');
    
    if (footerContainer) {
      const loadingOverlay = document.createElement('div');
      loadingOverlay.id = 'footer-language-loading';
      loadingOverlay.innerHTML = \`
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 20px;
            background: #0080ff;
            color: white;
            border-radius: 6px;
            font-family: system-ui, sans-serif;
            font-size: 14px;
          ">
            <div style="
              width: 16px;
              height: 16px;
              border: 2px solid #ffffff;
              border-top: 2px solid transparent;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            "></div>
            Updating language...
          </div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      \`;
      
      footerContainer.style.position = 'relative';
      footerContainer.appendChild(loadingOverlay);
    }
  }
  
  hideLanguageChangeLoading() {
    const loadingOverlay = document.getElementById('footer-language-loading');
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  }
  
  // Override initialize method to use enhanced detection
  async initialize() {
    console.log('🚀 Initializing enhanced multilingual footer loader...');
    
    // Load footer for detected locale
    await this.loadFooter(this.currentLocale);
    
    // Set up automatic refresh for dynamic content
    this.startPeriodicRefresh();
    
    console.log(\`✅ Footer initialized for locale: \${this.currentLocale}\`);
  }
  
  startPeriodicRefresh() {
    // Refresh footer content every 5 minutes to keep it fresh
    setInterval(async () => {
      try {
        await this.loadFooter(this.currentLocale, { forceReload: true });
        console.log('🔄 Footer content refreshed automatically');
      } catch (error) {
        console.warn('⚠️ Automatic footer refresh failed:', error);
      }
    }, 5 * 60 * 1000);
  }
}

// Replace the original SecureFooterLoader with the enhanced version
window.SecureFooterLoader = EnhancedSecureFooterLoader;
`;

// ============================================================================
// FIX 2: ENHANCED LANGUAGE SWITCHER WITH FOOTER INTEGRATION
// ============================================================================

const enhancedLanguageSwitcher = `
// Enhanced language switcher that triggers footer updates
(function() {
  'use strict';
  
  const LANGUAGES = {
    en: { name: 'English', flag: '🇬🇧', dir: 'ltr', label: 'EN' },
    ru: { name: 'Русский', flag: '🇷🇺', dir: 'ltr', label: 'RU' },
    he: { name: 'עברית', flag: '🇮🇱', dir: 'rtl', label: 'HE' }
  };
  
  const STORAGE_KEY = 'preferredLanguage';
  
  // Enhanced language switching with footer integration
  window.switchLanguage = function(newLang, options = {}) {
    if (!LANGUAGES[newLang]) {
      console.warn('Invalid language code:', newLang);
      return;
    }
    
    console.log(\`🌐 Switching language to: \${newLang}\`);
    
    // Save preference immediately
    localStorage.setItem(STORAGE_KEY, newLang);
    
    // Dispatch language change event BEFORE navigation
    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { 
        locale: newLang, 
        previousLocale: getCurrentLanguage(),
        triggerSource: 'languageSwitcher'
      }
    }));
    
    // Update document attributes immediately
    document.documentElement.lang = newLang;
    document.documentElement.dir = LANGUAGES[newLang].dir;
    
    // Handle different navigation scenarios
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(part => part);
    
    // Don't navigate if we're staying on the same language and it's just a footer update
    if (options.footerOnly) {
      console.log('🦶 Footer-only language update, no navigation');
      return;
    }
    
    // Determine new path based on current URL structure
    let newPath;
    
    if (pathParts[0] === 'dist' && LANGUAGES[pathParts[1]]) {
      // Structure: /dist/en/page.html -> /dist/ru/page.html
      pathParts[1] = newLang;
      newPath = '/' + pathParts.join('/');
    } else if (pathParts[0] === 'dist') {
      // Structure: /dist/page.html -> /dist/en/page.html
      pathParts.splice(1, 0, newLang);
      newPath = '/' + pathParts.join('/');
    } else if (LANGUAGES[pathParts[0]]) {
      // Structure: /en/page.html -> /ru/page.html
      pathParts[0] = newLang;
      newPath = '/' + pathParts.join('/');
    } else {
      // Root level or production - construct language-specific path
      let fileName = currentPath.split('/').pop() || 'index.html';
      
      // Handle special cases
      if (fileName === 'home.html' || fileName === '') {
        fileName = 'index.html';
      }
      
      newPath = \`/dist/\${newLang}/\${fileName}\`;
    }
    
    console.log(\`🔄 Navigating to: \${newPath}\`);
    
    // Navigate to new language version
    window.location.href = newPath;
  };
  
  function getCurrentLanguage() {
    // Multiple detection methods
    const pathname = window.location.pathname;
    if (pathname.includes('/ru/')) return 'ru';
    if (pathname.includes('/he/')) return 'he';
    if (pathname.includes('/en/')) return 'en';
    
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }
  
  // Enhanced language switcher creation
  function createEnhancedLanguageSwitcher() {
    // Remove existing switcher
    const existing = document.getElementById('language-switcher');
    if (existing) existing.remove();
    
    const currentLang = getCurrentLanguage();
    console.log(\`🌐 Creating language switcher for: \${currentLang}\`);
    
    const switcher = document.createElement('div');
    switcher.id = 'language-switcher';
    switcher.innerHTML = \`
      <style>
        #language-switcher {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        }
        #language-switcher select {
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
          padding: 8px 16px;
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
    
    // Apply language settings immediately
    document.documentElement.lang = currentLang;
    document.documentElement.dir = LANGUAGES[currentLang].dir;
    localStorage.setItem(STORAGE_KEY, currentLang);
    
    console.log(\`✅ Enhanced language switcher created for: \${currentLang}\`);
  }
  
  // Initialize enhanced language switcher
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createEnhancedLanguageSwitcher);
  } else {
    createEnhancedLanguageSwitcher();
  }
  
  console.log('🌐 Enhanced language switcher with footer integration loaded');
})();
`;

// ============================================================================
// APPLY FIXES TO FILES
// ============================================================================

async function applyMultilingualFooterFix() {
  try {
    // Update secure footer loader
    console.log('📝 Updating secure footer loader...');
    let footerLoaderContent = fs.readFileSync(
      path.join(__dirname, 'js/secure-footer-loader.js'), 
      'utf8'
    );
    
    // Add enhanced functionality before the auto-initialization
    const insertPoint = '// Auto-initialize if footer container exists';
    const insertIndex = footerLoaderContent.indexOf(insertPoint);
    
    if (insertIndex !== -1) {
      footerLoaderContent = footerLoaderContent.slice(0, insertIndex) + 
        enhancedFooterLoader + '\n\n' +
        footerLoaderContent.slice(insertIndex);
      
      fs.writeFileSync(
        path.join(__dirname, 'js/secure-footer-loader.js'), 
        footerLoaderContent
      );
      console.log('✅ Enhanced SecureFooterLoader with language detection');
    }
    
    // Update main HTML files with enhanced language switcher
    const htmlFiles = ['home.html', 'index.html', 'courses.html', 'teachers.html'];
    let updatedFiles = 0;
    
    for (const file of htmlFiles) {
      if (fs.existsSync(path.join(__dirname, file))) {
        console.log(\`📝 Updating \${file}...\`);
        let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
        
        // Replace the language switcher script
        const languageSwitcherStart = content.indexOf('// Inline Language Switcher for AI Studio');
        const languageSwitcherEnd = content.indexOf('})();', languageSwitcherStart) + 5;
        
        if (languageSwitcherStart !== -1 && languageSwitcherEnd !== -1) {
          content = content.slice(0, languageSwitcherStart) + 
            enhancedLanguageSwitcher + 
            content.slice(languageSwitcherEnd);
          
          fs.writeFileSync(path.join(__dirname, file), content);
          updatedFiles++;
          console.log(\`✅ Updated \${file} with enhanced language switcher\`);
        }
      }
    }
    
    console.log(\`\\n🎉 MULTILINGUAL FOOTER FIX COMPLETE!\`);
    console.log(\`✅ Enhanced SecureFooterLoader with language change detection\`);
    console.log(\`✅ Updated \${updatedFiles} HTML files with enhanced language switcher\`);
    console.log(\`🌐 Footer will now automatically update when language changes\`);
    console.log(\`🔄 Real-time language detection and switching implemented\`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Failed to apply multilingual footer fix:', error);
    return false;
  }
}

// Run the fix
applyMultilingualFooterFix()
  .then(success => {
    if (success) {
      console.log('\\n🚀 NEXT STEPS:');
      console.log('1. Restart your server to load the updated files');
      console.log('2. Test language switching on any page');
      console.log('3. Footer should now update automatically when language changes');
      console.log('4. Check browser console for language change logs');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Fix script crashed:', error);
    process.exit(1);
  });