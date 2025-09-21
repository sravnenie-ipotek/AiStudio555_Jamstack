// Audit script to find untranslated text in courses.html
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'courses.html');
const html = fs.readFileSync(filePath, 'utf8');

// Regular expression to find text content that should be translated
const textPattern = />([^<>{}\n]+)</g;
const hasDataI18n = /data-i18n="[^"]+"/;

console.log('🔍 Auditing courses.html for untranslated text...\n');

const lines = html.split('\n');
const untranslatedTexts = [];

lines.forEach((line, index) => {
    // Skip script tags, style tags, and comments
    if (line.includes('<script') || line.includes('<style') || line.includes('<!--')) return;

    // Check if line has text content
    const matches = line.match(textPattern);
    if (matches) {
        matches.forEach(match => {
            const text = match.replace('>', '').replace('<', '').trim();

            // Skip empty, numbers only, or very short text
            if (!text || text.length < 3 || /^\d+$/.test(text) || text === '|') return;

            // Check if this line has data-i18n
            if (!line.includes('data-i18n')) {
                untranslatedTexts.push({
                    lineNumber: index + 1,
                    text: text.substring(0, 80),
                    line: line.trim().substring(0, 120)
                });
            }
        });
    }
});

console.log(`Found ${untranslatedTexts.length} potentially untranslated text elements:\n`);

// Group by common text patterns
const commonTexts = {};
untranslatedTexts.forEach(item => {
    if (!commonTexts[item.text]) {
        commonTexts[item.text] = [];
    }
    commonTexts[item.text].push(item.lineNumber);
});

// Show most common untranslated texts
const sorted = Object.entries(commonTexts)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 30);

console.log('Top untranslated text elements:');
console.log('================================\n');

sorted.forEach(([text, lineNumbers]) => {
    console.log(`📝 "${text}"`);
    console.log(`   Found ${lineNumbers.length} times on lines: ${lineNumbers.slice(0, 5).join(', ')}${lineNumbers.length > 5 ? '...' : ''}\n`);
});

// Check specific important elements
console.log('\n🎯 Critical Elements to Translate:');
console.log('===================================\n');

const criticalElements = [
    'No items found',
    'Course Details',
    'View Details',
    'Lessons',
    'Students',
    'weeks',
    'Rating',
    'All',
    'Web Development',
    'App Development',
    'Machine Learning',
    'Cloud Computing',
    'Pages',
    'Menu',
    'About us',
    'Contact Us',
    'Sign in',
    'Sign up',
    'Your Cart',
    'Continue to Checkout'
];

criticalElements.forEach(text => {
    const found = untranslatedTexts.filter(item => item.text.includes(text));
    if (found.length > 0) {
        console.log(`❌ "${text}" - NOT translated (${found.length} instances)`);
    }
});

console.log('\n📊 Summary:');
console.log('===========');
console.log(`Total lines in file: ${lines.length}`);
console.log(`Elements with potential text: ${untranslatedTexts.length}`);
console.log(`Unique text patterns: ${Object.keys(commonTexts).length}`);

// Count existing data-i18n
const existingI18n = (html.match(/data-i18n="/g) || []).length;
console.log(`Existing data-i18n attributes: ${existingI18n}`);
console.log(`\n💡 Recommendation: Add data-i18n attributes to the ${untranslatedTexts.length} untranslated elements`);