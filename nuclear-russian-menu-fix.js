const fs = require('fs');

function applyNuclearFix() {
  console.log('💥 Applying NUCLEAR fix for Russian menu...\n');
  
  const russianFilePath = '/Users/michaelmishayev/Desktop/newCode/dist/ru/index.html';
  
  try {
    let content = fs.readFileSync(russianFilePath, 'utf8');
    
    // Remove any existing fix
    content = content.replace(/<!-- RUSSIAN MENU VISIBILITY FIX -->[\s\S]*?<\/style>/g, '');
    
    // NUCLEAR CSS FIX - Override everything
    const nuclearFix = `
  <!-- NUCLEAR RUSSIAN MENU FIX -->
  <style>
    /* NUCLEAR OVERRIDE - Force menu visibility at all costs */
    .nav-menu.w-nav-menu,
    .nav-menu {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 20px !important;
      width: auto !important;
      height: auto !important;
      overflow: visible !important;
      position: static !important;
      background: transparent !important;
      pointer-events: auto !important;
      clip: auto !important;
      clip-path: none !important;
    }
    
    .nav-link.w-nav-link,
    .nav-link {
      display: inline-block !important;
      min-width: 80px !important;
      min-height: 20px !important;
      padding: 10px 15px !important;
      margin: 0 5px !important;
      white-space: nowrap !important;
      font-size: 16px !important;
      color: rgba(255, 255, 255, 0.9) !important;
      text-decoration: none !important;
      font-family: "Plus Jakarta Sans", Arial, sans-serif !important;
      font-weight: 400 !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: static !important;
      transform: none !important;
      z-index: 100 !important;
      background: rgba(255, 255, 255, 0.05) !important;
      border-radius: 4px !important;
      transition: all 0.3s ease !important;
    }
    
    .nav-link:hover {
      color: white !important;
      background: rgba(255, 255, 255, 0.1) !important;
    }
    
    /* Ensure container doesn't collapse */
    .navbar-content {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 100% !important;
      min-height: 60px !important;
    }
    
    /* Override any Webflow animations that might hide elements */
    .w-nav-menu * {
      animation: none !important;
      transition: color 0.3s ease, background 0.3s ease !important;
    }
    
    /* Force visibility on page load */
    body.w-loaded .nav-menu .nav-link {
      display: inline-block !important;
      opacity: 1 !important;
    }
    
    /* Debug background to see menu area */
    .nav-menu {
      border: 1px solid rgba(255, 0, 0, 0.3) !important;
      background: rgba(0, 255, 0, 0.1) !important;
    }
  </style>
  
  <script>
    // JavaScript override to ensure menu visibility
    document.addEventListener('DOMContentLoaded', function() {
      console.log('🔧 Russian menu fix: DOM loaded');
      
      setTimeout(function() {
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        console.log('🔧 Found nav menu:', !!navMenu);
        console.log('🔧 Found nav links:', navLinks.length);
        
        if (navMenu) {
          navMenu.style.cssText = 'display: flex !important; flex-direction: row !important; align-items: center !important; gap: 20px !important; visibility: visible !important; opacity: 1 !important;';
        }
        
        navLinks.forEach((link, index) => {
          link.style.cssText = 'display: inline-block !important; min-width: 80px !important; padding: 10px 15px !important; color: rgba(255, 255, 255, 0.9) !important; visibility: visible !important; opacity: 1 !important; background: rgba(255, 255, 255, 0.05) !important; border-radius: 4px !important; margin: 0 5px !important;';
          console.log('🔧 Fixed link ' + index + ':', link.textContent.trim());
        });
      }, 1000);
    });
  </script>`;
    
    // Find the closing </head> tag and insert the nuclear fix
    const headCloseIndex = content.indexOf('</head>');
    if (headCloseIndex === -1) {
      throw new Error('Could not find </head> tag');
    }
    
    // Insert the nuclear fix
    content = content.slice(0, headCloseIndex) + nuclearFix + '\n' + content.slice(headCloseIndex);
    
    // Write back
    fs.writeFileSync(russianFilePath, content, 'utf8');
    
    console.log('💥 NUCLEAR fix applied!');
    console.log('📄 Modified: ' + russianFilePath);
    console.log('\n🎯 Nuclear fix includes:');
    console.log('   - Aggressive CSS overrides with !important');
    console.log('   - JavaScript DOM manipulation after page load');
    console.log('   - Debug backgrounds to visualize menu area');
    console.log('   - Multiple fallback strategies');
    console.log('   - Console logging for debugging');
    
    return true;
    
  } catch (error) {
    console.error('❌ Nuclear fix failed:', error.message);
    return false;
  }
}

// Apply the nuclear fix
if (applyNuclearFix()) {
  console.log('\n🚀 NUCLEAR SOLUTION DEPLOYED!');
  console.log('📍 Reload: http://localhost:3005/dist/ru/index.html');
  console.log('🔍 Check browser console for debug messages');
  console.log('👀 Look for green background on menu area');
} else {
  console.log('\n💀 Even nuclear option failed!');
}
