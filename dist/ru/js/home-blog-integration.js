/**
 * Home Page Blog Integration
 *
 * Displays the last 5 blog posts in a horizontal row using existing Webflow classes
 */

(function() {
    'use strict';

    const HomeBlogIntegration = {
        config: {
            apiBaseUrl: window.location.hostname === 'localhost'
                ? 'http://localhost:3000'
                : 'https://aistudio555jamstack-production.up.railway.app',
            postsToShow: 5,
            defaultImage: 'images/About-Me-Image.jpg',
            fallbackImages: [
                'images/CTA-Section-Bg.jpg',
                'images/Course-Categories-Content-Bg.jpg',
                'images/About-Me-Image.jpg',
                'images/About-Us-Image.png',
                'images/Authentication-Image.jpg'
            ]
        },

        // Initialize on DOM ready
        init: function() {
            console.log('🏠 Initializing Home Blog Integration...');

            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupBlogSection());
            } else {
                this.setupBlogSection();
            }

            // Listen for language changes
            this.setupLanguageListener();
        },

        // Setup the blog section
        setupBlogSection: function() {
            // Find the blog bottom content container
            const blogBottomContent = document.querySelector('.blog-bottom-content');

            if (!blogBottomContent) {
                console.warn('Blog bottom content container not found');
                return;
            }

            // Clear the existing Webflow slider structure
            blogBottomContent.innerHTML = '';

            // Create a container for blog cards with flex layout
            const blogContainer = document.createElement('div');
            blogContainer.className = 'blog-cards-container';

            // Add loading indicator
            blogContainer.innerHTML = `
                <div class="blog-loading" style="width: 100%; text-align: center; padding: 40px;">
                    <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(102, 126, 234, 0.2); border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                </div>
            `;

            blogBottomContent.appendChild(blogContainer);

            // Load blog posts
            this.loadBlogPosts();
        },

        // Get current locale
        getCurrentLocale: function() {
            // Check URL parameter
            const params = new URLSearchParams(window.location.search);
            const locale = params.get('locale');
            if (locale && ['en', 'ru', 'he'].includes(locale)) {
                return locale;
            }

            // Check language manager
            if (window.languageManager && window.languageManager.currentLocale) {
                return window.languageManager.currentLocale;
            }

            // Check localStorage
            const savedLocale = localStorage.getItem('preferred_locale');
            if (savedLocale && ['en', 'ru', 'he'].includes(savedLocale)) {
                return savedLocale;
            }

            // Check HTML lang attribute
            const htmlLang = document.documentElement.lang;
            if (htmlLang === 'he' || htmlLang === 'ru') {
                return htmlLang;
            }

            return 'en';
        },

        // Setup language change listener
        setupLanguageListener: function() {
            window.addEventListener('languageChanged', (event) => {
                console.log('🌍 Language changed, reloading blog posts...');
                setTimeout(() => this.loadBlogPosts(), 300);
            });
        },

        // Load blog posts from API
        loadBlogPosts: async function() {
            try {
                const locale = this.getCurrentLocale();
                console.log(`📚 Loading blog posts for locale: ${locale}`);

                const response = await fetch(`${this.config.apiBaseUrl}/api/blog-posts?locale=${locale}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                // Handle different response structures
                let posts = [];
                if (result.success && result.data) {
                    posts = result.data;
                } else if (Array.isArray(result)) {
                    posts = result;
                }

                console.log(`✅ Loaded ${posts.length} blog posts`);

                if (posts.length > 0) {
                    this.renderBlogPosts(posts);
                } else {
                    this.renderFallbackContent();
                }
            } catch (error) {
                console.error('❌ Error loading blog posts:', error);
                this.renderFallbackContent();
            }
        },

        // Render blog posts to the DOM
        renderBlogPosts: function(posts) {
            const container = document.querySelector('.blog-cards-container');

            if (!container) {
                console.warn('Blog cards container not found');
                return;
            }

            // Clear existing content
            container.innerHTML = '';

            // Limit to 5 posts
            const postsToRender = posts.slice(0, this.config.postsToShow);

            postsToRender.forEach((post, index) => {
                const postElement = this.createBlogCard(post, index);
                container.appendChild(postElement);
            });

            console.log(`🎨 Rendered ${postsToRender.length} blog posts`);

            // Add animation
            this.animateBlogCards();
        },

        // Create a blog card element using existing Webflow structure
        createBlogCard: function(post, index) {
            const locale = this.getCurrentLocale();
            const isRTL = locale === 'he';

            // Get image URL with fallback
            const imageUrl = this.getPostImage(post, index);

            // Get category
            const category = this.getCategory(post.category, locale);

            // Get translations
            const readMore = this.getReadMoreText(locale);

            // Clean and prepare content
            const title = this.cleanText(post.title || 'Untitled');
            const author = this.cleanText(post.author || 'AI Studio Team');
            const excerpt = this.cleanText(post.excerpt || post.description || post.content?.substring(0, 150) || '');

            // Create proper blog detail URL
            const detailUrl = `blog-detail.html?id=${post.id}&locale=${locale}`;

            // Create card using existing Webflow blog-card structure
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

            card.innerHTML = `
                <a href="${detailUrl}" class="blog-image-link w-inline-block">
                    <img src="${imageUrl}"
                         loading="lazy"
                         alt="${this.escapeHtml(title)}"
                         class="blog-post-image"
                         onerror="this.onerror=null; this.src='${this.config.defaultImage}';">
                </a>
                <div class="blog-card-typography">
                    <div class="blog-card-categories-author">
                        <div class="blog-card-categories-wrap">
                            <div class="blog-card-categories-flex">
                                <div class="blog-card-categories-circel"></div>
                                <div class="blog-card-categories-name">${this.escapeHtml(category)}</div>
                            </div>
                        </div>
                        <div class="blog-card-author-name-icon">
                            <img src="images/Blog-Card-Author-Icon.svg"
                                 loading="lazy"
                                 alt=""
                                 class="blog-card-author-icon"
                                 onerror="this.style.display='none'">
                            <div class="blog-card-author-name">${this.escapeHtml(author)}</div>
                        </div>
                    </div>
                    <div class="blog-card-name-wrapper">
                        <a href="${detailUrl}" class="blog-card-name">
                            ${this.escapeHtml(title)}
                        </a>
                    </div>
                    <div class="blog-card-line"></div>
                    <p class="blog-post-description-text">
                        ${this.escapeHtml(excerpt)}${excerpt.length > 0 ? '...' : ''}
                    </p>
                    <div class="blog-card-link-wrap">
                        <a href="${detailUrl}" class="blog-card-link w-inline-block">
                            <div class="blog-card-link-text">${readMore}</div>
                            <div class="blog-card-link-arrow"></div>
                        </a>
                    </div>
                </div>
            `;


            return card;
        },

        // Get post image with fallbacks
        getPostImage: function(post, index) {
            // Try various image properties
            if (post.image_url && !post.image_url.includes('placeholder')) return post.image_url;
            if (post.image && !post.image.includes('placeholder')) return post.image;
            if (post.featured_image && !post.featured_image.includes('placeholder')) return post.featured_image;
            if (post.thumbnail && !post.thumbnail.includes('placeholder')) return post.thumbnail;

            // Use fallback images based on index
            return this.config.fallbackImages[index % this.config.fallbackImages.length];
        },

        // Get category based on locale
        getCategory: function(category, locale) {
            const categories = {
                'ai': {
                    'en': 'AI & ML',
                    'ru': 'ИИ и МО',
                    'he': 'AI ולמידת מכונה'
                },
                'web': {
                    'en': 'Web Dev',
                    'ru': 'Веб-разработка',
                    'he': 'פיתוח אתרים'
                },
                'programming': {
                    'en': 'Programming',
                    'ru': 'Программирование',
                    'he': 'תכנות'
                },
                'data': {
                    'en': 'Data Science',
                    'ru': 'Наука о данных',
                    'he': 'מדע הנתונים'
                },
                'career': {
                    'en': 'Career',
                    'ru': 'Карьера',
                    'he': 'קריירה'
                }
            };

            const catKey = (category || 'ai').toLowerCase();
            if (categories[catKey]) {
                return categories[catKey][locale] || categories[catKey]['en'];
            }

            // Format unknown category
            return category ?
                   category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ') :
                   'General';
        },

        // Get read more text based on locale
        getReadMoreText: function(locale) {
            const translations = {
                'en': 'Read this Article',
                'ru': 'Читать статью',
                'he': 'קרא מאמר זה'
            };
            return translations[locale] || translations['en'];
        },

        // Clean text from template variables
        cleanText: function(text) {
            if (!text) return '';
            // Remove template variables like {{title}}
            return text.replace(/\{\{.*?\}\}/g, '').trim();
        },

        // Escape HTML to prevent XSS
        escapeHtml: function(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        // Animate blog cards on load
        animateBlogCards: function() {
            const cards = document.querySelectorAll('.blog-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        },

        // Render fallback content if API fails
        renderFallbackContent: function() {
            const locale = this.getCurrentLocale();

            // Sample fallback posts
            const fallbackPosts = [
                {
                    id: 1,
                    title: locale === 'he' ? 'העתיד של AI בחינוך' : locale === 'ru' ? 'Будущее ИИ в образовании' : 'The Future of AI in Education',
                    excerpt: locale === 'he' ? 'כיצד בינה מלאכותית משנה את דרך הלמידה שלנו' : locale === 'ru' ? 'Как искусственный интеллект меняет наше обучение' : 'How artificial intelligence is transforming the way we learn',
                    category: 'ai',
                    author: 'Sarah Chen',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    title: locale === 'he' ? 'מגמות פיתוח אתרים 2024' : locale === 'ru' ? 'Тренды веб-разработки 2024' : 'Web Development Trends 2024',
                    excerpt: locale === 'he' ? 'הטרנדים החמים ביותר בפיתוח אתרים השנה' : locale === 'ru' ? 'Самые горячие тренды в веб-разработке этого года' : 'The hottest web development trends this year',
                    category: 'web',
                    author: 'Mike Johnson',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 3,
                    title: locale === 'he' ? '5 צעדים למעבר מוצלח להייטק' : locale === 'ru' ? '5 шагов для успешного перехода в IT' : '5 Steps to Successfully Transition into Tech',
                    excerpt: locale === 'he' ? 'המדריך המלא למי שרוצה להיכנס לעולם ההייטק' : locale === 'ru' ? 'Полное руководство для тех, кто хочет войти в IT' : 'Complete guide for those looking to enter the tech world',
                    category: 'career',
                    author: 'Emily Rodriguez',
                    created_at: new Date(Date.now() - 172800000).toISOString()
                },
                {
                    id: 4,
                    title: locale === 'he' ? 'למידת מכונה למתחילים' : locale === 'ru' ? 'Машинное обучение для начинающих' : 'Machine Learning for Beginners',
                    excerpt: locale === 'he' ? 'המדריך המושלם להתחלת המסע בלמידת מכונה' : locale === 'ru' ? 'Идеальное руководство для начала путешествия в машинное обучение' : 'The perfect guide to start your machine learning journey',
                    category: 'data',
                    author: 'David Park',
                    created_at: new Date(Date.now() - 259200000).toISOString()
                },
                {
                    id: 5,
                    title: locale === 'he' ? 'Python - השפה המושלמת למתחילים' : locale === 'ru' ? 'Python - идеальный язык для начинающих' : 'Python - The Perfect Language for Beginners',
                    excerpt: locale === 'he' ? 'למה Python היא הבחירה הטובה ביותר ללימוד תכנות' : locale === 'ru' ? 'Почему Python - лучший выбор для изучения программирования' : 'Why Python is the best choice for learning programming',
                    category: 'programming',
                    author: 'Lisa Wang',
                    created_at: new Date(Date.now() - 345600000).toISOString()
                }
            ];

            this.renderBlogPosts(fallbackPosts);
        }
    };

    // Initialize when ready
    HomeBlogIntegration.init();

    // Expose globally for debugging
    window.HomeBlogIntegration = HomeBlogIntegration;

})();