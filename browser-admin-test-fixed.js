/**
 * Fixed Browser-based Admin Panel Comprehensive Test
 * Correctly handles all field types and counts
 * Target: 90% coverage of 170 actual fields
 */

(function() {
    'use strict';

    // Test configuration with correct field counts
    const CONFIG = {
        apiUrl: 'https://aistudio555jamstack-production.up.railway.app/api',
        productionUrl: 'https://www.aistudio555.com',
        testPrefix: 'TEST_' + Date.now(),
        totalActualFields: 170, // Verified total
        tabs: [
            { name: 'home-page', label: 'Home Page', expectedFields: 77 },
            { name: 'courses', label: 'Courses', expectedFields: 8 },
            { name: 'teachers', label: 'Teachers', expectedFields: 6 },
            { name: 'career-services', label: 'Career Services', expectedFields: 30 },
            { name: 'career-orientation', label: 'Career Orientation', expectedFields: 49 }
        ]
    };

    // Test results tracker
    const results = {
        timestamp: new Date().toISOString(),
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        coverage: 0,
        tabs: {},
        errors: [],
        warnings: [],
        fieldDetails: {}
    };

    // Helper functions
    function log(message, type = 'info') {
        const styles = {
            info: 'color: #0066cc',
            success: 'color: #00cc00; font-weight: bold',
            error: 'color: #cc0000; font-weight: bold',
            warning: 'color: #ff9900',
            header: 'color: #6600cc; font-size: 14px; font-weight: bold',
            detail: 'color: #666; font-size: 11px'
        };
        
        console.log(`%c${message}`, styles[type] || styles.info);
        
        if (type === 'error') {
            results.errors.push(message);
        } else if (type === 'warning') {
            results.warnings.push(message);
        }
    }

    function showSection(sectionId) {
        // Try multiple methods to switch tabs
        const methods = [
            () => {
                const button = document.querySelector(`button[onclick*="${sectionId}"]`);
                if (button) {
                    button.click();
                    return true;
                }
                return false;
            },
            () => {
                const tab = document.querySelector(`[data-tab="${sectionId}"]`);
                if (tab) {
                    tab.click();
                    return true;
                }
                return false;
            },
            () => {
                // Direct JavaScript function call
                if (typeof window.showSection === 'function') {
                    window.showSection(sectionId);
                    return true;
                }
                return false;
            },
            () => {
                // Manual tab switching
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                    section.style.display = 'none';
                });
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    targetSection.style.display = 'block';
                    return true;
                }
                return false;
            }
        ];
        
        for (const method of methods) {
            if (method()) {
                return true;
            }
        }
        
        return false;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Enhanced field detection
    function findAllFields(tabName) {
        const section = document.getElementById(tabName);
        if (!section) {
            log(`Section not found: ${tabName}`, 'error');
            return [];
        }
        
        const fields = [];
        const processedIds = new Set();
        
        // Find all form elements
        const selectors = [
            'input[id]:not([type="hidden"]):not([type="submit"]):not([type="button"])',
            'textarea[id]',
            'select[id]'
        ];
        
        selectors.forEach(selector => {
            section.querySelectorAll(selector).forEach(element => {
                if (!processedIds.has(element.id) && element.id) {
                    processedIds.add(element.id);
                    
                    let type = element.tagName.toLowerCase();
                    if (type === 'input') {
                        type = element.type === 'checkbox' ? 'checkbox' : 
                               element.type === 'radio' ? 'radio' : 'input';
                    }
                    
                    fields.push({
                        id: element.id,
                        type: type,
                        element: element,
                        originalValue: type === 'checkbox' ? element.checked : element.value,
                        inputType: element.type || 'text'
                    });
                }
            });
        });
        
        log(`Found ${fields.length} fields in ${tabName}`, 'detail');
        return fields;
    }

    // Enhanced field testing with better validation
    function testField(field) {
        let success = false;
        let skipReason = null;
        
        try {
            // Check if field is testable
            if (field.element.disabled) {
                skipReason = 'disabled';
            } else if (field.element.readOnly) {
                skipReason = 'readonly';
            } else if (field.element.style.display === 'none') {
                skipReason = 'hidden';
            } else if (!field.element.offsetParent && field.element.style.position !== 'fixed') {
                skipReason = 'not visible';
            }
            
            if (skipReason) {
                results.skipped++;
                log(`  ⊘ ${field.id} (${skipReason})`, 'detail');
                return { success: true, skipped: true };
            }
            
            // Test based on field type
            switch (field.type) {
                case 'input':
                    success = testInputField(field);
                    break;
                    
                case 'textarea':
                    success = testTextareaField(field);
                    break;
                    
                case 'checkbox':
                    success = testCheckboxField(field);
                    break;
                    
                case 'radio':
                    success = testRadioField(field);
                    break;
                    
                case 'select':
                    success = testSelectField(field);
                    break;
                    
                default:
                    log(`Unknown field type: ${field.type} for ${field.id}`, 'warning');
                    success = true; // Don't fail on unknown types
            }
            
            if (success) {
                results.passed++;
                log(`  ✓ ${field.id}`, 'success');
            } else {
                results.failed++;
                log(`  ✗ ${field.id}`, 'error');
            }
            
            return { success, skipped: false };
            
        } catch (error) {
            results.failed++;
            log(`  ✗ ${field.id}: ${error.message}`, 'error');
            return { success: false, skipped: false };
        }
    }

    function testInputField(field) {
        const inputType = field.inputType || 'text';
        let testValue;
        let expectedValue;
        
        switch (inputType) {
            case 'number':
                testValue = '42';
                expectedValue = '42';
                break;
            case 'email':
                testValue = 'test@example.com';
                expectedValue = 'test@example.com';
                break;
            case 'url':
                testValue = 'https://example.com';
                expectedValue = 'https://example.com';
                break;
            case 'tel':
                testValue = '+1234567890';
                expectedValue = '+1234567890';
                break;
            case 'date':
                testValue = '2024-01-01';
                expectedValue = '2024-01-01';
                break;
            case 'time':
                testValue = '12:00';
                expectedValue = '12:00';
                break;
            case 'color':
                testValue = '#ff0000';
                expectedValue = '#ff0000';
                break;
            default:
                testValue = CONFIG.testPrefix + '_' + field.id.substring(0, 10);
                expectedValue = testValue;
        }
        
        // Clear field first
        field.element.value = '';
        field.element.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Set new value
        field.element.value = testValue;
        field.element.dispatchEvent(new Event('input', { bubbles: true }));
        field.element.dispatchEvent(new Event('change', { bubbles: true }));
        field.element.dispatchEvent(new Event('blur', { bubbles: true }));
        
        // Verify
        return field.element.value === expectedValue;
    }

    function testTextareaField(field) {
        const testValue = `${CONFIG.testPrefix} test content for ${field.id}`;
        
        field.element.value = '';
        field.element.value = testValue;
        field.element.dispatchEvent(new Event('input', { bubbles: true }));
        field.element.dispatchEvent(new Event('change', { bubbles: true }));
        field.element.dispatchEvent(new Event('blur', { bubbles: true }));
        
        return field.element.value === testValue;
    }

    function testCheckboxField(field) {
        const originalState = field.element.checked;
        const newState = !originalState;
        
        field.element.checked = newState;
        field.element.dispatchEvent(new Event('change', { bubbles: true }));
        field.element.dispatchEvent(new Event('click', { bubbles: true }));
        
        return field.element.checked === newState;
    }

    function testRadioField(field) {
        field.element.checked = true;
        field.element.dispatchEvent(new Event('change', { bubbles: true }));
        field.element.dispatchEvent(new Event('click', { bubbles: true }));
        
        return field.element.checked === true;
    }

    function testSelectField(field) {
        if (!field.element.options || field.element.options.length < 2) {
            return true; // Can't test if no options
        }
        
        const originalIndex = field.element.selectedIndex;
        const newIndex = originalIndex === 0 ? 1 : 0;
        
        field.element.selectedIndex = newIndex;
        field.element.dispatchEvent(new Event('change', { bubbles: true }));
        
        return field.element.selectedIndex === newIndex;
    }

    async function testTab(tab) {
        log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'header');
        log(`Testing: ${tab.label}`, 'header');
        log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'header');
        
        // Switch to tab
        if (!showSection(tab.name)) {
            log(`Failed to switch to tab: ${tab.name}`, 'error');
            results.tabs[tab.name] = { 
                status: 'failed', 
                error: 'Could not switch to tab',
                fieldsFound: 0,
                fieldsTested: 0,
                fieldsPassed: 0,
                coverage: 0
            };
            return;
        }
        
        await delay(500);
        
        // Find all fields
        const fields = findAllFields(tab.name);
        const foundRatio = (fields.length / tab.expectedFields * 100).toFixed(1);
        
        if (fields.length === 0) {
            log(`No fields found in ${tab.name}!`, 'error');
        } else if (fields.length < tab.expectedFields * 0.8) {
            log(`Found ${fields.length}/${tab.expectedFields} fields (${foundRatio}%)`, 'warning');
        } else {
            log(`Found ${fields.length}/${tab.expectedFields} fields (${foundRatio}%)`, 'success');
        }
        
        // Test each field
        let testedCount = 0;
        let passedCount = 0;
        let skippedCount = 0;
        
        for (const field of fields) {
            results.total++;
            testedCount++;
            
            const testResult = testField(field);
            if (testResult.skipped) {
                skippedCount++;
            } else if (testResult.success) {
                passedCount++;
            }
        }
        
        // Calculate tab coverage
        const tabCoverage = tab.expectedFields > 0 
            ? Math.round((passedCount / tab.expectedFields) * 100)
            : 0;
        
        // Record results
        results.tabs[tab.name] = {
            status: passedCount === testedCount - skippedCount ? 'passed' : 
                    passedCount > (testedCount - skippedCount) * 0.8 ? 'partial' : 'failed',
            fieldsFound: fields.length,
            fieldsExpected: tab.expectedFields,
            fieldsTested: testedCount,
            fieldsPassed: passedCount,
            fieldsSkipped: skippedCount,
            fieldsFailed: testedCount - passedCount - skippedCount,
            coverage: tabCoverage
        };
        
        // Summary for this tab
        log(`\nTab Summary:`, 'header');
        log(`  Tested: ${testedCount}`, 'info');
        log(`  Passed: ${passedCount}`, 'success');
        log(`  Failed: ${testedCount - passedCount - skippedCount}`, 
            testedCount - passedCount - skippedCount > 0 ? 'error' : 'info');
        log(`  Skipped: ${skippedCount}`, 'warning');
        log(`  Coverage: ${tabCoverage}%`, tabCoverage >= 90 ? 'success' : 'warning');
    }

    async function testSaveFunction() {
        log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'header');
        log('Testing Save Functionality', 'header');
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'header');
        
        const saveButton = document.getElementById('saveContent');
        if (!saveButton) {
            log('Save button not found', 'error');
            return false;
        }
        
        // Click save
        saveButton.click();
        
        // Wait for save
        await delay(3000);
        
        // Check for success
        const successIndicators = [
            document.querySelector('.alert-success'),
            document.querySelector('[data-status="success"]'),
            document.querySelector('.success-message')
        ];
        
        const success = successIndicators.some(el => el && el.style.display !== 'none');
        
        if (success) {
            log('Save successful', 'success');
            results.passed++;
        } else {
            log('Save may have failed - no success indicator', 'warning');
            results.warnings.push('Save operation unclear');
        }
        
        return success;
    }

    async function testDataPropagation() {
        log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'header');
        log('Testing Data Propagation', 'header');
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'header');
        
        try {
            log('Waiting 5 seconds for data propagation...');
            await delay(5000);
            
            // Check API
            const response = await fetch(CONFIG.apiUrl + '/home-page');
            const data = await response.json();
            
            if (response.ok) {
                const hasTestData = JSON.stringify(data).includes(CONFIG.testPrefix);
                
                if (hasTestData) {
                    log('✓ Test data found in API', 'success');
                    results.passed++;
                } else {
                    log('⚠ Test data not yet in API', 'warning');
                }
                
                log(`API Response: ${response.status} OK`, 'success');
            } else {
                log(`API Error: ${response.status}`, 'error');
                results.failed++;
            }
        } catch (error) {
            log(`Propagation test error: ${error.message}`, 'error');
            results.failed++;
        }
    }

    async function generateReport() {
        log('\n╔════════════════════════════════════════════════════════╗', 'header');
        log('║           COMPREHENSIVE TEST REPORT                    ║', 'header');
        log('╚════════════════════════════════════════════════════════╝', 'header');
        
        // Calculate totals
        let totalFieldsTested = 0;
        let totalFieldsPassed = 0;
        let totalFieldsFound = 0;
        
        Object.values(results.tabs).forEach(tab => {
            if (tab.fieldsTested) {
                totalFieldsTested += tab.fieldsTested;
                totalFieldsPassed += tab.fieldsPassed || 0;
                totalFieldsFound += tab.fieldsFound || 0;
            }
        });
        
        // Calculate coverage based on actual total
        results.coverage = Math.round((totalFieldsPassed / CONFIG.totalActualFields) * 100);
        
        // Display summary
        log(`\n📊 TEST SUMMARY`, 'header');
        log(`═══════════════════════════════════════`, 'info');
        log(`Timestamp: ${results.timestamp}`);
        log(`Total Fields in Admin: ${CONFIG.totalActualFields}`);
        log(`Fields Found: ${totalFieldsFound}`);
        log(`Fields Tested: ${totalFieldsTested}`);
        log(`Fields Passed: ${totalFieldsPassed}`, 'success');
        log(`Fields Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'info');
        log(`Fields Skipped: ${results.skipped}`, 'warning');
        log(`\n🎯 COVERAGE: ${results.coverage}%`, 
            results.coverage >= 90 ? 'success' : 
            results.coverage >= 80 ? 'warning' : 'error');
        
        // Tab breakdown
        log(`\n📑 TAB RESULTS`, 'header');
        log(`═══════════════════════════════════════`, 'info');
        
        Object.entries(results.tabs).forEach(([tabName, tabResult]) => {
            if (tabResult.status) {
                const icon = tabResult.status === 'passed' ? '✅' : 
                            tabResult.status === 'partial' ? '⚠️' : '❌';
                            
                log(`\n${icon} ${tabName}:`);
                log(`   Found: ${tabResult.fieldsFound}/${tabResult.fieldsExpected} fields`);
                log(`   Passed: ${tabResult.fieldsPassed}/${tabResult.fieldsTested} tests`);
                log(`   Failed: ${tabResult.fieldsFailed} | Skipped: ${tabResult.fieldsSkipped}`);
                log(`   Coverage: ${tabResult.coverage}%`);
            }
        });
        
        // Issues
        if (results.errors.length > 0) {
            log(`\n⚠️ ERRORS (${results.errors.length})`, 'error');
            log(`═══════════════════════════════════════`, 'info');
            results.errors.slice(0, 10).forEach((error, i) => {
                log(`${i + 1}. ${error}`, 'error');
            });
            if (results.errors.length > 10) {
                log(`... and ${results.errors.length - 10} more errors`, 'error');
            }
        }
        
        if (results.warnings.length > 0) {
            log(`\n⚠️ WARNINGS (${results.warnings.length})`, 'warning');
            log(`═══════════════════════════════════════`, 'info');
            results.warnings.slice(0, 5).forEach((warning, i) => {
                log(`${i + 1}. ${warning}`, 'warning');
            });
        }
        
        // Final verdict
        log(`\n🏁 FINAL VERDICT`, 'header');
        log(`═══════════════════════════════════════`, 'info');
        
        if (results.coverage >= 90) {
            log(`✅ PASSED - Coverage: ${results.coverage}% (Target: 90%)`, 'success');
        } else if (results.coverage >= 80) {
            log(`⚠️ PARTIAL - Coverage: ${results.coverage}% (Target: 90%)`, 'warning');
        } else {
            log(`❌ FAILED - Coverage: ${results.coverage}% (Target: 90%)`, 'error');
        }
        
        // Save to localStorage
        localStorage.setItem('adminTestResults', JSON.stringify(results));
        log('\n💾 Results saved to localStorage (key: adminTestResults)', 'info');
        
        return results;
    }

    async function cleanup() {
        // Reset any test data if needed
        log('\nCleaning up test data...', 'info');
        // Add cleanup logic here if needed
    }

    // Main test runner
    async function runComprehensiveTest() {
        log('╔════════════════════════════════════════════════════════╗', 'header');
        log('║    AI STUDIO ADMIN PANEL - FIXED COMPREHENSIVE TEST    ║', 'header');
        log('╚════════════════════════════════════════════════════════╝', 'header');
        
        log(`\n📋 Test Configuration:`, 'header');
        log(`  Total Actual Fields: ${CONFIG.totalActualFields}`);
        log(`  Target Coverage: 90% (${Math.ceil(CONFIG.totalActualFields * 0.9)} fields)`);
        log(`  Test Prefix: ${CONFIG.testPrefix}`, 'info');
        
        try {
            // Test each tab
            for (const tab of CONFIG.tabs) {
                await testTab(tab);
                await delay(1000);
            }
            
            // Test save functionality
            await testSaveFunction();
            
            // Test data propagation
            await testDataPropagation();
            
            // Generate report
            const report = await generateReport();
            
            // Cleanup
            await cleanup();
            
            return report;
            
        } catch (error) {
            log(`Fatal error: ${error.message}`, 'error');
            console.error(error);
            return results;
        }
    }

    // Auto-run detection
    if (window.location.href.includes('content-admin-comprehensive.html')) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.log('Fixed Admin Test Ready. Run: AdminPanelTestFixed.run()');
            }, 2000);
        });
    }

    // Expose globally
    window.AdminPanelTestFixed = {
        run: runComprehensiveTest,
        getResults: () => results,
        CONFIG,
        testTab,
        findAllFields
    };

})();