const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 300
    });

    const page = await browser.newPage();

    console.log('📍 Navigating to admin panel...');
    await page.goto('http://localhost:3005/content-admin-comprehensive.html');
    await page.waitForLoadState('networkidle');

    console.log('🔄 Switching to Russian...');
    await page.click('button:has-text("🇷🇺 Русский")');
    await page.waitForTimeout(3000);

    console.log('📝 Updating Hero Title field...');

    // Find the Hero Title field
    const heroTitleLabel = await page.locator('label:has-text("Hero Title")').first();
    if (await heroTitleLabel.count() > 0) {
        // Find the input field
        const parent = await heroTitleLabel.locator('..').first();
        const input = await parent.locator('input').first();

        if (await input.count() > 0) {
            // Clear and update the field
            await input.clear();
            await input.fill('Освойте навыки ИИ с экспертным руководством');
            console.log('✅ Updated Hero Title to: "Освойте навыки ИИ с экспертным руководством"');

            // Also update subtitle to match the website
            const heroSubtitleLabel = await page.locator('label:has-text("Hero Subtitle")').first();
            if (await heroSubtitleLabel.count() > 0) {
                const parent2 = await heroSubtitleLabel.locator('..').first();
                const input2 = await parent2.locator('input').first();

                if (await input2.count() > 0) {
                    await input2.clear();
                    await input2.fill('Преобразуйте свою карьеру с передовыми курсами ИИ от лидеров индустрии');
                    console.log('✅ Updated Hero Subtitle');
                }
            }

            // Save the changes
            console.log('\n💾 Saving changes...');

            // Click the save button for home page
            const saveButton = await page.locator('button:has-text("💾 Save Home Page")').first();
            if (await saveButton.count() > 0) {
                await saveButton.click();
                console.log('✅ Clicked Save Home Page button');
                await page.waitForTimeout(2000);
            } else {
                console.log('⚠️ Save button not found, looking for alternative...');
                const altSaveButton = await page.locator('button.btn-success:has-text("Save")').first();
                if (await altSaveButton.count() > 0) {
                    await altSaveButton.click();
                    console.log('✅ Clicked alternative Save button');
                }
            }

            // Wait for save to complete
            await page.waitForTimeout(3000);

            // Now test the search again
            console.log('\n🔍 Testing search with updated content...');
            await page.waitForTimeout(2000); // Wait for index to rebuild

            const searchBox = await page.locator('#adminSearch');
            await searchBox.clear();
            await searchBox.fill('экспертным руководством');
            await page.waitForTimeout(1000);

            const results = await page.locator('.search-result-item').count();
            console.log(`Search "экспертным руководством": ${results} results found`);

            if (results > 0) {
                console.log('✅ Content is now searchable!');
            }
        }
    }

    console.log('\n✨ Update complete! You should now be able to search for this content.');

    await page.waitForTimeout(5000);
    await browser.close();
})();