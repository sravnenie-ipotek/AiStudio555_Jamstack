// Script to fix duplicate Career Orientation field IDs in content-admin-comprehensive.html
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'content-admin-comprehensive.html');

console.log('🔧 Fixing duplicate Career Orientation field IDs...\n');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Find the Career Services section and replace duplicate IDs with prefixed versions
// This will prefix all IDs in the Career Services section with "cs_" to avoid duplicates

const careerServicesStart = content.indexOf('<div id="career-services" class="content-section">');
const careerOrientationStart = content.indexOf('<div id="career-orientation" class="content-section">');

if (careerServicesStart === -1 || careerOrientationStart === -1) {
    console.log('❌ Could not find the sections');
    process.exit(1);
}

console.log(`Found Career Services section at position: ${careerServicesStart}`);
console.log(`Found Career Orientation section at position: ${careerOrientationStart}`);

// Extract the Career Services section
const careerServicesSection = content.substring(careerServicesStart, careerOrientationStart);

// List of field IDs that are duplicated
const duplicateFieldIds = [
    'hero_main_title', 'hero_subtitle', 'hero_description',
    'hero_stat_1_value', 'hero_stat_1_label',
    'hero_stat_2_value', 'hero_stat_2_label',
    'hero_stat_3_value', 'hero_stat_3_label',
    'hero_cta_text', 'hero_cta_link', 'hero_badge_text',
    'problems_main_title', 'problems_subtitle', 'problems_description',
    'problem_1_icon', 'problem_1_title', 'problem_1_description',
    'problem_2_icon', 'problem_2_title', 'problem_2_description',
    'solutions_main_title', 'solutions_subtitle',
    'solution_1_icon', 'solution_1_title', 'solution_1_description',
    'process_main_title', 'process_subtitle',
    'career_paths_main_title', 'career_paths_subtitle',
    'expert_name', 'expert_title', 'expert_description',
    'partners_main_title', 'partners_subtitle',
    'assessment_main_title', 'assessment_subtitle',
    'footer_title', 'footer_subtitle'
];

// Replace IDs in the Career Services section
let fixedSection = careerServicesSection;
let replacementCount = 0;

duplicateFieldIds.forEach(fieldId => {
    const idPattern = new RegExp(`id="${fieldId}"`, 'g');
    const matches = fixedSection.match(idPattern);
    if (matches) {
        fixedSection = fixedSection.replace(idPattern, `id="cs_${fieldId}"`);
        replacementCount += matches.length;
        console.log(`  Replaced ${matches.length} instances of id="${fieldId}" → id="cs_${fieldId}"`);
    }
});

// Replace the section in the original content
const newContent = content.substring(0, careerServicesStart) + 
                  fixedSection + 
                  content.substring(careerOrientationStart);

// Write the fixed content back
fs.writeFileSync(filePath, newContent, 'utf8');

console.log(`\n✅ Fixed ${replacementCount} duplicate field IDs!`);
console.log('📝 All Career Services fields now have "cs_" prefix to avoid conflicts.');
console.log('🎯 Career Orientation tab fields remain unchanged and will work properly.');