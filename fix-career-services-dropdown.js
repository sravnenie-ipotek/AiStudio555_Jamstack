#!/usr/bin/env node

/**
 * Fix Career Services Dropdown Consistency
 * Ensures the Career Services dropdown menu has consistent dark theme styling across all pages
 */

const fs = require('fs');
const path = require('path');

// Universal dropdown CSS that should be applied to ALL pages
const UNIVERSAL_DROPDOWN_CSS = `
  <style id="universal-career-dropdown-fix">
    /* UNIVERSAL CAREER SERVICES DROPDOWN FIX - Applied to ALL pages */
    
    /* Reset any conflicting styles */
    .menu-dropdown-wrapper,
    .menu-dropdown-wrapper.w-dropdown {
      position: relative !important;
      display: inline-block !important;
      z-index: 999 !important;
    }
    
    /* Dropdown Toggle Styling */
    .dropdown-toggle,
    .dropdown-toggle.w-dropdown-toggle {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      padding: 8px 0 !important;
      color: rgba(255, 255, 255, 0.9) !important;
      background: transparent !important;
      border: none !important;
      cursor: pointer !important;
      transition: color 0.2s ease !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      text-decoration: none !important;
    }
    
    .dropdown-toggle:hover,
    .dropdown-toggle.w-dropdown-toggle:hover {
      color: #ffd659 !important;
      background: transparent !important;
    }
    
    .dropdown-toggle-text-block {
      color: inherit !important;
      font-size: inherit !important;
    }
    
    .dropdown-toggle-arrow-2 {
      color: inherit !important;
      font-size: 10px !important;
      transition: transform 0.2s ease !important;
    }
    
    .menu-dropdown-wrapper:hover .dropdown-toggle-arrow-2 {
      transform: rotate(180deg) !important;
    }
    
    /* Dropdown List - DARK THEME ENFORCED */
    .dropdown-list,
    .dropdown-list.w-dropdown-list {
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      min-width: 200px !important;
      background: rgba(5, 5, 26, 0.98) !important; /* Dark background */
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 12px !important;
      padding: 8px 0 !important;
      margin-top: 5px !important;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transform: translateY(-10px) !important;
      transition: all 0.3s ease !important;
      z-index: 1000 !important;
      overflow: hidden !important;
    }
    
    /* Show dropdown on hover */
    .menu-dropdown-wrapper:hover .dropdown-list,
    .menu-dropdown-wrapper:hover .dropdown-list.w-dropdown-list,
    .dropdown-list.w--open {
      opacity: 1 !important;
      visibility: visible !important;
      transform: translateY(0) !important;
    }
    
    /* Dropdown Menu Items */
    .dropdown-menu-text-link-block,
    .dropdown-menu-text-link-block.w-inline-block {
      display: block !important;
      padding: 12px 20px !important;
      color: rgba(255, 255, 255, 0.9) !important;
      background: transparent !important;
      text-decoration: none !important;
      transition: all 0.2s ease !important;
      font-size: 14px !important;
      border: none !important;
      position: relative !important;
      overflow: hidden !important;
    }
    
    /* Hover effect for dropdown items */
    .dropdown-menu-text-link-block:hover,
    .dropdown-menu-text-link-block.w-inline-block:hover {
      background: rgba(102, 126, 234, 0.1) !important;
      color: #00c6ff !important;
      padding-left: 25px !important;
    }
    
    /* Add subtle gradient on hover */
    .dropdown-menu-text-link-block::before {
      content: '' !important;
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 3px !important;
      height: 100% !important;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%) !important;
      opacity: 0 !important;
      transition: opacity 0.2s ease !important;
    }
    
    .dropdown-menu-text-link-block:hover::before {
      opacity: 1 !important;
    }
    
    /* Text inside dropdown items */
    .dropdown-menu-text-link-block div {
      color: inherit !important;
      font-size: inherit !important;
      background: none !important;
      border: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    
    /* Remove any active/current states in dropdown */
    .dropdown-list a.w--current,
    .dropdown-menu-text-link-block.w--current {
      background: transparent !important;
      color: rgba(255, 255, 255, 0.9) !important;
    }
    
    .dropdown-list a.w--current:hover,
    .dropdown-menu-text-link-block.w--current:hover {
      background: rgba(102, 126, 234, 0.1) !important;
      color: #00c6ff !important;
    }
    
    /* Mobile responsive adjustments */
    @media (max-width: 991px) {
      .dropdown-list,
      .dropdown-list.w-dropdown-list {
        position: static !important;
        width: 100% !important;
        margin-top: 0 !important;
        border-radius: 0 !important;
        background: rgba(5, 5, 26, 1) !important;
      }
      
      .dropdown-menu-text-link-block {
        padding: 15px 20px !important;
      }
    }
    
    /* Ensure dropdown is above other elements */
    .navbar,
    .w-nav {
      z-index: 990 !important;
    }
    
    /* Additional safeguards */
    .dropdown-list * {
      box-sizing: border-box !important;
    }
    
    /* Remove any page-specific overrides */
    .career-orientation-page .dropdown-list,
    .career-center-page .dropdown-list,
    .courses-page .dropdown-list,
    .home-page .dropdown-list {
      background: rgba(5, 5, 26, 0.98) !important;
    }
  </style>
`;

