#!/usr/bin/env node

/**
 * Fix Language Display in Admin
 * Ensures each home_page entry has proper locale and display title
 */

const https = require('https');
const API_URL = 'https://aistudio555jamstack-production.up.railway.app';

console.log('🌐 FIXING LANGUAGE DISPLAY IN ADMIN\n');

// Language configurations
const languages = [
    {
        locale: 'en',
        title: '🇬🇧 Home Page (English)',
        heroTitle: 'Master Technology',
        displayName: 'HOME'
    },
    {
        locale: 'ru', 
        title: '🇷🇺 Главная страница (Русский)',
        heroTitle: 'Освойте технологии',
        displayName: 'ДОМ'
    },
    {
        locale: 'he',
        title: '🇮🇱 דף הבית (עברית)',
        heroTitle: 'לשלוט בטכנולוגיה',
        displayName: 'בית'
    }
];

async function updateLanguageEntries() {
    console.log('📋 Updating language entries with proper identifiers...\n');
    
    for (const lang of languages) {
        console.log(`Updating ${lang.locale.toUpperCase()} version...`);
        
        const data = JSON.stringify({
            locale: lang.locale,
            title: lang.title,
            displayName: lang.displayName
        });
        
        const options = {
            hostname: 'aistudio555jamstack-production.up.railway.app',
            path: `/api/home-page/${lang.locale === 'en' ? '1' : lang.locale === 'ru' ? '2' : '3'}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        
        const result = await new Promise((resolve) => {
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
            
            req.on('error', () => resolve({ success: false }));
            req.write(data);
            req.end();
        });
        
        if (result.success) {
            console.log(`✅ ${lang.locale.toUpperCase()}: Updated with language indicator`);
        } else {
            console.log(`❌ ${lang.locale.toUpperCase()}: Update failed`);
        }
    }
    
    console.log('\n📊 DATABASE STRUCTURE RECOMMENDATION:\n');
    console.log('The home_pages table should have:');
    console.log('- id: Primary key');
    console.log('- locale: Language code (en/ru/he)');
    console.log('- display_name: Admin display title with flag emoji');
    console.log('- title: Actual page title');
    console.log('- Other content fields...');
    
    console.log('\n🎯 SOLUTION FOR DIRECTUS ADMIN:\n');
    console.log('1. Add a computed/display field showing: [FLAG] [LANGUAGE] [TITLE]');
    console.log('2. Example: "🇬🇧 EN - Home Page"');
    console.log('3. Or configure Directus to show the locale field in list view');
    
    console.log('\n✨ BETTER SOLUTION:\n');
    console.log('Use the custom admin interface instead:');
    console.log('https://aistudio555jamstack-production.up.railway.app/admin-language-manager.html');
    console.log('\nThis provides:');
    console.log('- Clear language indicators with flags');
    console.log('- Visual separation of language versions');
    console.log('- Easy switching between languages');
    console.log('- Better UX for content managers');
}

updateLanguageEntries();