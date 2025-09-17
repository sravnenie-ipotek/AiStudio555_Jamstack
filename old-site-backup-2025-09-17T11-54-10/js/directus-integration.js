/**
 * Directus API Integration
 * Provides REST and GraphQL access to your content
 * Works alongside existing Custom Express API
 */

class DirectusIntegration {
    constructor() {
        // Get your Directus domain from Railway
        this.DIRECTUS_URL = 'https://attractive-determination-production.up.railway.app';
        this.API_BASE = `${this.DIRECTUS_URL}/items`;
        this.GRAPHQL_URL = `${this.DIRECTUS_URL}/graphql`;
        
        // Public API access (configure in Directus admin for authentication if needed)
        this.headers = {
            'Content-Type': 'application/json'
        };
        
        console.log('🚀 Directus Integration initialized:', this.DIRECTUS_URL);
    }

    // REST API Methods
    async getCollection(collection, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${this.API_BASE}/${collection}${queryString ? '?' + queryString : ''}`;
            
            console.log(`📊 Fetching from Directus: ${url}`);
            const response = await fetch(url, { headers: this.headers });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result.data || result;
        } catch (error) {
            console.error(`❌ Error fetching ${collection}:`, error);
            return null;
        }
    }

    async getItem(collection, id) {
        try {
            const url = `${this.API_BASE}/${collection}/${id}`;
            const response = await fetch(url, { headers: this.headers });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result.data || result;
        } catch (error) {
            console.error(`❌ Error fetching ${collection}/${id}:`, error);
            return null;
        }
    }

    // Get courses
    async getCourses(locale = 'en') {
        return await this.getCollection('courses', {
            filter: locale !== 'en' ? { locale: { _eq: locale } } : {}
        });
    }

    // Get home page content
    async getHomePage(locale = 'en') {
        const pages = await this.getCollection('home_pages', {
            filter: { locale: { _eq: locale } },
            limit: 1
        });
        return pages && pages.length > 0 ? pages[0] : null;
    }

    // Get about page
    async getAboutPage(locale = 'en') {
        const pages = await this.getCollection('about_pages', {
            filter: { locale: { _eq: locale } },
            limit: 1
        });
        return pages && pages.length > 0 ? pages[0] : null;
    }

    // Get teachers
    async getTeachers() {
        return await this.getCollection('teachers', {
            sort: 'order'
        });
    }

    // Get blog posts
    async getBlogPosts(limit = 10) {
        return await this.getCollection('blog_posts', {
            sort: '-published_at',
            limit: limit
        });
    }

    // Get FAQs
    async getFAQs(locale = 'en') {
        return await this.getCollection('faqs', {
            filter: { locale: { _eq: locale } },
            sort: 'order'
        });
    }

    // GraphQL Query Method
    async graphqlQuery(query, variables = {}) {
        try {
            const response = await fetch(this.GRAPHQL_URL, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('❌ GraphQL query error:', error);
            return null;
        }
    }

    // Example GraphQL query for courses
    async getCoursesGraphQL() {
        const query = `
            query GetCourses {
                courses {
                    id
                    title
                    description
                    price
                    duration
                    lessons
                    category
                    rating
                    visible
                }
            }
        `;
        const result = await this.graphqlQuery(query);
        return result ? result.courses : null;
    }

    // Multi-language content with fallback
    async getLocalizedContent(collection, locale = 'en') {
        // Try to get content in requested language
        let content = await this.getCollection(collection, {
            filter: { locale: { _eq: locale } }
        });

        // Fallback to English if not found
        if ((!content || content.length === 0) && locale !== 'en') {
            console.log(`📝 No ${locale} content found, falling back to English`);
            content = await this.getCollection(collection, {
                filter: { locale: { _eq: 'en' } }
            });
        }

        return content;
    }

    // Update existing page with Directus data
    async updatePageWithDirectusData() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('home') || currentPage === '/') {
            const homeData = await this.getHomePage();
            if (homeData) {
                console.log('🏠 Home page data from Directus:', homeData);
                // Update DOM elements with Directus data
                this.updateHomePageElements(homeData);
            }
        } else if (currentPage.includes('courses')) {
            const courses = await this.getCourses();
            if (courses) {
                console.log('📚 Courses from Directus:', courses);
                this.updateCoursesElements(courses);
            }
        } else if (currentPage.includes('teachers')) {
            const teachers = await this.getTeachers();
            if (teachers) {
                console.log('👨‍🏫 Teachers from Directus:', teachers);
                this.updateTeachersElements(teachers);
            }
        }
    }

    // Update home page elements
    updateHomePageElements(data) {
        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && data.hero_title) {
            heroTitle.textContent = data.hero_title;
        }

        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && data.hero_subtitle) {
            heroSubtitle.textContent = data.hero_subtitle;
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription && data.hero_description) {
            heroDescription.textContent = data.hero_description;
        }

        // Log what fields are available
        console.log('📋 Available home page fields:', Object.keys(data));
    }

    // Update courses elements
    updateCoursesElements(courses) {
        const coursesContainer = document.querySelector('.courses-container, .course-grid, #courses-list');
        if (!coursesContainer || !courses) return;

        console.log(`📚 Updating ${courses.length} courses on the page`);
        // Implementation depends on your HTML structure
    }

    // Update teachers elements
    updateTeachersElements(teachers) {
        const teachersContainer = document.querySelector('.teachers-container, .team-grid, #teachers-list');
        if (!teachersContainer || !teachers) return;

        console.log(`👥 Updating ${teachers.length} teachers on the page`);
        // Implementation depends on your HTML structure
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎉 Initializing Directus Integration...');
    
    const directus = new DirectusIntegration();
    window.directusAPI = directus; // Make it globally accessible for testing
    
    // Test API connection
    console.log('🧪 Testing Directus API...');
    
    // Test REST API
    const courses = await directus.getCourses();
    if (courses) {
        console.log('✅ REST API working! Found courses:', courses.length);
    }
    
    // Test GraphQL
    const graphqlCourses = await directus.getCoursesGraphQL();
    if (graphqlCourses) {
        console.log('✅ GraphQL API working! Found courses:', graphqlCourses.length);
    }
    
    // Update page with Directus data
    await directus.updatePageWithDirectusData();
    
    console.log('🎯 Directus Integration ready! Access via window.directusAPI');
    console.log('💡 Example queries:');
    console.log('   await directusAPI.getCourses()');
    console.log('   await directusAPI.getHomePage("ru")');
    console.log('   await directusAPI.getTeachers()');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DirectusIntegration;
}