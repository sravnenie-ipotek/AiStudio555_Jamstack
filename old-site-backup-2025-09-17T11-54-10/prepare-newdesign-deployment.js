#!/usr/bin/env node

/**
 * NEWDESIGN RAILWAY DEPLOYMENT PREPARATION SCRIPT
 * Prepares the NewDesign app for deployment to Railway, replacing the old home page
 *
 * Strategy: Move NewDesign to root level while preserving APIs and database
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 NewDesign Railway Deployment Preparation Script');
console.log('===================================================\n');

// Configuration
const BACKUP_DIR = 'old-site-backup-' + new Date().toISOString().replace(/:/g, '-').substring(0, 19);
const NEWDESIGN_PATH = path.join(__dirname, 'backups', 'newDesign');
const ROOT_PATH = __dirname;

// Files and directories to preserve (APIs, database, server configs)
const PRESERVE_LIST = [
    'server.js',
    'migrate-to-railway.js',
    'package.json',
    'package-lock.json',
    '.env',
    '.env.railway',
    '.gitignore',
    '.git',
    'node_modules',
    'backups',  // Keep backups directory
    'old-project',  // Already archived old files
    'api'  // API endpoints directory if exists
];

// Files to copy from NewDesign to root
const NEWDESIGN_FILES = [
    'home.html',
    'about-us.html',
    'courses.html',
    'pricing.html',
    'blog.html',
    'contact-us.html',
    'teachers.html',
    'career-orientation.html',
    'career-center.html',
    '404.html',
    '401.html',
    'css',
    'js',
    'images',
    'fonts',
    'shared',
    'authentication-pages',
    'template-pages'
];

// Deployment steps
const deploymentSteps = [];

/**
 * Step 1: Create backup of current root files
 */
function backupCurrentSite() {
    console.log('📦 Step 1: Backing up current site...');

    const backupPath = path.join(ROOT_PATH, BACKUP_DIR);

    if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
    }

    // Get all files in root
    const rootFiles = fs.readdirSync(ROOT_PATH);
    let backedUp = 0;

    rootFiles.forEach(file => {
        // Skip items in preserve list and existing backups
        if (PRESERVE_LIST.includes(file) || file.startsWith('old-') || file.startsWith('backup')) {
            return;
        }

        const sourcePath = path.join(ROOT_PATH, file);
        const destPath = path.join(backupPath, file);

        try {
            // Check if it's a directory
            if (fs.lstatSync(sourcePath).isDirectory()) {
                copyDirectory(sourcePath, destPath);
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }
            backedUp++;
        } catch (error) {
            console.error(`  ⚠️ Could not backup ${file}:`, error.message);
        }
    });

    console.log(`  ✅ Backed up ${backedUp} items to ${BACKUP_DIR}\n`);
    deploymentSteps.push(`Backed up current site to ${BACKUP_DIR}`);
}

/**
 * Step 2: Copy NewDesign files to root
 */
