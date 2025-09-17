// Quick script to seed career orientation data
const { Client } = require('pg');

async function seedCareerOrientation() {
    // Database connection - Update these with your Railway PostgreSQL credentials
    const client = new Client({
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/strapi',
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
    });

    try {
        await client.connect();
        console.log('🔗 Connected to database');

        // Check if table exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'career_orientation_pages'
            );
        `);

        if (!tableCheck.rows[0].exists) {
            console.log('❌ Table career_orientation_pages does not exist!');
            console.log('📝 Please run the migration first: railway-career-orientation-migration.sql');
            return;
        }

        // Check for existing data
        const existingData = await client.query(
            'SELECT COUNT(*) FROM career_orientation_pages WHERE locale = $1',
            ['en']
        );

        if (existingData.rows[0].count > 0) {
            console.log('📊 Data already exists for locale: en');
            console.log('🔄 Updating existing record...');
            
            // Update existing record with comprehensive data
            await client.query(`
                UPDATE career_orientation_pages 
                SET 
                    hero_main_title = $1,
                    hero_subtitle = $2,
                    hero_description = $3,
                    hero_stat_1_value = $4,
                    hero_stat_1_label = $5,
                    hero_stat_2_value = $6,
                    hero_stat_2_label = $7,
                    hero_stat_3_value = $8,
                    hero_stat_3_label = $9,
                    hero_cta_text = $10,
                    hero_cta_link = $11,
                    hero_badge_text = $12,
                    hero_visible = $13,
                    
                    problems_main_title = $14,
                    problems_subtitle = $15,
                    problems_description = $16,
                    problem_1_title = $17,
                    problem_1_description = $18,
                    problems_visible = $19,
                    
                    solutions_main_title = $20,
                    solutions_subtitle = $21,
                    solutions_visible = $22,
                    
                    process_main_title = $23,
                    process_subtitle = $24,
                    process_visible = $25,
                    
                    career_paths_main_title = $26,
                    career_paths_subtitle = $27,
                    career_paths_visible = $28,
                    
                    expert_name = $29,
                    expert_title = $30,
                    expert_visible = $31,
                    
                    assessment_main_title = $32,
                    assessment_subtitle = $33,
                    assessment_visible = $34,
                    
                    footer_title = $35,
                    footer_subtitle = $36,
                    footer_visible = $37,
                    
                    updated_at = NOW()
                WHERE locale = $38
            `, [
                'AI Career Orientation Program',
                'Discover Your Perfect AI Career Path',
                'Advanced AI-powered assessment to match you with the ideal AI career based on your skills, interests, and market demand.',
                '500+',
                'Career Paths Mapped',
                '95%',
                'Success Rate',
                '15+',
                'AI Specializations',
                'Start Your Journey',
                '#assessment',
                'Free Assessment',
                true,
                
                'Common Career Challenges in AI',
                'We understand the struggles of finding your path',
                'Many professionals face these challenges when entering the AI field',
                'Career Confusion',
                'Too many AI specializations to choose from',
                true,
                
                'Our Comprehensive Career Solutions',
                'Everything you need for AI career success',
                true,
                
                'Your 5-Step Career Discovery Journey',
                'Systematic approach to finding your AI career path',
                true,
                
                'AI Career Paths We Cover',
                'Explore diverse opportunities in artificial intelligence',
                true,
                
                'Dr. Sarah Chen',
                'Senior AI Career Advisor',
                true,
                
                'Free AI Career Assessment',
                'Discover your perfect AI career path in 15 minutes',
                true,
                
                'Ready to Transform Your Career?',
                'Join thousands of professionals who found their AI career path',
                true,
                
                'en'
            ]);
            
            console.log('✅ Career orientation data updated successfully!');
        } else {
            console.log('📝 Inserting new career orientation data...');
            
            // Insert new record
            await client.query(`
                INSERT INTO career_orientation_pages (
                    locale,
                    hero_main_title, hero_subtitle, hero_description,
                    hero_stat_1_value, hero_stat_1_label,
                    hero_stat_2_value, hero_stat_2_label,
                    hero_stat_3_value, hero_stat_3_label,
                    hero_cta_text, hero_cta_link, hero_badge_text, hero_visible,
                    
                    problems_main_title, problems_subtitle, problems_description,
                    problem_1_title, problem_1_description, problems_visible,
                    
                    solutions_main_title, solutions_subtitle, solutions_visible,
                    
                    process_main_title, process_subtitle, process_visible,
                    
                    career_paths_main_title, career_paths_subtitle, career_paths_visible,
                    
                    expert_name, expert_title, expert_visible,
                    
                    assessment_main_title, assessment_subtitle, assessment_visible,
                    
                    footer_title, footer_subtitle, footer_visible,
                    
                    published_at, created_at, updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                    $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
                    $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38,
                    NOW(), NOW(), NOW()
                )
            `, [
                'en',
                'AI Career Orientation Program',
                'Discover Your Perfect AI Career Path',
                'Advanced AI-powered assessment to match you with the ideal AI career based on your skills, interests, and market demand.',
                '500+',
                'Career Paths Mapped',
                '95%',
                'Success Rate',
                '15+',
                'AI Specializations',
                'Start Your Journey',
                '#assessment',
                'Free Assessment',
                true,
                
                'Common Career Challenges in AI',
                'We understand the struggles of finding your path',
                'Many professionals face these challenges when entering the AI field',
                'Career Confusion',
                'Too many AI specializations to choose from',
                true,
                
                'Our Comprehensive Career Solutions',
                'Everything you need for AI career success',
                true,
                
                'Your 5-Step Career Discovery Journey',
                'Systematic approach to finding your AI career path',
                true,
                
                'AI Career Paths We Cover',
                'Explore diverse opportunities in artificial intelligence',
                true,
                
                'Dr. Sarah Chen',
                'Senior AI Career Advisor',
                true,
                
                'Free AI Career Assessment',
                'Discover your perfect AI career path in 15 minutes',
                true,
                
                'Ready to Transform Your Career?',
                'Join thousands of professionals who found their AI career path',
                true
            ]);
            
            console.log('✅ Career orientation data inserted successfully!');
        }

        // Verify the data
        const verifyData = await client.query(
            'SELECT hero_main_title, hero_subtitle, problems_main_title, solutions_main_title FROM career_orientation_pages WHERE locale = $1',
            ['en']
        );

        if (verifyData.rows.length > 0) {
            console.log('\n📊 Verification - Sample data from database:');
            console.log('Hero Title:', verifyData.rows[0].hero_main_title);
            console.log('Hero Subtitle:', verifyData.rows[0].hero_subtitle);
            console.log('Problems Title:', verifyData.rows[0].problems_main_title);
            console.log('Solutions Title:', verifyData.rows[0].solutions_main_title);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

// Run the seeding
seedCareerOrientation();