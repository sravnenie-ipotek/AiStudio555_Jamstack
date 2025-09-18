const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generateTeacherImages() {
    console.log('🎨 Starting automated teacher image generation...');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const page = await browser.newPage();

    // Navigate to the generator
    await page.goto('http://localhost:3005/backups/newDesign/generate-teacher-images.html');

    console.log('📍 Generator page loaded');

    // Wait for the page to fully load
    await page.waitForTimeout(2000);

    // Click generate all images button
    console.log('🚀 Generating all teacher images...');
    await page.click('button:has-text("Generate All Teacher Images")');

    // Wait for generation to complete (16 teachers * ~500ms each = ~8 seconds + buffer)
    await page.waitForTimeout(12000);

    console.log('📥 Downloading generated images...');

    // Download all images
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download All Images")');

    // Give time for all downloads to start
    await page.waitForTimeout(3000);

    console.log('✅ Teacher image generation completed!');

    // Take a screenshot of the results
    await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/newCode/backups/newDesign/teacher-generation-results.png',
        fullPage: true
    });

    console.log('📸 Screenshot saved: teacher-generation-results.png');

    // Keep browser open for manual inspection
    console.log('⏸️  Browser will stay open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);

    await browser.close();
    console.log('🎉 Teacher image generation process completed!');
}

if (require.main === module) {
    generateTeacherImages().catch(console.error);
}

module.exports = { generateTeacherImages };