// Update nd_footer schema with missing columns
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aistudio_db'
});

async function updateSchema() {
    try {
        console.log('🔧 Adding missing columns to nd_footer table...');

        await pool.query(`
            ALTER TABLE nd_footer
            ADD COLUMN IF NOT EXISTS placeholder_en TEXT,
            ADD COLUMN IF NOT EXISTS placeholder_ru TEXT,
            ADD COLUMN IF NOT EXISTS placeholder_he TEXT,
            ADD COLUMN IF NOT EXISTS button_text_en TEXT,
            ADD COLUMN IF NOT EXISTS button_text_ru TEXT,
            ADD COLUMN IF NOT EXISTS button_text_he TEXT
        `);

        console.log('✅ Schema updated successfully!');
        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
        process.exit(1);
    }
}

updateSchema();