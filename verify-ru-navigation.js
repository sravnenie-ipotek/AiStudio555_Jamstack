#!/usr/bin/env node

/**
 * Russian Navigation Verification Script
 * 
 * Verifies that all Russian language pages have consistent navigation
 * and proper fixes applied for the responsive visibility issues.
 */

const fs = require('fs');
const path = require('path');

const pagesToCheck = [
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/home.html', name: 'ru/home.html' },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/courses.html', name: 'ru/courses.html' },
  { path: '/Users/michaelmishayev/Desktop/newCode/ru/teachers.html', name: 'ru/teachers.html' },
  { path: '/Users/michaelmishayev/Desktop/newCode/dist/ru/index.html', name: 'dist/ru/index.html' },
  { path: '/Users/michaelmishayev/Desktop/newCode/dist/ru/courses.html', name: 'dist/ru/courses.html' },
  { path: '/Users/michaelmishayev/Desktop/newCode/dist/ru/teachers.html', name: 'dist/ru/teachers.html' }
];

const requiredElements = [
  'Home',
  'Courses', 
  'Teachers',
  'Career Services',
  'Pricing'
];

console.log('🔍 Verifying Russian Navigation Consistency...\n');

pagesToCheck.forEach(page => {
  if (!fs.existsSync(page.path)) {
    console.log(`❌ ${page.name} - File not found`);
    return;
  }

  try {
    const content = fs.readFileSync(page.path, 'utf8');
    const results = {
      hasNavigation: false,
      hasUnifiedCSS: false,
      hasResponsiveFix: false,
      missingElements: [],
      hasCareerDropdown: false
    };

    // Check for navigation structure
    if (content.includes('role="navigation"') && content.includes('nav-menu w-nav-menu')) {
      results.hasNavigation = true;
    }

    // Check for unified navigation CSS
    if (content.includes('unified-navigation.css')) {
      results.hasUnifiedCSS = true;
    }

    // Check for responsive navigation fix
    if (content.includes('COMPREHENSIVE NAVIGATION RESPONSIVE FIX') || content.includes('CRITICAL NAVIGATION FIX')) {
      results.hasResponsiveFix = true;
    }

    // Check for each required navigation element
    requiredElements.forEach(element => {
      if (!content.includes(element)) {
        results.missingElements.push(element);
      }
    });

    // Check for Career Services dropdown structure
    if (content.includes('menu-dropdown-wrapper') && 
        content.includes('Career Services') && 
        content.includes('Career Orientation') && 
        content.includes('Career Center')) {
      results.hasCareerDropdown = true;
    }

    // Display results
    console.log(`📄 ${page.name}`);
    console.log(`   Navigation Structure: ${results.hasNavigation ? '✅' : '❌'}`);
    console.log(`   Unified CSS Included: ${results.hasUnifiedCSS ? '✅' : '❌'}`);
    console.log(`   Responsive Fix Applied: ${results.hasResponsiveFix ? '✅' : '❌'}`);
    console.log(`   Career Dropdown Present: ${results.hasCareerDropdown ? '✅' : '❌'}`);
    
    if (results.missingElements.length > 0) {
      console.log(`   Missing Elements: ❌ ${results.missingElements.join(', ')}`);
    } else {
      console.log(`   All Nav Elements Present: ✅`);
    }

    // Overall status
    const isComplete = results.hasNavigation && 
                      results.hasUnifiedCSS && 
                      results.hasResponsiveFix && 
                      results.hasCareerDropdown && 
                      results.missingElements.length === 0;
    
    console.log(`   Overall Status: ${isComplete ? '✅ COMPLETE' : '⚠️  NEEDS ATTENTION'}`);
    console.log('');

  } catch (error) {
    console.error(`❌ Error checking ${page.name}:`, error.message);
  }
});

console.log('📊 Verification Complete!');
console.log('\nLive Site Testing URLs:');
console.log('🌐 https://www.aistudio555.com/dist/ru/index.html');
console.log('🌐 https://www.aistudio555.com/dist/ru/courses.html');
console.log('🌐 https://www.aistudio555.com/dist/ru/teachers.html');
console.log('\nAll pages should now display consistent navigation with:');
console.log('• Home, Courses, Teachers, Career Services (dropdown), Pricing links');
console.log('• Dark theme dropdown styling');
console.log('• Proper hover functionality');
console.log('• No elements hidden on desktop/tablet screens');