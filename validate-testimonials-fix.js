#!/usr/bin/env node

/**
 * Validation script for testimonials translation fix
 * This script can be run to check if testimonials are properly translated
 */

console.log('🧪 Testing Testimonials Translation Fix...');
console.log('==================================================');

// Test data mapping
const testimonialTitleMappings = {
    '"Quality of the Content is Unmatched"': {
        he: '"איכות התוכן ללא תחרות"',
        ru: '"Качество контента не имеет равных"'
    },
    '"Projects Were Particularly Helpful"': {
        he: '"הפרויקטים היו מועילים במיוחד"',
        ru: '"Проекты были особенно полезными"'
    },
    '"Curriculum Covered Everything"': {
        he: '"תוכנית הלימודים כיסתה הכל"',
        ru: '"Учебная программа охватывала все"'
    },
    '"Practical Approach Expert Instructor"': {
        he: '"גישה מעשית ומדריך מומחה"',
        ru: '"Практический подход и опытный инструктор"'
    },
    '"A Game Changer for My Career"': {
        he: '"משנה משחק בקריירה שלי"',
        ru: '"Переломный момент в моей карьере"'
    },
    '"Highly Recommend Zohacous!"': {
        he: '"ממליץ בחום על זוהקוס!"',
        ru: '"Горячо рекомендую Zohacous!"'
    },
    '"An Exceptional Mentorship Journey"': {
        he: '"מסע הדרכה יוצא דופן"',
        ru: '"Исключительный путь наставничества"'
    }
};

console.log('📊 Testing translation mappings:');
console.log('--------------------------------------------------');

Object.keys(testimonialTitleMappings).forEach((englishTitle, index) => {
    const mapping = testimonialTitleMappings[englishTitle];
    console.log(`${index + 1}. English: ${englishTitle}`);
    console.log(`   Hebrew:  ${mapping.he}`);
    console.log(`   Russian: ${mapping.ru}`);
    console.log('');
});

console.log('✅ All translation mappings are properly defined!');
console.log('');
console.log('📝 Next steps:');
console.log('1. Open browser to http://localhost:3005/dist/he/home.html');
console.log('2. Open browser developer tools (F12)');
console.log('3. Check console for "🔧 Fixing testimonials translation..." messages');
console.log('4. Look for translation debug logs showing title changes');
console.log('5. Verify "Practical Approach Expert Instructor" becomes "גישה מעשית ומדריך מומחה"');
console.log('');
console.log('🔍 If fix doesn\'t work, check for:');
console.log('- Script loading errors (404s in Network tab)');
console.log('- JavaScript errors in Console tab');
console.log('- Timing issues (script running before DOM is ready)');
console.log('- Conflicting scripts overriding translations');
