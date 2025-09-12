#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Main HTML files to update (excluding test files and backups)
const MAIN_FILES = [
  'index.html',
  'about-us.html', 
  'contact-us.html',
  'pricing.html',
  'blog.html',
  'detail_blog.html',
  'detail_courses.html',
  'teachers.html',
  'career-center.html',
  'career-orientation.html',
  'content-admin-comprehensive.html'
];

const SECURE_FOOTER_SCRIPT = `
  <!-- Secure Footer Loader - Emergency Security Fix -->
  <script src="js/secure-footer-loader.js"></script>
  <script>
    // Initialize secure footer loading
    document.addEventListener('DOMContentLoaded', function() {
      if (window.SecureFooterLoader) {
        const footerLoader = new window.SecureFooterLoader({
          containerId: 'secure-footer-container',
          debug: false,
          fallbackEnabled: true
        });
        footerLoader.initialize();
      }
    });
  </script>

</body>
</html>`;

console.log('🔧 Applying secure footer loader to production HTML files...');

let updated = 0;
let errors = 0;

MAIN_FILES.forEach(filename => {
  const filepath = path.join(__dirname, filename);
  
  try {
    if (!fs.existsSync(filepath)) {
      console.log(`⚠️  File not found: ${filename}`);
      return;
    }

    let content = fs.readFileSync(filepath, 'utf8');
    
    // Check if already has secure footer loader
    if (content.includes('secure-footer-loader.js')) {
      console.log(`✅ Already secured: ${filename}`);
      return;
    }
    
    // Add ID to footer section
    content = content.replace(
      /<section class="section footer"([^>]*)>/g,
      '<section class="section footer" id="secure-footer-container"$1>'
    );
    
    // Add secure footer script before closing body tag
    content = content.replace(
      /<\/body>\s*<\/html>\s*$/,
      SECURE_FOOTER_SCRIPT
    );
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`🔐 Secured: ${filename}`);
    updated++;
    
  } catch (error) {
    console.error(`❌ Error updating ${filename}:`, error.message);
    errors++;
  }
});

console.log(`\n🎯 Footer Security Integration Complete:`);
console.log(`   ✅ Files updated: ${updated}`);
console.log(`   ❌ Errors: ${errors}`);

if (updated > 0) {
  console.log(`\n🔒 Successfully applied secure footer loader to ${updated} files`);
  console.log('   • XSS protection enabled');  
  console.log('   • Memory leak prevention active');
  console.log('   • Robust error handling implemented');
  console.log('   • Dynamic content loading secured');
}