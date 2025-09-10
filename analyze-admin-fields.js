/**
 * Analyze actual admin panel field structure
 * This script reads the admin HTML and extracts all field IDs by section
 */

const fs = require('fs').promises;
const path = require('path');

async function analyzeAdminPanel() {
    console.log('🔍 Analyzing Admin Panel Field Structure...\n');
    
    try {
        // Read the admin HTML
        const html = await fs.readFile('./content-admin-comprehensive.html', 'utf-8');
        
        // Define sections to analyze
        const sections = [
            { id: 'home-page', name: 'Home Page' },
            { id: 'courses', name: 'Courses' },
            { id: 'teachers', name: 'Teachers' },
            { id: 'career-services', name: 'Career Services' },
            { id: 'career-orientation', name: 'Career Orientation' }
        ];
        
        const report = {
            timestamp: new Date().toISOString(),
            totalFields: 0,
            sections: {}
        };
        
        // Extract all input fields with IDs
        const allFieldMatches = html.match(/id="([^"]+)"/g) || [];
        const allFieldIds = allFieldMatches.map(match => match.replace(/id="|"/g, ''));
        
        console.log(`Total fields with IDs found: ${allFieldIds.length}\n`);
        
        // Analyze each section
        for (const section of sections) {
            console.log(`\n📂 ${section.name} Section:`);
            console.log('=' .repeat(50));
            
            // Find section in HTML
            const sectionRegex = new RegExp(`<div id="${section.id}"[^>]*>([\\s\\S]*?)(?=<div id="[^"]+"|$)`, 'i');
            const sectionMatch = html.match(sectionRegex);
            
            if (!sectionMatch) {
                console.log(`❌ Section not found`);
                report.sections[section.id] = { found: false, fields: [] };
                continue;
            }
            
            const sectionHtml = sectionMatch[1];
            
            // Extract field IDs from this section
            const fieldMatches = sectionHtml.match(/id="([^"]+)"/g) || [];
            const fieldIds = fieldMatches.map(match => match.replace(/id="|"/g, ''));
            
            // Filter out non-form fields
            const formFields = fieldIds.filter(id => {
                // Include only actual form fields
                return !id.includes('Form') && 
                       !id.includes('List') && 
                       !id.includes('Grid') &&
                       !id.includes('section') &&
                       !id.includes('wrapper');
            });
            
            // Categorize fields by type
            const inputFields = formFields.filter(id => 
                sectionHtml.includes(`<input[^>]*id="${id}"`) ||
                sectionHtml.includes(`<textarea[^>]*id="${id}"`) ||
                sectionHtml.includes(`<select[^>]*id="${id}"`)
            );
            
            console.log(`✅ Found ${inputFields.length} form fields`);
            
            // Group fields by prefix
            const fieldGroups = {};
            inputFields.forEach(field => {
                const prefix = field.split(/[_\d]/)[0];
                if (!fieldGroups[prefix]) {
                    fieldGroups[prefix] = [];
                }
                fieldGroups[prefix].push(field);
            });
            
            // Display field groups
            console.log('\nField Groups:');
            for (const [prefix, fields] of Object.entries(fieldGroups)) {
                console.log(`  ${prefix}* : ${fields.length} fields`);
                if (fields.length <= 10) {
                    fields.forEach(field => console.log(`    - ${field}`));
                } else {
                    // Show first 5 and last 5
                    fields.slice(0, 5).forEach(field => console.log(`    - ${field}`));
                    console.log(`    ... ${fields.length - 10} more ...`);
                    fields.slice(-5).forEach(field => console.log(`    - ${field}`));
                }
            }
            
            report.sections[section.id] = {
                found: true,
                totalFields: inputFields.length,
                fieldGroups: fieldGroups,
                sampleFields: inputFields.slice(0, 10)
            };
            
            report.totalFields += inputFields.length;
        }
        
        // Generate corrected test configuration
        console.log('\n\n📋 CORRECTED TEST CONFIGURATION:');
        console.log('=' .repeat(50));
        console.log('const CONFIG = {');
        console.log('    tabs: [');
        
        for (const section of sections) {
            const sectionData = report.sections[section.id];
            if (sectionData.found) {
                console.log(`        { name: '${section.id}', label: '${section.name}', expectedFields: ${sectionData.totalFields} },`);
            }
        }
        
        console.log('    ]');
        console.log('};');
        
        // Generate field mapping for tests
        console.log('\n\n🗺️ FIELD MAPPINGS FOR TESTS:');
        console.log('=' .repeat(50));
        console.log('const FIELD_MAPPINGS = {');
        
        for (const [sectionId, sectionData] of Object.entries(report.sections)) {
            if (sectionData.found) {
                console.log(`    '${sectionId}': {`);
                
                // Group fields by logical sections
                const groups = sectionData.fieldGroups;
                for (const [prefix, fields] of Object.entries(groups)) {
                    if (fields.length > 0) {
                        console.log(`        '${prefix}': [`);
                        fields.slice(0, 5).forEach(field => {
                            console.log(`            '${field}',`);
                        });
                        if (fields.length > 5) {
                            console.log(`            // ... ${fields.length - 5} more fields`);
                        }
                        console.log(`        ],`);
                    }
                }
                
                console.log(`    },`);
            }
        }
        
        console.log('};');
        
        // Save report
        await fs.writeFile('admin-field-analysis.json', JSON.stringify(report, null, 2));
        console.log('\n\n✅ Analysis complete. Report saved to admin-field-analysis.json');
        
        // Summary
        console.log('\n📊 SUMMARY:');
        console.log('=' .repeat(50));
        console.log(`Total Form Fields: ${report.totalFields}`);
        for (const [sectionId, sectionData] of Object.entries(report.sections)) {
            if (sectionData.found) {
                console.log(`  ${sectionId}: ${sectionData.totalFields} fields`);
            }
        }
        
        return report;
        
    } catch (error) {
        console.error('Error analyzing admin panel:', error);
        return null;
    }
}

// Run analysis
if (require.main === module) {
    analyzeAdminPanel();
}

module.exports = analyzeAdminPanel;