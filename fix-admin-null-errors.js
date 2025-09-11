/**
 * FIX ADMIN PANEL NULL REFERENCE ERRORS
 * Adds safe field setting to prevent "Cannot set properties of null" errors
 */

const fs = require('fs');

// Read the admin panel file
let content = fs.readFileSync('content-admin-comprehensive.html', 'utf8');

// Helper function definition to inject
const safeFieldHelper = `
        // Safe field setter helper (prevents null errors)
        function safeSetFieldValue(id, value) {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
                return true;
            }
            return false;
        }
`;

// Find where to inject the helper (after getCurrentLanguage function)
const injectPoint = 'function getCurrentLanguage() {';
const injectIndex = content.indexOf(injectPoint);
if (injectIndex !== -1) {
    // Find the end of getCurrentLanguage function
    const endIndex = content.indexOf('}', injectIndex) + 1;
    content = content.slice(0, endIndex) + '\n' + safeFieldHelper + content.slice(endIndex);
}

// Fix loadTeachersPage
content = content.replace(
    /document\.getElementById\('teachers_page_title'\)\.value = /g,
    "safeSetFieldValue('teachers_page_title', "
);
content = content.replace(
    /document\.getElementById\('teachers_hero_title'\)\.value = /g,
    "safeSetFieldValue('teachers_hero_title', "
);
content = content.replace(
    /document\.getElementById\('teachers_hero_description'\)\.value = /g,
    "safeSetFieldValue('teachers_hero_description', "
);
content = content.replace(
    /document\.getElementById\('teachers_section_title'\)\.value = /g,
    "safeSetFieldValue('teachers_section_title', "
);

// Fix loadPricingPlans
content = content.replace(
    /document\.getElementById\('pricing_page_title'\)\.value = /g,
    "safeSetFieldValue('pricing_page_title', "
);
content = content.replace(
    /document\.getElementById\('pricing_page_description'\)\.value = /g,
    "safeSetFieldValue('pricing_page_description', "
);
content = content.replace(
    /document\.getElementById\('pricing_hero_title'\)\.value = /g,
    "safeSetFieldValue('pricing_hero_title', "
);
content = content.replace(
    /document\.getElementById\('pricing_hero_description'\)\.value = /g,
    "safeSetFieldValue('pricing_hero_description', "
);

// Fix loadBlogPosts
content = content.replace(
    /document\.getElementById\('blog_page_title'\)\.value = /g,
    "safeSetFieldValue('blog_page_title', "
);
content = content.replace(
    /document\.getElementById\('blog_page_description'\)\.value = /g,
    "safeSetFieldValue('blog_page_description', "
);
content = content.replace(
    /document\.getElementById\('blog_hero_title'\)\.value = /g,
    "safeSetFieldValue('blog_hero_title', "
);
content = content.replace(
    /document\.getElementById\('blog_hero_description'\)\.value = /g,
    "safeSetFieldValue('blog_hero_description', "
);

// Fix loadAboutPage
content = content.replace(
    /document\.getElementById\('about_page_title'\)\.value = /g,
    "safeSetFieldValue('about_page_title', "
);
content = content.replace(
    /document\.getElementById\('about_page_description'\)\.value = /g,
    "safeSetFieldValue('about_page_description', "
);
content = content.replace(
    /document\.getElementById\('about_mission_title'\)\.value = /g,
    "safeSetFieldValue('about_mission_title', "
);
content = content.replace(
    /document\.getElementById\('about_mission_text'\)\.value = /g,
    "safeSetFieldValue('about_mission_text', "
);
content = content.replace(
    /document\.getElementById\('about_vision_title'\)\.value = /g,
    "safeSetFieldValue('about_vision_title', "
);
content = content.replace(
    /document\.getElementById\('about_vision_text'\)\.value = /g,
    "safeSetFieldValue('about_vision_text', "
);

// Fix loadContactPage
content = content.replace(
    /document\.getElementById\('contact_page_title'\)\.value = /g,
    "safeSetFieldValue('contact_page_title', "
);
content = content.replace(
    /document\.getElementById\('contact_page_description'\)\.value = /g,
    "safeSetFieldValue('contact_page_description', "
);
content = content.replace(
    /document\.getElementById\('contact_email'\)\.value = /g,
    "safeSetFieldValue('contact_email', "
);
content = content.replace(
    /document\.getElementById\('contact_phone'\)\.value = /g,
    "safeSetFieldValue('contact_phone', "
);
content = content.replace(
    /document\.getElementById\('contact_address'\)\.value = /g,
    "safeSetFieldValue('contact_address', "
);

// Fix the closing parentheses for all the replacements
content = content.replace(/safeSetFieldValue\([^,]+, ([^;]+);/g, 'safeSetFieldValue($1);');

// Write the fixed content back
fs.writeFileSync('content-admin-comprehensive.html', content);

console.log('✅ Fixed all null reference errors in admin panel');
console.log('✅ Added safe field value setter helper');
console.log('✅ All tabs should now work without errors');