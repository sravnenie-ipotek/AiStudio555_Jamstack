const { chromium } = require('playwright');

async function checkHebrewTextOverflow() {
    console.log('🔍 Checking Hebrew text overflow specifically...');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:3005/teachers.html?locale=he', {
            waitUntil: 'networkidle',
            timeout: 15000
        });

        await page.waitForSelector('.shared-teacher-card', { timeout: 8000 });
        await page.waitForTimeout(2000);

        // Check specific Hebrew text handling
        const hebrewTextCheck = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('.shared-teacher-card')).slice(0, 5);
            const results = [];

            cards.forEach((card, index) => {
                const name = card.querySelector('.teacher-name');
                const title = card.querySelector('.teacher-title');
                const bio = card.querySelector('.teacher-bio');

                const cardData = {
                    cardIndex: index,
                    name: {
                        text: name?.textContent || '',
                        isOverflowing: name ? name.scrollWidth > name.clientWidth : false,
                        hasEllipsis: name ? window.getComputedStyle(name).textOverflow === 'ellipsis' : false,
                        whiteSpace: name ? window.getComputedStyle(name).whiteSpace : ''
                    },
                    title: {
                        text: title?.textContent || '',
                        isOverflowing: title ? title.scrollWidth > title.clientWidth : false,
                        hasEllipsis: title ? window.getComputedStyle(title).textOverflow === 'ellipsis' : false
                    },
                    bio: {
                        text: bio?.textContent?.substring(0, 100) + '...' || '',
                        isOverflowing: bio ? bio.scrollHeight > bio.clientHeight : false,
                        lineClamp: bio ? window.getComputedStyle(bio).webkitLineClamp : '',
                        lines: bio ? Math.floor(bio.scrollHeight / parseInt(window.getComputedStyle(bio).lineHeight)) : 0
                    }
                };

                results.push(cardData);
            });

            return results;
        });

        console.log('📊 Hebrew Text Analysis (first 5 cards):');
        hebrewTextCheck.forEach((card, index) => {
            console.log(`\n📝 Card ${index + 1}:`);
            console.log(`   Name: "${card.name.text}"`);
            console.log(`     Overflowing: ${card.name.isOverflowing} | Has ellipsis: ${card.name.hasEllipsis}`);
            console.log(`   Title: "${card.title.text}"`);
            console.log(`     Overflowing: ${card.title.isOverflowing} | Has ellipsis: ${card.title.hasEllipsis}`);
            console.log(`   Bio: "${card.bio.text}"`);
            console.log(`     Overflowing: ${card.bio.isOverflowing} | Line clamp: ${card.bio.lineClamp} | Lines: ${card.bio.lines}`);
        });

        // Summary
        const hasProblems = hebrewTextCheck.some(card =>
            (card.name.isOverflowing && !card.name.hasEllipsis) ||
            (card.title.isOverflowing && !card.title.hasEllipsis) ||
            (card.bio.isOverflowing && card.bio.lineClamp !== '3')
        );

        if (hasProblems) {
            console.log('\n❌ HEBREW TEXT OVERFLOW ISSUES DETECTED');
        } else {
            console.log('\n✅ HEBREW TEXT OVERFLOW WORKING PERFECTLY');
            console.log('   - All names have proper ellipsis handling');
            console.log('   - All titles have proper ellipsis handling');
            console.log('   - All bios are properly clamped to 3 lines');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

checkHebrewTextOverflow().catch(console.error);