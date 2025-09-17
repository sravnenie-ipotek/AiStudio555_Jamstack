// Load New Design content into database
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres'
});

async function createAndLoadContent() {
    try {
        // First create the tables
        console.log('📊 Creating New Design tables...');
        const createSQL = fs.readFileSync(path.join(__dirname, 'migrations/create_nd_tables.sql'), 'utf8');

        // Execute each statement individually
        const createStatements = createSQL.split(';').filter(s => s.trim());

        for (let i = 0; i < createStatements.length; i++) {
            const statement = createStatements[i].trim();
            if (statement) {
                try {
                    await pool.query(statement + ';');
                } catch (err) {
                    // Skip if already exists
                    if (!err.message.includes('already exists')) {
                        console.log(`   Statement ${i+1}: ${err.message.substring(0, 50)}...`);
                    }
                }
            }
        }

        console.log('✅ Tables created/verified');

        // Now load the content
        console.log('📝 Loading extracted content...');
        const contentSQL = fs.readFileSync(path.join(__dirname, 'backups/newDesign/extracted/nd_home_content.sql'), 'utf8');
        const contentStatements = contentSQL.split(';').filter(s => s.trim());

        for (const statement of contentStatements) {
            if (statement.trim()) {
                await pool.query(statement + ';');
            }
        }

        console.log('✅ Content loaded successfully');

        // Verify what was loaded
        const homeResult = await pool.query('SELECT section_key, section_type FROM nd_home ORDER BY order_index');
        console.log('\n📊 Loaded sections in nd_home:');
        homeResult.rows.forEach((row, index) => {
            console.log(`   ${index + 1}. ${row.section_key} (${row.section_type})`);
        });

        const countResult = await pool.query('SELECT COUNT(*) as count FROM nd_home');
        console.log(`\nTotal sections: ${countResult.rows[0].count}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        await pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    createAndLoadContent()
        .then(() => {
            console.log('\n🎉 New Design content is ready!');
            process.exit(0);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { createAndLoadContent };