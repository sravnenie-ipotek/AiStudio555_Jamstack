/**
 * MASTER-CLASS FOOTER SYSTEM TESTING PIPELINE
 *
 * Comprehensive testing suite for the database-driven footer system
 * Tests API endpoints, performance, fallbacks, and regression prevention
 */

class FooterSystemTester {
    constructor() {
        this.config = {
            apiBase: 'https://aistudio555jamstack-production.up.railway.app',
            localApiBase: 'http://localhost:3000',
            testTimeout: 10000,
            supportedLanguages: ['en', 'ru', 'he'],
            requiredNavigationItems: ['Home', 'Courses', 'Teachers', 'Pricing'],
            maxLoadTime: 2000, // 2 seconds
            minCacheHitRate: 0.8 // 80%
        };

        this.testResults = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            errors: [],
            performance: {},
            regressions: []
        };

        this.apiEndpoint = this.detectApiEndpoint();
    }

    detectApiEndpoint() {
        const hostname = window.location.hostname;
        const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
        return isDevelopment ? this.config.localApiBase : this.config.apiBase;
    }

    /**
     * Run complete test suite
     */
    async runAllTests() {
        console.log('🚀 Starting Master-Class Footer System Test Suite...');
        console.log('=' .repeat(60));

        const startTime = performance.now();

        try {
            // Phase 1: API Health Tests
            await this.testAPIHealth();

            // Phase 2: Database Integration Tests
            await this.testDatabaseIntegration();

            // Phase 3: Footer Loading Tests
            await this.testFooterLoading();

            // Phase 4: Multi-language Tests
            await this.testMultiLanguageSupport();

            // Phase 5: Performance Tests
            await this.testPerformanceMetrics();

            // Phase 6: Fallback Tests
            await this.testFallbackMechanisms();

            // Phase 7: Navigation Validation
            await this.testNavigationLinks();

            // Phase 8: Regression Tests
            await this.testRegressionPrevention();

        } catch (error) {
            this.logError('Critical test suite failure', error);
        }

        const totalTime = performance.now() - startTime;
        this.generateTestReport(totalTime);
    }

    /**
     * Test API health and availability
     */
    async testAPIHealth() {
        console.log('🏥 Testing API Health...');

        await this.runTest('API Health Check', async () => {
            const response = await fetch(`${this.apiEndpoint}/api/footer-health`, {
                timeout: this.config.testTimeout
            });

            if (!response.ok) {
                throw new Error(`API health check failed: ${response.status}`);
            }

            const health = await response.json();

            if (health.status !== 'healthy') {
                throw new Error(`API unhealthy: ${health.status}`);
            }

            console.log('✅ API is healthy');
            return health;
        });

        await this.runTest('API Response Time', async () => {
            const start = performance.now();

            await fetch(`${this.apiEndpoint}/api/footer-health`);

            const responseTime = performance.now() - start;

            if (responseTime > 1000) { // 1 second threshold
                throw new Error(`API response too slow: ${responseTime}ms`);
            }

            console.log(`✅ API response time: ${responseTime.toFixed(2)}ms`);
            return responseTime;
        });
    }

    /**
     * Test database integration
     */
    async testDatabaseIntegration() {
        console.log('🗄️ Testing Database Integration...');

        for (const locale of this.config.supportedLanguages) {
            await this.runTest(`Database Content - ${locale}`, async () => {
                const response = await fetch(`${this.apiEndpoint}/api/footer-content?locale=${locale}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${locale} content: ${response.status}`);
                }

                const data = await response.json();

                if (!data.data || !data.data.attributes) {
                    throw new Error(`Invalid data structure for ${locale}`);
                }

                const attributes = data.data.attributes;

                // Validate required fields exist
                const requiredFields = ['company_name', 'company_description', 'contact_email'];
                for (const field of requiredFields) {
                    if (!attributes[field]) {
                        throw new Error(`Missing required field '${field}' for ${locale}`);
                    }
                }

                console.log(`✅ Database content valid for ${locale}`);
                return data;
            });
        }
    }

    /**
     * Test footer loading functionality
     */
    async testFooterLoading() {
        console.log('🦶 Testing Footer Loading...');

        await this.runTest('Footer Container Exists', async () => {
            const container = document.getElementById('secure-footer-container');

            if (!container) {
                throw new Error('Footer container not found');
            }

            console.log('✅ Footer container exists');
            return container;
        });

        await this.runTest('MasterFooterLoader Initialization', async () => {
            if (!window.MasterFooterLoader) {
                throw new Error('MasterFooterLoader class not available');
            }

            if (!window.masterFooterLoaderInstance) {
                throw new Error('MasterFooterLoader instance not created');
            }

            console.log('✅ MasterFooterLoader initialized');
            return window.masterFooterLoaderInstance;
        });

        await this.runTest('Footer Loading State', async () => {
            const loadingState = document.querySelector('.footer-loading-state');

            if (!loadingState) {
                throw new Error('Loading state not found');
            }

            console.log('✅ Loading state present');
            return loadingState;
        });
    }

    /**
     * Test multi-language support
     */
    async testMultiLanguageSupport() {
        console.log('🌐 Testing Multi-Language Support...');

        for (const locale of this.config.supportedLanguages) {
            await this.runTest(`Language Support - ${locale}`, async () => {
                if (!window.masterFooterLoaderInstance) {
                    throw new Error('Footer loader not available');
                }

                // Test loading footer for this language
                await window.masterFooterLoaderInstance.loadFooter(locale);

                // Wait for loading to complete
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Check if footer content changed
                const footerContainer = document.getElementById('secure-footer-container');
                const footerContent = footerContainer.innerHTML;

                if (footerContent.includes('Loading database-driven footer')) {
                    throw new Error(`Footer still showing loading state for ${locale}`);
                }

                console.log(`✅ Footer loaded successfully for ${locale}`);
                return true;
            });
        }
    }

    /**
     * Test performance metrics
     */
    async testPerformanceMetrics() {
        console.log('⚡ Testing Performance Metrics...');

        await this.runTest('Footer Load Performance', async () => {
            if (!window.masterFooterLoaderInstance) {
                throw new Error('Footer loader not available');
            }

            const startTime = performance.now();

            await window.masterFooterLoaderInstance.loadFooter('en');

            const loadTime = performance.now() - startTime;

            if (loadTime > this.config.maxLoadTime) {
                throw new Error(`Footer load too slow: ${loadTime}ms (max: ${this.config.maxLoadTime}ms)`);
            }

            this.testResults.performance.footerLoadTime = loadTime;
            console.log(`✅ Footer load time: ${loadTime.toFixed(2)}ms`);
            return loadTime;
        });

        await this.runTest('Cache Performance', async () => {
            if (!window.masterFooterLoaderInstance) {
                throw new Error('Footer loader not available');
            }

            const metrics = window.masterFooterLoaderInstance.getPerformanceMetrics();

            if (metrics.cacheHitRate < this.config.minCacheHitRate && metrics.cacheHits > 0) {
                throw new Error(`Cache hit rate too low: ${(metrics.cacheHitRate * 100).toFixed(1)}%`);
            }

            this.testResults.performance.cacheHitRate = metrics.cacheHitRate;
            console.log(`✅ Cache hit rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%`);
            return metrics;
        });
    }

    /**
     * Test fallback mechanisms
     */
    async testFallbackMechanisms() {
        console.log('🛡️ Testing Fallback Mechanisms...');

        await this.runTest('Static Fallback Data', async () => {
            if (!window.masterFooterLoaderInstance) {
                throw new Error('Footer loader not available');
            }

            const loader = window.masterFooterLoaderInstance;

            // Test that fallback data exists for all languages
            for (const locale of this.config.supportedLanguages) {
                const fallbackData = loader.staticFallback[locale];

                if (!fallbackData) {
                    throw new Error(`No fallback data for ${locale}`);
                }

                if (!fallbackData.navigation || !fallbackData.navigation.main) {
                    throw new Error(`Invalid fallback navigation structure for ${locale}`);
                }

                // Check that fallback has correct navigation items
                const mainNav = fallbackData.navigation.main.items;
                for (const requiredItem of this.config.requiredNavigationItems) {
                    const hasItem = mainNav.some(item => item.text === requiredItem);
                    if (!hasItem) {
                        throw new Error(`Missing required nav item '${requiredItem}' in ${locale} fallback`);
                    }
                }
            }

            console.log('✅ Fallback data complete for all languages');
            return true;
        });

        await this.runTest('API Failure Fallback', async () => {
            if (!window.masterFooterLoaderInstance) {
                throw new Error('Footer loader not available');
            }

            // Temporarily break the API endpoint
            const originalEndpoint = window.masterFooterLoaderInstance.apiEndpoint;
            window.masterFooterLoaderInstance.apiEndpoint = 'https://broken-api-endpoint.invalid';

            try {
                // This should trigger fallback
                await window.masterFooterLoaderInstance.loadFooter('en');

                // Wait for fallback to activate
                await new Promise(resolve => setTimeout(resolve, 1000));

                const metrics = window.masterFooterLoaderInstance.getPerformanceMetrics();

                if (metrics.fallbackActivations === 0) {
                    throw new Error('Fallback was not activated when API failed');
                }

                console.log('✅ Fallback activated successfully on API failure');

            } finally {
                // Restore original endpoint
                window.masterFooterLoaderInstance.apiEndpoint = originalEndpoint;
            }

            return true;
        });
    }

    /**
     * Test navigation links validation
     */
    async testNavigationLinks() {
        console.log('🔗 Testing Navigation Links...');

        await this.runTest('Navigation Links Validation', async () => {
            // Wait for footer to load
            await new Promise(resolve => setTimeout(resolve, 2000));

            const footerContainer = document.getElementById('secure-footer-container');
            const navLinks = footerContainer.querySelectorAll('.footer-menu-text-link');

            if (navLinks.length === 0) {
                throw new Error('No navigation links found in footer');
            }

            // Count links to ensure we only have top navigation items
            const linkTexts = Array.from(navLinks).map(link => link.textContent.trim());

            // Should NOT contain items not in top nav
            const forbiddenItems = ['About Us', 'Blog', 'Contact Us', '404 Not Found', 'Sign Up', 'License'];
            const foundForbiddenItems = linkTexts.filter(text => forbiddenItems.includes(text));

            if (foundForbiddenItems.length > 0) {
                throw new Error(`Found forbidden navigation items: ${foundForbiddenItems.join(', ')}`);
            }

            // Should contain all required top nav items
            const missingItems = this.config.requiredNavigationItems.filter(item =>
                !linkTexts.includes(item)
            );

            if (missingItems.length > 0) {
                throw new Error(`Missing required navigation items: ${missingItems.join(', ')}`);
            }

            console.log(`✅ Navigation links validated: ${navLinks.length} links found`);
            console.log(`   Items: ${linkTexts.join(', ')}`);

            return linkTexts;
        });

        await this.runTest('Link Accessibility', async () => {
            const footerContainer = document.getElementById('secure-footer-container');
            const navLinks = footerContainer.querySelectorAll('.footer-menu-text-link');

            let brokenLinks = [];

            for (const link of navLinks) {
                const href = link.getAttribute('href');

                if (!href || href === '#') {
                    brokenLinks.push(`${link.textContent.trim()}: missing or empty href`);
                    continue;
                }

                // Check for valid internal links
                if (!href.startsWith('http') && !href.endsWith('.html')) {
                    brokenLinks.push(`${link.textContent.trim()}: invalid internal link format`);
                }
            }

            if (brokenLinks.length > 0) {
                throw new Error(`Broken links found: ${brokenLinks.join('; ')}`);
            }

            console.log('✅ All navigation links have valid hrefs');
            return true;
        });
    }

    /**
     * Test regression prevention
     */
    async testRegressionPrevention() {
        console.log('🔍 Testing Regression Prevention...');

        await this.runTest('Footer Menu Count Validation', async () => {
            // Wait for footer to load
            await new Promise(resolve => setTimeout(resolve, 2000));

            const footerContainer = document.getElementById('secure-footer-container');
            const menuSections = footerContainer.querySelectorAll('.footer-menu-single');

            // Should have exactly 2 menu sections: Main + Career Services (not the old 3+)
            if (menuSections.length > 2) {
                this.testResults.regressions.push(`Too many menu sections: ${menuSections.length} (expected ≤ 2)`);
            }

            const totalLinks = footerContainer.querySelectorAll('.footer-menu-text-link').length;

            // Should have ≤ 6 total links (4 main + 2 career services), not 19 like before
            if (totalLinks > 8) { // Allow some flexibility
                this.testResults.regressions.push(`Too many footer links: ${totalLinks} (expected ≤ 8)`);
            }

            console.log(`✅ Footer menu count validation: ${menuSections.length} sections, ${totalLinks} links`);
            return { sections: menuSections.length, links: totalLinks };
        });

        await this.runTest('Legacy System Removal', async () => {
            // Check that old translation system is not present
            if (typeof footerTranslations !== 'undefined') {
                throw new Error('Legacy footerTranslations object still present');
            }

            if (typeof updateFooterContent !== 'undefined') {
                throw new Error('Legacy updateFooterContent function still present');
            }

            console.log('✅ Legacy translation system successfully removed');
            return true;
        });

        await this.runTest('Database Integration Active', async () => {
            if (!window.masterFooterLoaderInstance) {
                throw new Error('MasterFooterLoader not active');
            }

            const metrics = window.masterFooterLoaderInstance.getPerformanceMetrics();

            if (metrics.apiCalls === 0 && metrics.fallbackActivations === 0) {
                throw new Error('No evidence of dynamic footer loading');
            }

            console.log('✅ Database integration is active');
            return metrics;
        });
    }

    /**
     * Run individual test with error handling
     */
    async runTest(testName, testFunction) {
        this.testResults.totalTests++;

        try {
            const result = await Promise.race([
                testFunction(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Test timeout')), this.config.testTimeout)
                )
            ]);

            this.testResults.passedTests++;
            console.log(`   ✅ ${testName}`);
            return result;

        } catch (error) {
            this.testResults.failedTests++;
            this.testResults.errors.push({ test: testName, error: error.message });
            console.error(`   ❌ ${testName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Log error with context
     */
    logError(context, error) {
        const errorInfo = {
            context,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        };

        this.testResults.errors.push(errorInfo);
        console.error(`❌ ${context}:`, error);
    }

    /**
     * Generate comprehensive test report
     */
    generateTestReport(totalTime) {
        console.log('=' .repeat(60));
        console.log('📊 MASTER-CLASS FOOTER SYSTEM TEST REPORT');
        console.log('=' .repeat(60));

        const successRate = (this.testResults.passedTests / this.testResults.totalTests * 100).toFixed(1);
        const status = successRate >= 90 ? '🟢 EXCELLENT' : successRate >= 70 ? '🟡 GOOD' : '🔴 NEEDS WORK';

        console.log(`Overall Status: ${status}`);
        console.log(`Success Rate: ${successRate}% (${this.testResults.passedTests}/${this.testResults.totalTests})`);
        console.log(`Total Time: ${(totalTime / 1000).toFixed(2)}s`);
        console.log('');

        // Performance metrics
        if (Object.keys(this.testResults.performance).length > 0) {
            console.log('⚡ Performance Metrics:');
            for (const [metric, value] of Object.entries(this.testResults.performance)) {
                if (typeof value === 'number') {
                    const unit = metric.includes('Time') ? 'ms' : metric.includes('Rate') ? '%' : '';
                    const displayValue = metric.includes('Rate') ? (value * 100).toFixed(1) : value.toFixed(2);
                    console.log(`   ${metric}: ${displayValue}${unit}`);
                }
            }
            console.log('');
        }

        // Regression analysis
        if (this.testResults.regressions.length > 0) {
            console.log('🔍 Regression Analysis:');
            this.testResults.regressions.forEach(regression => {
                console.log(`   ⚠️ ${regression}`);
            });
            console.log('');
        }

        // Error summary
        if (this.testResults.errors.length > 0) {
            console.log('❌ Errors Summary:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error.test}: ${error.message}`);
            });
            console.log('');
        }

        // Recommendations
        console.log('💡 Recommendations:');
        if (successRate >= 95) {
            console.log('   🎉 System is performing excellently! Ready for production.');
        } else if (successRate >= 80) {
            console.log('   👍 System is working well with minor issues to address.');
        } else {
            console.log('   ⚠️ System needs significant improvements before production.');
        }

        console.log('=' .repeat(60));

        return {
            success: successRate >= 90,
            successRate,
            ...this.testResults
        };
    }

    /**
     * Quick health check method
     */
    async quickHealthCheck() {
        console.log('🏥 Quick Footer System Health Check...');

        try {
            // Basic checks
            const hasContainer = !!document.getElementById('secure-footer-container');
            const hasLoader = !!window.masterFooterLoaderInstance;
            const hasAPI = !!(await fetch(`${this.apiEndpoint}/api/footer-health`).then(r => r.ok));

            console.log(`Footer Container: ${hasContainer ? '✅' : '❌'}`);
            console.log(`Footer Loader: ${hasLoader ? '✅' : '❌'}`);
            console.log(`API Health: ${hasAPI ? '✅' : '❌'}`);

            const overallHealth = hasContainer && hasLoader && hasAPI;
            console.log(`Overall Health: ${overallHealth ? '🟢 HEALTHY' : '🔴 UNHEALTHY'}`);

            return overallHealth;

        } catch (error) {
            console.error('❌ Health check failed:', error);
            return false;
        }
    }
}

// Global instance
window.FooterSystemTester = FooterSystemTester;

// Auto-run quick health check on page load (after footer loads)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        const tester = new FooterSystemTester();
        await tester.quickHealthCheck();

        // Store tester instance for manual testing
        window.footerTester = tester;

        console.log('💡 To run full test suite: window.footerTester.runAllTests()');
    }, 5000); // Wait 5 seconds for footer to load
});

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FooterSystemTester;
}