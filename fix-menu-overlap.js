const fs = require('fs');
const path = require('path');

// Pages to process
const coursesPages = [
    'en/courses.html',
    'ru/courses.html',
    'he/courses.html'
];

const homePages = [
    'en/home.html',
    'ru/home.html'
];

function removeCartFromCourses(filePath) {
    const fullPath = path.join('/Users/michaelmishayev/Desktop/newCode', filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${filePath} - file not found`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Remove the entire cart wrapper section
    const cartPattern = /<div[^>]*class="[^"]*w-commerce-commercecartwrapper[^"]*navbar-cart[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g;

    const originalLength = content.length;
    content = content.replace(cartPattern, '');

    if (content.length < originalLength) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ ${filePath} - cart icon removed`);
    } else {
        console.log(`ℹ️  ${filePath} - no cart icon found`);
    }
}

function addPrimaryButtonToHome(filePath, lang) {
    const fullPath = path.join('/Users/michaelmishayev/Desktop/newCode', filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${filePath} - file not found`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if primary button already exists
    if (content.includes('primary-button-wrapper desktop')) {
        console.log(`ℹ️  ${filePath} - primary button already exists`);
        return;
    }

    // Determine button text based on language
    const buttonText = lang === 'ru' ? 'Зарегистрироваться' : 'Sign Up Today';

    // Find navbar-button-wrapper and add primary button
    const navbarButtonPattern = /<div class="navbar-button-wrapper">/;

    const primaryButtonHTML = `<div class="navbar-button-wrapper">
            <div class="primary-button-wrapper desktop">
              <a href="#" data-w-id="102c5b61-ca91-3c28-1e26-0f7381b431b7" class="primary-button w-inline-block">
                <div class="primary-button-text-wrap">
                  <div class="primary-button-text-block">${buttonText}</div>`;

    if (navbarButtonPattern.test(content)) {
        content = content.replace(navbarButtonPattern, primaryButtonHTML);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ ${filePath} - primary button added`);
    } else {
        console.log(`⚠️  ${filePath} - navbar-button-wrapper not found`);
    }
}

console.log('🔧 Fixing Menu Overlap Issues');
console.log('==============================\n');

console.log('1️⃣ Removing cart icons from courses pages:');
console.log('-------------------------------------------');
coursesPages.forEach(page => {
    removeCartFromCourses(page);
});

console.log('\n2️⃣ Adding primary buttons to home pages:');
console.log('----------------------------------------');
homePages.forEach(page => {
    const lang = page.split('/')[0];
    addPrimaryButtonToHome(page, lang);
});

console.log('\n==============================');
console.log('✅ Menu overlap fixes complete!');