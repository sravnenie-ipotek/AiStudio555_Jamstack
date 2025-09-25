#!/usr/bin/env node

/**
 * Update Existing Career Orientation Database with Multilingual Content
 * Uses UPDATE instead of INSERT to work with existing structure
 */

const fs = require('fs');
const path = require('path');

require('dotenv').config();

async function updateCareerOrientationData() {
    try {
        console.log('🚀 Starting multilingual career orientation database update...\n');

        // Load multilingual data
        const dataPath = path.join(__dirname, 'career-orientation-multilingual-data.json');
        if (!fs.existsSync(dataPath)) {
            throw new Error('Multilingual data file not found. Run extract script first.');
        }

        const multilingualData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`📚 Loaded content for languages: ${Object.keys(multilingualData).join(', ')}`);

        const { Pool } = require('pg');
        const DATABASE_URL = process.env.DATABASE_URL;

        if (!DATABASE_URL) {
            console.error('❌ DATABASE_URL not found in environment');
            process.exit(1);
        }

        console.log('🔗 Connecting to PostgreSQL database...');

        const pool = new Pool({
            connectionString: DATABASE_URL,
            ssl: DATABASE_URL.includes('railway') ? { rejectUnauthorized: false } : false
        });

        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL');

        console.log('📝 Updating multilingual career orientation content...');

        let updated = 0;
        let created = 0;
        let errors = 0;

        // Map languages to IDs (he=1, en=2, ru=3)
        const langMap = { he: 1, en: 2, ru: 3 };

        // Update each language version
        for (const [language, content] of Object.entries(multilingualData)) {
            try {
                console.log(`\n🌍 Processing ${language.toUpperCase()} version...`);

                // Check if entry exists
                const existsResult = await client.query(
                    'SELECT id FROM career_orientation_pages WHERE id = $1',
                    [langMap[language]]
                );

                if (existsResult.rows.length > 0) {
                    // Update existing entry
                    await client.query(`
                        UPDATE career_orientation_pages SET
                            locale = $1,
                            hero_title = $2,
                            hero_subtitle = $3,
                            hero_description = $4,
                            hero_main_title = $5,
                            hero_stat1_value = $6,
                            hero_stat1_label = $7,
                            hero_stat2_value = $8,
                            hero_stat2_label = $9,
                            hero_stat3_value = $10,
                            hero_stat3_label = $11,
                            hero_cta_text = $12,
                            process_main_title = $13,
                            process_subtitle = $14,
                            process_step1_title = $15,
                            process_step1_description = $16,
                            process_step1_duration = $17,
                            process_step2_title = $18,
                            process_step2_description = $19,
                            process_step2_duration = $20,
                            process_step3_title = $21,
                            process_step3_description = $22,
                            process_step3_duration = $23,
                            career_paths_main_title = $24,
                            career_paths_subtitle = $25,
                            expert_name = $26,
                            expert_title = $27,
                            expert_credentials = $28,
                            expert_background = $29,
                            expert_description = $30,
                            cta_main_title = $31,
                            cta_subtitle = $32,
                            cta_description = $33,
                            cta_button_text = $34
                        WHERE id = $35
                    `, [
                        content.locale,
                        content.pageTitle,
                        content.heroSubtitle,
                        content.heroDescription,
                        content.heroMainTitle,
                        content.heroStat1Value,
                        content.heroStat1Label,
                        content.heroStat2Value,
                        content.heroStat2Label,
                        content.heroStat3Value,
                        content.heroStat3Label,
                        content.ctaButtonText,
                        content.processMainTitle,
                        content.processSubtitle,
                        content.processStep1Title,
                        content.processStep1Description,
                        content.processStep1Duration,
                        content.processStep2Title,
                        content.processStep2Description,
                        content.processStep2Duration,
                        content.processStep3Title,
                        content.processStep3Description,
                        content.processStep3Duration,
                        content.careerPathsMainTitle,
                        content.careerPathsSubtitle,
                        content.expertName,
                        content.expertTitle,
                        content.expertCredentials,
                        content.expertBackground,
                        content.expertBio,
                        content.ctaMainTitle,
                        content.ctaSubtitle,
                        content.ctaDescription,
                        content.ctaButtonText,
                        langMap[language]
                    ]);

                    console.log(`✅ UPDATED ${language.toUpperCase()}: ${content.pageTitle}`);
                    updated++;
                } else {
                    // Create new entry with minimal required fields
                    await client.query(`
                        INSERT INTO career_orientation_pages (id, locale, hero_title, hero_main_title, expert_name)
                        VALUES ($1, $2, $3, $4, $5)
                    `, [
                        langMap[language],
                        content.locale,
                        content.pageTitle,
                        content.heroMainTitle,
                        content.expertName
                    ]);

                    console.log(`✅ CREATED ${language.toUpperCase()}: ${content.pageTitle}`);
                    created++;
                }

            } catch (error) {
                console.error(`❌ Error processing ${language}:`, error.message);
                errors++;
            }
        }

        // Verify update
        console.log('\n🔍 Verifying update...');
        const countResult = await client.query(`
            SELECT COUNT(*) as count, locale
            FROM career_orientation_pages
            WHERE locale IS NOT NULL
            GROUP BY locale
            ORDER BY locale
        `);

        console.log('\n📊 Career orientation by language:');
        let total = 0;
        for (const row of countResult.rows) {
            console.log(`  ${row.locale}: ${row.count} entry`);
            total += parseInt(row.count);
        }

        // Get sample data
        const sampleResult = await client.query(`
            SELECT locale, hero_main_title, expert_name
            FROM career_orientation_pages
            WHERE locale IS NOT NULL
            ORDER BY locale
            LIMIT 5
        `);

        if (sampleResult.rows.length > 0) {
            console.log('\n📝 Updated entries:');
            for (const sample of sampleResult.rows) {
                console.log(`  ${sample.locale}: "${sample.hero_main_title}" - Expert: ${sample.expert_name}`);
            }
        }

        console.log(`\n🎉 Update completed successfully!`);
        console.log(`🔄 Successfully updated: ${updated} entries`);
        console.log(`➕ Successfully created: ${created} entries`);
        console.log(`❌ Errors: ${errors}`);
        console.log(`📊 Total in database: ${total} entries`);

        // Close connections
        client.release();
        await pool.end();

        console.log('\n🔗 Next steps:');
        console.log('1. ✅ Test API: curl http://localhost:3000/api/career-orientation-page?locale=he');
        console.log('2. ✅ Test API: curl http://localhost:3000/api/career-orientation-page?locale=en');
        console.log('3. ✅ Test API: curl http://localhost:3000/api/career-orientation-page?locale=ru');
        console.log('4. 🔄 Update frontend to load from API');
        console.log('5. 🗑️ Remove hardcoded HTML content');

    } catch (error) {
        console.error('❌ Failed to update career orientation data:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the update
if (require.main === module) {
    updateCareerOrientationData();
}

module.exports = updateCareerOrientationData;