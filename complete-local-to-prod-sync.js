const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Complete Local to Production Sync Script');
console.log('==========================================\n');

// Files to sync (all modified files from git status)
const filesToSync = [
  'admin-nd.html',
  'courses.html',
  'detail_courses.html',
  'js/blog-integration.js',
  'js/enhanced-language-manager.js',
  'js/generate-course-images.js',
  'js/home-pricing-integration.js',
  'js/language-manager-simple.js',
  'js/language-manager.js',
  'js/mobile-language-manager.js',
  'js/nd-about-integration.js',
  'js/nd-career-center-platform-integration.js',
  'js/nd-career-orientation-integration.js',
  'js/nd-contact-integration.js',
  'js/nd-course-details-integration.js',
  'js/nd-courses-integration.js',
  'js/nd-home-integration.js',
  'js/nd-pricing-integration.js',
  'js/nd-teachers-integration.js',
  'js/unified-language-manager.js'
];

// Production server details
const SSH_HOST = 'root@194.87.92.16';
const PROD_PATH = '/var/www/html/';

console.log('📋 Files to sync:');
filesToSync.forEach(file => console.log(`   - ${file}`));
console.log('\n');

// Function to sync a single file
function syncFile(localFile, attempt = 1) {
  const remoteFile = path.join(PROD_PATH, localFile);
  const remotePath = path.dirname(remoteFile);

  console.log(`\n📤 Syncing: ${localFile}`);
  console.log(`   → ${remoteFile}`);

  try {
    // Ensure remote directory exists
    const mkdirCmd = `ssh ${SSH_HOST} "mkdir -p ${remotePath}"`;
    console.log(`   Creating directory: ${remotePath}`);
    execSync(mkdirCmd, { stdio: 'inherit' });

    // Copy file to production
    const scpCmd = `scp ${localFile} ${SSH_HOST}:${remoteFile}`;
    console.log(`   Copying file...`);
    execSync(scpCmd, { stdio: 'inherit' });

    // Verify file was copied
    const verifyCmd = `ssh ${SSH_HOST} "ls -la ${remoteFile}"`;
    const result = execSync(verifyCmd, { encoding: 'utf-8' });

    if (result.includes(path.basename(localFile))) {
      console.log(`   ✅ Successfully synced: ${localFile}`);
      return true;
    } else {
      throw new Error('File not found after copy');
    }
  } catch (error) {
    console.error(`   ❌ Error syncing ${localFile}:`, error.message);

    if (attempt < 3) {
      console.log(`   🔄 Retrying (attempt ${attempt + 1}/3)...`);
      return syncFile(localFile, attempt + 1);
    }

    return false;
  }
}

// Main sync process
async function performSync() {
  console.log('🔧 Starting complete sync process...\n');

  const results = {
    success: [],
    failed: []
  };

  // Sync each file
  for (const file of filesToSync) {
    const success = syncFile(file);
    if (success) {
      results.success.push(file);
    } else {
      results.failed.push(file);
    }
  }

  // Summary
  console.log('\n========================================');
  console.log('📊 SYNC SUMMARY');
  console.log('========================================');
  console.log(`✅ Successfully synced: ${results.success.length} files`);
  if (results.success.length > 0) {
    results.success.forEach(file => console.log(`   ✓ ${file}`));
  }

  if (results.failed.length > 0) {
    console.log(`\n❌ Failed to sync: ${results.failed.length} files`);
    results.failed.forEach(file => console.log(`   ✗ ${file}`));
  }

  // Clear cache on production
  console.log('\n🧹 Clearing production cache...');
  try {
    // Clear browser cache headers
    const clearCacheCmd = `ssh ${SSH_HOST} "find /var/www/html -name '*.html' -exec touch {} \\; && find /var/www/html/js -name '*.js' -exec touch {} \\;"`;
    execSync(clearCacheCmd, { stdio: 'inherit' });
    console.log('✅ Cache cleared');
  } catch (error) {
    console.error('⚠️ Warning: Could not clear cache:', error.message);
  }

  // Restart nginx to ensure changes take effect
  console.log('\n🔄 Restarting Nginx...');
  try {
    const restartCmd = `ssh ${SSH_HOST} "systemctl reload nginx"`;
    execSync(restartCmd, { stdio: 'inherit' });
    console.log('✅ Nginx reloaded');
  } catch (error) {
    console.error('⚠️ Warning: Could not reload Nginx:', error.message);
  }

  console.log('\n========================================');
  console.log('🎉 SYNC COMPLETE!');
  console.log('========================================');
  console.log('\n📌 Next steps:');
  console.log('1. Visit https://www.aistudio555.com to verify changes');
  console.log('2. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)');
  console.log('3. Test language switching on all affected pages');
  console.log('4. Check console for any JavaScript errors');

  if (results.failed.length > 0) {
    console.log('\n⚠️ IMPORTANT: Some files failed to sync. Please review and retry manually.');
  }
}

// Run the sync
performSync().catch(error => {
  console.error('\n💥 Fatal error during sync:', error);
  process.exit(1);
});