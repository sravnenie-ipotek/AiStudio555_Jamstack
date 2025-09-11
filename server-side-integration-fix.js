/**
 * SERVER-SIDE HTML INTEGRATION FIX
 * Automatically injects webflow-strapi-integration.js into HTML files
 * Solves deployment issues by handling integration at runtime
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

// Integration script tag to inject
const INTEGRATION_SCRIPT = `
  <!-- API Integration - CRITICAL FOR DYNAMIC CONTENT (Server-side injected) -->
  <script src="js/webflow-strapi-integration.js"></script>`;

const INTEGRATION_SCRIPT_DIST = `
  <!-- API Integration - CRITICAL FOR DYNAMIC CONTENT (Server-side injected) -->
  <script src="../js/webflow-strapi-integration.js"></script>`;

/**
 * Middleware to inject integration script into HTML files
 */
function injectIntegrationScript(req, res, next) {
    // Only process HTML files
    if (!req.path.endsWith('.html') && !req.path.endsWith('/')) {
        return next();
    }
    
    // Determine the actual file path
    let filePath = req.path;
    if (filePath === '/' || filePath.endsWith('/')) {
        filePath += 'index.html';
    }
    
    const fullPath = path.join(__dirname, filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
        return next();
    }
    
    try {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Skip if integration script already exists
        if (content.includes('webflow-strapi-integration.js')) {
            console.log(`⚡ ${req.path}: Script already exists, serving as-is`);
            return res.send(content);
        }
        
        // Determine which script tag to use based on path
        const scriptTag = filePath.startsWith('/dist/') ? INTEGRATION_SCRIPT_DIST : INTEGRATION_SCRIPT;
        
        // Inject script before closing body tag
        if (content.includes('</body>')) {
            content = content.replace('</body>', `${scriptTag}\n</body>`);
            console.log(`🚀 ${req.path}: Integration script injected dynamically`);
            
            // Set appropriate headers
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            
            return res.send(content);
        } else {
            console.log(`⚠️ ${req.path}: No closing body tag found, serving as-is`);
            return res.send(content);
        }
        
    } catch (error) {
        console.error(`❌ Error processing ${req.path}:`, error.message);
        return next();
    }
}

/**
 * Apply the middleware to an Express app
 */
function applyIntegrationFix(app) {
    console.log('🔧 Applying server-side integration fix...');
    
    // Apply middleware before static file serving
    app.use(injectIntegrationScript);
    
    console.log('✅ Server-side integration fix applied');
    console.log('📝 Will automatically inject webflow-strapi-integration.js into all HTML files');
}

/**
 * Test the integration fix
 */
function testIntegrationFix() {
    console.log('🧪 TESTING SERVER-SIDE INTEGRATION FIX');
    console.log('='.repeat(50));
    
    const testFiles = [
        'home.html',
        'index.html',
        'dist/en/index.html',
        'dist/ru/index.html',
        'dist/he/index.html'
    ];
    
    for (const file of testFiles) {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const hasBodyTag = content.includes('</body>');
            const hasScript = content.includes('webflow-strapi-integration.js');
            
            console.log(`${file}:`);
            console.log(`  ${hasBodyTag ? '✅' : '❌'} Has closing body tag: ${hasBodyTag}`);
            console.log(`  ${hasScript ? '✅' : '❌'} Has integration script: ${hasScript}`);
            
            if (hasBodyTag && !hasScript) {
                console.log(`  🔧 Will be processed by server-side injection`);
            }
            console.log('');
        }
    }
    
    console.log('🎯 Server-side fix will handle files missing integration scripts');
    console.log('✅ Test complete');
}

module.exports = {
    applyIntegrationFix,
    testIntegrationFix,
    injectIntegrationScript
};

// Run test if called directly
if (require.main === module) {
    testIntegrationFix();
}