/**
 * Comprehensive Hebrew Translation Test for Pricing Page
 * Tests all Hebrew language functionality and RTL layout
 */

const { chromium } = require('playwright');
const fs = require('fs');

class PricingHebrewTester {
    constructor() {
        this.results = {
            summary: {
                totalChecks: 0,
                passed: 0,
                failed: 0,
                warnings: 0
            },
            translations: [],
            rtl: [],
            functionality: [],
            performance: []
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async runTests() {
        this.log('🚀 Starting comprehensive Hebrew translation test for pricing page...', 'info');
        
        const browser = await chromium.launch({ 
            headless: false,
            devtools: true
        });

        try {
            const context = await browser.newContext({
                viewport: { width: 1920, height: 1080 },
                locale: 'he-IL'
            });

            const page = await context.newPage();
            
            // Listen for console messages
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    this.log(`Browser console error: ${msg.text()}`, 'error');
                }
            });

            // Navigate to pricing page
            this.log('📄 Navigating to pricing page...', 'info');
            await page.goto('http://localhost:3005/pricing.html', { 
                waitUntil: 'networkidle',
                timeout: 30000 
            });

            // Wait for language manager to initialize
            await page.waitForTimeout(2000);

            // Test 1: Switch to Hebrew
            this.log('🌐 Testing Hebrew language switching...', 'info');
            await this.testHebrewLanguageSwitch(page);

            // Test 2: Verify RTL layout
            this.log('↩️ Testing RTL layout and styling...', 'info');
            await this.testRTLLayout(page);

            // Test 3: Check Hebrew translations
            this.log('📝 Testing Hebrew text translations...', 'info');
            await this.testHebrewTranslations(page);

            // Test 4: Test tab functionality in Hebrew
            this.log('🔄 Testing pricing tabs in Hebrew mode...', 'info');
            await this.testTabFunctionality(page);

            // Test 5: Test language switching back and forth
            this.log('🔄 Testing bidirectional language switching...', 'info');
            await this.testLanguageSwitchingBidirectional(page);

            // Test 6: Check pricing data in Hebrew
            this.log('💰 Testing pricing data in Hebrew...', 'info');
            await this.testPricingData(page);

            // Test 7: Test navigation in Hebrew
            this.log('🧭 Testing navigation in Hebrew...', 'info');
            await this.testNavigation(page);

            // Test 8: Mobile responsive Hebrew test
            this.log('📱 Testing mobile responsive Hebrew...', 'info');
            await this.testMobileHebrew(page);

            // Take final screenshot
            await page.screenshot({ 
                path: '/Users/michaelmishayev/Desktop/newCode/pricing-hebrew-final.png',
                fullPage: true 
            });

        } catch (error) {
            this.log(`Test execution error: ${error.message}`, 'error');
            this.results.summary.failed++;
        } finally {
            await browser.close();
            this.generateReport();
        }
    }

    async testHebrewLanguageSwitch(page) {
        try {
            this.results.summary.totalChecks++;
            
            // Click Hebrew language pill
            await page.click('[data-locale="he"]', { timeout: 5000 });
            
            // Wait for language change
            await page.waitForTimeout(3000);
            
            // Check if Hebrew pill is active
            const hebrewPillActive = await page.$eval('[data-locale="he"]', el => 
                el.classList.contains('active')
            );
            
            if (hebrewPillActive) {
                this.log('Hebrew language pill activated successfully', 'success');
                this.results.functionality.push({
                    test: 'Hebrew Language Switch',
                    status: 'PASS',
                    details: 'Hebrew pill shows active state'
                });
                this.results.summary.passed++;
            } else {
                this.log('Hebrew language pill not showing active state', 'error');
                this.results.functionality.push({
                    test: 'Hebrew Language Switch',
                    status: 'FAIL',
                    details: 'Hebrew pill not active after click'
                });
                this.results.summary.failed++;
            }

        } catch (error) {
            this.log(`Hebrew language switch test failed: ${error.message}`, 'error');
            this.results.summary.failed++;
        }
    }

    async testRTLLayout(page) {
        try {
            this.results.summary.totalChecks += 3;
            
            // Check HTML dir attribute
            const htmlDir = await page.$eval('html', el => el.getAttribute('dir'));
            const htmlLang = await page.$eval('html', el => el.getAttribute('lang'));
            
            if (htmlDir === 'rtl') {
                this.log('HTML dir="rtl" applied correctly', 'success');
                this.results.rtl.push({
                    test: 'HTML dir attribute',
                    status: 'PASS',
                    value: htmlDir
                });
                this.results.summary.passed++;
            } else {
                this.log(`HTML dir attribute incorrect: ${htmlDir}`, 'error');
                this.results.rtl.push({
                    test: 'HTML dir attribute',
                    status: 'FAIL',
                    value: htmlDir
                });
                this.results.summary.failed++;
            }

            if (htmlLang === 'he') {
                this.log('HTML lang="he" applied correctly', 'success');
                this.results.rtl.push({
                    test: 'HTML lang attribute',
                    status: 'PASS',
                    value: htmlLang
                });
                this.results.summary.passed++;
            } else {
                this.log(`HTML lang attribute incorrect: ${htmlLang}`, 'warning');
                this.results.rtl.push({
                    test: 'HTML lang attribute',
                    status: 'WARNING',
                    value: htmlLang
                });
                this.results.summary.warnings++;
            }

            // Check text alignment
            const containerStyle = await page.$eval('.container', el => 
                getComputedStyle(el).textAlign
            );
            
            this.results.rtl.push({
                test: 'Container text alignment',
                status: 'INFO',
                value: containerStyle
            });
            this.results.summary.passed++;

            // Take RTL layout screenshot
            await page.screenshot({ 
                path: '/Users/michaelmishayev/Desktop/newCode/pricing-hebrew-rtl.png',
                fullPage: true 
            });

        } catch (error) {
            this.log(`RTL layout test failed: ${error.message}`, 'error');
            this.results.summary.failed++;
        }
    }

    async testHebrewTranslations(page) {
        try {
            // Key elements to check for Hebrew translations
            const elementsToCheck = [
                { selector: '[data-i18n="pricing.content.hero.title"]', expected: 'תמחור תוכניות' },
                { selector: '[data-i18n="pricing.content.plans.monthly.name"]', expected: 'חודשי' },
                { selector: '[data-i18n="pricing.content.plans.annual.name"]', expected: 'שנתי' },
                { selector: '[data-i18n="pricing.content.plans.monthly.period"]', expected: 'לחודש' },
                { selector: '[data-i18n="pricing.content.plans.annual.period"]', expected: 'לשנה' },
                { selector: '[data-i18n="navigation.content.home"]', expected: 'דף הבית' },
                { selector: '[data-i18n="navigation.content.pricing"]', expected: 'תמחור' },
                { selector: '[data-i18n="pricing.content.features.community_support"]', expected: 'תמיכת קהילה' },
                { selector: '[data-i18n="pricing.content.features.course_materials"]', expected: 'חומרי קורס' },
                { selector: '[data-i18n="misc.content.explore_plans"]', expected: 'גלה תכונות התוכניות' }
            ];

            this.results.summary.totalChecks += elementsToCheck.length;

            for (const element of elementsToCheck) {
                try {
                    const textContent = await page.textContent(element.selector);
                    
                    if (textContent && textContent.trim() !== '') {
                        // Check if text contains Hebrew characters
                        const hasHebrew = /[\u0590-\u05FF]/.test(textContent);
                        
                        if (hasHebrew) {
                            this.log(`✓ Hebrew translation found for ${element.selector}: "${textContent}"`, 'success');
                            this.results.translations.push({
                                selector: element.selector,
                                status: 'PASS',
                                text: textContent,
                                hasHebrew: true
                            });
                            this.results.summary.passed++;
                        } else {
                            this.log(`⚠ No Hebrew text for ${element.selector}: "${textContent}"`, 'warning');
                            this.results.translations.push({
                                selector: element.selector,
                                status: 'WARNING',
                                text: textContent,
                                hasHebrew: false
                            });
                            this.results.summary.warnings++;
                        }
                    } else {
                        this.log(`❌ Empty or missing text for ${element.selector}`, 'error');
                        this.results.translations.push({
                            selector: element.selector,
                            status: 'FAIL',
                            text: textContent || 'N/A',
                            hasHebrew: false
                        });
                        this.results.summary.failed++;
                    }
                } catch (error) {
                    this.log(`❌ Could not find element ${element.selector}`, 'error');
                    this.results.translations.push({
                        selector: element.selector,
                        status: 'FAIL',
                        text: 'Element not found',
                        hasHebrew: false
                    });
                    this.results.summary.failed++;
                }
            }

        } catch (error) {
            this.log(`Hebrew translations test failed: ${error.message}`, 'error');
            this.results.summary.failed++;
        }
    }

    async testTabFunctionality(page) {
        try {
            this.results.summary.totalChecks += 2;

            // Test Monthly tab
            await page.click('[data-w-tab="Tab 1"]');
            await page.waitForTimeout(1000);
            
            const monthlyActive = await page.$eval('[data-w-tab="Tab 1"]', el => 
                el.classList.contains('w--current')
            );

            if (monthlyActive) {
                this.log('Monthly tab switching works in Hebrew mode', 'success');
                this.results.functionality.push({
                    test: 'Monthly Tab Switch',
                    status: 'PASS',
                    details: 'Tab switches and shows active state'
                });
                this.results.summary.passed++;
            } else {
                this.log('Monthly tab not showing active state', 'error');
                this.results.functionality.push({
                    test: 'Monthly Tab Switch',
                    status: 'FAIL',
                    details: 'Tab not active after click'
                });
                this.results.summary.failed++;
            }

            // Test Yearly tab
            await page.click('[data-w-tab="Tab 2"]');
            await page.waitForTimeout(1000);
            
            const yearlyActive = await page.$eval('[data-w-tab="Tab 2"]', el => 
                el.classList.contains('w--current')
            );

            if (yearlyActive) {
                this.log('Yearly tab switching works in Hebrew mode', 'success');
                this.results.functionality.push({
                    test: 'Yearly Tab Switch',
                    status: 'PASS',
                    details: 'Tab switches and shows active state'
                });
                this.results.summary.passed++;
            } else {
                this.log('Yearly tab not showing active state', 'error');
                this.results.functionality.push({
                    test: 'Yearly Tab Switch',
                    status: 'FAIL',
                    details: 'Tab not active after click'
                });
                this.results.summary.failed++;
            }

        } catch (error) {
            this.log(`Tab functionality test failed: ${error.message}`, 'error');
            this.results.summary.failed++;
        }
    }

    async testLanguageSwitchingBidirectional(page) {
        try {
            this.results.summary.totalChecks += 3;

            // Switch to English
            await page.click('[data-locale="en"]');
            await page.waitForTimeout(2000);
            
            const htmlDirEN = await page.$eval('html', el => el.getAttribute('dir'));
            if (htmlDirEN === 'ltr') {
                this.log('Switch back to English works (LTR applied)', 'success');
                this.results.functionality.push({
                    test: 'Switch to English',
                    status: 'PASS',
                    details: 'LTR layout applied correctly'
                });
                this.results.summary.passed++;
            } else {
                this.log('Switch back to English failed', 'error');
                this.results.summary.failed++;
            }

            // Switch to Russian
            await page.click('[data-locale="ru"]');
            await page.waitForTimeout(2000);
            
            const htmlDirRU = await page.$eval('html', el => el.getAttribute('dir'));
            if (htmlDirRU === 'ltr') {
                this.log('Switch to Russian works (LTR maintained)', 'success');
                this.results.functionality.push({
                    test: 'Switch to Russian',
                    status: 'PASS',
                    details: 'LTR layout maintained'
                });
                this.results.summary.passed++;
            } else {
                this.log('Switch to Russian failed', 'error');
                this.results.summary.failed++;
            }

            // Switch back to Hebrew
            await page.click('[data-locale="he"]');
            await page.waitForTimeout(2000);
            
            const htmlDirHE = await page.$eval('html', el => el.getAttribute('dir'));
            if (htmlDirHE === 'rtl') {
                this.log('Switch back to Hebrew works (RTL re-applied)', 'success');
                this.results.functionality.push({
                    test: 'Switch back to Hebrew',
                    status: 'PASS',
                    details: 'RTL layout re-applied correctly'
                });
                this.results.summary.passed++;
            } else {
                this.log('Switch back to Hebrew failed', 'error');
                this.results.summary.failed++;
            }

        } catch (error) {
            this.log(`Bidirectional language switching test failed: ${error.message}`, 'error');
            this.results.summary.failed++;
        }
    }

    async testPricingData(page) {
        try {
            this.results.summary.totalChecks += 2;

            // Check if pricing cards have Hebrew period text
            const monthlyPeriods = await page.$$eval('.pricing-plan-tab-pane[data-w-tab="Tab 1"] .pricing-pack-text', 
                elements => elements.map(el => el.textContent)
            );

            const hasHebrewMonthly = monthlyPeriods.some(text => /[\u0590-\u05FF]/.test(text));
            if (hasHebrewMonthly) {
                this.log('Hebrew text found in monthly pricing periods', 'success');
                this.results.performance.push({
                    test: 'Hebrew Monthly Periods',
                    status: 'PASS',
                    data: monthlyPeriods
                });
                this.results.summary.passed++;
            } else {
                this.log('No Hebrew text in monthly pricing periods', 'warning');
                this.results.performance.push({
                    test: 'Hebrew Monthly Periods',
                    status: 'WARNING',
                    data: monthlyPeriods
                });
                this.results.summary.warnings++;
            }

            // Switch to yearly and check
            await page.click('[data-w-tab="Tab 2"]');
            await page.waitForTimeout(1000);

            const yearlyPeriods = await page.$$eval('.pricing-plan-tab-pane[data-w-tab="Tab 2"] .pricing-pack-text', 
                elements => elements.map(el => el.textContent)
            );

            const hasHebrewYearly = yearlyPeriods.some(text => /[\u0590-\u05FF]/.test(text));
            if (hasHebrewYearly) {
                this.log('Hebrew text found in yearly pricing periods', 'success');
                this.results.performance.push({
                    test: 'Hebrew Yearly Periods',
                    status: 'PASS',
                    data: yearlyPeriods
                });
                this.results.summary.passed++;
            } else {
                this.log('No Hebrew text in yearly pricing periods', 'warning');
                this.results.performance.push({
                    test: 'Hebrew Yearly Periods',
                    status: 'WARNING',
                    data: yearlyPeriods
                });
                this.results.summary.warnings++;
            }

        } catch (error) {
            this.log(`Pricing data test failed: ${error.message}`, 'error');
            this.results.summary.failed++;
        }
    }

    async testNavigation(page) {
        try {
            this.results.summary.totalChecks += 1;

            // Check navigation items for Hebrew
            const navItems = await page.$$eval('.nav-link', elements => 
                elements.map(el => ({ text: el.textContent, href: el.href }))
            );

            const hasHebrewNav = navItems.some(item => /[\u0590-\u05FF]/.test(item.text));
            
            if (hasHebrewNav) {
                this.log('Hebrew text found in navigation items', 'success');
                this.results.functionality.push({
                    test: 'Navigation Hebrew',
                    status: 'PASS',
                    data: navItems
                });
                this.results.summary.passed++;
            } else {
                this.log('No Hebrew text in navigation items', 'warning');
                this.results.functionality.push({
                    test: 'Navigation Hebrew',
                    status: 'WARNING',
                    data: navItems
                });
                this.results.summary.warnings++;
            }

        } catch (error) {
            this.log(`Navigation test failed: ${error.message}`, 'error');
            this.results.summary.failed++;
        }
    }

    async testMobileHebrew(page) {
        try {
            this.results.summary.totalChecks += 2;

            // Switch to mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            await page.waitForTimeout(1000);

            // Check if mobile language pills exist and work
            const mobilePillsVisible = await page.isVisible('.mobile-lang-pills');
            
            if (mobilePillsVisible) {
                this.log('Mobile language pills are visible', 'success');
                
                // Test mobile Hebrew pill
                await page.click('.mobile-lang-pill[data-locale="he"]');
                await page.waitForTimeout(2000);
                
                const mobileHebrewActive = await page.$eval('.mobile-lang-pill[data-locale="he"]', el => 
                    el.classList.contains('active')
                );
                
                if (mobileHebrewActive) {
                    this.log('Mobile Hebrew language switching works', 'success');
                    this.results.functionality.push({
                        test: 'Mobile Hebrew Switch',
                        status: 'PASS',
                        details: 'Mobile Hebrew pill active'
                    });
                    this.results.summary.passed += 2;
                } else {
                    this.log('Mobile Hebrew language switching failed', 'error');
                    this.results.summary.failed++;
                }
            } else {
                this.log('Mobile language pills not visible', 'error');
                this.results.summary.failed++;
            }

            // Take mobile screenshot
            await page.screenshot({ 
                path: '/Users/michaelmishayev/Desktop/newCode/pricing-hebrew-mobile.png',
                fullPage: true 
            });

        } catch (error) {
            this.log(`Mobile Hebrew test failed: ${error.message}`, 'error');
            this.results.summary.failed++;
        }
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results.summary,
            successRate: this.results.summary.totalChecks > 0 ? 
                ((this.results.summary.passed / this.results.summary.totalChecks) * 100).toFixed(1) + '%' : '0%',
            details: {
                translations: this.results.translations,
                rtl: this.results.rtl,
                functionality: this.results.functionality,
                performance: this.results.performance
            }
        };

        const reportPath = '/Users/michaelmishayev/Desktop/newCode/pricing-hebrew-test-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        this.log('📊 Test Summary:', 'info');
        this.log(`   Total Checks: ${report.summary.totalChecks}`, 'info');
        this.log(`   Passed: ${report.summary.passed}`, 'success');
        this.log(`   Failed: ${report.summary.failed}`, 'error');
        this.log(`   Warnings: ${report.summary.warnings}`, 'warning');
        this.log(`   Success Rate: ${report.successRate}`, 'info');
        this.log(`📄 Full report saved to: ${reportPath}`, 'info');

        // Print key findings
        this.log('🔍 Key Findings:', 'info');
        
        const hebrewTranslations = this.results.translations.filter(t => t.hasHebrew);
        this.log(`   Hebrew translations working: ${hebrewTranslations.length}/${this.results.translations.length}`, 'info');
        
        const rtlWorking = this.results.rtl.filter(r => r.status === 'PASS');
        this.log(`   RTL functionality working: ${rtlWorking.length}/${this.results.rtl.length}`, 'info');
        
        const functionalityWorking = this.results.functionality.filter(f => f.status === 'PASS');
        this.log(`   Core functionality working: ${functionalityWorking.length}/${this.results.functionality.length}`, 'info');
    }
}

// Run the tests
async function runPricingHebrewTests() {
    const tester = new PricingHebrewTester();
    await tester.runTests();
}

// Execute if called directly
if (require.main === module) {
    runPricingHebrewTests().catch(error => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = { PricingHebrewTester };
