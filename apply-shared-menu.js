const fs = require('fs');
const path = require('path');

// All pages that need the shared menu
const pages = [
    // English
    'en/home.html',
    'en/courses.html',
    'en/teachers.html',
    'en/career-center.html',
    'en/career-orientation.html',
    'en/pricing.html',
    'en/blog.html',
    'en/detail_courses.html',
    // Russian
    'ru/home.html',
    'ru/courses.html',
    'ru/teachers.html',
    'ru/career-center.html',
    'ru/career-orientation.html',
    'ru/pricing.html',
    'ru/blog.html',
    'ru/detail_courses.html',
    // Hebrew
    'he/home.html',
    'he/courses.html',
    'he/teachers.html',
    'he/career-center.html',
    'he/career-orientation.html',
    'he/pricing.html',
    'he/blog.html',
    'he/detail_courses.html'
];

function convertToSharedMenu(filePath) {
    const fullPath = path.join('/Users/michaelmishayev/Desktop/newCode', filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${filePath} - file not found`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if already using shared menu
    if (content.includes('shared-menu-container')) {
        console.log(`ℹ️  ${filePath} - already using shared menu`);
        return;
    }

    // Remove existing navbar (everything from <div class="navbar w-nav" to its closing </div>)
    // This regex captures the entire navbar structure
    const navbarRegex = /<div[^>]*class="[^"]*navbar w-nav[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;

    // Replace with ultra-thin placeholder
    const placeholder = '<div id="shared-menu-container"></div>';

    content = content.replace(navbarRegex, placeholder);

    // Remove old menu fix scripts if present
    content = content.replace(/<script src="[^"]*universal-menu-fix\.js"[^>]*><\/script>\s*/g, '');
    content = content.replace(/<script src="[^"]*immediate-menu-fix\.js"[^>]*><\/script>\s*/g, '');

    // Add shared menu component script before closing body
    const sharedMenuScript = '  <script src="../js/shared-menu-component.js"></script>\n';

    // Check if script already exists
    if (!content.includes('shared-menu-component.js')) {
        const bodyCloseIndex = content.lastIndexOf('</body>');
        if (bodyCloseIndex !== -1) {
            content = content.slice(0, bodyCloseIndex) + sharedMenuScript + content.slice(bodyCloseIndex);
        }
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ ${filePath} - converted to shared menu`);
}

console.log('🚀 Converting to Ultra-thin Shared Menu Component');
console.log('==================================================\n');

console.log('This will replace the entire navbar HTML with:');
console.log('  <div id="shared-menu-container"></div>');
console.log('  <script src="../js/shared-menu-component.js"></script>\n');

console.log('Processing pages:');
console.log('-----------------');

pages.forEach(page => {
    convertToSharedMenu(page);
});

console.log('\n==================================================');
console.log('✅ Conversion complete!');
console.log('\nBenefits:');
console.log('  • Single source of truth for menu');
console.log('  • Ultra-thin HTML pages');
console.log('  • Easy menu updates (edit one file)');
console.log('  • Consistent behavior across all pages');