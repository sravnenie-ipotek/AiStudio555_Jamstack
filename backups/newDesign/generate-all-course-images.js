const fs = require('fs');
const path = require('path');

// Course image mapping with source template images
const COURSE_IMAGE_MAPPINGS = {
    'React & Redux Masterclass': {
        source: 'Demo-Image1.jpg',
        target: 'course-react.jpg'
    },
    'Node.js Backend Development': {
        source: 'Demo-Image4.jpg',
        target: 'course-nodejs.jpg'
    },
    'Python for Data Science': {
        source: 'Demo-Image10.jpg',
        target: 'course-python.jpg'
    },
    'JavaScript Fundamentals': {
        source: 'Demo-Image2.jpg',
        target: 'course-javascript.jpg'
    },
    'Full Stack Web Development': {
        source: 'Demo-Image3.jpg',
        target: 'course-fullstack.jpg'
    },
    'Mobile App Development': {
        source: 'Demo-Image5.jpg',
        target: 'course-mobile.jpg'
    },
    'Machine Learning Basics': {
        source: 'Demo-Image6.jpg',
        target: 'course-ml.jpg'
    },
    'Cloud Computing AWS': {
        source: 'Demo-Image7.jpg',
        target: 'course-aws.jpg'
    },
    'Database Design & SQL': {
        source: 'Demo-Image8.jpg',
        target: 'course-database.jpg'
    },
    'UI/UX Design Principles': {
        source: 'Demo-Image9.jpg',
        target: 'course-design.jpg'
    },
    'DevOps & CI/CD': {
        source: 'Demo-Image11.jpg',
        target: 'course-devops.jpg'
    },
    'Data Analytics': {
        source: 'Demo-Image12.jpg',
        target: 'course-analytics.jpg'
    }
};

const IMAGES_DIR = '/Users/michaelmishayev/Desktop/newCode/backups/newDesign/images';

function generateCourseImages() {
    console.log('🖼️ Generating static course images...');

    let generated = 0;
    let existing = 0;
    let errors = 0;

    for (const [courseTitle, mapping] of Object.entries(COURSE_IMAGE_MAPPINGS)) {
        const sourcePath = path.join(IMAGES_DIR, mapping.source);
        const targetPath = path.join(IMAGES_DIR, mapping.target);

        try {
            // Check if source exists
            if (!fs.existsSync(sourcePath)) {
                console.warn(`⚠️ Source image not found: ${mapping.source}`);
                errors++;
                continue;
            }

            // Check if target already exists
            if (fs.existsSync(targetPath)) {
                console.log(`✅ ${mapping.target} already exists`);
                existing++;
                continue;
            }

            // Copy source to target
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`🎯 Generated: ${courseTitle} → ${mapping.target}`);
            generated++;

        } catch (error) {
            console.error(`❌ Error generating ${mapping.target}:`, error.message);
            errors++;
        }
    }

    console.log(`\n📊 Generation Summary:`);
    console.log(`  ✅ Generated: ${generated} images`);
    console.log(`  🔹 Already existed: ${existing} images`);
    console.log(`  ❌ Errors: ${errors} images`);
    console.log(`  📦 Total mappings: ${Object.keys(COURSE_IMAGE_MAPPINGS).length}`);

    // Create updated static image mapping for JavaScript
    const jsMapping = {};
    for (const [courseTitle, mapping] of Object.entries(COURSE_IMAGE_MAPPINGS)) {
        jsMapping[courseTitle] = `images/${mapping.target}`;
    }

    console.log(`\n📝 Updated JavaScript mapping:`);
    console.log('const staticImages = ' + JSON.stringify(jsMapping, null, 4) + ';');

    return {
        generated,
        existing,
        errors,
        total: Object.keys(COURSE_IMAGE_MAPPINGS).length,
        mapping: jsMapping
    };
}

// Run the generation
if (require.main === module) {
    generateCourseImages();
}

module.exports = { generateCourseImages, COURSE_IMAGE_MAPPINGS };