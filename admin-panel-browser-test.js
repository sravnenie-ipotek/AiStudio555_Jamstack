// Admin Panel Comprehensive Test Script
// Copy and paste this into browser console at http://localhost:3005/content-admin-comprehensive.html

async function testAdminPanel() {
    console.log('%c🔍 Starting Admin Panel Test...', 'color: blue; font-size: 16px; font-weight: bold');

    const results = {
        tabs: [],
        errors: [],
        warnings: [],
        missingElements: [],
        apiTests: []
    };

    // Test 1: Check all tabs
    console.log('\n%c📋 Testing Tabs...', 'color: green; font-size: 14px; font-weight: bold');
    const tabs = document.querySelectorAll('.tab');

    for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        const tabName = tab.textContent.trim();
        console.log(`Testing tab ${i + 1}/${tabs.length}: ${tabName}`);

        // Click the tab
        tab.click();

        // Wait for content to load
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check for active content section
        const activeSection = document.querySelector('.content-section.active');

        const tabResult = {
            index: i,
            name: tabName,
            onclick: tab.getAttribute('onclick'),
            hasActiveSection: !!activeSection,
            sectionId: activeSection?.id || 'NONE',
            formFields: {
                inputs: 0,
                textareas: 0,
                selects: 0,
                buttons: 0
            },
            saveButtons: [],
            issues: []
        };

        if (activeSection) {
            // Count form elements
            tabResult.formFields.inputs = activeSection.querySelectorAll('input').length;
            tabResult.formFields.textareas = activeSection.querySelectorAll('textarea').length;
            tabResult.formFields.selects = activeSection.querySelectorAll('select').length;
            tabResult.formFields.buttons = activeSection.querySelectorAll('button').length;

            // Find save buttons
            const saveButtons = activeSection.querySelectorAll('button');
            saveButtons.forEach(btn => {
                if (btn.textContent.toLowerCase().includes('save')) {
                    tabResult.saveButtons.push(btn.textContent.trim());
                }
            });

            // Check for empty required fields
            const requiredInputs = activeSection.querySelectorAll('input[required], textarea[required], select[required]');
            if (requiredInputs.length > 0) {
                tabResult.requiredFields = requiredInputs.length;
            }

            // Check for duplicate IDs in this section
            const ids = [...activeSection.querySelectorAll('[id]')].map(el => el.id);
            const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
            if (duplicates.length > 0) {
                tabResult.issues.push(`Duplicate IDs found: ${duplicates.join(', ')}`);
            }
        } else {
            tabResult.issues.push('No active section found for this tab');
            results.errors.push(`Tab "${tabName}" has no corresponding content section`);
        }

        results.tabs.push(tabResult);
    }

    // Test 2: Check for JavaScript errors
    console.log('\n%c🔧 Checking for JavaScript Issues...', 'color: orange; font-size: 14px; font-weight: bold');

    // Check if key functions exist
    const requiredFunctions = [
        'showSection',
        'switchLanguage',
        'saveHomePage',
        'loadCompleteHomePage',
        'saveCareerOrientation',
        'saveCourses',
        'saveTeachers'
    ];

    requiredFunctions.forEach(func => {
        if (typeof window[func] !== 'function') {
            results.errors.push(`Required function missing: ${func}()`);
        }
    });

    // Test 3: Check API connectivity
    console.log('\n%c🌐 Testing API Endpoints...', 'color: purple; font-size: 14px; font-weight: bold');

    const apiEndpoints = [
        '/api/courses',
        '/api/teachers',
        '/api/home-page',
        '/api/career-orientation-page',
        '/api/career-center-page',
        '/api/blog-posts'
    ];

    for (const endpoint of apiEndpoints) {
        try {
            const baseUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:3000'
                : 'https://aistudio555jamstack-production.up.railway.app';

            const response = await fetch(baseUrl + endpoint);
            const apiResult = {
                endpoint,
                status: response.status,
                success: response.ok,
                statusText: response.statusText
            };

            if (!response.ok) {
                results.errors.push(`API endpoint ${endpoint} returned ${response.status}`);
            }

            results.apiTests.push(apiResult);
        } catch (error) {
            results.apiTests.push({
                endpoint,
                status: 0,
                success: false,
                error: error.message
            });
            results.errors.push(`API endpoint ${endpoint} failed: ${error.message}`);
        }
    }

    // Test 4: Check for missing UI elements
    console.log('\n%c🎨 Checking UI Elements...', 'color: teal; font-size: 14px; font-weight: bold');

    const criticalElements = [
        { selector: '#admin-language-switcher', name: 'Language Switcher' },
        { selector: '.tabs', name: 'Tab Container' },
        { selector: '#current-language', name: 'Current Language Display' },
        { selector: '.header', name: 'Header' }
    ];

    criticalElements.forEach(element => {
        if (!document.querySelector(element.selector)) {
            results.missingElements.push(element.name);
        }
    });

    // Test 5: Check specific known issues
    console.log('\n%c🐛 Checking Known Issues...', 'color: red; font-size: 14px; font-weight: bold');

    // Check if translations are applied
    if (typeof adminTranslations === 'undefined') {
        results.warnings.push('Translation system not initialized');
    }

    // Check if currentLocale is set
    if (typeof currentLocale === 'undefined') {
        results.errors.push('currentLocale variable not defined');
    }

    // Generate Report
    console.log('\n%c=' + '='.repeat(60), 'color: blue; font-weight: bold');
    console.log('%c📊 TEST REPORT', 'color: blue; font-size: 18px; font-weight: bold');
    console.log('%c=' + '='.repeat(60), 'color: blue; font-weight: bold');

    // Tab Summary
    console.log('\n%c📑 TAB SUMMARY:', 'color: green; font-size: 14px; font-weight: bold');
    results.tabs.forEach(tab => {
        const icon = tab.hasActiveSection ? '✅' : '❌';
        console.log(`${icon} ${tab.name}`);
        console.log(`   Section: ${tab.sectionId}`);
        console.log(`   Fields: ${tab.formFields.inputs} inputs, ${tab.formFields.textareas} textareas`);
        if (tab.saveButtons.length > 0) {
            console.log(`   Save Buttons: ${tab.saveButtons.join(', ')}`);
        }
        if (tab.issues.length > 0) {
            console.log(`   ⚠️ Issues: ${tab.issues.join('; ')}`);
        }
    });

    // API Summary
    console.log('\n%c🌐 API STATUS:', 'color: purple; font-size: 14px; font-weight: bold');
    results.apiTests.forEach(api => {
        const icon = api.success ? '✅' : '❌';
        console.log(`${icon} ${api.endpoint} - ${api.status || 'FAILED'} ${api.error || ''}`);
    });

    // Error Summary
    if (results.errors.length > 0) {
        console.log('\n%c❌ ERRORS FOUND:', 'color: red; font-size: 14px; font-weight: bold');
        results.errors.forEach((error, i) => {
            console.log(`${i + 1}. ${error}`);
        });
    }

    // Warning Summary
    if (results.warnings.length > 0) {
        console.log('\n%c⚠️ WARNINGS:', 'color: orange; font-size: 14px; font-weight: bold');
        results.warnings.forEach((warning, i) => {
            console.log(`${i + 1}. ${warning}`);
        });
    }

    // Missing Elements
    if (results.missingElements.length > 0) {
        console.log('\n%c🔍 MISSING ELEMENTS:', 'color: red; font-size: 14px; font-weight: bold');
        results.missingElements.forEach(element => {
            console.log(`- ${element}`);
        });
    }

    // Final Summary
    console.log('\n%c=' + '='.repeat(60), 'color: blue; font-weight: bold');
    const totalErrors = results.errors.length;
    const totalWarnings = results.warnings.length;
    const status = totalErrors === 0 ? '✅ PASSED' : '❌ FAILED';

    console.log(`%c${status}`, `color: ${totalErrors === 0 ? 'green' : 'red'}; font-size: 20px; font-weight: bold`);
    console.log(`Tabs Tested: ${results.tabs.length}`);
    console.log(`Errors: ${totalErrors}`);
    console.log(`Warnings: ${totalWarnings}`);
    console.log(`Missing Elements: ${results.missingElements.length}`);

    return results;
}

// Run the test
testAdminPanel().then(results => {
    console.log('\n%c✅ Test Complete!', 'color: green; font-size: 16px; font-weight: bold');
    console.log('Results saved to window.testResults');
    window.testResults = results;
}).catch(error => {
    console.error('%c❌ Test Failed:', 'color: red; font-size: 16px; font-weight: bold', error);
});