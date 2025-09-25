// Script to add missing button and UI translations for courses.html

const fetch = require('node-fetch');

async function updateTranslations() {
    const baseUrl = 'http://localhost:3000/api/nd/home-page';

    const updates = [
        {
            section: 'ui_elements',
            data: {
                content_ru: {
                    buttons: {
                        sign_up_today: "Записаться Сегодня",
                        course_details: "Детали Курса",
                        start_learning: "Начать Обучение",
                        browse_courses: "Просмотреть Курсы",
                        get_in_touch: "Связаться",
                        check_out_courses: "Посмотреть Курсы"
                    }
                },
                content_en: {
                    buttons: {
                        sign_up_today: "Sign Up Today",
                        course_details: "Course Details",
                        start_learning: "Start Learning",
                        browse_courses: "Browse Courses",
                        get_in_touch: "Get In Touch",
                        check_out_courses: "Check Out Courses"
                    }
                },
                content_he: {
                    buttons: {
                        sign_up_today: "הרשמה היום",
                        course_details: "פרטי הקורס",
                        start_learning: "התחל ללמוד",
                        browse_courses: "עיין בקורסים",
                        get_in_touch: "צור קשר",
                        check_out_courses: "בדוק קורסים"
                    }
                }
            }
        },
        {
            section: 'navigation',
            data: {
                content_ru: {
                    content: {
                        home: "Главная",
                        courses: "Курсы",
                        pricing: "Цены",
                        blog: "Блог",
                        teachers: "Преподаватели",
                        about_us: "О нас",
                        career_orientation: "Профориентация",
                        career_center: "Центр Карьеры"
                    }
                },
                content_en: {
                    content: {
                        home: "Home",
                        courses: "Courses",
                        pricing: "Pricing",
                        blog: "Blog",
                        teachers: "Teachers",
                        about_us: "About Us",
                        career_orientation: "Career Orientation",
                        career_center: "Career Center"
                    }
                }
            }
        }
    ];

    console.log('🚀 Starting translation updates...\n');

    for (const update of updates) {
        console.log(`📝 Updating ${update.section}...`);

        try {
            const response = await fetch(`${baseUrl}/${update.section}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(update.data)
            });

            const result = await response.json();

            if (result.success) {
                console.log(`✅ ${update.section} updated successfully`);
            } else {
                console.log(`❌ Failed to update ${update.section}:`, result.message);
            }
        } catch (error) {
            console.log(`❌ Error updating ${update.section}:`, error.message);
        }
    }

    // Verify the updates
    console.log('\n📊 Verifying translations...\n');

    try {
        const response = await fetch(`${baseUrl}?locale=ru`);
        const data = await response.json();

        // Check UI buttons
        const uiButtons = data.data?.ui_elements?.content?.buttons;
        if (uiButtons) {
            console.log('✅ UI Buttons (Russian):', Object.keys(uiButtons));
        } else {
            console.log('❌ UI Buttons not found');
        }

        // Check navigation
        const navContent = data.data?.navigation?.content;
        if (navContent) {
            console.log('✅ Navigation content (Russian):', Object.keys(navContent || {}));
        }
    } catch (error) {
        console.log('❌ Error verifying:', error.message);
    }

    console.log('\n✅ Translation updates complete!');
    console.log('🔄 Refresh courses.html and switch to Russian to test.');
}

updateTranslations().catch(console.error);