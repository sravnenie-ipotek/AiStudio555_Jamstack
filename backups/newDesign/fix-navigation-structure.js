// Fix navigation structure to match what courses.html expects

const fetch = require('node-fetch');

async function fixNavigationStructure() {
    const baseUrl = 'http://localhost:1337/api/nd/home-page';

    // Update navigation to have the expected nested structure
    const update = {
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
            },
            content_he: {
                content: {
                    home: "בית",
                    courses: "קורסים",
                    pricing: "תמחור",
                    blog: "בלוג",
                    teachers: "מורים",
                    about_us: "אודותינו",
                    career_orientation: "הכוונה מקצועית",
                    career_center: "מרכז קריירה"
                }
            }
        }
    };

    console.log('🔧 Fixing navigation structure...\n');

    try {
        const response = await fetch(`${baseUrl}/navigation`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(update.data)
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Navigation structure fixed successfully');
        } else {
            console.log('❌ Failed to update navigation:', result.message);
        }
    } catch (error) {
        console.log('❌ Error updating navigation:', error.message);
    }

    // Verify the fix
    console.log('\n📊 Verifying navigation structure...\n');

    try {
        const response = await fetch(`${baseUrl}?locale=ru`);
        const data = await response.json();

        const navContent = data.data?.navigation?.content;
        if (navContent && navContent.home) {
            console.log('✅ Navigation structure correct:', Object.keys(navContent));
        } else {
            console.log('❌ Navigation structure still incorrect');
            console.log('Current structure:', JSON.stringify(navContent, null, 2));
        }
    } catch (error) {
        console.log('❌ Error verifying:', error.message);
    }

    console.log('\n✅ Structure fix complete!');
    console.log('🔄 Refresh courses.html and switch to Russian to test.');
}

fixNavigationStructure().catch(console.error);