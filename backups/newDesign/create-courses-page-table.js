const { Pool } = require('pg');
const fs = require('fs');

// Database configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/aistudio_db'
});

async function createCoursesPageTable() {
    try {
        console.log('🚀 Creating nd_courses_page table...\n');

        // Create the table
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
        console.log('✅ Table nd_courses_page created');

        // Insert sections
        const sections = [
            {
                key: 'hero',
                type: 'hero',
                en: { title: "Our Courses", subtitle: "Explore Our Learning Programs", description: "Choose from our comprehensive range of courses designed to help you master new skills" },
                ru: { title: "Наши Курсы", subtitle: "Изучите Наши Учебные Программы", description: "Выберите из нашего широкого спектра курсов, разработанных чтобы помочь вам освоить новые навыки" },
                he: { title: "הקורסים שלנו", subtitle: "חקור את תוכניות הלמידה שלנו", description: "בחר מתוך מגוון רחב של קורסים שנועדו לעזור לך לשלוט במיומנויות חדשות" }
            },
            {
                key: 'featured_courses',
                type: 'courses',
                en: { content: { title: "Featured Courses", subtitle: "Our Most Popular Programs", filters: { all: "All", web_dev: "Web Development", mobile_dev: "Mobile Development", data_science: "Data Science", machine_learning: "Machine Learning", cloud: "Cloud Computing" }}},
                ru: { content: { title: "Рекомендуемые Курсы", subtitle: "Наши Самые Популярные Программы", filters: { all: "Все", web_dev: "Веб-разработка", mobile_dev: "Мобильная разработка", data_science: "Наука о данных", machine_learning: "Машинное обучение", cloud: "Облачные вычисления" }}},
                he: { content: { title: "קורסים מומלצים", subtitle: "התוכניות הפופולריות ביותר שלנו", filters: { all: "הכל", web_dev: "פיתוח אינטרנט", mobile_dev: "פיתוח מובייל", data_science: "מדע הנתונים", machine_learning: "למידת מכונה", cloud: "מחשוב ענן" }}}
            },
            {
                key: 'ui_elements',
                type: 'ui',
                en: { content: { buttons: { course_details: "Course Details", start_learning: "Start Learning", browse_courses: "Browse Courses", sign_up_today: "Sign Up Today", get_in_touch: "Get In Touch", check_out_courses: "Check Out Courses" }, labels: { price: "Price", duration: "Duration", level: "Level", students: "Students Enrolled", rating: "Rating", instructor: "Instructor" }}},
                ru: { content: { buttons: { course_details: "Детали Курса", start_learning: "Начать Обучение", browse_courses: "Просмотреть Курсы", sign_up_today: "Записаться Сегодня", get_in_touch: "Связаться", check_out_courses: "Посмотреть Курсы" }, labels: { price: "Цена", duration: "Продолжительность", level: "Уровень", students: "Студентов Записано", rating: "Рейтинг", instructor: "Преподаватель" }}},
                he: { content: { buttons: { course_details: "פרטי הקורס", start_learning: "התחל ללמוד", browse_courses: "עיין בקורסים", sign_up_today: "הרשמה היום", get_in_touch: "צור קשר", check_out_courses: "בדוק קורסים" }, labels: { price: "מחיר", duration: "משך", level: "רמה", students: "סטודנטים רשומים", rating: "דירוג", instructor: "מדריך" }}}
            },
            {
                key: 'cart',
                type: 'cart',
                en: { content: { title: "Your Cart", empty_message: "Your cart is empty", subtotal: "Subtotal", checkout: "Continue to Checkout", remove: "Remove", quantity: "Quantity" }},
                ru: { content: { title: "Ваша Корзина", empty_message: "Ваша корзина пуста", subtotal: "Промежуточный итог", checkout: "Продолжить к оформлению", remove: "Удалить", quantity: "Количество" }},
                he: { content: { title: "העגלה שלך", empty_message: "העגלה שלך ריקה", subtotal: "סכום ביניים", checkout: "המשך לתשלום", remove: "הסר", quantity: "כמות" }}
            },
            {
                key: 'cta_bottom',
                type: 'cta',
                en: { content: { subtitle: "Start Learning Today", title: "Discover A World Of Learning Opportunities", description: "Don't wait to transform your career and unlock your full potential" }},
                ru: { content: { subtitle: "Начните Обучение Сегодня", title: "Откройте Мир Возможностей для Обучения", description: "Не ждите, чтобы изменить свою карьеру и раскрыть свой полный потенциал" }},
                he: { content: { subtitle: "התחל ללמוד היום", title: "גלה עולם של הזדמנויות למידה", description: "אל תחכה לשנות את הקריירה שלך ולפתוח את הפוטנציאל המלא שלך" }}
            },
            {
                key: 'misc',
                type: 'misc',
                en: { content: { no_items: "No items found", loading: "Loading courses...", error: "Failed to load courses" }},
                ru: { content: { no_items: "Товары не найдены", loading: "Загрузка курсов...", error: "Не удалось загрузить курсы" }},
                he: { content: { no_items: "לא נמצאו פריטים", loading: "טוען קורסים...", error: "נכשל בטעינת קורסים" }}
            },
            {
                key: 'navigation',
                type: 'navigation',
                en: { content: { home: "Home", courses: "Courses", pricing: "Pricing", blog: "Blog", teachers: "Teachers", about_us: "About Us", career_orientation: "Career Orientation", career_center: "Career Center" }},
                ru: { content: { home: "Главная", courses: "Курсы", pricing: "Цены", blog: "Блог", teachers: "Преподаватели", about_us: "О нас", career_orientation: "Профориентация", career_center: "Центр Карьеры" }},
                he: { content: { home: "בית", courses: "קורסים", pricing: "תמחור", blog: "בלוג", teachers: "מורים", about_us: "אודותינו", career_orientation: "הכוונה מקצועית", career_center: "מרכז קריירה" }}
            }
        ];

        for (const section of sections) {
            try {
                await pool.query(`
                    INSERT INTO nd_courses_page (section_key, section_type, content_en, content_ru, content_he)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (section_key) DO UPDATE
                    SET
                        section_type = EXCLUDED.section_type,
                        content_en = EXCLUDED.content_en,
                        content_ru = EXCLUDED.content_ru,
                        content_he = EXCLUDED.content_he,
                        updated_at = NOW()
                `, [section.key, section.type, section.en, section.ru, section.he]);
                console.log(`✅ Section '${section.key}' inserted/updated`);
            } catch (err) {
                console.error(`❌ Error with section '${section.key}':`, err.message);
            }
        }

        // Create indexes
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_nd_courses_page_section_key ON nd_courses_page(section_key)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_nd_courses_page_visible ON nd_courses_page(visible)`);
        console.log('✅ Indexes created');

        // Verify the data
        const result = await pool.query(`
            SELECT section_key, section_type
            FROM nd_courses_page
            ORDER BY
                CASE section_key
                    WHEN 'hero' THEN 1
                    WHEN 'featured_courses' THEN 2
                    WHEN 'ui_elements' THEN 3
                    ELSE 4
                END
        `);

        console.log('\n📊 Table contents:');
        result.rows.forEach(row => {
            console.log(`  - ${row.section_key} (${row.section_type})`);
        });

        console.log('\n✅ nd_courses_page table created and populated successfully!');
        console.log('📝 Next steps:');
        console.log('  1. Add API endpoint /api/nd/courses-page to server.js');
        console.log('  2. Update courses.html to use the new endpoint');
        console.log('  3. Update db.md documentation');

    } catch (error) {
        console.error('❌ Error creating table:', error);
    } finally {
        await pool.end();
    }
}

createCoursesPageTable();