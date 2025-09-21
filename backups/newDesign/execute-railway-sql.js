const { Pool } = require('pg');

// Railway database connection
const DATABASE_URL = 'postgresql://postgres:IhQmWCTHjFXiIhtrsFBLUxWQNdMCIoKY@turntable.proxy.rlwy.net:51494/railway';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function executeSQL() {
    console.log('🚀 Executing SQL on Railway database...\n');

    try {
        // Step 1: Drop existing table
        console.log('Step 1: Dropping existing table...');
        await pool.query('DROP TABLE IF EXISTS nd_courses_page CASCADE');
        console.log('✅ Table dropped\n');

        // Step 2: Create table with correct structure
        console.log('Step 2: Creating table with correct structure...');
        await pool.query(`
            CREATE TABLE nd_courses_page (
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
        console.log('✅ Table created\n');

        // Step 3: Insert all sections
        console.log('Step 3: Inserting translations...');

        const insertSQL = `
            INSERT INTO nd_courses_page (section_key, section_type, content_en, content_ru, content_he) VALUES
            ('hero', 'hero',
                '{"title": "Our Courses", "subtitle": "Explore Our Learning Programs", "description": "Choose from our comprehensive range of courses designed to help you master new skills"}'::jsonb,
                '{"title": "Наши Курсы", "subtitle": "Изучите Наши Учебные Программы", "description": "Выберите из нашего широкого спектра курсов, разработанных чтобы помочь вам освоить новые навыки"}'::jsonb,
                '{"title": "הקורסים שלנו", "subtitle": "חקור את תוכניות הלמידה שלנו", "description": "בחר מתוך מגוון רחב של קורסים שנועדו לעזור לך לשלוט במיומנויות חדשות"}'::jsonb
            ),
            ('featured_courses', 'courses',
                '{"content": {"title": "Featured Courses", "subtitle": "Our Most Popular Programs", "filters": {"all": "All", "web_dev": "Web Development", "mobile_dev": "Mobile Development", "data_science": "Data Science", "machine_learning": "Machine Learning", "cloud": "Cloud Computing"}}}'::jsonb,
                '{"content": {"title": "Рекомендуемые Курсы", "subtitle": "Наши Самые Популярные Программы", "filters": {"all": "Все", "web_dev": "Веб-разработка", "mobile_dev": "Мобильная разработка", "data_science": "Наука о данных", "machine_learning": "Машинное обучение", "cloud": "Облачные вычисления"}}}'::jsonb,
                '{"content": {"title": "קורסים מומלצים", "subtitle": "התוכניות הפופולריות ביותר שלנו", "filters": {"all": "הכל", "web_dev": "פיתוח אינטרנט", "mobile_dev": "פיתוח מובייל", "data_science": "מדע הנתונים", "machine_learning": "למידת מכונה", "cloud": "מחשוב ענן"}}}'::jsonb
            ),
            ('ui_elements', 'ui',
                '{"content": {"buttons": {"course_details": "Course Details", "start_learning": "Start Learning", "browse_courses": "Browse Courses", "sign_up_today": "Sign Up Today", "get_in_touch": "Get In Touch", "check_out_courses": "Check Out Courses"}, "labels": {"price": "Price", "duration": "Duration", "level": "Level", "students": "Students Enrolled", "rating": "Rating", "instructor": "Instructor"}}}'::jsonb,
                '{"content": {"buttons": {"course_details": "Детали Курса", "start_learning": "Начать Обучение", "browse_courses": "Просмотреть Курсы", "sign_up_today": "Записаться Сегодня", "get_in_touch": "Связаться", "check_out_courses": "Посмотреть Курсы"}, "labels": {"price": "Цена", "duration": "Продолжительность", "level": "Уровень", "students": "Студентов Записано", "rating": "Рейтинг", "instructor": "Преподаватель"}}}'::jsonb,
                '{"content": {"buttons": {"course_details": "פרטי הקורס", "start_learning": "התחל ללמוד", "browse_courses": "עיין בקורסים", "sign_up_today": "הרשמה היום", "get_in_touch": "צור קשר", "check_out_courses": "בדוק קורסים"}, "labels": {"price": "מחיר", "duration": "משך", "level": "רמה", "students": "סטודנטים רשומים", "rating": "דירוג", "instructor": "מדריך"}}}'::jsonb
            ),
            ('cart', 'cart',
                '{"content": {"title": "Your Cart", "empty_message": "Your cart is empty", "subtotal": "Subtotal", "checkout": "Continue to Checkout", "remove": "Remove", "quantity": "Quantity"}}'::jsonb,
                '{"content": {"title": "Ваша Корзина", "empty_message": "Ваша корзина пуста", "subtotal": "Промежуточный итог", "checkout": "Продолжить к оформлению", "remove": "Удалить", "quantity": "Количество"}}'::jsonb,
                '{"content": {"title": "העגלה שלך", "empty_message": "העגלה שלך ריקה", "subtotal": "סכום ביניים", "checkout": "המשך לתשלום", "remove": "הסר", "quantity": "כמות"}}'::jsonb
            ),
            ('cta_bottom', 'cta',
                '{"content": {"subtitle": "Start Learning Today", "title": "Discover A World Of Learning Opportunities", "description": "Don''t wait to transform your career and unlock your full potential"}}'::jsonb,
                '{"content": {"subtitle": "Начните Обучение Сегодня", "title": "Откройте Мир Возможностей для Обучения", "description": "Не ждите, чтобы изменить свою карьеру и раскрыть свой полный потенциал"}}'::jsonb,
                '{"content": {"subtitle": "התחל ללמוד היום", "title": "גלה עולם של הזדמנויות למידה", "description": "אל תחכה לשנות את הקריירה שלך ולפתוח את הפוטנציאל המלא שלך"}}'::jsonb
            ),
            ('misc', 'misc',
                '{"content": {"no_items": "No items found", "loading": "Loading courses...", "error": "Failed to load courses"}}'::jsonb,
                '{"content": {"no_items": "Товары не найдены", "loading": "Загрузка курсов...", "error": "Не удалось загрузить курсы"}}'::jsonb,
                '{"content": {"no_items": "לא נמצאו פריטים", "loading": "טוען קורסים...", "error": "נכשל בטעינת קורסים"}}'::jsonb
            ),
            ('navigation', 'navigation',
                '{"content": {"home": "Home", "courses": "Courses", "pricing": "Pricing", "blog": "Blog", "teachers": "Teachers", "about_us": "About Us", "career_orientation": "Career Orientation", "career_center": "Career Center"}}'::jsonb,
                '{"content": {"home": "Главная", "courses": "Курсы", "pricing": "Цены", "blog": "Блог", "teachers": "Преподаватели", "about_us": "О нас", "career_orientation": "Профориентация", "career_center": "Центр Карьеры"}}'::jsonb,
                '{"content": {"home": "בית", "courses": "קורסים", "pricing": "תמחור", "blog": "בלוג", "teachers": "מורים", "about_us": "אודותינו", "career_orientation": "הכוונה מקצועית", "career_center": "מרכז קריירה"}}'::jsonb
            )
        `;

        await pool.query(insertSQL);
        console.log('✅ All sections inserted\n');

        // Step 4: Verify
        console.log('Step 4: Verifying data...');
        const result = await pool.query(`
            SELECT section_key, section_type,
                   content_en IS NOT NULL as has_en,
                   content_ru IS NOT NULL as has_ru,
                   content_he IS NOT NULL as has_he
            FROM nd_courses_page
            ORDER BY id
        `);

        console.log('\n📊 Table contents:');
        console.log('Section              | Type      | EN | RU | HE');
        console.log('---------------------|-----------|----|----|----');

        result.rows.forEach(row => {
            const section = row.section_key.padEnd(19);
            const type = (row.section_type || '').padEnd(9);
            const en = row.has_en ? '✅' : '❌';
            const ru = row.has_ru ? '✅' : '❌';
            const he = row.has_he ? '✅' : '❌';
            console.log(`${section} | ${type} | ${en} | ${ru} | ${he}`);
        });

        console.log(`\n✅ SUCCESS! Created ${result.rows.length} sections`);

        // Test Russian translation
        const testResult = await pool.query(`
            SELECT content_ru->>'content' as content
            FROM nd_courses_page
            WHERE section_key = 'ui_elements'
        `);

        if (testResult.rows[0]) {
            const buttons = JSON.parse(testResult.rows[0].content).buttons;
            console.log('\n🧪 Test Russian translation:');
            console.log(`   "Course Details" → "${buttons.course_details}"`);
        }

        return true;

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.detail) console.error('Detail:', error.detail);
        return false;
    } finally {
        await pool.end();
    }
}

// Execute
executeSQL().then(success => {
    if (success) {
        console.log('\n🎉 Table successfully created and populated!');
        console.log('\n📝 Next steps:');
        console.log('1. Test at http://localhost:3005/backups/newDesign/courses.html');
        console.log('2. Switch to Russian to see translations');
        process.exit(0);
    } else {
        process.exit(1);
    }
});