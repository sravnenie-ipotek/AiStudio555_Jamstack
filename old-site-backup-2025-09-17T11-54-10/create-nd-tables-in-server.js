// Create ND tables using server's database connection
const fs = require('fs');
const path = require('path');

// Import the queryDatabase function from server.js
const { queryDatabase } = require('./server');

async function createNDTables() {
    try {
        console.log('🚀 Creating New Design tables in server database...');

        // Simple table creation without complex functions
        const statements = [
            // Drop existing tables
            'DROP TABLE IF EXISTS nd_footer CASCADE',
            'DROP TABLE IF EXISTS nd_menu CASCADE',
            'DROP TABLE IF EXISTS nd_home CASCADE',

            // Create nd_home table
            `CREATE TABLE nd_home (
                id SERIAL PRIMARY KEY,
                section_key VARCHAR(100) UNIQUE NOT NULL,
                section_type VARCHAR(50),
                visible BOOLEAN DEFAULT true,
                order_index INTEGER DEFAULT 0,
                content_en JSONB,
                content_ru JSONB,
                content_he JSONB,
                animations_enabled BOOLEAN DEFAULT true,
                custom_css TEXT,
                custom_js TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // Create nd_menu table
            `CREATE TABLE nd_menu (
                id SERIAL PRIMARY KEY,
                parent_id INTEGER REFERENCES nd_menu(id) ON DELETE CASCADE,
                order_index INTEGER DEFAULT 0,
                visible BOOLEAN DEFAULT true,
                label_en VARCHAR(200),
                label_ru VARCHAR(200),
                label_he VARCHAR(200),
                url VARCHAR(500),
                icon_class VARCHAR(100),
                target VARCHAR(20) DEFAULT '_self',
                is_dropdown BOOLEAN DEFAULT false,
                dropdown_columns INTEGER DEFAULT 1,
                badge_text_en VARCHAR(50),
                badge_text_ru VARCHAR(50),
                badge_text_he VARCHAR(50),
                badge_color VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // Create nd_footer table
            `CREATE TABLE nd_footer (
                id SERIAL PRIMARY KEY,
                section_type VARCHAR(50) NOT NULL,
                column_number INTEGER,
                order_index INTEGER DEFAULT 0,
                visible BOOLEAN DEFAULT true,
                item_type VARCHAR(50),
                content_en TEXT,
                content_ru TEXT,
                content_he TEXT,
                url VARCHAR(500),
                icon_class VARCHAR(100),
                target VARCHAR(20) DEFAULT '_self',
                placeholder_en VARCHAR(200),
                placeholder_ru VARCHAR(200),
                placeholder_he VARCHAR(200),
                button_text_en VARCHAR(100),
                button_text_ru VARCHAR(100),
                button_text_he VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            console.log(`   ${i + 1}. Executing: ${statements[i].substring(0, 50)}...`);
            await queryDatabase(statements[i]);
        }

        console.log('✅ Tables created successfully');

        // Now load the content
        console.log('📝 Loading extracted content...');
        const contentSQL = fs.readFileSync(path.join(__dirname, 'backups/newDesign/extracted/nd_home_content.sql'), 'utf8');
        const contentStatements = contentSQL.split(';').filter(s => s.trim());

        for (const statement of contentStatements) {
            if (statement.trim()) {
                await queryDatabase(statement + ';');
            }
        }

        console.log('✅ Content loaded successfully');

        // Verify what was loaded
        const result = await queryDatabase('SELECT section_key, section_type FROM nd_home ORDER BY order_index');
        console.log('\n📊 Loaded sections in nd_home:');
        result.rows.forEach((row, index) => {
            console.log(`   ${index + 1}. ${row.section_key} (${row.section_type})`);
        });

        console.log('\n🎉 New Design database is ready in server database!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    // Wait a bit for server to initialize
    setTimeout(() => {
        createNDTables();
    }, 1000);
}