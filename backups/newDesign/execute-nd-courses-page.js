const { Pool } = require('pg');
const fs = require('fs');

// Get DATABASE_URL from environment or use Railway's
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:IhQmWCTHjFXiIhtrsFBLUxWQNdMCIoKY@junction.proxy.rlwy.net:18914/railway';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('railway') ? { rejectUnauthorized: false } : false
});

async function executeSQL() {
    console.log('🚀 Starting nd_courses_page table creation on Railway...\n');

    try {
        // Test connection
        const testResult = await pool.query('SELECT version()');
        console.log('✅ Connected to Railway PostgreSQL');
        console.log(`📊 Database version: ${testResult.rows[0].version.split(' ')[1]}\n`);

        // Create table
        console.log('📝 Creating nd_courses_page table...');
        await pool.query(`
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
        `);
        console.log('✅ Table structure created\n');

        // Insert data
        console.log('📝 Inserting translations...');

        const sections = [
            ['hero', 'hero',
                '{"title": "Our Courses", "subtitle": "Explore Our Learning Programs", "description": "Choose from our comprehensive range of courses designed to help you master new skills"}',
                '{"title": "Наши Курсы", "subtitle": "Изучите Наши Учебные Программы", "description": "Выберите из нашего широкого спектра курсов, разработанных чтобы помочь вам освоить новые навыки"}',
                '{"title": "הקורסים שלנו", "subtitle": "חקור את תוכניות הלמידה שלנו", "description": "בחר מתוך מגוון רחב של קורסים שנועדו לעזור לך לשלוט במיומנויות חדשות"}'
            ],
            ['featured_courses', 'courses',
                '{"content": {"title": "Featured Courses", "subtitle": "Our Most Popular Programs", "filters": {"all": "All", "web_dev": "Web Development", "mobile_dev": "Mobile Development", "data_science": "Data Science", "machine_learning": "Machine Learning", "cloud": "Cloud Computing"}}}',
                '{"content": {"title": "Рекомендуемые Курсы", "subtitle": "Наши Самые Популярные Программы", "filters": {"all": "Все", "web_dev": "Веб-разработка", "mobile_dev": "Мобильная разработка", "data_science": "Наука о данных", "machine_learning": "Машинное обучение", "cloud": "Облачные вычисления"}}}',
                '{"content": {"title": "קורסים מומלצים", "subtitle": "התוכניות הפופולריות ביותר שלנו", "filters": {"all": "הכל", "web_dev": "פיתוח אינטרנט", "mobile_dev": "פיתוח מובייל", "data_science": "מדע הנתונים", "machine_learning": "למידת מכונה", "cloud": "מחשוב ענן"}}}'
            ],
            ['ui_elements', 'ui',
                '{"content": {"buttons": {"course_details": "Course Details", "start_learning": "Start Learning", "browse_courses": "Browse Courses", "sign_up_today": "Sign Up Today", "get_in_touch": "Get In Touch", "check_out_courses": "Check Out Courses"}, "labels": {"price": "Price", "duration": "Duration", "level": "Level", "students": "Students Enrolled", "rating": "Rating", "instructor": "Instructor"}}}',
                '{"content": {"buttons": {"course_details": "Детали Курса", "start_learning": "Начать Обучение", "browse_courses": "Просмотреть Курсы", "sign_up_today": "Записаться Сегодня", "get_in_touch": "Связаться", "check_out_courses": "Посмотреть Курсы"}, "labels": {"price": "Цена", "duration": "Продолжительность", "level": "Уровень", "students": "Студентов Записано", "rating": "Рейтинг", "instructor": "Преподаватель"}}}',
                '{"content": {"buttons": {"course_details": "פרטי הקורס", "start_learning": "התחל ללמוד", "browse_courses": "עיין בקורסים", "sign_up_today": "הרשמה היום", "get_in_touch": "צור קשר", "check_out_courses": "בדוק קורסים"}, "labels": {"price": "מחיר", "duration": "משך", "level": "רמה", "students": "סטודנטים רשומים", "rating": "דירוג", "instructor": "מדריך"}}}'
            ],
            ['cart', 'cart',
                '{"content": {"title": "Your Cart", "empty_message": "Your cart is empty", "subtotal": "Subtotal", "checkout": "Continue to Checkout", "remove": "Remove", "quantity": "Quantity"}}',
                '{"content": {"title": "Ваша Корзина", "empty_message": "Ваша корзина пуста", "subtotal": "Промежуточный итог", "checkout": "Продолжить к оформлению", "remove": "Удалить", "quantity": "Количество"}}',
                '{"content": {"title": "העגלה שלך", "empty_message": "העגלה שלך ריקה", "subtotal": "סכום ביניים", "checkout": "המשך לתשלום", "remove": "הסר", "quantity": "כמות"}}'
            ],
            ['cta_bottom', 'cta',
                '{"content": {"subtitle": "Start Learning Today", "title": "Discover A World Of Learning Opportunities", "description": "Don\'t wait to transform your career and unlock your full potential"}}',
                '{"content": {"subtitle": "Начните Обучение Сегодня", "title": "Откройте Мир Возможностей для Обучения", "description": "Не ждите, чтобы изменить свою карьеру и раскрыть свой полный потенциал"}}',
                '{"content": {"subtitle": "התחל ללמוד היום", "title": "גלה עולם של הזדמנויות למידה", "description": "אל תחכה לשנות את הקריירה שלך ולפתוח את הפוטנציאל המלא שלך"}}'
            ],
            ['misc', 'misc',
                '{"content": {"no_items": "No items found", "loading": "Loading courses...", "error": "Failed to load courses"}}',
                '{"content": {"no_items": "Товары не найдены", "loading": "Загрузка курсов...", "error": "Не удалось загрузить курсы"}}',
                '{"content": {"no_items": "לא נמצאו פריטים", "loading": "טוען קורסים...", "error": "נכשל בטעינת קורסים"}}'
            ],
            ['navigation', 'navigation',
                '{"content": {"home": "Home", "courses": "Courses", "pricing": "Pricing", "blog": "Blog", "teachers": "Teachers", "about_us": "About Us", "career_orientation": "Career Orientation", "career_center": "Career Center"}}',
                '{"content": {"home": "Главная", "courses": "Курсы", "pricing": "Цены", "blog": "Блог", "teachers": "Преподаватели", "about_us": "О нас", "career_orientation": "Профориентация", "career_center": "Центр Карьеры"}}',
                '{"content": {"home": "בית", "courses": "קורסים", "pricing": "תמחור", "blog": "בלוג", "teachers": "מורים", "about_us": "אודותינו", "career_orientation": "הכוונה מקצועית", "career_center": "מרכז קריירה"}}'
            ]
        ];

        for (const section of sections) {
            const result = await pool.query(`
                INSERT INTO nd_courses_page (section_key, section_type, content_en, content_ru, content_he)
                VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb)
                ON CONFLICT (section_key) DO UPDATE
                SET
                    section_type = EXCLUDED.section_type,
                    content_en = EXCLUDED.content_en,
                    content_ru = EXCLUDED.content_ru,
                    content_he = EXCLUDED.content_he,
                    updated_at = NOW()
                RETURNING section_key
            `, section);
            console.log(`  ✅ ${result.rows[0].section_key}`);
        }

        console.log('\n📊 Verifying table contents...\n');

        // Verify data
        const verifyResult = await pool.query(`
            SELECT
                section_key,
                section_type,
                content_en IS NOT NULL as has_en,
                content_ru IS NOT NULL as has_ru,
                content_he IS NOT NULL as has_he
            FROM nd_courses_page
            ORDER BY id
        `);

        console.log('┌─────────────────────┬────────────┬────┬────┬────┐');
        console.log('│ Section             │ Type       │ EN │ RU │ HE │');
        console.log('├─────────────────────┼────────────┼────┼────┼────┤');

        verifyResult.rows.forEach(row => {
            const section = row.section_key.padEnd(19);
            const type = (row.section_type || '').padEnd(10);
            const en = row.has_en ? '✅' : '❌';
            const ru = row.has_ru ? '✅' : '❌';
            const he = row.has_he ? '✅' : '❌';
            console.log(`│ ${section} │ ${type} │ ${en} │ ${ru} │ ${he} │`);
        });

        console.log('└─────────────────────┴────────────┴────┴────┴────┘');
        console.log(`\n✅ Successfully created ${verifyResult.rows.length} sections\n`);

        // Test specific translations
        console.log('🧪 Testing specific translations...\n');

        const translationTest = await pool.query(`
            SELECT
                content_en->>'content' as en_content,
                content_ru->>'content' as ru_content,
                content_he->>'content' as he_content
            FROM nd_courses_page
            WHERE section_key = 'ui_elements'
        `);

        if (translationTest.rows[0]) {
            const enButtons = JSON.parse(translationTest.rows[0].en_content).buttons;
            const ruButtons = JSON.parse(translationTest.rows[0].ru_content).buttons;
            const heButtons = JSON.parse(translationTest.rows[0].he_content).buttons;

            console.log('Button translations:');
            console.log(`  EN: "${enButtons.course_details}"`);
            console.log(`  RU: "${ruButtons.course_details}"`);
            console.log(`  HE: "${heButtons.course_details}"`);
        }

        console.log('\n🎉 SUCCESS! nd_courses_page table created and populated!');
        console.log('\n📝 Next steps:');
        console.log('1. Restart the server if needed');
        console.log('2. Test at http://localhost:3005/backups/newDesign/courses.html');
        console.log('3. Switch to Russian/Hebrew to see translations');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.detail) console.error('Details:', error.detail);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

executeSQL();