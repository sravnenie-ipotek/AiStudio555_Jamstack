/**
 * BLOG SCHEMA ENHANCEMENT SCRIPT
 * Enhances blog_posts table to follow single-table pattern from course system
 * Adds comprehensive fields for full drill-down functionality
 */

const { Client } = require('pg');

async function enhanceBlogSchema() {
    console.log('🔧 Enhancing blog_posts schema following course pattern...\n');

    let client;

    try {
        // Connect to database
        const isProduction = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost');

        client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: isProduction ? { rejectUnauthorized: false } : false
        });

        await client.connect();
        console.log('✅ Connected to database');

        // Check current schema
        console.log('📊 Checking current blog_posts schema...');
        const currentSchema = await client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'blog_posts'
            ORDER BY ordinal_position;
        `);

        console.log('Current columns:', currentSchema.rows.map(r => r.column_name).join(', '));

        // Add new columns following course pattern
        console.log('\n🏗️ Adding enhanced fields...');

        const enhancementQueries = [
            // Media & Rich Content
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image_url TEXT`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS video_url TEXT`,

            // Complex Content Structure (following course lessons pattern)
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_sections JSONB DEFAULT '[]'`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS related_posts JSONB DEFAULT '[]'`,

            // Author Enhancement (following course instructor pattern)
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_bio TEXT`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_image_url TEXT`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_social_links JSONB DEFAULT '{}'`,

            // SEO & Meta
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255)`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 5`,

            // Engagement & Stats
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0`,

            // Status Flags (exactly like course pattern)
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true`,

            // Multi-language Support (following course pattern)
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title_ru VARCHAR(255)`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_ru TEXT`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt_ru TEXT`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title_he VARCHAR(255)`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_he TEXT`,
            `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt_he TEXT`
        ];

        for (const query of enhancementQueries) {
            try {
                await client.query(query);
                const columnName = query.match(/ADD COLUMN IF NOT EXISTS (\w+)/)?.[1];
                console.log(`  ✅ Added: ${columnName}`);
            } catch (error) {
                console.log(`  ⚠️ Skipped (may exist): ${error.message.split('\n')[0]}`);
            }
        }

        // Create indexes for performance
        console.log('\n📈 Creating performance indexes...');
        const indexQueries = [
            `CREATE INDEX IF NOT EXISTS idx_blog_posts_id ON blog_posts(id)`,
            `CREATE INDEX IF NOT EXISTS idx_blog_posts_locale_published ON blog_posts(locale, is_published)`,
            `CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured, is_visible)`,
            `CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category)`,
            `CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC)`
        ];

        for (const query of indexQueries) {
            try {
                await client.query(query);
                const indexName = query.match(/CREATE INDEX IF NOT EXISTS (\w+)/)?.[1];
                console.log(`  ✅ Index: ${indexName}`);
            } catch (error) {
                console.log(`  ⚠️ Index exists: ${error.message.split('\n')[0]}`);
            }
        }

        // Update existing records with sample enhanced data
        console.log('\n🔄 Updating existing records with enhanced data...');

        const existingPosts = await client.query('SELECT id, title, content FROM blog_posts LIMIT 10');

        for (const post of existingPosts.rows) {
            // Calculate reading time (250 words per minute average)
            const wordCount = post.content ? post.content.split(' ').length : 100;
            const readingTime = Math.max(1, Math.ceil(wordCount / 250));

            // Add sample enhanced data
            await client.query(`
                UPDATE blog_posts
                SET
                    reading_time = $1,
                    meta_title = $2,
                    meta_description = $3,
                    is_published = true,
                    is_visible = true,
                    tags = $4,
                    content_sections = $5,
                    featured_image_url = $6
                WHERE id = $7
            `, [
                readingTime,
                post.title,
                (post.content || '').substring(0, 150) + '...',
                JSON.stringify(['Technology', 'Education', 'AI']),
                JSON.stringify([
                    { id: 1, title: 'Introduction', content: post.content?.substring(0, 200) || 'Introduction content...' },
                    { id: 2, title: 'Main Content', content: post.content?.substring(200) || 'Main content...' }
                ]),
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop' // Default tech image
            ]);

            console.log(`  ✅ Enhanced post: ${post.title}`);
        }

        // Show final schema
        console.log('\n📋 Final enhanced schema:');
        const finalSchema = await client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'blog_posts'
            ORDER BY ordinal_position;
        `);

        finalSchema.rows.forEach(row => {
            console.log(`  • ${row.column_name} (${row.data_type})`);
        });

        console.log('\n🎉 Blog schema enhancement complete!');
        console.log('📊 Ready for single-table pattern with JSONB support');
        console.log('🔗 Compatible with course drill-down architecture');

    } catch (error) {
        console.error('❌ Enhancement failed:', error.message);
        throw error;
    } finally {
        if (client) {
            await client.end();
        }
    }
}

// Export for use in other scripts
module.exports = { enhanceBlogSchema };

// Run if called directly
if (require.main === module) {
    enhanceBlogSchema();
}