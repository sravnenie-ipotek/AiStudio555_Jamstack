/**
 * UPDATE COURSE CATEGORIES WITH LONGER TEXT
 * Tests text overflow handling in shared card system
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:T%40r%40Flex000@localhost:5432/aistudio_db'
});

async function updateCategoriesWithLongText() {
    console.log('📝 Adding longer descriptions to test text overflow...\n');

    try {
        // Updated categories with longer descriptions
        const categoriesWithLongText = [
            {
                name: "Web Development",
                description: "Build modern, responsive websites and powerful web applications using the latest technologies including React, Vue.js, Angular, Node.js, and advanced CSS frameworks. Master full-stack development with hands-on projects that prepare you for real-world challenges in today's competitive tech industry.",
                icon: "images/category-web-dev.svg",
                color: "#667eea",
                url: "courses.html?category=web"
            },
            {
                name: "Mobile Development",
                description: "Create native and cross-platform mobile applications for iOS and Android using React Native, Flutter, Swift, and Kotlin. Learn app store optimization, mobile UI/UX design principles, and how to integrate advanced features like push notifications, geolocation, and payment systems.",
                icon: "images/category-mobile.svg",
                color: "#f093fb",
                url: "courses.html?category=mobile"
            },
            {
                name: "Machine Learning & AI",
                description: "Master artificial intelligence and machine learning algorithms to build intelligent applications. Cover deep learning, neural networks, computer vision, natural language processing, and data science using Python, TensorFlow, PyTorch, and scikit-learn with practical industry applications.",
                icon: "images/category-ml.svg",
                color: "#4facfe",
                url: "courses.html?category=ml"
            },
            {
                name: "Cloud Computing & DevOps",
                description: "Learn cloud architecture and DevOps practices with AWS, Azure, Google Cloud Platform, Docker, Kubernetes, and CI/CD pipelines. Build scalable, secure, and cost-effective cloud solutions while mastering infrastructure as code, monitoring, and deployment automation for enterprise applications.",
                icon: "images/category-cloud.svg",
                color: "#43e97b",
                url: "courses.html?category=cloud"
            }
        ];

        // Update the course_categories section in nd_home table
        const courseCategoriesContent = {
            title: "Browse Our Tech Course Categories",
            subtitle: "Course Categories",
            description: "Dive into a world of learning with diverse and extensive range of tech courses designed to cater to every interest and skill level.",
            items: categoriesWithLongText
        };

        await pool.query(`
            UPDATE nd_home
            SET content_en = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE section_key = 'course_categories'
        `, [JSON.stringify(courseCategoriesContent)]);

        console.log('✅ Updated course_categories section with longer text');

        console.log('\n📋 Updated Categories with Long Text:');
        categoriesWithLongText.forEach((category, index) => {
            console.log(`  ${index + 1}. ${category.name}`);
            console.log(`     📝 ${category.description.substring(0, 100)}...`);
            console.log(`     📏 Length: ${category.description.length} characters`);
            console.log('');
        });

        console.log('='.repeat(60));
        console.log('✅ TEXT OVERFLOW TEST DATA READY!');
        console.log('='.repeat(60));
        console.log('\nText Overflow Features to Test:');
        console.log('1. ✂️  Line Clamping: Descriptions limited to 3 lines');
        console.log('2. 🔍 Tooltips: Hover to see full text');
        console.log('3. 📖 Expandable: Click to expand/collapse');
        console.log('4. 🎨 Fade Effect: Gradient fade for overflowing text');
        console.log('5. 📱 Responsive: Adapts to different screen sizes');

        return true;

    } catch (error) {
        console.error('❌ Error updating categories:', error.message);
        return false;
    } finally {
        await pool.end();
    }
}

// Run the update
updateCategoriesWithLongText()
    .then(success => {
        if (success) {
            console.log('\n🎉 Ready to test text overflow handling!');
            console.log('Refresh home.html to see the changes.');
        }
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });