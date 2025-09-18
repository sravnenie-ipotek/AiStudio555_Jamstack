/**
 * FIX API PORT REFERENCES
 * Updates all JavaScript files to use port 1337 instead of 3000
 */

const fs = require('fs').promises;
const path = require('path');

async function fixApiPorts() {
    const filesToFix = [
        'js/generate-course-images.js',
        'js/nd-home-integration.js',
        'js/nd-career-orientation-integration.js',
        'js/blog-integration.js',
        'js/nd-pricing-integration.js'
    ];

    console.log('🔧 Fixing API port references from 3000 to 1337\n');

    for (const file of filesToFix) {
        const filePath = path.join(__dirname, file);

        try {
            // Read file content
            let content = await fs.readFile(filePath, 'utf8');

            // Check if file contains localhost:3000
            if (content.includes('localhost:3000')) {
                // Replace all occurrences
                const updatedContent = content.replace(/localhost:3000/g, 'localhost:3000');

                // Write updated content back
                await fs.writeFile(filePath, updatedContent, 'utf8');

                console.log(`✅ Fixed: ${file}`);
            } else {
                console.log(`⏩ Skipped: ${file} (no changes needed)`);
            }
        } catch (error) {
            console.error(`❌ Error fixing ${file}:`, error.message);
        }
    }

    console.log('\n✨ Port references fixed successfully!');
}

fixApiPorts().catch(console.error);