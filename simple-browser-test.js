/**
 * Simple Browser Test - Opens actual browser for manual verification
 */

const puppeteer = require('puppeteer');

async function openBrowser() {
    console.log('🌐 Opening browser for manual testing...\n');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
        ]
    });

    const page = await browser.newPage();

    console.log('📍 Instructions:');
    console.log('1. Browser will open to courses.html');
    console.log('2. Check if courses are loading');
    console.log('3. Test language switching (EN/RU/HE pills)');
    console.log('4. Verify animations work');
    console.log('5. Close browser when done\n');

    try {
        await page.goto('http://localhost:3005/backups/newDesign/courses.html', {
            waitUntil: 'networkidle2'
        });

        console.log('✅ Browser opened successfully!');
        console.log('🔍 Please manually verify:');
        console.log('   • Courses load in the page');
        console.log('   • Language switching works (EN → RU → HE)');
        console.log('   • Animations play smoothly');
        console.log('   • No console errors');
        console.log('\n⏳ Browser will stay open until you close it...');

        // Keep the browser open indefinitely
        await new Promise(() => {});

    } catch (error) {
        console.error('❌ Error opening browser:', error.message);
        await browser.close();
    }
}

openBrowser();