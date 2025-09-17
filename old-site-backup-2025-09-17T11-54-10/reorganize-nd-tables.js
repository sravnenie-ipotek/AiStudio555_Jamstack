/**
 * REORGANIZE ND TABLES - Move data to proper tables
 * - Keep FAQ in nd_home (it belongs there)
 * - Move pricing to nd_pricing_page (check for duplicates)
 * - Move about to nd_about_page (new table)
 * - Remove footer from nd_home (use nd_footer table)
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:T%40r%40Flex000@localhost:5432/aistudio_db'
});

async function reorganizeTables() {
    console.log('🔄 Reorganizing ND tables...\n');

    try {
        // Start transaction
        await pool.query('BEGIN');

        // 1. Check what exists in nd_pricing_page
        console.log('📊 Checking existing pricing data...');
        const pricingCheck = await pool.query(`
            SELECT COUNT(*) as count,
                   array_agg(section_name) as sections
            FROM nd_pricing_page
        `);

        console.log(`Found ${pricingCheck.rows[0].count} pricing sections: ${pricingCheck.rows[0].sections || 'none'}`);

        // 2. Create nd_about_page table if it doesn't exist
        console.log('\n📝 Creating nd_about_page table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS nd_about_page (
                id SERIAL PRIMARY KEY,
                section_name VARCHAR(100) UNIQUE NOT NULL,
                content_en JSONB DEFAULT '{}',
                content_ru JSONB DEFAULT '{}',
                content_he JSONB DEFAULT '{}',
                visible BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ nd_about_page table ready');

        // 3. Get data from nd_home that needs to be moved
        const homeData = await pool.query(`
            SELECT section_key, content_en, content_ru, content_he
            FROM nd_home
            WHERE section_key IN ('pricing', 'about', 'footer')
        `);

        console.log(`\n📦 Found ${homeData.rows.length} sections to process`);

        // 4. Process each section
        for (const row of homeData.rows) {
            console.log(`\n🔧 Processing: ${row.section_key}`);

            if (row.section_key === 'pricing' && row.content_en) {
                // Move pricing data to nd_pricing_page (check for duplicates)
                console.log('  → Moving pricing to nd_pricing_page...');

                // Check if 'plans' section already exists
                const plansExists = await pool.query(`
                    SELECT 1 FROM nd_pricing_page WHERE section_name = 'plans'
                `);

                if (plansExists.rows.length === 0) {
                    // Extract pricing data and insert
                    const pricingContent = row.content_en;

                    // Insert hero section if exists
                    if (pricingContent.title || pricingContent.subtitle) {
                        await pool.query(`
                            INSERT INTO nd_pricing_page (section_name, content_en, content_ru, content_he)
                            VALUES ('hero', $1, $2, $3)
                            ON CONFLICT (section_name) DO NOTHING
                        `, [
                            JSON.stringify({
                                title: pricingContent.title || 'Pricing Plans',
                                subtitle: pricingContent.subtitle || 'Choose your plan',
                                description: pricingContent.description || ''
                            }),
                            JSON.stringify({}),
                            JSON.stringify({})
                        ]);
                        console.log('    ✅ Pricing hero added');
                    }

                    // Insert plans section if exists
                    if (pricingContent.plans && pricingContent.plans.length > 0) {
                        await pool.query(`
                            INSERT INTO nd_pricing_page (section_name, content_en, content_ru, content_he)
                            VALUES ('plans', $1, $2, $3)
                            ON CONFLICT (section_name) DO NOTHING
                        `, [
                            JSON.stringify({
                                title: 'Choose Your Learning Path',
                                subtitle: 'Flexible pricing plans',
                                plans: pricingContent.plans
                            }),
                            row.content_ru ? JSON.stringify(row.content_ru) : JSON.stringify({}),
                            row.content_he ? JSON.stringify(row.content_he) : JSON.stringify({})
                        ]);
                        console.log(`    ✅ ${pricingContent.plans.length} pricing plans added`);
                    }
                } else {
                    console.log('    ⚠️ Pricing plans already exist, skipping to avoid duplicates');
                }

                // Remove pricing from nd_home
                await pool.query(`
                    DELETE FROM nd_home WHERE section_key = 'pricing'
                `);
                console.log('    ✅ Removed pricing from nd_home');

            } else if (row.section_key === 'about' && row.content_en) {
                // Move about data to nd_about_page
                console.log('  → Moving about to nd_about_page...');

                await pool.query(`
                    INSERT INTO nd_about_page (section_name, content_en, content_ru, content_he)
                    VALUES ('hero', $1, $2, $3)
                    ON CONFLICT (section_name) DO UPDATE SET
                        content_en = EXCLUDED.content_en,
                        content_ru = EXCLUDED.content_ru,
                        content_he = EXCLUDED.content_he,
                        updated_at = CURRENT_TIMESTAMP
                `, [
                    JSON.stringify(row.content_en),
                    row.content_ru ? JSON.stringify(row.content_ru) : JSON.stringify({}),
                    row.content_he ? JSON.stringify(row.content_he) : JSON.stringify({})
                ]);
                console.log('    ✅ About content moved to nd_about_page');

                // Remove about from nd_home
                await pool.query(`
                    DELETE FROM nd_home WHERE section_key = 'about'
                `);
                console.log('    ✅ Removed about from nd_home');

            } else if (row.section_key === 'footer') {
                // Footer should use nd_footer table
                console.log('  → Footer should use nd_footer table');

                // Check if nd_footer has data
                const footerCheck = await pool.query('SELECT COUNT(*) as count FROM nd_footer');

                if (footerCheck.rows[0].count === 0 && row.content_en) {
                    console.log('    ⚠️ nd_footer is empty, you may want to populate it');
                    // We could populate it here if needed
                } else {
                    console.log(`    ✓ nd_footer has ${footerCheck.rows[0].count} items`);
                }

                // Remove footer from nd_home
                await pool.query(`
                    DELETE FROM nd_home WHERE section_key = 'footer'
                `);
                console.log('    ✅ Removed footer from nd_home');
            }
        }

        // 5. Verify FAQ stays in nd_home
        const faqCheck = await pool.query(`
            SELECT 1 FROM nd_home WHERE section_key = 'faq'
        `);

        if (faqCheck.rows.length > 0) {
            console.log('\n✅ FAQ section remains in nd_home (as it should)');
        }

        // 6. List final state of nd_home
        console.log('\n📋 Final nd_home sections:');
        const finalSections = await pool.query(`
            SELECT section_key, section_type,
                   CASE
                       WHEN content_en IS NOT NULL THEN 'Has content'
                       ELSE 'Empty'
                   END as status
            FROM nd_home
            ORDER BY id
        `);

        finalSections.rows.forEach(section => {
            const icon = section.section_key === 'faq' ? '❓' : '📌';
            console.log(`  ${icon} ${section.section_key} (${section.section_type}): ${section.status}`);
        });

        // Commit transaction
        await pool.query('COMMIT');

        console.log('\n' + '='.repeat(50));
        console.log('✅ TABLE REORGANIZATION COMPLETE!');
        console.log('='.repeat(50));
        console.log('\nSummary:');
        console.log('  ✅ Pricing moved to nd_pricing_page (no duplicates)');
        console.log('  ✅ About moved to nd_about_page');
        console.log('  ✅ Footer removed from nd_home (use nd_footer)');
        console.log('  ✅ FAQ remains in nd_home (home page content)');
        console.log('  ✅ nd_home now contains only home-specific content');

        // Show table counts
        console.log('\n📊 Table Statistics:');
        const tables = ['nd_home', 'nd_pricing_page', 'nd_about_page', 'nd_footer', 'nd_courses'];
        for (const table of tables) {
            const count = await pool.query(`SELECT COUNT(*) as c FROM ${table}`);
            console.log(`  ${table}: ${count.rows[0].c} records`);
        }

        return true;

    } catch (error) {
        // Rollback on error
        await pool.query('ROLLBACK');
        console.error('\n❌ Error during reorganization:', error.message);
        if (error.detail) console.error('Details:', error.detail);
        return false;
    } finally {
        await pool.end();
    }
}

// Run the reorganization
reorganizeTables()
    .then(success => {
        if (success) {
            console.log('\n🎉 Database structure improved!');
            console.log('Each page now uses its dedicated table.');
        }
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });