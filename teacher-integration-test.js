/**
 * Comprehensive Teacher Integration Test
 * Tests teacher card display, navigation, and details component
 */

const puppeteer = require('puppeteer');

class TeacherIntegrationTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = {
            passed: [],
            failed: [],
            warnings: []
        };
    }

    async init() {
        this.browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: null
        });
        this.page = await this.browser.newPage();
        
        // Listen for console messages
        this.page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Error') || text.includes('❌')) {
                console.log('🔍 Console Error:', text);
            }
        });
    }

    async test() {
        console.log('🎯 Starting Teacher Integration Test...\n');
        
        await this.init();
        
        try {
            await this.testTeachersPageLoad();
            await this.testTeacherCardsDisplay();
            await this.testTeacherCardNavigation();
            await this.testTeacherDetailsPage();
            await this.testLanguageSwitching();
            await this.testErrorHandling();
            
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Test failed:', error);
            this.results.failed.push('Overall test execution failed: ' + error.message);
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }

    async testTeachersPageLoad() {
        console.log('📄 Testing Teachers Page Load...');
        
        try {
            await this.page.goto('http://localhost:3005/teachers.html', {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // Check if page loads
            const title = await this.page.title();
            if (title.includes('Teachers')) {
                this.results.passed.push('✅ Teachers page loads successfully');
            } else {
                this.results.failed.push('❌ Teachers page title incorrect');
            }

            // Check for loading state
            const loadingState = await this.page.$('.teachers-loading-state');
            if (loadingState) {
                this.results.warnings.push('⚠️ Loading state still visible');
            }

        } catch (error) {
            this.results.failed.push('❌ Teachers page load failed: ' + error.message);
        }
    }

    async testTeacherCardsDisplay() {
        console.log('🃏 Testing Teacher Cards Display...');
        
        try {
            // Wait for cards to load
            await this.page.waitForSelector('.shared-teacher-card, .teacher-card', {
                timeout: 15000
            });

            const cards = await this.page.$$('.shared-teacher-card, .teacher-card');
            
            if (cards.length > 0) {
                this.results.passed.push('✅ ' + cards.length + ' teacher cards displayed');
                
                // Check card content
                for (let i = 0; i < Math.min(3, cards.length); i++) {
                    const card = cards[i];
                    
                    const name = await card.$('.teacher-name');
                    const title = await card.$('.teacher-title, .teacher-expertise');
                    const bio = await card.$('.teacher-bio');
                    const photo = await card.$('.teacher-photo, .teacher-image');

                    if (name && title && bio && photo) {
                        this.results.passed.push('✅ Card ' + (i+1) + ' has all required elements');
                    } else {
                        const missing = [];
                        if (!name) missing.push('name');
                        if (!title) missing.push('title'); 
                        if (!bio) missing.push('bio');
                        if (!photo) missing.push('photo');
                        this.results.failed.push('❌ Card ' + (i+1) + ' missing: ' + missing.join(', '));
                    }
                }
                
            } else {
                this.results.failed.push('❌ No teacher cards found');
            }

        } catch (error) {
            this.results.failed.push('❌ Teacher cards test failed: ' + error.message);
        }
    }

    async testTeacherCardNavigation() {
        console.log('🔗 Testing Teacher Card Navigation...');
        
        try {
            const cards = await this.page.$$('.shared-teacher-card, .teacher-card');
            
            if (cards.length > 0) {
                const firstCard = cards[0];
                
                // Get teacher ID from card
                const teacherId = await firstCard.evaluate(el => {
                    return el.dataset.teacherId || el.getAttribute('data-teacher-id');
                });

                if (teacherId) {
                    this.results.passed.push('✅ Teacher card has ID: ' + teacherId);
                } else {
                    this.results.failed.push('❌ Teacher card missing data-teacher-id');
                }

                // Test click navigation
                const navigationPromise = this.page.waitForNavigation({
                    waitUntil: 'networkidle0',
                    timeout: 10000
                });

                await firstCard.click();
                await navigationPromise;

                const currentUrl = this.page.url();
                
                if (currentUrl.includes('teacher-details.html') && currentUrl.includes('id=')) {
                    this.results.passed.push('✅ Teacher card navigation works');
                    
                    // Extract parameters from URL
                    const urlParams = new URL(currentUrl).searchParams;
                    const idParam = urlParams.get('id');
                    const localeParam = urlParams.get('locale');
                    
                    if (idParam) {
                        this.results.passed.push('✅ Teacher ID parameter passed: ' + idParam);
                    } else {
                        this.results.failed.push('❌ Teacher ID parameter missing');
                    }

                    if (localeParam) {
                        this.results.passed.push('✅ Locale parameter passed: ' + localeParam);
                    } else {
                        this.results.warnings.push('⚠️ Locale parameter missing (may default to en)');
                    }

                } else {
                    this.results.failed.push('❌ Teacher card navigation failed. URL: ' + currentUrl);
                }

            } else {
                this.results.failed.push('❌ No teacher cards found for navigation test');
            }

        } catch (error) {
            this.results.failed.push('❌ Teacher card navigation test failed: ' + error.message);
        }
    }

    async testTeacherDetailsPage() {
        console.log('📋 Testing Teacher Details Page...');
        
        try {
            // Should already be on teacher-details.html from previous test
            const currentUrl = this.page.url();
            
            if (!currentUrl.includes('teacher-details.html')) {
                // Navigate manually if needed
                await this.page.goto('http://localhost:3005/teacher-details.html?id=1&locale=en', {
                    waitUntil: 'networkidle0'
                });
            }

            // Wait for component to load
            await this.page.waitForSelector('#teacher-details-content', {
                timeout: 15000
            });

            // Check if details content loads
            const detailsContent = await this.page.$('#teacher-details-content');
            const loadingState = await this.page.$('#loading-state');
            const errorState = await this.page.$('#error-state');

            if (detailsContent) {
                const isVisible = await detailsContent.evaluate(el => 
                    getComputedStyle(el).display !== 'none'
                );
                
                if (isVisible) {
                    this.results.passed.push('✅ Teacher details content loads and displays');
                } else {
                    this.results.failed.push('❌ Teacher details content hidden');
                }
            }

            if (loadingState) {
                const isLoadingVisible = await loadingState.evaluate(el => 
                    getComputedStyle(el).display !== 'none'
                );
                
                if (!isLoadingVisible) {
                    this.results.passed.push('✅ Loading state properly hidden');
                } else {
                    this.results.warnings.push('⚠️ Loading state still visible');
                }
            }

            if (errorState) {
                const isErrorVisible = await errorState.evaluate(el => 
                    getComputedStyle(el).display !== 'none'
                );
                
                if (!isErrorVisible) {
                    this.results.passed.push('✅ No error state displayed');
                } else {
                    this.results.failed.push('❌ Error state is visible');
                }
            }

            // Check for component initialization
            const componentLoaded = await this.page.evaluate(() => {
                return window.UniversalDetailsComponent !== undefined;
            });

            if (componentLoaded) {
                this.results.passed.push('✅ TeachersDetailsComponent loaded');
            } else {
                this.results.failed.push('❌ TeachersDetailsComponent not loaded');
            }

        } catch (error) {
            this.results.failed.push('❌ Teacher details page test failed: ' + error.message);
        }
    }

    async testLanguageSwitching() {
        console.log('🌐 Testing Language Switching...');
        
        try {
            // Go back to teachers page
            await this.page.goto('http://localhost:3005/teachers.html', {
                waitUntil: 'networkidle0'
            });

            // Wait for cards to load
            await this.page.waitForSelector('.shared-teacher-card, .teacher-card', {
                timeout: 10000
            });

            // Check for language pills
            const langPills = await this.page.$$('.lang-pill, .mobile-lang-pill');
            
            if (langPills.length > 0) {
                this.results.passed.push('✅ ' + langPills.length + ' language switchers found');
                
                // Test language switching
                const ruPill = await this.page.$('[data-locale="ru"]');
                if (ruPill) {
                    await ruPill.click();
                    
                    // Wait for language change
                    await this.page.waitForTimeout(2000);
                    
                    // Check if language manager is working
                    const langManager = await this.page.evaluate(() => {
                        return window.UnifiedLanguageManager && window.UnifiedLanguageManager.currentLocale;
                    });

                    if (langManager === 'ru') {
                        this.results.passed.push('✅ Language switching to Russian works');
                    } else {
                        this.results.warnings.push('⚠️ Language manager may not be properly updating locale');
                    }
                }

            } else {
                this.results.failed.push('❌ No language switchers found');
            }

        } catch (error) {
            this.results.failed.push('❌ Language switching test failed: ' + error.message);
        }
    }

    async testErrorHandling() {
        console.log('🚨 Testing Error Handling...');
        
        try {
            // Test invalid teacher ID
            await this.page.goto('http://localhost:3005/teacher-details.html?id=99999&locale=en', {
                waitUntil: 'networkidle0'
            });

            await this.page.waitForTimeout(5000);

            const errorState = await this.page.$('#error-state');
            if (errorState) {
                const isErrorVisible = await errorState.evaluate(el => 
                    getComputedStyle(el).display !== 'none'
                );
                
                if (isErrorVisible) {
                    this.results.passed.push('✅ Error handling works for invalid teacher ID');
                } else {
                    this.results.failed.push('❌ Error state not shown for invalid teacher ID');
                }
            }

            // Test missing teacher ID
            await this.page.goto('http://localhost:3005/teacher-details.html', {
                waitUntil: 'networkidle0'
            });

            await this.page.waitForTimeout(3000);

            const errorStateNoId = await this.page.$('#error-state');
            if (errorStateNoId) {
                const isErrorVisible = await errorStateNoId.evaluate(el => 
                    getComputedStyle(el).display !== 'none'
                );
                
                if (isErrorVisible) {
                    this.results.passed.push('✅ Error handling works for missing teacher ID');
                } else {
                    this.results.failed.push('❌ Error state not shown for missing teacher ID');
                }
            }

        } catch (error) {
            this.results.failed.push('❌ Error handling test failed: ' + error.message);
        }
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEACHER INTEGRATION TEST REPORT');
        console.log('='.repeat(60));
        
        console.log('\n🟢 PASSED TESTS:');
        this.results.passed.forEach(test => console.log('  ' + test));
        
        if (this.results.warnings.length > 0) {
            console.log('\n🟡 WARNINGS:');
            this.results.warnings.forEach(warning => console.log('  ' + warning));
        }
        
        if (this.results.failed.length > 0) {
            console.log('\n🔴 FAILED TESTS:');
            this.results.failed.forEach(failure => console.log('  ' + failure));
        }
        
        const total = this.results.passed.length + this.results.failed.length;
        const passRate = total > 0 ? ((this.results.passed.length / total) * 100).toFixed(1) : 0;
        
        console.log('\n' + '='.repeat(60));
        console.log('📈 SUMMARY: ' + this.results.passed.length + '/' + total + ' tests passed (' + passRate + '%)');
        console.log('⚠️  ' + this.results.warnings.length + ' warnings');
        
        if (this.results.failed.length === 0) {
            console.log('🎉 ALL CORE TESTS PASSED!');
        } else {
            console.log('❌ ' + this.results.failed.length + ' tests failed - requires attention');
        }
        console.log('='.repeat(60) + '\n');
    }
}

// Run the test
const tester = new TeacherIntegrationTester();
tester.test().catch(console.error);
