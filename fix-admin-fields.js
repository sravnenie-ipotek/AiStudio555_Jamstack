/**
 * Fix admin panel field discovery and test configuration
 */

const fs = require('fs').promises;

async function fixAdminFields() {
    console.log('🔧 Fixing Admin Panel Field Discovery...\n');
    
    try {
        const html = await fs.readFile('./content-admin-comprehensive.html', 'utf-8');
        
        // More accurate regex patterns for each field type
        const patterns = {
            inputs: /<input[^>]+id="([^"]+)"[^>]*>/g,
            textareas: /<textarea[^>]+id="([^"]+)"[^>]*>/g,
            selects: /<select[^>]+id="([^"]+)"[^>]*>/g
        };
        
        // Extract all form fields
        const allFields = new Set();
        
        for (const [type, pattern] of Object.entries(patterns)) {
            let match;
            while ((match = pattern.exec(html)) !== null) {
                allFields.add(match[1]);
            }
        }
        
        console.log(`Total form fields found: ${allFields.size}`);
        
        // Organize fields by section
        const sections = {
            'home-page': [],
            'courses': [],
            'teachers': [],
            'career-services': [],
            'career-orientation': []
        };
        
        // Categorize fields based on their prefixes and context
        allFields.forEach(fieldId => {
            // Home page fields
            if (fieldId.startsWith('home') || 
                fieldId.startsWith('course') && fieldId.match(/course\d+/) ||
                fieldId.startsWith('testimonial') ||
                fieldId.includes('Featured') ||
                fieldId.includes('About') ||
                fieldId.includes('Companies')) {
                sections['home-page'].push(fieldId);
            }
            // Course management fields (not the home page courses)
            else if ((fieldId.startsWith('course') && !fieldId.match(/course\d+/)) ||
                     fieldId === 'courseTitle' ||
                     fieldId === 'courseDescription' ||
                     fieldId === 'coursePrice' ||
                     fieldId === 'courseDuration' ||
                     fieldId === 'courseLessons' ||
                     fieldId === 'courseRating' ||
                     fieldId === 'courseCategory' ||
                     fieldId === 'courseVisible') {
                sections['courses'].push(fieldId);
            }
            // Teacher fields
            else if (fieldId.startsWith('teacher')) {
                sections['teachers'].push(fieldId);
            }
            // Career services fields
            else if (fieldId.startsWith('cs_') || 
                     fieldId.startsWith('career') && fieldId.includes('Center')) {
                sections['career-services'].push(fieldId);
            }
            // Career orientation fields
            else if (fieldId.startsWith('hero_') ||
                     fieldId.startsWith('problems_') ||
                     fieldId.startsWith('solutions_') ||
                     fieldId.startsWith('process_') ||
                     fieldId.startsWith('paths_') ||
                     fieldId.startsWith('expert_') ||
                     fieldId.startsWith('partners_') ||
                     fieldId.startsWith('assessment_') ||
                     fieldId.startsWith('orientation')) {
                sections['career-orientation'].push(fieldId);
            }
        });
        
        // Display results
        console.log('\n📊 Fields by Section:');
        console.log('=' .repeat(50));
        
        for (const [sectionId, fields] of Object.entries(sections)) {
            console.log(`\n${sectionId}: ${fields.length} fields`);
            if (fields.length > 0 && fields.length <= 20) {
                fields.forEach(field => console.log(`  - ${field}`));
            } else if (fields.length > 20) {
                // Show first 10 and last 5
                fields.slice(0, 10).forEach(field => console.log(`  - ${field}`));
                console.log(`  ... ${fields.length - 15} more fields ...`);
                fields.slice(-5).forEach(field => console.log(`  - ${field}`));
            }
        }
        
        // Generate updated test configuration
        const testConfig = {
            tabs: Object.entries(sections).map(([id, fields]) => ({
                name: id,
                label: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                expectedFields: fields.length,
                actualFields: fields
            }))
        };
        
        // Save configuration
        await fs.writeFile('admin-test-config.json', JSON.stringify(testConfig, null, 2));
        
        console.log('\n\n✅ Fixed Configuration:');
        console.log('=' .repeat(50));
        console.log('const CONFIG = {');
        console.log('    tabs: [');
        testConfig.tabs.forEach(tab => {
            console.log(`        { name: '${tab.name}', label: '${tab.label}', expectedFields: ${tab.expectedFields} },`);
        });
        console.log('    ]');
        console.log('};');
        
        // Calculate total
        const total = Object.values(sections).reduce((sum, fields) => sum + fields.length, 0);
        console.log(`\nTotal Fields: ${total}`);
        
        return testConfig;
        
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Run if executed directly
if (require.main === module) {
    fixAdminFields();
}

module.exports = fixAdminFields;