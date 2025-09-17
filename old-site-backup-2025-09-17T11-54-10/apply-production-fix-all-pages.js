const fs = require('fs');
const path = require('path');

// Production navigation fix script content
const PRODUCTION_FIX_SCRIPT = `
  <!-- Production Navigation Fix Script -->
  <script>
    // PRODUCTION NAVIGATION FIX - Removes "Pages" and fixes null errors
    (function() {
      'use strict';
      
      // Fix 1: Remove unwanted "Pages" and "Blog" menu items
      function removeUnwantedMenuItems() {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', removeUnwantedMenuItems);
          return;
        }
        
        const navMenu = document.querySelector('.nav-menu, .w-nav-menu');
        if (!navMenu) return;
        
        // Remove Pages and Blog links
        const navLinks = navMenu.querySelectorAll('.nav-link, .w-nav-link');
        navLinks.forEach(link => {
          const text = link.textContent.trim();
          if (text === 'Pages' || text === 'Blog') {
            const dropdownWrapper = link.closest('.menu-dropdown-wrapper, .w-dropdown');
            if (dropdownWrapper) {
              dropdownWrapper.remove();
            } else {
              link.remove();
            }
          }
        });
        
        // Remove Pages and Blog dropdowns
        const dropdownToggles = navMenu.querySelectorAll('.dropdown-toggle-text-block');
        dropdownToggles.forEach(toggle => {
          const text = toggle.textContent.trim();
          if (text === 'Pages' || text === 'Blog') {
            const wrapper = toggle.closest('.menu-dropdown-wrapper, .w-dropdown');
            if (wrapper) wrapper.remove();
          }
        });
      }
      
      // Fix 2: Prevent null reference errors
      function preventNullErrors() {
        // Patch potential null access issues
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.childElementCount === undefined) {
                  try {
                    Object.defineProperty(node, 'childElementCount', {
                      get: function() { return this.children ? this.children.length : 0; }
                    });
                  } catch (e) {}
                }
              });
            }
          });
        });
        
        if (document.body) {
          observer.observe(document.body, { childList: true, subtree: true });
        }
      }
      
      // Initialize fixes
      function initializeFixes() {
        try {
          preventNullErrors();
          removeUnwantedMenuItems();
          
          // Reapply after delays to catch dynamic content
          setTimeout(removeUnwantedMenuItems, 500);
          setTimeout(removeUnwantedMenuItems, 1500);
          setTimeout(removeUnwantedMenuItems, 3000);
        } catch (error) {
          console.error('Navigation fix error:', error);
        }
      }
      
      // Run immediately and on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFixes);
      } else {
        initializeFixes();
      }
    })();
  </script>`;

const FIX_MARKER = 'PRODUCTION NAVIGATION FIX - Removes "Pages" and fixes null errors';

async function applyProductionFixToAllPages() {
  console.log('🚀 APPLYING PRODUCTION NAVIGATION FIX TO ALL PAGES');
  console.log('='.repeat(50));
  
  const distDir = path.join(__dirname, 'dist', 'en');
  
  if (!fs.existsSync(distDir)) {
    console.log('❌ ERROR: dist/en directory not found!');
    return false;
  }
  
  const files = fs.readdirSync(distDir)
    .filter(file => file.endsWith('.html'))
    .filter(file => !file.startsWith('test-'));
  
  console.log(`📁 Found ${files.length} HTML files to process:\n`);
  
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const filePath = path.join(distDir, file);
    console.log(`📄 Processing: ${file}`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if fix is already applied
      if (content.includes(FIX_MARKER)) {
        console.log(`   ⏭️  SKIPPED - Production fix already applied`);
        skippedCount++;
        continue;
      }
      
      let updatedContent = content;
      
      // Find </head> tag and insert script before it
      const headEndIndex = content.lastIndexOf('</head>');
      
      if (headEndIndex !== -1) {
        updatedContent = content.slice(0, headEndIndex) + 
                        PRODUCTION_FIX_SCRIPT + '\n' +
                        content.slice(headEndIndex);
        console.log(`   ✅ Added production fix script before </head>`);
      }
      // If no </head>, try before </body>
      else {
        const bodyEndIndex = content.lastIndexOf('</body>');
        if (bodyEndIndex !== -1) {
          updatedContent = content.slice(0, bodyEndIndex) + 
                          PRODUCTION_FIX_SCRIPT + '\n' +
                          content.slice(bodyEndIndex);
          console.log(`   ✅ Added production fix script before </body>`);
        } else {
          console.log(`   ⚠️  WARNING - No suitable injection point found`);
          continue;
        }
      }
      
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`   💾 File updated successfully`);
      processedCount++;
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      errorCount++;
    }
    
    console.log('');
  }
  
  console.log('📊 PRODUCTION FIX APPLICATION SUMMARY:');
  console.log('═'.repeat(40));
  console.log(`✅ Successfully processed: ${processedCount} files`);
  console.log(`⏭️  Already had fix: ${skippedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`📁 Total files: ${files.length}`);
  
  console.log('\n✨ PRODUCTION FIXES APPLIED:');
  console.log('   ✅ Pages/Blog menu items will be removed');
  console.log('   ✅ Null reference errors will be prevented');
  console.log('   ✅ Navigation consistency ensured');
  
  return errorCount === 0;
}

// Run the application
applyProductionFixToAllPages().then(success => {
  process.exit(success ? 0 : 1);
}).catch(console.error);