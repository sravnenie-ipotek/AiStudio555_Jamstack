/**
 * Fix nd_courses translations in PostgreSQL database via API
 */

const API_BASE = 'http://localhost:3000';

async function fixCourseTranslations() {
    console.log('🔧 Fixing course translations in PostgreSQL...\n');

    // Course fixes
    const courseFixes = [
        {
            id: 2,
            updates: {
                title: 'React & Redux Masterclass',
                title_ru: 'Мастер-класс React и Redux',
                title_he: 'מאסטר-קלאס React ו-Redux',
                description: 'Master React.js and Redux for building scalable single-page applications. Learn component architecture, state management, hooks, and best practices for production-ready React apps.',
                description_ru: 'Глубоко изучите React.js и Redux для создания масштабируемых одностраничных приложений. Изучите архитектуру компонентов, управление состоянием, хуки и лучшие практики.',
                description_he: 'למדו React.js ו-Redux לבניית אפליקציות חד-עמודיות ניתנות להרחבה. למדו ארכיטקטורת רכיבים, ניהול מצב, hooks ושיטות מומלצות.'
            }
        },
        {
            id: 3,
            updates: {
                title: 'Node.js Backend Development',
                title_ru: 'Разработка Backend на Node.js',
                title_he: 'פיתוח Backend עם Node.js',
                description: 'Become a backend expert with Node.js, Express, and MongoDB. Learn to build RESTful APIs, handle authentication, implement security best practices.',
                description_ru: 'Станьте экспертом по backend с Node.js, Express и MongoDB. Научитесь создавать RESTful API, обрабатывать аутентификацию.',
                description_he: 'הפכו למומחי backend עם Node.js, Express ו-MongoDB. למדו לבנות RESTful APIs, לטפל באימות.'
            }
        },
        {
            id: 4,
            updates: {
                title: 'Python for Data Science',
                title_ru: 'Python для науки о данных',
                title_he: 'Python למדע הנתונים',
                description: 'Unlock the power of Python for data analysis and machine learning. Master pandas, NumPy, matplotlib, and scikit-learn.',
                description_ru: 'Раскройте возможности Python для анализа данных и машинного обучения. Освойте pandas, NumPy, matplotlib и scikit-learn.',
                description_he: 'שחררו את הכוח של Python לניתוח נתונים ולמידת מכונה. שלטו ב-pandas, NumPy, matplotlib ו-scikit-learn.'
            }
        }
    ];

    let fixed = 0;
    let failed = 0;

    for (const course of courseFixes) {
        try {
            console.log(`Updating course ID ${course.id}...`);

            const response = await fetch(`${API_BASE}/api/nd/courses/${course.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(course.updates)
            });

            if (response.ok) {
                console.log(`✅ Course ${course.id} updated successfully`);
                fixed++;
            } else {
                console.log(`❌ Failed to update course ${course.id}: ${response.status}`);
                failed++;
            }
        } catch (error) {
            console.error(`❌ Error updating course ${course.id}:`, error.message);
            failed++;
        }
    }

    console.log(`\n📊 Results: ${fixed} fixed, ${failed} failed\n`);

    // Verify the changes
    console.log('🔍 Verifying translations...\n');

    try {
        // Test English
        const enResponse = await fetch(`${API_BASE}/api/nd/courses?locale=en`);
        const enData = await enResponse.json();
        console.log('English:', enData.data[0].title);

        // Test Russian
        const ruResponse = await fetch(`${API_BASE}/api/nd/courses?locale=ru`);
        const ruData = await ruResponse.json();
        console.log('Russian:', ruData.data[0].title);

        // Test Hebrew
        const heResponse = await fetch(`${API_BASE}/api/nd/courses?locale=he`);
        const heData = await heResponse.json();
        console.log('Hebrew:', heData.data[0].title);

        console.log('\n✨ Translation fix complete!');
    } catch (error) {
        console.error('Error verifying translations:', error);
    }
}

// Run the fix
fixCourseTranslations();