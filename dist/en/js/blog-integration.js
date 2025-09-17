// Blog Integration with Database
// This file handles fetching blog posts from the API and rendering them dynamically

const BlogIntegration = {
    // Configuration
    config: {
        apiUrl: window.location.hostname === 'localhost'
            ? 'http://localhost:1337/api/blog-posts'
            : 'https://aistudio555jamstack-production.up.railway.app/api/blog-posts',
        postsPerPage: 9,
        currentPage: 1,
        totalPosts: 0,
        defaultImages: [
            'images/CTA-Section-Bg.jpg',
            'images/Course-Categories-Content-Bg.jpg',
            'images/About-Me-Image.jpg',
            'images/About-Us-Image.png',
            'images/Authentication-Image.jpg',
            'images/Banner-Element.png',
            'images/Course-Categories-Hover-In-Shape.jpg',
            'images/Inner-Banner-Bg.jpg',
            'images/Process-Image.jpg'
        ],
        categories: {
            'ai': 'AI & Machine Learning',
            'web': 'Web Development',
            'career': 'Career Development',
            'data': 'Data Science',
            'security': 'Cybersecurity',
            'design': 'UI/UX Design',
            'cloud': 'Cloud Computing',
            'mobile': 'Mobile Development',
            'devops': 'DevOps'
        }
    },

    // Initialize the blog
    init: function() {
        console.log('Initializing blog integration...');
        this.loadBlogPosts();
        this.setupEventListeners();
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Add pagination listeners if needed
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
        }
    },

    // Load blog posts from API
    loadBlogPosts: async function(page = 1) {
        try {
            console.log('Fetching blog posts from API...');
            const response = await fetch(`${this.config.apiUrl}?page=${page}&limit=${this.config.postsPerPage}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            // Handle different API response structures
            let posts = [];
            if (result.data && Array.isArray(result.data)) {
                // Strapi-style response
                posts = result.data.map(item => this.normalizePost(item));
            } else if (Array.isArray(result)) {
                // Direct array response
                posts = result.map(post => this.normalizePost(post));
            } else if (result.posts && Array.isArray(result.posts)) {
                // Wrapped response
                posts = result.posts.map(post => this.normalizePost(post));
            }

            if (posts.length === 0) {
                console.log('No posts found, displaying placeholder content');
                this.displayPlaceholderContent();
            } else {
                this.renderBlogPosts(posts);
            }

        } catch (error) {
            console.error('Error fetching blog posts:', error);
            this.displayPlaceholderContent();
        }
    },

    // Normalize post data from different API structures
    normalizePost: function(item) {
        // Handle Strapi-style response
        if (item.attributes) {
            return {
                id: item.id,
                title: item.attributes.title || 'Untitled Post',
                excerpt: item.attributes.excerpt || item.attributes.description || '',
                content: item.attributes.content || '',
                author: item.attributes.author || 'Guest Author',
                category: item.attributes.category || 'ai',
                image: item.attributes.featured_image || item.attributes.image || this.getRandomImage(),
                url: item.attributes.url || '#',
                publishedAt: item.attributes.publishedAt || item.attributes.published_at || new Date().toISOString(),
                slug: item.attributes.slug || this.generateSlug(item.attributes.title)
            };
        }

        // Handle direct object
        return {
            id: item.id,
            title: item.title || 'Untitled Post',
            excerpt: item.excerpt || item.description || '',
            content: item.content || '',
            author: item.author || 'Guest Author',
            category: item.category || 'general',
            image: item.featured_image || item.image || this.getRandomImage(),
            url: item.url || '#',
            publishedAt: item.published_at || item.publishedAt || new Date().toISOString(),
            slug: item.slug || this.generateSlug(item.title)
        };
    },

    // Render blog posts to the page
    renderBlogPosts: function(posts) {
        const container = document.querySelector('.main-blog-collection-list');
        if (!container) {
            console.error('Blog container not found');
            return;
        }

        // Clear existing content completely
        container.innerHTML = '';

        // Remove any old Webflow classes and apply shared card grid
        container.classList.remove('use-uniform-cards');
        container.classList.add('uniform-card-grid');

        // Add a data attribute to mark this as blog-integration controlled
        container.setAttribute('data-blog-integration', 'true');

        // Render each post
        posts.forEach((post, index) => {
            const postElement = this.createBlogCard(post, index);
            container.appendChild(postElement);
        });

        // Add animation
        this.animateBlogCards();
    },

    // Create a single blog card element (reverted to working version with uniform sizing)
    createBlogCard: function(post, index) {
        // Debug logging to ensure we have real data
        console.log('Creating blog card for post:', post.title, 'by', post.author);

        const categoryDisplay = this.config.categories[post.category] || this.formatCategory(post.category);
        const imageUrl = post.image && (post.image.startsWith('http') || post.image.startsWith('images/'))
            ? post.image
            : this.getRandomImage();

        // Ensure we never have template placeholders in our data
        const safePost = {
            id: post.id || 'default-id',
            title: (post.title || 'Default Title').replace(/\{\{.*?\}\}/g, 'Default Title'),
            author: (post.author || 'Default Author').replace(/\{\{.*?\}\}/g, 'Default Author'),
            excerpt: (post.excerpt || 'Default description').replace(/\{\{.*?\}\}/g, 'Default description'),
            url: post.url || '#'
        };

        const cardHtml = `
            <div class="uniform-card">
                <a href="${safePost.url}" class="uniform-card-image-link" target="_blank" rel="noopener noreferrer">
                    <img src="${imageUrl}" loading="lazy" alt="${safePost.title}" class="uniform-card-image" onerror="this.src='${this.config.defaultImages[0]}'">
                </a>
                <div class="uniform-card-content">
                    <div class="uniform-card-header">
                        <div class="uniform-card-category">
                            <div class="uniform-card-category-flex">
                                <div class="uniform-card-category-dot"></div>
                                <div class="uniform-card-category-text">${categoryDisplay}</div>
                            </div>
                        </div>
                        <div class="uniform-card-author">
                            <img src="images/Blog-Card-Author-Icon.svg" loading="lazy" alt="Author" class="uniform-card-author-icon">
                            <div class="uniform-card-author-name">${safePost.author}</div>
                        </div>
                    </div>
                    <a href="${safePost.url}" class="uniform-card-title" target="_blank" rel="noopener noreferrer">${safePost.title}</a>
                    <div class="uniform-card-divider"></div>
                    <p class="uniform-card-description">${safePost.excerpt}</p>
                    <div class="uniform-card-action">
                        <a href="${safePost.url}" class="uniform-card-button" target="_blank" rel="noopener noreferrer">
                            <div class="uniform-card-button-text">Read Full Article</div>
                            <div class="uniform-card-button-arrow"></div>
                        </a>
                    </div>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.className = 'uniform-card-item';
        div.setAttribute('role', 'listitem');
        div.innerHTML = cardHtml;

        // No need for click handlers - using direct links now

        return div;
    },

    // Fallback blog card creation (original method)
    createFallbackBlogCard: function(post, index) {
        const categoryDisplay = this.config.categories[post.category] || this.formatCategory(post.category);
        const imageUrl = post.image.startsWith('http') ? post.image : post.image;

        const cardHtml = `
            <div class="main-blog-single">
                <a href="#" class="main-blog-image-link w-inline-block" data-post-id="${post.id}">
                    <img src="${imageUrl}" loading="lazy" alt="${post.title}" class="main-blog-image" onerror="this.src='${this.config.defaultImages[0]}'">
                </a>
                <div class="main-blog-typography">
                    <div class="blog-card-categories-author">
                        <div class="blog-card-categories-wrap">
                            <div class="blog-card-categories-flex">
                                <div class="blog-card-categories-circel"></div>
                                <div class="blog-card-categories-name">${categoryDisplay}</div>
                            </div>
                        </div>
                        <div class="blog-card-author-name-icon">
                            <img src="images/Blog-Card-Author-Icon.svg" loading="lazy" alt="" class="blog-card-author-icon">
                            <div class="blog-card-author-name">${post.author}</div>
                        </div>
                    </div>
                    <a href="#" class="blog-post-name" data-post-id="${post.id}">${post.title}</a>
                    <div class="main-blog-line"></div>
                    <p class="main-blog-description-text">${post.excerpt || this.truncateText(post.content, 150)}</p>
                    <div class="blog-card-link-wrap">
                        <a href="#" class="blog-card-link w-inline-block" data-post-id="${post.id}">
                            <div class="blog-card-link-text">Read this Article</div>
                            <div class="blog-card-link-arrow"></div>
                        </a>
                    </div>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.className = 'uniform-card-item';
        div.setAttribute('role', 'listitem');
        div.innerHTML = cardHtml;

        // No need for click handlers - using direct links now

        return div;
    },

    // Display placeholder content when no posts are available
    displayPlaceholderContent: function() {
        const placeholderPosts = [
            {
                id: 1,
                title: "The Future of AI in Education: Transforming How We Learn",
                excerpt: "Explore how artificial intelligence is revolutionizing education through personalized learning paths, intelligent tutoring systems, and adaptive assessments.",
                author: "Sarah Chen",
                category: "ai",
                image: "images/CTA-Section-Bg.jpg"
            },
            {
                id: 2,
                title: "Web Development Trends to Watch in 2024",
                excerpt: "Stay ahead of the curve with the latest web development trends, from serverless architecture and edge computing to WebAssembly and progressive web applications.",
                author: "Mike Johnson",
                category: "web",
                image: "images/Course-Categories-Content-Bg.jpg"
            },
            {
                id: 3,
                title: "5 Steps to Successfully Transition into Tech",
                excerpt: "A comprehensive guide for career changers looking to break into the tech industry, covering skill development, portfolio building, and networking strategies.",
                author: "Emily Rodriguez",
                category: "career",
                image: "images/About-Me-Image.jpg"
            },
            {
                id: 4,
                title: "Machine Learning for Beginners: Where to Start",
                excerpt: "Demystifying machine learning with practical examples and a clear roadmap for beginners to start their journey in data science and artificial intelligence.",
                author: "David Park",
                category: "data",
                image: "images/About-Us-Image.png"
            },
            {
                id: 5,
                title: "Essential Cybersecurity Skills for 2024",
                excerpt: "Understanding the critical cybersecurity skills needed in today's digital landscape, from cloud security and zero-trust architecture to incident response.",
                author: "Alex Thompson",
                category: "security",
                image: "images/Authentication-Image.jpg"
            },
            {
                id: 6,
                title: "The Psychology Behind Great User Experience",
                excerpt: "Discover how understanding human psychology can help you create more intuitive and engaging user interfaces that truly resonate with your audience.",
                author: "Lisa Wang",
                category: "design",
                image: "images/Banner-Element.png"
            },
            {
                id: 7,
                title: "Mastering AWS: A Complete Guide for Developers",
                excerpt: "Learn how to leverage Amazon Web Services to build scalable, reliable cloud applications with best practices for architecture and deployment.",
                author: "James Wilson",
                category: "cloud",
                image: "images/Course-Categories-Hover-In-Shape.jpg"
            },
            {
                id: 8,
                title: "Flutter vs React Native: Which Framework to Choose?",
                excerpt: "A detailed comparison of the two most popular cross-platform mobile development frameworks to help you make the right choice for your project.",
                author: "Rachel Green",
                category: "mobile",
                image: "images/Inner-Banner-Bg.jpg"
            },
            {
                id: 9,
                title: "Building CI/CD Pipelines with GitHub Actions",
                excerpt: "Step-by-step guide to automating your development workflow with continuous integration and deployment using GitHub Actions.",
                author: "Tom Anderson",
                category: "devops",
                image: "images/Process-Image.jpg"
            }
        ];

        this.renderBlogPosts(placeholderPosts);
    },

    // Handle blog post click
    handlePostClick: function(postId, slug) {
        // Navigate to blog detail page
        // You can implement this based on your routing strategy
        console.log(`Navigating to blog post: ${postId} (${slug})`);
        // window.location.href = `/blog/${slug}`;
    },

    // Utility function to truncate text
    truncateText: function(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    // Generate slug from title
    generateSlug: function(title) {
        if (!title) return '';
        return title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    },

    // Get random image from defaults
    getRandomImage: function() {
        const index = Math.floor(Math.random() * this.config.defaultImages.length);
        return this.config.defaultImages[index];
    },

    // Format category string
    formatCategory: function(category) {
        if (!category) return 'General';
        return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    },

    // Animate blog cards on load
    animateBlogCards: function() {
        const cards = document.querySelectorAll('.main-blog-collection-list-item');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    },

    // Load more posts (pagination)
    loadMorePosts: function() {
        this.config.currentPage++;
        this.loadBlogPosts(this.config.currentPage);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BlogIntegration.init());
} else {
    BlogIntegration.init();
}