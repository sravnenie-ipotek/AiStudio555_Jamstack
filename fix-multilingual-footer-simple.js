#!/usr/bin/env node

/**
 * SIMPLE MULTILINGUAL FOOTER FIX
 * 
 * Fixes the footer translation issue by adding language change detection
 * directly to the existing SecureFooterLoader implementation.
 */

const fs = require('fs');
const path = require('path');

console.log('🌐 APPLYING MULTILINGUAL FOOTER FIX...');

// The language change detection code to add
const languageDetectionCode = `
// Enhanced language change detection for multilingual footer
(function() {
  'use strict';
  
  // Store original SecureFooterLoader if it exists
  const OriginalSecureFooterLoader = window.SecureFooterLoader;
  
  if (OriginalSecureFooterLoader) {
    // Extend the existing SecureFooterLoader with language detection
    window.SecureFooterLoader = class extends OriginalSecureFooterLoader {
      constructor(options) {
        super(options);
        this.currentLocale = this.detectCurrentLocale();
        this.setupLanguageChangeDetection();
        console.log('🌐 Multilingual footer detection activated for locale:', this.currentLocale);
      }
      
      detectCurrentLocale() {
        const pathname = window.location.pathname;
        if (pathname.includes('/ru/') || pathname.includes('dist/ru/')) return 'ru';
        if (pathname.includes('/he/') || pathname.includes('dist/he/')) return 'he';
        return 'en';
      }
      
      setupLanguageChangeDetection() {
        // Method 1: Listen for popstate (back/forward navigation)
        window.addEventListener('popstate', () => {
          const newLocale = this.detectCurrentLocale();
          if (newLocale !== this.currentLocale) {
            console.log('🔄 Language change detected:', this.currentLocale, '→', newLocale);
            this.currentLocale = newLocale;
            this.loadFooter(newLocale);
          }
        });
        
        // Method 2: Periodic check for language changes (every 2 seconds)
        setInterval(() => {
          const detectedLocale = this.detectCurrentLocale();
          if (detectedLocale !== this.currentLocale) {
            console.log('🔄 Language change detected via check:', this.currentLocale, '→', detectedLocale);
            this.currentLocale = detectedLocale;
            this.loadFooter(detectedLocale);
          }
        }, 2000);
        
        // Method 3: Listen for custom language change events
        document.addEventListener('languageChanged', (event) => {
          const newLocale = event.detail?.locale;
          if (newLocale && newLocale !== this.currentLocale) {
            console.log('🔄 Language change event received:', newLocale);
            this.currentLocale = newLocale;
            this.loadFooter(newLocale);
          }
        });
      }
      
      async initialize() {
        // Use detected locale instead of hardcoded 'en'
        await this.loadFooter(this.currentLocale);
        console.log('✅ Multilingual footer initialized for:', this.currentLocale);
      }
    };
    
    console.log('🚀 SecureFooterLoader enhanced with multilingual support');
  }
})();
`;

// Enhanced language switcher function
const enhancedSwitchLanguage = `
// Enhanced switchLanguage function that triggers footer updates
window.switchLanguage = function(newLang) {
  if (!newLang || !['en', 'ru', 'he'].includes(newLang)) return;
  
  console.log('🌐 Switching language to:', newLang);
  
  // Dispatch event for footer to listen to
  document.dispatchEvent(new CustomEvent('languageChanged', {
    detail: { locale: newLang }
  }));
  
  // Store preference
  localStorage.setItem('preferredLanguage', newLang);
  
  // Update document attributes
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  
  // Navigate to new language version
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split('/').filter(part => part);
  
  let newPath;
  if (pathParts[0] === 'dist' && ['en', 'ru', 'he'].includes(pathParts[1])) {
    pathParts[1] = newLang;
    newPath = '/' + pathParts.join('/');
  } else if (pathParts[0] === 'dist') {
    pathParts.splice(1, 0, newLang);
    newPath = '/' + pathParts.join('/');
  } else if (['en', 'ru', 'he'].includes(pathParts[0])) {
    pathParts[0] = newLang;
    newPath = '/' + pathParts.join('/');
  } else {
    let fileName = currentPath.split('/').pop() || 'index.html';
    if (fileName === 'home.html' || fileName === '') {
      fileName = 'index.html';
    }
    newPath = '/dist/' + newLang + '/' + fileName;
  }
  
  console.log('🔄 Navigating to:', newPath);
  window.location.href = newPath;
};`;

function applyFix() {
  try {
    console.log('📝 Updating secure-footer-loader.js...');
    
    // Update secure footer loader
    const footerLoaderPath = path.join(__dirname, 'js/secure-footer-loader.js');
    let content = fs.readFileSync(footerLoaderPath, 'utf8');
    
    // Add language detection code before the last closing brace
    const insertPoint = '// Export for module systems';
    const insertIndex = content.indexOf(insertPoint);
    
    if (insertIndex !== -1) {
      content = content.slice(0, insertIndex) + 
        languageDetectionCode + '\n\n' +
        content.slice(insertIndex);
      
      fs.writeFileSync(footerLoaderPath, content);
      console.log('✅ Enhanced SecureFooterLoader with language detection');
    } else {
      console.log('⚠️ Could not find insertion point in secure-footer-loader.js');
    }
    
    // Update HTML files with enhanced language switcher
    const htmlFiles = ['home.html', 'index.html'];
    let updatedFiles = 0;
    
    htmlFiles.forEach(fileName => {
      const filePath = path.join(__dirname, fileName);
      if (fs.existsSync(filePath)) {
        console.log('📝 Updating', fileName, '...');
        let htmlContent = fs.readFileSync(filePath, 'utf8');
        
        // Find and replace the switchLanguage function
        const switchFunctionStart = htmlContent.indexOf('window.switchLanguage = function(newLang)');
        if (switchFunctionStart !== -1) {
          const switchFunctionEnd = htmlContent.indexOf('};', switchFunctionStart) + 2;
          
          htmlContent = htmlContent.slice(0, switchFunctionStart) + 
            enhancedSwitchLanguage.trim().replace('window.switchLanguage = function(newLang) {', 'window.switchLanguage = function(newLang) {') +
            htmlContent.slice(switchFunctionEnd);
          
          fs.writeFileSync(filePath, htmlContent);
          updatedFiles++;
          console.log('✅ Updated', fileName, 'with enhanced language switcher');
        } else {
          console.log('⚠️ Could not find switchLanguage function in', fileName);
        }
      }
    });
    
    console.log('\n🎉 MULTILINGUAL FOOTER FIX APPLIED!');
    console.log('✅ Enhanced footer loader with language detection');
    console.log('✅ Updated', updatedFiles, 'HTML files');
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Restart the server');
    console.log('2. Test language switching - footer should now update automatically!');
    
    return true;
  } catch (error) {
    console.error('❌ Error applying fix:', error);
    return false;
  }
}

applyFix();