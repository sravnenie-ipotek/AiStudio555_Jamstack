const { chromium } = require('playwright');

async function applyDataI18nAttributes() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🏷️ Applying data-i18n attributes to elements...');

    try {
        // Load the page
        await page.goto('http://localhost:3005/home.html', { waitUntil: 'networkidle' });
        console.log('✅ Page loaded successfully');

        // Wait for page to fully load
        await page.waitForTimeout(3000);

        // Apply data-i18n attributes to elements
        const results = await page.evaluate(() => {
            console.log('🔧 Applying data-i18n attributes...');
            const results = [];

            // 1. Fix Blog navigation link
            const blogLinks = Array.from(document.querySelectorAll('a.nav-link.w-nav-link'));
            const blogLink = blogLinks.find(link => link.textContent.trim() === 'Blog');
            if (blogLink) {
                blogLink.setAttribute('data-i18n', 'navigation.blog');
                results.push('✅ Added data-i18n="navigation.blog" to Blog link');
            } else {
                results.push('❌ Blog navigation link not found');
            }

            // 2. Fix testimonial author names
            const testimonialAuthors = [
                { name: 'David Kim', dataI18n: 'testimonials.author1.name' },
                { name: 'Tariq Ahmed', dataI18n: 'testimonials.author2.name' },
                { name: 'Nadia Khan', dataI18n: 'testimonials.author3.name' }
            ];

            testimonialAuthors.forEach(({ name, dataI18n }) => {
                const authorElements = Array.from(document.querySelectorAll('.testimonials-card-author-name'));
                const authorElement = authorElements.find(el => el.textContent.trim() === name);
                if (authorElement) {
                    authorElement.setAttribute('data-i18n', dataI18n);
                    results.push(`✅ Added data-i18n="${dataI18n}" to ${name}`);
                } else {
                    results.push(`❌ Testimonial author ${name} not found`);
                }
            });

            // 3. Fix footer Zohacous link
            const footerLinks = Array.from(document.querySelectorAll('a.footer-information-text-link'));
            const zohacousLink = footerLinks.find(link => link.textContent.trim().includes('Zohacous') || link.textContent.trim() === 'Zohacous');
            if (zohacousLink) {
                zohacousLink.setAttribute('data-i18n', 'footer.company.zohacous');
                results.push('✅ Added data-i18n="footer.company.zohacous" to Zohacous link');
            } else {
                // Try broader search
                const allLinks = Array.from(document.querySelectorAll('a'));
                const zohacousLinks = allLinks.filter(link => link.textContent.trim().includes('Zohacous'));
                if (zohacousLinks.length > 0) {
                    zohacousLinks[0].setAttribute('data-i18n', 'footer.company.zohacous');
                    results.push('✅ Added data-i18n="footer.company.zohacous" to Zohacous link (broad search)');
                } else {
                    results.push('❌ Zohacous footer link not found');
                }
            }

            return results;
        });

        // Print results
        results.forEach(result => console.log(result));

        // Verify the attributes were added
        console.log('\n🔍 Verifying attributes were added...');
        const verification = await page.evaluate(() => {
            const blogLink = document.querySelector('a[data-i18n="navigation.blog"]');
            const author1 = document.querySelector('[data-i18n="testimonials.author1.name"]');
            const author2 = document.querySelector('[data-i18n="testimonials.author2.name"]');
            const author3 = document.querySelector('[data-i18n="testimonials.author3.name"]');
            const zohacousLink = document.querySelector('[data-i18n="footer.company.zohacous"]');

            return {
                blog: blogLink ? `Found: "${blogLink.textContent.trim()}"` : 'Not found',
                author1: author1 ? `Found: "${author1.textContent.trim()}"` : 'Not found',
                author2: author2 ? `Found: "${author2.textContent.trim()}"` : 'Not found',
                author3: author3 ? `Found: "${author3.textContent.trim()}"` : 'Not found',
                zohacous: zohacousLink ? `Found: "${zohacousLink.textContent.trim()}"` : 'Not found'
            };
        });

        console.log('📊 Verification Results:');
        Object.entries(verification).forEach(([key, result]) => {
            const status = result.startsWith('Found:') ? '✅' : '❌';
            console.log(`  ${status} ${key}: ${result}`);
        });

        // Now test language switching
        console.log('\n🌐 Testing language switching with new attributes...');

        // Switch to Russian
        await page.evaluate(() => {
            if (window.languageManager) {
                window.languageManager.switchLanguage('ru');
            }
        });
        await page.waitForTimeout(2000);

        const russianTest = await page.evaluate(() => {
            const blogLink = document.querySelector('a[data-i18n="navigation.blog"]');
            return blogLink ? blogLink.textContent.trim() : 'not found';
        });

        console.log(`Russian test - Blog link: "${russianTest}"`);

        // Switch back to English
        await page.evaluate(() => {
            if (window.languageManager) {
                window.languageManager.switchLanguage('en');
            }
        });
        await page.waitForTimeout(2000);

        const englishTest = await page.evaluate(() => {
            const blogLink = document.querySelector('a[data-i18n="navigation.blog"]');
            return blogLink ? blogLink.textContent.trim() : 'not found';
        });

        console.log(`English test - Blog link: "${englishTest}"`);

        return verification;

    } catch (error) {
        console.error('❌ Error during attribute application:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the attribute application
applyDataI18nAttributes()
    .then((verification) => {
        console.log('\n🎉 Data-i18n attributes application complete!');

        const foundCount = Object.values(verification).filter(v => v.startsWith('Found:')).length;
        const totalCount = Object.values(verification).length;

        console.log(`📈 Success Rate: ${foundCount}/${totalCount} elements found`);

        if (foundCount === totalCount) {
            console.log('✅ All elements successfully found and attributed!');
            console.log('\n🚀 Next steps:');
            console.log('1. Test with language switching');
            console.log('2. Run final verification script');
            console.log('3. Check that translations persist in HTML');
        } else {
            console.log('⚠️  Some elements not found. May need manual inspection.');
        }
    })
    .catch(error => {
        console.error('❌ Attribute application failed:', error);
        process.exit(1);
    });