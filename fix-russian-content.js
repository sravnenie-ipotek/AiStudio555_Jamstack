const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
        ? { rejectUnauthorized: false }
        : false
});

async function fixRussianContent() {
    console.log('🔧 Fixing Russian content for home page...\n');

    try {
        // Fix hero section
        const heroQuery = `
            UPDATE nd_home
            SET content_ru = '${JSON.stringify({
                title: "Студия ИИ",
                subtitle: "Платформа Онлайн Обучения",
                description: "Откройте для себя будущее образования с нашими передовыми курсами по ИИ и машинному обучению",
                cta_text_1: "Начать Обучение",
                cta_text_2: "Смотреть Курсы",
                welcome_text: "Добро пожаловать в",
                hero_image_alt: "Студия ИИ Герой"
            })}'::jsonb
            WHERE section_key = 'hero'
            RETURNING section_key
        `;

        const heroResult = await pool.query(heroQuery);
        console.log(`✅ Hero section updated: ${heroResult.rowCount} row(s)`);

        // Fix features section
        const featuresQuery = `
            UPDATE nd_home
            SET content_ru = '${JSON.stringify({
                title: "Почему выбирают нас",
                subtitle: "Наши преимущества",
                description: "Передовое образование для вашего успеха",
                feature_1_title: "Экспертные преподаватели",
                feature_1_description: "Учитесь у лидеров индустрии с многолетним опытом",
                feature_2_title: "Гибкое обучение",
                feature_2_description: "Учитесь в своем темпе с доступом 24/7",
                feature_3_title: "Практические проекты",
                feature_3_description: "Применяйте знания в реальных проектах",
                feature_4_title: "Сертификация",
                feature_4_description: "Получите признанные сертификаты",
                feature_5_title: "Поддержка карьеры",
                feature_5_description: "Помощь в трудоустройстве и развитии карьеры",
                feature_6_title: "Сообщество",
                feature_6_description: "Присоединяйтесь к активному сообществу учащихся"
            })}'::jsonb
            WHERE section_key = 'features'
            RETURNING section_key
        `;

        const featuresResult = await pool.query(featuresQuery);
        console.log(`✅ Features section updated: ${featuresResult.rowCount} row(s)`);

        // Fix navigation
        const navQuery = `
            UPDATE nd_home
            SET content_ru = '${JSON.stringify({
                home: "Главная",
                courses: "Курсы",
                pricing: "Цены",
                blog: "Блог",
                teachers: "Преподаватели",
                about_us: "О нас",
                career_orientation: "Профориентация",
                career_center: "Центр Карьеры",
                contact: "Контакты",
                sign_up: "Регистрация"
            })}'::jsonb
            WHERE section_key = 'navigation'
            RETURNING section_key
        `;

        const navResult = await pool.query(navQuery);
        console.log(`✅ Navigation updated: ${navResult.rowCount} row(s)`);

        // Fix buttons/misc section
        const miscQuery = `
            UPDATE nd_home
            SET content_ru = '${JSON.stringify({
                sign_up_today: "Записаться Сегодня",
                learn_more: "Узнать Больше",
                get_started: "Начать",
                view_courses: "Смотреть Курсы",
                contact_us: "Связаться с Нами",
                read_more: "Читать Далее",
                enroll_now: "Записаться Сейчас",
                start_learning: "Начать Обучение"
            })}'::jsonb
            WHERE section_key = 'misc'
            RETURNING section_key
        `;

        const miscResult = await pool.query(miscQuery);
        console.log(`✅ Misc/buttons updated: ${miscResult.rowCount} row(s)`);

        // Verify the updates
        const verifyQuery = `
            SELECT section_key,
                   content_ru->>'title' as title
            FROM nd_home
            WHERE section_key IN ('hero', 'features', 'navigation', 'misc')
        `;

        const verifyResult = await pool.query(verifyQuery);
        console.log('\n📊 Verification:');
        verifyResult.rows.forEach(row => {
            console.log(`  ${row.section_key}: ${row.title || '(no title field)'}`);
        });

        console.log('\n🎉 Russian content fixed!');
        console.log('\n📝 Now test at: http://localhost:3005/home.html?locale=ru');
        console.log('   Clear browser cache (Ctrl+Shift+R) if needed!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.detail) console.error('Detail:', error.detail);
    } finally {
        await pool.end();
    }
}

fixRussianContent();