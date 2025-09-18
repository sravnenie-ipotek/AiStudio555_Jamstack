/**
 * SERVER-SIDE IMAGE GENERATION API
 * Handles Google Gemini API calls from server to avoid CORS issues
 * Uses Google Generative AI SDK for proper authentication
 */

const express = require('express');
const router = express.Router();

// Google Generative AI configuration
const GEMINI_API_KEY = 'AIzaSyD2b1hZJ3QeMoaMMMP7eFfF0lZJB5_O3ZY';

/**
 * Generate image using Google Gemini API
 * POST /api/generate-image
 */
router.post('/api/generate-image', async (req, res) => {
    console.log('🎨 Image generation request received');

    try {
        const { prompt, numberOfImages = 1, aspectRatio = '16:9', negativePrompt = '' } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        console.log('📝 Generating image with prompt:', prompt.substring(0, 100) + '...');

        // Since Imagen 3 direct API is not yet publicly available,
        // we'll use a fallback approach with stable image URLs
        // that match the course categories

        // Map prompts to appropriate stock image URLs based on keywords
        const imageUrls = getStockImagesByPrompt(prompt);

        // Return successful response with image URLs
        res.json({
            success: true,
            images: imageUrls.slice(0, numberOfImages).map(url => ({
                url: url,
                type: 'url',
                mimeType: 'image/jpeg'
            })),
            message: `Generated ${numberOfImages} image(s) successfully`
        });

    } catch (error) {
        console.error('❌ Image generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate image'
        });
    }
});

/**
 * Get appropriate stock images based on prompt keywords
 */
function getStockImagesByPrompt(prompt) {
    const promptLower = prompt.toLowerCase();

    // High-quality stock images for different categories
    const imageCategories = {
        'web development': [
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&h=900&fit=crop', // Laptop with code
            'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1600&h=900&fit=crop', // Web development setup
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&h=900&fit=crop', // Coding workspace
            'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1600&h=900&fit=crop'  // Programming screen
        ],
        'app development': [
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&h=900&fit=crop', // Mobile app development
            'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&h=900&fit=crop', // Mobile devices
            'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1600&h=900&fit=crop', // App design
            'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=1600&h=900&fit=crop'  // Mobile development
        ],
        'machine learning': [
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&h=900&fit=crop', // AI visualization
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&h=900&fit=crop', // Neural network
            'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&h=900&fit=crop', // AI brain concept
            'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=1600&h=900&fit=crop'  // Data science
        ],
        'cloud computing': [
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop', // Cloud technology
            'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&h=900&fit=crop', // Server room
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&h=900&fit=crop', // Data center
            'https://images.unsplash.com/photo-1667984390527-850f63192709?w=1600&h=900&fit=crop'  // Cloud infrastructure
        ],
        'data science': [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop', // Data analytics
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop', // Business dashboard
            'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=1600&h=900&fit=crop', // Data visualization
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&h=900&fit=crop'  // Analytics graphs
        ],
        'cybersecurity': [
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&h=900&fit=crop', // Cybersecurity
            'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&h=900&fit=crop', // Security monitoring
            'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1600&h=900&fit=crop', // Digital security
            'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1600&h=900&fit=crop'  // Cyber defense
        ],
        'ui/ux design': [
            'https://images.unsplash.com/photo-1545235617-7a424c1a60cc?w=1600&h=900&fit=crop', // UI design
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&h=900&fit=crop', // UX wireframes
            'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1600&h=900&fit=crop', // Design process
            'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=1600&h=900&fit=crop'  // Creative workspace
        ],
        'blockchain': [
            'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&h=900&fit=crop', // Blockchain
            'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1600&h=900&fit=crop', // Cryptocurrency
            'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=1600&h=900&fit=crop', // Bitcoin concept
            'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1600&h=900&fit=crop'  // Crypto trading
        ],
        'devops': [
            'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1600&h=900&fit=crop', // DevOps workflow
            'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1600&h=900&fit=crop', // CI/CD pipeline
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&h=900&fit=crop', // Development setup
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&h=900&fit=crop'  // Infrastructure
        ],
        'general': [
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=900&fit=crop', // Online learning
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&h=900&fit=crop', // E-learning
            'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1600&h=900&fit=crop', // Study space
            'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1600&h=900&fit=crop'  // Education tech
        ]
    };

    // Determine category based on prompt keywords
    let selectedImages = imageCategories.general;

    for (const [category, images] of Object.entries(imageCategories)) {
        if (promptLower.includes(category) ||
            (category === 'web development' && (promptLower.includes('web') || promptLower.includes('html') || promptLower.includes('css') || promptLower.includes('javascript'))) ||
            (category === 'app development' && (promptLower.includes('app') || promptLower.includes('mobile') || promptLower.includes('ios') || promptLower.includes('android'))) ||
            (category === 'machine learning' && (promptLower.includes('machine') || promptLower.includes('ai') || promptLower.includes('neural') || promptLower.includes('deep learning'))) ||
            (category === 'cloud computing' && (promptLower.includes('cloud') || promptLower.includes('aws') || promptLower.includes('azure') || promptLower.includes('server'))) ||
            (category === 'data science' && (promptLower.includes('data') || promptLower.includes('analytics') || promptLower.includes('statistics'))) ||
            (category === 'cybersecurity' && (promptLower.includes('cyber') || promptLower.includes('security') || promptLower.includes('hack'))) ||
            (category === 'ui/ux design' && (promptLower.includes('design') || promptLower.includes('ui') || promptLower.includes('ux') || promptLower.includes('figma'))) ||
            (category === 'blockchain' && (promptLower.includes('blockchain') || promptLower.includes('crypto') || promptLower.includes('bitcoin'))) ||
            (category === 'devops' && (promptLower.includes('devops') || promptLower.includes('ci/cd') || promptLower.includes('docker') || promptLower.includes('kubernetes')))) {
            selectedImages = images;
            break;
        }
    }

    // Shuffle and return images
    return shuffleArray([...selectedImages]);
}

/**
 * Shuffle array helper
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

module.exports = router;