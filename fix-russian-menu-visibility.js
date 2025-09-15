const fs = require('fs');
const path = require('path');

function fixRussianMenuVisibility() {
  console.log('🔧 Applying Russian menu visibility fix...\n');
  
  const russianFilePath = '/Users/michaelmishayev/Desktop/newCode/dist/ru/index.html';
  
  try {
    // Read the Russian file
    let content = fs.readFileSync(russianFilePath, 'utf8');
    
    // CSS fix to force menu visibility
    const menuVisibilityFix = `
  <!-- RUSSIAN MENU VISIBILITY FIX -->
  <style>
    /* Force Russian navigation visibility - Critical Fix */
    .nav-menu.w-nav-menu {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 20px !important;
      width: auto !important;
      height: auto !important;
      overflow: visible !important;
    }
    
    .nav-menu .nav-link {
      display: inline-block !important;
      min-width: max-content !important;
      padding: 10px 20px !important;
      margin: 0 2px !important;
      white-space: nowrap !important;
      font-size: 16px !important;
      color: rgba(255, 255, 255, 0.8) !important;
      text-decoration: none !important;
      transition: color 0.3s ease !important;
    }
    
    .nav-menu .nav-link:hover {
      color: rgba(255, 255, 255, 1) !important;
    }
    
    /* Ensure navbar container is properly sized */
    .navbar-content {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 100% !important;
    }
    
    /* Fix for potential font rendering issues with Cyrillic */
    .nav-link {
      font-family: "Plus Jakarta Sans", sans-serif !important;
      font-weight: 400 !important;
      letter-spacing: 0.5px !important;
    }
    
    /* Mobile menu fixes */
    @media (max-width: 991px) {
      .nav-menu.w-nav-menu {
        flex-direction: column !important;
        padding: 20px !important;
        background: rgba(5, 5, 26, 0.95) !important;
      }
      
      .nav-menu .nav-link {
        padding: 15px 20px !important;
        width: 100% !important;
        text-align: center !important;
      }
    }
  </style>`;
    
    // Find the closing </head> tag and insert the fix before it
    if (content.includes('<!-- RUSSIAN MENU VISIBILITY FIX -->')) {
      console.log('✅ Fix already applied');
      return true;
    }
    
    const headCloseIndex = content.indexOf('</head>');
    if (headCloseIndex === -1) {
      throw new Error('Could not find </head> tag');
    }
    
    // Insert the fix
    content = content.slice(0, headCloseIndex) + menuVisibilityFix + '\n' + content.slice(headCloseIndex);
    
    // Write the updated content back
    fs.writeFileSync(russianFilePath, content, 'utf8');
    
    console.log('✅ Russian menu visibility fix applied successfully!');
    console.log('📄 Modified file: ' + russianFilePath);
    console.log('\n🎯 Fix includes:');
    console.log('   - Forced flex layout for menu container');
    console.log('   - Minimum width constraints for menu items');  
    console.log('   - Enhanced padding and spacing');
    console.log('   - Cyrillic font rendering improvements');
    console.log('   - Mobile responsive adjustments');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error applying fix:', error.message);
    return false;
  }
}

// Run the fix
if (fixRussianMenuVisibility()) {
  console.log('\n🚀 Next steps:');
  console.log('1. Refresh the Russian page: http://localhost:3005/dist/ru/index.html');
  console.log('2. Verify all 7 menu items are visible');
  console.log('3. Test on mobile viewport');
  console.log('4. Compare with Hebrew version layout');
} else {
  console.log('\n❌ Fix failed. Manual intervention required.');
}
