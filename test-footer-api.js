#!/usr/bin/env node

const fetch = require('node-fetch');

async function testFooterAPI() {
    console.log('🔍 Testing Footer API...\n');

    try {
        const response = await fetch('http://localhost:3000/api/footer-content?locale=en');
        const data = await response.json();

        console.log('📊 API Response Status:', response.status);
        console.log('\n🔹 Navigation Data:');

        if (data.navigation) {
            Object.entries(data.navigation).forEach(([key, value]) => {
                console.log(`\n  ${key}:`);
                console.log(`    Title: ${value.title}`);
                console.log(`    Items Count: ${value.items ? value.items.length : 0}`);
                if (value.items && value.items.length > 0) {
                    console.log('    Items:');
                    value.items.forEach(item => {
                        console.log(`      - ${item.text}: ${item.url}`);
                    });
                } else {
                    console.log('    ⚠️  No items found!');
                }
            });
        } else {
            console.log('❌ No navigation data in response');
        }

        // Check if the actual data structure is different
        console.log('\n🔍 Raw navigation object:');
        console.log(JSON.stringify(data.navigation, null, 2));

        // Check for data.data.attributes structure (Strapi-like)
        if (data.data && data.data.attributes) {
            console.log('\n🔍 Found data.attributes structure:');
            console.log('Navigation:', JSON.stringify(data.data.attributes.navigation, null, 2));
        }

    } catch (error) {
        console.error('❌ Error testing API:', error.message);
    }
}

testFooterAPI();