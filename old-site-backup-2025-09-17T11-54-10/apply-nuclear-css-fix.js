const fs = require('fs');
const path = require('path');

// Nuclear CSS fix content
const NUCLEAR_CSS_FIX = `
    /* ==========================================================================
       NUCLEAR DROPDOWN FIX - ULTRA HIGH SPECIFICITY OVERRIDES
       ========================================================================== */

    /* Target ALL possible page identifier combinations with ultra-high specificity */
    html[data-wf-page] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    html[data-wf-page="career-center-page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    html[data-wf-page="career-orientation-page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    html[data-wf-page="68b7601f918996218465c555"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    html[data-wf-page="home-page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    html[data-wf-page="courses-page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    html[data-wf-page="teachers-page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    html[data-wf-page="pricing-page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    html[data-wf-page*="page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    html[data-wf-page*="68b"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    body[class*="w-"] .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current,
    body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current {
      background-color: transparent !important;
      color: rgba(255,255,255,0.9) !important;
      border-color: transparent !important;
      box-shadow: none !important;
      text-decoration: none !important;
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
    }

    /* Nuclear override for pseudo-elements */
    html[data-wf-page] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current::before,
    html[data-wf-page] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current::after,
    html[data-wf-page*="page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current::before,
    html[data-wf-page*="page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current::after,
    body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current::before,
    body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle.w--current::after {
      display: none !important;
      content: none !important;
      background: none !important;
      border: none !important;
      box-shadow: none !important;
    }

    /* Maximum specificity dropdown toggle styling - OVERRIDE ALL WEBFLOW PAGE RULES */
    html[data-wf-page] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle,
    html[data-wf-page*="page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle,
    html[data-wf-page*="68b"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle,
    body[class*="w-"] .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle,
    body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle {
      background-color: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      color: rgba(255,255,255,0.9) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      font-family: "Plus Jakarta Sans", sans-serif !important;
      font-size: 16px !important;
      font-weight: 500 !important;
      line-height: normal !important;
      padding: 8px 0 !important;
      text-align: left !important;
      text-decoration: none !important;
      transition: color 0.2s ease !important;
      white-space: nowrap !important;
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
      box-shadow: none !important;
      outline: none !important;
      position: relative !important;
      gap: 8px !important;
    }

    /* Maximum specificity hover styling - OVERRIDE ALL WEBFLOW PAGE RULES */
    html[data-wf-page] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle:hover,
    html[data-wf-page*="page"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle:hover,
    html[data-wf-page*="68b"] body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle:hover,
    body[class*="w-"] .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle:hover,
    body .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle:hover {
      background-color: transparent !important;
      border-color: transparent !important;
      color: #ffd659 !important;
      transform: none !important;
      opacity: 1 !important;
      filter: none !important;
      box-shadow: none !important;
      text-decoration: none !important;
    }

    /* Reset all possible Webflow current state classes - NUCLEAR OVERRIDE */
    html[data-wf-page] body .w--current,
    html[data-wf-page*="page"] body .w--current,
    html[data-wf-page*="68b"] body .w--current,
    body[class*="w-"] .w--current,
    body .w--current {
      background: inherit !important;
      color: inherit !important;
      border-color: inherit !important;
      box-shadow: inherit !important;
      text-decoration: inherit !important;
      opacity: inherit !important;
      transform: inherit !important;
      filter: inherit !important;
    }

    /* FINAL NUCLEAR OPTION - RESET EVERYTHING AND START FRESH */
    .navbar .nav-menu .menu-dropdown-wrapper {
      all: revert !important;
      position: relative !important;
      display: inline-block !important;
    }

    .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle {
      all: revert !important;
      background-color: transparent !important;
      border: none !important;
      color: rgba(255,255,255,0.9) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-family: "Plus Jakarta Sans", sans-serif !important;
      font-size: 16px !important;
      font-weight: 500 !important;
      padding: 8px 0 !important;
      text-decoration: none !important;
      transition: color 0.2s ease !important;
    }

    .navbar .nav-menu .menu-dropdown-wrapper .dropdown-toggle:hover {
      color: #ffd659 !important;
    }`;

