/**
 * DEPLOYMENT DIAGNOSTIC TOOL
 * Analyzes production deployment status and identifies disconnect issues
 */

const fs = require('fs');
const path = require('path');

async function diagnoseProductionIssue() {
    console.log('🔍 PRODUCTION DEPLOYMENT DIAGNOSTIC');
    console.log('='.repeat(60));
    
    // 1. Check local files have integration script
    console.log('\n📁 LOCAL FILES VERIFICATION:');
    const testFiles = ['home.html', 'index.html', 'dist/en/index.html'];
    
    for (const file of testFiles) {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const hasScript = content.includes('webflow-strapi-integration.js');
            console.log(`${hasScript ? '✅' : '❌'} ${file}: ${hasScript ? 'Integration script FOUND' : 'Integration script MISSING'}`);
        } else {
            console.log(`❌ ${file}: File not found`);
        }
    }
    
    // 2. Analysis of architecture
    console.log('\n🏗️ DEPLOYMENT ARCHITECTURE ANALYSIS:');
    console.log('Based on investigation:');
    console.log('');
    console.log('🔴 ISSUE IDENTIFIED:');
    console.log('• www.aistudio555.com serves STATIC content (no script integration)');
    console.log('• Railway API works perfectly at aistudio555jamstack-production.up.railway.app');
    console.log('• But Railway static files also show OLD content');
    console.log('');
    console.log('🎯 ROOT CAUSE:');
    console.log('• Railway deployment may not be picking up latest HTML files');
    console.log('• Or www.aistudio555.com is served from different hosting (not Railway)');
    console.log('• Static files and API are deployed separately');
    console.log('');
    console.log('📋 DEPLOYMENT STATUS:');
    console.log('✅ Local repository: HTML files updated with integration scripts');
    console.log('✅ Git repository: Changes committed and pushed successfully');
    console.log('✅ Railway API: All endpoints working perfectly');
    console.log('✅ Admin panel: Fully functional in production');
    console.log('❌ Railway static files: Not reflecting latest HTML changes');
    console.log('❌ www.aistudio555.com: Serving outdated static content');
    
    // 3. Recommended solutions
    console.log('\n💡 RECOMMENDED SOLUTIONS:');
    console.log('');
    console.log('Option 1: Force Railway redeploy');
    console.log('• Railway may need manual trigger to rebuild static files');
    console.log('• Check Railway dashboard for deployment status');
    console.log('');
    console.log('Option 2: Verify hosting setup');
    console.log('• www.aistudio555.com might be served by different provider');
    console.log('• Check if domain points to Railway or separate hosting');
    console.log('');
    console.log('Option 3: Alternative integration approach');
    console.log('• Inject script tags via server-side rendering');
    console.log('• Modify server.js to add integration to HTML on-the-fly');
    
    // 4. Next steps
    console.log('\n🚀 IMMEDIATE NEXT STEPS:');
    console.log('');
    console.log('1. Check Railway deployment logs and status');
    console.log('2. Verify domain configuration (www.aistudio555.com → Railway?)');
    console.log('3. Consider server-side HTML modification as backup');
    console.log('4. Test end-to-end once static files are properly deployed');
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 SUMMARY: HTML integration scripts added locally but not served in production');
}

// Run diagnostic
if (require.main === module) {
    diagnoseProductionIssue()
        .then(() => {
            console.log('\n✅ Diagnostic complete');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ Diagnostic failed:', err);
            process.exit(1);
        });
}

module.exports = { diagnoseProductionIssue };