// Blog Detail Integration
// Handles loading individual blog posts for blog-detail.html

const BlogDetailIntegration = {
    // Configuration
    config: {
        apiBaseUrl: window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://aistudio555jamstack-production.up.railway.app'
    },

    // Initialize
    init: function() {
        console.log('Initializing blog detail integration...');

        // Get blog post ID and locale from URL
        const urlParams = new URLSearchParams(window.location.search);
        const blogId = urlParams.get('id');
        const locale = urlParams.get('locale') || this.getCurrentLocale();

        if (!blogId) {
            this.showError('No blog post ID provided');
            return;
        }

        // Load the blog post
        this.loadBlogPost(blogId, locale);
    },

    // Get current locale
    getCurrentLocale: function() {
        // Try to get from global language manager first
        if (window.languageManager && window.languageManager.currentLocale) {
            return window.languageManager.currentLocale;
        }

        // Fallback to localStorage
        const savedLocale = localStorage.getItem('preferred_locale');
        if (savedLocale && ['en', 'ru', 'he'].includes(savedLocale)) {
            return savedLocale;
        }

        return 'en'; // Default
    },

    // Load individual blog post
    loadBlogPost: async function(blogId, locale) {
        try {
            console.log(`Loading blog post ${blogId} for locale ${locale}...`);

            const url = `${this.config.apiBaseUrl}/api/blog-posts/${blogId}?locale=${locale}`;
            console.log('Fetching from URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            if (result.success && result.data) {
                this.renderBlogPost(result.data, locale);
            } else {
                throw new Error('Blog post not found');
            }

        } catch (error) {
            console.error('Error loading blog post:', error);
            this.showError('Failed to load blog post');
        }
    },

    // Render blog post content
    renderBlogPost: function(post, locale) {
        console.log('Rendering blog post:', post.title);

        // Hide loading, show content
        document.getElementById('loading').style.display = 'none';
        document.getElementById('blog-content').style.display = 'block';

        // Set page title
        document.title = `${post.title} - AI Studio`;

        // Set RTL for Hebrew
        if (locale === 'he') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'he');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', locale);
        }

        // Render content
        document.getElementById('blog-title').textContent = post.title || 'Untitled';
        document.getElementById('blog-content-body').innerHTML = this.formatContent(post.content || post.excerpt || '');

        // Meta information
        if (post.author) {
            document.getElementById('blog-author').textContent = `By ${post.author}`;
        }

        if (post.published_at || post.created_at) {
            const date = new Date(post.published_at || post.created_at);
            document.getElementById('blog-date').textContent = date.toLocaleDateString(locale === 'he' ? 'he-IL' : locale === 'ru' ? 'ru-RU' : 'en-US');
        }

        if (post.reading_time) {
            const readingTimeText = locale === 'he' ? `${post.reading_time} דקות קריאה` :
                                   locale === 'ru' ? `${post.reading_time} мин чтения` :
                                   `${post.reading_time} min read`;
            document.getElementById('blog-reading-time').textContent = readingTimeText;
        }

        if (post.category) {
            document.getElementById('blog-category').textContent = post.category;
        }

        // Featured image
        if (post.featured_image_url) {
            const featuredImage = document.getElementById('featured-image');
            featuredImage.src = post.featured_image_url;
            featuredImage.alt = post.title;
            featuredImage.style.display = 'block';
        }

        // Tags
        if (post.tags && Array.isArray(post.tags) && post.tags.length > 0) {
            const tagsContainer = document.getElementById('blog-tags');
            tagsContainer.innerHTML = post.tags.map(tag =>
                `<span class="blog-tag">${tag.replace('#', '')}</span>`
            ).join('');
        }

        // Update back to blog link with locale
        const backLink = document.querySelector('.back-to-blog');
        if (backLink) {
            backLink.href = `blog.html?locale=${locale}`;
        }
    },

    // Format blog content
    formatContent: function(content) {
        if (!content) return '';

        // Convert line breaks to paragraphs
        const paragraphs = content.split('\n\n').filter(p => p.trim());

        return paragraphs.map(paragraph => {
            // Simple paragraph formatting
            const trimmed = paragraph.trim();
            if (trimmed.startsWith('# ')) {
                return `<h2>${trimmed.substring(2)}</h2>`;
            } else if (trimmed.startsWith('## ')) {
                return `<h3>${trimmed.substring(3)}</h3>`;
            } else {
                return `<p>${trimmed}</p>`;
            }
        }).join('');
    },

    // Show error message
    showError: function(message) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';

        const errorElement = document.querySelector('#error p');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    BlogDetailIntegration.init();
});

// Make available globally
window.BlogDetailIntegration = BlogDetailIntegration;