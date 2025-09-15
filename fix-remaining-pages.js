const fs = require('fs');

const pagesToFix = [
    'career-center.html',
    'career-orientation.html', 
    'blog.html',
    'about-us.html',
    'pricing.html'
];

console.log('🔵 BLUE AGENT: Fixing Enhanced Integration on Remaining Pages');
console.log('=============================================================');

pagesToFix.forEach(pageFile => {
    try {
        const filePath = `/Users/michaelmishayev/Desktop/newCode/${pageFile}`;
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  ${pageFile} not found, skipping...`);
            return;
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if enhanced-integration.js already exists
        if (content.includes('enhanced-integration.js')) {
            console.log(`✅ ${pageFile} - Enhanced integration already included`);
            return;
        }
        
        // Check if webflow-strapi-integration.js exists
        const hasWebflowStrapi = content.includes('webflow-strapi-integration.js');
        
        if (hasWebflowStrapi) {
            // Add after webflow-strapi-integration.js
            content = content.replace(
                /(<script src="js\/webflow-strapi-integration\.js"><\/script>)/,
                '$1\n  <script src="js/enhanced-integration.js"></script>'
            );
        } else {
            // Add before closing </body> tag
            content = content.replace(
                /(<\/body>)/,
                '  <script src="js/webflow-strapi-integration.js"></script>\n  <script src="js/enhanced-integration.js"></script>\n$1'
            );
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ ${pageFile} - Enhanced integration script added successfully`);
        
    } catch (error) {
        console.log(`❌ ${pageFile} - Error: ${error.message}`);
    }
});

console.log('\n🔵 Enhanced Integration Fix Complete');