// JavaScript to ensure dropdown works properly
const DROPDOWN_FIX_JS = `
  <script id="career-dropdown-fix-js">
    // Career Services Dropdown Consistency Fix
    (function() {
      'use strict';
      
      function fixCareerDropdown() {
        // Remove w--current class from dropdown items
        const dropdownLinks = document.querySelectorAll('.dropdown-list a, .dropdown-menu-text-link-block');
        dropdownLinks.forEach(link => {
          // Only remove w--current from dropdown items, not main nav
          if (link.closest('.dropdown-list')) {
            link.classList.remove('w--current');
          }
        });
        
        // Ensure dropdown functionality
        const dropdowns = document.querySelectorAll('.menu-dropdown-wrapper');
        dropdowns.forEach(dropdown => {
          const toggle = dropdown.querySelector('.dropdown-toggle');
          const list = dropdown.querySelector('.dropdown-list');
          
          if (toggle && list) {
            // Remove any inline styles that might interfere
            list.style.removeProperty('background-color');
            list.style.removeProperty('background');
            
            // Ensure hover works
            dropdown.addEventListener('mouseenter', function() {
              list.classList.add('w--open');
            });
            
            dropdown.addEventListener('mouseleave', function() {
              list.classList.remove('w--open');
            });
            
            // Mobile click support
            toggle.addEventListener('click', function(e) {
              if (window.innerWidth <= 991) {
                e.preventDefault();
                list.classList.toggle('w--open');
              }
            });
          }
        });
      }
      
      // Run on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixCareerDropdown);
      } else {
        fixCareerDropdown();
      }
      
      // Run again after a short delay to catch any dynamic changes
      setTimeout(fixCareerDropdown, 100);
      setTimeout(fixCareerDropdown, 500);
    })();
  </script>
`;

// Files to update
const filesToUpdate = [
  // Root directory files
  'home.html',
  'index.html',
  'courses.html',
  'teachers.html',
  'pricing.html',
  'career-center.html',
  'career-orientation.html',
  'about-us.html',
  'blog.html',
  'contact-us.html',
  'detail_courses.html',
  'detail_blog.html',
  
  // Language directories
  'en/home.html',
  'en/index.html',
  'en/courses.html',
  'en/teachers.html',
  'en/pricing.html',
  'en/career-center.html',
  'en/career-orientation.html',
  'en/blog.html',
  
  'ru/home.html',
  'ru/index.html',
  'ru/courses.html',
  'ru/teachers.html',
  'ru/pricing.html',
  'ru/career-center.html',
  'ru/career-orientation.html',
  'ru/blog.html',
  
  'he/home.html',
  'he/index.html',
  'he/courses.html',
  'he/teachers.html',
  'he/pricing.html',
  'he/career-center.html',
  'he/career-orientation.html',
  'he/blog.html',
  
  // Dist directories
  'dist/en/home.html',
  'dist/en/index.html',
  'dist/en/courses.html',
  'dist/en/teachers.html',
  'dist/en/career-center.html',
  'dist/en/career-orientation.html',
  'dist/en/about.html',
  
  'dist/ru/home.html',
  'dist/ru/index.html',
  'dist/ru/courses.html',
  'dist/ru/teachers.html',
  'dist/ru/career-center.html',
  'dist/ru/career-orientation.html',
  'dist/ru/about.html',
  
  'dist/he/home.html',
  'dist/he/index.html',
  'dist/he/courses.html',
  'dist/he/teachers.html',
  'dist/he/career-center.html',
  'dist/he/career-orientation.html',
  'dist/he/about.html'
];

let updatedCount = 0;
let errorCount = 0;

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove any existing career dropdown fix styles
      content = content.replace(/<style id="universal-career-dropdown-fix">[\s\S]*?<\/style>/g, '');
      content = content.replace(/<script id="career-dropdown-fix-js">[\s\S]*?<\/script>/g, '');
      
      // Add the universal CSS before </head>
      if (!content.includes('id="universal-career-dropdown-fix"')) {
        content = content.replace('</head>', UNIVERSAL_DROPDOWN_CSS + '\n</head>');
      }
      
      // Add the JavaScript before </body>
      if (!content.includes('id="career-dropdown-fix-js"')) {
        content = content.replace('</body>', DROPDOWN_FIX_JS + '\n</body>');
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${file}`);
      updatedCount++;
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
    errorCount++;
  }
});

console.log('\n========================================');
console.log(`✅ Successfully updated: ${updatedCount} files`);
if (errorCount > 0) {
  console.log(`❌ Errors encountered: ${errorCount} files`);
}
console.log('========================================\n');
console.log('Career Services dropdown consistency fix applied!');
console.log('The dropdown will now have a consistent dark theme across all pages.');