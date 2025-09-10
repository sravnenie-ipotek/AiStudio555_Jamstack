/**
 * Production Verification Test
 * Tests all APIs and admin panel functionality on production
 */

const https = require('https');
const http = require('http');

const CONFIG = {
    productionAPI: 'https://aistudio555jamstack-production.up.railway.app/api',
    productionSite: 'https://www.aistudio555.com',
    adminPanel: 'https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html',
    endpoints: [
        '/home-page',
        '/courses', 
        '/teachers',
        '/career-center-page',
        '/career-orientation-page'
    ]
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

async function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ 
                        status: res.statusCode, 
                        data: parsed,
                        success: res.statusCode === 200
                    });
                } catch (error) {
                    resolve({ 
                        status: res.statusCode, 
                        data: data,
                        success: res.statusCode === 200,
                        parseError: error.message
                    });
                }
            });
            
        }).on('error', (err) => {
            reject(err);
        }).setTimeout(10000, () => {
            reject(new Error('Request timeout'));
        });
    });
}

async function testAPIs() {
    console.log(`${colors.cyan}🔍 Testing Production APIs...${colors.reset}`);
    console.log('=' .repeat(60));
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        details: {}
    };
    
    for (const endpoint of CONFIG.endpoints) {
        results.total++;
        const url = CONFIG.productionAPI + endpoint;
        
        console.log(`\n${colors.blue}Testing: ${endpoint}${colors.reset}`);
        
        try {
            const response = await makeRequest(url);
            
            if (response.success) {
                results.passed++;
                console.log(`  ${colors.green}✓ Status: ${response.status}${colors.reset}`);
                
                if (response.data && response.data.data) {
                    console.log(`  ${colors.green}✓ Has data structure${colors.reset}`);
                } else if (response.data && response.data.error) {
                    console.log(`  ${colors.yellow}⚠ API Error: ${response.data.error}${colors.reset}`);
                    if (response.data.details) {
                        console.log(`  ${colors.yellow}  Details: ${response.data.details}${colors.reset}`);
                    }
                }
            } else {
                results.failed++;
                console.log(`  ${colors.red}✗ Status: ${response.status}${colors.reset}`);
                if (response.data) {
                    console.log(`  ${colors.red}  Error: ${JSON.stringify(response.data).substring(0, 100)}${colors.reset}`);
                }
            }
            
            results.details[endpoint] = {
                status: response.status,
                success: response.success,
                hasData: !!(response.data && response.data.data),
                error: response.data && response.data.error
            };
            
        } catch (error) {
            results.failed++;
            console.log(`  ${colors.red}✗ Request failed: ${error.message}${colors.reset}`);
            results.details[endpoint] = {
                status: 'error',
                success: false,
                error: error.message
            };
        }
    }
    
    return results;
}

async function testWebsiteAccess() {
    console.log(`\n${colors.cyan}🌐 Testing Website Access...${colors.reset}`);
    console.log('=' .repeat(60));
    
    const urls = [
        CONFIG.productionSite + '/home.html',
        CONFIG.productionSite + '/courses.html',
        CONFIG.productionSite + '/teachers.html',
        CONFIG.adminPanel
    ];
    
    const results = {
        total: urls.length,
        passed: 0,
        failed: 0
    };
    
    for (const url of urls) {
        console.log(`\n${colors.blue}Testing: ${url}${colors.reset}`);
        
        try {
            const response = await makeRequest(url);
            
            if (response.success) {
                results.passed++;
                console.log(`  ${colors.green}✓ Accessible (${response.status})${colors.reset}`);
            } else {
                results.failed++;
                console.log(`  ${colors.red}✗ Failed (${response.status})${colors.reset}`);
            }
        } catch (error) {
            results.failed++;
            console.log(`  ${colors.red}✗ Error: ${error.message}${colors.reset}`);
        }
    }
    
    return results;
}

