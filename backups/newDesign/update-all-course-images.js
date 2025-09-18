const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000';

// Updated static course images mapping
const STATIC_COURSE_IMAGES = {
    "React & Redux Masterclass": "images/course-react.jpg",
    "Node.js Backend Development": "images/course-nodejs.jpg",
    "Python for Data Science": "images/course-python.jpg",
    "JavaScript Fundamentals": "images/course-javascript.jpg",
    "Full Stack Web Development": "images/course-fullstack.jpg",
    "Mobile App Development": "images/course-mobile.jpg",
    "Machine Learning Basics": "images/course-ml.jpg",
    "Cloud Computing AWS": "images/course-aws.jpg",
    "Database Design & SQL": "images/course-database.jpg",
    "UI/UX Design Principles": "images/course-design.jpg",
    "DevOps & CI/CD": "images/course-devops.jpg",
    "Data Analytics": "images/course-analytics.jpg"
};

async function updateAllCourseImages() {
    try {
        console.log('🖼️ Updating all courses to use static images...');

        // Get all courses via featured-courses endpoint
        const response = await fetch(`${API_BASE}/api/featured-courses`);
        const data = await response.json();

        if (!data.success || !data.data || !data.data.courses) {
            console.error('❌ Failed to fetch courses data');
            return;
        }

        const courses = data.data.courses;
        console.log(`📚 Found ${courses.length} courses to update`);

        let updated = 0;
        let already_correct = 0;
        let no_mapping = 0;
        let errors = 0;

        for (const course of courses) {
            const staticImage = STATIC_COURSE_IMAGES[course.title];

            if (!staticImage) {
                console.log(`⚠️ No static image mapping for: "${course.title}"`);
                no_mapping++;
                continue;
            }

            if (course.image === staticImage) {
                console.log(`✅ ${course.title} already has correct static image`);
                already_correct++;
                continue;
            }

            console.log(`🔄 Updating ${course.title}:`);
            console.log(`   From: ${course.image}`);
            console.log(`   To:   ${staticImage}`);

            try {
                const updateResponse = await fetch(`${API_BASE}/api/courses/${course.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image: staticImage
                    })
                });

                if (updateResponse.ok) {
                    console.log(`✅ Successfully updated ${course.title}`);
                    updated++;
                } else {
                    const errorText = await updateResponse.text();
                    console.error(`❌ Failed to update ${course.title}: ${updateResponse.status} ${errorText}`);
                    errors++;
                }
            } catch (error) {
                console.error(`❌ Error updating ${course.title}:`, error.message);
                errors++;
            }

            // Small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`\n📊 Update Summary:`);
        console.log(`  ✅ Updated: ${updated} courses`);
        console.log(`  🔹 Already correct: ${already_correct} courses`);
        console.log(`  ⚠️ No mapping: ${no_mapping} courses`);
        console.log(`  ❌ Errors: ${errors} courses`);
        console.log(`  📦 Total courses: ${courses.length}`);

        if (no_mapping > 0) {
            console.log(`\n📝 Courses needing image mappings:`);
            courses.forEach(course => {
                if (!STATIC_COURSE_IMAGES[course.title]) {
                    console.log(`  - "${course.title}"`);
                }
            });
        }

        console.log('🎉 Course image update complete!');

    } catch (error) {
        console.error('❌ Error updating course images:', error);
    }
}

// Run the update
if (require.main === module) {
    updateAllCourseImages();
}

module.exports = { updateAllCourseImages, STATIC_COURSE_IMAGES };