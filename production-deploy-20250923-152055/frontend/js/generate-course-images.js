/**
 * COURSE IMAGE GENERATOR
 * Automatically generates contextually appropriate images for course cards
 * Uses Google Gemini API (Imagen 3) via the imageGenerationService
 */

(function() {
    'use strict';

    console.log('🎨 Course Image Generator Initializing...');

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Course categories with appropriate image prompts
    const COURSE_IMAGE_PROMPTS = {
        'Web Development': [
            'Modern web development workspace with multiple monitors showing HTML, CSS and JavaScript code, clean minimalist desk setup, professional lighting',
            'Responsive web design on multiple devices - laptop, tablet and smartphone showing modern website interface, clean tech aesthetic',
            'Web developer coding React application on laptop, coffee cup, modern office environment, warm lighting',
            'Full-stack development concept with frontend and backend code on screens, server room in background, professional tech environment'
        ],
        'App Development': [
            'Mobile app development workspace showing iOS and Android devices with app interfaces, MacBook with code editor, modern tech setup',
            'App developer designing mobile UI/UX on tablet with stylus, smartphone mockups, creative workspace',
            'Cross-platform mobile development with Flutter or React Native code on screen, multiple phones showing app, professional setup',
            'Mobile app testing on various devices, developer hands working with smartphone, clean modern workspace'
        ],
        'Machine Learning': [
            'Artificial intelligence and machine learning visualization with neural network diagram, data flowing through nodes, futuristic tech aesthetic',
            'Data scientist working with machine learning models on multiple monitors showing graphs and algorithms, professional workspace',
            'Deep learning concept with brain-inspired neural networks, glowing connections, dark tech background with blue accents',
            'AI training visualization with datasets, model architecture diagrams, Python code on screens, modern tech office'
        ],
        'Cloud Computing': [
            'Cloud infrastructure visualization with servers, databases and network connections floating in cloudy sky, professional tech illustration',
            'DevOps engineer managing cloud services on multiple screens showing AWS or Azure dashboard, server room background',
            'Cloud architecture diagram with microservices, containers and Kubernetes, modern tech visualization with blue theme',
            'Cloud computing concept with data centers connected globally, world map with network lines, professional tech aesthetic'
        ],
        'Data Science': [
            'Data analytics dashboard with colorful charts, graphs and visualizations on large monitor, professional business setting',
            'Data scientist analyzing big data patterns, multiple screens with statistics and Python code, modern office',
            'Business intelligence visualization with KPI metrics, trend analysis graphs, clean professional interface',
            'Data mining and analysis concept with flowing data streams, statistical models, tech-focused workspace'
        ],
        'Cybersecurity': [
            'Cybersecurity operations center with security monitoring screens, threat detection dashboard, dark professional environment',
            'Digital security concept with lock icon, firewall visualization, binary code background, blue tech aesthetic',
            'Ethical hacker working on laptop with terminal windows, security tools interface, dark modern workspace',
            'Network security visualization with encrypted data flows, shield icons, professional tech illustration'
        ],
        'UI/UX Design': [
            'UI/UX designer creating wireframes and prototypes on tablet and desktop, design tools, creative workspace with mood boards',
            'User interface design process with mockups, color palettes, typography samples on designer desk, modern creative studio',
            'Design thinking workshop with sticky notes, user journey maps, collaborative creative space',
            'Digital product design on large monitor showing Figma or Sketch, stylus tablet, minimalist designer workspace'
        ],
        'Blockchain': [
            'Blockchain technology visualization with connected blocks, cryptographic chains, futuristic blue tech background',
            'Cryptocurrency trading dashboard with Bitcoin and Ethereum charts, multiple monitors, professional trading setup',
            'Smart contract development with Solidity code on screen, blockchain network visualization, modern tech workspace',
            'Decentralized network concept with nodes connecting globally, blockchain ledger visualization, tech aesthetic'
        ],
        'DevOps': [
            'DevOps pipeline visualization with CI/CD workflow, automation tools, modern tech infrastructure diagram',
            'DevOps engineer managing containers and orchestration, Docker and Kubernetes on screens, server environment',
            'Infrastructure as code concept with terminal windows, configuration files, cloud deployment visualization',
            'Continuous integration and deployment workflow with Git, Jenkins, monitoring dashboards, professional setup'
        ],
        'General': [
            'Online learning platform with student using laptop for e-learning course, comfortable home study environment',
            'Professional online education concept with virtual classroom, video lessons on screen, modern learning space',
            'Digital skills training with online course interface, progress tracking, achievement badges, motivating study setup',
            'E-learning technology with interactive lessons, virtual instructor, engaged student learning online'
        ]
    };

    // Get a random prompt for a category
    function getImagePrompt(category) {
        const prompts = COURSE_IMAGE_PROMPTS[category] || COURSE_IMAGE_PROMPTS['General'];
        const randomIndex = Math.floor(Math.random() * prompts.length);
        const basePrompt = prompts[randomIndex];

        // Add consistent style modifiers
        return `${basePrompt}, professional photography, high quality, 4K resolution, clean composition, no text or logos`;
    }

    // Generate image for a single course
    async function generateCourseImage(course) {
        console.log(`🎨 Generating image for course: ${course.title}`);

        try {
            // Ensure image generation service is loaded
            if (!window.imageGenService) {
                console.error('❌ Image generation service not loaded');
                return null;
            }

            // Initialize the service if needed
            await window.imageGenService.init();

            // Get appropriate prompt based on category
            const imagePrompt = getImagePrompt(course.category);
            console.log(`📝 Using prompt: ${imagePrompt.substring(0, 100)}...`);

            // Generate the image
            const result = await window.imageGenService.generateImages(imagePrompt, {
                numberOfImages: 1,
                aspectRatio: '16:9', // Landscape for course cards
                negativePrompt: 'text, watermark, logo, low quality, blurry, distorted'
            });

            if (result.success && result.images && result.images.length > 0) {
                const imageData = result.images[0];

                // Handle both URL and base64 responses
                let imageUrl;
                if (imageData.url) {
                    // Direct URL from server proxy
                    imageUrl = imageData.url;
                } else if (imageData.base64) {
                    // Base64 encoded image
                    imageUrl = `data:${imageData.mimeType || 'image/png'};base64,${imageData.base64}`;
                } else {
                    // Fallback to placeholder
                    imageUrl = imageData.placeholder;
                }

                console.log(`✅ Image generated successfully for: ${course.title}`);
                return imageUrl;
            } else {
                console.warn(`⚠️ Failed to generate image for: ${course.title}`);
                return null;
            }

        } catch (error) {
            console.error(`❌ Error generating image for ${course.title}:`, error);
            return null;
        }
    }

    // Update course card with generated image
    function updateCourseCardImage(courseElement, imageUrl) {
        const imageElements = courseElement.querySelectorAll('.featured-courses-image, .shared-course-card-image');

        imageElements.forEach(img => {
            if (imageUrl) {
                img.src = imageUrl;
                img.style.objectFit = 'cover';
                img.style.width = '100%';
                img.style.height = '100%';
                console.log('✅ Updated course card image');
            }
        });
    }

    // Load and generate images for all courses
    async function generateAllCourseImages() {
        try {
            console.log('🚀 Starting course image generation...');

            // First, load the image generation service if not already loaded
            if (!window.imageGenService) {
                const script1 = document.createElement('script');
                script1.src = '/backups/newDesign/shared/services/imageGenerationService/imageGenerationConfig.js';
                document.head.appendChild(script1);

                await new Promise(resolve => {
                    script1.onload = resolve;
                });

                const script2 = document.createElement('script');
                script2.src = '/backups/newDesign/shared/services/imageGenerationService/imageGenerationService.js';
                document.head.appendChild(script2);

                await new Promise(resolve => {
                    script2.onload = resolve;
                });

                // Wait for service to initialize
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Fetch courses data
            console.log('📡 Fetching courses data...');
            const response = await fetch(`${API_BASE_URL}/api/courses`);

            if (!response.ok) {
                throw new Error(`Failed to fetch courses: ${response.status}`);
            }

            const data = await response.json();

            // Handle wrapped API response
            let courses;
            if (data.success && data.data) {
                courses = Array.isArray(data.data) ? data.data : [data.data];
            } else if (Array.isArray(data)) {
                courses = data;
            } else {
                console.warn('⚠️ No courses data available');
                return;
            }
            console.log(`📚 Found ${courses.length} courses to process`);

            // Find all course cards on the page
            const courseCards = document.querySelectorAll('.featured-courses-collection-item, .shared-course-card-item');
            console.log(`🎯 Found ${courseCards.length} course cards on page`);

            // Process each course and generate image
            for (let i = 0; i < Math.min(courses.length, courseCards.length); i++) {
                const course = courses[i];
                const courseCard = courseCards[i];

                console.log(`\n🔄 Processing course ${i + 1}/${courses.length}: ${course.title}`);

                // Generate image for this course
                const imageUrl = await generateCourseImage(course);

                if (imageUrl) {
                    // Update the course card with the new image
                    updateCourseCardImage(courseCard, imageUrl);

                    // Small delay to avoid overwhelming the API
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            console.log('\n✅ Course image generation complete!');

        } catch (error) {
            console.error('❌ Error in course image generation:', error);
        }
    }

    // Auto-generate images when page loads
    window.addEventListener('DOMContentLoaded', () => {
        console.log('📄 Page loaded, waiting for courses to render...');

        // Wait for courses to be loaded by nd-courses-integration.js
        setTimeout(() => {
            // Check if we're on the courses page
            if (window.location.pathname.includes('courses.html')) {
                console.log('📍 On courses page, starting image generation...');
                generateAllCourseImages();
            }
        }, 3000); // Give time for courses to load
    });

    // Expose functions globally for manual triggering
    window.CourseImageGenerator = {
        generateAll: generateAllCourseImages,
        generateSingle: generateCourseImage,
        updateCard: updateCourseCardImage
    };

    console.log('✅ Course Image Generator ready');
    console.log('💡 To manually trigger: CourseImageGenerator.generateAll()');

})();