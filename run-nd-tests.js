#!/usr/bin/env node

// Comprehensive test runner for New Design system
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

// Test configuration
const testSuites = {
    api: {
        name: 'API Tests',
        file: 'tests/nd-api.spec.js',
        description: 'Tests for New Design API endpoints'
    },
    e2e: {
        name: 'Full E2E Tests',
        file: 'tests/nd-full-e2e.spec.js',
        description: 'Complete end-to-end test suite'
    },
    home: {
        name: 'Home Page Tests',
        file: 'tests/nd-home.spec.js',
        description: 'Tests for home page functionality'
    }
};

// Test runner class
class NDTestRunner {
    constructor() {
        this.results = [];
        this.startTime = Date.now();
    }

    async run() {
        console.log(`${colors.cyan}${colors.bright}
╔════════════════════════════════════════════════════╗
║     🧪 NEW DESIGN TEST SUITE RUNNER                ║
╠════════════════════════════════════════════════════╣
║     Running comprehensive tests for ND system      ║
╚════════════════════════════════════════════════════╝
${colors.reset}`);

        // Check prerequisites
        await this.checkPrerequisites();

        // Run test suites
        const suite = process.argv[2] || 'all';

        if (suite === 'all') {
            console.log(`${colors.blue}📋 Running all test suites...${colors.reset}\n`);
            for (const [key, config] of Object.entries(testSuites)) {
                await this.runTestSuite(key, config);
            }
        } else if (testSuites[suite]) {
            console.log(`${colors.blue}📋 Running ${testSuites[suite].name}...${colors.reset}\n`);
            await this.runTestSuite(suite, testSuites[suite]);
        } else {
            console.error(`${colors.red}❌ Unknown test suite: ${suite}${colors.reset}`);
            this.showUsage();
            process.exit(1);
        }

        // Show summary
        this.showSummary();
    }

    async checkPrerequisites() {
        console.log(`${colors.yellow}🔍 Checking prerequisites...${colors.reset}`);

        // Check if server is running
        try {
            const response = await fetch('http://localhost:3001/api/nd/home-page');
            if (!response.ok) {
                throw new Error('API not responding');
            }
            console.log(`${colors.green}✅ API server is running${colors.reset}`);
        } catch (error) {
            console.log(`${colors.yellow}⚠️  API server not detected, starting it...${colors.reset}`);
            this.startServer();
            await this.waitForServer();
        }

        // Check if test files exist
        for (const config of Object.values(testSuites)) {
            if (!fs.existsSync(config.file)) {
                console.log(`${colors.yellow}⚠️  Test file missing: ${config.file}${colors.reset}`);
            }
        }

        // Create test results directory
        const resultsDir = path.join(__dirname, 'test-results', 'nd-tests');
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
            console.log(`${colors.green}✅ Created test results directory${colors.reset}`);
        }

        console.log('');
    }

    startServer() {
        const server = spawn('npm', ['start'], {
            detached: true,
            stdio: 'ignore',
            env: { ...process.env, PORT: 3001 }
        });
        server.unref();
    }

    async waitForServer(maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const response = await fetch('http://localhost:3001/api/nd/home-page');
                if (response.ok) {
                    console.log(`${colors.green}✅ Server started successfully${colors.reset}`);
                    return;
                }
            } catch (error) {
                // Server not ready yet
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        throw new Error('Server failed to start');
    }

    runTestSuite(name, config) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            console.log(`${colors.bright}▶️  ${config.name}${colors.reset}`);
            console.log(`   ${colors.cyan}${config.description}${colors.reset}`);

            const testProcess = spawn('npx', [
                'playwright',
                'test',
                config.file,
                '--reporter=list'
            ], {
                stdio: 'pipe',
                env: {
                    ...process.env,
                    API_URL: 'http://localhost:3001',
                    TEST_URL: 'http://localhost:3005'
                }
            });

            let output = '';
            let errorOutput = '';

            testProcess.stdout.on('data', (data) => {
                const text = data.toString();
                output += text;

                // Parse and display progress
                if (text.includes('✓') || text.includes('✔')) {
                    process.stdout.write(`${colors.green}   ✓${colors.reset}`);
                } else if (text.includes('✗') || text.includes('✘')) {
                    process.stdout.write(`${colors.red}   ✗${colors.reset}`);
                } else if (text.includes('Running')) {
                    process.stdout.write('.');
                }
            });

            testProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            testProcess.on('close', (code) => {
                const duration = ((Date.now() - startTime) / 1000).toFixed(2);
                const status = code === 0 ? 'PASSED' : 'FAILED';
                const color = code === 0 ? colors.green : colors.red;

                console.log(`\n   ${color}${status}${colors.reset} in ${duration}s\n`);

                this.results.push({
                    suite: name,
                    name: config.name,
                    status,
                    duration,
                    code,
                    output,
                    errorOutput
                });

                resolve();
            });
        });
    }

    showSummary() {
        const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(2);
        const passed = this.results.filter(r => r.status === 'PASSED').length;
        const failed = this.results.filter(r => r.status === 'FAILED').length;

        console.log(`${colors.bright}
╔════════════════════════════════════════════════════╗
║              📊 TEST RESULTS SUMMARY               ║
╚════════════════════════════════════════════════════╝
${colors.reset}`);

        console.log(`⏱️  Total Duration: ${totalDuration}s`);
        console.log(`✅ Passed: ${colors.green}${passed}${colors.reset}`);
        console.log(`❌ Failed: ${colors.red}${failed}${colors.reset}`);
        console.log(`📊 Total: ${this.results.length}\n`);

        // Show individual results
        console.log(`${colors.bright}Test Suite Results:${colors.reset}`);
        this.results.forEach(result => {
            const icon = result.status === 'PASSED' ? '✅' : '❌';
            const color = result.status === 'PASSED' ? colors.green : colors.red;
            console.log(`  ${icon} ${result.name}: ${color}${result.status}${colors.reset} (${result.duration}s)`);
        });

        // Save results to file
        this.saveResults();

        // Exit code
        process.exit(failed > 0 ? 1 : 0);
    }

    saveResults() {
        const resultsFile = path.join(__dirname, 'test-results', 'nd-tests', 'summary.json');
        const results = {
            timestamp: new Date().toISOString(),
            duration: ((Date.now() - this.startTime) / 1000).toFixed(2),
            results: this.results,
            summary: {
                total: this.results.length,
                passed: this.results.filter(r => r.status === 'PASSED').length,
                failed: this.results.filter(r => r.status === 'FAILED').length
            }
        };

        fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
        console.log(`\n📁 Results saved to: ${colors.cyan}${resultsFile}${colors.reset}`);
    }

    showUsage() {
        console.log(`
${colors.bright}Usage:${colors.reset}
  node run-nd-tests.js [suite]

${colors.bright}Available Suites:${colors.reset}
  all   - Run all test suites
  api   - Run API tests only
  e2e   - Run full E2E tests
  home  - Run home page tests

${colors.bright}Examples:${colors.reset}
  node run-nd-tests.js        # Run all tests
  node run-nd-tests.js api    # Run API tests only
  node run-nd-tests.js e2e    # Run E2E tests only
`);
    }
}

// Main execution
if (require.main === module) {
    const runner = new NDTestRunner();
    runner.run().catch(error => {
        console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
        process.exit(1);
    });
}

module.exports = NDTestRunner;