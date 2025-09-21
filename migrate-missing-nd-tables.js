/**
 * SAFE MIGRATION: Add Missing ND_* Tables to Production
 *
 * This script safely adds missing nd_* tables to production without
 * overwriting existing data. Uses IF NOT EXISTS for all operations.
 */

const { Pool } = require('pg');

async function migrateMissingTables() {
    console.log('🔄 STARTING SAFE MIGRATION FOR MISSING ND_* TABLES');
    console.log('==================================================');

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable not set');
        console.error('💡 This script must run with production DATABASE_URL');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // 1. Check what tables currently exist
        console.log('📊 Checking existing tables...');
        const existingTables = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name LIKE 'nd_%'
            ORDER BY table_name
        `);

        console.log('Existing nd_* tables:');
        existingTables.rows.forEach(row => {
            console.log(`   ✅ ${row.table_name}`);
        });

        const existingTableNames = existingTables.rows.map(row => row.table_name);

        // 2. Define all required nd_* tables
        const requiredTables = [
            'nd_home',
            'nd_courses',
            'nd_courses_page',
            'nd_course_details_page',
            'nd_menu',
            'nd_footer',
            'nd_pricing_page',
            'nd_teachers_page',
            'nd_career_center_platform_page',
            'nd_blog_page'
        ];

        console.log('\\n📋 Required tables for translation system:');
        const missingTables = [];
        requiredTables.forEach(table => {
            const exists = existingTableNames.includes(table);
            const status = exists ? '✅ EXISTS' : '❌ MISSING';
            console.log(`   ${status} ${table}`);
            if (!exists) {
                missingTables.push(table);
            }
        });

        if (missingTables.length === 0) {
            console.log('\\n🎉 All required tables already exist! No migration needed.');
            return;
        }

        console.log(`\\n🔧 Will create ${missingTables.length} missing tables:`);
        missingTables.forEach(table => console.log(`   🆕 ${table}`));

        // 3. Create missing tables (SAFE - uses IF NOT EXISTS)
        console.log('\\n🚀 Creating missing tables...');

        // nd_home table
        if (missingTables.includes('nd_home')) {
            console.log('Creating nd_home...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS nd_home (
                    id SERIAL PRIMARY KEY,
                    section_key VARCHAR(100) UNIQUE NOT NULL,
                    section_name VARCHAR(255),
                    content_en JSONB DEFAULT '{}',
                    content_ru JSONB DEFAULT '{}',
                    content_he JSONB DEFAULT '{}',
                    visible BOOLEAN DEFAULT true,
                    animations_enabled BOOLEAN DEFAULT true,
                    order_index INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        }

        // nd_courses table
        if (missingTables.includes('nd_courses')) {
            console.log('Creating nd_courses...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS nd_courses (
                    id SERIAL PRIMARY KEY,
                    course_key VARCHAR(100) UNIQUE,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    short_description TEXT,
                    price DECIMAL(10,2),
                    old_price DECIMAL(10,2),
                    currency VARCHAR(10) DEFAULT 'USD',
                    featured BOOLEAN DEFAULT false,
                    published BOOLEAN DEFAULT true,
                    visible BOOLEAN DEFAULT true,
                    duration VARCHAR(100),
                    level VARCHAR(50),
                    instructor VARCHAR(255),
                    image_url TEXT,
                    video_url TEXT,
                    demo_url TEXT,
                    tags TEXT[],
                    meta_title VARCHAR(255),
                    meta_description TEXT,
                    meta_keywords TEXT,
                    slug VARCHAR(255) UNIQUE,
                    order_index INTEGER DEFAULT 0,
                    start_date DATE,
                    end_date DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        }

        // nd_courses_page table (UI translations for courses page)
        if (missingTables.includes('nd_courses_page')) {
            console.log('Creating nd_courses_page...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS nd_courses_page (
                    id SERIAL PRIMARY KEY,
                    section_key VARCHAR(100) UNIQUE NOT NULL,
                    section_name VARCHAR(255),
                    content_en JSONB DEFAULT '{}',
                    content_ru JSONB DEFAULT '{}',
                    content_he JSONB DEFAULT '{}',
                    visible BOOLEAN DEFAULT true,
                    animations_enabled BOOLEAN DEFAULT true,
                    order_index INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        }

        // nd_course_details_page table
        if (missingTables.includes('nd_course_details_page')) {
            console.log('Creating nd_course_details_page...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS nd_course_details_page (
                    id SERIAL PRIMARY KEY,
                    section_key VARCHAR(100) UNIQUE NOT NULL,
                    section_name VARCHAR(255),
                    content_en JSONB DEFAULT '{}',
                    content_ru JSONB DEFAULT '{}',
                    content_he JSONB DEFAULT '{}',
                    visible BOOLEAN DEFAULT true,
                    order_index INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        }

        // nd_menu table
        if (missingTables.includes('nd_menu')) {
            console.log('Creating nd_menu...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS nd_menu (
                    id SERIAL PRIMARY KEY,
                    parent_id INTEGER REFERENCES nd_menu(id) ON DELETE CASCADE,
                    label_en VARCHAR(255),
                    label_ru VARCHAR(255),
                    label_he VARCHAR(255),
                    url VARCHAR(500),
                    order_index INTEGER DEFAULT 0,
                    visible BOOLEAN DEFAULT true,
                    target VARCHAR(20) DEFAULT '_self',
                    is_dropdown BOOLEAN DEFAULT false,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        }

        // nd_footer table
        if (missingTables.includes('nd_footer')) {
            console.log('Creating nd_footer...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS nd_footer (
                    id SERIAL PRIMARY KEY,
                    section_type VARCHAR(50),
                    column_number INTEGER DEFAULT 1,
                    item_type VARCHAR(50),
                    content_en TEXT,
                    content_ru TEXT,
                    content_he TEXT,
                    url VARCHAR(500),
                    order_index INTEGER DEFAULT 0,
                    visible BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        }

        // nd_pricing_page table
        if (missingTables.includes('nd_pricing_page')) {
            console.log('Creating nd_pricing_page...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS nd_pricing_page (
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
        }

        // nd_teachers_page table
        if (missingTables.includes('nd_teachers_page')) {
            console.log('Creating nd_teachers_page...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS nd_teachers_page (
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
        }

        // nd_career_center_platform_page table
        if (missingTables.includes('nd_career_center_platform_page')) {
            console.log('Creating nd_career_center_platform_page...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS nd_career_center_platform_page (
                    id SERIAL PRIMARY KEY,
                    section_name VARCHAR(100) UNIQUE NOT NULL,
                    content_en JSONB DEFAULT '{}',
                    content_ru JSONB DEFAULT '{}',
                    content_he JSONB DEFAULT '{}',
                    visible BOOLEAN DEFAULT true,
                    display_order INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        }

        // nd_blog_page table
        if (missingTables.includes('nd_blog_page')) {
            console.log('Creating nd_blog_page...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS nd_blog_page (
                    id SERIAL PRIMARY KEY,
                    section_key VARCHAR(100) UNIQUE NOT NULL,
                    section_name VARCHAR(255),
                    content_en JSONB DEFAULT '{}',
                    content_ru JSONB DEFAULT '{}',
                    content_he JSONB DEFAULT '{}',
                    visible BOOLEAN DEFAULT true,
                    display_order INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        }

        console.log('\\n✅ All missing tables created successfully!');

        // 4. Insert basic sample data for immediate functionality
        console.log('\\n📝 Adding minimal sample data...');

        // Add minimal nd_home data
        if (missingTables.includes('nd_home')) {
            await pool.query(`
                INSERT INTO nd_home (section_key, section_name, content_en, content_ru, content_he)
                VALUES
                ('hero', 'Hero Section',
                 '{"title": "Unlock Potential With Proven Courses", "subtitle": "Expert-Led AI & Machine Learning Training"}',
                 '{"title": "Раскройте потенциал с проверенными курсами", "subtitle": "Обучение ИИ и машинному обучению под руководством экспертов"}',
                 '{"title": "פתח פוטנציאל עם קורסים מוכחים", "subtitle": "הכשרת AI ולמידת מכונה בהנחיית מומחים"}'
                )
                ON CONFLICT (section_key) DO NOTHING
            `);
        }

        // Add minimal nd_courses_page data
        if (missingTables.includes('nd_courses_page')) {
            await pool.query(`
                INSERT INTO nd_courses_page (section_key, section_name, content_en, content_ru, content_he)
                VALUES
                ('hero', 'Courses Hero',
                 '{"title": "Our Courses", "subtitle": "Choose from our selection of expert-led courses"}',
                 '{"title": "Наши курсы", "subtitle": "Выберите из нашего выбора курсов под руководством экспертов"}',
                 '{"title": "הקורסים שלנו", "subtitle": "בחר מהמבחר שלנו של קורסים בהנחיית מומחים"}'
                )
                ON CONFLICT (section_key) DO NOTHING
            `);
        }

        // Add minimal nd_pricing_page data
        if (missingTables.includes('nd_pricing_page')) {
            await pool.query(`
                INSERT INTO nd_pricing_page (section_name, content_en, content_ru, content_he)
                VALUES
                ('hero',
                 '{"title": "Pricing Plans", "subtitle": "Choose the plan that works for you"}',
                 '{"title": "Тарифные планы", "subtitle": "Выберите план, который вам подходит"}',
                 '{"title": "תוכניות תמחור", "subtitle": "בחר את התוכנית שמתאימה לך"}'
                )
                ON CONFLICT (section_name) DO NOTHING
            `);
        }

        // Add minimal nd_teachers_page data
        if (missingTables.includes('nd_teachers_page')) {
            await pool.query(`
                INSERT INTO nd_teachers_page (section_name, content_en, content_ru, content_he)
                VALUES
                ('hero',
                 '{"title": "Our Teachers", "subtitle": "Learn from industry experts"}',
                 '{"title": "Наши учителя", "subtitle": "Учитесь у экспертов отрасли"}',
                 '{"title": "המורים שלנו", "subtitle": "למד ממומחי התעשייה"}'
                )
                ON CONFLICT (section_name) DO NOTHING
            `);
        }

        console.log('✅ Sample data added successfully!');

        // 5. Verify migration
        console.log('\\n🔍 Verifying migration...');
        const finalCheck = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name LIKE 'nd_%'
            ORDER BY table_name
        `);

        console.log('Final table count:');
        finalCheck.rows.forEach(row => {
            console.log(`   ✅ ${row.table_name}`);
        });

        console.log('\\n🎉 MIGRATION COMPLETED SUCCESSFULLY!');
        console.log('=====================================');
        console.log(`✅ Created ${missingTables.length} missing tables`);
        console.log(`✅ Added sample data for immediate functionality`);
        console.log(`✅ Total nd_* tables: ${finalCheck.rows.length}`);
        console.log('🚀 Production language switching should now work!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateMissingTables()
        .then(() => {
            console.log('\\n✅ Migration script completed successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('\\n❌ Migration script failed:', error);
            process.exit(1);
        });
}

module.exports = migrateMissingTables;