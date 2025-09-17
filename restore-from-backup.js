#!/usr/bin/env node

/**
 * RESTORE FROM BACKUP SCRIPT
 * Restores the site from a backup directory
 * Usage: node restore-from-backup.js [backup-directory-name]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('❌ Please specify the backup directory name');
    console.error('Usage: node restore-from-backup.js [backup-directory-name]');
    console.error('\nAvailable backups:');

    // List available backups
    const files = fs.readdirSync(__dirname);
    const backups = files.filter(f => f.startsWith('old-site-backup-') || f.startsWith('backup-'));

    if (backups.length > 0) {
        backups.forEach(backup => {
            console.log(`  - ${backup}`);
        });
    } else {
        console.log('  No backups found');
    }

    process.exit(1);
}

const BACKUP_DIR = args[0];
const BACKUP_PATH = path.join(__dirname, BACKUP_DIR);
const ROOT_PATH = __dirname;

// Files to preserve during restore
const PRESERVE_LIST = [
    '.git',
    'node_modules',
    '.env',
    '.env.railway',
    'DEPLOYMENT_INFO.json',
    'restore-from-backup.js',
    'prepare-newdesign-deployment.js'
];

/**
 * Restore files from backup
 */
function restoreFromBackup() {
    console.log(`🔄 Restoring from backup: ${BACKUP_DIR}`);
    console.log('=====================================\n');

    // Check if backup exists
    if (!fs.existsSync(BACKUP_PATH)) {
        console.error(`❌ Backup directory not found: ${BACKUP_DIR}`);
        process.exit(1);
    }

    console.log('📦 Step 1: Reading backup contents...');
    const backupFiles = fs.readdirSync(BACKUP_PATH);
    console.log(`  Found ${backupFiles.length} items in backup\n`);

    console.log('🗑️ Step 2: Removing current NewDesign files...');

    // Remove NewDesign specific files
    const newDesignFiles = ['home.html', 'about-us.html', 'courses.html', 'pricing.html',
                           'blog.html', 'contact-us.html', 'teachers.html',
                           'career-orientation.html', 'career-center.html'];

    let removed = 0;
    newDesignFiles.forEach(file => {
        const filePath = path.join(ROOT_PATH, file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            removed++;
        }
    });
    console.log(`  Removed ${removed} NewDesign files\n`);

    console.log('📋 Step 3: Restoring backup files...');
    let restored = 0;

    backupFiles.forEach(file => {
        if (PRESERVE_LIST.includes(file)) {
            console.log(`  ⏭️ Skipping ${file} (preserved)`);
            return;
        }

        const sourcePath = path.join(BACKUP_PATH, file);
        const destPath = path.join(ROOT_PATH, file);

        try {
            // Remove existing if present
            if (fs.existsSync(destPath)) {
                if (fs.lstatSync(destPath).isDirectory()) {
                    fs.rmSync(destPath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(destPath);
                }
            }

            // Copy from backup
            if (fs.lstatSync(sourcePath).isDirectory()) {
                copyDirectory(sourcePath, destPath);
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }

            restored++;
            console.log(`  ✅ Restored ${file}`);
        } catch (error) {
            console.error(`  ❌ Failed to restore ${file}:`, error.message);
        }
    });

    console.log(`\n✅ Restored ${restored} items from backup\n`);
}

/**
 * Helper: Copy directory recursively
 */
function copyDirectory(source, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(source);

    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const destPath = path.join(dest, file);

        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDirectory(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    });
}

/**
 * Main execution
 */
function main() {
    try {
        restoreFromBackup();

        console.log('🎉 RESTORE COMPLETE!');
        console.log('====================\n');
        console.log('The site has been restored from backup.');
        console.log('\nNext steps:');
        console.log('1. Test locally: npm start');
        console.log('2. Commit if needed: git add . && git commit -m "Restored from backup"');
        console.log('3. Deploy: git push\n');

    } catch (error) {
        console.error('\n❌ RESTORE FAILED!');
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Run
main();