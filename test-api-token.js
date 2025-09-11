#!/usr/bin/env node

/**
 * Test Directus API Access with Token
 * Token: s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE
 * User: api user (apiBot role with Administrator parent)
 */

const API_TOKEN = 's-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE';
const DIRECTUS_URL = 'https://attractive-determination-production.up.railway.app';

async function testAPIAccess() {
    console.log('🔐 Testing Directus API with apiBot token...\n');

    // Test 1: Read courses
    console.log('📚 Test 1: Reading courses...');
    try {
        const response = await fetch(`${DIRECTUS_URL}/items/courses`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });
        const data = await response.json();
        
        if (response.ok) {
            console.log(`✅ SUCCESS: Can read courses! Found ${data.data?.length || 0} courses`);
        } else {
            console.log(`❌ FAILED: ${data.errors?.[0]?.message || 'Cannot read courses'}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    // Test 2: Read home pages
    console.log('\n🏠 Test 2: Reading home pages...');
    try {
        const response = await fetch(`${DIRECTUS_URL}/items/home_pages`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });
        const data = await response.json();
        
        if (response.ok) {
            console.log(`✅ SUCCESS: Can read home pages! Found ${data.data?.length || 0} pages`);
        } else {
            console.log(`❌ FAILED: ${data.errors?.[0]?.message || 'Cannot read home pages'}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    // Test 3: Create a test course
    console.log('\n➕ Test 3: Creating a test course...');
    try {
        const response = await fetch(`${DIRECTUS_URL}/items/courses`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'API Test Course',
                description: 'Created via API by apiBot',
                price: 99.99,
                duration: '4 weeks',
                lessons: '12',
                category: 'Technology',
                rating: '5.0',
                visible: true
            })
        });
        const data = await response.json();
        
        if (response.ok) {
            console.log(`✅ SUCCESS: Created course with ID ${data.data?.id}`);
            return data.data?.id; // Return ID for update test
        } else {
            console.log(`❌ FAILED: ${data.errors?.[0]?.message || 'Cannot create course'}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    // Test 4: Update permissions check
    console.log('\n✏️ Test 4: Testing update permissions...');
    try {
        // First get a course to update
        const getResponse = await fetch(`${DIRECTUS_URL}/items/courses?limit=1`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });
        const getData = await getResponse.json();
        
        if (getData.data && getData.data.length > 0) {
            const courseId = getData.data[0].id;
            
            // Try to update it
            const updateResponse = await fetch(`${DIRECTUS_URL}/items/courses/${courseId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: `Updated by API at ${new Date().toISOString()}`
                })
            });
            const updateData = await updateResponse.json();
            
            if (updateResponse.ok) {
                console.log(`✅ SUCCESS: Can update courses!`);
            } else {
                console.log(`❌ FAILED: ${updateData.errors?.[0]?.message || 'Cannot update courses'}`);
            }
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    // Test 5: Check user info
    console.log('\n👤 Test 5: Checking API user info...');
    try {
        const response = await fetch(`${DIRECTUS_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });
        const data = await response.json();
        
        if (response.ok) {
            console.log(`✅ SUCCESS: Authenticated as user:`, data.data?.email || 'Unknown');
            console.log(`   Role: ${data.data?.role?.name || 'Unknown'}`);
        } else {
            console.log(`❌ FAILED: ${data.errors?.[0]?.message || 'Cannot get user info'}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 API Token Test Complete!');
    console.log('Token: s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE');
    console.log('='.repeat(50));
}

// Run the test
testAPIAccess().catch(console.error);