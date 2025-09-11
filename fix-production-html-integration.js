/**
 * FIX PRODUCTION HTML INTEGRATION
 * Adds missing script tag to production HTML files for dynamic content loading
 */

const fs = require('fs');
const path = require('path');

// Pages that need the integration script
const HTML_FILES_TO_UPDATE = [
    'home.html',
    'index.html', 
    'courses.html',
    'teachers.html',
    'about-us.html',
    'contact-us.html',
    'career-center.html',
    'career-orientation.html',
    'pricing.html',
    'blog.html',
    'detail_blog.html',
    'detail_courses.html'
];

// Multi-language versions
const LANGUAGE_DIRS = ['dist/en', 'dist/ru', 'dist/he'];

// The script tag that needs to be added
const INTEGRATION_SCRIPT = `
  <!-- API Integration - CRITICAL FOR DYNAMIC CONTENT -->
  <script src="../js/webflow-strapi-integration.js"></script>`;

const INTEGRATION_SCRIPT_ROOT = `
  <!-- API Integration - CRITICAL FOR DYNAMIC CONTENT -->
  <script src="js/webflow-strapi-integration.js"></script>`;

async function updateHTMLFiles() {
    console.log('🔧 FIXING PRODUCTION HTML INTEGRATION');
    console.log('='.repeat(50));
    
    let updatedCount = 0;
    
    // Update root-level HTML files
    console.log('\n📁 UPDATING ROOT HTML FILES:');
    for (const fileName of HTML_FILES_TO_UPDATE) {
        const filePath = path.join(__dirname, fileName);
        
        if (fs.existsSync(filePath)) {
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Check if integration script already exists
                if (content.includes('webflow-strapi-integration.js')) {
                    console.log(`✅ ${fileName}: Script already exists`);
                    continue;
                }
                
                // Add script before closing body tag
                if (content.includes('</body>')) {
                    content = content.replace('</body>', `${INTEGRATION_SCRIPT_ROOT}\n</body>`);
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`✅ ${fileName}: Integration script added`);
                    updatedCount++;
                } else {
                    console.log(`⚠️ ${fileName}: No closing body tag found`);
                }
                
            } catch (error) {
                console.error(`❌ Error updating ${fileName}:`, error.message);
            }
        } else {
            console.log(`⚠️ ${fileName}: File not found`);
        }
    }
    
    // Update language-specific HTML files
    console.log('\n🌍 UPDATING LANGUAGE-SPECIFIC HTML FILES:');
    for (const langDir of LANGUAGE_DIRS) {
        const langPath = path.join(__dirname, langDir);
        
        if (!fs.existsSync(langPath)) {
            console.log(`⚠️ ${langDir}: Directory not found`);
            continue;
        }
        
        console.log(`\n📂 Processing ${langDir}:`);
        
        for (const fileName of HTML_FILES_TO_UPDATE) {
            const filePath = path.join(langPath, fileName);
            
            if (fs.existsSync(filePath)) {
                try {
                    let content = fs.readFileSync(filePath, 'utf8');
                    
                    // Check if integration script already exists
                    if (content.includes('webflow-strapi-integration.js')) {
                        console.log(`  ✅ ${fileName}: Script already exists`);
                        continue;
                    }
                    
                    // Add script before closing body tag
                    if (content.includes('</body>')) {
                        content = content.replace('</body>', `${INTEGRATION_SCRIPT}\n</body>`);
                        fs.writeFileSync(filePath, content, 'utf8');
                        console.log(`  ✅ ${fileName}: Integration script added`);
                        updatedCount++;
                    } else {
                        console.log(`  ⚠️ ${fileName}: No closing body tag found`);
                    }
                    
                } catch (error) {
                    console.error(`  ❌ Error updating ${fileName}:`, error.message);
                }
            }
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`🎉 INTEGRATION FIX COMPLETE!`);
    console.log(`📊 Updated ${updatedCount} HTML files`);
    console.log('🚀 Ready for production deployment');
    
    return updatedCount;
}

// Run if called directly
if (require.main === module) {
    updateHTMLFiles()
        .then((count) => {
            console.log(`\n✅ Successfully updated ${count} HTML files`);
            console.log('📝 Next step: Deploy these changes to production');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ Update failed:', err);
            process.exit(1);
        });
}

module.exports = { updateHTMLFiles };