// Marker to check if nuclear CSS is already applied
const NUCLEAR_CSS_MARKER = 'NUCLEAR DROPDOWN FIX - ULTRA HIGH SPECIFICITY OVERRIDES';

async function applyNuclearCSSToAllPages() {
  console.log('🚀 APPLYING NUCLEAR CSS FIX TO ALL PAGES');
  console.log('=========================================');
  
  const distDir = path.join(__dirname, 'dist', 'en');
  
  // Check if dist/en directory exists
  if (!fs.existsSync(distDir)) {
    console.log('❌ ERROR: dist/en directory not found!');
    return false;
  }
  
  // Get all HTML files
  const files = fs.readdirSync(distDir)
    .filter(file => file.endsWith('.html'))
    .filter(file => !file.startsWith('test-')); // Skip test files
  
  console.log(`📁 Found ${files.length} HTML files to process:\\n`);
  
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const filePath = path.join(distDir, file);
    console.log(`📄 Processing: ${file}`);
    
    try {
      // Read the file
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if nuclear CSS is already applied
      if (content.includes(NUCLEAR_CSS_MARKER)) {
        console.log(`   ⏭️  SKIPPED - Nuclear CSS already applied`);
        skippedCount++;
        continue;
      }
      
      let updatedContent = content;
      
      // Strategy 1: Find existing </style> tag and inject before it  
      const styleTagMatches = content.match(/<\/style>/g);
      let lastStyleTagIndex = -1;
      
      if (styleTagMatches) {
        lastStyleTagIndex = content.lastIndexOf('</style>');
      }
      
      if (lastStyleTagIndex !== -1) {
        const insertIndex = lastStyleTagIndex;
        updatedContent = content.slice(0, insertIndex) + 
                        NUCLEAR_CSS_FIX + 
                        content.slice(insertIndex);
        console.log(`   ✅ Added nuclear CSS before existing </style> tag`);
      }
      // Strategy 2: No </style> found, add complete <style> section before </head>
      else if (content.includes('</head>')) {
        const headEndIndex = content.indexOf('</head>');
        if (headEndIndex !== -1) {
          const newStyleSection = `\n  <style>${NUCLEAR_CSS_FIX}\n  </style>\n`;
          updatedContent = content.slice(0, headEndIndex) + 
                          newStyleSection + 
                          content.slice(headEndIndex);
          console.log(`   ✅ Added new <style> section before </head>`);
        }
      }
      // Strategy 3: No </head> found either, add after <head>
      else if (content.includes('<head>')) {
        const headStartIndex = content.indexOf('<head>');
        if (headStartIndex !== -1) {
          const insertIndex = headStartIndex + '<head>'.length;
          const newStyleSection = `\n  <style>${NUCLEAR_CSS_FIX}\n  </style>\n`;
          updatedContent = content.slice(0, insertIndex) + 
                          newStyleSection + 
                          content.slice(insertIndex);
          console.log(`   ✅ Added new <style> section after <head>`);
        }
      }
      else {
        console.log(`   ⚠️  WARNING - No suitable injection point found`);
        continue;
      }
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`   💾 File updated successfully`);
      processedCount++;
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      errorCount++;
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📊 NUCLEAR CSS APPLICATION SUMMARY:');
  console.log('═'.repeat(40));
  console.log(`✅ Successfully processed: ${processedCount} files`);
  console.log(`⏭️  Already had fix: ${skippedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`📁 Total files: ${files.length}`);
  
  if (processedCount > 0) {
    console.log('\\n🎉 NUCLEAR CSS FIX APPLIED TO ALL PAGES!');
    console.log('✅ Career Services dropdown will now be consistent across the entire website');
  }
  
  return errorCount === 0;
}

// Run the application
applyNuclearCSSToAllPages().then(success => {
  process.exit(success ? 0 : 1);
}).catch(console.error);