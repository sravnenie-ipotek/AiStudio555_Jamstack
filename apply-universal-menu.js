const fs = require('fs');
const path = require('path');

// List of all pages that need the menu fix
const pages = [
    // English pages
    'en/home.html',
    'en/courses.html',
    'en/teachers.html',
    'en/career-center.html',
    'en/career-orientation.html',
    'en/pricing.html',
    'en/blog.html',
    'en/detail_courses.html',
    // Russian pages
    'ru/home.html',
    'ru/courses.html',
    'ru/teachers.html',
    'ru/career-center.html',
    'ru/career-orientation.html',
    'ru/pricing.html',
    'ru/blog.html',
    'ru/detail_courses.html',
    // Hebrew pages
    'he/home.html',
    'he/courses.html',
    'he/teachers.html',
    'he/career-center.html',
    'he/career-orientation.html',
    'he/pricing.html',
    'he/blog.html',
    'he/detail_courses.html'
];

function applyMenuFix(filePath) {
    const fullPath = path.join('/Users/michaelmishayev/Desktop/newCode', filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${filePath} - file not found`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if universal menu fix is already added
    if (content.includes('universal-menu-fix.js')) {
        console.log(`✓ ${filePath} - already has universal menu fix`);
        return;
    }

    // Remove old menu fixes if they exist
    content = content.replace(/<link rel="stylesheet" href="[^"]*desktop-menu-force-visible\.css"[^>]*>\s*/g, '');
    content = content.replace(/<script src="[^"]*immediate-menu-fix\.js"[^>]*><\/script>\s*/g, '');
    content = content.replace(/<link rel="stylesheet" href="[^"]*desktop-language-selector-fix\.css"[^>]*>\s*/g, '');
    content = content.replace(/<link rel="stylesheet" href="[^"]*mobile-menu-proper-fix\.css"[^>]*>\s*/g, '');
    content = content.replace(/<link rel="stylesheet" href="[^"]*mobile-responsive-fix\.css"[^>]*>\s*/g, '');
    content = content.replace(/<link rel="stylesheet" href="[^"]*language-selector-mobile-fix\.css"[^>]*>\s*/g, '');

    // Remove any inline language switcher scripts
    const languageSwitcherRegex = /<script>\s*\(function\(\)\s*{\s*\/\/\s*Inline Language Switcher[\s\S]*?<\/script>\s*/g;
    content = content.replace(languageSwitcherRegex, '');

    // Remove any inline style tags for language switcher
    const inlineStyleRegex = /<style>\s*\/\*\s*Inline language switcher styles[\s\S]*?<\/style>\s*/g;
    content = content.replace(inlineStyleRegex, '');

    // Add the universal menu fix script before closing body tag
    const scriptTag = '  <script src="../js/universal-menu-fix.js"></script>\n';

    // Find the position to insert (before </body>)
    const bodyCloseIndex = content.lastIndexOf('</body>');
    if (bodyCloseIndex !== -1) {
        content = content.slice(0, bodyCloseIndex) + scriptTag + content.slice(bodyCloseIndex);

        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ ${filePath} - universal menu fix applied`);
    } else {
        console.log(`❌ ${filePath} - could not find </body> tag`);
    }
}

console.log('🔧 Applying Universal Menu Fix to All Pages');
console.log('============================================\n');

pages.forEach(page => {
    applyMenuFix(page);
});

console.log('\n============================================');
console.log('✅ Universal menu fix application complete!');