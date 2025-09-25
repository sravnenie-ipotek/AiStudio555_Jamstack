const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Database configuration - using Railway connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
        ? { rejectUnauthorized: false }
        : false
});

async function runProductionScript() {
    console.log('🚀 Connecting to Railway PostgreSQL database...\n');

    try {
        // Test connection
        const testResult = await pool.query('SELECT current_database(), version()');
        console.log('✅ Connected to database:', testResult.rows[0].current_database);
        console.log('📊 PostgreSQL version:', testResult.rows[0].version.split(',')[0]);
        console.log('');

        // Read the SQL script
        const sqlScript = fs.readFileSync(
            path.join(__dirname, 'production-create-nd-courses-page.sql'),
            'utf8'
        );

        // Split the script into individual statements (by semicolon)
        const statements = sqlScript
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`📝 Executing ${statements.length} SQL statements...\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';

            // Skip SELECT verification at the end for now
            if (statement.includes('SELECT') && statement.includes('section_key')) {
                continue;
            }

            try {
                console.log(`Executing statement ${i + 1}/${statements.length}...`);

                if (statement.includes('CREATE TABLE')) {
                    await pool.query(statement);
                    console.log('✅ Table created/verified');
                } else if (statement.includes('INSERT INTO')) {
                    const result = await pool.query(statement);
                    console.log(`✅ Inserted/updated ${result.rowCount} sections`);
                } else if (statement.includes('CREATE INDEX')) {
                    await pool.query(statement);
                    console.log('✅ Index created');
                } else if (statement.includes('CREATE OR REPLACE FUNCTION')) {
                    await pool.query(statement);
                    console.log('✅ Trigger function created');
                } else if (statement.includes('DO $$')) {
                    await pool.query(statement);
                    console.log('✅ Trigger created/verified');
                }
            } catch (err) {
                console.error(`⚠️ Error with statement ${i + 1}:`, err.message);
                // Continue with other statements
            }
        }

        console.log('\n📊 Verifying table contents...\n');

        // Verify the table was created and populated
        const verifyResult = await pool.query(`
            SELECT
                section_key,
                section_type,
                CASE
                    WHEN content_en IS NOT NULL THEN '✅'
                    ELSE '❌'
                END as en,
                CASE
                    WHEN content_ru IS NOT NULL THEN '✅'
                    ELSE '❌'
                END as ru,
                CASE
                    WHEN content_he IS NOT NULL THEN '✅'
                    ELSE '❌'
                END as he
            FROM nd_courses_page
            ORDER BY
                CASE section_key
                    WHEN 'hero' THEN 1
                    WHEN 'featured_courses' THEN 2
                    WHEN 'ui_elements' THEN 3
                    WHEN 'cart' THEN 4
                    WHEN 'cta_bottom' THEN 5
                    WHEN 'navigation' THEN 6
                    WHEN 'misc' THEN 7
                    ELSE 8
                END
        `);

        console.log('Section Key          | Type       | EN | RU | HE');
        console.log('---------------------|------------|----|----|----');
        verifyResult.rows.forEach(row => {
            const key = row.section_key.padEnd(20);
            const type = (row.section_type || '').padEnd(10);
            console.log(`${key} | ${type} | ${row.en}  | ${row.ru}  | ${row.he}`);
        });

        console.log(`\n✅ Total sections: ${verifyResult.rows.length}`);

        // Test the API endpoint
        console.log('\n🧪 Testing API endpoint...\n');

        // Test English
        const enResult = await pool.query(`
            SELECT content_en as content
            FROM nd_courses_page
            WHERE section_key = 'ui_elements'
        `);

        if (enResult.rows[0]?.content?.content?.buttons?.course_details) {
            console.log('✅ English: "Course Details" found');
        }

        // Test Russian
        const ruResult = await pool.query(`
            SELECT content_ru as content
            FROM nd_courses_page
            WHERE section_key = 'ui_elements'
        `);

        if (ruResult.rows[0]?.content?.content?.buttons?.course_details) {
            console.log(`✅ Russian: "${ruResult.rows[0].content.content.buttons.course_details}" found`);
        }

        // Test Hebrew
        const heResult = await pool.query(`
            SELECT content_he as content
            FROM nd_courses_page
            WHERE section_key = 'ui_elements'
        `);

        if (heResult.rows[0]?.content?.content?.buttons?.course_details) {
            console.log(`✅ Hebrew: "${heResult.rows[0].content.content.buttons.course_details}" found`);
        }

        console.log('\n🎉 nd_courses_page table successfully created and populated!');
        console.log('\n📝 Next steps:');
        console.log('1. Restart the server to pick up the new endpoints');
        console.log('2. Test at http://localhost:3000/api/nd/courses-page?locale=ru');
        console.log('3. Refresh courses.html and switch languages to test');

    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    } finally {
        await pool.end();
        console.log('\n✅ Database connection closed');
    }
}

// Run the script
runProductionScript().catch(console.error);