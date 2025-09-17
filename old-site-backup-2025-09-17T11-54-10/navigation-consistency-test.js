const puppeteer = require('puppeteer');

async function testNavigationConsistency() {
  console.log('🔍 NAVIGATION CONSISTENCY TEST - VERIFYING MENU STRUCTURE...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // List of pages to test
  const pages = [
    'http://localhost:9090/dist/en/index.html',
    'http://localhost:9090/dist/en/courses.html',
    'http://localhost:9090/dist/en/teachers.html',
    'http://localhost:9090/dist/en/career-center.html',
    'http://localhost:9090/dist/en/career-orientation.html',
    'http://localhost:9090/dist/en/detail_courses.html',
    'http://localhost:9090/dist/en/about.html'
  ];
  
  const expectedOrder = ['Home', 'Courses', 'Teachers', 'Career Services', 'Pricing'];
  const results = {};
  let allConsistent = true;
  
  for (const pageUrl of pages) {
    try {
      console.log(`📄 TESTING: ${pageUrl.split('/').pop()}`);
      console.log(`🔗 URL: ${pageUrl}`);
      
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 10000 });
      
      // Get navigation menu items in order
      const navItems = await page.evaluate(() => {
        const navLinks = Array.from(document.querySelectorAll('.nav-menu .nav-link'));
        const dropdowns = Array.from(document.querySelectorAll('.nav-menu .menu-dropdown-wrapper .dropdown-toggle-text-block'));
        
        const items = [];
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return [];
        
        // Get all child elements in order
        const children = Array.from(navMenu.children);
        children.forEach(child => {
          if (child.classList.contains('nav-link')) {
            items.push(child.textContent.trim());
          } else if (child.classList.contains('menu-dropdown-wrapper')) {
            const dropdownText = child.querySelector('.dropdown-toggle-text-block');
            if (dropdownText) {
              items.push(dropdownText.textContent.trim());
            }
          }
        });
        
        return items;
      });
      
      console.log(`   ✅ Menu items found: ${navItems.join(' | ')}`);
      
      // Check if Career Services dropdown exists and contains correct links
      const careerServicesDropdown = await page.evaluate(() => {
        const dropdown = document.querySelector('.menu-dropdown-wrapper .dropdown-list');
        if (!dropdown) return null;
        
        const links = Array.from(dropdown.querySelectorAll('a'));
        return links.map(link => link.textContent.trim());
      });
      
      if (careerServicesDropdown) {
        console.log(`   ✅ Career Services dropdown: ${careerServicesDropdown.join(' | ')}`);
      } else {
        console.log(`   ❌ Career Services dropdown: MISSING`);
      }
      
      // Store results
      results[pageUrl.split('/').pop()] = {
        url: pageUrl,
        navItems,
        careerServicesDropdown,
        matchesExpected: JSON.stringify(navItems) === JSON.stringify(expectedOrder)
      };
      
      // Check consistency
      if (JSON.stringify(navItems) !== JSON.stringify(expectedOrder)) {
        console.log(`   ❌ INCORRECT ORDER - Expected: ${expectedOrder.join(' | ')}`);
        allConsistent = false;
      } else {
        console.log(`   ✅ CORRECT ORDER - Matches expected pattern`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      allConsistent = false;
    }
  }
  
  // Final summary
  console.log('🏆 NAVIGATION CONSISTENCY TEST SUMMARY:');
  console.log('═'.repeat(50));
  
  if (allConsistent) {
    console.log('✅ ALL PAGES HAVE CONSISTENT NAVIGATION!');
    console.log('✅ Menu order matches expected pattern: Home | Courses | Teachers | Career Services | Pricing');
    console.log('✅ Navigation is now STATIC across all pages');
  } else {
    console.log('❌ NAVIGATION INCONSISTENCIES FOUND:');
    Object.entries(results).forEach(([page, result]) => {
      if (!result.matchesExpected) {
        console.log(`   - ${page}: ${result.navItems.join(' | ')}`);
      }
    });
  }
  
  await browser.close();
  
  // Save detailed results
  const fs = require('fs');
  fs.writeFileSync('navigation-consistency-results.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Detailed results saved to: navigation-consistency-results.json');
}

testNavigationConsistency().catch(console.error);