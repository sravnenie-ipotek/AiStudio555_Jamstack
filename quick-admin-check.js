/**
 * Quick Admin Panel Check
 * Lightweight test without Puppeteer to verify admin panel and API
 */

const fetch = require('node-fetch');
const fs = require('fs').promises;

const CONFIG = {
    apiUrl: 'https://aistudio555jamstack-production.up.railway.app/api',
    localApiUrl: 'http://localhost:3000/api',
    endpoints: [
        '/home-page',
        '/courses',
        '/teachers',
        '/career-center-page',
        '/career-orientation-page'
    ]
};

// Color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

async function checkAPI() {
    console.log(`\n${colors.cyan}🔍 Checking API Endpoints...${colors.reset}`);
    console.log('=' .repeat(50));

    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        endpoints: {}
    };

    for (const endpoint of CONFIG.endpoints) {
        results.total++;
        console.log(`\n${colors.blue}Testing: ${endpoint}${colors.reset}`);
        
        try {
            // Test production API
            const prodResponse = await fetch(CONFIG.apiUrl + endpoint);
            const prodData = await prodResponse.json();
            
            if (prodResponse.ok && prodData) {
                results.passed++;
                results.endpoints[endpoint] = {
                    status: 'success',
                    hasData: Object.keys(prodData).length > 0,
                    fields: Object.keys(prodData).length
                };
                
                console.log(`  ${colors.green}✓ Production API: OK${colors.reset}`);
                console.log(`  ${colors.green}  Fields: ${Object.keys(prodData).length}${colors.reset}`);
                
                // Sample some data
                if (prodData.title) {
                    console.log(`  ${colors.cyan}  Title: "${prodData.title.substring(0, 50)}..."${colors.reset}`);
                }
            } else {
                throw new Error(`HTTP ${prodResponse.status}`);
            }
            
        } catch (error) {
            results.failed++;
            results.endpoints[endpoint] = {
                status: 'failed',
                error: error.message
            };
            console.log(`  ${colors.red}✗ Failed: ${error.message}${colors.reset}`);
        }
    }

    return results;
}

async function checkAdminFields() {
    console.log(`\n${colors.cyan}📝 Checking Admin Panel Fields...${colors.reset}`);
    console.log('=' .repeat(50));

    // Read the admin HTML file to check field definitions
    const adminHtml = await fs.readFile('./content-admin-comprehensive.html', 'utf-8');
    
    const fieldPatterns = {
        home: {
            hero: ['homeTitle', 'homeHeroTitle', 'homeHeroSubtitle', 'homeHeroDescription', 'homeHeroVisible'],
            courses: Array.from({length: 6}, (_, i) => `course${i+1}Title`),
            testimonials: Array.from({length: 4}, (_, i) => `testimonial${i+1}Author`),
            features: ['homeFeaturedTitle', 'homeFeaturedDescription', 'homeAboutTitle', 'homeCompaniesTitle', 'homeTestimonialsTitle']
        },
        career: {
            services: ['careerCenterTitle', 'careerCenterHeroTitle', 'careerCenterDescription'],
            orientation: ['hero_main_title', 'hero_subtitle', 'hero_description']
        }
    };

    let totalFields = 0;
    let foundFields = 0;
    const missingFields = [];

    for (const [section, fields] of Object.entries(fieldPatterns)) {
        console.log(`\n${colors.blue}Section: ${section}${colors.reset}`);
        
        for (const [subsection, fieldIds] of Object.entries(fields)) {
            for (const fieldId of fieldIds) {
                totalFields++;
                if (adminHtml.includes(`id="${fieldId}"`)) {
                    foundFields++;
                    console.log(`  ${colors.green}✓ ${fieldId}${colors.reset}`);
                } else {
                    missingFields.push(fieldId);
                    console.log(`  ${colors.red}✗ ${fieldId} - NOT FOUND${colors.reset}`);
                }
            }
        }
    }

    return {
        totalFields,
        foundFields,
        missingFields,
        coverage: Math.round((foundFields / totalFields) * 100)
    };
}

