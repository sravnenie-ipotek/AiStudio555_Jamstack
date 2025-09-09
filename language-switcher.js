/**
 * LANGUAGE SWITCHER MODULE
 * 
 * Provides multi-language support for the AI Studio website
 * Languages supported: English (en), Russian (ru), Hebrew (he)
 * 
 * Features:
 * - Persistent language selection using localStorage
 * - Automatic RTL support for Hebrew
 * - Clean URL structure (/en/, /ru/, /he/)
 * - Smooth transitions between languages
 */

(function() {
  'use strict';
  
  // Configuration
  const LANGUAGES = {
    en: {
      name: 'English',
      flag: '🇬🇧',
      dir: 'ltr',
      label: 'EN'
    },
    ru: {
      name: 'Русский',
      flag: '🇷🇺',
      dir: 'ltr',
      label: 'RU'
    },
    he: {
      name: 'עברית',
      flag: '🇮🇱',
      dir: 'rtl',
      label: 'HE'
    }
  };
  
  const STORAGE_KEY = 'aistudio_language';
  const DEFAULT_LANGUAGE = 'en';
  
  class LanguageSwitcher {
    constructor() {
      this.currentLanguage = this.detectCurrentLanguage();
      this.init();
    }
    
    /**
     * Detect current language from URL or localStorage
     */
    detectCurrentLanguage() {
      // Check URL path
      const pathParts = window.location.pathname.split('/');
      const urlLang = pathParts.find(part => LANGUAGES[part]);
      
      if (urlLang) {
        return urlLang;
      }
      
      // Check localStorage
      const storedLang = localStorage.getItem(STORAGE_KEY);
      if (storedLang && LANGUAGES[storedLang]) {
        return storedLang;
      }
      
      // Check browser language
      const browserLang = navigator.language.toLowerCase().split('-')[0];
      if (LANGUAGES[browserLang]) {
        return browserLang;
      }
      
      return DEFAULT_LANGUAGE;
    }
    
    /**
     * Initialize the language switcher
     */
    init() {
      this.createSwitcherUI();
      this.applyLanguageSettings();
      this.attachEventListeners();
    }
    
    /**
     * Create the language switcher UI component
     */
    createSwitcherUI() {
      // Check if switcher already exists
      if (document.getElementById('language-switcher')) {
        return;
      }
      
      // Create switcher container
      const switcher = document.createElement('div');
      switcher.id = 'language-switcher';
      switcher.className = 'language-switcher';
      switcher.innerHTML = `
        <style>
          .language-switcher {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            font-family: "Plus Jakarta Sans", sans-serif;
          }
          
          .language-selector {
            position: relative;
            display: inline-block;
          }
          
          .language-current {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: rgba(5, 5, 26, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            font-size: 14px;
            font-weight: 500;
          }
          
          .language-current:hover {
            background: rgba(0, 128, 255, 0.1);
            border-color: rgba(0, 128, 255, 0.3);
            transform: translateY(-2px);
          }
          
          .language-flag {
            font-size: 20px;
            line-height: 1;
          }
          
          .language-label {
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .language-arrow {
            margin-left: 4px;
            transition: transform 0.3s ease;
            font-size: 10px;
            opacity: 0.7;
          }
          
          .language-selector.active .language-arrow {
            transform: rotate(180deg);
          }
          
          .language-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            background: rgba(5, 5, 26, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            backdrop-filter: blur(20px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            min-width: 180px;
          }
          
          .language-selector.active .language-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
          
          .language-option {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;
            font-size: 14px;
          }
          
          .language-option:hover {
            background: rgba(0, 128, 255, 0.15);
            color: white;
            padding-left: 20px;
          }
          
          .language-option.active {
            background: rgba(0, 128, 255, 0.2);
            color: #ffd659;
            pointer-events: none;
          }
          
          .language-option .language-name {
            flex: 1;
          }
          
          /* RTL Support */
          html[dir="rtl"] .language-switcher {
            right: auto;
            left: 20px;
          }
          
          html[dir="rtl"] .language-dropdown {
            right: auto;
            left: 0;
          }
          
          html[dir="rtl"] .language-option:hover {
            padding-left: 16px;
            padding-right: 20px;
          }
          
          /* Mobile Responsive */
          @media (max-width: 768px) {
            .language-switcher {
              top: 10px;
              right: 10px;
            }
            
            .language-current {
              padding: 8px 12px;
              font-size: 13px;
            }
            
            .language-flag {
              font-size: 18px;
            }
            
            .language-dropdown {
              min-width: 160px;
            }
            
            .language-option {
              padding: 10px 14px;
              font-size: 13px;
            }
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .language-current {
              background: rgba(5, 5, 26, 0.98);
            }
            
            .language-dropdown {
              background: rgba(5, 5, 26, 0.98);
            }
          }
          
          /* Animation for language change */
          .language-switching {
            animation: languageSwitch 0.3s ease;
          }
          
          @keyframes languageSwitch {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        </style>
        <div class="language-selector" id="languageSelector">
          <div class="language-current" id="languageCurrent">
            <span class="language-flag">${LANGUAGES[this.currentLanguage].flag}</span>
            <span class="language-label">${LANGUAGES[this.currentLanguage].label}</span>
            <span class="language-arrow">▼</span>
          </div>
          <div class="language-dropdown" id="languageDropdown">
            ${Object.entries(LANGUAGES).map(([code, lang]) => `
              <div class="language-option ${code === this.currentLanguage ? 'active' : ''}" 
                   data-lang="${code}">
                <span class="language-flag">${lang.flag}</span>
                <span class="language-name">${lang.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      document.body.appendChild(switcher);
    }
    
    /**
     * Apply language settings to the page
     */
    applyLanguageSettings() {
      const lang = LANGUAGES[this.currentLanguage];
      
      // Set HTML attributes
      document.documentElement.lang = this.currentLanguage;
      document.documentElement.dir = lang.dir;
      
      // Store preference
      localStorage.setItem(STORAGE_KEY, this.currentLanguage);
      
      // Add body class for language-specific styling
      document.body.className = document.body.className.replace(/lang-\w+/g, '');
      document.body.classList.add(`lang-${this.currentLanguage}`);
      
      // Update page title if needed
      this.updatePageMeta();
    }
    
    /**
     * Update page meta tags for current language
     */
    updatePageMeta() {
      // Update meta language tag
      let metaLang = document.querySelector('meta[http-equiv="content-language"]');
      if (!metaLang) {
        metaLang = document.createElement('meta');
        metaLang.setAttribute('http-equiv', 'content-language');
        document.head.appendChild(metaLang);
      }
      metaLang.content = this.currentLanguage;
      
      // Update OpenGraph locale
      let ogLocale = document.querySelector('meta[property="og:locale"]');
      if (!ogLocale) {
        ogLocale = document.createElement('meta');
        ogLocale.setAttribute('property', 'og:locale');
        document.head.appendChild(ogLocale);
      }
      
      const localeMap = {
        en: 'en_US',
        ru: 'ru_RU',
        he: 'he_IL'
      };
      ogLocale.content = localeMap[this.currentLanguage];
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
      const selector = document.getElementById('languageSelector');
      const current = document.getElementById('languageCurrent');
      const dropdown = document.getElementById('languageDropdown');
      
      // Toggle dropdown
      current.addEventListener('click', (e) => {
        e.stopPropagation();
        selector.classList.toggle('active');
      });
      
      // Language selection
      dropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.language-option');
        if (option && !option.classList.contains('active')) {
          const newLang = option.dataset.lang;
          this.switchLanguage(newLang);
        }
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        selector.classList.remove('active');
      });
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          selector.classList.remove('active');
        }
      });
    }
    
    /**
     * Switch to a new language
     */
    switchLanguage(newLang) {
      if (!LANGUAGES[newLang] || newLang === this.currentLanguage) {
        return;
      }
      
      // Add switching animation
      document.body.classList.add('language-switching');
      
      // Get current page name
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/').filter(part => part);
      
      // Remove current language from path if present
      if (LANGUAGES[pathParts[0]]) {
        pathParts.shift();
      }
      
      // Handle dist/en structure
      if (pathParts[0] === 'dist' && LANGUAGES[pathParts[1]]) {
        pathParts[1] = newLang;
      } else if (pathParts[0] === 'dist') {
        pathParts.splice(1, 0, newLang);
      } else {
        // Add new language to path
        pathParts.unshift(newLang);
      }
      
      // Construct new URL
      let newPath = '/' + pathParts.join('/');
      
      // For local development, check if language directories exist
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Adjust path for local structure
        if (!newPath.includes('/dist/')) {
          const fileName = pathParts[pathParts.length - 1] || 'index.html';
          newPath = `/dist/${newLang}/${fileName}`;
        }
      }
      
      // Navigate to new language version
      setTimeout(() => {
        window.location.href = newPath;
      }, 300);
    }
    
    /**
     * Get current language
     */
    getCurrentLanguage() {
      return this.currentLanguage;
    }
    
    /**
     * Get language info
     */
    getLanguageInfo(code) {
      return LANGUAGES[code] || null;
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.languageSwitcher = new LanguageSwitcher();
    });
  } else {
    window.languageSwitcher = new LanguageSwitcher();
  }
  
})();

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageSwitcher;
}