/**
 * FIX FOR COURSE IMAGES AND TRANSLATIONS
 * This script fixes two issues:
 * 1. Courses don't have image URLs - we'll add static images
 * 2. Course titles/descriptions are not translated - we'll add locale support
 */

console.log('🔧 Fixing course images and translations...\n');

// Static course images mapping by category
const COURSE_IMAGES = {
    'Web Dev': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80', // Web development
    'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Data science
    'Programming': 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80', // Programming
    'AI & ML': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', // AI/ML
    'Cloud Computing': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80', // Cloud
    'Mobile Dev': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80', // Mobile
    'DevOps': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80', // DevOps
    'default': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80' // Default tech
};

// Course translations (Russian)
const COURSE_TRANSLATIONS_RU = {
    'Web Development Bootcamp': {
        title: 'Веб-разработка Интенсив',
        description: 'Изучите современную веб-разработку с нуля до профессионального уровня'
    },
    'Data Science Fundamentals': {
        title: 'Основы Науки о Данных',
        description: 'Освойте анализ данных, машинное обучение и статистику'
    },
    'Advanced Python Programming': {
        title: 'Продвинутое Программирование на Python',
        description: 'Углубленное изучение Python для профессиональной разработки'
    },
    'Introduction to Machine Learning': {
        title: 'Введение в Машинное Обучение',
        description: 'Основы машинного обучения и искусственного интеллекта'
    },
    'Cloud Computing Essentials': {
        title: 'Основы Облачных Вычислений',
        description: 'Изучите AWS, Azure и Google Cloud Platform'
    },
    'Mobile App Development': {
        title: 'Разработка Мобильных Приложений',
        description: 'Создавайте приложения для iOS и Android'
    }
};

// Update the nd-courses-integration.js to use these images
const fixScript = `
// Add this function to nd-courses-integration.js
function getStaticCourseImage(category) {
    const images = ${JSON.stringify(COURSE_IMAGES, null, 4)};
    return images[category] || images['default'];
}

// Modify line 42 in the transformation to add image:
// Add after line 42:
    image: getStaticCourseImage(course.attributes.category),
`;

console.log('📝 To fix images, add this to nd-courses-integration.js:\n');
console.log(fixScript);

console.log('\n✅ Static image URLs ready to use');
console.log('📌 Categories with images:', Object.keys(COURSE_IMAGES).length);

// For database update (if needed)
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
        ? { rejectUnauthorized: false }
        : false
});

async function updateCourseImages() {
    try {
        console.log('\n🔧 Updating course images in database...');

        const courses = [
            { id: 4, category: 'Web Dev' },
            { id: 5, category: 'Data Science' },
            { id: 6, category: 'Programming' }
        ];

        for (const course of courses) {
            const imageUrl = COURSE_IMAGES[course.category] || COURSE_IMAGES['default'];
            const query = `
                UPDATE nd_courses
                SET image_url = $1
                WHERE id = $2
            `;

            await pool.query(query, [imageUrl, course.id]);
            console.log(`✅ Updated course ${course.id} with image`);
        }

        console.log('\n🎉 Course images updated!');

    } catch (error) {
        console.error('❌ Error updating courses:', error.message);
    } finally {
        await pool.end();
    }
}

// Run the update
updateCourseImages();