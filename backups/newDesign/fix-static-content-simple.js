/**
 * SIMPLE FIX FOR STATIC CONTENT
 * Manually update course with objectives to test dynamic replacement
 */

const API_BASE = 'http://localhost:3000';

async function fixStaticContent() {
    console.log('🔧 Fixing Static Content with Manual Update\n');

    // Simple update for Course 2
    const courseUpdate = {
        objectives: "Build scalable React applications,Master Redux state management,Create reusable components,Handle API integration,Deploy production apps",
        what_you_learn: [
            "Build scalable React applications",
            "Master Redux state management",
            "Create reusable components",
            "Handle API integration seamlessly",
            "Deploy production-ready apps"
        ]
    };

    try {
        console.log('📝 Updating Course 2 with objectives...');

        const response = await fetch(`${API_BASE}/api/nd/courses/2`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseUpdate)
        });

        const result = await response.text();
        console.log('Response:', result.substring(0, 200));

        if (response.ok) {
            console.log('✅ Course 2 updated successfully');
        } else {
            console.log(`❌ Update failed: ${response.status}`);
        }

        // Verify the update
        console.log('\n📊 Verifying update...');
        const verifyResponse = await fetch(`${API_BASE}/api/nd/courses/2`);
        const verifyResult = await verifyResponse.text();
        console.log('Verification:', verifyResult.substring(0, 200));

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fixStaticContent().catch(console.error);