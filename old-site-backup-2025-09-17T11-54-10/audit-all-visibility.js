#!/usr/bin/env node

/**
 * ULTRATHINK: Comprehensive Visibility Audit
 * Checks ALL visibility fields across ALL pages
 */

const https = require('https');
const API_URL = 'https://aistudio555jamstack-production.up.railway.app';

console.log('🔍 ULTRATHINK VISIBILITY AUDIT - ALL PAGES\n');

// All visibility fields by page
const visibilityFields = {
    'HOME PAGE': {
        endpoint: '/api/home-page',
        fields: [
            'heroSectionVisible',
            'featuredCoursesVisible',
            'aboutVisible',
            'companiesVisible',
            'testimonialsVisible',
            // Individual courses visibility
            'course_1_visible',
            'course_2_visible',
            'course_3_visible',
            'course_4_visible',
            'course_5_visible',
            'course_6_visible',
            // Individual testimonials visibility
            'testimonial_1_visible',
            'testimonial_2_visible',
            'testimonial_3_visible',
            'testimonial_4_visible'
        ]
    },
    'CAREER ORIENTATION PAGE': {
        endpoint: '/api/career-orientation-page',
        fields: [
            'heroVisible',
            'problemsVisible',
            'solutionsVisible',
            'processVisible',
            'careerPathsVisible',
            'expertVisible',
            'partnersVisible',
            'assessmentVisible',
            'footerVisible'
        ]
    },
    'COURSES': {
        endpoint: '/api/courses',
        fields: ['visible'] // Per course visibility
    },
    'CAREER RESOURCES': {
        endpoint: '/api/career-resources',
        fields: ['visible'] // Per resource visibility
    }
};

// Function to fetch API data
function fetchData(endpoint) {
    return new Promise((resolve, reject) => {
        https.get(`${API_URL}${endpoint}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function auditVisibility() {
    console.log('📊 VISIBILITY FIELDS AUDIT\n');
    
    for (const [pageName, config] of Object.entries(visibilityFields)) {
        console.log(`\n🔍 ${pageName}`);
        console.log('─'.repeat(50));
        
        try {
            const response = await fetchData(config.endpoint);
            
            if (pageName === 'COURSES' || pageName === 'CAREER RESOURCES') {
                // Handle array responses
                const items = response.data || [];
                console.log(`Total items: ${items.length}`);
                
                let visibleCount = 0;
                let hiddenCount = 0;
                
                items.forEach(item => {
                    const visible = item.attributes?.visible;
                    if (visible) visibleCount++;
                    else hiddenCount++;
                });
                
                console.log(`✅ Visible: ${visibleCount} items`);
                console.log(`❌ Hidden: ${hiddenCount} items`);
            } else {
                // Handle single page responses
                const attrs = response.data?.attributes || {};
                
                config.fields.forEach(field => {
                    const value = attrs[field];
                    const status = value ? '✅' : '❌';
                    console.log(`${status} ${field}: ${value !== undefined ? value : 'NOT FOUND'}`);
                });
            }
        } catch (error) {
            console.log(`❌ Error fetching ${pageName}: ${error.message}`);
        }
    }
    
    console.log('\n\n📝 FRONTEND IMPLEMENTATION STATUS\n');
    console.log('─'.repeat(50));
    
    console.log('\n❌ NOT IMPLEMENTED (Frontend ignores visibility):');
    console.log('• Home Page - Hero Section');
    console.log('• Home Page - Featured Courses Section');
    console.log('• Home Page - About Section');
    console.log('• Home Page - Companies Section');
    console.log('• Home Page - Testimonials Section');
    console.log('• Career Orientation - All 9 sections');
    console.log('• Courses - Individual course visibility');
    console.log('• Career Resources - Individual resource visibility');
    
    console.log('\n🎯 IMPLEMENTATION NEEDED:');
    console.log('1. Add JavaScript to check visibility flags');
    console.log('2. Hide/show sections based on API response');
    console.log('3. Apply to all pages with visibility controls');
    
    console.log('\n💡 TOTAL VISIBILITY FIELDS: 29+');
    console.log('• Home Page: 15 fields');
    console.log('• Career Orientation: 9 fields');
    console.log('• Courses: 1 per course');
    console.log('• Career Resources: 1 per resource');
}

auditVisibility();