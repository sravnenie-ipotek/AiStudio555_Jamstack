/**
 * CLEAN DATABASE - KEEP ONLY 3 COURSES
 * Keeps courses 2, 3, 4 and deletes the rest
 */

const API_BASE = 'http://localhost:3000';

async function cleanDatabase() {
    console.log('🗂️ Cleaning Database - Keeping Only 3 Courses\n');

    // Courses to keep: 2, 3, 4 (React, Node.js, Python)
    const keepCourses = [2, 3, 4];
    const deleteCourses = [1, 5, 6, 9, 10, 11];

    console.log('✅ Keeping courses:', keepCourses);
    console.log('🗑️ Deleting courses:', deleteCourses);
    console.log('');

    for (const courseId of deleteCourses) {
        console.log(`🗑️ Deleting course ${courseId}...`);

        try {
            const response = await fetch(`${API_BASE}/api/nd/courses/${courseId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log(`   ✅ Course ${courseId} deleted`);
            } else {
                console.log(`   ❌ Failed to delete course ${courseId}: ${response.status}`);
            }
        } catch (error) {
            console.log(`   ❌ Error deleting course ${courseId}:`, error.message);
        }
    }

    // Verify remaining courses
    console.log('\n📊 Verifying remaining courses...');
    try {
        const response = await fetch(`${API_BASE}/api/nd/courses`);
        const data = await response.json();
        const courses = data.data || [];

        console.log(`\nRemaining courses: ${courses.length}`);
        courses.forEach(c => {
            console.log(`  ✅ ID ${c.id}: ${c.title}`);
        });

        if (courses.length === 3) {
            console.log('\n🎉 Perfect! Database cleaned to exactly 3 courses');
        } else {
            console.log(`\n⚠️ Expected 3 courses, found ${courses.length}`);
        }

    } catch (error) {
        console.error('❌ Error verifying courses:', error);
    }

    console.log('\n✅ Database cleanup complete!');
}

cleanDatabase().catch(console.error);