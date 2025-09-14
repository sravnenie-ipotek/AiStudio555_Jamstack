const { chromium } = require('playwright');

async function testMenuSequence() {
    console.log('🎯 Testing Perfect Menu Sequence');
    console.log('Home | Courses | Teachers | Career Services | Pricing | Language');
    console.log('===============================================================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('http://localhost:3005/en/home.html', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
    });

    await page.waitForTimeout(2000);

    const menuSequence = await page.evaluate(() => {
        const navMenu = document.querySelector('.nav-menu');
        const menuItems = navMenu ? Array.from(navMenu.children) : [];

        const sequence = menuItems.map((item, index) => {
            const rect = item.getBoundingClientRect();
            const style = window.getComputedStyle(item);

            let type = 'unknown';
            let text = '';

            if (item.classList.contains('nav-link')) {
                type = 'nav-link';
                text = item.textContent.trim();
            } else if (item.classList.contains('menu-dropdown-wrapper')) {
                type = 'dropdown';
                text = item.querySelector('.dropdown-toggle-text-block')?.textContent?.trim() || 'Dropdown';
            } else if (item.id === 'language-switcher') {
                type = 'language-switcher';
                const select = item.querySelector('select');
                text = select ? select.options[select.selectedIndex].text : 'Language';
            }

            return {
                index,
                type,
                text,
                x: Math.round(rect.x),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                y: Math.round(rect.y),
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                color: style.color,
                display: style.display
            };
        });

        // Check if they're all aligned
        const firstY = sequence[0]?.y;
        const allAligned = sequence.every(item => Math.abs(item.y - firstY) <= 5);

        // Check spacing consistency
        const gaps = [];
        for (let i = 1; i < sequence.length; i++) {
            gaps.push(sequence[i].x - (sequence[i-1].x + sequence[i-1].width));
        }

        return {
            sequence,
            allAligned,
            firstY,
            gaps,
            avgGap: gaps.length > 0 ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0
        };
    });

    console.log('📋 Menu Sequence Analysis:');
    console.log('===========================');

    menuSequence.sequence.forEach((item, index) => {
        const position = `${item.x}px`;
        const alignment = Math.abs(item.y - menuSequence.firstY) <= 5 ? '✅' : '❌';
        console.log(`${index + 1}. ${item.text.padEnd(15)} | Type: ${item.type.padEnd(18)} | X: ${position.padEnd(8)} | Y-Align: ${alignment}`);
    });

    console.log('\n🔍 Detailed Analysis:');
    console.log('======================');
    console.log(`All items Y-aligned: ${menuSequence.allAligned ? '✅ YES' : '❌ NO'}`);
    console.log(`Average gap between items: ${menuSequence.avgGap}px`);
    console.log(`Gap consistency: ${menuSequence.gaps.map(g => Math.round(g) + 'px').join(', ')}`);

    // Check if language switcher looks like a menu item
    const langSwitcher = menuSequence.sequence.find(item => item.type === 'language-switcher');
    const navLinks = menuSequence.sequence.filter(item => item.type === 'nav-link');

    if (langSwitcher && navLinks.length > 0) {
        const sampleNavLink = navLinks[0];
        const stylesMatch = (
            langSwitcher.fontSize === sampleNavLink.fontSize &&
            langSwitcher.fontWeight === sampleNavLink.fontWeight &&
            langSwitcher.color === sampleNavLink.color
        );

        console.log('\n🎨 Visual Consistency:');
        console.log('=======================');
        console.log(`Language switcher styles match nav links: ${stylesMatch ? '✅ YES' : '❌ NO'}`);
        console.log(`  Font size: ${langSwitcher.fontSize} vs ${sampleNavLink.fontSize}`);
        console.log(`  Font weight: ${langSwitcher.fontWeight} vs ${sampleNavLink.fontWeight}`);
        console.log(`  Color: ${langSwitcher.color}`);
    }

    const isPerfect = menuSequence.allAligned &&
                     langSwitcher &&
                     menuSequence.avgGap > 20 && menuSequence.avgGap < 80;

    console.log('\n🎯 FINAL RESULT:');
    console.log('================');
    if (isPerfect) {
        console.log('✅ PERFECT! Language selector appears as natural part of menu sequence');
        console.log('✅ Home | Courses | Teachers | Career Services | Pricing | Language');
    } else {
        console.log('❌ Still needs adjustment for perfect menu integration');
    }

    // Take screenshot
    await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/newCode/perfect-menu-sequence.png',
        clip: { x: 0, y: 0, width: 1920, height: 100 }
    });
    console.log('\n📸 Screenshot saved: perfect-menu-sequence.png');

    await page.waitForTimeout(3000);
    await browser.close();
}

testMenuSequence().catch(console.error);