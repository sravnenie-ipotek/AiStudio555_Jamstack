#!/usr/bin/env node
/**
 * Add Hebrew FAQ Titles to PostgreSQL Database
 * Adds the missing FAQ titles that were working in SQLite
 */

const { Client } = require('pg');

async function addFAQTitlesToPostgres() {
    console.log('🐘 Adding Hebrew FAQ titles to PostgreSQL...');

    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/aistudio_db'
    });

    const hebrewFAQTitles = {
        faq_1_title: 'קורסים מוצעים',      // Offered Courses
        faq_2_title: 'משך הקורסים',        // Course Duration
        faq_3_title: 'תעודות והסמכה',      // Certificates and Certification
        faq_4_title: 'תמיכה בקריירה',      // Career Support
        faq_5_title: 'דרישות קדם',         // Prerequisites
        faq_6_title: 'למידה בקצב אישי'      // Self-paced Learning
    };

    try {
        await client.connect();
        console.log('✅ Connected to PostgreSQL');

        // First, check what tables exist
        const tablesResult = await client.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('📋 Available tables:', tablesResult.rows.map(r => r.table_name).join(', '));

        // Look for home_pages table specifically
        const homePageTable = tablesResult.rows.find(r => r.table_name === 'home_pages');

        if (!homePageTable) {
            console.log('🏗️ Creating home_pages table...');

            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS home_pages (
                    id SERIAL PRIMARY KEY,
                    locale VARCHAR(10) DEFAULT 'en',
                    title TEXT,
                    ${Object.keys(hebrewFAQTitles).map(key => `${key} TEXT`).join(',\n                    ')},
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            await client.query(createTableQuery);
            console.log('✅ Created home_pages table');

            // Insert Hebrew record
            const insertQuery = `
                INSERT INTO home_pages (locale, title, ${Object.keys(hebrewFAQTitles).join(', ')})
                VALUES ('he', 'AI Studio - Hebrew', ${Object.keys(hebrewFAQTitles).map((_, i) => `$${i + 1}`).join(', ')})
            `;

            await client.query(insertQuery, Object.values(hebrewFAQTitles));
            console.log('✅ Inserted Hebrew FAQ titles');

        } else {
            console.log('🎯 Found home_pages table');
            const tableName = 'home_pages';

            // Check table structure
            const columnsResult = await client.query(`
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = $1
                ORDER BY ordinal_position
            `, [tableName]);

            const columns = columnsResult.rows.map(r => r.column_name);
            console.log('📋 Table columns:', columns.join(', '));

            // Add missing FAQ columns if they don't exist
            for (const faqColumn of Object.keys(hebrewFAQTitles)) {
                if (!columns.includes(faqColumn)) {
                    console.log(`➕ Adding column: ${faqColumn}`);
                    await client.query(`ALTER TABLE ${tableName} ADD COLUMN ${faqColumn} TEXT`);
                }
            }

            // Add locale column if it doesn't exist
            if (!columns.includes('locale')) {
                console.log('➕ Adding locale column');
                await client.query(`ALTER TABLE ${tableName} ADD COLUMN locale VARCHAR(10) DEFAULT 'en'`);
            }

            // Check if Hebrew record exists
            const hebrewRecord = await client.query(`SELECT * FROM ${tableName} WHERE locale = 'he'`);

            if (hebrewRecord.rows.length === 0) {
                console.log('📝 Inserting Hebrew record...');

                const insertQuery = `
                    INSERT INTO ${tableName} (locale, ${Object.keys(hebrewFAQTitles).join(', ')})
                    VALUES ('he', ${Object.keys(hebrewFAQTitles).map((_, i) => `$${i + 1}`).join(', ')})
                `;

                await client.query(insertQuery, Object.values(hebrewFAQTitles));
                console.log('✅ Inserted Hebrew FAQ titles');
            } else {
                console.log('🔄 Updating existing Hebrew record...');

                const updateQuery = `
                    UPDATE ${tableName}
                    SET ${Object.keys(hebrewFAQTitles).map((key, i) => `${key} = $${i + 1}`).join(', ')}
                    WHERE locale = 'he'
                `;

                await client.query(updateQuery, Object.values(hebrewFAQTitles));
                console.log('✅ Updated Hebrew FAQ titles');
            }
        }

        // Verify the data
        console.log('🔍 Verifying FAQ titles...');
        const verifyResult = await client.query(`
            SELECT locale, ${Object.keys(hebrewFAQTitles).join(', ')}
            FROM home_pages
            WHERE locale = 'he'
        `);

        if (verifyResult.rows.length > 0) {
            console.log('✅ Verification successful:');
            const record = verifyResult.rows[0];
            Object.keys(hebrewFAQTitles).forEach(key => {
                console.log(`   ${key}: ${record[key] || 'NOT SET'}`);
            });
        } else {
            console.log('⚠️ No Hebrew record found for verification');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await client.end();
    }
}

if (require.main === module) {
    addFAQTitlesToPostgres()
        .then(() => {
            console.log('🎉 Hebrew FAQ titles added successfully!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('💥 Failed to add FAQ titles:', err.message);
            process.exit(1);
        });
}

module.exports = { addFAQTitlesToPostgres };