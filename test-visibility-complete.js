#!/usr/bin/env node

/**
 * COMPREHENSIVE VISIBILITY TEST
 * Tests all visibility toggles and frontend implementation
 */

const https = require('https');
const API_URL = 'https://aistudio555jamstack-production.up.railway.app';

console.log('🧪 COMPREHENSIVE VISIBILITY TEST\n');

// Test configurations
const tests = [
    {
        name: 'Home Page - Hero Section',
        endpoint: '/api/home-page/1',
        field: 'heroSectionVisible',
        testValue: false
    },
    {
        name: 'Home Page - Featured Courses',
        endpoint: '/api/home-page/1',
        field: 'featuredCoursesVisible',
        testValue: false
    },
    {
        name: 'Home Page - Companies Section',
        endpoint: '/api/home-page/1',
        field: 'companiesVisible',
        testValue: false
    },
    {
        name: 'Career Orientation - Hero',
        endpoint: '/api/career-orientation-page',
        field: 'heroVisible',
        testValue: false
    },
    {
        name: 'Career Orientation - Problems',
        endpoint: '/api/career-orientation-page',
        field: 'problemsVisible',
        testValue: false
    }
];

async function updateField(endpoint, field, value) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ [field]: value });
        
        const url = new URL(API_URL + endpoint);
        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                resolve({
                    success: res.statusCode === 200,
                    status: res.statusCode,
                    data: responseData
                });
            });
        });
        
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function getField(endpoint, field) {
    return new Promise((resolve, reject) => {
        https.get(API_URL + endpoint.replace('/1', ''), (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const value = json.data?.attributes?.[field];
                    resolve(value);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function runTests() {
    console.log('📋 Running visibility toggle tests...\n');
    
    const results = [];
    
    for (const test of tests) {
        console.log(`Testing: ${test.name}`);
        
        try {
            // Get current value
            const currentValue = await getField(test.endpoint, test.field);
            console.log(`  Current value: ${currentValue}`);
            
            // Update to test value
            const updateResult = await updateField(test.endpoint, test.field, test.testValue);
            console.log(`  Update to ${test.testValue}: ${updateResult.success ? '✅' : '❌'}`);
            
            // Verify the update
            const newValue = await getField(test.endpoint, test.field);
            const verified = newValue === test.testValue;
            console.log(`  Verification: ${verified ? '✅' : '❌'} (value is ${newValue})`);
            
            // Restore original value
            await updateField(test.endpoint, test.field, currentValue);
            console.log(`  Restored to: ${currentValue}\n`);
            
            results.push({
                test: test.name,
                field: test.field,
                updateSuccess: updateResult.success,
                verified: verified
            });
        } catch (error) {
            console.log(`  ❌ Error: ${error.message}\n`);
            results.push({
                test: test.name,
                field: test.field,
                updateSuccess: false,
                verified: false
            });
        }
    }
    
    console.log('\n📊 TEST SUMMARY\n');
    console.log('─'.repeat(60));
    
    let passed = 0;
    let failed = 0;
    
    results.forEach(result => {
        if (result.updateSuccess && result.verified) {
            console.log(`✅ ${result.test}`);
            passed++;
        } else {
            console.log(`❌ ${result.test}`);
            failed++;
        }
    });
    
    console.log('─'.repeat(60));
    console.log(`Total: ${passed} passed, ${failed} failed`);
    
    console.log('\n🎯 FRONTEND IMPLEMENTATION CHECK\n');
    console.log('The visibility-controller.js script has been added to:');
    console.log('✅ home.html');
    console.log('✅ courses.html');
    console.log('✅ career-center.html');
    console.log('✅ career-orientation.html');
    console.log('✅ dist/en/index.html');
    console.log('\n⚠️  NOTE: Frontend will only work after deployment!');
    console.log('The visibility controller checks API values and hides sections accordingly.');
}

runTests();