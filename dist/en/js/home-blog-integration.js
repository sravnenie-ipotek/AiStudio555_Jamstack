/**
 * Home Page Blog Integration
 *
 * Displays the last 5 blog posts with images in the blog section
 * Integrates with the main blog structure from blog.html
 */

(function() {
    'use strict';

    const HomeBlogIntegration = {
        config: {
            apiBaseUrl: window.location.hostname === 'localhost'
                ? 'http://localhost:1337'
                : 'https://aistudio555jamstack-production.up.railway.app',
            postsToShow: 5,
            defaultImage: '/images/Blog-Image.jpg',
            fallbackImages: [
                '/images/CTA-Section-Bg.jpg',
                '/images/Course-Categories-Content-Bg.jpg',
                '/images/About-Me-Image.jpg',
                '/images/Process-Image.jpg',
                '/images/Inner-Banner-Bg.jpg'
            ]
        },

        // Initialize on DOM ready
        init: function() {
            console.log('🏠 Initializing Home Blog Integration...');

            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.loadBlogPosts());
            } else {
                this.loadBlogPosts();
            }

            // Listen for language changes
            this.setupLanguageListener();
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

                const response = await fetch(`${this.config.apiBaseUrl}/api/blog-posts?locale=${locale}&limit=${this.config.postsToShow}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const posts = await response.json();
                console.log(`✅ Loaded ${posts.length} blog posts`);

                this.renderBlogPosts(posts);
            } catch (error) {
                console.error('❌ Error loading blog posts:', error);
                this.renderFallbackContent();
            }
        },

        // Render blog posts to the DOM
        renderBlogPosts: function(posts) {
            const container = document.querySelector('.blog-bottom-content .blog-collection-list');

            if (!container) {
                console.warn('Blog container not found');
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

            // Remove loading state if exists
            const loadingElement = container.querySelector('.blog-loading');
            if (loadingElement) {
                loadingElement.remove();
            }

            console.log(`🎨 Rendered ${postsToRender.length} blog posts`);
        },

        // Create a blog card element
        createBlogCard: function(post, index) {
            const locale = this.getCurrentLocale();
            const isRTL = locale === 'he';

            // Get image URL
            const imageUrl = this.getPostImage(post, index);

            // Format date
            const date = new Date(post.created_at || post.publishedAt || Date.now());
            const formattedDate = this.formatDate(date, locale);

            // Get category
            const category = post.category || 'AI & Machine Learning';

            // Create card HTML
            const card = document.createElement('div');
            card.className = 'blog-collection-item';
            card.setAttribute('role', 'listitem');

            card.innerHTML = `
                <div class="blog-card" style="${isRTL ? 'direction: rtl;' : ''}">
                    <a href="blog-detail.html?id=${post.id}&locale=${locale}" class="blog-image-link w-inline-block">
                        <img src="${imageUrl}"
                             loading="lazy"
                             alt="${this.escapeHtml(post.title)}"
                             class="blog-post-image"
                             onerror="this.src='${this.config.defaultImage}'"
                             style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px;">
                    </a>
                    <div class="blog-card-typography" style="padding: 20px;">
                        <div class="blog-card-categories-author" style="margin-bottom: 12px;">
                            <div class="blog-card-categories-wrap">
                                <div class="blog-category-tag" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                                    ${this.escapeHtml(category)}
                                </div>
                            </div>
                            <div class="blog-card-author-wrap" style="display: flex; align-items: center; gap: 8px;">
                                <img src="/images/Author-Image.jpg"
                                     alt="Author"
                                     class="blog-author-image"
                                     style="width: 24px; height: 24px; border-radius: 50%;"
                                     onerror="this.style.display='none'">
                                <div class="blog-author-name" style="font-size: 12px; color: #666;">
                                    ${this.escapeHtml(post.author || 'AI Studio Team')}
                                </div>
                            </div>
                        </div>
                        <h3 class="blog-card-title" style="margin-bottom: 12px; font-size: 20px; line-height: 1.3;">
                            <a href="blog-detail.html?id=${post.id}&locale=${locale}"
                               style="color: inherit; text-decoration: none; transition: color 0.3s;"
                               onmouseover="this.style.color='#667eea'"
                               onmouseout="this.style.color='inherit'">
                                ${this.escapeHtml(post.title)}
                            </a>
                        </h3>
                        <p class="blog-card-description" style="color: #666; line-height: 1.6; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                            ${this.escapeHtml(post.excerpt || post.content?.substring(0, 150) || '')}...
                        </p>
                        <div class="blog-card-footer" style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #eee;">
                            <div class="blog-date" style="font-size: 12px; color: #999;">
                                ${formattedDate}
                            </div>
                            <a href="blog-detail.html?id=${post.id}&locale=${locale}"
                               class="blog-read-more"
                               style="color: #667eea; font-size: 14px; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 4px; transition: gap 0.3s;"
                               onmouseover="this.style.gap='8px'"
                               onmouseout="this.style.gap='4px'">
                                ${locale === 'he' ? 'קרא עוד' : locale === 'ru' ? 'Читать далее' : 'Read More'}
                                <span style="transition: transform 0.3s;">${isRTL ? '←' : '→'}</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;

            return card;
        },

        // Get post image with fallbacks
        getPostImage: function(post, index) {
            // Try various image properties
            if (post.image_url) return post.image_url;
            if (post.image) return post.image;
            if (post.featured_image) return post.featured_image;
            if (post.thumbnail) return post.thumbnail;

            // Use fallback images based on index
            return this.config.fallbackImages[index % this.config.fallbackImages.length];
        },

        // Format date based on locale
        formatDate: function(date, locale) {
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            };

            if (locale === 'he') {
                return date.toLocaleDateString('he-IL', options);
            } else if (locale === 'ru') {
                return date.toLocaleDateString('ru-RU', options);
            } else {
                return date.toLocaleDateString('en-US', options);
            }
        },

        // Escape HTML to prevent XSS
        escapeHtml: function(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        // Render fallback content if API fails
        renderFallbackContent: function() {
            const locale = this.getCurrentLocale();
            const container = document.querySelector('.blog-bottom-content .blog-collection-list');

            if (!container) return;

            // Sample fallback posts
            const fallbackPosts = [
                {
                    id: 1,
                    title: locale === 'he' ? 'מדריך למידת למידת מכונה' : locale === 'ru' ? 'Руководство по машинному обучению' : 'Getting Started with Machine Learning',
                    excerpt: locale === 'he' ? 'למידת מכונה היא אחד התחומים המרתקים ביותר בעולם הטכנולוגיה' : locale === 'ru' ? 'Машинное обучение - одна из самых захватывающих областей' : 'Machine learning is one of the most exciting fields in technology',
                    category: 'AI & ML',
                    author: 'AI Studio',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    title: locale === 'he' ? 'פייתון למתחילים' : locale === 'ru' ? 'Python для начинающих' : 'Python for Beginners',
                    excerpt: locale === 'he' ? 'פייתון היא שפת התכנות המושלמת למתחילים' : locale === 'ru' ? 'Python - идеальный язык программирования для начинающих' : 'Python is the perfect programming language for beginners',
                    category: 'Programming',
                    author: 'AI Studio',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 3,
                    title: locale === 'he' ? 'רשתות נוירונים עמוקות' : locale === 'ru' ? 'Глубокие нейронные сети' : 'Deep Neural Networks',
                    excerpt: locale === 'he' ? 'הבנת הארכיטקטורה של רשתות נוירונים' : locale === 'ru' ? 'Понимание архитектуры нейронных сетей' : 'Understanding neural network architecture',
                    category: 'Deep Learning',
                    author: 'AI Studio',
                    created_at: new Date(Date.now() - 172800000).toISOString()
                },
                {
                    id: 4,
                    title: locale === 'he' ? 'עיבוד שפה טבעית' : locale === 'ru' ? 'Обработка естественного языка' : 'Natural Language Processing',
                    excerpt: locale === 'he' ? 'NLP מאפשר למחשבים להבין שפה אנושית' : locale === 'ru' ? 'NLP позволяет компьютерам понимать человеческий язык' : 'NLP enables computers to understand human language',
                    category: 'NLP',
                    author: 'AI Studio',
                    created_at: new Date(Date.now() - 259200000).toISOString()
                },
                {
                    id: 5,
                    title: locale === 'he' ? 'ראייה ממוחשבת' : locale === 'ru' ? 'Компьютерное зрение' : 'Computer Vision',
                    excerpt: locale === 'he' ? 'איך מחשבים לומדים לראות ולהבין תמונות' : locale === 'ru' ? 'Как компьютеры учатся видеть и понимать изображения' : 'How computers learn to see and understand images',
                    category: 'Computer Vision',
                    author: 'AI Studio',
                    created_at: new Date(Date.now() - 345600000).toISOString()
                }
            ];

            this.renderBlogPosts(fallbackPosts);
        }
    };

    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => HomeBlogIntegration.init());
    } else {
        HomeBlogIntegration.init();
    }

    // Expose globally for debugging
    window.HomeBlogIntegration = HomeBlogIntegration;

})();