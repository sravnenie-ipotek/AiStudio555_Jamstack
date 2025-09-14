const { chromium } = require('playwright');

async function debugLanguagePosition() {
    console.log('🐛 DEBUGGING: Language Button Position in Menu');
    console.log('===============================================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log('Loading: http://localhost:3005/en/home.html');
    await page.goto('http://localhost:3005/en/home.html', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
    });

    await page.waitForTimeout(2000);

    const debugInfo = await page.evaluate(() => {
        const langSwitcher = document.getElementById('language-switcher');
        const navMenu = document.querySelector('.nav-menu.w-nav-menu');
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        const primaryButton = document.querySelector('.primary-button-wrapper');

        const results = {
            languageSwitcher: null,
            navMenu: null,
            isLanguageInNavMenu: false,
            actualParent: null,
            htmlStructure: '',
            visualPosition: null
        };

        // Get language switcher details
        if (langSwitcher) {
            const rect = langSwitcher.getBoundingClientRect();
            results.languageSwitcher = {
                found: true,
                position: {
                    x: Math.round(rect.left),
                    y: Math.round(rect.top),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                computedStyle: {
                    display: window.getComputedStyle(langSwitcher).display,
                    position: window.getComputedStyle(langSwitcher).position,
                    zIndex: window.getComputedStyle(langSwitcher).zIndex
                }
            };

            // Check actual parent hierarchy
            let parent = langSwitcher.parentElement;
            let parentChain = [];
            while (parent && parent !== document.body) {
                parentChain.push({
                    tagName: parent.tagName.toLowerCase(),
                    className: parent.className,
                    id: parent.id
                });
                parent = parent.parentElement;
            }
            results.actualParent = parentChain;

            // Check if it's truly inside nav-menu
            results.isLanguageInNavMenu = langSwitcher.closest('.nav-menu') !== null;

            // Get surrounding HTML structure
            if (langSwitcher.parentElement) {
                results.htmlStructure = langSwitcher.parentElement.outerHTML.substring(0, 500) + '...';
            }
        }

        // Get nav menu details
        if (navMenu) {
            const rect = navMenu.getBoundingClientRect();
            results.navMenu = {
                position: {
                    x: Math.round(rect.left),
                    y: Math.round(rect.top),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                childrenCount: navMenu.children.length,
                children: Array.from(navMenu.children).map(child => ({
                    tagName: child.tagName,
                    className: child.className,
                    id: child.id,
                    textContent: child.textContent?.trim().substring(0, 50)
                }))
            };
        }

        // Visual relationship check
        if (results.languageSwitcher && results.navMenu) {
            const langPos = results.languageSwitcher.position;
            const menuPos = results.navMenu.position;

            const isVisuallyInside = (
                langPos.x >= menuPos.x &&
                langPos.x + langPos.width <= menuPos.x + menuPos.width &&
                langPos.y >= menuPos.y &&
                langPos.y + langPos.height <= menuPos.y + menuPos.height
            );

            results.visualPosition = {
                isVisuallyInside,
                isOverlapping: langPos.x < menuPos.x + menuPos.width && langPos.x + langPos.width > menuPos.x,
                distanceFromMenu: langPos.x - (menuPos.x + menuPos.width)
            };
        }

        return results;
    });

    console.log('🔍 ANALYSIS RESULTS:');
    console.log('====================');

    if (debugInfo.languageSwitcher) {
        console.log('\n📍 Language Switcher Position:');
        console.log(`   X: ${debugInfo.languageSwitcher.position.x}px`);
        console.log(`   Y: ${debugInfo.languageSwitcher.position.y}px`);
        console.log(`   Size: ${debugInfo.languageSwitcher.position.width}x${debugInfo.languageSwitcher.position.height}px`);

        console.log('\n🏗️  Parent Hierarchy:');
        debugInfo.actualParent.forEach((parent, index) => {
            const indent = '   '.repeat(index + 1);
            console.log(`${indent}${parent.tagName}${parent.className ? '.' + parent.className.split(' ').join('.') : ''}${parent.id ? '#' + parent.id : ''}`);
        });

        console.log(`\n🎯 Is in nav-menu DOM: ${debugInfo.isLanguageInNavMenu ? '✅ YES' : '❌ NO'}`);

        if (debugInfo.visualPosition) {
            console.log(`   Visually inside menu: ${debugInfo.visualPosition.isVisuallyInside ? '✅ YES' : '❌ NO'}`);
            console.log(`   Overlapping menu: ${debugInfo.visualPosition.isOverlapping ? '⚠️ YES' : '✅ NO'}`);
            if (debugInfo.visualPosition.distanceFromMenu > 0) {
                console.log(`   Distance from menu: ${debugInfo.visualPosition.distanceFromMenu}px (SEPARATE ELEMENT)`);
            }
        }
    }

    if (debugInfo.navMenu) {
        console.log('\n📋 Nav Menu Contents:');
        debugInfo.navMenu.children.forEach((child, index) => {
            console.log(`   ${index + 1}. ${child.tagName}.${child.className.split(' ').join('.')} - "${child.textContent}"`);
        });
    }

    console.log('\n🚨 UX ISSUE DETECTION:');
    console.log('======================');

    const isUXBug = !debugInfo.isLanguageInNavMenu ||
                    (debugInfo.visualPosition && !debugInfo.visualPosition.isVisuallyInside);

    if (isUXBug) {
        console.log('❌ CONFIRMED: Language button is NOT part of the menu structure!');
        console.log('❌ This is a UI/UX bug - language selector appears separate from menu');
    } else {
        console.log('✅ Language button is properly integrated into menu');
    }

    // Take detailed screenshot
    await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/newCode/language-position-debug.png',
        fullPage: false
    });
    console.log('\n📸 Debug screenshot saved: language-position-debug.png');

    await page.waitForTimeout(3000);
    await browser.close();
}

debugLanguagePosition().catch(console.error);