const fs = require('fs');
const path = require('path');

// Read the home.html file
const htmlPath = path.join(__dirname, 'backups', 'newDesign', 'home.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('🔍 Scanning for ALL hardcoded content in home.html...\n');

// Find all hardcoded content using various patterns
const hardcodedContent = {
    ticker: [],
    buttons: [],
    navigation: [],
    footer: [],
    misc: []
};

// 1. Find ticker/scrolling text
const tickerMatches = html.matchAll(/<p class="track-title-tag">([^<]+)<\/p>/g);
for (const match of tickerMatches) {
    if (!hardcodedContent.ticker.includes(match[1])) {
        hardcodedContent.ticker.push(match[1]);
    }
}

// 2. Find button texts (excluding data-field attributes)
const buttonPatterns = [
    /<div class="primary-button-text-block[^"]*">([^<]+)<\/div>/g,
    /<div class="white-button-text">([^<]+)<\/div>/g,
    /<a[^>]*class="[^"]*button[^"]*"[^>]*>([^<]+)<\/a>/g
];

for (const pattern of buttonPatterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
        const text = match[1].trim();
        if (text && !text.includes('{{') && !hardcodedContent.buttons.includes(text)) {
            hardcodedContent.buttons.push(text);
        }
    }
}

// 3. Find navigation/menu items
const navMatches = html.matchAll(/<a[^>]*class="nav-link[^"]*"[^>]*>([^<]+)<\/a>/g);
for (const match of navMatches) {
    if (!hardcodedContent.navigation.includes(match[1])) {
        hardcodedContent.navigation.push(match[1]);
    }
}

// 4. Find dropdown menu items
const dropdownMatches = html.matchAll(/<a[^>]*class="dropdown-menu-text-link-block[^"]*"[^>]*>\s*<div>([^<]+)<\/div>/g);
for (const match of dropdownMatches) {
    const text = match[1].trim();
    if (!hardcodedContent.navigation.includes(text)) {
        hardcodedContent.navigation.push(text);
    }
}

// 5. Find footer text
const footerPatterns = [
    /<div class="footer-information-text">([^<]+)</g,
    /<div class="footer-menu-title">([^<]+)<\/div>/g,
    /<div class="footer-contact-details-text">([^<]+)<\/div>/g,
    /<a[^>]*class="footer-menu-text-link"[^>]*>([^<]+)<\/a>/g
];

for (const pattern of footerPatterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
        const text = match[1].trim();
        if (!hardcodedContent.footer.includes(text)) {
            hardcodedContent.footer.push(text);
        }
    }
}

// 6. Find section subtitles/titles that don't have data-field
const subtitleMatches = html.matchAll(/<div class="section-subtitle"(?![^>]*data-field)[^>]*>([^<]+)<\/div>/g);
for (const match of subtitleMatches) {
    if (!hardcodedContent.misc.includes(match[1])) {
        hardcodedContent.misc.push(match[1]);
    }
}

// 7. Find any other hardcoded text in specific classes
const otherPatterns = [
    /<div class="banner-subtitle"(?![^>]*data-field)[^>]*>([^<]+)<\/div>/g,
    /<p class="[^"]*-text"(?![^>]*data-field)[^>]*>([^<]+)<\/p>/g,
    /<h[1-6][^>]*(?![^>]*data-field)[^>]*>([^<]+)<\/h[1-6]>/g
];

for (const pattern of otherPatterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
        const text = match[1].trim();
        if (text &&
            !text.includes('{{') &&
            !text.includes('©') &&
            text.length > 3 &&
            text.length < 200 &&
            !hardcodedContent.misc.includes(text)) {
            hardcodedContent.misc.push(text);
        }
    }
}

// Display results
console.log('📊 HARDCODED CONTENT FOUND:\n');

console.log('🎯 Ticker/Scrolling Text:');
hardcodedContent.ticker.forEach(text => {
    console.log(`  • "${text}"`);
});

console.log('\n🔘 Button Texts:');
hardcodedContent.buttons.forEach(text => {
    console.log(`  • "${text}"`);
});

console.log('\n🧭 Navigation Items:');
hardcodedContent.navigation.forEach(text => {
    console.log(`  • "${text}"`);
});

console.log('\n📄 Footer Content:');
hardcodedContent.footer.forEach(text => {
    console.log(`  • "${text}"`);
});

console.log('\n📝 Other Text:');
hardcodedContent.misc.slice(0, 20).forEach(text => {
    console.log(`  • "${text.substring(0, 100)}..."`);
});

// Count total
const total = Object.values(hardcodedContent).reduce((acc, arr) => acc + arr.length, 0);
console.log(`\n📊 Total hardcoded text items found: ${total}`);

// Save to JSON for database update
fs.writeFileSync('hardcoded-content.json', JSON.stringify(hardcodedContent, null, 2));
console.log('\n💾 Saved to hardcoded-content.json for database migration');