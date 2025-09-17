#!/usr/bin/env node

/**
 * Multilingual Page-Based Schema Implementation
 * Creates and migrates to new multilingual table structure
 * Supports EN, RU, HE languages for all page content
 */

const pg = require('pg');
require('dotenv').config();

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aistudio_db';

class MultilingualMigration {
    constructor() {
        this.client = new pg.Client({
            connectionString: DATABASE_URL,
            ssl: DATABASE_URL.includes('railway.app') ? { rejectUnauthorized: false } : false
        });
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('✅ Connected to database');
            return true;
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            return false;
        }
    }

    async createPageTable(tableName, sections) {
        const query = `
            CREATE TABLE IF NOT EXISTS ${tableName} (
                id SERIAL PRIMARY KEY,
                section_name VARCHAR(100) UNIQUE NOT NULL,
                content_en JSONB DEFAULT '{}',
                content_ru JSONB DEFAULT '{}',
                content_he JSONB DEFAULT '{}',
                visible BOOLEAN DEFAULT true,
                display_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            -- Add indexes for performance
            CREATE INDEX IF NOT EXISTS idx_${tableName}_visible ON ${tableName}(visible);
            CREATE INDEX IF NOT EXISTS idx_${tableName}_order ON ${tableName}(display_order);
        `;

        try {
            await this.client.query(query);
            console.log(`✅ Created table: ${tableName}`);

            // Insert default sections if provided
            if (sections && sections.length > 0) {
                for (let i = 0; i < sections.length; i++) {
                    await this.insertSection(tableName, sections[i], i + 1);
                }
            }
            return true;
        } catch (error) {
            console.error(`❌ Failed to create ${tableName}:`, error.message);
            return false;
        }
    }

    async insertSection(tableName, section, order) {
        const query = `
            INSERT INTO ${tableName} (section_name, content_en, content_ru, content_he, display_order)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (section_name) DO UPDATE
            SET content_en = EXCLUDED.content_en,
                content_ru = EXCLUDED.content_ru,
                content_he = EXCLUDED.content_he,
                display_order = EXCLUDED.display_order,
                updated_at = NOW()
        `;

        const defaultContent = {
            title: `${section.name} Title`,
            subtitle: `${section.name} Subtitle`,
            description: `Content for ${section.name} section`
        };

        const values = [
            section.key,
            section.content_en || defaultContent,
            section.content_ru || defaultContent,
            section.content_he || defaultContent,
            order
        ];

        try {
            await this.client.query(query, values);
            console.log(`  ✓ Added section: ${section.key}`);
        } catch (error) {
            console.error(`  ✗ Failed to add section ${section.key}:`, error.message);
        }
    }

    async migrateExistingHomeData() {
        console.log('\n📦 Migrating existing nd_home data to multilingual structure...');

        try {
            // Check if nd_home exists and has data
            const checkQuery = 'SELECT * FROM nd_home LIMIT 1';
            const result = await this.client.query(checkQuery);

            if (result.rows.length === 0) {
                console.log('  ℹ️ No existing data to migrate');
                return;
            }

            const existingData = result.rows[0];

            // Migrate each section
            const sections = [
                { key: 'hero', data: existingData.hero },
                { key: 'features', data: existingData.features },
                { key: 'courses', data: existingData.courses },
                { key: 'testimonials', data: existingData.testimonials },
                { key: 'awards', data: existingData.awards },
                { key: 'faq', data: existingData.faq },
                { key: 'blog_preview', data: existingData.blog },
                { key: 'cta_1', data: existingData.cta_1 },
                { key: 'cta_2', data: existingData.cta_2 }
            ];

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                if (section.data) {
                    const query = `
                        INSERT INTO nd_home_page (section_name, content_en, content_ru, content_he, visible, display_order)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        ON CONFLICT (section_name) DO UPDATE
                        SET content_en = EXCLUDED.content_en,
                            visible = EXCLUDED.visible,
                            updated_at = NOW()
                    `;

                    // Extract content based on existing structure
                    let content = {};
                    let visible = true;

                    if (section.data.content_en) {
                        content = section.data.content_en;
                        visible = section.data.visible !== false;
                    } else if (section.data.content) {
                        content = section.data.content;
                        visible = section.data.visible !== false;
                    } else {
                        content = section.data;
                    }

                    const values = [
                        section.key,
                        content,
                        content, // Use English as fallback for now
                        content, // Use English as fallback for now
                        visible,
                        i + 1
                    ];

                    await this.client.query(query, values);
                    console.log(`  ✓ Migrated section: ${section.key}`);
                }
            }

            console.log('✅ Migration complete');
        } catch (error) {
            console.error('❌ Migration failed:', error);
        }
    }

    async createAllPageTables() {
        console.log('\n📝 Creating all page tables...\n');

        // Define all pages and their sections
        const pages = [
            {
                name: 'nd_home_page',
                sections: [
                    { key: 'hero', name: 'Hero' },
                    { key: 'course_categories', name: 'Course Categories' },
                    { key: 'about', name: 'About Us' },
                    { key: 'featured_courses', name: 'Featured Courses' },
                    { key: 'why_choose', name: 'Why Choose Us' },
                    { key: 'pricing_preview', name: 'Pricing Preview' },
                    { key: 'process', name: 'Process Steps' },
                    { key: 'awards', name: 'Awards' },
                    { key: 'testimonials', name: 'Testimonials' },
                    { key: 'faq', name: 'FAQ' },
                    { key: 'blog_preview', name: 'Blog Preview' },
                    { key: 'track', name: 'Track Ticker' },
                    { key: 'cta', name: 'Call to Action' }
                ]
            },
            {
                name: 'nd_about_page',
                sections: [
                    { key: 'hero', name: 'Hero' },
                    { key: 'mission', name: 'Mission' },
                    { key: 'vision', name: 'Vision' },
                    { key: 'values', name: 'Values' },
                    { key: 'team', name: 'Team' },
                    { key: 'history', name: 'History' },
                    { key: 'achievements', name: 'Achievements' },
                    { key: 'partners', name: 'Partners' }
                ]
            },
            {
                name: 'nd_courses_page',
                sections: [
                    { key: 'hero', name: 'Hero' },
                    { key: 'filters', name: 'Filters' },
                    { key: 'course_grid', name: 'Course Grid' },
                    { key: 'featured_banner', name: 'Featured Banner' },
                    { key: 'testimonials', name: 'Testimonials' },
                    { key: 'cta', name: 'Call to Action' }
                ]
            },
            {
                name: 'nd_blog_page',
                sections: [
                    { key: 'hero', name: 'Hero' },
                    { key: 'featured_posts', name: 'Featured Posts' },
                    { key: 'categories', name: 'Categories' },
                    { key: 'recent_posts', name: 'Recent Posts' },
                    { key: 'newsletter', name: 'Newsletter' }
                ]
            },
            {
                name: 'nd_contact_page',
                sections: [
                    { key: 'hero', name: 'Hero' },
                    { key: 'contact_info', name: 'Contact Info' },
                    { key: 'office_locations', name: 'Office Locations' },
                    { key: 'contact_form', name: 'Contact Form' },
                    { key: 'map', name: 'Map' },
                    { key: 'business_hours', name: 'Business Hours' },
                    { key: 'social_links', name: 'Social Links' }
                ]
            },
            {
                name: 'nd_pricing_page',
                sections: [
                    { key: 'hero', name: 'Hero' },
                    { key: 'plans', name: 'Pricing Plans' },
                    { key: 'features_comparison', name: 'Features Comparison' },
                    { key: 'faqs', name: 'FAQs' },
                    { key: 'testimonials', name: 'Testimonials' },
                    { key: 'cta', name: 'Call to Action' }
                ]
            }
        ];

        // Create each page table
        for (const page of pages) {
            await this.createPageTable(page.name, page.sections);
        }
    }

    async updateSharedTables() {
        console.log('\n📚 Updating shared tables for multilingual support...\n');

        // Update nd_courses table
        const coursesQuery = `
            ALTER TABLE nd_courses
            ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
            ADD COLUMN IF NOT EXISTS title_ru VARCHAR(255),
            ADD COLUMN IF NOT EXISTS title_he VARCHAR(255),
            ADD COLUMN IF NOT EXISTS description_en TEXT,
            ADD COLUMN IF NOT EXISTS description_ru TEXT,
            ADD COLUMN IF NOT EXISTS description_he TEXT;

            -- Copy existing data to English columns
            UPDATE nd_courses
            SET title_en = COALESCE(title_en, title),
                description_en = COALESCE(description_en, description)
            WHERE title_en IS NULL;
        `;

        try {
            await this.client.query(coursesQuery);
            console.log('✅ Updated nd_courses table');
        } catch (error) {
            console.error('❌ Failed to update nd_courses:', error.message);
        }

        // Update nd_blog_posts table if exists
        const blogQuery = `
            CREATE TABLE IF NOT EXISTS nd_blog_posts (
                id SERIAL PRIMARY KEY,
                title_en VARCHAR(255),
                title_ru VARCHAR(255),
                title_he VARCHAR(255),
                content_en TEXT,
                content_ru TEXT,
                content_he TEXT,
                author VARCHAR(255),
                featured_image VARCHAR(500),
                published_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `;

        try {
            await this.client.query(blogQuery);
            console.log('✅ Created/Updated nd_blog_posts table');
        } catch (error) {
            console.error('❌ Failed to create nd_blog_posts:', error.message);
        }
    }

    async createSampleData() {
        console.log('\n🎨 Adding sample multilingual content...\n');

        // Add sample awards data in 3 languages
        const awardsQuery = `
            INSERT INTO nd_home_page (section_name, content_en, content_ru, content_he, visible, display_order)
            VALUES ('awards', $1, $2, $3, true, 8)
            ON CONFLICT (section_name) DO UPDATE
            SET content_en = EXCLUDED.content_en,
                content_ru = EXCLUDED.content_ru,
                content_he = EXCLUDED.content_he,
                updated_at = NOW()
        `;

        const awardsEn = {
            title: "Awards That Define Our Excellence.",
            subtitle: "Recognition of our commitment to quality education",
            items: [
                {
                    year: "2024",
                    title: "Best Online Learning Platform",
                    description: "Awarded by EdTech Innovation Awards for outstanding online education delivery",
                    icon: "🏆"
                },
                {
                    year: "2023",
                    title: "Excellence in AI Education",
                    description: "Recognized for pioneering AI and machine learning curriculum",
                    icon: "🥇"
                },
                {
                    year: "2023",
                    title: "Top Student Satisfaction",
                    description: "98% student satisfaction rate across all courses",
                    icon: "⭐"
                },
                {
                    year: "2022",
                    title: "Innovation in Teaching",
                    description: "Revolutionary approach to hands-on technical education",
                    icon: "💡"
                }
            ]
        };

        const awardsRu = {
            title: "Награды, определяющие наше превосходство.",
            subtitle: "Признание нашей приверженности качественному образованию",
            items: [
                {
                    year: "2024",
                    title: "Лучшая платформа онлайн-обучения",
                    description: "Награждена EdTech Innovation Awards за выдающееся онлайн-образование",
                    icon: "🏆"
                },
                {
                    year: "2023",
                    title: "Превосходство в обучении ИИ",
                    description: "Признание за новаторскую учебную программу по ИИ и машинному обучению",
                    icon: "🥇"
                },
                {
                    year: "2023",
                    title: "Высшая удовлетворенность студентов",
                    description: "98% удовлетворенность студентов по всем курсам",
                    icon: "⭐"
                },
                {
                    year: "2022",
                    title: "Инновации в преподавании",
                    description: "Революционный подход к практическому техническому образованию",
                    icon: "💡"
                }
            ]
        };

        const awardsHe = {
            title: "פרסים שמגדירים את המצוינות שלנו.",
            subtitle: "הכרה במחויבות שלנו לחינוך איכותי",
            items: [
                {
                    year: "2024",
                    title: "פלטפורמת הלמידה המקוונת הטובה ביותר",
                    description: "זכתה בפרס EdTech Innovation Awards על חינוך מקוון יוצא דופן",
                    icon: "🏆"
                },
                {
                    year: "2023",
                    title: "מצוינות בחינוך AI",
                    description: "הוכרה על תוכנית לימודים חלוצית ב-AI ולמידת מכונה",
                    icon: "🥇"
                },
                {
                    year: "2023",
                    title: "שביעות רצון גבוהה של סטודנטים",
                    description: "98% שביעות רצון של סטודנטים בכל הקורסים",
                    icon: "⭐"
                },
                {
                    year: "2022",
                    title: "חדשנות בהוראה",
                    description: "גישה מהפכנית לחינוך טכני מעשי",
                    icon: "💡"
                }
            ]
        };

        try {
            await this.client.query(awardsQuery, [awardsEn, awardsRu, awardsHe]);
            console.log('✅ Added multilingual awards content');
        } catch (error) {
            console.error('❌ Failed to add awards content:', error.message);
        }
    }

    async runQA() {
        console.log('\n🧪 Running QA tests...\n');

        const tests = [
            {
                name: 'Check nd_home_page table exists',
                query: "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'nd_home_page')"
            },
            {
                name: 'Check multilingual columns exist',
                query: "SELECT column_name FROM information_schema.columns WHERE table_name = 'nd_home_page' AND column_name IN ('content_en', 'content_ru', 'content_he')"
            },
            {
                name: 'Check awards section exists',
                query: "SELECT section_name, visible FROM nd_home_page WHERE section_name = 'awards'"
            },
            {
                name: 'Test English content retrieval',
                query: "SELECT section_name, content_en as content FROM nd_home_page WHERE visible = true ORDER BY display_order LIMIT 3"
            },
            {
                name: 'Test Russian content retrieval',
                query: "SELECT section_name, content_ru as content FROM nd_home_page WHERE visible = true ORDER BY display_order LIMIT 3"
            },
            {
                name: 'Test Hebrew content retrieval',
                query: "SELECT section_name, content_he as content FROM nd_home_page WHERE visible = true ORDER BY display_order LIMIT 3"
            },
            {
                name: 'Test fallback logic',
                query: "SELECT section_name, COALESCE(NULLIF(content_ru::text, '{}'), content_en::text) as content FROM nd_home_page LIMIT 3"
            }
        ];

        let passed = 0;
        let failed = 0;

        for (const test of tests) {
            try {
                const result = await this.client.query(test.query);
                if (result.rows.length > 0) {
                    console.log(`✅ ${test.name}`);
                    passed++;
                } else {
                    console.log(`⚠️ ${test.name} - No data returned`);
                    failed++;
                }
            } catch (error) {
                console.log(`❌ ${test.name} - ${error.message}`);
                failed++;
            }
        }

        console.log(`\n📊 QA Results: ${passed} passed, ${failed} failed`);
        return failed === 0;
    }

    async disconnect() {
        await this.client.end();
        console.log('\n👋 Disconnected from database');
    }

    async run() {
        console.log('🚀 Starting Multilingual Schema Implementation\n');
        console.log('=' .repeat(50));

        if (!await this.connect()) {
            console.error('Failed to connect to database. Exiting...');
            process.exit(1);
        }

        // Create all page tables
        await this.createAllPageTables();

        // Migrate existing data
        await this.migrateExistingHomeData();

        // Update shared tables
        await this.updateSharedTables();

        // Add sample data
        await this.createSampleData();

        // Run QA tests
        const qaSuccess = await this.runQA();

        // Disconnect
        await this.disconnect();

        console.log('\n' + '=' .repeat(50));
        if (qaSuccess) {
            console.log('✅ Multilingual schema implementation SUCCESSFUL!');
            console.log('\n📌 Next Steps:');
            console.log('1. Update server.js API endpoints to use new schema');
            console.log('2. Update admin panel to support language switching');
            console.log('3. Test with different locales (?locale=ru, ?locale=he)');
        } else {
            console.log('⚠️ Implementation completed with some QA failures');
            console.log('Please review the errors above and fix any issues');
        }
    }
}

// Run the migration
const migration = new MultilingualMigration();
migration.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});