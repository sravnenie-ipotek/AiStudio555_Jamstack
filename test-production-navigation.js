#!/usr/bin/env node

/**
 * Test Production Navigation Consistency
 * Verifies that the Career Services dropdown menu is consistent across all pages
 */

const https = require('https');

// Pages to test
const pagesToTest = [
  'https://www.aistudio555.com/home.html',
  'https://www.aistudio555.com/courses.html',
  'https://www.aistudio555.com/teachers.html',
  'https://www.aistudio555.com/pricing.html',
  'https://www.aistudio555.com/career-center.html',
  'https://www.aistudio555.com/career-orientation.html',
  'https://www.aistudio555.com/dist/en/index.html',
  'https://www.aistudio555.com/dist/en/courses.html',
  'https://www.aistudio555.com/dist/en/teachers.html',
  'https://www.aistudio555.com/dist/en/career-center.html',
  'https://www.aistudio555.com/dist/en/career-orientation.html',
  'https://www.aistudio555.com/dist/ru/index.html',
  'https://www.aistudio555.com/dist/ru/courses.html',
  'https://www.aistudio555.com/dist/he/index.html',
  'https://www.aistudio555.com/dist/he/courses.html'
];

// Function to check a single page
function checkPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const results = {
          url: url,
          statusCode: res.statusCode,
          hasCareerDropdown: false,
          hasDarkThemeCSS: false,
          hasDropdownFix: false,
          hasCareerOrientation: false,
          hasCareerCenter: false
        };
        
        // Check for Career Services dropdown
        if (data.includes('Career Services') || data.includes('dropdown-toggle-text-block')) {
          results.hasCareerDropdown = true;
        }
        
        // Check for dark theme CSS
        if (data.includes('background: rgba(5, 5, 26, 0.98)') || 
            data.includes('universal-career-dropdown-fix')) {
          results.hasDarkThemeCSS = true;
        }
        
        // Check for dropdown fix script
        if (data.includes('career-dropdown-fix-js') || 
            data.includes('fixCareerDropdown')) {
          results.hasDropdownFix = true;
        }
        
        // Check for Career Orientation link
        if (data.includes('career-orientation.html')) {
          results.hasCareerOrientation = true;
        }
        
        // Check for Career Center link
        if (data.includes('career-center.html')) {
          results.hasCareerCenter = true;
        }
        
        resolve(results);
      });
    }).on('error', (err) => {
      resolve({
        url: url,
        error: err.message,
        statusCode: 0
      });
    });
  });
}

// Main test function
async function runTests() {
  console.log('========================================');
  console.log('Testing Career Services Dropdown Consistency');
  console.log('========================================\n');
  
  console.log('Waiting 30 seconds for deployment to propagate...\n');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  const results = [];
  
  for (const url of pagesToTest) {
    console.log(`Testing: ${url}`);
    const result = await checkPage(url);
    results.push(result);
    
    // Display immediate results
    if (result.error) {
      console.log(`  ❌ Error: ${result.error}`);
    } else if (result.statusCode === 200) {
      console.log(`  ✅ Page loads (${result.statusCode})`);
      console.log(`  ${result.hasCareerDropdown ? '✅' : '❌'} Career Services dropdown present`);
      console.log(`  ${result.hasDarkThemeCSS ? '✅' : '❌'} Dark theme CSS applied`);
      console.log(`  ${result.hasDropdownFix ? '✅' : '❌'} Dropdown fix JavaScript present`);
      console.log(`  ${result.hasCareerOrientation && result.hasCareerCenter ? '✅' : '❌'} Both menu items present`);
    } else {
      console.log(`  ⚠️ Unexpected status code: ${result.statusCode}`);
    }
    console.log('');
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n========================================');
  console.log('SUMMARY');
  console.log('========================================\n');
  
  const successful = results.filter(r => r.statusCode === 200);
  const withDropdown = results.filter(r => r.hasCareerDropdown);
  const withDarkTheme = results.filter(r => r.hasDarkThemeCSS);
  const withFix = results.filter(r => r.hasDropdownFix);
  const fullyConsistent = results.filter(r => 
    r.hasCareerDropdown && 
    r.hasDarkThemeCSS && 
    r.hasDropdownFix &&
    r.hasCareerOrientation &&
    r.hasCareerCenter
  );
  
  console.log(`Pages tested: ${results.length}`);
  console.log(`Pages loaded successfully: ${successful.length}`);
  console.log(`Pages with Career dropdown: ${withDropdown.length}`);
  console.log(`Pages with dark theme CSS: ${withDarkTheme.length}`);
  console.log(`Pages with dropdown fix JS: ${withFix.length}`);
  console.log(`Pages fully consistent: ${fullyConsistent.length}`);
  
  if (fullyConsistent.length === results.length) {
    console.log('\n✅ SUCCESS: All pages have consistent Career Services dropdown!');
  } else {
    console.log('\n⚠️ WARNING: Some pages may not have the updated dropdown styling.');
    console.log('This could be due to caching. Try clearing cache or waiting a few minutes.');
    
    // List problematic pages
    const problematic = results.filter(r => 
      !r.hasCareerDropdown || 
      !r.hasDarkThemeCSS || 
      !r.hasDropdownFix
    );
    
    if (problematic.length > 0) {
      console.log('\nProblematic pages:');
      problematic.forEach(p => {
        console.log(`  - ${p.url}`);
      });
    }
  }
  
  console.log('\n========================================');
  console.log('Test completed!');
  console.log('========================================\n');
}

// Run the tests
runTests().catch(console.error);