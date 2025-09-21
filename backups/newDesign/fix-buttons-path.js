// Fix buttons path to match what courses.html expects

const fetch = require('node-fetch');

async function fixButtonsPath() {
    const baseUrl = 'http://localhost:1337/api/nd/home-page';

    // First, let's get the current structure
    const currentResponse = await fetch(`${baseUrl}?locale=en`);
    const currentData = await currentResponse.json();

    // Get existing ui_elements content
    const existingContent = currentData.data?.ui_elements?.content || {};

    // Add buttons to the content object
    const update = {
        section: 'ui_elements',
        data: {
            content_ru: {
                ...existingContent,
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
                ...existingContent,
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
                ...existingContent,
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
    };

    console.log('🔧 Fixing buttons path structure...\n');

    try {
        const response = await fetch(`${baseUrl}/ui_elements`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(update.data)
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Buttons path structure fixed successfully');
        } else {
            console.log('❌ Failed to update buttons:', result.message);
        }
    } catch (error) {
        console.log('❌ Error updating buttons:', error.message);
    }

    // Also add misc section translations that courses.html uses
    const miscUpdate = {
        section: 'misc',
        data: {
            content_ru: {
                content: {
                    no_items: "Товары не найдены"
                }
            },
            content_en: {
                content: {
                    no_items: "No items found"
                }
            },
            content_he: {
                content: {
                    no_items: "לא נמצאו פריטים"
                }
            }
        }
    };

    try {
        const response = await fetch(`${baseUrl}/misc`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(miscUpdate.data)
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Misc translations added successfully');
        }
    } catch (error) {
        console.log('❌ Error updating misc:', error.message);
    }

    // Verify the fix
    console.log('\n📊 Verifying button structure...\n');

    try {
        const response = await fetch(`${baseUrl}?locale=ru`);
        const data = await response.json();

        const buttons = data.data?.ui_elements?.content?.buttons;
        if (buttons) {
            console.log('✅ Buttons structure correct:', Object.keys(buttons));
        } else {
            console.log('❌ Buttons structure still incorrect');
            console.log('Current ui_elements:', JSON.stringify(data.data?.ui_elements, null, 2));
        }

        const misc = data.data?.misc?.content?.content;
        if (misc) {
            console.log('✅ Misc translations available:', Object.keys(misc));
        }
    } catch (error) {
        console.log('❌ Error verifying:', error.message);
    }

    console.log('\n✅ Path structure fix complete!');
    console.log('🔄 Refresh courses.html and switch to Russian to test.');
}

fixButtonsPath().catch(console.error);