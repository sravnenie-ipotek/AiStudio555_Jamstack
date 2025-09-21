#!/usr/bin/env node

/**
 * Script to identify and fix all missing translations in home.html
 * Run this to add data-i18n attributes to all text content
 */

const fs = require('fs');
const path = require('path');

// Read home.html
const htmlPath = path.join(__dirname, 'home.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Translation mappings for common untranslated elements
const translationMappings = [
    // Testimonials
    {
        find: '<h4 class="testimonials-title">&quot;A Game Changer for My Career&quot;</h4>',
        replace: '<h4 class="testimonials-title" data-i18n="testimonials_data.content.items.0.title">&quot;A Game Changer for My Career&quot;</h4>'
    },
    {
        find: '<h4 class="testimonials-title">&quot;Practical Approach Expert Instructor&quot;</h4>',
        replace: '<h4 class="testimonials-title" data-i18n="testimonials_data.content.items.1.title">&quot;Practical Approach Expert Instructor&quot;</h4>'
    },
    {
        find: '<h4 class="testimonials-title">&quot;Quality of the Content is Unmatched&quot;</h4>',
        replace: '<h4 class="testimonials-title" data-i18n="testimonials_data.content.items.2.title">&quot;Quality of the Content is Unmatched&quot;</h4>'
    },
    // Language pills
    {
        find: '<a href="#" class="lang-pill active" onclick="setActivePill(this)">EN</a>',
        replace: '<a href="#" class="lang-pill active" onclick="setActivePill(this)" data-i18n="ui.content.languages.en">EN</a>'
    },
    {
        find: '<a href="#" class="lang-pill" onclick="setActivePill(this)">RU</a>',
        replace: '<a href="#" class="lang-pill" onclick="setActivePill(this)" data-i18n="ui.content.languages.ru">RU</a>'
    },
    {
        find: '<a href="#" class="lang-pill" onclick="setActivePill(this)">HE</a>',
        replace: '<a href="#" class="lang-pill" onclick="setActivePill(this)" data-i18n="ui.content.languages.he">HE</a>'
    },
    // Mobile language pills
    {
        find: '<a href="#" class="mobile-lang-pill active" onclick="setActivePill(this)">EN</a>',
        replace: '<a href="#" class="mobile-lang-pill active" onclick="setActivePill(this)" data-i18n="ui.content.languages.en">EN</a>'
    },
    {
        find: '<a href="#" class="mobile-lang-pill" onclick="setActivePill(this)">RU</a>',
        replace: '<a href="#" class="mobile-lang-pill" onclick="setActivePill(this)" data-i18n="ui.content.languages.ru">RU</a>'
    },
    {
        find: '<a href="#" class="mobile-lang-pill" onclick="setActivePill(this)">HE</a>',
        replace: '<a href="#" class="mobile-lang-pill" onclick="setActivePill(this)" data-i18n="ui.content.languages.he">HE</a>'
    },
    // Stats numbers
    {
        find: '<div class="number-categories">K</div>',
        replace: '<div class="number-categories" data-i18n="stats.content.stats.0.value_suffix">K</div>'
    }
];

// Apply all replacements
let changesMade = 0;
translationMappings.forEach(({ find, replace }) => {
    if (html.includes(find)) {
        html = html.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
        changesMade++;
        console.log(`✅ Added translation for: ${find.substring(0, 50)}...`);
    }
});

// Write back to file if changes were made
if (changesMade > 0) {
    // Create backup first
    fs.writeFileSync(htmlPath + '.backup', fs.readFileSync(htmlPath));
    fs.writeFileSync(htmlPath, html);
    console.log(`\n🎉 Successfully added ${changesMade} translation attributes!`);
    console.log('📁 Backup saved as home.html.backup');
} else {
    console.log('ℹ️  No changes needed - all elements already have translation attributes');
}

// Now check what's in the database
console.log('\n📊 Checking database for translation content...\n');

const testTranslations = [
    'testimonials_data.content.items.0.title',
    'testimonials_data.content.items.0.text',
    'footer.content.copyright',
    'footer.content.designed_by',
    'ui.content.languages.en',
    'ui.content.languages.ru',
    'ui.content.languages.he'
];

console.log('Run these commands to verify translations exist in database:\n');
testTranslations.forEach(path => {
    console.log(`curl -s "http://localhost:3000/api/nd/home-page?locale=en" | jq '.data.${path}'`);
});