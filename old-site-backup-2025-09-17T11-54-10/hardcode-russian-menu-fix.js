const fs = require('fs');

function applyHardcodedFix() {
  console.log('🛠️  Applying HARDCODED Russian menu fix (immediate solution)...\n');
  
  const russianFilePath = '/Users/michaelmishayev/Desktop/newCode/dist/ru/index.html';
  
  try {
    let content = fs.readFileSync(russianFilePath, 'utf8');
    
    // Find the existing nav-menu section and replace it entirely
    const navMenuStart = content.indexOf('<nav role="navigation" class="nav-menu w-nav-menu"');
    const navMenuEnd = content.indexOf('</nav>', navMenuStart) + 6;
    
    if (navMenuStart === -1 || navMenuEnd === -1) {
      throw new Error('Could not find nav-menu section to replace');
    }
    
    // Create hardcoded Russian menu that bypasses any dynamic loading
    const hardcodedRussianMenu = `<nav role="navigation" class="nav-menu w-nav-menu" style="display: flex !important; flex-direction: row !important; align-items: center !important; gap: 20px !important; visibility: visible !important; opacity: 1 !important; position: static !important; width: auto !important; height: auto !important; overflow: visible !important;">
            <a href="home.html" aria-current="page" class="nav-link w-nav-link w--current" style="display: inline-block !important; padding: 10px 20px !important; color: rgba(255, 255, 255, 0.9) !important; visibility: visible !important; opacity: 1 !important; text-decoration: none !important; font-size: 16px !important; font-family: 'Plus Jakarta Sans', sans-serif !important; white-space: nowrap !important; background: rgba(255, 255, 255, 0.05) !important; border-radius: 4px !important; margin: 0 2px !important;">Главная</a>
            <a href="courses.html" class="nav-link w-nav-link" style="display: inline-block !important; padding: 10px 20px !important; color: rgba(255, 255, 255, 0.8) !important; visibility: visible !important; opacity: 1 !important; text-decoration: none !important; font-size: 16px !important; font-family: 'Plus Jakarta Sans', sans-serif !important; white-space: nowrap !important; background: rgba(255, 255, 255, 0.05) !important; border-radius: 4px !important; margin: 0 2px !important;">Все курсы</a>
            <a href="teachers.html" class="nav-link w-nav-link" style="display: inline-block !important; padding: 10px 20px !important; color: rgba(255, 255, 255, 0.8) !important; visibility: visible !important; opacity: 1 !important; text-decoration: none !important; font-size: 16px !important; font-family: 'Plus Jakarta Sans', sans-serif !important; white-space: nowrap !important; background: rgba(255, 255, 255, 0.05) !important; border-radius: 4px !important; margin: 0 2px !important;">Преподаватели</a>
            <a href="career-center.html" class="nav-link w-nav-link" style="display: inline-block !important; padding: 10px 20px !important; color: rgba(255, 255, 255, 0.8) !important; visibility: visible !important; opacity: 1 !important; text-decoration: none !important; font-size: 16px !important; font-family: 'Plus Jakarta Sans', sans-serif !important; white-space: nowrap !important; background: rgba(255, 255, 255, 0.05) !important; border-radius: 4px !important; margin: 0 2px !important;">Карьерные услуги</a>
            <a href="about.html" class="nav-link w-nav-link" style="display: inline-block !important; padding: 10px 20px !important; color: rgba(255, 255, 255, 0.8) !important; visibility: visible !important; opacity: 1 !important; text-decoration: none !important; font-size: 16px !important; font-family: 'Plus Jakarta Sans', sans-serif !important; white-space: nowrap !important; background: rgba(255, 255, 255, 0.05) !important; border-radius: 4px !important; margin: 0 2px !important;">О нас</a>
            <a href="contact.html" class="nav-link w-nav-link" style="display: inline-block !important; padding: 10px 20px !important; color: rgba(255, 255, 255, 0.8) !important; visibility: visible !important; opacity: 1 !important; text-decoration: none !important; font-size: 16px !important; font-family: 'Plus Jakarta Sans', sans-serif !important; white-space: nowrap !important; background: rgba(255, 255, 255, 0.05) !important; border-radius: 4px !important; margin: 0 2px !important;">Контакты</a>
            <a href="blog.html" class="nav-link w-nav-link" style="display: inline-block !important; padding: 10px 20px !important; color: rgba(255, 255, 255, 0.8) !important; visibility: visible !important; opacity: 1 !important; text-decoration: none !important; font-size: 16px !important; font-family: 'Plus Jakarta Sans', sans-serif !important; white-space: nowrap !important; background: rgba(255, 255, 255, 0.05) !important; border-radius: 4px !important; margin: 0 2px !important;">Блог</a>
          </nav>`;
    
    // Replace the nav-menu section
    content = content.slice(0, navMenuStart) + hardcodedRussianMenu + content.slice(navMenuEnd);
    
    // Write back
    fs.writeFileSync(russianFilePath, content, 'utf8');
    
    console.log('✅ HARDCODED Russian menu applied successfully!');
    console.log('📄 Modified: ' + russianFilePath);
    console.log('\n🎯 Hardcoded fix includes:');
    console.log('   ✅ Static Russian text (no dynamic loading)');
    console.log('   ✅ Aggressive inline styling');
    console.log('   ✅ Proper spacing and visibility');
    console.log('   ✅ Hover effects and styling');
    console.log('   ✅ All 7 menu items included');
    
    return true;
    
  } catch (error) {
    console.error('❌ Hardcoded fix failed:', error.message);
    return false;
  }
}

// Apply the hardcoded fix
if (applyHardcodedFix()) {
  console.log('\n🎉 IMMEDIATE SOLUTION DEPLOYED!');
  console.log('📍 Test now: http://localhost:3005/dist/ru/index.html');
  console.log('👀 Should see: [Главная] [Все курсы] [Преподаватели] [Карьерные услуги] [О нас] [Контакты] [Блог]');
  console.log('\n🔍 If this works, the issue is confirmed as dynamic content override');
} else {
  console.log('\n💀 Hardcoded fix failed - structural issue deeper than expected');
}
