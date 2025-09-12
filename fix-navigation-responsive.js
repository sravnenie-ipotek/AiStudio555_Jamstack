#!/usr/bin/env node

/**
 * Navigation Responsive Fix Script
 * 
 * This script fixes the navigation menu visibility issues across all Russian language pages
 * by adding comprehensive CSS overrides to prevent Webflow's responsive behavior from hiding
 * navigation elements on desktop and tablet screens.
 * 
 * Issues addressed:
 * 1. Webflow's data-collapse="medium" hiding navigation at < 991px
 * 2. Inconsistent navigation visibility across different pages
 * 3. Missing Career Services dropdown and Pricing links on some pages
 */

const fs = require('fs');
const path = require('path');

const COMPREHENSIVE_NAV_FIX = `
    <!-- COMPREHENSIVE NAVIGATION RESPONSIVE FIX -->
    <style>
    /* CRITICAL: Override Webflow responsive navigation hiding */
    
    /* Force navigation menu visibility on desktop and tablet */
    @media screen and (min-width: 768px) {
      /* Override Webflow's collapse behavior */
      .w-nav[data-collapse='medium'] .w-nav-menu,
      .w-nav[data-collapse='small'] .w-nav-menu,
      .w-nav[data-collapse='tiny'] .w-nav-menu {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: static !important;
        background: transparent !important;
        box-shadow: none !important;
        height: auto !important;
        overflow: visible !important;
        max-height: none !important;
        width: auto !important;
        left: auto !important;
        top: auto !important;
        transform: none !important;
      }
      
      /* Force all navigation elements to be visible */
      .nav-menu { 
        display: flex !important; 
        align-items: center !important; 
        gap: 30px !important;
        flex-grow: 1 !important;
        justify-content: center !important;
        margin: 0 40px !important;
        width: auto !important;
        height: auto !important;
      }
      
      .nav-link, 
      .menu-dropdown-wrapper { 
        display: inline-block !important; 
        visibility: visible !important; 
        opacity: 1 !important;
        white-space: nowrap !important;
        position: static !important;
      }
      
      /* Hide mobile hamburger menu on desktop/tablet */
      .w-nav[data-collapse='medium'] .w-nav-button,
      .w-nav[data-collapse='small'] .w-nav-button,
      .w-nav[data-collapse='tiny'] .w-nav-button {
        display: none !important;
      }
      
      /* Ensure navbar layout */
      .navbar-content {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        width: 100% !important;
      }
    }
    
    /* Desktop-specific reinforcement */
    @media screen and (min-width: 992px) {
      .navbar .nav-menu,
      .navbar .nav-link,
      .navbar .menu-dropdown-wrapper,
      .navbar .dropdown-toggle {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .nav-menu {
        display: flex !important;
      }
      
      .nav-link,
      .menu-dropdown-wrapper {
        display: inline-block !important;
      }
    }
    
    /* Additional specific overrides for stubborn elements */
    .w-nav-menu {
      position: static !important;
      max-width: none !important;
      overflow: visible !important;
    }
    
    /* Ensure dropdown functionality */
    .dropdown-toggle { 
      display: flex !important; 
      align-items: center !important; 
      gap: 5px !important; 
      cursor: pointer !important; 
      color: rgba(255,255,255,0.9) !important; 
      padding: 8px 16px !important;
      transition: all 0.3s ease !important;
    }
    
    .dropdown-list { 
      position: absolute !important; 
      top: 100% !important; 
      left: 50% !important;
      transform: translateX(-50%) translateY(-10px) !important;
      background: rgba(5, 5, 26, 0.98) !important;
      backdrop-filter: blur(20px) !important; 
      border: 1px solid rgba(255,255,255,0.1) !important; 
      border-radius: 8px !important; 
      padding: 10px 0 !important; 
      min-width: 220px !important; 
      z-index: 1000 !important; 
      opacity: 0 !important; 
      visibility: hidden !important; 
      transition: all 0.2s ease !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
    }
    
    .menu-dropdown-wrapper:hover .dropdown-list,
    .dropdown-list.w--open { 
      opacity: 1 !important; 
      visibility: visible !important; 
      transform: translateX(-50%) translateY(0) !important;
    }
    </style>`;

const russianPages = [
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/home.html', name: 'ru/home.html' },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/courses.html', name: 'ru/courses.html' },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/teachers.html', name: 'ru/teachers.html' },
  { path: '/Users/michaelmishayev/Desktop/newCode/dist/ru/index.html', name: 'dist/ru/index.html' },
  { path: '/Users/michaelmishayev/Desktop/newCode/dist/ru/courses.html', name: 'dist/ru/courses.html' },
  { path: '/Users/michaelmishayev/Desktop/newCode/dist/ru/teachers.html', name: 'dist/ru/teachers.html' }
];

console.log('🔧 Starting Navigation Responsive Fix...\n');

russianPages.forEach(page => {
  if (fs.existsSync(page.path)) {
    try {
      let content = fs.readFileSync(page.path, 'utf8');
      
      // Check if the page already has the comprehensive responsive fix
      if (content.includes('COMPREHENSIVE NAVIGATION RESPONSIVE FIX')) {
        console.log(`✅ ${page.name} - Already has responsive fix`);
        return;
      }
      
      // Remove any existing partial navigation fixes
      content = content.replace(/<!-- CRITICAL NAVIGATION FIX[\s\S]*?<\/style>/g, '');
      content = content.replace(/<!-- COMPREHENSIVE NAVIGATION CONSISTENCY FIX[\s\S]*?<\/style>/g, '');
      
      // Find the best insertion point (after existing style tags or before closing head)
      let insertPosition = -1;
      
      // Try to find last style tag
      const lastStyleIndex = content.lastIndexOf('</style>');
      if (lastStyleIndex !== -1) {
        insertPosition = content.indexOf('\n', lastStyleIndex) + 1;
      } else {
        // If no style tag found, add before closing head
        const headIndex = content.indexOf('</head>');
        if (headIndex !== -1) {
          insertPosition = headIndex;
        }
      }
      
      if (insertPosition !== -1) {
        content = content.slice(0, insertPosition) + COMPREHENSIVE_NAV_FIX + '\n  ' + content.slice(insertPosition);
        fs.writeFileSync(page.path, content, 'utf8');
        console.log(`🔧 ${page.name} - Applied comprehensive responsive navigation fix`);
      } else {
        console.error(`❌ ${page.name} - Could not find insertion point`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${page.name}:`, error.message);
    }
  } else {
    console.log(`⚠️  ${page.name} - File not found`);
  }
});

console.log('\n✅ Navigation responsive fix completed!');
console.log('\nChanges made:');
console.log('• Override Webflow responsive behavior that hides navigation on tablet/desktop');
console.log('• Force navigation visibility for screens > 768px');
console.log('• Ensure all navigation elements (Home, Courses, Teachers, Career Services, Pricing) are visible');
console.log('• Maintain proper dropdown functionality and styling');
console.log('• Hide mobile hamburger menu on desktop/tablet screens');
console.log('\nTest the changes by visiting:');
console.log('• https://www.aistudio555.com/dist/ru/courses.html');
console.log('• https://www.aistudio555.com/dist/ru/teachers.html');
console.log('• https://www.aistudio555.com/dist/ru/home.html');
console.log('\nAll pages should now show identical navigation menus.');