async function checkDataPropagation() {
    console.log(`\n${colors.cyan}🔄 Checking Data Propagation...${colors.reset}`);
    console.log('=' .repeat(60));
    
    try {
        const homePageResponse = await makeRequest(CONFIG.productionAPI + '/home-page');
        
        if (homePageResponse.success && homePageResponse.data && homePageResponse.data.data) {
            const homeData = homePageResponse.data.data.attributes;
            
            console.log(`${colors.green}✓ Home page API responding${colors.reset}`);
            
            if (homeData.title) {
                console.log(`  Title: "${homeData.title.substring(0, 50)}..."`);
            }
            
            if (homeData.subtitle) {
                console.log(`  Subtitle: "${homeData.subtitle.substring(0, 50)}..."`);
            }
            
            // Check for test data
            const dataString = JSON.stringify(homePageResponse.data);
            if (dataString.includes('TEST_') || dataString.includes('AUTOTEST_')) {
                console.log(`  ${colors.yellow}⚠ Test data detected in production${colors.reset}`);
            } else {
                console.log(`  ${colors.green}✓ Clean production data${colors.reset}`);
            }
            
            return true;
        } else {
            console.log(`${colors.red}✗ Home page API not responding properly${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}✗ Data propagation test failed: ${error.message}${colors.reset}`);
        return false;
    }
}

async function generateReport(apiResults, websiteResults, propagationResult) {
    console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║               PRODUCTION VERIFICATION REPORT           ║${colors.reset}`);
    console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}`);
    
    console.log(`\n${colors.blue}📊 API Results:${colors.reset}`);
    console.log(`  Total: ${apiResults.total}`);
    console.log(`  ${colors.green}Passed: ${apiResults.passed}${colors.reset}`);
    console.log(`  ${colors.red}Failed: ${apiResults.failed}${colors.reset}`);
    console.log(`  Success Rate: ${Math.round((apiResults.passed / apiResults.total) * 100)}%`);
    
    console.log(`\n${colors.blue}🌐 Website Results:${colors.reset}`);
    console.log(`  Total: ${websiteResults.total}`);
    console.log(`  ${colors.green}Passed: ${websiteResults.passed}${colors.reset}`);
    console.log(`  ${colors.red}Failed: ${websiteResults.failed}${colors.reset}`);
    console.log(`  Success Rate: ${Math.round((websiteResults.passed / websiteResults.total) * 100)}%`);
    
    console.log(`\n${colors.blue}🔄 Data Propagation:${colors.reset}`);
    console.log(`  Status: ${propagationResult ? colors.green + 'WORKING' : colors.red + 'FAILED'}${colors.reset}`);
    
    // Detailed API status
    console.log(`\n${colors.blue}📋 Detailed API Status:${colors.reset}`);
    for (const [endpoint, details] of Object.entries(apiResults.details)) {
        const icon = details.success ? '✅' : '❌';
        console.log(`  ${icon} ${endpoint}: ${details.status}${details.error ? ` (${details.error})` : ''}`);
    }
    
    // Overall status
    const overallSuccess = apiResults.failed === 0 && websiteResults.failed === 0 && propagationResult;
    
    console.log(`\n${colors.blue}🏁 Overall Status:${colors.reset}`);
    if (overallSuccess) {
        console.log(`  ${colors.green}✅ ALL SYSTEMS OPERATIONAL${colors.reset}`);
    } else {
        console.log(`  ${colors.yellow}⚠️ SOME ISSUES DETECTED${colors.reset}`);
        if (apiResults.failed > 0) {
            console.log(`    - ${apiResults.failed} API endpoint(s) failing`);
        }
        if (websiteResults.failed > 0) {
            console.log(`    - ${websiteResults.failed} website page(s) inaccessible`);
        }
        if (!propagationResult) {
            console.log(`    - Data propagation not working`);
        }
    }
    
    return overallSuccess;
}

async function runProductionTest() {
    console.log(`${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║            AI STUDIO PRODUCTION VERIFICATION           ║${colors.reset}`);
    console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}`);
    
    try {
        // Test APIs
        const apiResults = await testAPIs();
        
        // Test website access
        const websiteResults = await testWebsiteAccess();
        
        // Check data propagation
        const propagationResult = await checkDataPropagation();
        
        // Generate report
        const success = await generateReport(apiResults, websiteResults, propagationResult);
        
        console.log(`\n${colors.blue}Timestamp: ${new Date().toISOString()}${colors.reset}`);
        
        return success;
        
    } catch (error) {
        console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
        return false;
    }
}

// Run the test
if (require.main === module) {
    runProductionTest().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = runProductionTest;