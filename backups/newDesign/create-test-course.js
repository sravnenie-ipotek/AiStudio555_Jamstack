/**
 * CREATE TEST COURSE
 * Creates a sample course in the nd_courses table for testing
 */

const API_BASE = 'http://localhost:3000';

async function createTestCourse() {
    const testCourse = {
        title: "Full-Stack Web Development Bootcamp",
        description: "Master modern web development with this comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and launch your career as a full-stack developer.",
        short_description: "Learn full-stack web development from scratch with hands-on projects",
        price: 299,
        old_price: 599,
        category: "Web Development",
        instructor: "John Smith",
        instructor_bio: "Senior Software Engineer with 10+ years of experience in web development. Passionate about teaching and helping students launch their tech careers.",
        duration: "12 weeks",
        level: "Beginner to Advanced",
        lessons_count: 48,
        students_enrolled: 1250,
        rating: 4.8,
        reviews_count: 324,
        thumbnail_url: "images/Featured-Courses-Single-01.jpg",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        objectives: "Build responsive websites,Create dynamic web applications,Master React framework,Develop RESTful APIs,Deploy to cloud platforms",
        requirements: "Basic computer skills,Internet connection,Dedication to learn",
        features: "Lifetime access,Certificate of completion,24/7 support,Project reviews,Job assistance",
        lessons: JSON.stringify([
            { title: "Introduction to Web Development", duration: "45 min" },
            { title: "HTML Fundamentals", duration: "1.5 hours" },
            { title: "CSS Basics and Flexbox", duration: "2 hours" },
            { title: "JavaScript Essentials", duration: "2.5 hours" },
            { title: "DOM Manipulation", duration: "1.5 hours" },
            { title: "Introduction to React", duration: "2 hours" },
            { title: "React Components and Props", duration: "1.5 hours" },
            { title: "State Management with Redux", duration: "2 hours" },
            { title: "Node.js and Express", duration: "2.5 hours" },
            { title: "MongoDB and Mongoose", duration: "2 hours" },
            { title: "Building RESTful APIs", duration: "3 hours" },
            { title: "Authentication and Security", duration: "2 hours" },
            { title: "Deployment and DevOps", duration: "1.5 hours" },
            { title: "Final Project", duration: "8 hours" }
        ]),
        is_visible: true,
        is_featured: true
    };

    try {
        console.log('🚀 Creating test course...\n');

        const response = await fetch(`${API_BASE}/api/nd/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testCourse)
        });

        if (!response.ok) {
            throw new Error(`Failed to create course: ${response.status}`);
        }

        const createdCourse = await response.json();
        console.log('✅ Test course created successfully!');
        console.log('📊 Course Details:');
        console.log(`  ID: ${createdCourse.id}`);
        console.log(`  Title: ${createdCourse.title}`);
        console.log(`  Category: ${createdCourse.category}`);
        console.log(`  Price: $${createdCourse.price}`);
        console.log(`  Lessons: ${createdCourse.lessons_count}`);
        console.log(`  Featured: ${createdCourse.is_featured ? 'Yes' : 'No'}`);
        console.log('\n📌 URLs to test:');
        console.log(`  Admin Panel: http://localhost:3005/admin-nd.html`);
        console.log(`  Course Details: http://localhost:3005/backups/newDesign/detail_courses.html?id=${createdCourse.id}`);
        console.log(`  Courses Page: http://localhost:3005/backups/newDesign/courses.html`);
        console.log(`  Home Page: http://localhost:3005/backups/newDesign/home.html`);

        return createdCourse;
    } catch (error) {
        console.error('❌ Error creating test course:', error);
        console.log('\n⚠️ Make sure the API server is running on port 1337');
        return null;
    }
}

// Run the script
createTestCourse().then(course => {
    if (course) {
        console.log('\n🎯 Next steps:');
        console.log('1. Open the admin panel to see the course');
        console.log('2. Click Preview to test the course details page');
        console.log('3. Check if the course appears on the courses page');
        console.log('4. Verify it shows in Featured Courses on the home page');
    }
});