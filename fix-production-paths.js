/**
 * Auto-fix script for production path issues
 * Adds ../ prefix to all relative paths in dist subdirectory files
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function fixPaths(htmlFile) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    const fileName = path.basename(htmlFile);
    const dirName = path.dirname(htmlFile);

    console.log(`\n🔧 Fixing: ${htmlFile}`);

    // Check if file is in a subdirectory
    const isInSubdir = dirName.includes('/dist/en') ||
                        dirName.includes('/dist/ru') ||
                        dirName.includes('/dist/he');

    if (!isInSubdir) {
        console.log('  ⏭️  Skipping - not in subdirectory');
        return false;
    }

    let fixedContent = content;
    let changeCount = 0;

    // Fix patterns
    const fixes = [
        // Images
        { from: /src="(images\/[^"]+)"/g, to: 'src="../$1"' },
        // CSS files
        { from: /href="(css\/[^"]+\.css)"/g, to: 'href="../$1"' },
        { from: /href="(shared\/[^"]+\.css)"/g, to: 'href="../$1"' },
        // JS files
        { from: /src="(js\/[^"]+\.js)"/g, to: 'src="../$1"' },
        { from: /src="(shared\/[^"]+\.js)"/g, to: 'src="../$1"' }
    ];

    fixes.forEach(fix => {
        const matches = fixedContent.match(fix.from);
        if (matches) {
            changeCount += matches.length;
            fixedContent = fixedContent.replace(fix.from, fix.to);
        }
    });

    if (changeCount > 0) {
        fs.writeFileSync(htmlFile, fixedContent);
        console.log(`  ${GREEN}✅ Fixed ${changeCount} paths${RESET}`);
        return true;
    } else {
        console.log(`  ${YELLOW}✨ No changes needed${RESET}`);
        return false;
    }
}

// Fix all distribution files
function fixAllDistFiles() {
    console.log('🛠️  Auto-fixing Production Paths\n');
    console.log('=' .repeat(50));

    const filesToFix = [
        'dist/en/home.html',
        'dist/en/courses.html',
        'dist/ru/home.html',
        'dist/ru/courses.html',
        'dist/he/home.html',
        'dist/he/courses.html'
    ];

    let totalFixed = 0;

    filesToFix.forEach(file => {
        const fullPath = path.join(__dirname, file);
        if (fs.existsSync(fullPath)) {
            if (fixPaths(fullPath)) {
                totalFixed++;
            }
        } else {
            console.log(`${YELLOW}⚠️  File not found: ${file}${RESET}`);
        }
    });

    // Summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 SUMMARY:');

    if (totalFixed > 0) {
        console.log(`${GREEN}✅ Fixed ${totalFixed} files!${RESET}`);
        console.log('\n📝 Next steps:');
        console.log('   1. Run: node test-production-paths.js (to verify)');
        console.log('   2. Commit and push the changes');
    } else {
        console.log(`${YELLOW}✨ No fixes needed - all paths are correct!${RESET}`);
    }
}

// Run fixes
fixAllDistFiles();