function copyNewDesignToRoot() {
    console.log('📋 Step 2: Copying NewDesign files to root...');

    let copied = 0;

    NEWDESIGN_FILES.forEach(file => {
        const sourcePath = path.join(NEWDESIGN_PATH, file);
        const destPath = path.join(ROOT_PATH, file);

        if (!fs.existsSync(sourcePath)) {
            console.log(`  ⚠️ Skipping ${file} (not found in NewDesign)`);
            return;
        }

        try {
            // Remove existing file/directory if it exists (except preserved ones)
            if (fs.existsSync(destPath) && !PRESERVE_LIST.includes(file)) {
                if (fs.lstatSync(destPath).isDirectory()) {
                    fs.rmSync(destPath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(destPath);
                }
            }

            // Copy from NewDesign
            if (fs.lstatSync(sourcePath).isDirectory()) {
                copyDirectory(sourcePath, destPath);
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }

            copied++;
            console.log(`  ✅ Copied ${file}`);
        } catch (error) {
            console.error(`  ❌ Failed to copy ${file}:`, error.message);
        }
    });

    console.log(`  ✅ Copied ${copied} items from NewDesign to root\n`);
    deploymentSteps.push(`Copied ${copied} NewDesign files to root`);
}

/**
 * Step 3: Update server.js routes for NewDesign
 */
function updateServerRoutes() {
    console.log('🔧 Step 3: Updating server.js routes...');

    const serverPath = path.join(ROOT_PATH, 'server.js');
    let serverContent = fs.readFileSync(serverPath, 'utf8');

    // Update root route to serve NewDesign home.html
    const updates = [
        {
            find: "app.get('/', (req, res) => {",
            desc: "Root route to home.html"
        },
        {
            find: "res.sendFile(path.join(__dirname, 'index.html'));",
            replace: "res.sendFile(path.join(__dirname, 'home.html'));",
            desc: "Serve home.html instead of index.html"
        }
    ];

    let updatedCount = 0;
    updates.forEach(update => {
        if (update.replace && serverContent.includes(update.find)) {
            serverContent = serverContent.replace(update.find, update.replace);
            updatedCount++;
            console.log(`  ✅ Updated: ${update.desc}`);
        }
    });

    // Add NewDesign static file serving if not already present
    if (!serverContent.includes("// Serve NewDesign static files")) {
        const staticServing = `
// Serve NewDesign static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/shared', express.static(path.join(__dirname, 'shared')));
`;
        // Insert after middleware setup
        const middlewareIndex = serverContent.indexOf('app.use(express.json());');
        if (middlewareIndex !== -1) {
            const insertPoint = serverContent.indexOf('\n', middlewareIndex) + 1;
            serverContent = serverContent.slice(0, insertPoint) + staticServing + serverContent.slice(insertPoint);
            updatedCount++;
            console.log('  ✅ Added NewDesign static file serving');
        }
    }

    fs.writeFileSync(serverPath, serverContent);
    console.log(`  ✅ Updated ${updatedCount} server routes\n`);
    deploymentSteps.push(`Updated ${updatedCount} server routes`);
}

/**
 * Step 4: Create deployment info file
 */
function createDeploymentInfo() {
    console.log('📝 Step 4: Creating deployment info...');

    const info = {
        timestamp: new Date().toISOString(),
        backupDirectory: BACKUP_DIR,
        deploymentSteps: deploymentSteps,
        preservedFiles: PRESERVE_LIST,
        copiedFiles: NEWDESIGN_FILES,
        notes: [
            'NewDesign is now the main site',
            'Old site backed up to ' + BACKUP_DIR,
            'All APIs and database connections preserved',
            'Ready for Railway deployment'
        ]
    };

    fs.writeFileSync(
        path.join(ROOT_PATH, 'DEPLOYMENT_INFO.json'),
        JSON.stringify(info, null, 2)
    );

    console.log('  ✅ Created DEPLOYMENT_INFO.json\n');
}

/**
 * Step 5: Update package.json scripts
 */
function updatePackageJson() {
    console.log('📦 Step 5: Updating package.json...');

    const packagePath = path.join(ROOT_PATH, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // Add NewDesign specific scripts
    packageJson.scripts = {
        ...packageJson.scripts,
        "serve:newdesign": "python3 -m http.server 3005",
        "dev:newdesign": "concurrently \"npm start\" \"npm run serve:newdesign\"",
        "restore:oldsite": `node restore-from-backup.js ${BACKUP_DIR}`
    };

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('  ✅ Updated package.json scripts\n');
    deploymentSteps.push('Updated package.json scripts');
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
    console.log('🔍 Pre-deployment checks...');

    // Check if NewDesign exists
    if (!fs.existsSync(NEWDESIGN_PATH)) {
        console.error('❌ NewDesign directory not found at:', NEWDESIGN_PATH);
        process.exit(1);
    }

    // Check for required files
    const requiredFiles = ['server.js', 'package.json'];
    for (const file of requiredFiles) {
        if (!fs.existsSync(path.join(ROOT_PATH, file))) {
            console.error(`❌ Required file missing: ${file}`);
            process.exit(1);
        }
    }

    console.log('✅ Pre-deployment checks passed\n');

    // Execute deployment steps
    try {
        backupCurrentSite();
        copyNewDesignToRoot();
        updateServerRoutes();
        updatePackageJson();
        createDeploymentInfo();

        console.log('🎉 DEPLOYMENT PREPARATION COMPLETE!');
        console.log('====================================\n');
        console.log('Next steps:');
        console.log('1. Test locally: npm run dev:newdesign');
        console.log('2. Commit changes: git add . && git commit -m "Deploy NewDesign as main site"');
        console.log('3. Push to Railway: git push');
        console.log('\nRollback command if needed:');
        console.log(`  node restore-from-backup.js ${BACKUP_DIR}\n`);

    } catch (error) {
        console.error('\n❌ DEPLOYMENT PREPARATION FAILED!');
        console.error('Error:', error.message);
        console.error('\nPlease fix the issue and try again.');
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
} else {
    module.exports = { main, backupCurrentSite, copyNewDesignToRoot, updateServerRoutes };
}