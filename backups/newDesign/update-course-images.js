const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000';

// Static course images - no more dynamic generation
const STATIC_COURSE_IMAGES = {
    'React & Redux Masterclass': 'images/course-react.jpg',
    'Node.js Backend Development': 'images/course-nodejs.jpg',
    'Python for Data Science': 'images/course-python.jpg'
};

async function updateCourseImages() {
    try {
        console.log('🖼️ Updating courses to use static images...');

        // Get all courses via featured-courses endpoint
        const response = await fetch(`${API_BASE}/api/featured-courses`);
        const data = await response.json();
        const courses = data.data?.courses || [];

        console.log(`📚 Found ${courses.length} courses to update`);

        for (const course of courses) {
            const staticImage = STATIC_COURSE_IMAGES[course.title];

            if (staticImage && course.image !== staticImage) {
                console.log(`🔄 Updating ${course.title}: ${course.image} → ${staticImage}`);

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
                    console.log(`✅ Updated ${course.title}`);
                } else {
                    console.error(`❌ Failed to update ${course.title}`);
                }
            } else if (staticImage) {
                console.log(`🔹 ${course.title} already has correct image`);
            } else {
                console.log(`⚠️ No static image defined for: ${course.title}`);
            }
        }

        console.log('🎉 Course image update complete!');

    } catch (error) {
        console.error('❌ Error updating course images:', error);
    }
}

updateCourseImages();