async function testDataFlow() {
    console.log(`\n${colors.cyan}🔄 Testing Data Flow...${colors.reset}`);
    console.log('=' .repeat(50));

    try {
        // Get current data from API
        const response = await fetch(CONFIG.apiUrl + '/home-page');
        const currentData = await response.json();
        
        console.log(`${colors.green}✓ Current home page title:${colors.reset}`);
        console.log(`  "${currentData.title || 'No title set'}"`);
        
        // Test data structure
        const requiredFields = ['title', 'subtitle', 'description'];
        const hasRequiredFields = requiredFields.every(field => field in currentData);
        
        if (hasRequiredFields) {
            console.log(`${colors.green}✓ All required fields present${colors.reset}`);
        } else {
            console.log(`${colors.yellow}⚠ Some required fields missing${colors.reset}`);
        }
        
        // Check for test data (if any tests were run)
        if (JSON.stringify(currentData).includes('TEST:')) {
            console.log(`${colors.yellow}⚠ Test data detected in production!${colors.reset}`);
        } else {
            console.log(`${colors.green}✓ No test data in production${colors.reset}`);
        }
        
        return { success: true, hasRequiredFields };
        
    } catch (error) {
        console.log(`${colors.red}✗ Data flow test failed: ${error.message}${colors.reset}`);
        return { success: false, error: error.message };
    }
}

async function generateQuickReport(apiResults, fieldResults, dataFlowResults) {
    console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}                  QUICK CHECK REPORT                ${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);

    // API Results
    console.log(`${colors.yellow}API Endpoints:${colors.reset}`);
    console.log(`  Total: ${apiResults.total}`);
    console.log(`  ${colors.green}Passed: ${apiResults.passed}${colors.reset}`);
    console.log(`  ${colors.red}Failed: ${apiResults.failed}${colors.reset}`);
    
    // Field Results
    console.log(`\n${colors.yellow}Admin Panel Fields:${colors.reset}`);
    console.log(`  Total: ${fieldResults.totalFields}`);
    console.log(`  ${colors.green}Found: ${fieldResults.foundFields}${colors.reset}`);
    console.log(`  ${colors.red}Missing: ${fieldResults.missingFields.length}${colors.reset}`);
    console.log(`  Coverage: ${fieldResults.coverage}%`);
    
    if (fieldResults.missingFields.length > 0) {
        console.log(`\n${colors.red}Missing Fields:${colors.reset}`);
        fieldResults.missingFields.forEach(field => {
            console.log(`  - ${field}`);
        });
    }
    
    // Data Flow
    console.log(`\n${colors.yellow}Data Flow:${colors.reset}`);
    console.log(`  Status: ${dataFlowResults.success ? colors.green + 'OK' : colors.red + 'FAILED'}${colors.reset}`);
    
    // Overall Status
    const overallSuccess = apiResults.failed === 0 && fieldResults.coverage > 80 && dataFlowResults.success;
    
    console.log(`\n${colors.bright}Overall Status: ${overallSuccess ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}\n`);
    
    // Save report
    const report = {
        timestamp: new Date().toISOString(),
        api: apiResults,
        fields: fieldResults,
        dataFlow: dataFlowResults,
        overallSuccess
    };
    
    await fs.writeFile('quick-check-report.json', JSON.stringify(report, null, 2));
    console.log(`${colors.cyan}Report saved to quick-check-report.json${colors.reset}\n`);
    
    return overallSuccess;
}

// Main execution
async function run() {
    console.log(`${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}║       AI STUDIO - QUICK ADMIN PANEL CHECK         ║${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════╝${colors.reset}`);

    try {
        const apiResults = await checkAPI();
        const fieldResults = await checkAdminFields();
        const dataFlowResults = await testDataFlow();
        
        const success = await generateQuickReport(apiResults, fieldResults, dataFlowResults);
        
        process.exit(success ? 0 : 1);
        
    } catch (error) {
        console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    run();
}

module.exports = { checkAPI, checkAdminFields, testDataFlow };