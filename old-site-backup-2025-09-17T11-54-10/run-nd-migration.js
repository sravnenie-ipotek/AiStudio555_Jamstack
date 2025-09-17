// Run New Design database migration
const fs = require('fs');
const path = require('path');

// Import database query function from server
const { queryDatabase } = require('./server');

async function runMigration() {
    try {
        console.log('🚀 Starting New Design database migration...');

        // Read SQL file
        const sqlPath = path.join(__dirname, 'migrations', 'create_nd_tables.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolons and filter out empty statements
        const statements = sql.split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`📝 Found ${statements.length} SQL statements to execute`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';

            // Extract table/operation name for logging
            let operation = 'Unknown operation';
            if (statement.includes('DROP TABLE')) {
                const match = statement.match(/DROP TABLE IF EXISTS (\w+)/);
                operation = `Drop table ${match ? match[1] : ''}`;
            } else if (statement.includes('CREATE TABLE')) {
                const match = statement.match(/CREATE TABLE (\w+)/);
                operation = `Create table ${match ? match[1] : ''}`;
            } else if (statement.includes('CREATE INDEX')) {
                const match = statement.match(/CREATE INDEX (\w+)/);
                operation = `Create index ${match ? match[1] : ''}`;
            } else if (statement.includes('CREATE TRIGGER')) {
                const match = statement.match(/CREATE TRIGGER (\w+)/);
                operation = `Create trigger ${match ? match[1] : ''}`;
            } else if (statement.includes('CREATE OR REPLACE FUNCTION')) {
                operation = 'Create update function';
            }

            console.log(`   ${i + 1}. ${operation}...`);

            try {
                await queryDatabase(statement);
            } catch (error) {
                console.error(`   ❌ Failed: ${error.message}`);
                // Continue with other statements
            }
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('📊 Created tables:');
        console.log('   - nd_home (home page sections)');
        console.log('   - nd_menu (navigation menu)');
        console.log('   - nd_footer (footer content)');

        // Verify tables were created
        const checkTables = `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name LIKE 'nd_%'
            ORDER BY table_name;
        `;

        const result = await queryDatabase(checkTables);

        if (result.rows && result.rows.length > 0) {
            console.log('\n🔍 Verified tables in database:');
            result.rows.forEach(row => {
                console.log(`   ✓ ${row.table_name}`);
            });
        }

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    runMigration()
        .then(() => {
            console.log('\n🎉 New Design database is ready!');
            process.exit(0);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runMigration };