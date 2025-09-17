// Simple script to update course categories via API
const API_BASE = 'http://localhost:3000/api/nd';

async function updateCategories() {
    console.log('🚀 Updating course categories via API\n');

    const updates = [
        { id: 1, category: 'Web Development' },
        { id: 2, category: 'App Development' },
        { id: 3, category: 'Machine Learning' },
        { id: 4, category: 'Web Development' },
        { id: 5, category: 'App Development' },
        { id: 6, category: 'Machine Learning' },
        { id: 7, category: 'Cloud Computing' },
        { id: 8, category: 'General' }
    ];

    for (const update of updates) {
        try {
            const response = await fetch(`${API_BASE}/courses/${update.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: update.category })
            });

            const result = await response.json();
            if (result.success) {
                console.log(`✅ Course ${update.id}: Updated to "${update.category}"`);
            } else {
                console.log(`❌ Course ${update.id}: Failed to update`);
            }
        } catch (error) {
            console.log(`❌ Course ${update.id}: Error - ${error.message}`);
        }
    }

    console.log('\n📊 Testing category distribution...');

    // Fetch all courses to verify
    const response = await fetch(`${API_BASE}/courses?locale=en`);
    const data = await response.json();

    if (data.success) {
        const categories = {};
        data.data.forEach(course => {
            const cat = course.category || 'Uncategorized';
            categories[cat] = (categories[cat] || 0) + 1;
        });

        console.log('\nCategory Distribution:');
        Object.entries(categories).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} courses`);
        });
    }

    console.log('\n✅ Categories updated! Now check the courses page.');
}

updateCategories().catch(console.error);