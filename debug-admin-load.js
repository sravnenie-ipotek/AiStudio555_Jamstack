// Debug script to test career orientation loading
// Paste this into browser console when on the admin page

console.log('🔍 Starting Career Orientation Debug...');

// Check if functions exist
console.log('loadCareerOrientationPage exists?', typeof loadCareerOrientationPage === 'function');
console.log('setFieldValue exists?', typeof setFieldValue === 'function');

// Try to load the data manually
if (typeof loadCareerOrientationPage === 'function') {
    console.log('📥 Calling loadCareerOrientationPage()...');
    loadCareerOrientationPage().then(() => {
        console.log('✅ Load complete, checking fields...');
        
        // Check some field values
        const fields = [
            'hero_main_title',
            'hero_subtitle', 
            'hero_description',
            'problems_main_title',
            'solutions_main_title'
        ];
        
        fields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                console.log(`Field ${fieldId}: "${element.value}"`);
            } else {
                console.log(`Field ${fieldId}: NOT FOUND IN DOM`);
            }
        });
    }).catch(error => {
        console.error('❌ Error loading:', error);
    });
} else {
    console.log('❌ loadCareerOrientationPage function not found!');
    
    // Try manual fetch
    console.log('📥 Trying manual fetch...');
    fetch('/api/career-orientation-page?locale=en')
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
            if (data.data && data.data.attributes) {
                const attrs = data.data.attributes;
                console.log('Found fields:', Object.keys(attrs).length);
                console.log('Sample data:');
                console.log('  heroMainTitle:', attrs.heroMainTitle);
                console.log('  heroSubtitle:', attrs.heroSubtitle);
                
                // Try to set fields manually
                const heroTitle = document.getElementById('hero_main_title');
                if (heroTitle) {
                    heroTitle.value = attrs.heroMainTitle || 'TEST VALUE';
                    console.log('✅ Set hero_main_title to:', heroTitle.value);
                } else {
                    console.log('❌ hero_main_title element not found');
                }
            }
        })
        .catch(error => {
            console.error('❌ Fetch error:', error);
        });
}