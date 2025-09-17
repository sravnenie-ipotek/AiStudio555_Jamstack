const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:T%40r%40Flex000@localhost:5432/aistudio_db'
});

async function updateDatabase() {
    console.log('🚀 Updating ND database with complete content...\n');

    try {
        // Load the extracted content
        const content = JSON.parse(fs.readFileSync('nd-complete-content.json', 'utf8'));

        // First, check current schema
        const schemaCheck = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'nd_home'
        `);

        const existingColumns = schemaCheck.rows.map(r => r.column_name);
        console.log('📊 Current columns:', existingColumns.join(', '));

        // Add missing columns if they don't exist
        const columnsToAdd = [
            'about_en', 'about_ru', 'about_he',
            'pricing_en', 'pricing_ru', 'pricing_he',
            'faq_en', 'faq_ru', 'faq_he',
            'footer_en', 'footer_ru', 'footer_he'
        ];

        for (const col of columnsToAdd) {
            if (!existingColumns.includes(col)) {
                await pool.query(`
                    ALTER TABLE nd_home
                    ADD COLUMN IF NOT EXISTS ${col} JSONB DEFAULT '{}'::jsonb
                `);
                console.log(`✅ Added column: ${col}`);
            }
        }

        // Update hero section with complete data
        const heroUpdate = await pool.query(`
            UPDATE nd_home
            SET
                content_en = jsonb_set(
                    COALESCE(content_en, '{}'::jsonb),
                    '{hero}',
                    $1::jsonb
                ),
                updated_at = NOW()
            WHERE section_key = 'hero'
            RETURNING section_key
        `, [JSON.stringify({
            ...content.hero,
            subtitle: 'Modern Learning Platform',
            title: 'Welcome to AI Studio New Design',
            description: 'Experience the next generation of online education. From beginner courses to professional programs, AI Studio empowers learners to achieve their goals through expert-led, engaging online courses.',
            button_text: 'Get Started',
            button_url: '#'
        })]);

        console.log('✅ Updated hero section');

        // Update features section with all cards
        await pool.query(`
            UPDATE nd_home
            SET
                content_en = jsonb_set(
                    COALESCE(content_en, '{}'::jsonb),
                    '{items}',
                    $1::jsonb
                ),
                updated_at = NOW()
            WHERE section_key = 'features'
        `, [JSON.stringify(content.features.items)]);

        console.log(`✅ Updated features section with ${content.features.items.length} cards`);

        // Update courses section with all course cards
        await pool.query(`
            UPDATE nd_home
            SET
                content_en = jsonb_set(
                    COALESCE(content_en, '{}'::jsonb),
                    '{items}',
                    $1::jsonb
                ),
                updated_at = NOW()
            WHERE section_key = 'courses'
        `, [JSON.stringify(content.courses.items)]);

        console.log(`✅ Updated courses section with ${content.courses.items.length} courses`);

        // Update testimonials section
        await pool.query(`
            UPDATE nd_home
            SET
                content_en = jsonb_set(
                    COALESCE(content_en, '{}'::jsonb),
                    '{items}',
                    $1::jsonb
                ),
                updated_at = NOW()
            WHERE section_key = 'testimonials'
        `, [JSON.stringify(content.testimonials.items)]);

        console.log(`✅ Updated testimonials with ${content.testimonials.items.length} items`);

        // Update blog section
        await pool.query(`
            UPDATE nd_home
            SET
                content_en = jsonb_set(
                    COALESCE(content_en, '{}'::jsonb),
                    '{items}',
                    $1::jsonb
                ),
                updated_at = NOW()
            WHERE section_key = 'blog'
        `, [JSON.stringify(content.blog.items)]);

        console.log(`✅ Updated blog section with ${content.blog.items.length} posts`);

        // Add about section if it doesn't exist
        const aboutExists = await pool.query(`
            SELECT 1 FROM nd_home WHERE section_key = 'about'
        `);

        if (aboutExists.rows.length === 0) {
            await pool.query(`
                INSERT INTO nd_home (section_key, section_type, content_en, content_ru, content_he, visible)
                VALUES ('about', 'content', $1::jsonb, $1::jsonb, $1::jsonb, true)
            `, [JSON.stringify(content.about)]);
            console.log('✅ Added about section');
        } else {
            await pool.query(`
                UPDATE nd_home
                SET content_en = $1::jsonb
                WHERE section_key = 'about'
            `, [JSON.stringify(content.about)]);
            console.log('✅ Updated about section');
        }

        // Add pricing section
        const pricingExists = await pool.query(`
            SELECT 1 FROM nd_home WHERE section_key = 'pricing'
        `);

        if (pricingExists.rows.length === 0) {
            await pool.query(`
                INSERT INTO nd_home (section_key, section_type, content_en, content_ru, content_he, visible)
                VALUES ('pricing', 'content', $1::jsonb, $1::jsonb, $1::jsonb, true)
            `, [JSON.stringify(content.pricing)]);
            console.log(`✅ Added pricing section with ${content.pricing.plans.length} plans`);
        } else {
            await pool.query(`
                UPDATE nd_home
                SET content_en = $1::jsonb
                WHERE section_key = 'pricing'
            `, [JSON.stringify(content.pricing)]);
            console.log(`✅ Updated pricing section`);
        }

        // Add FAQ section
        const faqExists = await pool.query(`
            SELECT 1 FROM nd_home WHERE section_key = 'faq'
        `);

        if (faqExists.rows.length === 0) {
            await pool.query(`
                INSERT INTO nd_home (section_key, section_type, content_en, content_ru, content_he, visible)
                VALUES ('faq', 'content', $1::jsonb, $1::jsonb, $1::jsonb, true)
            `, [JSON.stringify(content.faq)]);
            console.log(`✅ Added FAQ section with ${content.faq.items.length} Q&A items`);
        } else {
            await pool.query(`
                UPDATE nd_home
                SET content_en = $1::jsonb
                WHERE section_key = 'faq'
            `, [JSON.stringify(content.faq)]);
            console.log(`✅ Updated FAQ section`);
        }

        // Update footer with complete content
        const footerExists = await pool.query(`
            SELECT 1 FROM nd_home WHERE section_key = 'footer'
        `);

        if (footerExists.rows.length === 0) {
            await pool.query(`
                INSERT INTO nd_home (section_key, section_type, content_en, content_ru, content_he, visible)
                VALUES ('footer', 'content', $1::jsonb, $1::jsonb, $1::jsonb, true)
            `, [JSON.stringify(content.footer)]);
            console.log('✅ Added footer section');
        } else {
            await pool.query(`
                UPDATE nd_home
                SET content_en = $1::jsonb
                WHERE section_key = 'footer'
            `, [JSON.stringify(content.footer)]);
            console.log('✅ Updated footer section');
        }

        // Verify all sections
        const allSections = await pool.query(`
            SELECT section_key,
                   jsonb_array_length(COALESCE(content_en->'items', '[]'::jsonb)) as item_count,
                   visible
            FROM nd_home
            ORDER BY id
        `);

        console.log('\n📊 Database Update Summary:');
        console.log('=' .repeat(50));
        allSections.rows.forEach(section => {
            const status = section.visible ? '✅' : '❌';
            const items = section.item_count > 0 ? ` (${section.item_count} items)` : '';
            console.log(`${status} ${section.section_key}${items}`);
        });

        console.log('\n✅ Database updated successfully!');
        console.log('📱 All content is now available in the admin panel');
        console.log('🌐 Visit http://localhost:8082/admin-nd.html to manage all content');

        return true;

    } catch (error) {
        console.error('❌ Error updating database:', error.message);
        if (error.detail) console.error('Details:', error.detail);
        return false;
    } finally {
        await pool.end();
    }
}

// Run the update
updateDatabase()
    .then(success => {
        if (success) {
            console.log('\n🎉 Complete migration successful!');
            console.log('All hardcoded content is now in the database');
        }
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });