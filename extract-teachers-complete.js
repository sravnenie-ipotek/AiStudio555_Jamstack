#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Extract teacher data from HTML
function extractTeachersFromHTML() {
    const htmlPath = path.join(__dirname, 'en/teachers.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Regex to find teacher cards
    const teacherCardRegex = /<div class="teacher-card-minimal"[^>]*data-category="([^"]+)"[^>]*>(.*?)<button class="contact-teacher-btn">Contact Teacher<\/button>\s*<\/div>/gs;

    const teachers = [];
    let match;
    let order = 1;

    while ((match = teacherCardRegex.exec(htmlContent)) !== null) {
        const category = match[1];
        const cardContent = match[2];

        // Extract name
        const nameMatch = cardContent.match(/<h3 class="teacher-name-minimal">([^<]+)<\/h3>/);
        const name = nameMatch ? nameMatch[1].trim() : '';

        // Extract role (includes company)
        const roleMatch = cardContent.match(/<p class="teacher-role-minimal">([^<]+)<\/p>/);
        const fullRole = roleMatch ? roleMatch[1].trim() : '';

        // Split role and company
        let title = fullRole;
        let company = '';
        if (fullRole.includes(' | ')) {
            [title, company] = fullRole.split(' | ').map(s => s.trim());
        }

        // Extract experience
        const expMatch = cardContent.match(/<p class="teacher-experience-minimal">([^<]+)<\/p>/);
        const experience = expMatch ? expMatch[1].trim() : '';

        // Extract image info
        const imgMatch = cardContent.match(/<img src="([^"]+)" alt="([^"]+)"[^>]*>/);
        const originalImg = imgMatch ? imgMatch[1] : '';
        const altText = imgMatch ? imgMatch[2] : name;

        // Get fallback Unsplash URL if available
        const fallbackMatch = cardContent.match(/onerror="this\.src='([^']+)'/);
        const unsplashFallback = fallbackMatch ? fallbackMatch[1] : '';

        // Create teacher object
        const teacher = {
            name,
            title,
            company,
            bio: `Expert ${title}${company ? ` at ${company}` : ''} with extensive industry experience.`,
            category,
            experience,
            experience_years: parseInt(experience.match(/(\d+)\+?\s*years?/i)?.[1] || '5'),
            display_order: order++,
            locale: 'en',
            specialties: getSpecialtiesByCategory(category),
            // Image will be replaced with Google Photos URL
            image_url: unsplashFallback || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=667eea&color=ffffff`,
            linkedin_url: '', // To be filled manually
            github_url: '', // To be filled manually
            published_at: new Date().toISOString()
        };

        teachers.push(teacher);
    }

    return teachers;
}

// Get specialties based on category
function getSpecialtiesByCategory(category) {
    const specialtiesMap = {
        'machine-learning': 'Machine Learning, Deep Learning, Neural Networks, Python, TensorFlow',
        'development': 'Software Development, Programming, System Architecture, DevOps',
        'data-analytics': 'Data Science, Statistics, Data Visualization, SQL, Python',
        'cloud-devops': 'Cloud Computing, DevOps, Infrastructure, Docker, Kubernetes',
        'design': 'UX Design, UI Design, Product Design, User Research, Prototyping',
        'management': 'Project Management, Team Leadership, Product Management, Strategy'
    };

    return specialtiesMap[category] || 'Technology, Education, Industry Experience';
}

// Main execution
try {
    console.log('🔍 Extracting teachers from HTML...');
    const teachers = extractTeachersFromHTML();

    console.log(`✅ Found ${teachers.length} teachers`);

    // Save to JSON file
    const outputPath = path.join(__dirname, 'teachers-extracted-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(teachers, null, 2));

    console.log(`💾 Teacher data saved to: ${outputPath}`);

    // Display summary
    console.log('\n📊 Teachers by Category:');
    const categoryCount = {};
    teachers.forEach(teacher => {
        categoryCount[teacher.category] = (categoryCount[teacher.category] || 0) + 1;
        console.log(`  ${teacher.display_order}. ${teacher.name} - ${teacher.title} (${teacher.category})`);
    });

    console.log('\n📈 Category Summary:');
    Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} teachers`);
    });

    console.log('\n✨ Next steps:');
    console.log('1. Replace image_url with Google Photos URLs');
    console.log('2. Add LinkedIn/GitHub URLs manually');
    console.log('3. Run population script to add to database');

} catch (error) {
    console.error('❌ Error extracting teachers:', error.message);
    process.exit(1);
}