const { Pool } = require('pg');

// Use the same connection as server
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
        ? { rejectUnauthorized: false }
        : false
});

async function fixRussianTranslations() {
    console.log('🔧 Fixing Russian translations for home page...\n');

    try {
        // Update hero section with proper Russian translation
        const heroUpdate = await pool.query(`
            UPDATE nd_home
            SET content_ru = jsonb_set(
                COALESCE(content_ru, '{}'::jsonb),
                '{title}',
                '"Студия ИИ"'::jsonb
            )
            WHERE section_key = 'hero'
            RETURNING content_ru->>'title' as title
        `);

        console.log('✅ Hero title updated to:', heroUpdate.rows[0]?.title);

        // Update subtitle
        await pool.query(`
            UPDATE nd_home
            SET content_ru = jsonb_set(
                content_ru,
                '{subtitle}',
                '"Платформа Онлайн Обучения"'::jsonb
            )
            WHERE section_key = 'hero'
        `);

        // Update description
        await pool.query(`
            UPDATE nd_home
            SET content_ru = jsonb_set(
                content_ru,
                '{description}',
                '"Откройте для себя будущее образования с нашими передовыми курсами по ИИ и машинному обучению"'::jsonb
            )
            WHERE section_key = 'hero'
        `);

        // Update buttons
        await pool.query(`
            UPDATE nd_home
            SET content_ru = jsonb_set(
                jsonb_set(
                    content_ru,
                    '{cta_text_1}',
                    '"Начать Обучение"'::jsonb
                ),
                '{cta_text_2}',
                '"Смотреть Курсы"'::jsonb
            )
            WHERE section_key = 'hero'
        `);

        console.log('✅ Hero section fully updated with Russian translations');

        // Update features section
        await pool.query(`
            UPDATE nd_home
            SET content_ru = jsonb_set(
                jsonb_set(
                    jsonb_set(
                        COALESCE(content_ru, '{}'::jsonb),
                        '{title}',
                        '"Почему выбирают нас"'::jsonb
                    ),
                    '{subtitle}',
                    '"Наши преимущества"'::jsonb
                ),
                '{description}',
                '"Мы предлагаем лучшие курсы для вашего профессионального роста"'::jsonb
            )
            WHERE section_key = 'features'
        `);

        console.log('✅ Features section updated');

        // Update navigation
        await pool.query(`
            UPDATE nd_home
            SET content_ru = jsonb_set(
                jsonb_set(
                    jsonb_set(
                        jsonb_set(
                            jsonb_set(
                                jsonb_set(
                                    COALESCE(content_ru, '{}'::jsonb),
                                    '{home}',
                                    '"Главная"'::jsonb
                                ),
                                '{courses}',
                                '"Курсы"'::jsonb
                            ),
                            '{pricing}',
                            '"Цены"'::jsonb
                        ),
                        '{blog}',
                        '"Блог"'::jsonb
                    ),
                    '{teachers}',
                    '"Преподаватели"'::jsonb
                ),
                '{about_us}',
                '"О нас"'::jsonb
            )
            WHERE section_key = 'navigation'
        `);

        console.log('✅ Navigation updated');

        // Verify the updates
        const verifyResult = await pool.query(`
            SELECT
                section_key,
                content_ru->>'title' as title_ru
            FROM nd_home
            WHERE section_key IN ('hero', 'features', 'navigation')
        `);

        console.log('\n📊 Verification:');
        verifyResult.rows.forEach(row => {
            console.log(`  ${row.section_key}: ${row.title_ru || 'No title'}`);
        });

        console.log('\n🎉 Russian translations fixed!');
        console.log('\n📝 Test at: http://localhost:3005/home.html?locale=ru');
        console.log('   You should now see "Студия ИИ" instead of test data');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

fixRussianTranslations();