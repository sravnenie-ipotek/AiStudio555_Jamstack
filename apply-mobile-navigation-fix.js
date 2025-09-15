#!/usr/bin/env node

/**
 * Apply Universal Mobile Navigation Fix to All HTML Files
 *
 * This script:
 * 1. Adds the new mobile navigation CSS and JS files to all HTML pages
 * 2. Removes duplicate hamburger buttons from HTML
 * 3. Ensures consistent mobile navigation across all pages
 * 4. Updates both root and language-specific directories
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONFIG = {
  // Files to include the new mobile navigation fix
  CSS_FILE: '../css/mobile-navigation-complete-fix.css',
  JS_FILE: '../js/universal-mobile-navigation-fix.js',

  // CSS files to potentially replace
  OLD_MOBILE_CSS: [
    'mobile-menu-proper-fix.css',
    'mobile-menu-fix.css',
    'mobile-fix.css'
  ],

  // JS files to potentially replace
  OLD_MOBILE_JS: [
    'mobile-menu-toggle-fix.js',
    'mobile-menu-fix.js',
    'mobile-menu-initial-state.js'
  ],

  // HTML patterns to find and remove (duplicate hamburger buttons)
  REMOVE_PATTERNS: [
    /<div class="menu-button w-nav-button">[\s\S]*?<\/div>/gi,
    /<div[^>]*class="[^"]*hamburger-menu-icon[^"]*"[^>]*>[\s\S]*?<\/div>/gi
  ],

  // Directories to process
  DIRECTORIES: [
    '.',           // Root directory
    'dist/en',     // English pages
    'dist/ru',     // Russian pages
    'dist/he',     // Hebrew pages
    'en',          // English direct
    'ru',          // Russian direct
    'he'           // Hebrew direct
  ]
};

class MobileNavigationFixer {
  constructor() {
    this.processedFiles = 0;
    this.errors = [];
    this.changes = [];
  }

  async run() {
    console.log('🔧 Universal Mobile Navigation Fix - Starting...\n');

    try {
      // Find all HTML files
      const htmlFiles = await this.findHtmlFiles();
      console.log(`📁 Found ${htmlFiles.length} HTML files to process\n`);

      // Process each file
      for (const file of htmlFiles) {
        await this.processHtmlFile(file);
      }

      // Report results
      this.reportResults();

    } catch (error) {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    }
  }

  async findHtmlFiles() {
    const patterns = [
      '*.html',
      'dist/en/*.html',
      'dist/ru/*.html',
      'dist/he/*.html',
      'en/*.html',
      'ru/*.html',
      'he/*.html'
    ];

    const allFiles = [];

    for (const pattern of patterns) {
      try {
        const files = await glob(pattern, {
          ignore: [
            'node_modules/**',
            'template-pages/**',
            '**/backup/**',
            '**/*backup*.html',
            '**/*test*.html'
          ]
        });
        allFiles.push(...files);
      } catch (error) {
        console.warn(`⚠️ Warning: Could not process pattern ${pattern}:`, error.message);
      }
    }

    // Remove duplicates and sort
    return [...new Set(allFiles)].sort();
  }

  async processHtmlFile(filePath) {
    try {
      console.log(`📝 Processing: ${filePath}`);

      // Read file
      const content = fs.readFileSync(filePath, 'utf8');
      let updatedContent = content;
      let hasChanges = false;

      // 1. Add new CSS file if not present
      const cssPath = this.getCssPath(filePath);
      if (!content.includes('mobile-navigation-complete-fix.css')) {
        updatedContent = this.addCssFile(updatedContent, cssPath);
        hasChanges = true;
        this.changes.push(`${filePath}: Added mobile navigation CSS`);
      }

      // 2. Add new JS file if not present
      const jsPath = this.getJsPath(filePath);
      if (!content.includes('universal-mobile-navigation-fix.js')) {
        updatedContent = this.addJsFile(updatedContent, jsPath);
        hasChanges = true;
        this.changes.push(`${filePath}: Added mobile navigation JS`);
      }

      // 3. Remove duplicate hamburger buttons
      const withoutHamburgers = this.removeDuplicateHamburgers(updatedContent);
      if (withoutHamburgers !== updatedContent) {
        updatedContent = withoutHamburgers;
        hasChanges = true;
        this.changes.push(`${filePath}: Removed duplicate hamburger buttons`);
      }

      // 4. Update old mobile CSS references
      const withUpdatedCss = this.updateOldCssReferences(updatedContent, cssPath);
      if (withUpdatedCss !== updatedContent) {
        updatedContent = withUpdatedCss;
        hasChanges = true;
        this.changes.push(`${filePath}: Updated old CSS references`);
      }

      // 5. Update old mobile JS references
      const withUpdatedJs = this.updateOldJsReferences(updatedContent, jsPath);
      if (withUpdatedJs !== updatedContent) {
        updatedContent = withUpdatedJs;
        hasChanges = true;
        this.changes.push(`${filePath}: Updated old JS references`);
      }

      // Write file if changes were made
      if (hasChanges) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
      } else {
        console.log(`⏭️ No changes: ${filePath}`);
      }

      this.processedFiles++;

    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
      this.errors.push({ file: filePath, error: error.message });
    }
  }

  getCssPath(filePath) {
    // Determine correct relative path for CSS based on file location
    if (filePath.includes('dist/') || filePath.includes('en/') || filePath.includes('ru/') || filePath.includes('he/')) {
      return '../css/mobile-navigation-complete-fix.css';
    }
    return 'css/mobile-navigation-complete-fix.css';
  }

  getJsPath(filePath) {
    // Determine correct relative path for JS based on file location
    if (filePath.includes('dist/') || filePath.includes('en/') || filePath.includes('ru/') || filePath.includes('he/')) {
      return '../js/universal-mobile-navigation-fix.js';
    }
    return 'js/universal-mobile-navigation-fix.js';
  }

  addCssFile(content, cssPath) {
    // Find the head section and add the CSS link
    const headMatch = content.match(/<head[\s\S]*?<\/head>/i);
    if (!headMatch) {
      console.warn('⚠️ Could not find <head> section');
      return content;
    }

    const cssLink = `  <link href="${cssPath}" rel="stylesheet" type="text/css">`;

    // Try to add after existing CSS links
    if (content.includes('</head>')) {
      return content.replace('</head>', `${cssLink}\n</head>`);
    }

    return content;
  }

  addJsFile(content, jsPath) {
    // Find the end of body and add the JS script
    const jsScript = `  <script src="${jsPath}"></script>`;

    // Try to add before closing body tag
    if (content.includes('</body>')) {
      return content.replace('</body>', `${jsScript}\n</body>`);
    }

    // Fallback: add before closing html tag
    if (content.includes('</html>')) {
      return content.replace('</html>', `${jsScript}\n</html>`);
    }

    return content;
  }

  removeDuplicateHamburgers(content) {
    let result = content;

    // Remove hamburger button divs
    result = result.replace(
      /<div[^>]*class="[^"]*(?:menu-button|hamburger-menu-icon)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      ''
    );

    // Remove any remaining w-nav-button divs that might contain hamburger content
    result = result.replace(
      /<div[^>]*class="[^"]*w-nav-button[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      ''
    );

    // Clean up any leftover empty lines
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n');

    return result;
  }

  updateOldCssReferences(content, newCssPath) {
    let result = content;

    CONFIG.OLD_MOBILE_CSS.forEach(oldCss => {
      const pattern = new RegExp(`<link[^>]*href="[^"]*${oldCss}"[^>]*>`, 'gi');
      if (result.match(pattern)) {
        // Replace with new CSS reference
        result = result.replace(pattern, `<link href="${newCssPath}" rel="stylesheet" type="text/css">`);
      }
    });

    return result;
  }

  updateOldJsReferences(content, newJsPath) {
    let result = content;

    CONFIG.OLD_MOBILE_JS.forEach(oldJs => {
      const pattern = new RegExp(`<script[^>]*src="[^"]*${oldJs}"[^>]*><\/script>`, 'gi');
      if (result.match(pattern)) {
        // Replace with new JS reference
        result = result.replace(pattern, `<script src="${newJsPath}"></script>`);
      }
    });

    return result;
  }

  reportResults() {
    console.log('\n🎉 Mobile Navigation Fix Complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   • Files processed: ${this.processedFiles}`);
    console.log(`   • Changes made: ${this.changes.length}`);
    console.log(`   • Errors: ${this.errors.length}`);

    if (this.changes.length > 0) {
      console.log('\n✅ Changes made:');
      this.changes.forEach(change => console.log(`   • ${change}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(error => console.log(`   • ${error.file}: ${error.error}`));
    }

    console.log('\n🔍 Next steps:');
    console.log('   1. Test mobile navigation on a few pages');
    console.log('   2. Run Playwright tests to verify functionality');
    console.log('   3. Check console for any JavaScript errors');
    console.log('   4. Verify language switching works in mobile menu');
    console.log('\n📱 Mobile navigation should now have:');
    console.log('   • Single hamburger button (no duplicates)');
    console.log('   • Proper close (X) functionality');
    console.log('   • Language selector in mobile menu');
    console.log('   • All navigation options working');
    console.log('   • Consistent behavior across all pages');
  }
}

// Self-executing function to check if we have required dependencies
async function checkDependencies() {
  try {
    require('glob');
    return true;
  } catch (error) {
    console.error('❌ Missing required dependency: glob');
    console.log('📦 Please install it with: npm install glob');
    return false;
  }
}

// Main execution
async function main() {
  const hasDepedencies = await checkDependencies();
  if (!hasDepedencies) {
    process.exit(1);
  }

  const fixer = new MobileNavigationFixer();
  await fixer.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = MobileNavigationFixer;