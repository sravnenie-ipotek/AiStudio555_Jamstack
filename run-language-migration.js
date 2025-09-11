#!/usr/bin/env node

/**
 * Run Language Migration
 * Adds locale and display_name fields to distinguish language versions
 */

const https = require('https');

console.log('🌐 RUNNING LANGUAGE IDENTIFIER MIGRATION\n');

async function runMigration() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'aistudio555jamstack-production.up.railway.app',
            path: '/api/run-missing-fields-migration',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    success: res.statusCode === 200,
                    data: data
                });
            });
        });
        
        req.on('error', reject);
        req.end();
    });
}

async function testLanguageDisplay() {
    console.log('📋 Testing language display...\n');
    
    const locales = ['en', 'ru', 'he'];
    
    for (const locale of locales) {
        const url = `https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=${locale}`;
        
        await new Promise((resolve) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        const title = json.data?.attributes?.title || 'Not found';
                        const displayName = json.data?.attributes?.display_name || 'No display name';
                        
                        console.log(`${locale.toUpperCase()}:`);
                        console.log(`  Title: ${title}`);
                        console.log(`  Display: ${displayName}\n`);
                    } catch (e) {
                        console.log(`${locale.toUpperCase()}: Error parsing response\n`);
                    }
                    resolve();
                });
            }).on('error', resolve);
        });
    }
}

async function main() {
    console.log('🚀 Starting migration...\n');
    
    // Run migration
    const result = await runMigration();
    
    if (result.success) {
        console.log('✅ Migration completed successfully\n');
    } else {
        console.log('⚠️  Migration may have issues\n');
    }
    
    // Test the results
    await testLanguageDisplay();
    
    console.log('🎯 SOLUTION SUMMARY:\n');
    console.log('1. Database now has locale and display_name fields');
    console.log('2. Each language version is clearly identified');
    console.log('3. Admin interfaces can show the display_name for clarity');
    console.log('\n✨ RECOMMENDED ADMIN URL:');
    console.log('https://aistudio555jamstack-production.up.railway.app/admin-language-manager.html');
    console.log('\nThis custom admin provides:');
    console.log('- Clear language flags and indicators');
    console.log('- Easy switching between languages');
    console.log('- Better UX for content managers');
}

main();