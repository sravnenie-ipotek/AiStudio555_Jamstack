#!/usr/bin/env node

/**
 * Update Directus Display Titles
 * Changes the title field to include language indicators
 * This will make the entries distinguishable in Directus admin
 */

const https = require('https');

console.log('🔧 FIXING DIRECTUS DISPLAY ISSUE\n');

const updates = [
    {
        id: 1,
        locale: 'en',
        newTitle: '🇬🇧 HOME (English)',
        heroTitle: 'Master Technology'
    },
    {
        id: 2,
        locale: 'ru',
        newTitle: '🇷🇺 ДОМ (Русский)',
        heroTitle: 'Освойте технологии'
    },
    {
        id: 3,
        locale: 'he',
        newTitle: '🇮🇱 בית (עברית)',
        heroTitle: 'לשלוט בטכנולוגיה'
    }
];

async function updateTitle(id, title) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ title: title });
        
        const options = {
            hostname: 'aistudio555jamstack-production.up.railway.app',
            path: `/api/home-page/${id}`,
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
                    status: res.statusCode
                });
            });
        });
        
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('📝 Updating titles to include language indicators...\n');
    
    for (const update of updates) {
        console.log(`Updating ${update.locale.toUpperCase()}...`);
        
        try {
            const result = await updateTitle(update.id, update.newTitle);
            
            if (result.success) {
                console.log(`✅ ${update.locale.toUpperCase()}: Title updated to "${update.newTitle}"`);
            } else {
                console.log(`❌ ${update.locale.toUpperCase()}: Failed to update`);
            }
        } catch (error) {
            console.log(`❌ ${update.locale.toUpperCase()}: Error - ${error.message}`);
        }
    }
    
    console.log('\n✨ RESULT:');
    console.log('The Directus admin should now show:');
    console.log('1. 🇬🇧 HOME (English)');
    console.log('2. 🇷🇺 ДОМ (Русский)');
    console.log('3. 🇮🇱 בית (עברית)');
    console.log('\nInstead of three identical "ДОМ" entries!');
    
    console.log('\n📌 ALTERNATIVE SOLUTIONS:');
    console.log('1. Use our custom admin: https://aistudio555jamstack-production.up.railway.app/admin-language-manager.html');
    console.log('2. Use comprehensive admin: https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html');
    console.log('3. Configure Directus display settings (requires Directus admin access)');
}

main();