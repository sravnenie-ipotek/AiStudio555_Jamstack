/**
 * FIX COURSE URLS IN DATABASE
 * Updates all courses to have proper detail page URLs
 */

const API_BASE = 'http://localhost:3000';

async function fixCourseUrls() {
    console.log('🔧 Fixing course URLs in database\n');

    try {
        // Fetch all courses
        const response = await fetch(`${API_BASE}/api/nd/courses`);
        const data = await response.json();
        const courses = data.data || [];

        console.log(`📚 Found ${courses.length} courses to check\n`);

        let fixedCount = 0;

        for (const course of courses) {
            // Check if URL is bad (about:blank# or missing)
            if (!course.url || course.url === 'about:blank#' || course.url === '#') {
                const correctUrl = `/backups/newDesign/detail_courses.html?id=${course.id}`;

                console.log(`🔄 Fixing course ${course.id}: "${course.title}"`);
                console.log(`   Old URL: ${course.url || 'none'}`);
                console.log(`   New URL: ${correctUrl}`);

                // Update the course
                const updateResponse = await fetch(`${API_BASE}/api/nd/courses/${course.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: correctUrl
                    })
                });

                if (updateResponse.ok) {
                    console.log(`   ✅ Updated successfully\n`);
                    fixedCount++;
                } else {
                    console.log(`   ❌ Failed to update: ${updateResponse.status}\n`);
                }
            } else if (course.url.includes('detail_courses.html')) {
                console.log(`✓ Course ${course.id} already has correct URL: ${course.url}`);
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`📊 RESULTS:`);
        console.log(`✅ Fixed ${fixedCount} course URLs`);
        console.log(`📌 All courses now link to: detail_courses.html?id={course_id}`);

    } catch (error) {
        console.error('❌ Error fixing course URLs:', error);
    }
}

// Run the fix
fixCourseUrls().then(() => {
    console.log('\n✨ Course URL fix complete!');
    console.log('🔄 Refresh the courses page to see the changes');
});