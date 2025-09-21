const fetch = require('node-fetch');

async function createTableViaAPI() {
    console.log('🚀 Creating nd_courses_page table via API...\n');

    try {
        // First, test if the table already exists
        console.log('🧪 Testing current API status...');
        const testResponse = await fetch('http://localhost:1337/api/nd/courses-page?locale=en');

        if (testResponse.ok) {
            const data = await testResponse.json();
            if (data.success) {
                console.log('✅ Table already exists and API is working!');

                // Display current contents
                console.log('\n📊 Current table contents:');
                for (const [key, section] of Object.entries(data.data)) {
                    console.log(`  - ${key} (${section.type})`);
                }
                return;
            }
        }

        console.log('⚠️ Table does not exist or API error');
        console.log('\n📝 Instructions to create the table:\n');

        console.log('Option 1: Use Railway Dashboard');
        console.log('1. Go to https://railway.app/dashboard');
        console.log('2. Select your project');
        console.log('3. Click on PostgreSQL plugin');
        console.log('4. Click "Connect" → "Query"');
        console.log('5. Copy and paste the SQL from production-create-nd-courses-page.sql');
        console.log('6. Click "Run Query"\n');

        console.log('Option 2: Create a temporary API endpoint');
        console.log('Add this to server.js temporarily:\n');

        console.log(`
// TEMPORARY - REMOVE AFTER EXECUTION
app.get('/api/create-courses-page-table', async (req, res) => {
    try {
        // Create table
        await queryDatabase(\`
            CREATE TABLE IF NOT EXISTS nd_courses_page (
                id SERIAL PRIMARY KEY,
                section_key VARCHAR(100) UNIQUE NOT NULL,
                section_type VARCHAR(50),
                content_en JSONB,
                content_ru JSONB,
                content_he JSONB,
                visible BOOLEAN DEFAULT true,
                animations_enabled BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        \`);

        // Insert data
        const sections = [
            ['hero', 'hero',
                '{"title": "Our Courses"}',
                '{"title": "Наши Курсы"}',
                '{"title": "הקורסים שלנו"}'],
            // ... add all sections
        ];

        for (const section of sections) {
            await queryDatabase(
                'INSERT INTO nd_courses_page (section_key, section_type, content_en, content_ru, content_he) VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb) ON CONFLICT (section_key) DO NOTHING',
                section
            );
        }

        res.json({ success: true, message: 'Table created!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
        `);

        console.log('\nThen visit: http://localhost:1337/api/create-courses-page-table');
        console.log('After success, remove the temporary endpoint.\n');

        // Test translations that will be available
        console.log('📋 Translations that will be added:');
        console.log('  Russian:');
        console.log('    - "Course Details" → "Детали Курса"');
        console.log('    - "Sign Up Today" → "Записаться Сегодня"');
        console.log('    - "Start Learning" → "Начать Обучение"');
        console.log('  Hebrew:');
        console.log('    - "Course Details" → "פרטי הקורס"');
        console.log('    - "Sign Up Today" → "הרשמה היום"');
        console.log('    - "Start Learning" → "התחל ללמוד"');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the test
createTableViaAPI();